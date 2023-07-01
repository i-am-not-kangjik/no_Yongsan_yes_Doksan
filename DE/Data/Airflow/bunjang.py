from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.hooks.S3_hook import S3Hook
from datetime import datetime, timedelta
from plugins import slack
import pandas as pd
import requests
import time
import re
import pytz
import os
import logging

def get_product_detail(pid, key_word):
    url = f'https://api.bunjang.co.kr/api/pms/v1/products-detail/{pid}?viewerUid=-1'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json().get('data', {}).get('product', {})
        metrics = data.get('metrics', {})
        geo = data.get('geo', {})
        return {
            'pid': data.get('pid', ''),
            'name': data.get('name', ''),
            'description': data.get('description', ''),
            'price': data.get('price', ''),
            'time': data.get('updatedBefore', ''),
            'favoriteCount': metrics.get('favoriteCount', 0),
            'viewCount': metrics.get('viewCount', 0),
            'imageUrl': data.get('imageUrl', ''),
            'keywords': data.get('keywords', ''),
            'address': geo.get('address', ''),
            'keyword': key_word,
            'crwaling': '번개장터',
        }
    else:
        print(f'Request to {url} returned status code {response.status_code}')
        return None

def bunjang(key_word):
    data = []
    items_number = 100

    url = f'https://api.bunjang.co.kr/api/1/find_v2.json?order=date&n={items_number}&page=1&req_ref=search&q={key_word}&stat_device=w&stat_category_required=1&version=4'
    response = requests.get(url)
    datas = response.json().get('list', [])

    for piddata in datas:
        pid = piddata['pid']
        detail_data = get_product_detail(pid, key_word)

        if detail_data is not None:
            data.append(detail_data) 

    df = pd.DataFrame(data)

    return df


def extract(**context):
    try :
        keyword_list = ['아이폰','갤럭시','플립']
        data = []
        
        for key_word in keyword_list:
            df = bunjang(key_word)
            data.append(df)

        # 모든 데이터프레임을 하나로 합칩니다.
        final_df = pd.concat(data, ignore_index=True)

        # S3 버킷 연결
        bucket = 'doksan-data'
        s3_hook = S3Hook(bucket)
        
        # 데이터를 CSV 파일로 저장
        # 현재 시간을 이용해 파일명 생성
        current_time = datetime.now(pytz.timezone('Asia/Seoul')).strftime("%Y%m%d")
        filename = f'/var/lib/airflow/data/번개장터_{current_time}.csv'
        final_df.to_csv(filename, index=False)

        # S3로 파일 업로드
        # 동일하게 현재 시간을 이용해 S3 key 생성
        s3_key = f'bunjang/번개장터_{current_time}.csv'
        s3_hook.load_file(filename=filename, key=s3_key, bucket_name=bucket)

        logging.info("Upload to S3 done")

        # 로컬 파일 삭제
        os.remove(filename)
        logging.info("Extraction is done.")

        # S3 key를 반환합니다.
        return s3_key

    except Exception as e:
        logging.error('An error occurred : %s', e)
        raise

dag = DAG(
    dag_id='bunjang',
    start_date=datetime(2023, 6, 26, 6, 0, 0),  # UTC 기준으로 6월 25일 6시로 설정
    schedule_interval="@daily",
    max_active_runs=1,
    catchup=False,
    default_args = {
        # 'retries': 1,
        # 'retry_delay': timedelta(minutes=1),
        'on_failure_callback': slack.on_failure_callback
    },
)

extract_task = PythonOperator(
    task_id='extract',
    python_callable=extract,
    provide_context=True,
    do_xcom_push=True,
    dag=dag
)


extract_task
