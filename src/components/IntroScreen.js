import React from 'react';
import './IntroScreen.css';

const IntroScreen = ({ onStart }) => {
  const handleStart = () => {
    if (onStart) {
      onStart();
    }
  };

  return (
    <div className="intro-container">
      <div className="intro-background">
        <div className="intro-overlay">
          <button className="intro-button-container" onClick={handleStart}>
            <div className="intro-gradient">
              <span className="intro-button-text">Начать</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
