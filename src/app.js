const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { sequelize } = require("./database/database");
const models = require("./models");
const apiRoutes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статична роздача файлів
app.use("/uploads", express.static("uploads"));

// API маршрути
app.use("/api", apiRoutes);

// Базовий маршрут
app.get(["/", "/api"], (req, res) => {
  res.json({
    message: "API для найбільших художніх виставок України",
    version: "1.0.0",
    endpoints: {
      exhibitions: "/api/exhibitions",
      gallery: "/api/gallery",
    },
  });
});

// Обробка 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Маршрут не знайдено",
  });
});

// Глобальна обробка помилок
app.use((error, req, res, next) => {
  console.error("Глобальна помилка:", error);
  res.status(500).json({
    success: false,
    message: "Внутрішня помилка сервера",
  });
});

async function initDatabase() {
  try {
    console.log("Ініціалізація бази даних...");

    // Перевіряємо підключення
    await sequelize.authenticate();
    console.log("Підключення до БД успішне");

    // Створюємо таблиці якщо їх немає
    await sequelize.sync();
    console.log("Таблиці в БД створені (або валідовані) успішно");
  } catch (error) {
    throw new Error("Помилка ініціалізації БД:", error);
  }
}

async function startServer() {
  try {
    // Ініціалізуємо базу даних
    await initDatabase();

    // Запускаємо сервер
    app.listen(PORT, () => {
      console.log(`Сервер запущено на порту ${PORT}`);
      console.log(`API доступне за адресою: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    throw new Error("Помилка запуску сервера:", error);
  }
}

// Запускаємо сервер
startServer();

module.exports = app;
