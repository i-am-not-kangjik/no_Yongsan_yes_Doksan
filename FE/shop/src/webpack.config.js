
  

  const path = require('path');

  module.exports = {
    entry: './src/index.js', // 진입점 파일 경로
    output: {
      path: path.resolve(__dirname, 'dist'), // 출력 경로
      filename: 'bundle.js', // 번들 파일 이름
    },
    module: {
      rules: [
        // 로더 설정을 추가할 수 있습니다.
        {
          test: /\.js$/, // 일치하는 파일 확장자
          exclude: /node_modules/, // 제외할 경로
          use: 'babel-loader', // 사용할 로더
        },
      ],
    },
    fallback: {
        crypto: require.resolve('crypto-browserify')
      }
    // 플러그인 설정을 추가할 수 있습니다.
  };