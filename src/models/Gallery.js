const { DataTypes } = require("sequelize");

/**
 * Модель для галереї картин
 * @param {import('sequelize').Sequelize} sequelize - екземпляр Sequelize
 * @returns {import('sequelize').Model} модель Gallery
 */
module.exports = (sequelize) => {
  const Gallery = sequelize.define(
    "Gallery",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: "Унікальний ідентифікатор картини",
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Назва картини не може бути порожньою",
          },
          len: {
            args: [1, 255],
            msg: "Назва картини повинна містити від 1 до 255 символів",
          },
        },
        comment: "Назва картини",
      },
      artist: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Ім'я художника не може бути порожнім",
          },
          len: {
            args: [1, 255],
            msg: "Ім'я художника повинно містити від 1 до 255 символів",
          },
        },
        comment: "Ім'я художника",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Опис картини",
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "URL зображення є обов'язковим",
          },
        },
        comment: "URL зображення картини",
      },
      exhibitionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "exhibitions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        comment: "ID виставки, до якої належить картина",
      },
    },
    {
      tableName: "gallery",
      timestamps: true,
      paranoid: false,
      indexes: [
        {
          fields: ["exhibitionId"],
        },
        {
          fields: ["artist"],
        },
      ],
      comment: "Таблиця для зберігання картин в галереї виставок",
    }
  );

  return Gallery;
};
