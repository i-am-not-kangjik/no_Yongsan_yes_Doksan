import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faCamera } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import axios from 'axios';


const Post = () => {
  const imageUploadRef = useRef(null);
  const [title, setTitle] = useState(''); // 제목
  const [showWarningT, setShowWarningT] = useState(false); // 제목 경고 state
  const [content, setContent] = useState(''); // 내용
  const [showWarningC, setShowWarningC] = useState(false); // 내용 경고 state
  const [images, setImages] = useState([]); // 이미지
  const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기
  const [selectedRegion, setSelectedRegion] = useState(''); // 선택된 지역
  const [selectedDistrict, setSelectedDistrict] = useState(''); // 선택된 구역
  const [category, setCategory] = useState(''); // 카테고리
  const [price, setPrice] = useState(''); // 가격
  const [showWarningP, setShowWarningP] = useState(false); // 가격 경고 state


  const saveFormData = async () => {
    try {
      // 백엔드 서버 엔드포인트로 API 요청을 보냅니다
      const response = await axios.post('http://localhost:8081/api/sell', {
        title: title,
        content: content,
        images: images,
        region: selectedRegion + selectedDistrict,
        category: category,
        price: price,
      });
  
      // 필요한 경우 응답을 처리합니다
  
      // 사용자에게 성공 메시지를 표시합니다
      alert('제품이 등록되었습니다.');
  
      // 폼 값 초기화
      setImages([]);
      setImagePreviews([]);
      setTitle('');
      setCategory('');
      setSelectedRegion('');
      setSelectedDistrict('');
      setPrice('');
      setContent('');
    } catch (error) {
      // API 요청 중 발생한 오류를 처리합니다
      console.log(error);
      alert('데이터 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (images.length < 1) {
      alert('이미지를 업로드해주세요');
      return;
    } else if (title.length < 1) {
      alert('제목을 입력해주세요');
      return;
    } else if (category.trim() === '') {
      alert('카테고리를 선택해주세요');
      return;
    } else if (price < 1000) {
      alert('가격을 입력해주세요');
      return;
    } else if (selectedRegion.trim() === '') {
      alert('지역을 선택해주세요');
      return;
    } else if (selectedDistrict.trim() === '') {
      alert('지역을 선택해주세요');
      return;
    } else if (content.length < 10) {
      alert('상세 내용을 입력해주세요');
      return;
    }
  
    // 백엔드에 데이터 저장을 위해 saveFormData 함수 호출
    saveFormData();
  };
  

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const gangwon = ["강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시", "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군"];
  const gyeonggi = ["고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시", "가평군", "양평군", "여주군", "연천군"];
  const gyeongsangnam = ["거제시", "김해시", "마산시", "밀양시", "사천시", "양산시", "진주시", "진해시", "창원시", "통영시", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군", "하동군", "함안군", "함양군", "합천군"];
  const gyeongsangbuk = ["경산시", "경주시", "구미시", "김천시", "문경시", "상주시", "안동시", "영주시", "영천시", "포항시", "고령군", "군위군", "봉화군", "성주군", "영덕군", "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군"];
  const gwangju = ["광산구", "남구", "동구", "북구", "서구"];
  const daegu = ["남구", "달서구", "동구", "북구", "서구", "수성구", "중구", "달성군"];
  const daejeon = ["대덕구", "동구", "서구", "유성구", "중구"];
  const busan = ["강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구", "기장군"];
  const seoul = ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"];
  const ulsan = ["남구", "동구", "북구", "중구", "울주군"];
  const incheon = ["계양구", "남구", "남동구", "동구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"];
  const jeonnam = ["광양시", "나주시", "목포시", "순천시", "여수시", "강진군", "고흥군", "곡성군", "구례군", "담양군", "무안군", "보성군", "신안군", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"];
  const jeonbuk = ["군산시", "김제시", "남원시", "익산시", "전주시", "정읍시", "고창군", "무주군", "부안군", "순창군", "완주군", "임실군", "장수군", "진안군"];
  const jeju = ["서귀포시", "제주시", "남제주군", "북제주군"];
  const chungnam = ['공주시', '논산시', '보령시', '서산시', '아산시', '천안시', '금산군', '당진군', '부여군', '서천군', '연기군', '예산군', '청양군', '태안군', '홍성군'];
  const chungbuk = ["제천시", "청주시", "충주시", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "증평군", "진천군", "청원군"];

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files);

    if (selectedImages.length > 0) {
      const totalImages = images.length + selectedImages.length;
      if (totalImages > 11) {
        alert("사진 첨부는 최대 11장까지 가능합니다.");
        return;
      }
    }

    const allImages = [...images, ...selectedImages];
    setImages(allImages);

    const readerPromises = allImages.map((image) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    });

    Promise.all(readerPromises)
      .then((results) => {
        setImagePreviews(results);
      })
      .catch((error) => {
        console.error('이미지 파일을 읽는 중 오류가 발생했습니다:', error);
      });
  };

  const handleImageDelete = (event, index) => {
    event.preventDefault();

    // 선택한 인덱스의 이미지와 미리보기를 삭제합니다.
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const handlePriceChange = (event) => {
    const inputPrice = event.target.value;
    const numericPrice = inputPrice.replace(/,/g, '').replace(/[^0-9]/g, '');
    const formattedPrice = numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (inputPrice.replaceAll(',', '') !== numericPrice) {
      alert("숫자만 입력해주세요.");
    }

    if (numericPrice < 1000) {
      setShowWarningP(true);
    } else {
      setShowWarningP(false);
    }

    setPrice(formattedPrice);
  };

  const handleContentChange = (event) => {
    const inputContent = event.target.value;
    setContent(inputContent);

    // content의 길이가 10자 미만인 경우 경고 표시
    if (inputContent.length < 10) {
      setShowWarningC(true);
    } else {
      setShowWarningC(false);
    }
  };

  const handleTitleChange = (event) => {
    const inputTitle = event.target.value;
    setTitle(inputTitle);

    // content의 길이가 10자 미만인 경우 경고 표시
    if (inputTitle.length < 2) {
      setShowWarningT(true);
    } else {
      setShowWarningT(false);
    }
  };

  return (
    <div style={{ width: '72%', margin: 'auto', textAlign: 'left',backgroundColor : '#F6F6f6', borderRadius : '10px', padding : '10px' }}>
    {/* <div style={{ width: '70%', margin: 'auto', textAlign: 'left' }}> */}
      <h2 style={{ borderBottom: '3px solid', padding: '30px 0' }}>상품 등록</h2>
      <form onSubmit={handleSubmit}>

        <div className='post_box' style={{ paddingBottom: '20px' }}>
          <div className='post_box_left'>
            <label htmlFor="image" style={{ marginBottom: '10px' }}>상품이미지 <span style={{ fontSize : '15px', color : 'gray' }}>({images.length}/11개)</span></label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              multiple
              ref={imageUploadRef}
              style={{ display: 'none' }}
            />
          </div>

          <div className='post_box_right'>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div
                className='post_img_box'
                style={{
                  width: '200px',
                  height: '200px',
                  backgroundColor: '#eee',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
                onClick={() => imageUploadRef.current.click()}
              >
                <FontAwesomeIcon icon={faCamera} size='2x' />
                <p style={{ marginTop : '5px' }}>사진 선택</p>
              </div>
              {imagePreviews.length > 0 && (
                imagePreviews.map((preview, index) => (
                  <div
                    className='post_img_box'
                    key={index}
                    style={{
                      position: 'relative',
                      width: '200px',
                      height: '200px',
                    }}
                  >
                    <img
                      src={preview}
                      alt={`미리보기 ${index + 1}`}
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                    <Link
                      onClick={(event) => handleImageDelete(event, index)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        padding: '5px',
                        color: '#eee'
                      }}
                    >
                      <FontAwesomeIcon icon={faCircleXmark} />
                    </Link>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>


        <div className='post_box'>
          <div className='post_box_left text_center'>
            <label htmlFor="title">제목</label>
          </div>
          <div className='post_box_right'>
            <input
              type="text"
              id="title"
              value={title}
              placeholder='상품 제목을 입력해주세요.'
              onChange={((event) => setTitle(event.target.value), handleTitleChange)}
            />
            {showWarningT && <p style={{ color: 'orange' }}>2글자 이상 입력해주세요.</p>}
          </div>
        </div>

        <div className='post_box'>
          <div className='post_box_left'>
            <label htmlFor="category">카테고리 선택</label>
          </div>
          <div className='post_box_right'>
            <select
              id="category"
              value={category}
              style={{ height : '25px' }}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">-- 선택하세요 --</option>
              <option value="clothing">노트북</option>
              <option value="appliances">핸드폰</option>
              <option value="books">태블릿</option>
              <option value="furniture">스마트워치</option>
              <option value="miscellaneous">블루투스이어폰</option>
            </select>
          </div>


        </div>

        <div className='post_box'>
          <div className='post_box_left text_center'>
            <label htmlFor="price">가격</label>
          </div>
          <div className='post_box_right'>
            <input
              type="text"
              id="price"
              value={price}
              style={{ width: '25%', }}
              placeholder='숫자만 입력해주세요.'
              onChange={handlePriceChange}
            /> 원
            {showWarningP && <p style={{ color: 'orange' }}>1000원 이상 입력해주세요.</p>}
          </div>
        </div>

        <div className='post_box'>
          <div style={{ width: '20%' }}>
            <label htmlFor="region">지역 선택</label>
            <select
              id="region"
              value={selectedRegion}
              onChange={handleRegionChange}
              style={{ marginLeft : '10px', height : '25px' }}
            >
              <option value="">시/도 선택</option>
              <option value="gangwon">강원</option>
              <option value="gyeonggi">경기</option>
              <option value="gyeongsangnam">경남</option>
              <option value="gyeongsangbuk">경북</option>
              <option value="gwangju">광주</option>
              <option value="daegu">대구</option>
              <option value="daejeon">대전</option>
              <option value="busan">부산</option>
              <option value="seoul">서울</option>
              <option value="ulsan">울산</option>
              <option value="incheon">인천</option>
              <option value="jeonnam">전남</option>
              <option value="jeonbuk">전북</option>
              <option value="jeju">제주</option>
              <option value="chungnam">충남</option>
              <option value="chungbuk">충북</option>
            </select>
          </div>

          <div>
            <label htmlFor="district">구역 선택</label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              style={{ marginLeft : '10px', height : '25px' }}
            >
              <option value="">시/군/구 선택</option>
              {selectedRegion === 'gangwon' &&
                gangwon.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'gyeonggi' &&
                gyeonggi.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'gyeongsangnam' &&
                gyeongsangnam.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'gyeongsangbuk' &&
                gyeongsangbuk.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'gwangju' &&
                gwangju.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'daegu' &&
                daegu.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'daejeon' &&
                daejeon.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'busan' &&
                busan.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'seoul' &&
                seoul.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'ulsan' &&
                ulsan.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'incheon' &&
                incheon.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'jeonnam' &&
                jeonnam.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'jeonbuk' &&
                jeonbuk.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'jeju' &&
                jeju.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'chungnam' &&
                chungnam.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === 'chungbuk' &&
                chungbuk.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className='post_box'>
          <div className='post_box_left'>
            <label htmlFor="content">설명</label>
          </div>
          <div className='post_box_right'>
            <textarea
              id="content"
              value={content}
              rows={6}
              placeholder='상품에 대한 설명을 적어주세요.'
              style={{ width: '80%', padding: '5px', overflow: 'auto' }}
              onChange={((event) => setContent(event.target.value), handleContentChange)}
            />
            {showWarningC && <p style={{ color: 'orange' }}>내용은 최소 10자 이상이어야 합니다.</p>}
          </div>
        </div>
        <div style={{ padding: '30px', borderTop: '3px solid', textAlign: 'right' }}>
          <Button type="submit" style={{ width: '150px', height: '50px', backgroundColor: '#0052A4' }}>등록하기</Button>
        </div>
      </form>
    </div>
  );
};

export default Post;