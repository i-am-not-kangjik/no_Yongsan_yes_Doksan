import pandas as pd
import numpy as np
import re
import sys
import os
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import basicfunction as bf

def assign_samsung_product_name(df):
    # 갤럭시 Z 플립3
    flip3_info_desc = (
        (df['product_name'].isna()) &
        (df['description'].apply(lambda x: '플립3' in str(x) if pd.notnull(x) else False)))

    flip3_info = (
        (df['product_name'].isna()) &
        (df['name'].apply(lambda x: any(p in x for p in ['z플립3', '플립3', '플립 3' 'flip3', '3플립', '3flip', '플립3256'])) &
         df['name'].apply(lambda x: all(p not in x for p in ['플립4', '플립 4']))))

    df.loc[flip3_info_desc, 'product_name'] = '갤럭시 Z 플립3'
    df.loc[flip3_info, 'product_name'] = '갤럭시 Z 플립3'
    df.loc[flip3_info, 'capacity'] = '256'

    # 갤럭시 Z 플립4
    flip4_info = (
        (df['product_name'].isna()) &
        (df['name'].apply(lambda x: any(p in x for p in ['플립4', '플립 4', 'flip4', '4플립', '4flip'])) &
        # df['name'].apply(lambda x: all(p not in x for p in ['플립3', '플립 3'])) &
        df['name'].apply(lambda x: '4' in bf.BasicFunctions.extract_numbers_in_order(x, ['4', '256', '512'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['256', '512']) for i in ['256', '512'])))
    )

    flip4_info_desc = (
        (df['product_name'].isna()) &
        (df['description'].apply(lambda x: '플립4' in str(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '4' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['4', '256', '512']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['256', '512']) for i in ['256', '512']) if pd.notnull(x) else False))
    )
    df.loc[flip4_info, 'product_name'] = '갤럭시 Z 플립4'
    df.loc[flip4_info_desc, 'product_name'] = '갤럭시 Z 플립4'

    for cap in [256, 512]:
        df.loc[flip4_info &(df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[flip4_info & (df['description_capacity'] == cap), 'capacity'] = cap
        # df.loc[flip4_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['4', '256', '512'])), 'capacity'] = cap
        # df.loc[flip4_info_desc & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['4', '256', '512'])), 'capacity'] = cap

    # 갤럭시 Z 폴드2
    fold2_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['폴드2', 'fold2', '2폴드', '2fold'])) &
        df['name'].apply(lambda x: '2' in bf.BasicFunctions.extract_numbers_in_order(x, ['2', '256'])) &
        ~df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(x) for i in ['3', '4']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['폴드2', 'fold2', '2폴드', '2fold']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '2' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['2', '256']) if pd.notnull(x) else False) &
        ~df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers(str(x)) for i in ['3', '4']) if pd.notnull(x) else False)))
    )
    df.loc[fold2_info, 'product_name'] = '갤럭시 Z 폴드2'
    df.loc[fold2_info, 'capacity'] = '256'
        
    # 갤럭시 Z 폴드3
    fold3_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['폴드3', 'fold3', '3폴드', '3fold'])) &
        df['name'].apply(lambda x: '3' in bf.BasicFunctions.extract_numbers_in_order(x, ['3', '256', '512'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['256', '512']) for i in ['256', '512']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['폴드3', 'fold3', '3폴드', '3fold']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '3' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['3', '256', '512']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['256', '512']) for i in ['256', '512']) if pd.notnull(x) else False)))
    )
    df.loc[fold3_info, 'product_name'] = '갤럭시 Z 폴드3'
    for cap in ['256', '512']:
        df.loc[fold3_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['3', '256', '512'])), 'capacity'] = cap
        df.loc[fold3_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['3', '256', '512'])), 'capacity'] = cap

    # 갤럭시 Z 폴드4
    fold4_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['폴드4', 'fold4', '4폴드', '4fold'])) &
        df['name'].apply(lambda x: '4' in bf.BasicFunctions.extract_numbers_in_order(x, ['4', '256', '512', '1000'])) &
        df['name'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(x, ['256', '512', '1000']) for i in ['256', '512', '1000']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['폴드4', 'fold4', '4폴드', '4fold']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: '4' in bf.BasicFunctions.extract_numbers_in_order(str(x), ['4', '256', '512', '1000']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(i in bf.BasicFunctions.extract_numbers_in_order(str(x), ['256', '512', '1000']) for i in ['256', '512', '1000']) if pd.notnull(x) else False)))
    )
    df.loc[fold4_info, 'product_name'] = '갤럭시 Z 폴드4'
    for cap in ['256', '512', '1000']:
        df.loc[fold4_info & df['name'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(x, ['4', '256', '512', '1000'])), 'capacity'] = cap
        df.loc[fold4_info & df['description'].apply(lambda x: cap in bf.BasicFunctions.extract_numbers_in_order(str(x), ['4', '256', '512', '1000'])), 'capacity'] = cap

    # 갤럭시 S 20 플러스
    s20plus_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s20) &
        df['name'].apply(lambda x: any(p in x for p in ['20 plus', '20plus', '\\+', '20플러스', '20 플러스']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s20(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['20 plus', '20plus', '\\+', '20플러스', '20 플러스']) if pd.notnull(x) else False)))
    )
    df.loc[s20plus_info, 'product_name'] = '갤럭시 S 20 플러스'
    df.loc[s20plus_info, 'capacity'] = '256'

    # 갤럭시노트 20 울트라 
    note120ultra_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['갤럭시노트s20', '노트s20', '20note', '20 note', 'note20', 'note 20','\\+', '20노트', '20 노트', '노트20', '노트 20'])) &
        df['name'].apply(lambda x: any(p in x for p in ['ultra', '울트라']))) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['갤럭시노트s20', '노트s20', '20note', '20 note', 'note20', 'note 20','\\+', '20노트', '20 노트', '노트20', '노트 20']) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['20ultra', '20 ultra', '20울트라', '20 울트라']) if pd.notnull(x) else False)))
    )
    df.loc[note120ultra_info, 'product_name'] = '갤럭시노트 20 울트라'
    df.loc[note120ultra_info, 'capacity'] = '256'

    # 갤럭시 S 20 울트라
    s20ultra_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s20) &
        df['name'].apply(lambda x: any(p in x for p in ['20ultra', '20 ultra', 'ultra20', 'ultra 20','20울트라', '20 울트라']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s20(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['20ultra', '20 ultra', 'ultra20', 'ultra 20','20울트라', '20 울트라']) if pd.notnull(x) else False)))
    )
    df.loc[s20ultra_info, 'product_name'] = '갤럭시 S 20 울트라'
    df.loc[s20ultra_info, 'capacity'] = '256'

    # 갤럭시 S 21 플러스
    s21plus_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s21) &
        df['name'].apply(lambda x: any(p in x for p in ['21 plus', '21plus', '\\+', '21플러스', '21 플러스']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s21(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['21 plus', '21plus', '\\+', '21플러스', '21 플러스']) if pd.notnull(x) else False)))
    )
    df.loc[s21plus_info, 'product_name'] = '갤럭시 S 21 플러스'
    df.loc[s21plus_info, 'capacity'] = '256'

    # 갤럭시 S 21 울트라
    s21ultra_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['21ultra', '21 ultra', 'ultra21', 'ultra 21','21울트라', 
                                                         '21 울트라', 's21울트라'])) &
        df['name_capacity'].isin([256, 512])) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['21ultra', '21 ultra', 'ultra21', 'ultra 21','21울트라', 
                                                                     '21 울트라', 's21울트라']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([256, 512])))
    )
    df.loc[s21ultra_info, 'product_name'] = '갤럭시 S 21 울트라'
    for cap in [256, 512]:
        df.loc[s21ultra_info &(df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[s21ultra_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 갤럭시 S 22 플러스
    s22plus_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(bf.BasicFunctions.contains_s22) &
        df['name'].apply(lambda x: any(p in x for p in ['22 plus', '22plus', '\\+', '22플러스', '22 플러스']))) |
        (df['description'].apply(lambda x: bf.BasicFunctions.contains_s22(x) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['22 plus', '22plus', '\\+', '22플러스', '22 플러스']) if pd.notnull(x) else False)))
    )
    df.loc[s22plus_info, 'product_name'] = '갤럭시 S 22 플러스'
    df.loc[s22plus_info, 'capacity'] = '256'

    # 갤럭시 S 22 울트라
    s22ultra_info = (
        (df['product_name'].isna()) &
        ((df['name'].str.contains('s22.*울트라|울트라.*s22', case=False, regex=True) &
                df['name_capacity'].isin([256, 512, 1000])) |
            (df['description'].str.contains('s22.*울트라|울트라.*s22', na=False, case=False, regex=True) &
                df['description_capacity'].isin([256, 512, 1000])))
    )
    df.loc[s22ultra_info, 'product_name'] = '갤럭시 S 22 울트라'
    for cap in [256, 512, 1000]:
        df.loc[s22ultra_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[s22ultra_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 갤럭시 S 23 플러스
    s23plus_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['갤럭시s23플러스', '23 plus', '23plus', '\\+', 's23플러스', 
                                                         '23 플러스', 's23플러스'])) &
        df['name_capacity'].isin([256, 512])) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['갤럭시s23플러스', '23 plus', '23plus', '\\+', 's23플러스', '23 플러스']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([256, 512])))
    )
    df.loc[s23plus_info, 'product_name'] = '갤럭시 S 23 플러스'
    for cap in [256, 512]:
        df.loc[s23plus_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[s23plus_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 갤럭시 S 23 울트라
    s23ultra_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['23ultra', '23 ultra', 'ultra23', 'ultra 23','23울트라', '23 울트라'])) &
        df['name_capacity'].isin([256, 512, 1000])) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['23ultra', '23 ultra', 'ultra23', 'ultra 23','23울트라', '23 울트라']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([256, 512, 1000])))
    )
    df.loc[s23ultra_info, 'product_name'] = '갤럭시 S 23 울트라'
    for cap in [256, 512, 1000]:
        df.loc[s23ultra_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[s23ultra_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 갤럭시노트 10 플러스
    note10plus_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['10note', '10 note', 'note10', 'note 10','\\+', '10노트', '10 노트', '노트10', '노트 10'])) &
        # df['name'].apply(lambda x: '10' in bf.BasicFunctions.extract_numbers(x)) &
        df['name'].apply(lambda x: any(p in x for p in ['10plus', '10 plus', '\\+', '10플러스', '10 플러스'])) &
        df['name_capacity'].isin([256, 512])) |
        (df['description'].apply(lambda x: any(p in str(x) for p in ['10note', '10 note', 'note10', 'note 10','\\+', '10노트', '10 노트', '노트10', '노트 10']) if pd.notnull(x) else False) &
        # df['description'].apply(lambda x: '10' in bf.BasicFunctions.extract_numbers(str(x)) if pd.notnull(x) else False) &
        df['description'].apply(lambda x: any(p in str(x) for p in ['10plus', '10 plus', '\\+', '10플러스', '10 플러스']) if pd.notnull(x) else False) &
        df['description_capacity'].isin([256, 512])))
    )
    df.loc[note10plus_info, 'product_name'] = '갤럭시노트 10 플러스'
    for cap in [256, 512]:
        df.loc[note10plus_info & (df['name_capacity'] == cap), 'capacity'] = cap
        df.loc[note10plus_info & (df['description_capacity'] == cap), 'capacity'] = cap

    # 갤럭시 Z 플립 5G
    flip2_info = (
        (df['product_name'].isna()) &
        ((df['name'].apply(lambda x: any(p in x for p in ['플립2', '플립 2', '플립 5g', '플립5g','flip2', 
                                                         'flip 2', 'flip5g', 'flip 5g']))) |
        (df['description'].apply(lambda x: any(p in x for p in ['플립2', '플립 2', '플립 5g', '플립5g','flip2', 
                                                                'flip 2', 'flip5g', 'flip 5g']) if pd.notnull(x) else False)))
    )
    df.loc[flip2_info, 'product_name'] = '갤럭시 Z 플립 5G'
    df.loc[flip2_info, 'capacity'] = '256'

    return df
