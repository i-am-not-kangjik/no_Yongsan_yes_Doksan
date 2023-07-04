from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.hooks.S3_hook import S3Hook
from datetime import datetime, timedelta
from plugins import slack
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver import ChromeOptions
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup as bs
from datetime import datetime, timedelta
import re
import requests
import logging
import os
import pytz
import time
import pandas as pd


# HTML 태그 제거
def remove_tags(element):
    try:
        return re.sub('<.+?>', '', str(element), 0).strip()
    except NoSuchElementException:
        return ''

def daangn(keyword, page_limit):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--headless")
    
    # headless options 설정
    driver = webdriver.Chrome(options=chrome_options)

    driver.implicitly_wait(2)
    baseUrl = 'https://www.daangn.com'
    
    url = baseUrl + '/search/' + keyword
    driver.get(url)
    

    # 클릭 횟수 변수 추가
    click_count = 0

    # 데이터 프레임 생성
    data = {
        'pid': [],
        'name': [],
        'description': [],
        'price': [],
        'time': [],
        'favoriteCount': [],
        'views': [],
        'imageUrl': [],
        'keywords': [],
        'address': [],
        'keyword': [],
        'crawling': []
    }

    # '더보기' 버튼이 없을 때까지 반복
    while click_count < page_limit:
        # 새롭게 로드된 콘텐츠를 파싱
        html = bs(driver.page_source, 'html.parser')
        products = html.select('#flea-market-wrap > article')

        # 각 제품에 대해 정보 추출 후 데이터에 추가
        for prod in products:
            try:
                product_link = baseUrl + prod.find('a', {'class': 'flea-market-article-link'})['href']

                driver.get(product_link)

                detail_html = bs(driver.page_source, 'html.parser')

                # 관심, 조회 정보 수집
                article_counts = remove_tags(detail_html.find('p', {'id': 'article-counts'}))

                # 관심, 조회를 분리하고 숫자만 추출합니다.
                if article_counts:
                    favoriteCount, chat, views = article_counts.split("∙")
                    favoriteCount = re.search(r'\d+', favoriteCount)
                    favoriteCount = int(favoriteCount.group()) if favoriteCount else 0
                    views = re.search(r'\d+', views)
                    views = int(views.group()) if views else 0
                else:
                    favoriteCount, views = 0, 0

                # Time extraction
                time_content = remove_tags(detail_html.find('time'))
                time_ago = 0
                if "끌올" in time_content:
                    time_extract = re.search(r'(\d+)(?=시간 전)', time_content)
                    if time_extract:
                        time_ago = int(time_extract.group())

                # If the time_ago is within 12 hours
                if time_ago <= 12:
                    # 데이터를 데이터 프레임에 추가
                    container = (
                        product_link.split('/')[-1],  # pid로 사용
                        remove_tags(prod.find('img')['alt']),  # name
                        remove_tags(prod.find('span', {'class': 'article-content'})),  # description
                        remove_tags(prod.find('p', {'class': 'article-price'})),  # price
                        time_content,  # time
                        favoriteCount ,
                        views,
                        remove_tags(prod.find('img')['src']),  # imageUrl
                        '디지털기기',  # keywords
                        remove_tags(prod.find('p', {'class': 'article-region-name'})),  # address
                        keyword,  # keyword
                        '당근마켓'  # crawling
                    )

                    for i, value in enumerate(container):
                        data[list(data.keys())[i]].append(value)

                # 검색 결과 페이지로 돌아갑니다
                driver.back()

            except:
                print('error', prod)

        # '더보기' 버튼이 있는지 확인
        try:
            more_button = driver.find_element(By.CSS_SELECTOR, '.more-btn')
            more_button.click()
            # 클릭 횟수 증가 및 출력
            click_count += 1
            print(f"더보기 버튼을 {click_count}번 클릭하였습니다.")
        except NoSuchElementException:
            print("No more 'More' button found. Exiting...")
            break

        # '더보기' 버튼 클릭
        more_button.click()

        # 클릭 횟수 증가 및 출력
        click_count += 1
        print(f"더보기 버튼을 {click_count}번 클릭하였습니다.")

        # 로딩 대기
        time.sleep(2)

    # 데이터 프레임 생성
    df = pd.DataFrame(data)
    return df

def extract(**context):
    keywords = ['아이폰','갤럭시','플립']
    data = []

    for keyword in keywords:
        page_limit = 1  # 페이지 제한
        df = daangn(keyword, page_limit)
        data.append(df)

    # 모든 데이터프레임을 하나로 합칩니다.
    final_df = pd.concat(data, ignore_index=True)

    # S3 버킷 연결
    bucket = 'doksan-data'
    s3_hook = S3Hook(bucket)

    # 데이터를 CSV 파일로 저장
    # 현재 시간을 이용해 파일명 생성
    current_time = datetime.now(pytz.timezone('Asia/Seoul')).strftime("%Y%m%d")
    filename = f'/var/lib/airflow/data/당근마켓_{current_time}.csv'
    final_df.to_csv(filename, index=False)  # final_df 사용

    # S3로 파일 업로드
    # 동일하게 현재 시간을 이용해 S3 key 생성
    s3_key = f'daangn/당근마켓_{current_time}.csv'
    s3_hook.load_file(filename=filename, key=s3_key, bucket_name=bucket)

    logging.info("Upload to S3 done")

    # 로컬 파일 삭제
    os.remove(filename)
    logging.info("Extraction is done.")


dag = DAG(
    dag_id='daangn',
    start_date=datetime(2023, 6, 26, 0, 0, 0),  # UTC 기준으로 6월 26일 0시로 설정
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
    dag=dag
)

extract_task
