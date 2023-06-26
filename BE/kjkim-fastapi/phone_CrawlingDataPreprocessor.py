import pandas as pd
import numpy as np
import re
from SamsungPhone import assign_samsung_product_name
from AppleIphone import assign_iphone_product_name
from RemainedPhone import assign_remained_product_name
import basicfunction as bf
from phone_Modeling_Preprocessor import modeling_Preprocessor

class DataPreprocessor:
    '''
    # 크롤링 통해 처음 들어오는 열 : 
    pid	(상품번호) -> 중복값 제거 후 삭제
    name(게시글제목) -> product_name 출력 후 제거
    description(게시글 내용) -> product_name 출력 후 제거
    price(종속변수이자, 중고가)
    time(게시글 등록 시간 : 몇 분 전, 몇 시간 전 등) -> hours(시간 단위 통일화) 로 대체
    quality(제품 등급) #영호가 전달한 등급 기반으로 처리
    favoritecount(찜, 좋아요)
    viewcount(조회수)
    address(거래 주소) #삭제
    keyword(키워드) # 삭제	
    crawling(크롤링한 웹페이지)
    created_at(크롤링한 시간) # 동일한 날에 진행하여 완료한다는 가정 (삭제)
    
    # 추가해야할 열
    product_name(상품명)
    release_year(출시년도)
    screen_size(화면 인치)
    cost(원가)
    capacity(메모리 용량)
    ram(램)
    weight(무게)
    Max_video_playtime(최대 비디오 재생시간)
    Max_audio_playtime(최대 오디오 재생시간)
    battery_capacity(배터리 용량)
    '''
    def __init__(self, filepath):
        self.df = pd.read_csv(filepath)
        self.prepro_df = self.df.copy()
    
    def add_basic_and_remove_irrelevant_products(self):
        '''
        필요없는 제품 제거
        '''
        # 필요 없는 열 삭제
        self.prepro_df.drop(['address', 'keyword'], axis=1, inplace=True)

        # 필요한 열 추가
        self.prepro_df['product_name'] = np.nan
        self.prepro_df['release_year'] = np.nan
        self.prepro_df['screen_size'] = np.nan
        self.prepro_df['cost'] = np.nan
        self.prepro_df['capacity'] = np.nan
        self.prepro_df['ram'] = np.nan
        self.prepro_df['weight'] = np.nan
        self.prepro_df['Max_video_playtime'] = np.nan
        self.prepro_df['Max_audio_playtime'] = np.nan
        self.prepro_df['battery_capacity'] = np.nan

        # 모두 소문자로 변경
        self.prepro_df['description'] = self.prepro_df['description'].str.lower()
        self.prepro_df['name'] = self.prepro_df['name'].str.lower()

        self.prepro_df = self.prepro_df[~self.prepro_df['name'].str.contains('아이패드|에어팟|디지털기기|구매합니다|아이폰x|교환|케어|교신|에디션|톰')]
        self.prepro_df = self.prepro_df[~self.prepro_df['name'].str.contains('갤럭시s23울트라폴드4플립4|아이폰13미니아이폰14아이폰14프로아이폰14프로맥스미개봉새상퓸')]
        self.prepro_df = self.prepro_df[~self.prepro_df['name'].str.contains('애플아이폰14프로맥스아이폰14프로아이폰14아이폰13미니새상품')]
        self.prepro_df['description'] = self.prepro_df['description'].fillna("")
        self.prepro_df = self.prepro_df[~self.prepro_df['description'].str.contains('아이패드|에어팟|디지털기기|구매합니다|아이폰X|교환|교신|폰고래|에디션|톰')]
    
    # 시간 통일화
    def assign_h_time(self):
        '''
         time 열을 시간 단위로 통일화하여 hours 열에 할당
         실제 실행될 때 크롤링 일자가 모두 동일하다는 가정 하에 진행한 코드입니다.
        '''
        self.prepro_df['hours'] = np.nan
        self.prepro_df['hours'] = self.prepro_df['time'].str.extract('(\d+)\s*시간', expand=False).astype(float)
        self.prepro_df.loc[self.prepro_df['time'].str.contains('분'), 'hours'] = self.prepro_df['time'].str.extract('(\d+)\s*분', expand=False).astype(float) / 60
        self.prepro_df.loc[self.prepro_df['time'].str.contains('일'), 'hours'] = self.prepro_df['time'].str.extract('(\d+)\s*일', expand=False).astype(float) * 24
        self.prepro_df.loc[self.prepro_df['time'].str.contains('달'), 'hours'] = self.prepro_df['time'].str.extract('(\d+)\s*달', expand=False).astype(float) * 720
        self.prepro_df.loc[self.prepro_df['time'].str.contains('년'), 'hours'] = self.prepro_df['time'].str.extract('(\d+)\s*년', expand=False).astype(float) * 8640

    # 중복게시글 제거
    def remove_duplicates_and_unnecessary_columns(self):
        '''
        중복된 게시글 제거 (pid 열 기준) : 중복된 게시글의 최근 게시글만 남기고 삭제
        이후 필요없는 행 제거
        '''
        self.prepro_df = self.prepro_df.sort_values('hours').drop_duplicates('pid', keep='first')
        self.prepro_df.drop(['time', 'pid'], axis=1, inplace=True)

    # 제품명과 용량 추출 
    def assign_product_name(self):
        '''
        name과 description에서 제품명 추출
        '''
        # name열에서 '1tb'를 '1000'으로 변경
        self.prepro_df['name'] = self.prepro_df['name'].apply(bf.BasicFunctions.convert_tb_to_gb)
        
        # description열에서 '1tb'를 '1000'으로 변경
        self.prepro_df['description'] = self.prepro_df['description'].apply(bf.BasicFunctions.convert_tb_to_gb)

        # name 열과 description 열에서 용량 추출 : name_capacity열, description_capacity열
        self.prepro_df['name_capacity'] = self.prepro_df['name'].apply(bf.BasicFunctions.extract_capacity)
        self.prepro_df['description_capacity'] = self.prepro_df['description'].apply(lambda x: bf.BasicFunctions.extract_capacity(str(x)) if pd.notnull(x) else None)

        # product_name, capacity 추출
        self.prepro_df = assign_iphone_product_name(self.prepro_df) # 아이폰
        self.prepro_df = assign_samsung_product_name(self.prepro_df) # 갤럭시
        
        # 아이폰과 갤럭시에서 추출된 내용 외의 것 제거 (1차)
        filter_words = ['mini', '미니', 'pro', '프로','max', '맥스', '플러스', '//+', '울트라', 'ultra']
        self.prepro_df = self.prepro_df[~(self.prepro_df['product_name'].isna() & self.prepro_df['name'].apply(lambda x: any(word in x for word in filter_words)))]
        self.prepro_df = self.prepro_df[~(self.prepro_df['product_name'].isna() & self.prepro_df['description'].apply(lambda x: any(word in str(x) for word in filter_words)))]
 
        # 나머지 (아이폰11, 12, 13, 14 & 갤럭시 s20, 21, 22, 23)
        self.prepro_df = assign_remained_product_name(self.prepro_df)

    # 사양 연결
    def map_phone_info(self):
        '''
        1. product_name nan값 삭제
        2. capacity 열에 데이터 최종 입력
            1) capacity가 nan인 값인 행 & name_capacity, description_capacity열 중 데이터가 한 열에만 존재할 경우
            2) capacity가 nan인 값인 행 & name_capacity, description_capacity열 모두 데이터가 있을 경우
                => name_capacity의 값을 우선적으로 capacity에 추가
            3) capacity가 nan 값인 행 삭제 (nan 값이 없게끔 크로스 삭제)
        3. name_capacity, description_capacity 열 삭제
        4. product_name 기준으로 사양들 맵핑
        '''
        # 1. product_name nan값 삭제
        self.prepro_df = self.prepro_df[~(self.prepro_df['product_name'].isna())]

        # 2. capacity 열에 데이터 최종 입력 
        # 1) 값이 한 열에만 있을 경우 & 2) 두 열 모두 값이 있을 경우 
        condition = (self.prepro_df['capacity'].isna()) & \
                    (self.prepro_df['name_capacity'].notna() | self.prepro_df['description_capacity'].notna())
       
        # name_capacity의 값을 먼저 선택 -> 그래도 nan이면 fillna를 사용해 nan값을 description_capacity로 대체
        self.prepro_df.loc[condition, 'capacity'] = self.prepro_df.loc[condition, 'name_capacity'].fillna(self.prepro_df['description_capacity'])

        # 3) capacity가 nan 값인 행 삭제
        self.prepro_df = self.prepro_df[~(self.prepro_df['capacity'].isna())]

        # 3. name_capacity, description_capacity 삭제
        self.prepro_df.drop(['name_capacity', 'description_capacity'], axis=1, inplace=True)
        
        # capacity 열 타입 변환(object -> int)
        self.prepro_df['capacity'] = self.prepro_df['capacity'].astype(int)
        
        # 4. product_name 기준으로 사양들 맵핑
        phone_info = pd.read_csv('phone_info_v2.csv')
        phone_info = phone_info.drop_duplicates(subset=['product', 'capacity'])
        
        # product, capacity 열을 인덱스로 설정
        phone_info = phone_info.set_index(['product', 'capacity']) 

        # prepro_df의 각 열을 phone_info 데이터프레임을 사용하여 업데이트
        for col in ['release_year', 'screen_size', 'weight', 'Max_video_playtime',
                    'Max_audio_playtime', 'battery_capacity', 'ram', 'cost']:
            
            # 'product_name'과 'capacity' 열을 zip으로 묶어서 매핑
            self.prepro_df[col] = list(map(lambda x: phone_info.loc[(x[0], x[1]), col] 
                                           if (x[0], x[1]) in phone_info.index else np.nan, 
                                           zip(self.prepro_df['product_name'], self.prepro_df['capacity'])))
        
        # 사양이 없는 행 제거
        self.prepro_df = self.prepro_df.dropna(subset=['release_year'])


    # 타입 변환
    def change_data_type(self):
        self.prepro_df['cost'] = self.prepro_df['cost'].str.replace(',', '').astype(int)
        self.prepro_df['ram'] = self.prepro_df['ram'].astype(int)
        self.prepro_df['weight'] = self.prepro_df['weight'].astype(float)
        self.prepro_df['Max_video_playtime'] = self.prepro_df['Max_video_playtime'].astype(int)
        self.prepro_df['Max_audio_playtime'] = self.prepro_df['Max_audio_playtime'].astype(int)
        self.prepro_df['battery_capacity'] = self.prepro_df['battery_capacity'].str.replace(',', '').astype(int)

    # 출시 년도 -> 년식으로 변경
    def convert_as_used_year(self):
        '''
        2023년 대비 년식을 구하는 함수
        '''
        self.prepro_df['used_year'] = self.prepro_df['release_year'].apply(lambda x: 2023 - x)
        
        # release_year 열 삭제
        self.prepro_df.drop(['release_year'], axis=1, inplace=True)

    # 등급 변환
    def extract_and_map_quality(self):
        '''
        description으로부터 등급 정보를 추출하고 점수로 맵핑하는 함수
        '''
        # 등급 추출 함수
        def extract_grade_desc(s):
            # "등급 :" 뒤에 공백 상관없이 오는 영문 찾기
            grade = re.search(r'등급 :(\w+)', s)
            if grade is not None and any(letter in grade.group(1).lower() for letter in ['s', 'b', 'a']):
                return grade.group(1) # group(1) : 첫 번째 그룹
            
            # "등급 :"에 해당하지 않는다면, "급" 앞에 공백 상관없이 있는 영문 찾기
            grade = re.search(r'(\w+)급', s)
            if grade is not None and any(letter in grade.group(1).lower() for letter in ['s', 'b', 'a']):
                return grade.group(1)
            return np.nan 

        grade_filter = ~self.prepro_df['quality'].isin(['미개봉', 'S급', 'A급', 'B급'])
        self.prepro_df.loc[grade_filter, 'quality'] = self.prepro_df.loc[grade_filter, 'description'].apply(extract_grade_desc)

        # 등급 재추출 및 정의
        self.prepro_df.loc[self.prepro_df['quality'].isin(['a', 'aaa']), 'quality'] = 'A급'
        self.prepro_df.loc[self.prepro_df['quality'].isin(['b']), 'quality'] = 'B급'
        self.prepro_df.loc[self.prepro_df['quality'].isin(['c']), 'quality'] = 'C급'

        # 등급 점수화
        quality_mapping = {
            '미개봉': 5,
            'S급': 4,
            'A급': 3,
            'B급': 2,
            'C급': 1,
        }
        self.prepro_df['quality'] = self.prepro_df['quality'].map(quality_mapping)

        # 등급이 없는 행 삭제
        self.prepro_df = self.prepro_df.dropna(subset=['quality'])

        # 필요없는 행 삭제
        self.prepro_df.drop(['name', 'description'], axis=1, inplace=True)

    # 조회수, 찜(좋아요) 가중치
    def normalize_viewcount_favoritecount(self):
        '''
        웹페이지 사용자 수를 기준으로 'viewcount'와 'favoritecount' 열을 정규화하는 함수
        '''
        user_site = {
            0: 4640000,  # 당근마켓
            2: 490000,   # 번개장터
            1: 120000,   # 중고나라
        }

        for site, user_count in user_site.items():
            self.prepro_df.loc[self.prepro_df['crawling'] == site, 'viewcount'] /= user_count
            self.prepro_df.loc[self.prepro_df['crawling'] == site, 'favoritecount'] /= user_count
    
        # nan 값은 0으로 변환
        self.prepro_df['viewcount'].fillna(0, inplace=True)
        self.prepro_df['favoritecount'].fillna(0, inplace=True)

        # 필요없는 열 삭제
        self.prepro_df.drop(['crawling', 'created_at'], axis=1, inplace=True)

    def execute(self):
        '''
        앞서 정의한 모든 전처리 메소드를 순차적으로 실행
        '''
        self.add_basic_and_remove_irrelevant_products()
        self.assign_h_time()
        self.remove_duplicates_and_unnecessary_columns()
        self.assign_product_name()
        self.map_phone_info()
        self.change_data_type()   
        self.convert_as_used_year()
        self.extract_and_map_quality()
        self.normalize_viewcount_favoritecount()
        
        return self.prepro_df

class modeling_processing:
    def __init__(self, prepro_df):
        self.prepro_df = prepro_df

    def scaling_data(self):
        '''
        스케일링 py 파일 로드
        '''
        self.scaled_df = modeling_Preprocessor(self.prepro_df) 
    
    def execute(self):
        self.scaling_data()

        return self.scaled_df

class remove_y:
    def __init__(self, scaled_df):
        self.scaled_df = scaled_df

    def remove_product_name(self): 
        # product_name 열 삭제
        self.scaled_df.drop(['product_name'], axis=1, inplace=True)

    def execute(self):
        self.remove_product_name()

        return self.scaled_df
