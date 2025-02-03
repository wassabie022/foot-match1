const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require('./mini-ao-c2901-firebase-adminsdk-fbsvc-02d557277f.json');

const app = express();

// Важно: эти middleware должны быть определены ДО маршрутов
app.use(cors());
app.use(express.json());

const YOOKASSA_SHOP_ID = '1017750';
const YOOKASSA_API_KEY = 'test_JlYDLrQUZkjeWXpsblSwntk-p2-AeB9RwG7yaKgQ0LQ';
const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3';

// Инициализация Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'mini-ao-c2901'
});

const db = admin.firestore();

// Добавим проверку подключения
db.collection('users').get()
  .then(() => {
    console.log('Успешно подключились к Firestore');
  })
  .catch((error) => {
    console.error('Ошибка подключения к Firestore:', error);
  });

// Тестовый маршрут для проверки
app.post('/api/test', (req, res) => {
  console.log('=== Тестовый эндпоинт ===');
  console.log('Получены данные:', req.body);
  res.status(200).json({ message: 'Test OK' });
});

// Добавим логирование всех запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Создание платежа
app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, userId, plan } = req.body;

    const response = await axios.post(`${YOOKASSA_API_URL}/payments`, {
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB'
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: 'http://localhost:3000'
      },
      description: `Подписка Match AI - ${plan}`,
      metadata: {
        userId,
        plan
      }
    }, {
      auth: {
        username: YOOKASSA_SHOP_ID,
        password: YOOKASSA_API_KEY
      },
      headers: {
        'Idempotence-Key': Date.now().toString()
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при создании платежа:', error);
    res.status(500).json({ error: error.message });
  }
});

// Вебхук от ЮKassa
app.post(['/api/webhook', '/yookassa-webhook'], async (req, res) => {
  console.log('\n\n=== ПОЛУЧЕН ВЕБХУК ОТ ЮKASSA ===');
  console.log('Время:', new Date().toISOString());
  console.log('Headers:', req.headers);
  try {
    const event = req.body;
    console.log('Получены данные платежа:', JSON.stringify(event, null, 2));

    if (event.event === 'payment.succeeded') {
      const { userId, plan } = event.object.metadata;
      console.log(`Обработка платежа для пользователя ${userId}, план: ${plan}`);

      let subscriptionEndDate = new Date();
      switch (plan) {
        case 'oneWeek':
          subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 7);
          break;
        case 'oneMonth':
          subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);
          break;
        case 'sixMonths':
          subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 180);
          break;
      }
      console.log('Дата окончания подписки:', subscriptionEndDate);

      const docRef = db.collection('users').doc(userId);
      console.log('Получаем документ пользователя...');
      const doc = await docRef.get();

      if (!doc.exists) {
        console.log('Создаем новый документ пользователя...');
        const newUserData = {
          userId,
          subscriptionStatus: 'active',
          subscriptionPlan: plan,
          subscriptionStartDate: admin.firestore.FieldValue.serverTimestamp(),
          subscriptionEndDate,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        console.log('Данные для создания:', newUserData);
        await docRef.set(newUserData);
        console.log('Новый документ создан успешно');
      } else {
        console.log('Обновляем существующий документ...');
        const updateData = {
          subscriptionStatus: 'active',
          subscriptionPlan: plan,
          subscriptionStartDate: admin.firestore.FieldValue.serverTimestamp(),
          subscriptionEndDate,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        console.log('Данные для обновления:', updateData);
        await docRef.update(updateData);
        console.log('Документ обновлен успешно');
      }
    }

    console.log('=== Обработка вебхука завершена успешно ===');
    res.status(200).send('OK');
  } catch (error) {
    console.error('!!! Ошибка при обработке вебхука !!!', error);
    console.error('Полный стек ошибки:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 