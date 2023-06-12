import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faCamera } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';


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

  const handleSubmit = (event) => {
    event.preventDefault();

    // 예시로 등록 완료 메시지 출력
    console.log('상품이 등록되었습니다.');

    // 등록 후 입력값 초기화
    setTitle('');
    setContent('');
    setImages([]);
    setImagePreviews([]);
    setSelectedRegion('');
    setSelectedDistrict('');
    setCategory('');
    setPrice('');
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

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
    // <div style={{ width: '72%', margin: 'auto', textAlign: 'left',backgroundColor : '#F6F6f6', borderRadius : '10px', padding : '10px' }}>
    <div style={{ width: '70%', margin: 'auto', textAlign: 'left' }}>
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