/*eslint-disable*/
import React, {useState, useEffect} from 'react';
import Loading from './pages/loading';

export const App = () => {
const [loading, setLoading] = useState(false);

const mainApi = async () => {
	setLoading(true); // api 호출 전에 true로 변경하여 로딩화면 띄우기
    try {
      const response = await fetch(`api url`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      });

      const result = await response.json();
      console.log('mainData', result);
      setLoading(false); // api 호출 완료 됐을 때 false로 변경하려 로딩화면 숨김처리
    } catch (error) {
      window.alert(error);
    }
};

    useEffect(() => {
        mainApi();
    }, []);

    return (
    <div>
      {loading ? <Loading /> : null} // Loading이 true면 컴포넌트를 띄우고, false면 null(빈 값)처리 하여 컴포넌트 숨김
      <div>페이지 내용들</div>
    </div>
    );
};

export default App;
