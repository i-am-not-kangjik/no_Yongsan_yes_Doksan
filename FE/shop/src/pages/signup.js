import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [mobileNumber, setMobileNumber] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatchError(e.target.value !== password);
  };

  // const handleMobileNumberChange = (e) => {
  //   const inputValue = e.target.value;
  //   const numericValue = inputValue.replace(/[^0-9]/g, '');
  //   const formattedValue = numericValue
  //     .slice(0, 11)
  //     .replace(/(\d{3})(\d{1,4})(\d{1,4})/, '$1-$2-$3');

  //   setMobileNumber(formattedValue);
  // };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    // 회원가입 요청 보내기
    axios
      .post('http://localhost:8081/api/user/signup', {
        username: name,
        email: email,
        password1: password,
        password2: confirmPassword,
      })
      .then((response) => {
        // 회원가입 성공 시 처리
        console.log(response);

        // 폼 초기화
        setName('');
        setPassword('');
        setConfirmPassword('');
        // setMobileNumber('');
        setEmail('');
        setPasswordMatchError(false);
      })
      .catch((error) => {
        // 회원가입 에러 처리
        console.log(error);
        console.log(name);
        console.log(email);
        console.log(password);
        console.log(confirmPassword);

        setError(true);
        setErrorMessage('Error: Failed to sign up. Please check your input data.');
      });
  };

  return (
    <div className="login_box">
      <h1 style={{ marginBottom: '50px' }}>회원가입</h1>
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
        <label htmlFor="email"></label>
        <input
          type="email"
          id="email"
          className="login_input"
          placeholder="이메일"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div>
        <label htmlFor="password"></label>
        <input
          type="password"
          id="password"
          className="login_input"
          placeholder="비밀번호"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword"></label>
        <input
          type="password"
          id="confirmPassword"
          className="login_input"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {passwordMatchError && (
          <p className="error" style={{ color: 'orange' }}>
            비밀번호가 일치하지 않습니다.
          </p>
        )}
      </div>
      {/* <div>
        <label htmlFor="mobileNumber"></label>
        <input
          type="text"
          id="mobileNumber"
          className="login_input"
          placeholder="휴대폰 번호"
          value={mobileNumber}
          onChange={handleMobileNumberChange}
        />
      </div> */}
      {error && <p className="error">{errorMessage}</p>}
      <Button type="submit" className="login_btn" onClick={handleSubmit}>
        회원가입
      </Button>
    </div>
  );
};

export default SignupPage;
