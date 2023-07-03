import pandas as pd
import numpy as np
import re
import phone.basicfunction as bf
import logging
import os
import tempfile
import shutil
import io
import pytz
from sqlalchemy import create_engine
from airflow.hooks.postgres_hook import PostgresHook
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.hooks.S3_hook import S3Hook
from datetime import datetime,timedelta
from plugins import slack
from datetime import datetime

def remove_irrelevant_products(df):
    """
    키워드 및 삭제
    """
    df['description_capacity'] = np.nan
    df['product_name'] = np.nan
    df['name_capacity'] = np.nan
    df['cost'] = np.nan
    df['capacity'] = np.nan
    df['grade'] = 'C'
    df = df[~df['name'].str.contains('아이패드|에어팟|디지털기기|구매합니다|아이폰XS|교환')]
    df['crwaling'] = df['crwaling'].apply(lambda x: 0 if x == '당근마켓' else (1 if x == '중고나라' else (2 if x == '번개장터' else x)))
    df['description'] = df['description'].str.lower()
    df['name'] = df['name'].str.lower()
    df['price'] = df['price'].astype(str)
    df['price'] = df['price'].fillna('0')
    df['price'] = df['price'].str.replace('나눔🧡', '0')
    return df

def assign_h_time(df):
    """
    시간변환
    """
    df['hours'] = np.nan
    df['hours'] = df['time'].str.extract('(\d+)\s*시간', expand=False).astype(float)
    df.loc[df['time'].str.contains('분'), 'hours'] = df['time'].str.extract('(\d+)\s*분', expand=False).astype(float) / 60
    df.loc[df['time'].str.contains('일'), 'hours'] = df['time'].str.extract('(\d+)\s*일', expand=False).astype(float) * 24
    df.loc[df['time'].str.contains('달'), 'hours'] = df['time'].str.extract('(\d+)\s*달', expand=False).astype(float) * 720
    df.loc[df['time'].str.contains('년'), 'hours'] = df['time'].str.extract('(\d+)\s*년', expand=False).astype(float) * 8640
    return df

def nan_mismatch(df):
    mismatch = df[df['hours'].isna() != df['product_name'].isna()]
    df = df.drop(mismatch[df['hours'].isna()].index)
    return df

def remove_duplicates_and_unnecessary_columns(df):
    df = df.sort_values('hours').drop_duplicates('pid', keep='first')
    df.drop(['time', 'pid'], axis=1, inplace=True)
    return df

