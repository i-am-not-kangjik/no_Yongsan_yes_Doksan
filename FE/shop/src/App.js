/*eslint-disable*/
import 'bootstrap/dist/css/bootstrap.min.css';
import {  useEffect, useState } from 'react';
import { Button, Navbar, Container, Nav, Spinner, Card, NavDropdown, Form } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css';
import Detail from './pages/detail'
import Post from './pages/post'
import SignIn from './pages/signin'
import SignUp from './pages/signup'
import FindId from './pages/findid'
import FindPw from './pages/findpw'
import Temporarydata from './Temporarydata'
import Myshop from './pages/myshop'
import axios from 'axios';

import OutsideAlerter from './pages/detailEffect';

import DetailEffect from './pages/detailEffect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'

import Test from './test'

function App() {

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

  // 로그인한 사용자의 정보
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  // 임시데이터
  let [data, setdata] = useState(Temporarydata)

  // blur 이펙트
  let [blur, setblur] = useState('blurOff')

  // 최근본상품리스트
  let [recentList, setRecentList] = useState([])

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(recentList))
  }, [])

  // 네이게이트
  let navigate = useNavigate();

  return (
    <div className={'App '}>
      <Navbar bg="light" expand="lg" className={`fixed-top ${blur}`}>
        <Container fluid style={{ width: '80%', padding: '10px' }}>
          <Navbar.Brand onClick={() => { navigate('/') }}><p className='maincolor'>용산위에독산</p></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll>
              <Nav.Link onClick={() => { if (loggedInUser == null) {
                navigate('/signin');
                return; 
              } else {
                navigate('/post');
                return;
              } }}>판매하기</Nav.Link>
              <Nav.Link onClick={() => { navigate('/myshop') }}>내상점</Nav.Link>
              <Nav.Link href="#action3">채팅</Nav.Link>
              <NavDropdown title="카테고리" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action4">노트북</NavDropdown.Item>
                <NavDropdown.Item href="#action5">핸드폰</NavDropdown.Item>
                <NavDropdown.Item href="#action6">태블릿</NavDropdown.Item>
                <NavDropdown.Item href="#action7">스마트워치</NavDropdown.Item>
                <NavDropdown.Item href="#action8">블루투스이어폰</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={() => { navigate('/test') }}>테스트</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="물품을 검색해주세요"
                className="me-2"
                aria-label="Search"
                style={{ width: '300px' }}
              />
              <Button variant="outline-secondary">검색하기</Button>{' '}
            </Form>
            {loggedInUser ? (
                <span style={{ fontSize: '15px', marginLeft: '30px' }}>
                {loggedInUser}/<Link onClick={() => setLoggedInUser(null)} className='Link' style={{ color : 'black' }}>로그아웃</Link>
                </span>
            ) : (
              <Nav.Link onClick={() => navigate('/signin')} style={{ fontSize: '15px', marginLeft: '30px' }}>
                로그인/회원가입
              </Nav.Link>
            )}

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path='/' element={<Main setRecentList={setRecentList} recentList={recentList} data={data} setdata={setdata} blur={blur} setblur={setblur}></Main>} />
        <Route path='/detail/:id' element={<Detail></Detail>} />
        <Route path='/post' element={<Post></Post>} />
        <Route path='/DetailEffect' element={<DetailEffect></DetailEffect>} />
        <Route path='/signin' element={<SignIn handleLogin={handleLogin}></SignIn>} />
        <Route path='/signup' element={<SignUp></SignUp>} />
        <Route path='/findid' element={<FindId></FindId>} />
        <Route path='/findpw' element={<FindPw></FindPw>} />
        <Route path='/myshop' element={<Myshop data={data} setdata={setdata} pg={pg}></Myshop>} />
        <Route path='/test' element={<Test/>} />
        <Route path='*' element={<div>없는페이지입니다</div>} />
      </Routes>
    </div>
  );
}

