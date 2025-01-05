// src/context/SelectedMatchesContext.js

import React, { createContext, useState } from 'react';

// Создаём контекст
export const SelectedMatchesContext = createContext();

// Провайдер контекста
export const SelectedMatchesProvider = ({ children }) => {
  const [allMatches, setAllMatches] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);

  return (
    <SelectedMatchesContext.Provider value={{ allMatches, setAllMatches, selectedMatches, setSelectedMatches }}>
      {children}
    </SelectedMatchesContext.Provider>
  );
};