def assign_samsung_product_name(df):
    # 'check_product_name' 열 생성
    df['check_product_name'] = np.nan

    # name열에서 '1tb'를 '1000'으로 변경
    df['name'] = df['name'].apply(bf.BasicFunctions.convert_tb_to_gb)
    
    # description열에서 '1tb'를 '1000'으로 변경
    df['description'] = df['description'].apply(bf.BasicFunctions.convert_tb_to_gb)
    
    # 갤럭시 Z 플립 5G
    flip2_info = (
        ((df['name'].apply(lambda x: any(p in x for p in ['플립', 'flip', 'Flip'])) &
        df['name'].apply(lambda x: '2' in bf.BasicFunctions.extract_numbers(x)) |
        df['name'].apply(lambda x: any(p in x for p in ['5g', '5G']))) |
        (df['description'].apply(lambda x: any(p in x for p in ['플립', 'flip', 'Flip']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '2' in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p not in str(x) for p in ['5g', '5G']) if pd.notnull(x) else False)))
    )
    df.loc[flip2_info, 'check_product_name'] = '갤럭시 Z 플립 5G'
    df.loc[flip2_info, 'capacity'] = '256'

    # 갤럭시 Z 플립3
    flip3_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['플립3', 'flip3', 'Flip3']))) |
        (df['description'].apply(lambda x: any(p in x for p in ['플립3', 'flip3', 'Flip3']) if pd.notnull(x) else False)))
    )
    df.loc[flip3_info, 'check_product_name'] = '갤럭시 Z 플립3'
    df.loc[flip3_info, 'capacity'] = '256'

    # 갤럭시 Z 플립4
    flip4_info = (
        (df['check_product_name'].isna()) &
        (df['name'].apply(lambda x: any(p in x for p in ['플립', 'flip', 'Flip'])) &
        df['name'].apply(lambda x: '4' in bf.BasicFunctions.extract_numbers_in_order(x, ['4', '256', '512'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['256', '512']) for i in ['256', '512']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['플립', 'flip', 'Flip']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '4' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['4', '256', '512']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['256', '512']) for i in ['256', '512']) if pd.notnull(x) else False))
    )
    df.loc[flip4_info, 'check_product_name'] = '갤럭시 Z 플립4'
    for cap in ['256', '512']:
        df.loc[flip4_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['4', '256', '512'])), 'capacity'] = cap
        df.loc[flip4_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['4', '256', '512'])), 'capacity'] = cap

    # 갤럭시 Z 폴드2
    fold2_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['폴드', 'fold', 'Fold'])) &
        df['name'].apply(lambda x: '2' in bf.BasicFunctions.extract_numbers_in_order(x, ['2', '256'])) &
        ~df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(x) for i in ['3', '4']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['폴드', 'fold', 'Fold']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '2' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['2', '256']) if pd.notnull(x) else False) &
        ~df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(str(x)) for i in ['3', '4']) if pd.notnull(x) else False)))
    )
    df.loc[fold2_info, 'check_product_name'] = '갤럭시 Z 폴드2'
    df.loc[fold2_info, 'capacity'] = '256'
        
    # 갤럭시 Z 폴드3
    fold3_info = (
        (df['check_product_name'].isna()) &
        (df['name'].apply(lambda x: any(p in x for p in ['폴드', 'fold', 'Fold'])) &
        df['name'].apply(lambda x: '3' in bf.BasicFunctions.extract_numbers_in_order(x, ['3', '256', '512'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['256', '512']) for i in ['256', '512']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['폴드', 'fold', 'Fold']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '3' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['3', '256', '512']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['256', '512']) for i in ['256', '512']) if pd.notnull(x) else False))
    )
    df.loc[fold3_info, 'check_product_name'] = '갤럭시 Z 폴드3'
    for cap in ['256', '512']:
        df.loc[fold3_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['3', '256', '512'])), 'capacity'] = cap
        df.loc[fold3_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['3', '256', '512'])), 'capacity'] = cap

    # 갤럭시 Z 폴드4
    fold4_info = (
        (df['check_product_name'].isna()) &
        (df['name'].apply(lambda x: any(p in x for p in ['폴드', 'fold', 'Fold'])) &
        df['name'].apply(lambda x: '4' in bf.BasicFunctions.extract_numbers_in_order(x, ['4', '256', '512', '1000'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['256', '512', '1000']) for i in ['256', '512', '1000']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['폴드', 'fold', 'Fold']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '4' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['4', '256', '512', '1000']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['256', '512', '1000']) for i in ['256', '512', '1000']) if pd.notnull(x) else False))
    )
    df.loc[fold4_info, 'check_product_name'] = '갤럭시 Z 폴드4'
    for cap in ['256', '512', '1000']:
        df.loc[fold4_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['4', '256', '512', '1000'])), 'capacity'] = cap
        df.loc[fold4_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['4', '256', '512', '1000'])), 'capacity'] = cap

    # 갤럭시 S 20 플러스
    s20plus_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s20) &
        df['name'].apply(lambda x: any(p in x for p in ['Plus', 'plus', '\\+', '플러스']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s20(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['Plus', 'plus', '\\+', '플러스']) if pd.notnull(x) else False)))
    )
    df.loc[s20plus_info, 'check_product_name'] = '갤럭시 S 20 플러스'
    df.loc[s20plus_info, 'capacity'] = '256'

    # 갤럭시 S 20 울트
    s20ultra_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s20) &
        df['name'].apply(lambda x: any(p in x for p in ['Ultra', 'ultra', '울트라']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s20(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['Ultra', 'ultra', '울트라']) if pd.notnull(x) else False))
        )
    )
    df.loc[s20ultra_info, 'check_product_name'] = '갤럭시 S 20 울트라'
    df.loc[s20ultra_info, 'capacity'] = '256'

    # 갤럭시 S 21 플러
    s21plus_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s21) &
        df['name'].apply(lambda x: any(p in x for p in ['Plus', 'plus', '\\+', '플러스']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s21(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['Plus', 'plus', '\\+', '플러스']) if pd.notnull(x) else False))
        )
    )
    df.loc[s21plus_info, 'check_product_name'] = '갤럭시 S 21 플러스'
    df.loc[s21plus_info, 'capacity'] = '256'

    # 갤럭시 S 21 울트라
    s21ultra_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s21) &
        df['name'].apply(lambda x: any(p in x for p in ['Ultra', 'ultra', '울트라'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(x) for i in ['256', '512']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s21(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['Ultra', 'ultra', '울트라']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(str(x)) for i in ['256', '512']) if pd.notnull(x) else False)))
    )
    df.loc[s21ultra_info, 'check_product_name'] = '갤럭시 S 21 울트라'
    for cap in ['256', '512']:
        df.loc[s21ultra_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers(x)), 'capacity'] = cap
        df.loc[s21ultra_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers(x) if pd.notnull(x) else False), 'capacity'] = cap

    # 갤럭시 S 22 플러스
    s22plus_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s22) &
        df['name'].apply(lambda x: any(p in x for p in ['Plus', 'plus', '\\+', '플러스']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s22(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['Plus', 'plus', '\\+', '플러스']) if pd.notnull(x) else False))
        )   
    )
    df.loc[s22plus_info, 'check_product_name'] = '갤럭시 S 22 플러스'
    df.loc[s22plus_info, 'capacity'] = '256'

    # 갤럭시 S 22 울트라 (s22울트라 + 용량 없으면 -> 갤럭시s22에 걸림 | 아이폰 14에 걸림)
    s22ultra_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s22) &
        df['name'].apply(lambda x: any(p in x for p in ['Ultra', 'ultra', '울트라'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(x) for i in ['256', '512', '1000']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s22(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['Ultra', 'ultra', '울트라']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(str(x)) for i in ['256', '512', '1000']) if pd.notnull(x) else False)))
    )
    df.loc[s22ultra_info, 'check_product_name'] = '갤럭시 S 22 울트라'
    for cap in ['256', '512', '1000']:
        df.loc[s22ultra_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers(x)), 'capacity'] = cap
        df.loc[s22ultra_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers(x) if pd.notnull(x) else False), 'capacity'] = cap

    # 갤럭시 S 23 플러스 (몇 가지 아이폰 14로 나오는 게 있음)
    s23plus_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s23) &
        df['name'].apply(lambda x: any(p in x for p in ['Plus', 'plus', '\\+', '플러스'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(x) for i in ['256', '512']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s23(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['Plus', 'plus', '\\+', '플러스']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(str(x)) for i in ['256', '512']) if pd.notnull(x) else False)))
    )
    df.loc[s23plus_info, 'check_product_name'] = '갤럭시 S 23 플러스'
    for cap in ['256', '512']:
        df.loc[s23plus_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers(x)), 'capacity'] = cap
        df.loc[s23plus_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers(x) if pd.notnull(x) else False), 'capacity'] = cap

    # 갤럭시 S 23 울트라 (완료)
    s23ultra_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s23) &
        df['name'].apply(lambda x: any(p in x for p in ['Ultra', 'ultra', '울트라'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(x) for i in ['256', '512', '1000']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s23(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['Ultra', 'ultra', '울트라']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(str(x)) for i in ['256', '512', '1000']) if pd.notnull(x) else False)))
    )
    df.loc[s23ultra_info, 'check_product_name'] = '갤럭시 S 23 울트라'
    for cap in ['256', '512', '1000']:
        df.loc[s23ultra_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers(x)), 'capacity'] = cap
        df.loc[s23ultra_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers(x) if pd.notnull(x) else False), 'capacity'] = cap

    # 갤럭시노트 10 플러스 (완료)
    note10plus_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Note', 'note', '\\+', '노트'])) &
        df['name'].apply(lambda x: '10' in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['Plus', 'plus', '\\+', '플러스'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(x) for i in ['256', '512']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Note', 'note', '\\+', '노트']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '10' in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['Plus', 'plus', '\\+', '플러스']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(str(x)) for i in ['256', '512']) if pd.notnull(x) else False)))
    )
    df.loc[note10plus_info, 'check_product_name'] = '갤럭시노트 10 플러스'
    for cap in ['256', '512']:
        df.loc[note10plus_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers(x)), 'capacity'] = cap
        df.loc[note10plus_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers(x) if pd.notnull(x) else False), 'capacity'] = cap

    # 갤럭시노트 20 울트라 (완료)
    note120ultra_info = (
        (df['check_product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Note', 'note', '\\+', '노트'])) &
        df['name'].apply(lambda x: '20' in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['Ultra', 'ultra', '울트라']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Note', 'note', '\\+', '노트']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '20' in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['Ultra', 'ultra', '울트라']) if pd.notnull(x) else False)))
    )
    df.loc[note120ultra_info, 'check_product_name'] = '갤럭시노트 20 울트라'
    df.loc[note120ultra_info, 'capacity'] = '256'

    return df


