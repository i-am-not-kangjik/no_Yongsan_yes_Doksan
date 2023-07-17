import pandas as pd
import numpy as np
import psycopg2
import logging
import pytz
import pickle
from sklearn.preprocessing import MinMaxScaler
from joblib import load
import boto3
from sqlalchemy import create_engine
from airflow.hooks.postgres_hook import PostgresHook
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.hooks.S3_hook import S3Hook
from datetime import datetime, timedelta
from plugins import slack


def postgresql_connector():
    postgresql_hook = PostgresHook(postgres_conn_id="Postgres_RDS")
    conn = postgresql_hook.get_conn()
    cur = conn.cursor()
    return conn, cur

def loading_df():
    postgres_hook = PostgresHook(postgres_conn_id="Postgres_RDS")
    conn = postgres_hook.get_conn()

    # SQLAlchemy의 엔진 객체 생성
    engine = create_engine(postgres_hook.get_uri())

    sql = """
    SELECT 	cp.price 
        ,	pg.grade 
        ,	cp.favoritecount 
        ,	cp.viewcount 
        ,	p2.screen_size 
        ,	pcc."cost" 
        ,	pcc.capacity 
        ,	p2.ram 
        ,	p2.weight 
        ,	p2.max_video_playtime 
        ,	p2.max_audio_playtime 
        ,	p.battery_capacity 
        ,	cp.hours 
        ,	p.release_year 
        ,	cp.crawling
        ,   cp.id as phone_crwaling_id
    FROM product.crwaling_phone cp 
    LEFT JOIN product.product_grade pg 
    ON cp.grade_id = pg.grade_id 
    LEFT JOIN product.product p 
    ON pg.product_id = p.id
    LEFT JOIN product.phone_capacity_cost pcc 
    ON cp.phone_cost_id = pcc.id 
    LEFT JOIN product.phone p2 
    ON pcc.product_id = p2.product_id 
    WHERE 	cp.price IS NOT NULL
        AND pg.grade IS NOT NULL
        AND cp.favoritecount IS NOT NULL
        AND cp.viewcount IS NOT NULL
        AND p2.screen_size IS NOT NULL
        AND pcc."cost" IS NOT NULL
        AND pcc.capacity IS NOT NULL
        AND p2.ram IS NOT NULL
        AND p2.weight IS NOT NULL
        AND p2.max_video_playtime IS NOT NULL
        AND p2.max_audio_playtime IS NOT NULL
        AND p.battery_capacity IS NOT NULL
        AND cp.hours IS NOT NULL;
    """

    # SQL 쿼리 실행 후 DataFrame으로 저장
    df = pd.read_sql_query(sql, engine)

    return df

def convert_as_used_year(df):
    '''
    2023년 대비 년식을 구하는 함수
    '''
    df = df.fillna(0)
    df['used_year'] = df['release_year'].apply(lambda x: 2023 - x)

    return df

def modeling_Preprocessor(df):
    # 로그 변환 전 준비
    # 0인 데이터에 0.001 추가하기 (최대한 데이터 손상을 막기 위해)
    columns_to_update = ['favoritecount', 'viewcount', 'used_year']
    
    # 각 열에 0.001 더하기
    for column in columns_to_update:
        df[column] = df[column].apply(lambda x: x + 0.001)
    return df  # DataFrame 반환

def log_transform(df):
    '''
    로그 변환이 적용된 데이터프레임을 반환하는 함수
    price 종속변수 제외
    '''
    # 수치형 데이터만 선택
    num_cols = df.select_dtypes(include=[np.number]).columns
    exclude_columns = ['price', 'phone_crwaling_id']
    for column in num_cols:
        if column not in exclude_columns:
            filtered = df[column][df[column] > 0] 
            df[column] = np.log(filtered) 
    
    # price 컬럼을 int로 변환
    df['price'] = df['price'].astype(int)
    
    return df  # DataFrame 반환

