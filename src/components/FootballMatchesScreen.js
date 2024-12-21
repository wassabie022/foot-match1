// src/components/FootballMatchesScreen.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FootballMatchesScreen.css';
import { FaFutbol, FaCheckCircle, FaCircle } from 'react-icons/fa';
import axios from 'axios';
import TelegramEmulator from '../TelegramEmulator';

const GRADIENT_COLORS = ['rgb(175, 83, 255)', 'rgb(110, 172, 254)'];
const Telegram = window.Telegram || TelegramEmulator.WebApp;

const sheetId = '1R2k3qsM2ggajeBu8IrP1d-LAolneeqcTrDNV_JHqtzc';
const apiKey = 'AIzaSyDrCLUPUlzlNoj4KJlFAnP2KZrt8MXZbUE';
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;

const getDaysOfWeek = () => {
  const today = new Date();
  const days = [];
  const dayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dayIndex = date.getDay();
    const label = i === 0 ? 'СЕГОДНЯ' : dayNames[dayIndex];
    const dayNum = date.getDate();
    const month = date.getMonth() + 1;
    const dateStr = `${dayNum < 10 ? '0' : ''}${dayNum}.${month < 10 ? '0' : ''}${month}`;
    days.push({ label, date: dateStr });
  }

  return days;
};

const TeamLogo = ({ uri }) => {
  if (!uri) {
    return <div className="team-logo-placeholder" />;
  }
  return (
    <div className="team-logo-container">
      <img src={uri} alt="Team Logo" className="team-logo" />
    </div>
  );
};

const FootballMatchesScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedDay, setSelectedDay] = useState(getDaysOfWeek()[0]);
  const [daysOfWeek, setDaysOfWeek] = useState(getDaysOfWeek());
  const [matchesData, setMatchesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(url);
      console.log('Полученные данные:', response.data);
      const json = response.data;

      if (!json.values) {
        throw new Error('Нет данных в ответе API');
      }

      const [headers, ...rows] = json.values;

      const formatDateToDDMM = (dateStr) => {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const year = parts[0];
          const month = parts[1];
          const day = parts[2];
          return `${day}.${month}`;
        }
        return dateStr;
      };

      const matches = rows.map((row, index) => {
        const league = row[0] || '';
        const date = row[1] || '';
        const time = row[2] || '';
        const homeTeam = row[3] || '';
        const awayTeam = row[4] || '';
        const homeLogo = row[6] || '';
        const awayLogo = row[7] || '';

        return {
          id: `match-${index}`,
          date: formatDateToDDMM(date),
          time,
          homeTeam,
          awayTeam,
          league,
          homeLogo,
          awayLogo,
          isFavorite: false,
        };
      });

      const leaguesMap = {};
      matches.forEach((match) => {
        if (!leaguesMap[match.league]) {
          leaguesMap[match.league] = {
            league: match.league,
            leagueIcon: 'futbol',
            data: [],
          };
        }
        leaguesMap[match.league].data.push(match);
      });

      const structuredData = Object.values(leaguesMap);

      setMatchesData(structuredData);
      setFilteredData(structuredData);
    } catch (error) {
      console.error('Ошибка при загрузке данных', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (Telegram && Telegram.MainButton) {
      Telegram.MainButton.show();
      Telegram.MainButton.setText('Готово');
      Telegram.MainButton.onClick(() => {
        console.log('Main button clicked');
      });
    }
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const lowercasedFilter = searchText.toLowerCase();

      const newData = matchesData
        .map((league) => {
          const filteredMatches = league.data.filter((match) => {
            const homeMatch = match.homeTeam.toLowerCase().includes(lowercasedFilter);
            const awayMatch = match.awayTeam.toLowerCase().includes(lowercasedFilter);
            return homeMatch || awayMatch;
          });
          return { ...league, data: filteredMatches };
        })
        .filter((league) => league.data.length > 0);

      const dateFilteredData = newData
        .map((league) => {
          const dateMatches = league.data.filter(
            (match) => match.date === selectedDay.date
          );
          return { ...league, data: dateMatches };
        })
        .filter((league) => league.data.length > 0);

      setFilteredData(dateFilteredData);

      const totalSelected = matchesData.reduce((sum, league) => {
        return sum + league.data.filter((match) => match.isFavorite).length;
      }, 0);
      setSelectedCount(totalSelected);
    };

    applyFilters();
  }, [searchText, matchesData, selectedDay]);

  const renderLeagueHeader = (league) => (
    <div className="league-header" key={`league-${league.league}`}>
      <FaFutbol size={20} color="#ffffff" />
      <span className="league-header-text">{league.league}</span>
    </div>
  );

  const toggleFavorite = (leagueName, matchId) => {
    const updatedData = matchesData.map((league) => {
      if (league.league === leagueName) {
        return {
          ...league,
          data: league.data.map((match) => {
            if (match.id === matchId) {
              return { ...match, isFavorite: !match.isFavorite };
            }
            return match;
          }),
        };
      }
      return league;
    });
    setMatchesData(updatedData);
  };

  const renderMatch = (match, league) => (
    <div
      className="match-container"
      key={`${league.league}-match-${match.id}`}
      onClick={() => toggleFavorite(league.league, match.id)}
    >
      <div className="match-row">
        <div className="time-section">
          <span className="match-time">{match.time}</span>
        </div>
        <div className="teams-container">
          <div className="team-row">
            <TeamLogo uri={match.homeLogo} />
            <span className="team-name">{match.homeTeam}</span>
          </div>
          <div className="team-row">
            <TeamLogo uri={match.awayLogo} />
            <span className="team-name">{match.awayTeam}</span>
          </div>
        </div>
        <div className="favorite-icon-container">
          {match.isFavorite ? (
            <FaCheckCircle size={24} color="#575FFF" />
          ) : (
            <FaCircle size={24} color="#ffffff" />
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <span className="loading-text">Загрузка данных...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <span className="error-text">Ошибка при загрузке данных:</span>
          <span className="error-message">{error}</span>
          <button className="retry-button" onClick={fetchData}>
            Попробовать снова
          </button>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="empty-container">
          <span className="empty-text">Нет матчей на выбранный день.</span>
        </div>
      );
    }

    return (
      <>
        {filteredData.map((league) => (
          <div key={`league-section-${league.league}`}>
            {renderLeagueHeader(league)}
            {league.data.map((match) => renderMatch(match, league))}
            <div className="separator"></div>
          </div>
        ))}

        <div className="bottom-panel">
          <button
            className={`button ${selectedCount <= 0 ? 'button-disabled' : ''}`}
            disabled={selectedCount <= 0}
            onClick={() => navigate('/strategy', { state: { matchesCount: selectedCount } })}
          >
            <div
              className="gradient"
              style={{
                background: `linear-gradient(90deg, ${GRADIENT_COLORS.join(', ')})`,
              }}
            >
              <span className="button-text">Далее</span>
            </div>
          </button>
          <span className="selected-text">Выбрано матчей: {selectedCount}</span>
        </div>
      </>
    );
  };

  return (
    <div className="safe-area">
      <div className="container">
        <div className="nav-bar">
          <div className="nav-left">
            <FaFutbol size={24} color="#ffffff" />
            <span className="nav-title">Футбол</span>
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Поиск"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="date-panel">
          <div className="date-list">
            {daysOfWeek.map((day, index) => {
              const isActive =
                selectedDay.label === day.label && selectedDay.date === day.date;
              return (
                <div
                  key={`day-${index}`}
                  className={`day-button ${isActive ? 'active-day-button' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span
                    className={`day-button-text ${
                      isActive ? 'active-day-button-text' : ''
                    }`}
                  >
                    {day.label}
                  </span>
                  <span
                    className={`date-text ${
                      isActive ? 'active-date-text' : ''
                    }`}
                  >
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="list-container">{renderContent()}</div>
      </div>
    </div>
  );
};

export default FootballMatchesScreen;