def assign_iphone_product_name(df):
    # 아이폰 11 Pro Max
    iphone11promax_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['iphone 11', 'iphone11', '아이폰11', '아이폰 11'])) &
        # df['name'].apply(lambda x: 11 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['11pro', '11 pro', '11프로', '11 프로'])) &
        df['name'].apply(lambda x: any(p in x for p in ['max', '맥스'])) &
        (df['name_capacity'].isin([64, 256, 512]))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone11', 'iphone11', '아이폰11', '아이폰 11'])) &
        # df['description'].apply(lambda x: 11 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['11pro', '11 pro', '11프로', '11 프로']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['max', '맥스', '프로맥스', '프로 max']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([64, 256, 512])))
    )
    df.loc[iphone11promax_info, 'product_name'] = '아이폰 11 Pro Max'
    for cap in [64, 256, 512]:
        df.loc[iphone11promax_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone11promax_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 아이폰 11 Pro
    iphone11pro_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone11', 'iphone11', '아이폰11', '아이폰 11'])) &
        # df['name'].apply(lambda x: 11 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['11pro', '11 pro', '11프로', '11 프로'])) &
        df['name'].apply(lambda x: all(p not in x for p in ['max', '맥스'])) &
        df['name_capacity'].isin([64, 256, 512])) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone11', 'iphone11', '아이폰11', '아이폰 11'])) &
        # df['description'].apply(lambda x: 11 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['11pro', '11 pro', '11프로', '11 프로']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: all(p not in str(x) for p in ['max', '맥스']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([64, 256, 512])))
    )
    df.loc[iphone11pro_info, 'product_name'] = '아이폰 11 Pro'
    for cap in [64, 256, 512]:
        df.loc[iphone11pro_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone11pro_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 아이폰 12 Pro
    iphone12pro_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone12', 'iphone12', '아이폰12', '아이폰 12'])) &
        # df['name'].apply(lambda x: 12 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['12pro', '12 pro', '12프로', '12 프로'])) &
        df['name'].apply(lambda x: all(p not in x for p in ['max', '맥스'])) &
        (df['name_capacity'].isin([128, 256, 512]))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone12', 'iphone12', '아이폰12', '아이폰 12'])) &
        # df['description'].apply(lambda x: 12 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['12pro', '12 pro', '12프로', '12 프로']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: all(p not in str(x) for p in ['max', '맥스', '프로맥스', '프로 맥스','프로 max']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([128, 256, 512])))
    )
    df.loc[iphone12pro_info, 'product_name'] = '아이폰 12 Pro'
    for cap in [128, 256, 512]:
        df.loc[iphone12pro_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone12pro_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 아이폰 12 Pro Max
    iphone12promax_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone12', 'iphone12', '아이폰12', '아이폰 12'])) &
        # df['name'].apply(lambda x: 12 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['12pro max', '12 pro max', '12promax', '12 promax'])) |
        df['name'].apply(lambda x: any(p in x for p in ['12프로맥스', '12 프로맥스', '12프로 맥스', '12 프로 맥스'])) &
        df['name'].apply(lambda x: any(p in x for p in ['max', '맥스'])) &
        (df['name_capacity'].isin([128, 256, 512]))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone12', 'iphone12', '아이폰12', '아이폰 12'])) &
        # df['description'].apply(lambda x: 12 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['12pro max', '12 pro max', '12promax', '12 promax']) if pd.notnull(x) else False) |
        df['description'].apply(lambda x: any(p in str(x) for p in ['12프로맥스', '12 프로맥스', '12프로 맥스', '12 프로 맥스', '12프로 max']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([128, 256, 512])))
    )
    df.loc[iphone12promax_info, 'product_name'] = '아이폰 12 Pro Max'
    for cap in [128, 256, 512]:
        df.loc[iphone12promax_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone12promax_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 아이폰 12 Mini
    iphone12mini_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone12', 'iphone12', '아이폰12', '아이폰 12'])) &
        # df['name'].apply(lambda x: 12 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['12mini', '12 mini', '12미니', '12 미니'])) &
        (df['name_capacity'].isin([64, 128, 256]))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone12', 'iphone12', '아이폰12', '아이폰 12'])) &
        # df['description'].apply(lambda x: 12 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['12mini', '12 mini', '12미니', '12 미니']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([64, 128, 256])))
    )
    df.loc[iphone12mini_info, 'product_name'] = '아이폰 12 Mini'
    for cap in [64, 128, 256]:
        df.loc[iphone12mini_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone12mini_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 아이폰 13 Pro
    iphone13pro_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone13', 'iphone13', '아이폰13', '아이폰 13'])) &
        # df['name'].apply(lambda x: 13 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['13pro', '13 pro', '13프로', '13 프로'])) &
        df['name'].apply(lambda x: all(p not in x for p in ['max', '맥스'])) &
        (df['name_capacity'].isin([128, 256, 512, 1000]))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone13', 'iphone13', '아이폰13', '아이폰 13'])) &
        # df['description'].apply(lambda x: 13 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['13pro', '13 pro', '13프로', '13 프로']) if pd.notnull(x) else False) &
        # 아래 단어 집합이 데이터에 없을 경우만 아이폰 13 pro에 걸림
        df['description'].apply(lambda x: all(p not in str(x) for p in ['max', '맥스', '프로맥스', '프로 맥스','프로 max']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([128, 256, 512, 1000])))
    )
    df.loc[iphone13pro_info, 'product_name'] = '아이폰 13 Pro'
    for cap in [128, 256, 512, 1000]:
        df.loc[iphone13pro_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone13pro_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 아이폰 13 Pro Max
    iphone13promax_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['iphone 13', 'iphone13', '아이폰13', '아이폰 13'])) &
        # df['name'].apply(lambda x: 13 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['13pro max', '13 pro max', '13promax', '13 promax'])) |
        df['name'].apply(lambda x: any(p in x for p in ['13프로맥스', '13 프로맥스', '13프로 맥스', '13 프로 맥스'])) &
        df['name'].apply(lambda x: any(p in x for p in ['max', '맥스'])) &
        (df['name_capacity'].isin([128, 256, 512, 1000]))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['iphone 13', 'iphone13', '아이폰13', '아이폰 13'])) &
        # df['description'].apply(lambda x: 13 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['13pro max', '13 pro max', '13promax', '13 promax']) if pd.notnull(x) else False) |
        df['description'].apply(lambda x: any(p in str(x) for p in ['13프로맥스', '13 프로맥스', '13프로 맥스', '13 프로 맥스']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([128, 256, 512, 1000])))
    )
    df.loc[iphone13promax_info, 'product_name'] = '아이폰 13 Pro Max'
    for cap in [128, 256, 512, 1000]:
        df.loc[iphone13promax_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone13promax_info & (df['description_capacity'] == cap), 'capacity'] = cap

     # 아이폰 13 Mini
    iphone13mini_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone13', 'iphone13', '아이폰13', '아이폰 13'])) &
        # df['name'].apply(lambda x: 13 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['13mini', '13 mini', '13미니', '13 미니'])) &
        (df['name_capacity'].isin([128, 256, 512]))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['iphone 13', 'iphone13', '아이폰13', '아이폰 13'])) &
        # df['description'].apply(lambda x: 13 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['13mini', '13 mini', '아이폰13미니', '아이폰 13미니','아이폰13 미니']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([128, 256, 512])))
    )
    df.loc[iphone13mini_info, 'product_name'] = '아이폰 13 Mini'
    for cap in [128, 256, 512]:
        df.loc[iphone13mini_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone13mini_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 아이폰 14 Plus
    iphone14plus_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone14', 'iphone14', '아이폰14', '아이폰 14', '아이폰14플러스'])) &
        # df['name'].apply(lambda x: 14 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['14 plus', '14plus', '\\+', '14플러스', '14 플러스'])) &
        (df['name_capacity'].isin([128, 256, 512]))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone14', 'iphone14', '아이폰14', '아이폰 14'])) &
        # df['description'].apply(lambda x: 14 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['14 plus', '14plus', '\\+', '14플러스', '14 플러스']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([128, 256, 512])))
    )
    df.loc[iphone14plus_info, 'product_name'] = '아이폰 14 Plus'
    for cap in [128, 256, 512]:
        df.loc[iphone14plus_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone14plus_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 아이폰 14 Pro
    iphone14pro_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone14', 'iphone14', '아이폰14', '아이폰 14'])) &
        # df['name'].apply(lambda x: 14 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['14pro', '14 pro', '14프로', '14 프로'])) &
        df['name'].apply(lambda x: all(p not in x for p in ['max', '맥스'])) &
        (df['name_capacity'].isin([128, 256, 512, 1000]))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone14', 'iphone14', '아이폰14', '아이폰 14'])) &
        # df['description'].apply(lambda x: 14 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['14pro', '14 pro', '14프로', '14 프로']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: all(p not in str(x) for p in ['max', '맥스', '프로맥스', '프로 맥스','프로 max', '넘어']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([128, 256, 512, 1000])))
    )
    df.loc[iphone14pro_info, 'product_name'] = '아이폰 14 Pro'
    for cap in [128, 256, 512, 1000]:
        df.loc[iphone14pro_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone14pro_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 아이폰 14 Pro Max
    iphone14promax_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone14', 'iphone14', '아이폰14', '아이폰 14'])) &
        # df['name'].apply(lambda x: 14 in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['14pro max', '14 pro max', '14promax', '14 promax'])) |
        df['name'].apply(lambda x: any(p in x for p in ['14프로맥스', '14 프로맥스', '14프로 맥스', '14 프로 맥스'])) &
        df['name'].apply(lambda x: any(p in x for p in ['max', '맥스'])) &
        (df['name_capacity'].isin([128, 256, 512, 1000]))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone14', 'iphone14', '아이폰14', '아이폰 14'])) &
        # df['description'].apply(lambda x: 14 in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['14pro max', '14 pro max', '14promax', '14 promax']) if pd.notnull(x) else False) |
        df['description'].apply(lambda x: any(p in str(x) for p in ['14프로맥스', '14 프로맥스', '14프로 맥스', '14 프로 맥스', '14프로 max']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([128, 256, 512, 1000])))
    )
    df.loc[iphone14promax_info, 'product_name'] = '아이폰 14 Pro Max'
    for cap in [128, 256, 512, 1000]:
        df.loc[iphone14promax_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone14promax_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 아이폰 SE(2세대) # 2와 256 연속으로 있을 경우 고려
    iphoneSE2_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone', 'iphone', '아이폰'])) &
        df['name'].apply(lambda x: any(p in x for p in ['se2'])) &
        df['name'].apply(lambda x: '2' in bf.BasicFunctions.extract_numbers_in_order(x, ['2', '64', '128', '256'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['64', '128', '256']) for i in ['64', '128', '256']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone', 'iphone', '아이폰'])) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['se2']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '2' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['2', '64', '128', '256']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['64', '128', '256']) for i in ['64', '128', '256']) if pd.notnull(x) else False)))
    )
    df.loc[iphoneSE2_info, 'product_name'] = '아이폰 SE(2세대)'
    for cap in ['64', '128', '256']:
        df.loc[iphoneSE2_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['2', '64', '128', '256'])), 'capacity'] = cap
        df.loc[iphoneSE2_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['2', '64', '128', '256'])), 'capacity'] = cap

    # 아이폰 SE(3세대)
    iphoneSE3_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['Iphone', 'iphone', '아이폰'])) &
        df['name'].apply(lambda x: any(p in x for p in ['se3'])) &
        df['name'].apply(lambda x: '3' in bf.BasicFunctions.extract_numbers_in_order(x, ['3', '64', '128', '256'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['64', '128', '256']) for i in ['64', '128', '256']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['Iphone', 'iphone', '아이폰'])) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['se3']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '3' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['3', '64', '128', '256']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['64', '128', '256']) for i in ['64', '128', '256']) if pd.notnull(x) else False)))
    )
    df.loc[iphoneSE3_info, 'product_name'] = '아이폰 SE(3세대)'
    for cap in ['64', '128', '256']:
        df.loc[iphoneSE3_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['3', '64', '128', '256'])), 'capacity'] = cap
        df.loc[iphoneSE3_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['3', '64', '128', '256'])), 'capacity'] = cap

    return df


