import React from 'react';
import { Link } from 'react-router-dom';

const Myshop = ({ pg }) => {
  // 로컬 스토리지에서 사용자 이름을 가져옵니다.
  const username = localStorage.getItem('username');

  // 사용자 이름과 일치하는 authorUsername을 기준으로 내용을 필터링합니다.
  const filteredContent = pg.content ? pg.content.filter(
    (item) => item.authorUsername === username
  ) : [];  

  return (
    <div
      style={{
        width: '50%',
        backgroundColor: '#F6F6f6',
        margin: 'auto',
        border: '1px solid #ddd',
        borderRadius: '15px',
        minHeight: '750px',
        padding: '40px 0',
      }}
    >
      <h3 style={{ paddingBottom: '50px', borderBottom: '1px solid gray', margin: '0' }}>나의 판매내역</h3>
      {filteredContent.map((item, i) => {
        // 날짜 계산 로직
        const detailDate = (dateString) => {
          const a = new Date(dateString);
          const milliSeconds = new Date() - a;
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
          <div style={{ borderBottom: '1px solid gray', display: 'flex' }} key={i}>
            <div style={{ padding: '20px' }}>
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: 'antiquewhite',
                }}
              >
                <img
                    src={item.imgPaths[0]}
                    style={{ width: '100%', minHeight: '200px', objectFit: 'cover' }}
                    alt="thumbnail"
                  />
              </div>
            </div>
            <div style={{ paddingTop: '30px', paddingRight: '20px', textAlign: 'left' }}>
              <Link className='Link' style={{ color: 'black' }}>
                <h3>{item.title}</h3>
              </Link>
              <p style={{ color: 'gray' }}>{item.region} ∙ {nowDate}</p>
              <div style={{ display: 'flex', marginTop: '15px' }}>
                {item.sellState === 'RESERVED' && (
                  <div
                    style={{
                      width: '80px',
                      height: '30px',
                      backgroundColor: '#65D35D',
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
                {item.sellState === 'SOLD_OUT' && (
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
                <h4 className='' style={{ fontSize: '25px', fontWeight: 'bold' }}>
                  {item.price.toLocaleString()}원
                </h4>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Myshop;
