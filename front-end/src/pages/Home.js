import React, { useState } from "react";

import { Parallax, Background } from 'react-parallax';

import "./Home.css"
import TextBlock from './textBlock';
import { Slide } from 'react-reveal';


const Home = () => {
  const imageUrl = process.env.PUBLIC_URL + '/scattered-forcefields.svg';
  const imageUrlTwo = process.env.PUBLIC_URL + '/stacked-peaks-haikei.svg'
  const homeImg = process.env.PUBLIC_URL + '/home.svg';

  return (
    <div>
      <Parallax bgImage={imageUrlTwo} strength={500}>
        <div
          className="content-box"
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row', 
          }}
        >
          <div style={{ flex: 6 }}>
          
            <div style={{ paddingLeft: '10%', paddingRight: '5%' }}>
              <Slide left cascade ease="ease-in-out" delay={500}>
  <div>
  <h1 className="luckiest-guy">A platform designed to facilitate collaboration among agile teams. </h1>
  <p className="my-paragraph"> Foster superior collaboration and achieve optimal results through an emphasis on efficiency, teamwork, and continuous improvement.</p>
  </div>
</Slide>
            </div>
          </div>
          <div style={{ flex: 6 }}>

          <Slide right cascade ease="ease-in-out" delay={500}>
          <img src={homeImg} alt="Right Image" style={{ width: '100%' }} />

</Slide>



          </div>
        </div>
        <Background>
          <div style={{ height: '100vh' }} />
        </Background>
      </Parallax>
      <TextBlock />
    </div>
  );
  
};



export default Home;
