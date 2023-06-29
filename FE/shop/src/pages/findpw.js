import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const FindPasswordPage = () => {
  const [name, setName] = useState(''); // 이름 state 변수
  const [id, setId] = useState(''); // 아이디 state 변수
  const [mobileNumber, setMobileNumber] = useState(''); // 휴대폰 번호 state 변수
  const [email, setEmail] = useState(''); // 이메일 state 변수
  const [searchByNameIdMobile, setSearchByNameIdMobile] = useState(true); // 이름, 아이디, 휴대폰 번호로 검색하는 옵션
  const [searchByNameIdEmail, setSearchByNameIdEmail] = useState(false); // 이름, 아이디, 이메일로 검색하는 옵션
  const [foundPassword, setFoundPassword] = useState(''); // 찾은 비밀번호 state 변수

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleIdChange = (e) => {
    setId(e.target.value);
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
    if (name === 'searchByNameIdMobile') {
      setSearchByNameIdMobile(checked);
      setSearchByNameIdEmail(!checked);
    } else if (name === 'searchByNameIdEmail') {
      setSearchByNameIdMobile(!checked);
      setSearchByNameIdEmail(checked);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 비밀번호 검색 로직 수행
    if (searchByNameIdMobile) {
      // 이름, 아이디, 휴대폰 번호로 검색
      // ...
    } else if (searchByNameIdEmail) {
      // 이름, 아이디, 이메일로 검색
    }
    // 결과에 따라 찾은 비밀번호 업데이트
    setFoundPassword('찾은 비밀번호');
  };

  return (
    <div className="login_box">
      <h1 style={{ marginBottom: '25px' }}>비밀번호 찾기</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '0 10%', marginBottom: '25px' }}>
        <label style={{ display: 'flex', marginRight: '10px', alignItems: 'center' }}>
          <Form.Check
            type="radio"
            name="searchByNameIdMobile"
            className="radio"
            checked={searchByNameIdMobile}
            onChange={handleSearchOptionChange}
          />
          <p>휴대폰 번호</p>
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Check
            type="radio"
            name="searchByNameIdEmail"
            className="radio"
            checked={searchByNameIdEmail}
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
            className="login_input"
            placeholder="이름"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <label htmlFor="id"></label>
          <input
            type="text"
            id="id"
            className="login_input"
            placeholder="아이디"
            value={id}
            onChange={handleIdChange}
          />
        </div>
        {searchByNameIdMobile && (
          <div>
            <label htmlFor="mobileNumber"></label>
            <input
              type="text"
              id="mobileNumber"
              className="login_input"
              placeholder="휴대폰 번호 (숫자만 입력)"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
            />
          </div>
        )}
        {searchByNameIdEmail && (
          <div>
            <label htmlFor="email"></label>
            <input
              type="email"
              id="email"
              className="login_input"
              placeholder="이메일 주소"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
        )}
        <Button type="submit" className="login_btn">
          비밀번호 찾기
        </Button>
      </form>
      {foundPassword && <p>찾은 비밀번호: {foundPassword}</p>}
    </div>
  );
};

export default FindPasswordPage;
