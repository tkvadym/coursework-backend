const ExhibitionService = require("./ExhibitionService");
const GalleryService = require("./GalleryService");

/**
 * Центральний експорт всіх сервісів
 * Цей файл дозволяє імпортувати всі сервіси з одного місця
 *
 * Валідація даних здійснюється на рівні моделей через Sequelize
 */
module.exports = {
  ExhibitionService,
  GalleryService,
};
