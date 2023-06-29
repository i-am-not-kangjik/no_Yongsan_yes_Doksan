import pandas as pd
import numpy as np
import re
import sys
import os
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import basicfunction as bf

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
    # for cap in ['64', '128', '256']:
    #     df.loc[iphone12_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['12', '64', '128', '256'])), 'capacity'] = cap
    #     df.loc[iphone12_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['12', '64', '128', '256'])), 'capacity'] = cap
    
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