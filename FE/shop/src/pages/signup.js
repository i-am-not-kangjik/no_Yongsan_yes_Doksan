import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState(false);
  
    const handleNameChange = (e) => {
      setName(e.target.value);
    };
  
    const handleIdChange = (e) => {
      setId(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value);
      setPasswordMatchError(e.target.value !== password);
    };
  
    const handleMobileNumberChange = (e) => {
      const inputValue = e.target.value;
      const numericValue = inputValue.replace(/[^0-9]/g, '');
      const formattedValue = numericValue
        .slice(0, 11)
        .replace(/(\d{3})(\d{1,4})(\d{1,4})/, '$1-$2-$3');
  
      setMobileNumber(formattedValue);
    };
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        setPasswordMatchError(true);
        return;
      }
  
      // 회원가입 로직 실행
      // ...
  
      // 폼 초기화
      setName('');
      setId('');
      setPassword('');
      setConfirmPassword('');
      setMobileNumber('');
      setEmail('');
      setPasswordMatchError(false);
    };

  return (
    <div className="login_box">
      <h1 style={{ marginBottom : '50px' }}>회원가입</h1>
      {/* 이름 입력란 */}
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
      {/* 아이디 입력란 */}
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
      {/* 비밀번호 입력란 */}
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
      {/* 비밀번호 확인 입력란 */}
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
        {passwordMatchError && <p className="error" style={{ color : 'orange' }}>비밀번호가 일치하지 않습니다.</p>}
      </div>
      {/* 휴대폰 번호 입력란 */}
      <div>
        <label htmlFor="mobileNumber"></label>
        <input
          type="text"
          id="mobileNumber"
          className="login_input"
          placeholder="휴대폰 번호"
          value={mobileNumber}
          onChange={handleMobileNumberChange}
        />
      </div>
      {/* 이메일 입력란 */}
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
      {/* 가입 버튼 */}
      <Button type="submit" className="login_btn" onClick={handleSubmit}>
        회원가입
      </Button>
    </div>
  );
};

export default SignupPage;
