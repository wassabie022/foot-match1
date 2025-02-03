// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import IntroScreen from './components/IntroScreen';
import FootballMatchesScreen from './components/FootballMatchesScreen';
import StrategyScreen from './components/StrategyScreen';
import RequestAccepted from './components/RequestAccepted'; // Импортируем новый компонент
import { SelectedMatchesProvider } from './context/SelectedMatchesContext'; // Импортируем провайдер контекста
import SubscriptionScreen from './components/SubscriptionScreen';
import { checkSubscriptionStatus } from './services/subscriptionService';
import './App.css'; // Ваш общий CSS, если есть

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      // Устанавливаем начальное состояние загрузки
      setIsLoading(true);
      setShowIntro(false);

      try {
        const telegram = window.Telegram?.WebApp;
        const userId = telegram?.initDataUnsafe?.user?.id || "6045806877";
        
        console.log('Проверяем пользователя:', userId);
        
        // Добавляем искусственную задержку для LoadingScreen
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const status = await checkSubscriptionStatus(userId);
        console.log('Статус подписки:', status);
        
        setSubscriptionStatus(status);

        // Если подписка активна или триал, показываем интро
        if (status.status === 'active' || status.status === 'trial') {
          setShowIntro(true);
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    initializeApp();
  }, []);

  const handleLoadingComplete = () => {
    console.log('LoadingScreen завершён');
    // Добавляем небольшую задержку перед сменой экрана
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleIntroStart = () => {
    console.log('IntroScreen завершён');
    // Добавляем небольшую задержку перед сменой экрана
    setTimeout(() => {
      setShowIntro(false);
    }, 300);
  };

  return (
    <Router>
      <SelectedMatchesProvider>
        {isLoading ? (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        ) : subscriptionStatus?.status === 'expired' ? (
          <SubscriptionScreen />
        ) : showIntro ? (
          <IntroScreen onStart={handleIntroStart} />
        ) : (
          <Routes>
            <Route path="/" element={<FootballMatchesScreen chatId={chatId} />} />
            <Route path="/strategy" element={<StrategyScreen chatId={chatId} />} />
            <Route path="/request-accepted" element={<RequestAccepted chatId={chatId} />} />
            <Route path="/oplata" element={<SubscriptionScreen />} />
          </Routes>
        )}
      </SelectedMatchesProvider>
    </Router>
  );
}

export default App;
