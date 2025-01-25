import { sendMatchesToTelegram } from '../services/telegramService';

const handleSubmit = async () => {
    try {
        const chatId = '6045806877'; // Можно сделать выбор из списка или ввод
        
        await sendMatchesToTelegram(
            selectedMatches, 
            amount, 
            riskLevel,
            chatId
        );
        
        // Показываем уведомление об успешной отправке
        alert('Ставка успешно отправлена в Telegram!');
        
    } catch (error) {
        // Показываем ошибку пользователю
        alert('Ошибка при отправке ставки: ' + error.message);
    }
}; 