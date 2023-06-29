import pandas as pd
import numpy as np
import re
from phone_CrawlingDataPreprocessor import DataPreprocessor
from phone_CrawlingDataPreprocessor import modeling_processing
from phone_CrawlingDataPreprocessor import remove_y
import numpy as np
import pickle
import math

class seller_data_processor:
    '''
    # 판매자가 입력할 텍스트 데이터 : 제품명(product_name), 사양(capacity)
    # 사진을 통해 등급 데이터가 텍스트로 들어온다는 가정 : 등급(quality)
    '''
    def __init__(self, product_name, capacity, quality):
        self.product_name = product_name
        self.capacity = capacity
        self.quality = quality

        self.min_price = None
        self.max_price = None
        self.predicted_price = None

    def basic_adding(self):
        # 데이터프레임 형성
        self.new_seller_df = pd.DataFrame(columns = ['product_name','quality', 'favoritecount', 'viewcount', 'release_year','screen_size', 'cost', 'capacity', 'ram', 'weight', 'Max_video_playtime', 'Max_audio_playtime', 'battery_capacity', 'time'])

        # 데이터프레임에 행 추가
        new_row = pd.DataFrame({
            'product_name': [self.product_name],
            'quality': [self.quality],
            'favoritecount': [None],
            'viewcount': [None],
            'release_year': [None],
            'screen_size': [None],
            'cost': [None],
            'capacity': [self.capacity],
            'ram': [None],
            'weight': [None],
            'Max_video_playtime': [None],
            'Max_audio_playtime': [None],
            'battery_capacity': [None],
            'time': ['3분 전']
        })

        self.new_seller_df = pd.concat([self.new_seller_df, new_row], ignore_index=True)




        # 각 열에 값 할당
        self.new_seller_df['product_name'] = self.product_name
        self.new_seller_df['capacity'] = self.capacity
        self.new_seller_df['quality'] = self.quality

        # time은 기본 "3분 전"으로 입력
        self.new_seller_df['time'] = '3분 전'

    # 사양 연결
    def map_phone_info(self):    
        # capacity 열 타입 변환(object -> int)
        self.new_seller_df['capacity'] = self.new_seller_df['capacity'].astype(int)
        
        # product_name, capacity 기준으로 사양들 맵핑
        phone_info = pd.read_csv('phone_info_v2.csv')
        phone_info = phone_info.drop_duplicates(subset=['product', 'capacity'])
        
        # product, capacity 열을 인덱스로 설정
        phone_info = phone_info.set_index(['product', 'capacity']) 

        # new_seller_df의 각 열을 phone_info 데이터프레임을 사용하여 업데이트
        for col in ['release_year', 'screen_size', 'weight', 'Max_video_playtime',
                    'Max_audio_playtime', 'battery_capacity', 'ram', 'cost']:
            
            # 'product_name'과 'capacity' 열을 zip으로 묶어서 매핑
            self.new_seller_df[col] = list(map(lambda x: phone_info.loc[(x[0], x[1]), col] 
                                            if (x[0], x[1]) in phone_info.index else np.nan, 
                                            zip(self.new_seller_df['product_name'], self.new_seller_df['capacity'])))

    # 시간 통일화
    def assign_h_time(self):
        '''
         time 열을 시간 단위로 통일화하여 hours 열에 할당
         실제 실행될 때 크롤링 일자가 모두 동일하다는 가정 하에 진행한 코드입니다.
        '''
        self.new_seller_df['hours'] = np.nan
        self.new_seller_df['hours'] = self.new_seller_df['time'].str.extract('(\d+)\s*시간', expand=False).astype(float)
        self.new_seller_df.loc[self.new_seller_df['time'].str.contains('분'), 'hours'] = self.new_seller_df['time'].str.extract('(\d+)\s*분', expand=False).astype(float) / 60
        self.new_seller_df.loc[self.new_seller_df['time'].str.contains('일'), 'hours'] = self.new_seller_df['time'].str.extract('(\d+)\s*일', expand=False).astype(float) * 24
        self.new_seller_df.loc[self.new_seller_df['time'].str.contains('달'), 'hours'] = self.new_seller_df['time'].str.extract('(\d+)\s*달', expand=False).astype(float) * 720
        self.new_seller_df.loc[self.new_seller_df['time'].str.contains('년'), 'hours'] = self.new_seller_df['time'].str.extract('(\d+)\s*년', expand=False).astype(float) * 8640
        self.new_seller_df.drop(['time'], axis=1, inplace=True)

    # 출시 년도 -> 년식으로 변경
    def convert_as_used_year(self):
        '''
        2023년 대비 년식을 구하는 함수
        '''
        self.new_seller_df['used_year'] = self.new_seller_df['release_year'].apply(lambda x: 2023 - x)
        
        # release_year 열 삭제
        self.new_seller_df.drop(['release_year'], axis=1, inplace=True)

    # 등급 변환
    def extract_and_map_quality(self):
        # 등급 점수화
        quality_mapping = {
            '미개봉': 5,
            'S급': 4,
            'A급': 3,
            'B급': 2,
            'C급': 1,
        }
        self.new_seller_df['quality'] = self.new_seller_df['quality'].map(quality_mapping)

    # favoritecount와 viewcount의 평균 업데이트 + min, max price 정의
    def calculate_avg_fav_and_view(self):
        '''
        모든 판매자의 조회수와 좋아요 -> 중고사이트의 평균으로 계산해서 데이터에 추가

        # 매일 업데이트되는 크롤링 데이터에서 전처리 진행 + 스케일링 진행한 데이터에서
        # favoritecount와 viewcount의 평균을 계산하여 avg_info_df 생성
        '''
        # 전처리만 진행한 df 불러오기 
        prepro = DataPreprocessor("./phone_input_data.csv")
        origin_df = prepro.execute()
        merged_df = origin_df[['product_name', 'capacity']]

        # 기종별, 용량별, 품질별 가격 분포 (평균, 최소, 최대) # 이 내용이 db에 저장되면 코드 수정
        pd.set_option('display.float_format', '{:.2f}'.format)
        price_stats = origin_df.groupby(['product_name', 'capacity', 'quality'])['price'].agg(['min', 'max'])

        price_stats = price_stats.reset_index()
        # 등급 값 추출
        quality_value = self.new_seller_df['quality'].values[0]     

        # min_price, max_price 값 추출
        filtered_stats = price_stats[(price_stats['product_name'] == self.product_name) & 
                             (price_stats['capacity'] == self.capacity) &
                             (price_stats['quality'] == quality_value)]

        if not filtered_stats.empty:
            self.min_price = filtered_stats['min'].values[0]
            self.max_price = filtered_stats['max'].values[0]
        else:
            # 조건을 만족하는 데이터가 없을 경우 처리할 내용 추가
            self.min_price = np.nan
            self.max_price = np.nan
        
        # 스케일링 진행한 df 불러오기
        scaled = modeling_processing(origin_df)
        scaled_origin_df = scaled.execute()
        
        # favoritecount와 viewcount의 평균 (스케일링 전의 df(pre_merged_df)기준으로 groupby 진행 후 scaled_origin_df의 찜, 조회수의 평균 필요)
        # 두 데이터프레임 병합
        merged_df['favoritecount'] = scaled_origin_df['favoritecount']
        merged_df['viewcount'] = scaled_origin_df['viewcount']

        # # 병합된 데이터프레임에서 그룹바이를 수행하고 평균을 계산
        avg_info = merged_df.groupby(['product_name', 'capacity'])[['favoritecount', 'viewcount']].mean().reset_index()
        avg_info.columns = ['product_name', 'capacity', 'favoritecount_avg', 'viewcount_avg']

        # 딕셔너리 생성
        fav_avg_dict = pd.Series(avg_info.favoritecount_avg.values, index=[avg_info.product_name, avg_info.capacity]).to_dict()
        view_avg_dict = pd.Series(avg_info.viewcount_avg.values, index=[avg_info.product_name, avg_info.capacity]).to_dict()

        # seller_df (판매자 데이터)에 평균 대입
        self.new_seller_df['favoritecount'] = self.new_seller_df.set_index(['product_name', 'capacity']).index.map(fav_avg_dict)
        self.new_seller_df['viewcount'] = self.new_seller_df.set_index(['product_name', 'capacity']).index.map(view_avg_dict)

    # 타입 변환
    def change_data_type(self):
        self.new_seller_df['cost'] = self.new_seller_df['cost'].str.replace(',', '').astype(int)
        self.new_seller_df['ram'] = self.new_seller_df['ram'].astype(int)
        self.new_seller_df['weight'] = self.new_seller_df['weight'].astype(float)
        self.new_seller_df['Max_video_playtime'] = self.new_seller_df['Max_video_playtime'].astype(int)
        self.new_seller_df['Max_audio_playtime'] = self.new_seller_df['Max_audio_playtime'].astype(int)
        self.new_seller_df['battery_capacity'] = self.new_seller_df['battery_capacity'].str.replace(',', '').astype(int)

    def modeling_Preprocessor(self):
        # product_name 열 삭제
        self.new_seller_df.drop(['product_name'], axis=1, inplace=True)

        # 로그 변환 전 준비 : used_year 열에 0.001 더하기
        # 0인 데이터에 0.001 추가하기 (최대한 데이터 손상을 막기 위해) 
        self.new_seller_df['used_year'] = self.new_seller_df['used_year'].apply(lambda x: x + 0.001)

        # 로그 변환
        def log_transform(dataframe, columns):
            '''
            데이터프레임과 컬럼을 인자로 받아서
            로그 변환이 적용된 데이터프레임을 반환하는 함수
            # price 종속변수 제외
            '''
            for column in columns:
                if column not in ['favoritecount', 'viewcount']: 
                    filtered = dataframe[column][dataframe[column] > 0] # filter out negative or zero values
                    dataframe[column] = np.log(filtered) # apply log transformation
            return dataframe

        self.new_seller_df = log_transform(self.new_seller_df, self.new_seller_df.columns)

        # 정규화
        def get_minmax_scaler(scaled_df, exclude_columns=['favoritecount', 'viewcount']): 
            '''
            단일행일 때는 정규화 불가능 
            => 모델 학습할 때 Train된 minmaxscaler 불러오기
            '''
            import joblib
            # MinMaxScaler 객체 불러오기
            loaded_scaler = joblib.load('scaler.pkl')

            for column in scaled_df.columns:
                if column not in exclude_columns: 
                    # 해당 열의 스케일러를 가져옴
                    scaler = loaded_scaler[column]
                    # nan값 제거 시 
                    if len(scaled_df[[column]].dropna()) > 0:
                        scaled_values = scaler.transform(scaled_df[[column]])  # Scale the values
                        scaled_df[column] = scaled_values  # Assign the scaled values back to the dataframe

            return scaled_df

        self.new_seller_df = get_minmax_scaler(self.new_seller_df)
    
    def load_no_scaling_price_prdict_model(self):
        # XGBoost 모델 파일 불러오기
        with open('remove_camera_XGBRegressor_best_model.pkl', 'rb') as f:
            loaded_model = pickle.load(f)

        # 예측 수행
        self.predicted_price = loaded_model.predict(self.new_seller_df)

        # NumPy 배열을 스칼라 값으로 변환
        self.predicted_price = self.predicted_price.item()  

        # 소수점 이하를 버리고 십원(두 번째 자리)까지의 값을 얻음
        formatted_price = "{:.0f}".format(self.predicted_price)
        formatted_price = formatted_price[:-2] + "00"

        self.predicted_price = formatted_price

    def generate_result_string(self):
        import math
        if math.isnan(self.min_price) or math.isnan(self.max_price):
            result_string = f"판매자님이 전달해주신 사진을 확인한 결과, 제품의 등급은 {self.quality}입니다.\n"
            result_string += f"{self.product_name} {self.capacity}기가 {self.quality} 등급은 오늘 기준으로 판매상품이 아직 없는 것으로 확인되었습니다.\n"
            result_string += f"이를 바탕으로 중고사이트의 판매가에 대한 AI 가격 예측 결과는 {self.predicted_price}원입니다."        
        else :
            result_string = f"판매자님이 전달해주신 사진을 확인한 결과, 제품의 등급은 {self.quality}입니다.\n"
            result_string += f"{self.product_name} {self.capacity}기가 {self.quality} 등급은 오늘 기준으로 최소 판매가 {self.min_price}원, 최대 판매가 {self.max_price}원입니다.\n"
            result_string += f"이를 바탕으로 중고사이트의 판매가에 대한 AI 가격 예측 결과는 {self.predicted_price}원입니다."
        
        return result_string
    
    def generate_result_dict(self):
        if self.min_price is None or self.max_price is None or math.isnan(self.min_price) or math.isnan(self.max_price):
            result_dict = {
                "product_name": self.product_name,
                "capacity": self.capacity,
                "quality": self.quality,
                "min_price": None,
                "max_price": None,
                "predicted_price": int(self.predicted_price) if self.predicted_price else None
            }
        else :
            result_dict = {
                "product_name": self.product_name,
                "capacity": self.capacity,
                "quality": self.quality,
                "min_price": int(self.min_price) if self.min_price else None,
                "max_price": int(self.max_price) if self.max_price else None,
                "predicted_price": int(self.predicted_price) if self.predicted_price else None
            }
        return result_dict







    def execute(self):
        self.basic_adding()
        self.map_phone_info()
        self.assign_h_time()
        self.convert_as_used_year()
        self.extract_and_map_quality()
        self.calculate_avg_fav_and_view()
        self.change_data_type()
        self.modeling_Preprocessor()
        self.load_no_scaling_price_prdict_model()
        result = self.generate_result_dict()
        
        return result