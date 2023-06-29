import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

def modeling_Preprocessor(df):
    # 로그 변환 전 준비
    # 0인 데이터에 0.001 추가하기 (최대한 데이터 손상을 막기 위해)
    columns_to_update = ['favoritecount', 'viewcount', 'used_year']
    
    # 각 열에 0.001 더하기
    for column in columns_to_update:
        df[column] = df[column].apply(lambda x: x + 0.001)

    # 로그 변환
    def log_transform(dataframe, columns):
        '''
        데이터프레임과 컬럼을 인자로 받아서
        로그 변환이 적용된 데이터프레임을 반환하는 함수
        # price, product_name 종속변수 제외
        '''
        for column in columns:
            if column not in ['price', 'product_name']: 
                filtered = dataframe[column][dataframe[column] > 0] # filter out negative or zero values
                dataframe[column] = np.log(filtered) # apply log transformation
        return dataframe

    df = log_transform(df, df.columns)

    # 정규화
    def get_minmax_scaler(scaled_df, exclude_columns=['price', 'product_name']): 
        '''
        price(종속변수), product_name 열을 제외한 스케일링 함수
        '''
        from sklearn.preprocessing import MinMaxScaler
        import joblib
        # 각 열마다의 정규화 저장
        scalers = {} 

        for column in df.columns:
            if column not in exclude_columns: 
                scaler = MinMaxScaler()
                scaled_values = scaler.fit_transform(scaled_df[[column]])  # Scale the values
                scaled_df[column] = scaled_values  # Assign the scaled values back to the dataframe
                scalers[column] = scaler

        # 학습된 MinMaxScaler 객체를 파일에 저장
        joblib.dump(scalers, 'scaler.pkl')
        
        return scaled_df

    df = get_minmax_scaler(df)

    return df