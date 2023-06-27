/*eslint-disable*/
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Carousel, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faHeart, faComment } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

function Detail(props) {

    let navigate = useNavigate();

    const item = props.cd.find(item => item.id === props.id);

    const username = localStorage.getItem('username')

    const token = localStorage.getItem('token')

    // 쪽지기능
    const [content, setContent] = useState('');
    const [showMessageInput, setShowMessageInput] = useState(false);
    
    const handleSendMessageClick = () => {
      setShowMessageInput(true);
    };
    
    const handleMessageInputChange = (e) => {
      setContent(e.target.value);
    };
    
    const handleSendMessage = async () => {
        const token = localStorage.getItem('token');
        const apiUrl = 'http://13.209.183.88:8081/api/messages';
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };
      
        const messageData = {
          senderUsername: username,
          receiverUsername: item.authorUsername,
          content: content,
        };
      
        try {
          const response = await axios.post(apiUrl, JSON.stringify(messageData), { headers });
          alert("쪽지가 전송되었습니다.")
          setContent("")
          console.log(item.authorUsername)
          // TODO: Handle successful message submission
        } catch (error) {
          console.error('Error sending message:', error);
          // TODO: Handle message submission error
        }
      };

    // 찜기능
    const handleLike = () => {
        const url = `http://13.209.183.88:8081/api/sell/${item.id}/like`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Post liked successfully!');
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
                                window.location.reload()
                            } else {
                                props.setPg(response.data);
                                props.setCd(response.data);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    };

                    fetchData();
                } else {
                    console.error('Error liking the post.');
                    props.setblur(false)
                    navigate('/signin');
                }
            })
            .catch((error) => {
                console.error('Error liking the post:', error);
            });
    };

    // 최근 본 상품 3개까지만 나오고 중복 안되게
    useEffect(() => {
        let copy = [...props.recentList];
        const newElement = item.id;
        if (!copy.includes(newElement)) {
            copy.unshift(newElement);
            if (copy.length > 3) {
                copy = copy.slice(0, 3); // Keep only the first 3 elements in the array
            }
            props.setRecentList(copy);
            localStorage.setItem('watched', JSON.stringify(copy));
        }
    }, []);


    const detailDate = (a) => {
        const milliSeconds = new Date() - a - (9 * 60 * 60 * 1000); // Add 9 hours in milliseconds
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
      
      const nowDate = detailDate(new Date(item.createdAt));
      

    const price = String(item.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return (
        <div className='detail'>
            <Carousel variant="light" style={{ width: '65%' }} prevIcon={<FontAwesomeIcon icon={faCircleArrowLeft} size='2x' />} nextIcon={<FontAwesomeIcon icon={faCircleArrowLeft} rotation={180} size='2x' />}>
                {
                    item.imgPaths.map(function (url, i) {
                        return (
                            <Carousel.Item key={i}>
                                <img
                                    className="d-block w-100 detail_img"
                                    src={url}
                                    alt="First slide"
                                />
                            </Carousel.Item>
                        )
                    })
                }
            </Carousel>
            <div style={{ width: '35%', padding: '15px 15px 0', textAlign: 'left' }}>
                <div className='detail_margin'>
                    <h4 className='detail_title'>{item.title}</h4>
                </div>

                <div className='detail_margin grey'>
                    <p className='detail_ct'>{item.category} ∙ {nowDate}</p>
                </div>

                <div className='detail_margin'>
                    <h4 className='detail_price maincolor' style={{ fontWeight: 'bold' }}>{price}원</h4>
                </div>

                <div className='detail_margin' style={{ padding: '30px 0', lineHeight: '1.8' }}>
                    <p className='detail_content'>{item.content}</p>
                </div>
                <div className='detail_margin grey' style={{ fontSize: '14px', marginBottom: '25px' }}>
                    <p className='detail_price'>관심 {item.likedUsernames.length} ∙ 조회 {item.viewCount}</p>
                </div>
                <OverlayTrigger
                    trigger="click"
                    key={'bottom'}
                    placement={'bottom'}
                    rootCloseEvent="rootCloseEvent"
                    overlay={
                        <Tooltip id={`tooltip-bottom`}>
                            {item.likedUsernames.includes(username) ? (
                                <span>상품이 <strong>찜</strong>되었습니다.</span>
                            ) : (
                                <span><strong>찜</strong>이 해제되었습니다.</span>

                            )}
                        </Tooltip>
                    }>
                    {
                        item.likedUsernames.includes(username) ? <span style={{ fontSize: '30px', }} onClick={handleLike}><FontAwesomeIcon icon={faHeart} style={{ color: 'red' }} /></span>
                            : <span style={{ fontSize: '30px' }} onClick={handleLike}><FontAwesomeIcon icon={faHeart} /></span>
                    }
                </OverlayTrigger>
                <span
                            style={{ fontSize: '30px', marginLeft: '20px' }}
                            onClick={handleSendMessageClick}
                        >
                            <FontAwesomeIcon icon={faComment} />
                        </span>
                
                <div style={{ display : 'flex', position: 'absolute', bottom: 0, alignItems: 'center', borderTop: '1px solid #eee'}}>
                    {/* Other detail content */}
                    {showMessageInput ? (
                        <>
                            <textarea
                                className='sendInput'
                                type="text"
                                value={content}
                                placeholder='내용 입력...'
                                onChange={handleMessageInputChange}
                                rows={1}
                                style={{ border: 'none', outline: 'none', resize: 'none' }}
                            />
                            <p onClick={handleSendMessage}>전송</p>
                        </>
                    ) : (
                        null
                    )}
                </div>
            </div>
        </div>
    );
}

export default Detail;
