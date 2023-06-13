// const express = require('express');
// const { Pool } = require('pg');

// const app = express();
// const port = 5001;

// // PostgreSQL 연결 풀 생성
// const pool = new Pool({
//   connectionString: 'postgresql://postgres:ghkdlxld2@@database-1.csps6yjojtzn.ap-northeast-2.rds.amazonaws.com:5432/playdata',
// });

// const cors = require('cors');

// app.use(
//   cors({
//     origin: 'http://localhost:3000', // 사용하는 React 앱의 주소로 대체하세요
//   })
// );

// // 네 개의 테이블에서 데이터를 가져오는 API 엔드포인트
// app.get('/api/data', (req, res) => {
//   // 연결 풀을 사용하여 데이터베이스 쿼리 실행
//   const sellQuery = 'SELECT * FROM sell';
//   const userQuery = 'SELECT * FROM member'; // "user"는 예약어이므로 이중 따옴표(")로 묶어야 합니다.
//   const commentQuery = 'SELECT * FROM comment';
//   const userLikesSellQuery = 'SELECT * FROM user_likes_sell';

//   Promise.all([
//     pool.query(sellQuery),
//     pool.query(userQuery),
//     pool.query(commentQuery),
//     pool.query(userLikesSellQuery),
//   ])
//     .then(([sellResult, userResult, commentResult, userLikesSellResult]) => {
//       const sellData = sellResult.rows;
//       const userData = userResult.rows;
//       const commentData = commentResult.rows;
//       const userLikesSellData = userLikesSellResult.rows;

//       res.json({ sellData, userData, commentData, userLikesSellData });
//     })
//     .catch((error) => {
//       console.error('쿼리 실행 오류', error);
//       res.status(500).json({ error: '쿼리 실행 중 오류가 발생했습니다' });
//     });
// });

// app.listen(port, () => {
//   console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
// });




// // node /Users/leebyeongho/Desktop/no_Yongsan_yes_Doksan/FE/shop/src/server.js
