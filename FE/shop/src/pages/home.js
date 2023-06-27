import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import SwiperCore, { Mousewheel, Pagination } from "swiper/core";

// Install Swiper modules
SwiperCore.use([Mousewheel, Pagination]);

export default function App() {
    return (
        <>
            <Swiper
                direction={"vertical"}
                slidesPerView={1}
                spaceBetween={30}
                mousewheel={true}
                pagination={{
                    clickable: true,
                }}
                navigation={false}
                className="mySwiper"
                style={{ width: '100vw', height: '100vh', marginTop: '-20px', color: '' }}
            >
                <SwiperSlide style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url()`,
                    backgroundColor: '#BFEAFF'
                }}>
                    <div style={{ width: '', textAlign: 'left', marginBottom: '200px' }}>
                        <h1 style={{ fontSize: '45px', fontWeight: 'bold' }}>전자기기 중고 가격 산정, 고민 해결</h1>
                        <p style={{ fontSize: '30px', fontWeight: 'bold' }}>용산위에 독산</p>
                    </div>
                    <div style={{ width: '50%', height: '100%', textAlign: 'left',backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(https://github.com/i-am-not-kangjik/no_Yongsan_yes_Doksan/blob/main/FE/shop/src/img/mac.png?raw=true)`, }}>
                    </div>
                </SwiperSlide>
                <SwiperSlide style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url()`,
                    backgroundColor: '#BFEAFF'
                }}>
                    <div style={{ width: '', textAlign: 'left', marginBottom: '200px' }}>
                        <h1 style={{ fontSize: '45px', fontWeight: 'bold' }}>전자기기 중고 가격 산정, 고민 해결</h1>
                        <p style={{ fontSize: '30px', fontWeight: 'bold' }}>용산위에 독산</p>
                    </div>
                    <div style={{ width: '50%', height: '100%', textAlign: 'left',backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(https://d1unjqcospf8gs.cloudfront.net/assets/home/main/3x/image-top-d6869a79bc4cb58ea59aa5a408decfdf4a4ba60ac639837081da12861083cdbb.webp)`, }}>
                    </div>
                </SwiperSlide>
                <SwiperSlide style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url()`,
                    backgroundColor: '#BFEAFF'
                }}>
                    <div style={{ width: '', textAlign: 'left', marginBottom: '200px' }}>
                        <h1 style={{ fontSize: '45px', fontWeight: 'bold' }}>전자기기 중고 가격 산정, 고민 해결</h1>
                        <p style={{ fontSize: '30px', fontWeight: 'bold' }}>용산위에 독산</p>
                    </div>
                    <div style={{ width: '50%', height: '100%', textAlign: 'left',backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(https://d1unjqcospf8gs.cloudfront.net/assets/home/main/3x/image-top-d6869a79bc4cb58ea59aa5a408decfdf4a4ba60ac639837081da12861083cdbb.webp)`, }}>
                    </div>
                </SwiperSlide>
                <SwiperSlide style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url()`,
                    backgroundColor: '#BFEAFF'
                }}>
                    <div style={{ width: '', textAlign: 'left', marginBottom: '200px' }}>
                        <h1 style={{ fontSize: '45px', fontWeight: 'bold' }}>전자기기 중고 가격 산정, 고민 해결</h1>
                        <p style={{ fontSize: '30px', fontWeight: 'bold' }}>용산위에 독산</p>
                    </div>
                    <div style={{ width: '50%', height: '100%', textAlign: 'left',backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(https://d1unjqcospf8gs.cloudfront.net/assets/home/main/3x/image-top-d6869a79bc4cb58ea59aa5a408decfdf4a4ba60ac639837081da12861083cdbb.webp)`, }}>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    );
}
