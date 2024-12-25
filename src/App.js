// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import IntroScreen from './components/IntroScreen';
import FootballMatchesScreen from './components/FootballMatchesScreen';
import StrategyScreen from './components/StrategyScreen';
import RequestAccepted from './components/RequestAccepted'; // Импортируем новый компонент
import { SelectedMatchesProvider } from './context/SelectedMatchesContext'; // Импортируем провайдер контекста
import './App.css'; // Ваш общий CSS, если есть

function App() {
  const [isLoading, setIsLoading] = useState(true); // Экран загрузки
  const [showIntro, setShowIntro] = useState(false); // Экран интро

  useEffect(() => {
    console.log('Приложение запущено'); // Проверка
    // Симулируем загрузку
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowIntro(true);
    }, 2000); // Загрузка 2 секунды

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    console.log('LoadingScreen завершён'); // Проверка
    setIsLoading(false);
    setShowIntro(true);
  };

  const handleIntroStart = () => {
    console.log('IntroScreen завершён'); // Проверка
    setShowIntro(false);
  };

  if (isLoading) {
    console.log('Рендер LoadingScreen'); // Проверка
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  if (showIntro) {
    console.log('Рендер IntroScreen'); // Проверка
    return <IntroScreen onStart={handleIntroStart} />;
  }

  return (
    <SelectedMatchesProvider> {/* Оборачиваем приложение в провайдер контекста */}
      <Router>
        <Routes>
          <Route path="/" element={<FootballMatchesScreen />} />
          <Route path="/strategy" element={<StrategyScreen />} />
          <Route path="/request-accepted" element={<RequestAccepted />} /> {/* Новый маршрут */}
          {/* Добавьте другие маршруты при необходимости */}
        </Routes>
      </Router>
    </SelectedMatchesProvider>
  );
}

export default App;
