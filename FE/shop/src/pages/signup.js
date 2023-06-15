/*eslint-disable*/
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Get the navigate function

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatchError(e.target.value !== password);
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

    axios
      .post('http://localhost:8081/api/user/signup', {
        username: username,
        email: email,
        password1: password,
        password2: confirmPassword,
      })
      .then((response) => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setPasswordMatchError(false);
        navigate('/signin'); // Redirect to the "/signin" page
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setErrorMessage('Error: Failed to sign up. Please check your input data.');
      });
  };

  return (
    <div className="login_box">
      <h1 style={{ marginBottom: '50px' }}>회원가입</h1>
      <div>
        <label htmlFor="username"></label>
        <input
          type="text"
          id="username"
          className="login_input"
          placeholder="이름"
          value={username}
          onChange={handleUsernameChange}
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
      {error && <p className="error">{errorMessage}</p>}
      <Button type="submit" className="login_btn" onClick={handleSubmit}>
        회원가입
      </Button>
    </div>
  );
};

export default SignupPage;
