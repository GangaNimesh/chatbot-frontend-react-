import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa';
import '../assets/HomePage.css';
import Chatbot from './Chatbot';

const HomePage = () =>{
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="home-container">
      <div className="top-section">
        <img
          src="https://innovature.ai/wp-content/uploads/2024/02/innovature-logo.png"
          alt="Innovature Logo"
          className="logo"
        />
      </div>

      <div className="main-section">
        <div className="overlay-content">
          <header>
            <h1>Revolutionizing Tomorrow</h1>
            <h2>The Power of Digital Transformation</h2>
            <p className="subheading">Innovature - Empowering Digital Change</p>
          </header>
        </div>
      </div>

      <div className="description">
        <p>
          Innovature, a global software company since 2005, empowers businesses across industries with
          digital solutions—spanning Cloud, Data, AI, and Consulting—to scale faster, operate safer, and
          grow smarter across borders.
        </p>
        <p>
          Rooted in deep domain expertise and a unique “insource quality, outsource execution” model, we
          help enterprises unlock long-term value through purposeful digital transformation.
        </p>
      </div>

      {/*Toggle Button*/}
      <button onClick={() => setShowChatbot(!showChatbot)} className="chatbot-toggle-btn">
        {showChatbot ? '×' : <FaComments size={24} />}
      </button>

      {/*Popup*/}
      {showChatbot && (
        <div className="chatbot-popup-right">
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default HomePage;