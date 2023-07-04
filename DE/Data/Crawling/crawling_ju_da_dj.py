import pandas as pd
import requests
import psycopg2
import time
import re
import chromedriver_autoinstaller
from datetime import datetime
from psycopg2 import Error
from bs4 import BeautifulSoup as bs
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException


# PostgreSQL db 연동
def create_connection():
    conn = None
    try:
        conn = psycopg2.connect(
            user=login['user'],
            password=login['password'],
            host=login['host'],
            port=login['port'],
            database=login['database']
        )
        print("Connection to PostgreSQL DB successful")
    except Exception as e:
        print(f"The error '{e}' occurred")
    return conn


# 데이터 삽입
# def insert_data(conn, data):
#     query = '''INSERT INTO no_yongsan_yes_doksan.crwaling(pid, name, description, price, time, favoriteCount,viewCount,imageUrl, keywords, address, keyword, crawling)
#                VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s);'''
#     try:
#         cur = conn.cursor()
#         cur.execute(query, data)
#         conn.commit()
#     except Error as e:
#         print(e)
#         conn.rollback()

def insert_data(conn, data):
    query = '''INSERT INTO no_yongsan_yes_doksan.crwaling(pid, name, description, price, time, favoriteCount,viewCount,imageUrl, keywords, address, keyword, crawling)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'''
    try:
        cur = conn.cursor()
        cur.executemany(query, data)  # execute 대신 executemany 사용
        conn.commit()
    except Error as e:
        print(e)
        conn.rollback()

# HTML 태그 제거
def remove_tags(element):
    try:
        return re.sub('<.+?>', '', str(element), 0).strip()
    except NoSuchElementException:
        return ''


# 번개장터 key_word로 pid 받아오기
def get_product_location(pid, key_word):
    url = f'https://api.bunjang.co.kr/api/1/find_v2.json?order=date&n=100&page=0&req_ref=search&q={key_word}&stat_device=w&stat_category_required=1&version=4'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json().get('list', [])
        for item in data:
            if item['pid'] == pid:
                return item.get('location', '')
    else:
        print(f'Request to {url} returned status code {response.status_code}')
    return None


# 번개장터 pid api에서 추출값 받아오기
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

# 번개장터 크롤링
def bunjang(key_word, conn):
    data = []
    items_number = 100  # 최대값으로 설정

    url = f'https://api.bunjang.co.kr/api/1/find_v2.json?order=date&n={items_number}&page=1&req_ref=search&q={key_word}&stat_device=w&stat_category_required=1&version=4'
    response = requests.get(url)
    datas = response.json().get('list', [])

    for piddata in datas:
        pid = piddata['pid']
        detail_data = get_product_detail(pid, key_word)

        if detail_data is not None:
            insert_data(conn, [list(detail_data.values())])  # 딕셔너리를 리스트로 변환하여 전달

    return data

# # 번개장터 크롤링
# def bunjang(key_word, conn):
#     data = []
#     page = 0
#     items_number = 100  # 최대값으로 설정

#     while True:
#         url = f'https://api.bunjang.co.kr/api/1/find_v2.json?order=date&n={items_number}&page={page}&req_ref=search&q={key_word}&stat_device=w&stat_category_required=1&version=4'
#         response = requests.get(url)
#         datas = response.json().get('list', [])

#         if not datas:
#             break

#         for piddata in datas:
#             pid = piddata['pid']
#             detail_data = get_product_detail(pid, key_word)

#             if detail_data is not None:
#                 insert_data(conn, list(detail_data.values()))

#         page += 1

#     return data


# 당근마켓 크롤링
def daangn(keyword, page_limit, conn):
    # 드라이버 설정
    driver = webdriver.Chrome(executable_path=r'C:\Bigdata_study\Mongo\venv\chromedriver.exe')
    driver.implicitly_wait(5)

    baseUrl = 'https://www.daangn.com'
    url = baseUrl + '/search/' + keyword
    driver.get(url)

    # 클릭 횟수 변수 추가
    click_count = 0

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
                    interest, chat, views = article_counts.split("∙")
                    interest = re.search(r'\d+', interest)
                    interest = int(interest.group()) if interest else 0
                    views = re.search(r'\d+', views)
                    views = int(views.group()) if views else 0
                else:
                    interest, views = 0, 0

                # 데이터를 DB에 저장할 형태로 만듭니다
                container = (
                    product_link.split('/')[-1],  # pid로 사용
                    remove_tags(prod.find('img')['alt']),  # name
                    remove_tags(prod.find('span', {'class': 'article-content'})),  # description
                    remove_tags(prod.find('p', {'class': 'article-price'})),  # price
                    remove_tags(detail_html.find('time')),  # time
                    interest,
                    views,
                    remove_tags(prod.find('img')['src']),  # imageUrl
                    '디지털기기',  # keywords
                    remove_tags(prod.find('p', {'class': 'article-region-name'})),  # address
                    keyword,  # keyword
                    '당근마켓'  # crawling
                )

                # 데이터를 DB에 저장
                insert_data(conn, container)

                # 검색 결과 페이지로 돌아갑니다
                driver.back()

            except:
                print('error', prod)

        # '더보기' 버튼이 있는지 확인
        try:
            more_button = driver.find_element(By.CSS_SELECTOR, '.more-btn')
            more_button.click()
        except NoSuchElementException:
            print("No more 'More' button found. Exiting...")
            return

        # '더보기' 버튼 클릭
        more_button.click()

        # 클릭 횟수 증가 및 출력
        click_count += 1
        print(f"더보기 버튼을 {click_count}번 클릭하였습니다.")

        # 로딩 대기
        time.sleep(2)


