import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';


const FindIdPage = () => {
    const [name, setName] = useState('');  // 이름 상태 변수
    const [mobileNumber, setMobileNumber] = useState('');  // 휴대폰 번호 상태 변수
    const [email, setEmail] = useState('');  // 이메일 상태 변수
    const [searchByNameAndMobile, setSearchByNameAndMobile] = useState(true);  // 이름과 휴대폰 번호로 검색하는 옵션
    const [searchByNameAndEmail, setSearchByNameAndEmail] = useState(false);  // 이름과 이메일로 검색하는 옵션
    const [foundId, setFoundId] = useState('');  // 찾은 아이디 상태 변수

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleMobileNumberChange = (e) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/[^0-9]/g, '');  // 숫자 이외의 문자 제거
        const formattedValue = numericValue
            .slice(0, 11)  // 11자리까지 제한
            .replace(/(\d{3})(\d{1,4})(\d{1,4})/, '$1-$2-$3');  // 3번째와 7번째 뒤에 "-" 추가

        setMobileNumber(formattedValue);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSearchOptionChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'searchByNameAndMobile') {
            setSearchByNameAndMobile(checked);
            setSearchByNameAndEmail(!checked);
        } else if (name === 'searchByNameAndEmail') {
            setSearchByNameAndEmail(checked);
            setSearchByNameAndMobile(!checked);
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        // 선택된 검색 옵션에 따라 아이디 검색 로직 수행
        if (searchByNameAndMobile) {
            // 이름과 휴대폰 번호로 검색
            // ...
        } else if (searchByNameAndEmail) {
            // 이름과 이메일로 검색
            // ...
        }
        // 결과에 따라 찾은 아이디 업데이트
        setFoundId('찾은 아이디');
    };

    return (
        <div className='login_box'>
            <h1 style={{ marginBottom: '25px' }}>아이디 찾기</h1>
            <div style={{ display : 'flex', justifyContent : 'flex-start', padding : '0 10%', marginBottom : '25px' }}>
                <label style={{ display : 'flex', marginRight : '10px', alignItems : 'center' }}>
                    <Form.Check
                        type="radio"
                        name="searchByNameAndMobile"
                        className='radio'
                        checked={searchByNameAndMobile}
                        onChange={handleSearchOptionChange}
                    />
                    <p>휴대폰 번호</p>
                </label>
                <label style={{ display : 'flex', alignItems : 'center' }}>
                    <Form.Check
                        type="radio"
                        name="searchByNameAndEmail"
                        className='radio'
                        checked={searchByNameAndEmail}
                        onChange={handleSearchOptionChange}
                    />
                    <p>이메일 주소</p>
                </label>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name"></label>
                    <input
                        type="text"
                        id="name"
                        placeholder='이름'
                        className='login_input'
                        value={name}
                        onChange={handleNameChange}
                    />
                </div>
                {searchByNameAndMobile && (
                    <div>
                        <label htmlFor="mobileNumber"></label>
                        <input
                            type="text"
                            id="mobileNumber"
                            placeholder='휴대폰 번호 (번호만 입력)'
                            className='login_input'
                            value={mobileNumber}
                            onChange={handleMobileNumberChange}
                        />
                    </div>
                )}
                {searchByNameAndEmail && (
                    <div>
                        <label htmlFor="email"></label>
                        <input
                            type="email"
                            id="email"
                            className='login_input'
                            placeholder='이메일 주소'
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                )}
                <Button type="submit" className='login_btn'>아이디 찾기</Button>
            </form>
            {foundId && <p>찾은 아이디: {foundId}</p>}
        </div>
    );
};

export default FindIdPage;
