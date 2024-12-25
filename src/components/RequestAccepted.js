// src/components/RequestAccepted.js

import React from 'react';
import './RequestAccepted.css';

const RequestAccepted = () => {
    return (
        <div className="container">
            <div className="icon">
                <a href="https://ibb.co/hFnDDMB" target="_blank" rel="noopener noreferrer">
                    <img 
                        src="https://i.ibb.co/k2rQQy4/chat-text-dynamic-premium.png" 
                        alt="chat-text-dynamic-premium" 
                        className="linked-image"
                    />
                </a>
            </div>
            <div className="headline">Ваш запрос принят!</div>
            <div className="subtext">Мы готовим анализ и отправим результаты в чат как можно скорее.</div>
            <div className="disclaimer">Предоставляемые прогнозы и рекомендации носят информационный характер и не гарантируют финансового результата.</div>
        </div>
    );
};

export default RequestAccepted;
