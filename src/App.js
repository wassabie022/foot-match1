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
      setIsLoading(true);
      setShowIntro(false);

      try {
        const telegram = window.Telegram?.WebApp;
        // Проверяем, запущено ли приложение в Telegram
        const isTelegramWebApp = !!telegram;
        console.log('Запущено в Telegram WebApp:', isTelegramWebApp);
        
        const userId = telegram?.initDataUnsafe?.user?.id || "6045806877";
        console.log('User ID:', userId);
        
        // Добавляем логирование initData от Telegram
        if (isTelegramWebApp) {
          console.log('Telegram initData:', telegram.initDataUnsafe);
          console.log('Telegram initData raw:', telegram.initData);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        let status;
        if (isTelegramWebApp) {
          // Для Telegram WebApp используем особую логику
          try {
            status = await checkSubscriptionStatus(userId);
          } catch (firebaseError) {
            console.error('Ошибка Firebase в Telegram:', firebaseError);
            // Если Firebase не работает в Telegram, используем временный статус
            status = { status: 'trial' };
          }
        } else {
          // Для браузера используем обычную логику
          status = await checkSubscriptionStatus(userId);
        }

        console.log('Полученный статус подписки:', status);
        setSubscriptionStatus(status);

        if (status.status === 'active' || status.status === 'trial') {
          console.log('Устанавливаем showIntro в true');
          setShowIntro(true);
        }

      } catch (error) {
        console.error('Общая ошибка инициализации:', error);
        // В случае ошибки устанавливаем пробный статус
        setSubscriptionStatus({ status: 'trial' });
        setShowIntro(true);
      }
    };

    initializeApp();
  }, []);

  const handleLoadingComplete = () => {
    console.log('LoadingScreen завершён');
    setTimeout(() => {
      setIsLoading(false);
      // Устанавливаем showIntro в true после загрузки
      if (subscriptionStatus?.status === 'active' || subscriptionStatus?.status === 'trial') {
        console.log('Устанавливаем showIntro в true');
        setShowIntro(true);
      }
    }, 500);
  };

  const handleIntroStart = () => {
    console.log('IntroScreen завершён');
    setTimeout(() => {
      setShowIntro(false);
    }, 300);
  };

  // Добавим отладочный вывод для понимания текущего состояния
  console.log('Текущие состояния:', {
    isLoading,
    showIntro,
    subscriptionStatus: subscriptionStatus?.status
  });

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
