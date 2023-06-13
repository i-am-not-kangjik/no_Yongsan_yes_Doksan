import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import bcrypt from 'bcryptjs'; // bcryptjs 라이브러리를 사용하여 비밀번호를 암호화합니다.

const LoginPage = (props) => {

  let navigate = useNavigate();

  const [pg, setPg] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/data');
        setPg(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 입력한 이메일과 일치하는 사용자를 찾습니다.
    const user = pg.userData.find((user) => user.email === email);

    if (user) {
      // 입력한 비밀번호와 저장된 암호화된 비밀번호를 비교합니다.
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (isPasswordCorrect) {
        // 비밀번호가 일치하는 경우, 로그인 로직을 수행합니다.
        console.log('로그인 성공');
        props.handleLogin(user.username)
        navigate('/sell');
      } else {
        // 비밀번호가 일치하지 않는 경우
        console.log('비밀번호가 올바르지 않습니다');
      }
    } else {
      // 사용자가 존재하지 않는 경우
      console.log('사용자를 찾을 수 없습니다');
    }
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
            placeholder='이메일 주소 또는 아이디'
            className='login_input idpw_id'
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor='password'></label>
          <input
            type='password'
            id='password'
            placeholder='비밀번호'
            className='login_input idpw_pw'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <Button type='submit' className='login_btn'>
          로그인
        </Button>
      </form>
      <div style={{ width: '60%', margin: 'auto' }}>
        <Link to='/findid' className='Link' style={{ color: 'gray', borderRight: '1px solid gray', padding: '0 10px' }}>
          아이디 찾기
        </Link>
        <Link to='/findpw' className='Link' style={{ color: 'gray', borderRight: '1px solid gray', padding: '0 10px' }}>
          비밀번호 찾기
        </Link>
        <Link to='/signup' className='Link' style={{ color: 'gray', padding: '0 10px' }}>
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