function Main(props) {

  // id state
  let [id, setid] = useState(0)

  // detail 페이지 상태 state
  const [d, setd] = useState(false)

  // 페이지추가 state
  let [datapage, setDatapage] = useState(0)

  // 로딩이펙트 상태 state
  let [load, setLoad] = useState(false)

  return (
    <div>
      <div>
        {/* 최근본 상품 */}
        <div style={{ position: 'fixed', top: '100px', right: '1.75%' }}>
          <Card style={{ width: '180px' }}>
            <Card.Title style={{ borderBottom: '1px solid gray', padding: '10px' }}>최근본상품</Card.Title>
            {
              props.recentList.map(function (img, i) {
                return (
                  <Link onClick={() => { setd(true); props.setblur('blurOn'); }}>
                    <Card.Img src={img} style={{ width: '70%', height: '100px', display: 'block', margin: '15px auto', objectFit: 'cover' }} />
                  </Link>
                )
              })
            }
          </Card>
        </div>

        <div className="container" style={{ marginTop: '30px' }}>
          <div className="row" style={{ backgroundColor: '#fff', borderRadius: '10px', width: '85%', margin: 'auto' }}>
            <h4 style={{ padding: '20px' }}>중고거래</h4>

            {/* 메인컨텐츠영역 */}
            {
              props.data.map(function (a, i) {
                return (
                  <MainCard data={props.data} i={i} setd={setd} setblur={props.setblur} setid={setid}></MainCard>
                )
              })
            }

            {/* 추가 페이지 (더보기 눌렀을 때) */}
            {
              datapage < 9 ? <Link onClick={() => {
                setLoad(true);
                let copy = [...props.data];
                copy.push(props.data[datapage]);
                copy.push(props.data[datapage + 1]);
                copy.push(props.data[datapage + 2]);
                props.setdata(copy)
                setDatapage(datapage + 3)
                setLoad(false);
              }} style={{ textDecoration: 'None', color: 'gray', fontSize: '18px', padding: '20px', borderTop: '1px solid gray' }}>더보기</Link> : null
            }
            {/* {
              datapage < 4 ? <Link onClick={() => {
                setLoad(true)
                axois.get('https://codingapple1.github.io/shop/data' + datapage + '.json')
                  .then((data) => {
                    let copy = [...props.shoes, ...data.data];
                    props.setShoes(copy)
                    setLoad(false)
                  })
                  .catch(() => {
                    setLoad(false)
                  })

                setDatapage(datapage + 1)
              }} style={{ textDecoration: 'None', color: 'gray', fontSize: '18px', padding: '20px', borderTop: '1px solid gray' }}>더보기</Link> : null
            } */}
          </div>

          {/* 로딩중 이펙트 */}
          {
            load == true ? <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner> : null
          }
        </div>
      </div>
      {d && <div style={{ width : '100%', height : '100%', backgroundColor : '#eee', position : 'fixed', top : '0px' }}  className={props.blur}></div>}
      {d && <OutsideAlerter recentList={props.recentList} setRecentList={props.setRecentList} setd={setd} setblur={props.setblur} data={props.data} id={id} />}
    </div>
  )
}

// 메인컨텐츠영역
function MainCard(props) {

  return (
    <div className="col-md-4" onClick={() => { props.setd(true); props.setblur('blurOn'); props.setid(props.i) }}
      style={{ margin: '20px auto' }}>
      {/* 사진영역 */}
      <div style={{ overflow: 'hidden', borderRadius: '10px', width: '250px', height: "180px", margin: 'auto' }}>
        <Link className='Link'><img src={props.data[props.i].img_path[0]}
          className='main_img' /></Link>
      </div>
      {/* 컨텐츠영역 */}
      <div style={{ textAlign: "left", width: '70%', margin: 'auto' }}>
        <Link className='Link'><h5 className='main_title text_overflow'>{props.data[props.i].title}</h5></Link>
        <Link className='Link'><p className='main_area'>{props.data[props.i].region}</p></Link>
        <Link className='Link'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className='main_price maincolor'>{props.data[props.i].price.toLocaleString()}원</p>
            {props.data[props.i].viewCount > 0 && (
              <>
                <span style={{ marginRight : '3px', fontSize: '18px' }}>
                  <FontAwesomeIcon icon={faHeart} />
                </span>
                <span style={{ color: 'black', fontSize: '18px' }}>{props.data[props.i].likeCount}</span>
              </>
            )}
          </div>
        </Link>

      </div>
    </div>
  )
}





export default App;
