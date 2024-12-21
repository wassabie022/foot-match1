import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import IntroScreen from './components/IntroScreen';
import FootballMatchesScreen from './components/FootballMatchesScreen';
import StrategyScreen from './components/StrategyScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true); // Экран загрузки
  const [showIntro, setShowIntro] = useState(false); // Экран интро

  useEffect(() => {
    console.log('Приложение запущено'); // Проверка
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
    <Router>
      <Routes>
        <Route path="/" element={<FootballMatchesScreen />} />
        <Route path="/strategy" element={<StrategyScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
