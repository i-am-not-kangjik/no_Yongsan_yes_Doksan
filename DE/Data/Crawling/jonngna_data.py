import requests
import re
import os
from datetime import datetime
import pandas as pd

def restaurant_extract(link):
    url = f'https://web.joongna.com/_next/data/n80lARHrZFQ7Cv2_mML-4/product/{link}.json?productSeq={link}'
    response = requests.get(url)

    # 현재 시스템 시간
    now = datetime.now()

    try:
        data = response.json().get('pageProps', {}).get('dehydratedState', {}).get('queries', [{}])[0].get('state', {}).get('data', {}).get('data', {})
        product_media = data.get('productMedia', [])
        viewOption = data.get('viewOption', {})
        sortdate = data.get('sortDate')

        if sortdate:
            # 시간 계산
            sort_date = datetime.strptime(sortdate, '%Y-%m-%d %H:%M:%S')
            times = (now - sort_date).total_seconds() / 60  # 분으로 변환
            if times < 60:
                timess = f"{round(times)} 분 전"
            else:
                timess = f"{round(times / 60)} 시간 전"
        else:
            timess = ''  # sortdate가 없는 경우 빈 문자열로 설정

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
            'keyword': '아이폰',
            'crawling': '중고나라'
        }
    except (requests.exceptions.JSONDecodeError, ValueError):
        # JSON 디코딩 오류 또는 값 변환 오류가 발생한 경우, 빈 딕셔너리 반환
        return {}


def main():
    df = pd.read_csv('C:/python/no_Yongsan_yes_Doksan/DE/중고나라링크.csv').reset_index(drop=True)

    for idx, pid in enumerate(df['link']):
        data = restaurant_extract(pid)
        if data:
            df.loc[idx, 'title'] = data['name']
            df.loc[idx, 'description'] = data['description']
            df.loc[idx, 'price'] = data['price']
            df.loc[idx, 'time'] = data['time']
            df.loc[idx, 'favoriteCount'] = data['favoriteCount']
            df.loc[idx, 'viewCount'] = data['viewCount']
            image_urls = ','.join([image['originUrl'] for image in data['images']])
            df.loc[idx, 'imageUrl'] = image_urls
            df.loc[idx, 'address'] = data['address']
            df.loc[idx, 'keyword'] = data['keyword']
            df.loc[idx, 'crawling'] = data['crawling']
    df.to_csv('중고나라_final_워치.csv', encoding='utf-8-sig', index=False)


if __name__ == '__main__':
    main()
