const { Sequelize } = require("sequelize");
const path = require("path");

// Проста конфігурація для SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../database.db"),
  logging: false, // вимикаємо логи SQL запитів
});

module.exports = { sequelize };
