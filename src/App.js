// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FootballMatchesScreen from './components/FootballMatchesScreen';
import StrategyScreen from './components/StrategyScreen';
import TelegramEmulator from './TelegramEmulator'; // Импорт эмулятора
import './App.css'; // Ваш общий CSS, если есть

function App() {
  useEffect(() => {
    // Инициализация Telegram WebApp API или эмуляции
    const Telegram = window.Telegram || TelegramEmulator.WebApp;

    Telegram.ready();
    Telegram.expand();

    // Показываем MainButton, если используется Mini App
    if (Telegram.MainButton) {
      Telegram.MainButton.show();
      Telegram.MainButton.setText('Готово');
      Telegram.MainButton.onClick(() => {
        alert('MainButton нажата!');
      });
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FootballMatchesScreen />} />
          <Route path="/strategy" element={<StrategyScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
