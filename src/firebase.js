import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // ваша конфигурация
};

let db = null;

try {
  console.log('Инициализация Firebase...');
  const app = initializeApp(firebaseConfig);
  console.log('Firebase инициализирован успешно');
  db = getFirestore(app);
} catch (error) {
  console.error('Ошибка при инициализации Firebase:', error);
}

export { db }; 