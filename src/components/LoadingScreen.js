// src/LoadingScreen.js
import React, { useEffect, useState } from 'react';
import './LoadingScreen.css'; // Убедитесь, что в этом файле есть нужные стили

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000; // 5 секунд
    const intervalTime = 50; // обновление каждые 50 мс
    const increment = (100 / duration) * intervalTime; // Увеличили до 100%
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) { // Изменили до 100%
          clearInterval(timer);
          // Когда загрузка будет завершена, вызываем колбэк
          onLoadingComplete(); 
          return 100;
        }
        return newProgress;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="safe-area">
      <div className="background">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            <div className="gradient"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
