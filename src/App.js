import React, { useEffect } from 'react';
import FootballMatchesScreen from './components/FootballMatchesScreen';

// Эмуляция для локального запуска
const TelegramEmulator = {
  WebApp: {
    initData: '',
    initDataUnsafe: {},
    MainButton: {
      show: () => console.log('MainButton shown'),
      hide: () => console.log('MainButton hidden'),
      setText: (text) => console.log(`MainButton text set to: ${text}`),
      onClick: (callback) => console.log('MainButton clicked', callback),
    },
    ready: () => console.log('WebApp ready'),
    expand: () => console.log('WebApp expanded'),
  },
};

const isTelegram = typeof window.Telegram !== 'undefined';

function App() {
  useEffect(() => {
    // Инициализация Telegram WebApp API или эмуляции
    const Telegram = isTelegram ? window.Telegram : TelegramEmulator.WebApp;

    Telegram.ready();
    Telegram.expand();

    // Показываем MainButton, если используется Mini App
    if (isTelegram) {
      Telegram.MainButton.show();
      Telegram.MainButton.setText('Готово');
      Telegram.MainButton.onClick(() => {
        alert('MainButton нажата!');
      });
    }
  }, []);

  return (
    <div className="App">
      <FootballMatchesScreen />
    </div>
  );
}

export default App;