def get_minmax_scaler(df, exclude_columns=['price','phone_crwaling_id']):
    '''
    price(종속변수) 열을 제외한 스케일링 함수
    '''
    scaler = MinMaxScaler()
    scaled_df = df.copy()

    for column in df.select_dtypes(include=[np.number]).columns:
        if column not in exclude_columns: 
            scaled_values = scaler.fit_transform(scaled_df[[column]])  
            scaled_df[column] = scaled_values  
    return scaled_df  # DataFrame 반환


# 등급 변환
def extract_and_map_quality(df):
    # 등급 점수화
    quality_mapping = {
        '미개봉': 5,
        'S': 4,
        'A': 3,
        'B': 2,
        'C': 1,
    }
    df['grade'] = df['grade'].map(quality_mapping)
    return df

# 조회수, 찜(좋아요) 가중치
def normalize_viewcount_favoritecount(df):
    '''
    웹페이지 사용자 수를 기준으로 'viewcount'와 'favoritecount' 열을 정규화하는 함수
    '''
    user_site = {
        0: 4640000,  # 당근마켓
        2: 490000,   # 번개장터
        1: 120000,   # 중고나라
    }

    for site, user_count in user_site.items():
        df.loc[df['crawling'] == site, 'viewcount'] /= user_count
        df.loc[df['crawling'] == site, 'favoritecount'] /= user_count

    # nan 값은 0으로 변환
    df['viewcount'].fillna(0, inplace=True)
    df['favoritecount'].fillna(0, inplace=True)
    return df


def model(*args, **kwargs):
    current_time = datetime.now(pytz.timezone('Asia/Seoul')).strftime("%Y%m%d")
    bucket = 'doksan-data'
    save_key = f'model_result/model_result_{current_time}.csv'

    # S3 버킷 연결
    s3_hook = S3Hook(bucket)

    # 데이터 전처리
    df = loading_df()
    df = convert_as_used_year(df)
    df = modeling_Preprocessor(df)
    df = log_transform(df)
    df = get_minmax_scaler(df)
    df = extract_and_map_quality(df)
    df = normalize_viewcount_favoritecount(df)
    df['capacity'] = df['capacity'].astype(float)
    df['hours'] = df['hours'].astype(float)

    #모델 불러오기
    with open('/var/lib/airflow/dags/model/remove_camera_XGBRegressor_best_model.pkl', 'rb') as f:
        model = pickle.load(f)

    # 모델실행 
    # 입력 데이터의 특성 이름 변경
    df.rename(columns={'max_video_playtime': 'Max_video_playtime', 'max_audio_playtime': 'Max_audio_playtime','grade' : 'quality'}, inplace=True)

    # x 특성
    X = df[["quality", "favoritecount", "viewcount", "screen_size", "cost", "capacity", "ram", "weight", "Max_video_playtime", "Max_audio_playtime", "battery_capacity", "hours", "used_year"]]

    # 예측 수행
    predictions = model.predict(X)

    df['prediction'] = predictions

    # 전처리된 데이터를 S3에 저장
    s3_hook.load_string(
        string_data=df.to_csv(index=False),
        key=save_key,
        bucket_name=bucket,
        replace=True
    )
    
    # DB 저장
    logging.info(df)
    conn, cur = postgresql_connector()
    for index, row in df.iterrows():
        insert_sql = f'''
            INSERT INTO product.phone_model_results
            (phone_crwaling_id, model_result)
            VALUES (%s, %s);
        '''
        params = (row['phone_crwaling_id'], row['prediction'])
        try:
            cur.execute(insert_sql, params)
        except Exception as e:
            logging.error(f"Error inserting data: {str(e)}")

    conn.commit()
    conn.close()

dag = DAG(
    dag_id='model',
    start_date=datetime(2023, 7, 3, 0, 0, 0),
    schedule_interval=None,  # 스케줄없음
    on_failure_callback =  slack.on_failure_callback
)

model_task = PythonOperator(
    task_id='model',
    python_callable=model,
    dag=dag
)

model_task
