const { sequelize } = require("../database/database");

// Імпорт моделей
const Exhibition = require("./Exhibition")(sequelize);
const Gallery = require("./Gallery")(sequelize);

// Встановлення зв'язків між моделями
Exhibition.hasMany(Gallery, {
  foreignKey: "exhibitionId",
  as: "artworks",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Gallery.belongsTo(Exhibition, {
  foreignKey: "exhibitionId",
  as: "exhibition",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Об'єкт з усіма моделями
const models = {
  Exhibition,
  Gallery,
  sequelize,
  Sequelize: require("sequelize").Sequelize,
};

module.exports = models;
