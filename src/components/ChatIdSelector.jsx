import React from 'react';

const ChatIdSelector = ({ onSelect }) => {
    const chatIds = [
        { id: '6045806877', name: 'Основной чат' },
        // Добавьте другие чаты по необходимости
    ];

    return (
        <select 
            onChange={(e) => onSelect(e.target.value)}
            className="p-2 border rounded"
        >
            {chatIds.map(chat => (
                <option key={chat.id} value={chat.id}>
                    {chat.name}
                </option>
            ))}
        </select>
    );
};

export default ChatIdSelector; 