/*eslint-disable*/
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const LoginPage = (props) => {
  let navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 로그인 요청 보내기
    axios
      .post('http://13.209.183.88:8081/api/user/login', {
        email: email, // "email" 필드를 사용합니다.
        password: password,
      })
      .then((response) => {
        // 로그인 성공 시 처리
        const token = response.data.token;
        const username = response.data.username;

        if (token) {

          // 토큰을 로컬 스토리지에 저장합니다.
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);

          // 원하는 페이지로 리다이렉트
          window.location.href = '/sell';
        } else {
          // 토큰이 유효하지 않은 경우나 응답에 오류가 있는 경우 처리
          setError(true);
          setErrorMessage('에러: 유효하지 않은 토큰 또는 응답입니다.');
        }
      })
      .catch((error) => {
        // 로그인 에러 처리
        console.log(error);
        setError(true);
        setErrorMessage('잘못된 이메일 또는 비밀번호입니다.');
      });
  };


  return (
    <div className='login_box'>
      <h1 style={{ marginBottom: '50px' }}>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'></label>
          <input
            type='email'
            id='email'
            placeholder='이메일을 입력해주세요'
            className='login_input'
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor='password'></label>
          <input
            type='password'
            id='password'
            placeholder='비밀번호를 입력해주세요'
            className='login_input'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {error && <p style={{ color: 'orange' }}>{errorMessage}</p>}
        <Button type='submit' className='login_btn'>
          로그인
        </Button>
      </form>
      <div style={{ width: '60%', margin: 'auto' }}>
        <Link to='/findid' className='Link' style={{ color: 'gray', borderRight: '1px solid gray', padding: '0 10px' }}>
          이메일 찾기
        </Link>
        <Link to='/findpw' className='Link' style={{ color: 'gray', borderRight: '1px solid gray', padding: '0 10px' }}>
          비밀번호 찾기
        </Link>
        <Link to='/signup' className='Link' style={{ color: 'gray', padding: '0 10px' }}>
          회원 가입
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