def assign_remained_product_name(df):
    # 아이폰 11 
    iphone11_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['iphone11', 'iphone 11', '아이폰11', '아이폰 11'])) &
        df['name'].apply(lambda x: '11' in bf.BasicFunctions.extract_numbers_in_order(x, ['11', '64', '128'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['64', '128']) for i in ['64', '128']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['iphone11', 'iphone 11', '아이폰11', '아이폰 11'])) &
        df['description'].apply(lambda x: '11' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['11', '64', '128']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['64', '128']) for i in ['64', '128']) if pd.notnull(x) else False)))
    )
    df.loc[iphone11_info, 'product_name'] = '아이폰 11'
    for cap in ['64', '128']:
        df.loc[iphone11_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['11', '64', '128'])), 'capacity'] = cap
        df.loc[iphone11_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['11', '64', '128'])), 'capacity'] = cap

    # 아이폰 12
    iphone12_info = (
        (df['product_name'].isna()) &
        ((df['name'].str.contains(r'iphone\s?12|아이폰\s?12', case=False, regex=True) &
        df['name'].apply(lambda x: '12' in bf.BasicFunctions.extract_numbers_in_order(x, ['12', '64', '128', '256'])) &
        (df['name_capacity'].isin([64, 128, 256]) | 
        df['description_capacity'].isin([64, 128, 256]))) |
        (df['description'].str.contains(r'iphone\s?11|아이폰\s?11', na=False, case=False, regex=True) &
        # df['description'].apply(lambda x: any(p in str(x) for p in ['iphone12', 'iphone 12', '아이폰12', '아이폰 12'])) &
        df['description'].apply(lambda x: '12' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['12', '64', '128', '256']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([64, 128, 256])))
    )
    df.loc[iphone12_info, 'product_name'] = '아이폰 12'
    for cap in [64, 128, 256]:
        df.loc[iphone12_info &(df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone12_info & (df['description_capacity'] == cap), 'capacity'] = cap
   
    
    # 아이폰 13
    iphone13_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['iphone13', 'iphone 13', '아이폰13', '아이폰 13'])) &
        df['name'].apply(lambda x: '13' in bf.BasicFunctions.extract_numbers_in_order(x, ['13', '128', '256', '512'])) &
        (df['name_capacity'].isin([128, 256, 512]) | 
        df['description_capacity'].isin([128, 256, 512]))) |
        # df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['128', '256', '512']) for i in ['128', '256', '512']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['iphone13', 'iphone 13', '아이폰13', '아이폰 13'])) &
        df['description'].apply(lambda x: '13' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['13', '128', '256', '512']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([128, 256, 512])))
        # df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['128', '256', '512']) for i in ['128', '256', '512']) if pd.notnull(x) else False))
    )
    df.loc[iphone13_info, 'product_name'] = '아이폰 13'
    for cap in [128, 256, 512]:
        df.loc[iphone13_info &(df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone13_info & (df['description_capacity'] == cap), 'capacity'] = cap
    # for cap in ['128', '256', '512']:
    #     df.loc[iphone13_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['13', '128', '256', '512'])), 'capacity'] = cap
    #     df.loc[iphone13_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['13', '128', '256', '512'])), 'capacity'] = cap

    # 아이폰 14
    iphone14_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['iphone14', 'iphone 14', '아이폰14', '아이폰 14'])) &
        df['name'].apply(lambda x: '14' in bf.BasicFunctions.extract_numbers_in_order(x, ['14', '128', '256', '512'])) &
        (df['name_capacity'].isin([128, 256, 512]) | 
        df['description_capacity'].isin([128, 256, 512]))) |
        # df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['128', '256', '512']) for i in ['128', '256', '512']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['iphone14', 'iphone 14', '아이폰14', '아이폰 14'])) &
        df['description'].apply(lambda x: '14' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['14', '128', '256', '512']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([128, 256, 512])))
        # df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['128', '256', '512']) for i in ['128', '256', '512']) if pd.notnull(x) else False))
    )
    df.loc[iphone14_info, 'product_name'] = '아이폰 14'
    for cap in [128, 256, 512]:
        df.loc[iphone14_info &(df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[iphone14_info & (df['description_capacity'] == cap), 'capacity'] = cap
    # for cap in ['128', '256', '512']:
        # df.loc[iphone14_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['13', '128', '256', '512'])), 'capacity'] = cap
        # df.loc[iphone14_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['13', '128', '256', '512'])), 'capacity'] = cap

    # 갤럭시 S 20 (20s일 경우 문제 발생)
    s20_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s20) &
        df['name'].apply(lambda x: all(p not in x for p in ['아이폰', 'iphone', '미니'])) &
        df['name'].apply(lambda x: '20' in bf.BasicFunctions.extract_numbers_in_order(x, ['20', '128']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s20(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: all(p not in str(x) for p in ['아이폰', 'iphone', '미니', '//+']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '20' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['20', '128']) if pd.notnull(x) else False)))
    )   
    df.loc[s20_info, 'product_name'] = '갤럭시 S 20'
    df.loc[s20_info, 'capacity'] = '128'

   # 갤럭시 S 21
    s21_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s21) &
        df['name'].apply(lambda x: all(p not in x for p in ['아이폰', 'iphone', '미니'])) &
        df['name'].apply(lambda x: '21' in bf.BasicFunctions.extract_numbers_in_order(x, ['21', '256']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s21(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: all(p not in str(x) for p in ['아이폰', 'iphone', '미니', '//+']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '21' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['21', '256']) if pd.notnull(x) else False)))
    )   
    df.loc[s21_info, 'product_name'] = '갤럭시 S 21'
    df.loc[s21_info, 'capacity'] = '256'

    # 갤럭시 S 22
    s22_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s22) &
        df['name'].apply(lambda x: all(p not in x for p in ['아이폰', 'iphone', '미니'])) &
        df['name'].apply(lambda x: '22' in bf.BasicFunctions.extract_numbers_in_order(x, ['22', '256']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s22(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: all(p not in str(x) for p in ['아이폰', 'iphone', '미니', '//+']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '22' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['22', '256']) if pd.notnull(x) else False)))
    )   
    df.loc[s22_info, 'product_name'] = '갤럭시 S 22'
    df.loc[s22_info, 'capacity'] = '256'

    # 갤럭시 S 23
    s23_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s23) &
        df['name'].apply(lambda x: all(p not in x for p in ['아이폰', 'iphone', '미니'])) &
        df['name'].apply(lambda x: '23' in bf.BasicFunctions.extract_numbers_in_order(x, ['23', '256', '512'])) &
        (df['name_capacity'].isin([256, 512]))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s23(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: all(p not in str(x) for p in ['아이폰', 'iphone', '미니', '//+']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '23' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['23', '256', '512']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([256, 512])))
    )
    df.loc[s23_info, 'product_name'] = '갤럭시 S 23'
    for cap in [256, 512]:
        df.loc[s23_info &(df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[s23_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 갤럭시노트 10
    note10_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['갤럭시노트s10', '노트s10', '10note', '10 note', 'note10', 'note 10', '10노트', '10 노트', '노트10', '노트 10'])) &
        df['name'].apply(lambda x: all(p not in x for p in ['아이폰', 'iphone']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['갤럭시노트s10', '노트s10', '10note', '10 note', 'note10', 'note 10', '10노트', '10 노트', '노트10', '노트 10']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: all(p not in x for p in ['아이폰', 'iphone']) if pd.notnull(x) else False)))
    )   
    df.loc[note10_info, 'product_name'] = '갤럭시노트 10'
    df.loc[note10_info, 'capacity'] = '256'
        
    # 갤럭시노트 20
    note120_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['갤럭시노트s20', '노트s20', '20note', '20 note', 'note20', 'note 20', '20노트', '20 노트', '노트20', '노트 20'])) &
        df['name'].apply(lambda x: all(p not in x for p in ['아이폰', 'iphone']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['갤럭시노트s20', '노트s20', '20note', '20 note', 'note20', 'note 20', '20노트', '20 노트', '노트20', '노트 20']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: all(p not in x for p in ['아이폰', 'iphone']) if pd.notnull(x) else False)))
    )   
    df.loc[note120_info, 'product_name'] = '갤럭시노트 20'
    df.loc[note120_info, 'capacity'] = '256'
    
    # 갤럭시 Z 플립 기본
    flip_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['z플립', '플립 LTE', '플립LTE'])) &
        df['name'].apply(lambda x: all(p not in x for p in ['플립2', '플립 2', '플립3', '플립 3', '플립4', '플립 4']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['z플립', '플립 LTE', '플립LTE']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: all(p not in x for p in ['플립2', '플립 2', '플립3', '플립 3', '플립4', '플립 4']) if pd.notnull(x) else False)))
    )
    df.loc[flip_info, 'product_name'] = '갤럭시 Z 플립 LTE'
    df.loc[flip_info, 'capacity'] = '256'

    return df

