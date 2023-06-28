/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { DropdownButton, Dropdown, ButtonGroup, Button, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

const Myshop = ({ pg, setPostId, postId }) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // 로컬 스토리지에서 사용자 이름을 가져옵니다.
  const username = localStorage.getItem('username');

  // 사용자 이름과 일치하는 authorUsername을 기준으로 내용을 필터링합니다.
  const filteredContent = pg ? pg.filter(
    (item) => item.authorUsername === username
  ) : [];

  let navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `http://13.209.183.88:8081/api/sell/${postId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        window.location.reload();
      } else {
        console.error('요청을 처리하는 중에 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('요청을 보내는 중에 오류가 발생했습니다.', error);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const token = localStorage.getItem('token');
      const url = `http://13.209.183.88:8081/api/sell/${postId}/status/${status}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('거래 상태가 변경되었습니다.');
        window.location.reload();
      } else {
        console.error('요청을 처리하는 중에 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('요청을 보내는 중에 오류가 발생했습니다.', error);
    }
  };

  let [state, setState] = useState("")

  useEffect(() => {
    if (postId) {
      if (state == "DELETE") {
        handleDelete();
      } else if (state == "SELLING") {
        handleStatusChange('SELLING');
      } else if (state == "RESERVED") {
        handleStatusChange('RESERVED');
      } else if (state == "COMPLETED") {
        handleStatusChange('COMPLETED');
      }
    }
  }, [postId]);


  return (
    <div
      style={{
        width: '45%',
        backgroundColor: '#F6F6f6',
        margin: 'auto',
        border: '1px solid #ddd',
        borderRadius: '15px',
        minHeight: '750px',
        padding: '30px 0',
      }}
    >

      <h4 style={{ paddingBottom: '30px', borderBottom: '1px solid #ddd', margin: '0' }}>나의 판매내역</h4>
      {filteredContent.map((item, i) => {
        // 날짜 계산 로직
        const detailDate = (dateString) => {
          const a = new Date(dateString);
          const milliSeconds = new Date() - a - (9 * 60 * 60 * 1000);
          const seconds = milliSeconds / 1000;
          if (seconds < 60) return `방금 전`;
          const minutes = seconds / 60;
          if (minutes < 60) return `${Math.floor(minutes)}분 전`;
          const hours = minutes / 60;
          if (hours < 24) return `${Math.floor(hours)}시간 전`;
          const days = hours / 24;
          if (days < 7) return `${Math.floor(days)}일 전`;
          const weeks = days / 7;
          if (weeks < 5) return `${Math.floor(weeks)}주 전`;
          const months = days / 30;
          if (months < 12) return `${Math.floor(months)}개월 전`;
          const years = days / 365;
          return `${Math.floor(years)}년 전`;
        };

        const nowDate = detailDate(item.createdAt);

        return (
          <div style={{ borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }} key={i}>
            <div style={{ padding: '15px' }}>
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: 'antiquewhite',
                }}
              >
                <img
                  src={item.imgPaths[0]}
                  style={{ width: '100%', minHeight: '150px', objectFit: 'cover' }}
                  alt="thumbnail"
                />
              </div>
            </div>
            <div style={{ paddingTop: '25px', paddingRight: '20px', textAlign: 'left', width: 'calc(100% - 300px)' }}>
              <Link className='Link' style={{ color: 'black' }}>
                <h5>{item.title}</h5>
              </Link>

              <p style={{ color: 'gray' }}>{item.region} ∙ {nowDate}</p>
              <div style={{ display: 'flex', marginTop: '10px', alignItems: "center" }}>
                {item.sellState === 'RESERVED' && (
                  <div
                    style={{
                      width: '70px',
                      height: '30px',
                      backgroundColor: '#0052A4',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px solid #eee',
                      borderRadius: '7px',
                      marginRight: '10px',
                    }}
                  >
                    <span style={{ color: 'white' }}>예약중</span>
                  </div>
                )}
                {item.sellState === 'COMPLETED' && (
                  <div
                    style={{
                      width: '80px',
                      height: '30px',
                      backgroundColor: '#ddd',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px solid #eee',
                      borderRadius: '7px',
                      marginRight: '10px',
                    }}
                  >
                    <span style={{ color: 'black' }}>거래완료</span>
                  </div>
                )}
                <h4 className='' style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {item.price.toLocaleString()}원
                </h4>
              </div>
            </div>

            <div style={{ width: '100px', padding: '', textAlign: 'right' }}>
              <DropdownButton title="" id="bg-nested-dropdown" size="sm" align="end" variant="secondary">
                <Dropdown.Item onClick={() => {
                  setPostId(item.id);
                  navigate('/edit');
                }} style={{ fontSize: '12px' }}>수정하기</Dropdown.Item>
                <Dropdown.Item onClick={() => {
                  const confirmation = window.confirm('삭제하시겠습니까?');
                  if (confirmation) {
                    setPostId(item.id);
                    setState("DELETE")
                  }
                }} style={{ fontSize: '12px' }}>삭제하기</Dropdown.Item>
                <Dropdown.Item onClick={() => {
                  setPostId(item.id);
                  setState("SELLING")
                }} style={{ fontSize: '12px' }}>판매중</Dropdown.Item>
                <Dropdown.Item onClick={() => {
                  setPostId(item.id);
                  setState("RESERVED")
                }} style={{ fontSize: '12px' }}>예약중</Dropdown.Item>
                <Dropdown.Item onClick={() => {
                  setPostId(item.id);
                  setState("COMPLETED")
                }} style={{ fontSize: '12px' }}>판매완료</Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
        );
      })}
    </div >
  );
};

export default Myshop;
