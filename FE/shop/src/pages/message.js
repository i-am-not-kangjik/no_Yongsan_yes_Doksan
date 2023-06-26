/*eslint-disable*/
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tab, Tabs, CloseButton, Button } from 'react-bootstrap';

export default function App(props) {

    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')

    const [sentMessages, setSentMessages] = useState([])
    const [receivedMessages, setReceivedMessages] = useState([]);

    useEffect(() => {

        const fetchSentMessages = async () => {
            try {
                const response = await axios.get(`http://13.209.183.88:8081/api/messages/sent/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const sentMessages = response.data;
                setSentMessages(sentMessages);
            } catch (error) {
                console.error('Error retrieving sent messages:', error);
            }
        };

        const fetchReceivedMessages = async () => {
            try {
                const response = await axios.get(`http://13.209.183.88:8081/api/messages/received/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const receivedMessages = response.data;
                setReceivedMessages(receivedMessages);
            } catch (error) {
                console.error('Error retrieving sent messages:', error);
            }
        };

        fetchSentMessages();
        fetchReceivedMessages();
    }, []);

    const detailDate = (a) => {
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

    const nowDate = detailDate(new Date("2023-06-25T12:08:11.911741"));

    // 쪽지 내용 보기
    let [m, setM] = useState(false)

    // 쪽지 내용
    let [content, setContent] = useState("")

    // 쪽지 내용 끄기 버튼
    const handleCloseClick = (itemContent) => {
        setMessage("")
        setReply(false);
        setM(false)
    };

    const handleContentClick = (itemContent) => {
        setContent(itemContent);
        setM(true)

    };

    // 받은 편지 보낸 편지 구분 
    let [sr, setSr] = useState('')

    const handleTabClickR = () => {
        setSr("r");
    };

    const handleTabClickS = () => {
        setSr("s");
    };

    // 답장 보기
    let [reply, setReply] = useState(false)

    let [receiverUsername, setreceiverUsername] = useState('')

    const handleReply = () => {
        setReply(true);
    };

    const [message, setMessage] = useState('');

    const handleSendMessage = async () => {
        const token = localStorage.getItem('token');
        const apiUrl = 'http://13.209.183.88:8081/api/messages';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        const messageData = {
            senderUsername: username,
            receiverUsername: receiverUsername,
            content: message,
        };

        try {
            await axios.post(apiUrl, messageData, { headers });
            alert('쪽지가 전송되었습니다.');
            setMessage('');
            setReply(false);
            setM(false);

            const fetchSentMessages = async () => {
                try {
                    const response = await axios.get(`http://13.209.183.88:8081/api/messages/sent/${username}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const sentMessages = response.data;
                    setSentMessages(sentMessages);
                } catch (error) {
                    console.error('Error retrieving sent messages:', error);
                }
            };
    
            const fetchReceivedMessages = async () => {
                try {
                    const response = await axios.get(`http://13.209.183.88:8081/api/messages/received/${username}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const receivedMessages = response.data;
                    setReceivedMessages(receivedMessages);
                } catch (error) {
                    console.error('Error retrieving sent messages:', error);
                }
            };
    
            fetchSentMessages();
            fetchReceivedMessages();
            // TODO: Handle successful message submission
        } catch (error) {
            console.error('Error sending message:', error);
            // TODO: Handle message submission error
        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };


    return (
        <div>
            {/* <CloseButton style={{ position: 'absolute', right: '-22px', top: "-22px",  }} onClick={() => { props.setMessage(false) }} /> */}
            <div style={{ width: '400px', minHeight: '400px', backgroundColor: '#D9E5FF', borderRadius: '10px', fontSize: "18px", boxShadow: 'rgba(136, 165, 191, 0.78) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px' }}>
                <Tabs
                    defaultActiveKey="받은 쪽지함"
                    className="mb-3"
                    justify
                >
                    <Tab eventKey="받은 쪽지함" title="받은 쪽지함" onClick={handleTabClickR}>                        <div style={{ display: 'flex', textAlign: 'center', paddingBottom: '7px', borderBottom: '1px solid #E7E7E7' }}>
                        <span style={{ width: '60%' }}>내용</span>
                        <span style={{ width: '20%' }}>보낸사람</span>
                        <span style={{ width: '20%' }}>날짜</span>
                    </div>
                        {receivedMessages.map((item, i) => (
                            <div
                                key={i}
                                style={{ display: 'flex', textAlign: 'center', padding: '0 10px', justifyContent: 'center', height: '45px', alignItems: 'center', borderBottom: '1px solid #E7E7E7' }}
                                onClick={() => {
                                    handleContentClick(item.content);
                                    setreceiverUsername(item.senderUsername);
                                }}
                            >
                                <p style={{ width: '60%', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.content}</p>
                                <p style={{ width: '20%', }}>{item.senderUsername}</p>
                                <p style={{ width: '20%', }}>{detailDate(new Date(item.createdAt))}</p>
                            </div>
                        ))}
                        <div style={{ width: '100%', height: '45px' }}></div>
                        {/* {
                            m == true ? <div style={{ width: '400px', minHeight: '200px', backgroundColor: 'beige', padding: '20px' }}>{content}</div> : null
                        } */}
                    </Tab>
                    <Tab eventKey="보낸 쪽지함" title="보낸 쪽지함" onClick={handleTabClickS}>
                        <div style={{ display: 'flex', textAlign: 'center', paddingBottom: '7px', borderBottom: '1px solid #E7E7E7' }}>
                            <span style={{ width: '60%' }}>내용</span>
                            <span style={{ width: '20%' }}>보낸사람</span>
                            <span style={{ width: '20%' }}>날짜</span>
                        </div>
                        {sentMessages.map((item, i) => (
                            <div
                                key={i}
                                style={{ display: 'flex', textAlign: 'center', padding: '0 10px', justifyContent: 'center', height: '45px', alignItems: 'center', borderBottom: '1px solid #E7E7E7' }}
                                onClick={() => handleContentClick(item.content)}
                            >
                                <p style={{ width: '60%', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.content}</p>
                                <p style={{ width: '20%', }}>{item.receiverUsername}</p>
                                <p style={{ width: '20%', }}>{detailDate(new Date(item.createdAt))}</p>
                            </div>
                        ))}
                        <div style={{ width: '100%', height: '45px' }}></div>

                    </Tab>
                </Tabs>
            </div>
            {
                m == true ? <div><div style={{ width: '400px', height: '360px', backgroundColor: '#EBF7FF', padding: '20px 35px', position: 'absolute', top: '45px', borderBottomRightRadius: "10px", borderBottomLeftRadius: "10px", textAlign: 'left', border: '1px solid #E7E7E7', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                    {content}
                    {
                        sr == "r" ? <span onClick={handleReply} style={{ position: 'absolute', bottom: '15px', right: '20px' }}>답장하기</span> : null
                    }

                </div>
                    <CloseButton style={{ position: 'absolute', right: '10px', top: "55px" }} onClick={() => { handleCloseClick(); }} />
                </div> : null
            }

            {
                reply == true ? <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', top: "410px", backgroundColor : '#EBF7FF', borderRadius : '10px', boxShadow: 'rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px' }}>
                    <textarea
                        className='sendInput_m'
                        type="text"
                        placeholder='내용 입력...'
                        rows={1}
                        style={{ border: 'none', outline: 'none', resize: 'none', paddingRight: '60px' }}
                        value={message}
                        onChange={handleMessageChange}
                    />
                    <span style={{ paddingRight : '10px' }} onClick={handleSendMessage}>전송</span>
                </div> : null
            }
        </div>
    );
}