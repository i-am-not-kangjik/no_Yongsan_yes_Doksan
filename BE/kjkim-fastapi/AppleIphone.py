import pandas as pd
import numpy as np
import re
import sys
import os
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import basicfunction as bf

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
