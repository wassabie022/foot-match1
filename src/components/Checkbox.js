// src/components/Checkbox.js

import React from 'react';
import './Checkbox.css'; // Импортируем стили для чекбокса

const Checkbox = ({ id, checked, onChange }) => {
  return (
    <div className="checkbox-wrapper">
      <input
        type="checkbox"
        id={id}
        className="match-checkbox"
        checked={checked}
        onChange={onChange}
        aria-checked={checked}
        role="checkbox"
      />
      {/* Если нужен лейбл, добавьте его здесь */}
      {/* <label htmlFor={id}></label> */}
    </div>
  );
};

export default Checkbox;
