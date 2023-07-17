from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import chromedriver_autoinstaller
import re
import pandas as pd
import os
import time

# ChromeDriver Download
chromedriver_autoinstaller.install()

def search_link(keyword):
    
    # Chrome 옵션 생성
    chrome_options = Options()
    # 백그라운드 실행 옵션 추가
    chrome_options.add_argument("--headless")
    # 빈 데이터프레임 생성
    df = pd.DataFrame(columns=['keyword', 'link'])
    # 링크 담을 리스트
    link_list = []
    
    for i in range(1,1):
        try:
            # 드라이버 실행
            driver = webdriver.Chrome(executable_path=r'C:\Bigdata_study\Mongo\venv\chromedriver.exe')
            url = f'https://web.joongna.com/search/{keyword}?page={i}'
            driver.get(url)

            # 창 최대화
            driver.maximize_window()
            
            # 해당 페이지 "keyword" 리스트 엘리먼트 추출
            href_element = driver.find_element(By.XPATH, '//*[@id="__next"]/div/main/div[1]/div[2]/ul/li[3]/a')
            text = href_element.get_attribute('innerHTML')
            

            # 정규표현식으로 링크 추출
            pattern = r'href="([^"]*)"'
            href_tags = re.findall(pattern, text)
            for href in href_tags:
                if href.startswith("/product/"):
                    link = 'https://web.joongna.com' + href
                    link_list.append(link)

            driver.quit()
            # 페이지 로드를 위해 대기
            time.sleep(2)

        except :
            print("end")
            pass            
            

    df['link'] = link_list
    df['keyword'] = keyword
    return df

def main():
    # 빈 데이터프레임 생성
    joongna = pd.DataFrame(columns=['keyword', 'link'])

    # 키워드 리스트 - 이 리스트는 원하는 키워드로 수정해야 합니다.
    keyword_list = ['아이패드','갤럭시탭']

    # 각 키워드에 대해 링크 검색을 수행하고 결과를 joongna 데이터프레임에 추가합니다.
    for keyword in keyword_list:
        df = search_link(keyword)
        joongna = pd.concat([joongna, df], ignore_index=True)

    # 데이터프레임을 csv 파일로 저장
    joongna.to_csv('중고나라링크.csv', index = False, encoding = 'utf-8-sig')


if __name__ == '__main__':
    main()