def assign_grades(df):
    def grade_row(row):
        grade_conditions = {
            '미개봉': 'N',
            r'새상품급|단순개봉': 'S',
            r'약간\s*[가-힣]*': 'A',
            r'살짝\s*[가-힣]*': 'A',
            r'미세\s*[가-힣]*': 'A',
            r'([가-힣]*\s*)없습[가-힣]*': 'S',
            r'^거의[^\n]*': 'S',
            r'\s*[가-힣]*\s*없음': 'S',
            r'\d+번': 'S',
            r'몇번\s*[가-힣]*': 'S'
        }

        name_value = str(row['name'])
        description_value = str(row['description'])

        grade_regex = r'([a-z]+)\+?급'
        matches_name = re.findall(grade_regex, name_value, flags=re.IGNORECASE)
        matches_description = re.findall(grade_regex, description_value, flags=re.IGNORECASE)

        if matches_name:
            grade = matches_name[0]
            if grade.isalpha() and grade.upper() in ['S', 'A', 'B']:
                return grade.upper()
        elif matches_description:
            grade = matches_description[0]
            if grade.isalpha() and grade.upper() in ['S', 'A', 'B']:
                return grade.upper()

        grade_regex = r'등급 :(\w+)'
        matches_name = re.findall(grade_regex, name_value, flags=re.IGNORECASE)
        matches_description = re.findall(grade_regex, description_value, flags=re.IGNORECASE)

        if matches_name:
            grade = matches_name[0]
            if grade.isalpha() and grade.upper() in ['S', 'A', 'B']:
                return grade.upper()
        elif matches_description:
            grade = matches_description[0]
            if grade.isalpha() and grade.upper() in ['S', 'A', 'B']:
                return grade.upper()

        grade_regex = r'(\w+)급'
        matches_name = re.findall(grade_regex, name_value, flags=re.IGNORECASE)
        matches_description = re.findall(grade_regex, description_value, flags=re.IGNORECASE)

        if matches_name:
            grade = matches_name[0]
            if grade.isalpha() and grade.upper() in ['S', 'A', 'B']:
                return grade.upper()
        elif matches_description:
            grade = matches_description[0]
            if grade.isalpha() and grade.upper() in ['S', 'A', 'B']:
                return grade.upper()

        if row['grade'] == 'C':
            for condition, grade in grade_conditions.items():
                if re.search(condition, name_value, flags=re.IGNORECASE) or re.search(condition, description_value, flags=re.IGNORECASE):
                    return grade

        return 'C'

    df['grade'] = df.apply(grade_row, axis=1)
    return df


