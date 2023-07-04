import requests
import psycopg2
from psycopg2 import Error
from bs4 import BeautifulSoup as bs
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import re
import pandas as pd


# PostgreSQL db 연동
def create_connection(self):
    login = db_info.db_info
    try:
        self.conn = psycopg2.connect(
        user=login['user'],
        password=login['password'],
        host=login['host'],
        port=login['port'],
        database=login['database']
        )
        print("PostgreSQL DB에 연결되었습니다.")
        except Exception as e:
        print(f"에러메시지는 '{e}'입니다.")
        return False
    return True

# 데이터 삽입
def insert_data(conn, data):
    query = '''INSERT INTO no_yongsan_yes_doksan.nuseon_ieo(pid, name, description, price, time, favoriteCount,viewCount,imageUrl, keywords, address, keyword, crawling)
               VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s);'''
    try:
        cur = conn.cursor()
        cur.execute(query, data)
        conn.commit()
    except Error as e:
        print(e)
        conn.rollback()


# 중고나라 크롤링
def extract_href_pid(href):
    pid = re.search(r'/product/(\d+)', href)
    if pid:
        return pid.group(1)
    else:
        return ''


def extract_as_pid(as_value):
    if as_value and as_value.startswith('/product/detail/naver/'):
        pid = as_value.split('/product/detail/naver/')[1]
        return pid
    else:
        return ''


def extract_price(price_text):
    price = re.search(r'(\d+(,\d+)*)', price_text)
    if price:
        return price.group(1)
    else:
        return ''


def extract_time(element):
    time_elements = element.find_elements(By.XPATH, './/div[@class="registInfo"]/span')
    if len(time_elements) >= 2:
        time_element = time_elements[1]
    else:
        time_element = time_elements[0]
    time_text = time_element.text.strip()
    return time_text


def extract_detail_info(pid, pid_type, driver):
    try:
        if pid_type == 'href':
            driver.get('https://web.joongna.com/product/' + pid)
        elif pid_type == 'as':
            driver.get('https://web.joongna.com/product/detail/naver/' + pid)
        time.sleep(1)  # wait for page to load

        xpaths_detail_info = [
            '//*[@id="__next"]/div/div[2]/div[1]/div[2]/p[1]',
            '//*[@id="__next"]/div/div[2]/div[1]/div[1]/div[2]/p[1]',
            '//*[@id="__next"]/div/div[2]/div[1]/div/div[2]/p[1]'
        ]

        detail_info = ''
        for xpath in xpaths_detail_info:
            try:
                detail_info = driver.find_element(By.XPATH, xpath).text
                if detail_info:
                    break
            except:
                continue

        detail_info_list = detail_info.split('·')

        views = ''
        likes = ''
        for info in detail_info_list:
            if '조회' in info:
                views = extract_numbers(info)
            if '찜' in info:
                likes = extract_numbers(info)

        xpaths_location = [
            '//*[@id="__next"]/div/div[2]/div[2]/div[1]/div[2]/div[2]/div',
            '//*[@id="__next"]/div/div[2]/div[3]/div[1]/div[2]/div[2]/div'
        ]

        locations = []
        for xpath in xpaths_location:
            try:
                location_elements = driver.find_elements(By.XPATH, xpath + '/span')
                for element in location_elements:
                    locations.append(element.text)
            except:
                continue
        location_string = ', '.join(locations)

        xpath_image_url = '//*[@id="__next"]/div/div[2]/div[1]/div/div[1]/div/div[2]/div/div[2]/div/div/div'
        image_urls = []
        try:
            image_elements = driver.find_elements(By.XPATH, xpath_image_url + '/img')
            for element in image_elements:
                image_urls.append(element.get_attribute('src'))
        except:
            print(f"Failed to extract image URLs for pid: {pid}")
        image_url_string = ', '.join(image_urls)

        xpaths_description = [
            '//*[@id="__next"]/div/div[2]/div[2]/div[1]/div[2]/p',
            '//*[@id="__next"]/div/div[2]/div[3]/div[1]/div[2]/p'
        ]

        description = ''
        for xpath in xpaths_description:
            try:
                description = driver.find_element(By.XPATH, xpath).text
                if description:
                    break
            except:
                continue

        return views, likes, location_string, image_url_string, description
    except:
        print(f"Failed to extract detail info for pid: {pid}")
        return '', '', '', '', ''


def extract_numbers(text):
    number = re.search(r'(\d+)', text)
    if number:
        return number.group(1)
    else:
        return ''


# 중고나라 크롤링
def joongna(keyword, page_limit, conn):
    # 드라이버 설정
    driver = webdriver.Chrome(executable_path=r'C:\Bigdata_study\Mongo\venv\chromedriver.exe')
    driver.implicitly_wait(5)

    baseUrl = 'https://web.joongna.com/search/'
    datas = []

    for page in range(1, int(page_limit) + 1):
        url = baseUrl + keyword + '?page=' + str(page)
        driver.get(url)

        # Find the relevant elements on the page and extract the desired information
        elements = driver.find_elements(By.CSS_SELECTOR, 'a.css-8rmnao')

        for element in elements:
            href = element.get_attribute('href')
            as_value = element.get_attribute('as')

            pid_href = extract_href_pid(href)
            pid_as = extract_as_pid(as_value)

            if pid_href:
                price = element.find_element(By.CSS_SELECTOR, 'div.priceTxt').text
                time = extract_time(element)
                datas.append({'pid': pid_href, 'name': element.find_element(By.CSS_SELECTOR, 'span.css-5uwdmz').text, 'description': '', 'price': extract_price(price), 'time': time, 'likes': '', 'views': '', 'image_url': '', 'keywords': '', 'location': '', 'keyword': keyword, 'crawling': '중고나라', 'pid_type': 'href'})
            elif pid_as:
                price = element.find_element(By.CSS_SELECTOR, 'div.priceTxt').text
                time = extract_time(element)
                datas.append({'pid': pid_as, 'name': element.find_element(By.CSS_SELECTOR, 'span.css-5uwdmz').text, 'description': '', 'price': extract_price(price), 'time': time, 'likes': '', 'views': '', 'image_url': '', 'keywords': '', 'location': '', 'keyword': keyword, 'crawling': '중고나라', 'pid_type': 'as'})

    for data in datas:
        views, likes, location, image_url, description = extract_detail_info(data['pid'], data['pid_type'], driver)
        data['views'] = views
        data['likes'] = likes
        data['location'] = location
        data['image_url'] = image_url
        data['description'] = description

        # Check if any information is missing and assign empty values if necessary
        if not data['views']:
            data['views'] = ''
        if not data['likes']:
            data['likes'] = ''
        if not data['location']:
            data['location'] = ''
        if not data['image_url']:
            data['image_url'] = ''
        if not data['description']:
            data['description'] = ''

        insert_data(conn, [
            data['pid'], data['name'], data['description'], data['price'], data['time'],
            data['likes'], data['views'], data['image_url'], data['keywords'],
            data['location'], data['keyword'], data['crawling']
            ])


    # Close the driver
    driver.quit()

# 메인 실행 코드
if __name__ == '__main__':
    keyword = input("검색어를 입력하세요: ")
    page_limit = input("클릭할 페이지 수를 입력하세요: ")

    conn = create_connection()
    if conn is not None:
        # bunjang(keyword, conn)
        # daangn(keyword, int(page_limit), conn)  # daangn에는 int 타입으로 전달
        joongna(keyword, page_limit, conn)  # joongna에는 str 타입으로 전달

        conn.close()
    else:
        print("Error! cannot create the database connection.")
