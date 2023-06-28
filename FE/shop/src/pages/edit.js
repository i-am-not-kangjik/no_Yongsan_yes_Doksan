/*eslint-disable*/
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faCamera } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';

const Edit = ({ postId }) => {
  const imageUploadRef = useRef(null);
  const [title, setTitle] = useState(''); // 제목
  const [showWarningT, setShowWarningT] = useState(false); // 제목 경고 state
  const [content, setContent] = useState(''); // 내용
  const [showWarningC, setShowWarningC] = useState(false); // 내용 경고 state
  const [showWarningL, setShowWarningL] = useState(false); // 내용 경고 state

  const [images, setImages] = useState([]); // 이미지
  const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기
  const [selectedRegion, setSelectedRegion] = useState(''); // 선택된 지역
  const [selectedDistrict, setSelectedDistrict] = useState(''); // 선택된 구역
  const [category, setCategory] = useState(''); // 카테고리
  const [price, setPrice] = useState(''); // 가격
  const [showWarningP, setShowWarningP] = useState(false); // 가격 경고 state

  let navigate = useNavigate();

  // 글자 수 제한
  let [inputCount, setInputCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchPostData = async () => {

      try {
        const response = await fetch(`http://13.209.183.88:8081/api/sell/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const { title, content, price, region, category, imgPaths } = data;

          setTitle(title);
          setContent(content);
          setPrice(String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
          const [regionName, districtName] = (region).split(' ');
          setSelectedRegion(regionName);
          setSelectedDistrict(districtName);
          setCategory(category);
          setInputCount(content.length);
        } else {
          console.error('Failed to fetch post data');
        }
      } catch (error) {
        console.error('Error fetching post data', error);
      }
    };
    fetchPostData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUploadRef.current.files.length < 1) {
      alert('이미지를 업로드해주세요.');
      return;
    } else if (title.trim() === '') {
      alert('제목을 입력해주세요.');
      return;
    } else if (category.trim() === '') {
      alert('카테고리를 선택해주세요.');
      return;
    } else if (price.trim() === '' || price < 1000) {
      alert('가격을 입력해주세요.');
      return;
    } else if (selectedRegion.trim() === '' || selectedDistrict.trim() === '') {
      alert('지역을 선택해주세요.');
      return;
    } else if (content.trim() === '' || content.length < 10) {
      alert('내용을 입력해주세요.');
      return;
    } else if (content.trim() === '' || content.length > 500) {
      alert('글자수 제한을 확인해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('price', price.replace(/,/g, ''));
    formData.append('region', selectedRegion + ' ' + selectedDistrict);
    formData.append('category', category);

    for (let i = 0; i < images.length; i++) {
      formData.append('files', images[i]);
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://13.209.183.88:8081/api/sell/${postId}`, {
        method: 'PUT',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      // Handle the response as needed
      if (response.ok) {
        // Request successful
        alert("상품이 수정되었습니다.");
        console.log('상품이 수정되었습니다.');
        window.location.href = '/myshop';
      } else {
        // Request failed
        alert("상품 등록 중 오류가 발생했습니다.");
      }
    } catch (error) {
      alert("상품 등록 중 오류가 발생했습니다.");
      console.error('상품 등록 중 오류가 발생했습니다.', error);
    }
  };



  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const 강원도 = ["강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시", "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군"];
  const 경기도 = ["고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시", "가평군", "양평군", "여주군", "연천군"];
  const 경상남도 = ["거제시", "김해시", "마산시", "밀양시", "사천시", "양산시", "진주시", "진해시", "창원시", "통영시", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군", "하동군", "함안군", "함양군", "합천군"];
  const 경상북도 = ["경산시", "경주시", "구미시", "김천시", "문경시", "상주시", "안동시", "영주시", "영천시", "포항시", "고령군", "군위군", "봉화군", "성주군", "영덕군", "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군"];
  const 광주광역시 = ["광산구", "남구", "동구", "북구", "서구"];
  const 대구광역시 = ["남구", "달서구", "동구", "북구", "서구", "수성구", "중구", "달성군"];
  const 대전광역시 = ["대덕구", "동구", "서구", "유성구", "중구"];
  const 부산광역시 = ["강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구", "기장군"];
  const 서울특별시 = ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"];
  const 울산광역시 = ["남구", "동구", "북구", "중구", "울주군"];
  const 인천광역시 = ["계양구", "남구", "남동구", "동구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"];
  const 전라남도 = ["광양시", "나주시", "목포시", "순천시", "여수시", "강진군", "고흥군", "곡성군", "구례군", "담양군", "무안군", "보성군", "신안군", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"];
  const 전라북도 = ["군산시", "김제시", "남원시", "익산시", "전주시", "정읍시", "고창군", "무주군", "부안군", "순창군", "완주군", "임실군", "장수군", "진안군"];
  const 제주특별자치도 = ["서귀포시", "제주시", "남제주군", "북제주군"];
  const 충청남도 = ['공주시', '논산시', '보령시', '서산시', '아산시', '천안시', '금산군', '당진군', '부여군', '서천군', '연기군', '예산군', '청양군', '태안군', '홍성군'];
  const 충청북도 = ["제천시", "청주시", "충주시", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "증평군", "진천군", "청원군"];

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
    setInputCount(inputContent.length);

    if (inputContent.length > 500) {
      setShowWarningL(true);
    } else {
      setShowWarningL(false);
    }

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
    <div style={{ width: '900px', margin: 'auto', textAlign: 'left',backgroundColor : '#F6F6f6', borderRadius : '10px', padding : '10px 30px' }}>
    <h3 style={{ borderBottom: '3px solid', padding: '20px 0' }}>상품 등록</h3>
    <form onSubmit={handleSubmit}>

      <div className='post_box' style={{ paddingBottom: '20px' }}>
        <div className='post_box_left'>
          <label htmlFor="image" style={{ marginBottom: '10px' }}>상품이미지 <span style={{ fontSize: '15px', color: 'gray' }}>({images.length}/11개)</span></label>
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
                width: '150px',
                height: '150px',
                backgroundColor: '#eee',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
              onClick={() => imageUploadRef.current.click()}
            >
              <FontAwesomeIcon icon={faCamera} style={{ fontSize: '30px' }} />
              <p style={{ marginTop: '5px' }}>사진 선택</p>
            </div>
            {imagePreviews.length > 0 && (
              imagePreviews.map((preview, index) => (
                <div
                  className='post_img_box'
                  key={index}
                  style={{
                    position: 'relative',
                    width: '150px',
                    height: '150px',
                  }}
                >
                  <img
                    src={preview}
                    alt={`미리보기 ${index + 1}`}
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
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
              value={category} // 변경된 부분
              style={{ height: '25px' }}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">-- 선택하세요 --</option>
              <option value="노트북">노트북</option>
              <option value="핸드폰">핸드폰</option>
              <option value="태블릿">태블릿</option>
              <option value="스마트워치">스마트워치</option>
              <option value="블루투스이어폰">블루투스이어폰</option>
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
          <div style={{ marginRight: '10px' }}>
            <label htmlFor="region">지역 선택</label>
            <select
              id="region"
              value={selectedRegion}
              onChange={handleRegionChange}
              style={{ marginLeft: '10px', height: '25px' }}
            >
              <option value="">시/도 선택</option>
              <option value="강원도">강원도</option>
              <option value="경기도">경기도</option>
              <option value="경상남도">경상남도</option>
              <option value="경상북도">경상북도</option>
              <option value="광주광역시">광주광역시</option>
              <option value="대구광역시">대구광역시</option>
              <option value="대전광역시">대전광역시</option>
              <option value="부산광역시">부산광역시</option>
              <option value="서울특별시">서울특별시</option>
              <option value="울산광역시">울산광역시</option>
              <option value="인천광역시">인천광역시</option>
              <option value="전라남도">전라남도</option>
              <option value="전라북도">전라북도</option>
              <option value="충청남도">충청남도</option>
              <option value="충청북도">충청북도</option>
              <option value="제주특별자치도">제주특별자치도</option>
            </select>
          </div>

          <div>
            <label htmlFor="district"></label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              style={{ marginLeft: '10px', height: '25px' }}
            >
              <option value="">시/군/구 선택</option>
              {selectedRegion === '강원도' &&
                강원도.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '경기도' &&
                경기도.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '경상남도' &&
                경상남도.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '경상북도' &&
                경상북도.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '광주광역시' &&
                광주광역시.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '대구광역시' &&
                대구광역시.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '대전광역시' &&
                대전광역시.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '부산광역시' &&
                부산광역시.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '서울특별시' &&
                서울특별시.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '울산광역시' &&
                울산광역시.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '인천광역시' &&
                인천광역시.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '전라남도' &&
                전라남도.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '전라북도' &&
                전라북도.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '제주특별자치도' &&
                제주특별자치도.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '충청남도' &&
                충청남도.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              {selectedRegion === '충청북도' &&
                충청북도.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className='post_box'>
          <div className='post_box_left'>
            <label htmlFor="content">설명<span style={{ fontSize: '15px', color: 'gray', marginLeft: '5px' }}>({inputCount}/500)</span></label>
          </div>
          <div className='post_box_right'>
            <textarea
              id="content"
              value={content}
              rows={6}
              placeholder='상품에 대한 설명을 적어주세요.'
              style={{ width: '80%', padding: '5px', overflow: 'auto', resize: 'none' }}
              onChange={((event) => setContent(event.target.value), handleContentChange)}
            />
            {showWarningC && <p style={{ color: 'orange' }}>내용은 최소 10자 이상이어야 합니다.</p>}
            {showWarningL && <p style={{ color: 'orange' }}>내용은 최대 500글자입니다.</p>}
          </div>
        </div>
        <div style={{ padding: '30px', borderTop: '3px solid', textAlign: 'right' }}>
          <Button type="submit" style={{ width: '150px', height: '50px', backgroundColor: '#0052A4' }}>등록하기</Button>
        </div>
      </form>
    </div>
  );
};

export default Edit;