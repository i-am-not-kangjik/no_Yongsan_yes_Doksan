/*eslint-disable*/
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
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
  const [cd, setCd] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/sell/');
        setPg(response.data);
        setCd(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const [loggedInUser, setLoggedInUser] = useState(null); // 로그인한 사용자

  useEffect(() => {
    checkLoggedInUser(); // 사용자가 이미 로그인되어 있는지 확인
  }, []);

  const checkLoggedInUser = () => {
    const token = localStorage.getItem('token');

    if (token) {
      // 사용자가 로그인되어 있는 경우
      const username = localStorage.getItem('username'); // 로컬 스토리지 또는 서버에서 사용자 ID 가져오기
      setLoggedInUser({ username: username }); // 사용자 ID를 loggedInUser 상태에 설정
    } else {
      // 사용자가 로그인되어 있지 않은 경우
      setLoggedInUser(null);
    }
  };

  const handleLogout = () => {
    // 로그인된 사용자 데이터 지우기
    setLoggedInUser(null);

    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // 원하는 페이지로 이동
    window.location.href = '/sell';
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

  // 검색기능
  const [searchText, setSearchText] = useState('');

  function handleSearch() {
    const filteredContent = cd.content.filter(item => item.title.includes(searchText));
    const updatedCd = { ...cd, content: filteredContent };
    setCd(updatedCd);
    // 검색어에 대한 추가 작업을 수행할 수 있습니다.
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  //카테고리 기능
  function handleCategorySelect(category) {
    const filteredContent = cd.content.filter(item => item.category === category);
    const updatedCd = { ...cd, content: filteredContent };
    setCd(updatedCd);
  }  

  return (
    <div className={'App '}>
      <Navbar expand="lg" className={`fixed-top ${blur}`} bg='light'>
        <Container fluid style={{ width: '80%', padding: '10px' }}>
          <Navbar.Brand onClick={() => { navigate('/sell') }}><p className='maincolor'>용산위에독산</p></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll>
              <Nav.Link onClick={() => {
                if (loggedInUser == null) {
                  navigate('/signin');
                  return;
                } else {
                  navigate('/post')
                  return;
                }
              }}>판매하기</Nav.Link>
              <Nav.Link onClick={() => {
                if (loggedInUser == null) {
                  navigate('/signin');
                  return;
                } else {
                  navigate('/myshop')
                  return;
                }
              }}>내상점</Nav.Link>
              <Nav.Link href="#action3">채팅</Nav.Link>
              <NavDropdown title="카테고리" id="navbarScrollingDropdown">
                <NavDropdown.Item onClick={() => handleCategorySelect('노트북')}>노트북</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleCategorySelect('핸드폰')}>핸드폰</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleCategorySelect('태블릿')}>태블릿</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleCategorySelect('스마트워치')}>스마트워치</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleCategorySelect('블루투스이어폰')}>블루투스이어폰</NavDropdown.Item>
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
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSearch} variant="outline-secondary">검색하기</Button>{' '}
            </Form>
            {loggedInUser ? (
              // 로그인된 사용자인 경우
              <div>
                <Nav.Link style={{ fontSize: '15px', marginLeft: '30px' }}>
                  {loggedInUser.username} / <span onClick={handleLogout}>로그아웃</span>
                </Nav.Link>
              </div>
            ) : (
              // 로그인되지 않은 사용자인 경우
              <Nav.Link onClick={() => navigate('/signin')} style={{ fontSize: '15px', marginLeft: '30px' }}>
                로그인/회원가입
              </Nav.Link>
            )}

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path='/sell' element={<Main cd={cd} setRecentList={setRecentList} recentList={recentList} data={data} setdata={setdata} blur={blur} setblur={setblur} pg={pg}></Main>} />
        <Route path='/detail/:id' element={<Detail></Detail>} />
        <Route path='/post' element={<Post></Post>} />
        <Route path='/DetailEffect' element={<DetailEffect></DetailEffect>} />
        <Route path='/signin' element={<SignIn></SignIn>} />
        <Route path='/signup' element={<SignUp></SignUp>} />
        <Route path='/findid' element={<FindId></FindId>} />
        <Route path='/findpw' element={<FindPw></FindPw>} />
        <Route path='/myshop' element={<Myshop data={data} setdata={setdata} pg={pg}></Myshop>} />
        <Route path='/test' element={<Test />} />
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
  let [datapage, setDatapage] = useState(3)

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
              props.recentList.map(function (id, i) {
                return (
                  <Link onClick={() => { setd(true); props.setblur('blurOn'); setd(true); setid(id); }} key={i}>
                    <Card.Img src={props.cd.content.find(item => item.id === id).imgPath} style={{ width: '70%', height: '100px', display: 'block', margin: '15px auto', objectFit: 'cover' }} />
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
              props.cd.content ? props.cd.content.slice(0, datapage).map(function (item, i) {
                return (
                  <MainCard item={item} cd={props.cd} key={i} data={props.data} i={i} setd={setd} setblur={props.setblur} setid={setid}></MainCard>
                )
              }) : []
            }
            {/* {
              props.data.slice(0, datapage).map(function (a, i) {
                return (
                  <MainCard cd={props.cd} key={i} data={props.data} i={i} setd={setd} setblur={props.setblur} setid={setid}></MainCard>
                )
              })
            } */}

            {/* 추가 페이지 (더보기 눌렀을 때) */}
            {
              props.cd.content && props.cd.content.length > datapage && (
                <Link
                  onClick={() => {
                    setLoad(true);
                    setDatapage(datapage + 3);
                    setLoad(false);
                  }}
                  style={{
                    textDecoration: 'None',
                    color: 'gray',
                    fontSize: '18px',
                    padding: '20px',
                    borderTop: '1px solid gray',
                  }}
                >
                  더보기
                </Link>
              )
            }
          </div>

          {/* 로딩중 이펙트 */}
          {
            load == true ? <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner> : null
          }
        </div>
      </div>
      {d && <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', position: 'fixed', top: '0px' }} className={props.blur}></div>}
      {d && <OutsideAlerter cd={props.cd} recentList={props.recentList} setRecentList={props.setRecentList} setd={setd} setblur={props.setblur} data={props.data} id={id} />}
    </div>
  )
}

// 메인컨텐츠영역
function MainCard(props) {

  return (
    <div className="col-md-4" onClick={() => { props.setd(true); props.setblur('blurOn'); props.setid(props.item.id) }}
      style={{ margin: '20px auto' }}>
      {/* 사진영역 */}
      <div style={{ overflow: 'hidden', borderRadius: '10px', width: '250px', height: "180px", margin: 'auto' }}>
        <Link className='Link'><img src={props.item.imgPath}
          className='main_img' /></Link>
      </div>
      {/* 컨텐츠영역 */}
      <div style={{ textAlign: "left", width: '70%', margin: 'auto' }}>
        <Link className='Link'><h5 className='main_title text_overflow'>{props.item.title}</h5></Link>
        <Link className='Link'><p className='main_area'>{props.item.region}</p></Link>
        <Link className='Link'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className='main_price maincolor'>{props.item.price.toLocaleString()}원</p>
            {props.item.likeCount > 0 && (
              <>
                <span style={{ marginRight: '3px', fontSize: '18px' }}>
                  <FontAwesomeIcon icon={faHeart} />
                </span>
                <span style={{ color: 'black', fontSize: '18px' }}>{props.item.likeCount}</span>
              </>
            )}
          </div>
        </Link>

      </div>
    </div>
  )
}


export default App;