# 중고나라 코드 -> 링크를 통해서 상품번호 받아오기
def search_link(keyword):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    df = pd.DataFrame(columns=['keyword', 'link'])
    link_list = []

# 페이지수 
    for i in range(1, 2):
        try:
            driver = webdriver.Chrome(options=chrome_options)
            url = f'https://web.joongna.com/search/{keyword}?page={i}'
            driver.get(url)
            driver.maximize_window()

            href_element = driver.find_element(By.XPATH, '//*[@id="__next"]/div/main/div[1]/div[2]/ul')
            text = href_element.get_attribute('innerHTML')

            pattern = r'href="([^"]*)"'
            href_tags = re.findall(pattern, text)
            for href in href_tags:
                if href.startswith("/product/"):
                    link = 'https://web.joongna.com' + href
                    id = link.split('/')[-1]
                    link_list.append(id)

            driver.quit()
            time.sleep(2)

        except:
            print("end")
            pass

    df['link'] = link_list
    df['keyword'] = keyword
    return df

# 중고나라 데이터 추출
def restaurant_extract(link):
    url = f'https://web.joongna.com/_next/data/lYle0daistM70s0JL0yaB/product/{link}.json?productSeq={link}' #/data/ 뒤에 코드는 맨날 확인해서 변경
    response = requests.get(url)
    now = datetime.now()

    try:
        data = response.json().get('pageProps', {}).get('dehydratedState', {}).get('queries', [{}])[0].get('state', {}).get('data', {}).get('data', {})
        product_media = data.get('productMedia', [])
        viewOption = data.get('viewOption', {})
        sortdate = data.get('sortDate')

        if sortdate:
            sort_date = datetime.strptime(sortdate, '%Y-%m-%d %H:%M:%S')
            times = (now - sort_date).total_seconds() / 60
            if times < 60:
                timess = f"{round(times)} 분 전"
            else:
                timess = f"{round(times / 60)} 시간 전"
        else:
            timess = ''

        images = []
        for media in product_media:
            image = {
                'originUrl': media.get('originUrl', ''),
                'mediaUrl': media.get('mediaUrl', ''),
                'thumbnailUrl': media.get('thumbnailUrl', ''),
                'waterMarkUrl': media.get('waterMarkUrl', ''),
                'waterMarkLogoUrl': media.get('waterMarkLogoUrl', ''),
                'mediaSort': media.get('mediaSort', 0)
            }
            images.append(image)

        return {
            'name': data.get('productTitle', ''),
            'description': data.get('productDescription', ''),
            'price': data.get('productPrice', ''),
            'time': timess,
            'favoriteCount': viewOption.get('wish', {}).get('wishCount', ''),
            'viewCount': data.get('viewCount', ''),
            'images': images,
            'address': '',
            'keyword': keyword,
            'crawling': '중고나라'
        }
    except (requests.exceptions.JSONDecodeError, ValueError):
        return {}


def extract_data(keyword_list):
    joongna = pd.DataFrame(columns=['keyword', 'link'])

    for keyword in keyword_list:
        df = search_link(keyword)
        joongna = pd.concat([joongna, df], ignore_index=True)

    data_df = pd.DataFrame(columns=['pid', 'name', 'description', 'price', 'time', 'favoriteCount', 'viewCount', 'imageUrl', 'keywords', 'address', 'keyword', 'crawling'])
    for idx, link in enumerate(joongna['link']):
        data = restaurant_extract(link)
        if data:
            data_df.loc[idx, 'pid'] = link
            data_df.loc[idx, 'name'] = data['name']
            data_df.loc[idx, 'description'] = data['description']
            data_df.loc[idx, 'price'] = data['price']
            data_df.loc[idx, 'time'] = data['time']
            data_df.loc[idx, 'favoriteCount'] = data['favoriteCount']
            data_df.loc[idx, 'viewCount'] = data['viewCount']
            image_urls = ','.join([image['originUrl'] for image in data['images']])
            data_df.loc[idx, 'imageUrl'] = image_urls
            data_df.loc[idx, 'keywords'] = ''
            data_df.loc[idx, 'address'] = data['address']
            data_df.loc[idx, 'keyword'] = data['keyword']
            data_df.loc[idx, 'crawling'] = data['crawling']

    return data_df

if __name__ == '__main__':
    keyword_list = ['애플워치', '갤럭시워치']
    page_limit = 1

    conn = create_connection()
    if conn is not None:
        for keyword in keyword_list:
            bunjang(keyword, conn)
            daangn(keyword, page_limit, conn)
            result_df = extract_data(keyword_list)
            if not result_df.empty:
                insert_data(conn, result_df.values.tolist())
            else:
                print("No data to insert.")
        conn.close()
    else:
        print("오류.")