def merge_with_product_table(df):
    postgres_hook = PostgresHook(postgres_conn_id="Postgres_RDS")
    conn = postgres_hook.get_conn()

    # SQLAlchemy의 엔진 객체 생성
    engine = create_engine(postgres_hook.get_uri())

    # 데이터프레임을 임시 테이블로 저장
    table_name = 'crawling_data_temp'
    df.to_sql(table_name, engine, if_exists='replace', index=False)

    # SQL 문으로 조인
    sql = """
    SELECT 
        c.*, 
        p.id as product_id 
    FROM 
        crawling_data_temp as c
    LEFT JOIN 
        product.product as p 
    ON 
        c.product_name = p.product_name
    """
    df = pd.read_sql_query(sql, engine)

    # 임시 테이블 삭제
    engine.execute(f"DROP TABLE IF EXISTS {table_name}")

    return df


def merge_with_phone_capacity_cost_table(df):
    postgres_hook = PostgresHook(postgres_conn_id="Postgres_RDS")
    conn = postgres_hook.get_conn()

    # SQLAlchemy의 엔진 객체 생성
    engine = create_engine(postgres_hook.get_uri())

    # 데이터프레임을 임시 테이블로 저장
    table_name = 'crawling_data_temp'
    df.to_sql(table_name, engine, if_exists='replace', index=False)
    
    sql = """
    SELECT 
        c.*, 
        pcc.id as phone_cost_id 
    FROM 
        crawling_data_temp as c
    LEFT JOIN 
        product.phone_capacity_cost as pcc 
    ON 
        c.product_id = pcc.product_id AND c.capacity = pcc.capacity
    """
    df = pd.read_sql_query(sql, engine)

    # 임시 테이블 삭제
    engine.execute(f"DROP TABLE IF EXISTS {table_name}")

    return df


