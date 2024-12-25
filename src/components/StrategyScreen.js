// src/components/StrategyScreen.js

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StrategyScreen.css';

// Вместо react-icons используем PNG-иконки
import shieldIcon from '../assets/shield.png';
import scaleIcon from '../assets/scale.png';
import fireIcon from '../assets/fire.png';

import { SelectedMatchesContext } from '../context/SelectedMatchesContext'; 
import EditMatchesModal from './EditMatchesModal'; 

const RISK_OPTIONS = [
  { 
    key: 'low', 
    title: 'Низкий риск', 
    description: 'Стабильная доходность', 
    icon: shieldIcon,
  },
  { 
    key: 'medium', 
    title: 'Средний риск', 
    description: 'Баланс риска и доходности', 
    icon: scaleIcon,
  },
  { 
    key: 'high', 
    title: 'Высокий риск', 
    description: 'Максимальная доходность', 
    icon: fireIcon,
  },
];

const GRADIENT_COLORS = 'linear-gradient(90deg, rgb(175, 83, 255), rgb(110, 172, 254))';

const StrategyScreen = () => {
  const navigate = useNavigate();
  
  // Доступ к выбранным матчам из контекста
  const { selectedMatches } = useContext(SelectedMatchesContext);
  const matchesCount = selectedMatches.length; 

  const [selectedRisk, setSelectedRisk] = useState('medium');
  const [budget, setBudget] = useState(0); 

  const [isFocused, setIsFocused] = useState(false); 
  const inputRef = useRef(null); 

  // Если 0 матчей, возвращаем на первую страницу
  useEffect(() => {
    if (matchesCount === 0) {
      navigate('/');
    }
  }, [matchesCount, navigate]);

  const handleRiskSelect = (riskKey) => {
    setSelectedRisk(riskKey);
  };

  const handleBudgetChange = (event) => {
    const value = event.target.value;
    // Разрешаем только цифры
    if (/^\d*$/.test(value)) {
      const val = Math.round(value);
      setBudget(val);
    }
  };

  const handleCalculate = () => {
    // Пример логики расчёта
    console.log(`Риск: ${selectedRisk}, Бюджет: ${budget}`);
    // Перенаправляем на страницу подтверждения
    navigate('/request-accepted');
  };

  const currentRisk = RISK_OPTIONS.find(r => r.key === selectedRisk);

  // Состояние для модального окна
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Управляем прокруткой при открытии модалки
  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalVisible]);

  // Прокрутка поля ввода при фокусе (на мобильных устройствах)
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isFocused]);

  return (
    <div className={`container ${isFocused ? 'focused' : ''}`}>
      <div className="scroll-content">
        
        {/* Заголовок с кнопкой "Назад" */}
        <div className="header">
          <button
            className="back-button"
            onClick={() => navigate('/')} 
          >
            Назад
          </button>
          <h1 className="header-title">Настройте свою стратегию</h1>
        </div>
        <p className="sub-header-text">
          Выберите матчи, настройте риск и распределите <br /> бюджет
        </p>

        {/* Выбор матчей */}
        <div className="section">
          <h2 className="section-title">Вы выбрали {matchesCount} матчей</h2>
          <button 
            className="edit-matches-button"
            onClick={openModal}
          >
            <div className="edit-gradient">
              <span className="edit-matches-button-text">Изменить матчи</span>
            </div>
          </button>
          <p className="hint-text">
            Чем больше матчей, тем шире возможности прогноза, но тем выше риск.
          </p>
        </div>

        {/* Выбор уровня риска */}
        <div className="section">
          <h2 className="section-title">Выберите уровень риска</h2>
          <div className="risk-container">
            {RISK_OPTIONS.map(r => (
              <div 
                key={r.key}
                className={`risk-card ${selectedRisk === r.key ? 'selected-risk-card' : ''}`}
                onClick={() => handleRiskSelect(r.key)}
              >
                <div className="risk-icon">
                  <img 
                    src={r.icon} 
                    alt={r.key}
                    className="risk-icon-img" 
                  />
                </div>
                <h3 className="risk-title">{r.title}</h3>
                <p className="risk-description">{r.description}</p>
              </div>
            ))}
          </div>
          <p className="chosen-risk-text">
            Выбран: {currentRisk ? currentRisk.title : ''}
          </p>
        </div>

        {/* Бюджет */}
        <div className="section">
          <h2 className="section-title">Укажите ваш бюджет</h2>
          <div className="budget-container">
            <input
              type="number"
              className="budget-input"
              value={budget === 0 ? '' : budget}
              onChange={handleBudgetChange}
              placeholder="0"
              inputMode="numeric"
              pattern="[0-9]*"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              ref={inputRef}
              aria-label="Введите ваш бюджет"
            />
            <span className="currency-text">₽</span>
          </div>
          
          {/* Контейнер для слайдера */}
          <div className="slider-container">
            {/* Градиентная линия слайдера */}
            <div className="gradient-slider-track"></div>
            {/* Ползунок слайдера */}
            <input
              type="range"
              className="slider"
              min="0"
              max="100000"
              step="500"
              value={budget}
              onChange={handleBudgetChange}
            />
          </div>

          {/* Метки слайдера */}
          <div className="slider-labels">
            <span className="slider-label">0 ₽</span>
            <span className="slider-label">100 000 ₽</span>
          </div>
          <p className="hint-text">Сумма будет распределена по выбранным матчам.</p>
        </div>

        {/* Кнопка "Рассчитать прогноз" */}
        <button 
          className={`calculate-button ${budget === 0 ? 'calculate-button-disabled' : ''}`} 
          onClick={handleCalculate}
          disabled={budget === 0}
        >
          <div className="calculate-gradient">
            <span className="calculate-button-text">Рассчитать прогноз</span>
          </div>
        </button>

        {/* Информация о текущем выборе */}
        <p className="selection-info">
          Выбран {currentRisk ? currentRisk.description.toLowerCase() : '...'}.
          Бюджет: {budget.toLocaleString('ru-RU')} ₽.
        </p>

      </div>

      {/* Модальное окно редактирования матчей */}
      <EditMatchesModal
        isVisible={isModalVisible}
        onClose={closeModal}
      />
    </div>
  );
};

export default StrategyScreen;
