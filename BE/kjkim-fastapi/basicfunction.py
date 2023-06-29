import re
import pandas as pd

class BasicFunctions:
    
    @staticmethod # 해당 클래스의 인스턴스 없이도 호출 가능
    def extract_numbers(s):
        '''
        product_name 체크를 위한 부분 함수로,
        문자열에서 숫자를 추출하여 리스트로 반환
        # 문자열이 아닌 경우 빈 리스트 반환
        '''
        if not isinstance(s, str):
            return []
        
        # 숫자 추출 및 문자열로 변환
        number_list = re.findall(r'\d+', s)
        
        # 문자열로 된 숫자를 정수형으로 변환
        number_list = [int(num) for num in number_list]
        
        return number_list

    @staticmethod 
    def extract_capacity(s):
        '''
        문자열에서 용량을 나타내는 숫자를 추출하여 반환
        '''
        if not isinstance(s, str):
            return None
        
        # 숫자 뒤에 'g', '기가' 등의 패턴을 찾음 ((g|기가|gb|GB)? : g, 기가 이런 게 있을 수도 있고 없을 수도 있음)
        capacity_pattern = re.compile(r'(64|128|256|512|1000)(g|기가|gb|GB)?', re.I)
        match = capacity_pattern.search(s)
        if match:
            return int(match.group(1))  # 첫 번째 그룹은 용량을 나타내는 숫자
        else:
            return None

    
    @staticmethod
    def extract_numbers_in_order(s, numbers):
        '''
        se2256기가 와 같은 숫자가 연달아 있는 경우를 탐색하는 함수
        결과 ex : ['256', '2']
        '''
        numbers = sorted(numbers, key=lambda x: -int(x))
        found_numbers = []
        for num in numbers:
            if num in s:
                found_numbers.append(num)
                s = s.replace(num, '')
        return found_numbers

    @staticmethod
    def convert_tb_to_gb(s):
        '''
        product_name 체크를 위한 부분 함수로,
        문자열에서 '1tb', '1TB', '1테라'를 찾아 '1000'으로 바꾸는 함수 (이번 전처리 후 삭제)
        '''
        # NaN 값인 경우 그대로 반환
        if pd.isna(s):
            return s
        s = s.lower().replace('1tb', '1000')
        s = s.replace('1테라', '1000')
        return s


    @staticmethod
    def contains_s20(s):
        '''
        product_name 체크를 위한 부분 함수로,
        문자열에서 갤럭시 S20 패턴('20s', '20 s', 's20', 's 20')을 찾는 함수
        '''
        pattern = re.compile(r'(20\s?s)|(s\s?20)')
        return bool(pattern.search(s.lower()))

    @staticmethod
    def contains_s21(s):
        '''
        product_name 체크를 위한 부분 함수로,
        문자열에서 갤럭시 S21 패턴('21s', '21 s', 's21', 's 21')을 찾는 함수
        '''
        pattern = re.compile(r'(21\s?s)|(s\s?21)')
        return bool(pattern.search(s.lower()))

    @staticmethod
    def contains_s22(s):
        '''
        product_name 체크를 위한 부분 함수로,
        문자열에서 갤럭시 S22 패턴('22s', '22 s', 's22', 's 22')을 찾는 함수
        '''
        pattern = re.compile(r'(22\s?s)|(s\s?22)')
        return bool(pattern.search(s.lower()))

    @staticmethod
    def contains_s23(s):
        '''
        product_name 체크를 위한 부분 함수로,
        문자열에서 갤럭시 S23 패턴('23s', '23 s', 's23', 's 23')을 찾는 함수
        '''
        pattern = re.compile(r'(23\s?s)|(s\s?23)')
        return bool(pattern.search(s.lower()))