// src/TelegramEmulator.js

const TelegramEmulator = {
  WebApp: {
    initData: '',
    initDataUnsafe: {
      user: {
        id: 12345,
        first_name: "Test",
        last_name: "User",
        username: "testuser",
        language_code: "en",
      },
    },
    BackButton: {
      show: () => console.log("Back button shown"),
      hide: () => console.log("Back button hidden"),
      onClick: (callback) => console.log("Back button clicked"),
    },
    HapticFeedback: {
      impactOccurred: (style) =>
        console.log(`Haptic feedback with style: ${style}`),
    },
    MainButton: {
      show: () => console.log("Main button shown"),
      hide: () => console.log("Main button hidden"),
      text: "Main Button",
      setText: (text) => console.log(`Main button text set to: ${text}`),
      onClick: (callback) => console.log("Main button clicked"),
    },
    ready: () => console.log('WebApp ready'),
    expand: () => console.log('WebApp expanded'),
  },
};

export default TelegramEmulator;
