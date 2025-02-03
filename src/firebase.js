import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // ваша конфигурация
};

// Добавляем обработку ошибок при инициализации
try {
  console.log('Инициализация Firebase...');
  const app = initializeApp(firebaseConfig);
  console.log('Firebase инициализирован успешно');
  export const db = getFirestore(app);
} catch (error) {
  console.error('Ошибка при инициализации Firebase:', error);
  // Создаем заглушку для db, чтобы избежать ошибок
  export const db = null;
} 