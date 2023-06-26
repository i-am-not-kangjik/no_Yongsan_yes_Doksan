/*eslint-disable*/
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Button, Navbar, Container, Nav, Spinner, Card, NavDropdown, Form } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import './App.css';
import Home from './pages/home'
import Detail from './pages/detail'
import Post from './pages/post'
import SignIn from './pages/signin'
import SignUp from './pages/signup'
import FindId from './pages/findid'
import FindPw from './pages/findpw'
import Myshop from './pages/myshop'
import axios from 'axios';
import Edit from './pages/edit'
import Message from './pages/message'

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
        const response = await axios.get('http://13.209.183.88:8081/api/sell');
        setPg(response.data);
        setCd(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const updateCd = (newCd) => {
    setCd(newCd);
  };

  const [loggedInUser, setLoggedInUser] = useState(null); // 로그인한 사용자
  const [logoutTimer, setLogoutTimer] = useState(null); // 로그아웃 타이머

  useEffect(() => {
    checkLoggedInUser(); // 사용자가 이미 로그인되어 있는지 확인
  }, []);

  const checkLoggedInUser = () => {
    const token = localStorage.getItem('token');

    if (token) {
      // 사용자가 로그인되어 있는 경우
      const username = localStorage.getItem('username'); // 로컬 스토리지 또는 서버에서 사용자 ID 가져오기
      setLoggedInUser({ username: username }); // 사용자 ID를 loggedInUser 상태에 설정
      startLogoutTimer(); // 로그아웃 타이머 시작
    } else {
      // 사용자가 로그인되어 있지 않은 경우
      setLoggedInUser(null);
      stopLogoutTimer(); // 로그아웃 타이머 중지
    }
  };

  const startLogoutTimer = () => {
    // 1시간 후에 로그아웃 실행
    const timer = setTimeout(() => {
      handleLogout();
    }, 60 * 60 * 1000); // 1시간 (밀리초 단위)
    setLogoutTimer(timer); // 로그아웃 타이머 설정
  };

  const stopLogoutTimer = () => {
    // 로그아웃 타이머 중지
    clearTimeout(logoutTimer);
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


  // blur 이펙트
  let [blur, setblur] = useState('blurOff')

  // 최근본상품리스트
  let [recentList, setRecentList] = useState([])

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(recentList))
  }, [])

  // 네이게이트
  let navigate = useNavigate();

  // 검색과 카테고리와 찜목록 state
  let [scl, setScl] = useState('')
  let [search, setSearch] = useState('')

  // 검색기능
  const [searchText, setSearchText] = useState('');

  function handleSearch() {
    if (window.location.pathname !== '/sell') {
      navigate('/sell')
    }
    const filteredContent = pg.filter(item =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setScl("s");
    setSearch(searchText);
    setCd(filteredContent);
  }

  //카테고리 기능
  function handleCategorySelect(category) {
    if (window.location.pathname !== '/sell') {
      navigate('/sell')
    }
    const filteredContent = pg.filter(item => item.category === category);
    setScl("c");
    setSearch(category);
    setCd(filteredContent);
  }

  // 찜목록
  function handleLikedPosts() {
    if (window.location.pathname !== '/sell') {
      navigate('/sell')

    }
    const filteredContent = pg.filter(item => item.likedUsernames.includes(loggedInUser.username));
    setScl("l");
    setSearch(loggedInUser.username);
    setCd(filteredContent);
  }

  const [postId, setPostId] = useState('');

  // 쪽지 컴포넌트
  const [message, setMessage] = useState(false);

  const handleClick = () => {
    setMessage((prevMessage) => !prevMessage);
  };

  return (
    <div className={'App '}>
      <Navbar expand="lg" className={`fixed-top ${blur}`} bg='light'>
        <Container fluid style={{ width: '85%', padding: '10px' }}>
          <Navbar.Brand onClick={() => { navigate('/') }}><p className='maincolor'>용산위에독산</p></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll>
              <Nav.Link onClick={() => { navigate('/sell'); setCd(pg); setScl("") }}>중고거래</Nav.Link>
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
              <Nav.Link onClick={() => {
                if (loggedInUser == null) {
                  navigate('/signin');
                  return;
                } else {
                  handleLikedPosts();
                  return;
                }
              }}>찜목록</Nav.Link>
              <NavDropdown title="카테고리" id="navbarScrollingDropdown">
                <NavDropdown.Item onClick={() => { handleCategorySelect('노트북') }}>노트북</NavDropdown.Item>
                <NavDropdown.Item onClick={() => { handleCategorySelect('핸드폰') }}>핸드폰</NavDropdown.Item>
                <NavDropdown.Item onClick={() => { handleCategorySelect('태블릿') }}>태블릿</NavDropdown.Item>
                <NavDropdown.Item onClick={() => { handleCategorySelect('스마트워치') }}>스마트워치</NavDropdown.Item>
                <NavDropdown.Item onClick={() => { handleCategorySelect('블루투스이어폰') }}>블루투스이어폰</NavDropdown.Item>
              </NavDropdown>
              {/* <Nav.Link onClick={() => { navigate('/test') }}>테스트</Nav.Link> */}
            </Nav>
            <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <Form.Control
                type="search"
                placeholder="물품을 검색해주세요"
                className="me-2"
                aria-label="Search"
                style={{ width: '300px' }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button type="submit" onClick={handleSearch} variant="outline-secondary">
                검색하기
              </Button>{' '}
            </Form>


            {loggedInUser ? (
              // 로그인된 사용자인 경우
              <div style={{ display: 'flex' }}>
                <Nav.Link style={{ fontSize: '15px', marginLeft: '30px', marginRight: '20px' }}>
                  {loggedInUser.username} / <span onClick={handleLogout}>로그아웃</span>
                </Nav.Link>
                <Nav.Link onClick={handleClick}>쪽지함</Nav.Link>
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
        <Route
          path="/"
          element={<Home></Home>}
        />
        <Route path='/sell' element={<Main setMessage={setMessage} message={message} setPg={setPg} scl={scl} search={search} updateCd={updateCd} setCd={setCd} cd={cd} setRecentList={setRecentList} recentList={recentList} blur={blur} setblur={setblur} pg={pg}></Main>} />
        <Route path='/detail/:id' element={<Detail></Detail>} />
        <Route path='/post' element={<Post></Post>} />
        <Route path='/DetailEffect' element={<DetailEffect></DetailEffect>} />
        <Route path='/signin' element={<SignIn></SignIn>} />
        <Route path='/signup' element={<SignUp></SignUp>} />
        <Route path='/findid' element={<FindId></FindId>} />
        <Route path='/findpw' element={<FindPw></FindPw>} />
        <Route path='/edit' element={<Edit postId={postId}></Edit>} />
        <Route path='/myshop' element={<Myshop postId={postId} setPostId={setPostId} pg={pg}></Myshop>} />
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

  useEffect(() => {
    let fetchData;
    if (d) {
      fetchData = async () => {
        try {
          const response = await axios.get(`http://13.209.183.88:8081/api/sell/${id}`);
          // 여기서 응답 데이터를 처리합니다.
          const fetchData = async () => {
            try {
              const response = await axios.get('http://13.209.183.88:8081/api/sell/');
              if (props.scl == 's') {
                props.setCd(response.data.filter(item =>
                  item.title.toLowerCase().includes(props.search.toLowerCase())
                ));
              } else if (props.scl == 'c') {
                props.setCd(response.data.filter(item => item.category === props.search));
              } else if (props.scl == 'l') {
                props.setCd(response.data.filter(item => item.likedUsernames.includes(props.search)));
              } else {
                props.setCd(response.data);
              }
            } catch (error) {
              console.error(error);
            }
          };

          fetchData();
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [d]);


  // 페이지추가 state
  let [datapage, setDatapage] = useState(9)

  // 로딩이펙트 상태 state
  let [load, setLoad] = useState(false)

  return (
    <div>
      <div>

        {
          props.message == true ? <div style={{ position: 'fixed', top: '100px', right: '1.75%', zIndex : '1' }}><Message setMessage={props.setMessage}></Message></div> : null
        }
        {/* 최근본 상품 */}
        <div style={{ position: 'fixed', top: '100px', right: '1.75%', zIndex : '0' }}>
          <Card style={{ width: '180px' }}>
            <Card.Title style={{ borderBottom: '1px solid gray', padding: '10px' }}>최근본상품</Card.Title>
            {
              props.recentList.map(function (id, i) {
                return (
                  <Link onClick={() => { setd(true); props.setblur('blurOn'); setid(id); }} key={i}>
                    <Card.Img src={props.pg.find(item => item.id === id).imgPaths[0]} style={{ width: '70%', height: '100px', display: 'block', margin: '15px auto', objectFit: 'cover' }} />
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
              props.cd ? props.cd.slice(0, datapage).map(function (item, i) {
                return (
                  <MainCard item={item} cd={props.cd} key={i} setd={setd} setblur={props.setblur} setid={setid}></MainCard>
                )
              }) : []
            }

            {/* 추가 페이지 (더보기 눌렀을 때) */}
            {
              props.cd && props.cd.length > datapage && (
                <Link
                  onClick={() => {
                    setLoad(true);
                    setDatapage(datapage + 9);
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
      {d && <OutsideAlerter setPg={props.setPg} scl={props.scl} search={props.search} updateCd={props.updateCd} setCd={props.setCd} cd={props.cd} recentList={props.recentList} setRecentList={props.setRecentList} setd={setd} setblur={props.setblur} id={id} />}
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
        <Link className='Link'><img src={props.item.imgPaths[0]}
          className='main_img' /></Link>
      </div>
      {/* 컨텐츠영역 */}
      <div style={{ textAlign: "left", width: '70%', margin: 'auto' }}>
        <Link className='Link'><h5 className='main_title text_overflow' style={{ marginTop: '5px' }}>{props.item.title}</h5></Link>
        <Link className='Link'><p className='main_area'>{props.item.region}</p></Link>
        <Link className='Link'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className='main_price maincolor'>{props.item.price.toLocaleString()}원</p>
            {props.item.sellState === 'RESERVED' && (
              <div
                style={{
                  width: '130px',
                  height: '30px',
                  backgroundColor: '#0052A4',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #eee',
                  borderRadius: '7px',
                  marginRight: '20px',
                }}
              >
                <span style={{ color: 'white' }}>예약중</span>
              </div>
            )}
            {props.item.sellState === 'COMPLETED' && (
              <div
                style={{
                  width: '130px',
                  height: '30px',
                  backgroundColor: '#ddd',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #eee',
                  borderRadius: '7px',
                  marginRight: '20px',
                }}
              >
                <span style={{ color: 'black' }}>거래완료</span>
              </div>
            )}
            {props.item.likedUsernames.length > 0 && (
              <>
                <span style={{ marginRight: '3px', fontSize: '18px' }}>
                  <FontAwesomeIcon icon={faHeart} />
                </span>
                <span style={{ color: 'black', fontSize: '18px' }}>{props.item.likedUsernames.length}</span>
              </>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}


export default App;