def merge_with_product_grade_table(df):
    postgres_hook = PostgresHook(postgres_conn_id="Postgres_RDS")
    conn = postgres_hook.get_conn()

    # SQLAlchemy의 엔진 객체 생성
    engine = create_engine(postgres_hook.get_uri())

    # 데이터프레임을 임시 테이블로 저장
    table_name = 'crawling_data_temp'
    df.to_sql(table_name, engine, if_exists='replace', index=False)

    sql = """
    SELECT 
        c.*, 
        pg.grade_id as product_grade_id 
    FROM 
        crawling_data_temp as c
    LEFT JOIN 
        product.product_grade as pg 
    ON 
        c.product_id = pg.product_id AND c.grade = pg.grade
    """
    df = pd.read_sql_query(sql, engine)

    # 임시 테이블 삭제
    engine.execute(f"DROP TABLE IF EXISTS {table_name}")

    return df

def postgresql_connector():
    postgresql_hook = PostgresHook(postgres_conn_id="Postgres_RDS")
    conn = postgresql_hook.get_conn()
    cur = conn.cursor()
    return conn, cur

def etl():
    current_time = datetime.now(pytz.timezone('Asia/Seoul')).strftime("%Y%m%d")
    source_bucket = 'doksan-data'
    source_key = f'bunjang/번개장터_{current_time}.csv'
    target_bucket = 'doksan-data'
    target_key = f'Preprocessing/번개장터_{current_time}.csv'

    # S3 버킷 연결
    s3_hook = S3Hook(source_bucket)

    # S3에서 CSV 파일 로드
    s3_object = s3_hook.get_key(bucket_name=source_bucket, key=source_key)
    csv_data = s3_object.get()['Body'].read().decode('utf-8')
    df = pd.read_csv(io.StringIO(csv_data))

    # 데이터 전처리
    df = remove_irrelevant_products(df)
    df = assign_h_time(df)
    df = nan_mismatch(df)
    df = remove_duplicates_and_unnecessary_columns(df)
    df = assign_samsung_product_name(df)
    df = assign_iphone_product_name(df)
    df = assign_remained_product_name(df)
    df = assign_grades(df)
    df = merge_with_product_table(df)
    df = merge_with_phone_capacity_cost_table(df)
    df = merge_with_product_grade_table(df)
    df = df.dropna(subset=['product_grade_id'])
    df = df.dropna(subset=['phone_cost_id'])
    
    # 전처리된 데이터를 S3에 저장
    s3_hook.load_string(
        string_data=df.to_csv(index=False),
        key=target_key,
        bucket_name=target_bucket,
        replace=True
    )
    
    #DB저장
    logging.info(df)
    conn, cur = postgresql_connector()
    for index, row in df.iterrows():
        insert_sql = f'''
            INSERT INTO product.crwaling_phone
            (grade_id, phone_cost_id, price, favoritecount, viewcount, hours, crawling)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        '''
        params = (row['product_grade_id'], row['phone_cost_id'], row['price'], row['favoriteCount'], row['viewCount'], row['hours'], row['crwaling'])
        cur.execute(insert_sql, params)

    conn.commit()
    conn.close()


dag = DAG(
    dag_id='bunjang_ETL_Postgres',
    start_date=datetime(2023, 6, 27, 0, 0, 0),
    schedule_interval=None  # 이 예시는 스케줄이 없습니다
)

task = PythonOperator(
    task_id='etl',
    python_callable=etl,
    dag=dag
)

task
