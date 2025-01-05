// src/components/EditMatchesModal.js

import React, { useContext, useState, useEffect, useRef } from 'react';
import './EditMatchesModal.css';
import { SelectedMatchesContext } from '../context/SelectedMatchesContext';
import Checkbox from './Checkbox'; // Убедись, что этот компонент существует
import { FaTrash, FaSearch, FaTimes } from 'react-icons/fa';

const EditMatchesModal = ({ isVisible, onClose }) => {
  const { allMatches, selectedMatches, setSelectedMatches } = useContext(SelectedMatchesContext);
  const [searchText, setSearchText] = useState("");
  const [showSelectedTab, setShowSelectedTab] = useState(true);
  const [filteredAvailableMatches, setFilteredAvailableMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Предполагается, что загрузка уже произошла
  const [error, setError] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      // Фокус на модал при открытии
      if (modalRef.current) {
        modalRef.current.focus();
      }
      // Фильтрация доступных матчей при открытии модала
      filterAvailableMatches();
    } else {
      setSearchText('');
    }
  }, [isVisible, allMatches, selectedMatches]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isVisible, onClose]);

  const toggleMatch = (match) => {
    if (selectedMatches.some((m) => m.id === match.id)) {
      setSelectedMatches(selectedMatches.filter((m) => m.id !== match.id));
    } else {
      setSelectedMatches([...selectedMatches, match]);
    }
  };

  const removeMatch = (matchId) => {
    setSelectedMatches(selectedMatches.filter(match => match.id !== matchId));
  };

  const clearAllMatches = () => {
    if (window.confirm("Вы уверены, что хотите удалить все выбранные матчи?")) {
      setSelectedMatches([]);
    }
  };

  const filterAvailableMatches = () => {
    const lowercasedFilter = searchText.toLowerCase();

    const filtered = allMatches.filter((match) =>
      match.name.toLowerCase().includes(lowercasedFilter)
    );

    setFilteredAvailableMatches(filtered);
  };

  useEffect(() => {
    if (!showSelectedTab) {
      filterAvailableMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, allMatches, selectedMatches]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="modalOverlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div
        className="modalContainer"
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1"
        ref={modalRef}
      >
        <div className="modalHeader">
          <h2 id="modalTitle" className="modalTitle">Управление матчами</h2>
          <button className="closeButton" onClick={onClose} aria-label="Закрыть модальное окно">
            <FaTimes />
          </button>
        </div>

        <div className="tabContainer">
          {/* Вкладка "Выбранные" */}
          <button
            className={`tabButton ${showSelectedTab ? 'active' : ''}`}
            onClick={() => setShowSelectedTab(true)}
          >
            Выбранные
            {showSelectedTab && <div className="tabIndicator" />}
          </button>

          {/* Вкладка "Доступные" */}
          <button
            className={`tabButton ${!showSelectedTab ? 'active' : ''}`}
            onClick={() => setShowSelectedTab(false)}
          >
            Доступные
            {!showSelectedTab && <div className="tabIndicator" />}
          </button>
        </div>

        <div className="matchesContainer">
          {showSelectedTab ? (
            <>
              <div className="selectedHeader">
                <span className="selectedCount">Выбрано: {selectedMatches.length}</span>
                <button className="clearAllButton" onClick={clearAllMatches}>
                  Очистить все
                </button>
              </div>
              <ul className="matchList">
                {selectedMatches.map(item => (
                  <li key={item.id} className="matchItem">
                    <div className="matchInfo">
                      <span className="matchLabel">{item.name}</span>
                      <span className="matchDetails">{item.date} {item.time}</span>
                    </div>
                    <button className="removeButton" onClick={() => removeMatch(item.id)}>
                      <FaTrash color="#E53935" size={20} />
                    </button>
                  </li>
                ))}
                {selectedMatches.length === 0 && (
                  <p className="emptyText">Нет выбранных матчей.</p>
                )}
              </ul>
            </>
          ) : (
            <>
              {/* Поле поиска */}
              <div className="searchContainer">
                <FaSearch className="searchIcon" />
                <input
                  type="text"
                  className="searchInput"
                  placeholder="Поиск матчей..."
                  value={searchText}
                  onChange={handleSearch}
                />
              </div>

              {isLoading ? (
                <div className="loadingContainer">
                  <div className="spinner"></div>
                  <p className="loadingText">Загрузка матчей...</p>
                </div>
              ) : error ? (
                <p className="errorText">{error}</p>
              ) : (
                <ul className="matchList">
                  {filteredAvailableMatches.map(item => (
                    <li key={item.id} className="matchItem">
                      <div className="matchInfo">
                        <span className="matchLabel">{item.name}</span>
                        <span className="matchDetails">{item.date} {item.time}</span>
                      </div>
                      <Checkbox
                        id={`checkbox-${item.id}`}
                        checked={selectedMatches.some((m) => m.id === item.id)}
                        onChange={() => toggleMatch(item)}
                      />
                    </li>
                  ))}
                  {filteredAvailableMatches.length === 0 && (
                    <p className="emptyText">Нет доступных матчей.</p>
                  )}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Кнопка "Сохранить" */}
        <button className="saveButton" onClick={onClose}>
          <span className="saveButtonText">Сохранить</span>
        </button>
      </div>
    </div>
  );
};

export default EditMatchesModal;
