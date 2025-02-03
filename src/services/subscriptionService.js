import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Проверка статуса подписки пользователя
export const checkSubscriptionStatus = async (userId) => {
  console.log('Начало проверки подписки для userId:', userId);
  
  try {
    if (!userId) {
      console.log('userId не предоставлен');
      return { status: 'trial' };
    }

    // Преобразуем userId в строку и очищаем от спецсимволов
    const userIdString = String(userId).trim();
    console.log('Очищенный userId:', userIdString);

    const userDocRef = doc(db, 'subscriptions', userIdString);
    console.log('Пытаемся получить документ из Firebase');
    
    const userDocSnap = await getDoc(userDocRef);
    console.log('Документ получен, существует:', userDocSnap.exists());

    if (!userDocSnap.exists()) {
      console.log('Документ не найден, возвращаем trial статус');
      return { status: 'trial' };
    }

    const userData = userDocSnap.data();
    console.log('Полученные данные:', userData);

    return {
      status: userData.status || 'trial',
      expiryDate: userData.expiryDate
    };

  } catch (error) {
    console.error('Ошибка при проверке подписки:', error);
    // В случае ошибки Firebase возвращаем trial статус
    return { status: 'trial' };
  }
};

// Активация подписки
export const activateSubscription = async (userId, plan) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    let endDate;
    switch (plan) {
      case 'oneWeek':
        endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'oneMonth':
        endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        break;
      case 'sixMonths':
        endDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
        break;
      default:
        throw new Error('Неверный план подписки');
    }

    await setDoc(userDocRef, {
      subscriptionStatus: 'active',
      subscriptionPlan: plan,
      subscriptionStartDate: serverTimestamp(),
      subscriptionEndDate: endDate,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return { status: 'active', plan };
  } catch (error) {
    console.error('Ошибка при активации подписки:', error);
    throw error;
  }
}; 