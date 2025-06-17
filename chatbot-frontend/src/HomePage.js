import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const goToChatbot = () => {
    navigate('/chatbot');
  };

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
            <p className="subheading">Innovature – Empowering Digital Change</p>
          </header>

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
        </div>
      </div>

      {/* Chatbot floating button */}
      <button onClick={goToChatbot} className="chatbot-btn">
        <FaComments size={24} />
      </button>
    </div>
  );
};

export default HomePage;
