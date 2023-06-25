import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import SwiperCore, { Mousewheel, Pagination } from "swiper/core";

import "./App.css";

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
        style={{ width: '100vw', height: '100vh', marginTop: '-20px', }}
      >
        <SwiperSlide style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(https://images.unsplash.com/photo-1584910308431-40e853627585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3262&q=80)`,
        }}></SwiperSlide>
        <SwiperSlide style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(https://cdn.discordapp.com/attachments/1096605947981480048/1121726011369857124/dhee12_secondhand_transaction_web_main_page_about_smartphone_wa_096ef198-a09d-4597-a6c7-587546790d13.png)`,
        }}></SwiperSlide>
        <SwiperSlide style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(https://cdn.discordapp.com/attachments/1096605947981480048/1121726006563188756/dhee12_secondhand_transaction_web_main_page_about_smartphone_wa_1bfe0448-6d61-40c3-bc06-3da533f75541.png)`,
        }}></SwiperSlide>
        <SwiperSlide style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(https://github.com/i-am-not-kangjik/no_Yongsan_yes_Doksan/blob/main/FE/shop/src/img/tianjin-2185510.jpg?raw=true)`,
        }}></SwiperSlide>
      </Swiper>
    </>
  );
}
