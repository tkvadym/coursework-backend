const { DataTypes } = require("sequelize");

/**
 * Модель для виставок
 * @param {import('sequelize').Sequelize} sequelize - екземпляр Sequelize
 * @returns {import('sequelize').Model} модель Exhibition
 */
module.exports = (sequelize) => {
  const Exhibition = sequelize.define(
    "Exhibition",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: "Унікальний ідентифікатор виставки",
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Назва виставки не може бути порожньою",
          },
          len: {
            args: [1, 255],
            msg: "Назва виставки повинна містити від 1 до 255 символів",
          },
        },
        comment: "Назва виставки",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Короткий опис виставки не може бути порожнім",
          },
        },
        comment: "Короткий опис виставки",
      },
      detail_description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: "Детальний опис виставки не може бути порожнім",
          },
        },
        comment: "Детальний опис виставки",
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Місце проведення не може бути порожнім",
          },
          len: {
            args: [1, 255],
            msg: "Місце проведення повинно містити від 1 до 255 символів",
          },
        },
        comment: "Місце проведення виставки",
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            msg: "Дата початку повинна бути валідною датою",
          },
          notNull: {
            msg: "Дата початку є обов'язковою",
          },
        },
        comment: "Дата початку виставки",
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            msg: "Дата закінчення повинна бути валідною датою",
          },
          notNull: {
            msg: "Дата закінчення є обов'язковою",
          },
          isAfterStartDate(value) {
            if (this.startDate && value <= this.startDate) {
              throw new Error(
                "Дата закінчення повинна бути пізніше дати початку"
              );
            }
          },
        },
        comment: "Дата закінчення виставки",
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          notEmpty: {
            msg: "URL зображення не може бути порожнім",
          },
        },
        comment: "URL зображення виставки",
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Категорія не може бути порожньою",
          },
          isIn: {
            args: [
              [
                "Сучасне мистецтво",
                "Класичне мистецтво",
                "Фотографія",
                "Скульптура",
                "Живопис",
                "Графіка",
                "Інсталяція",
                "Мультимедіа",
                "Народне мистецтво",
                "Декоративне мистецтво",
              ],
            ],
            msg: "Категорія повинна бути одним із дозволених значень",
          },
        },
        comment: "Категорія виставки",
      },
      organizer: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Організатор не може бути порожнім",
          },
          len: {
            args: [1, 255],
            msg: "Назва організатора повинна містити від 1 до 255 символів",
          },
        },
        comment: "Організатор виставки",
      },
    },
    {
      tableName: "exhibitions",
      timestamps: true, // додає createdAt та updatedAt
      paranoid: false, // м'яке видалення відключено
      indexes: [
        {
          fields: ["category"],
        },
        {
          fields: ["startDate"],
        },
        {
          fields: ["endDate"],
        },
        {
          fields: ["organizer"],
        },
      ],
      comment: "Таблиця для зберігання інформації про художні виставки",
    }
  );

  // Методи екземпляра
  Exhibition.prototype.isActive = function () {
    const today = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return today >= start && today <= end;
  };

  Exhibition.prototype.isUpcoming = function () {
    const today = new Date();
    const start = new Date(this.startDate);
    return today < start;
  };

  Exhibition.prototype.isPast = function () {
    const today = new Date();
    const end = new Date(this.endDate);
    return today > end;
  };

  Exhibition.prototype.getDuration = function () {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Статичні методи
  Exhibition.getCategories = function () {
    return [
      "Сучасне мистецтво",
      "Класичне мистецтво",
      "Фотографія",
      "Скульптура",
      "Живопис",
      "Графіка",
      "Інсталяція",
      "Мультимедіа",
      "Народне мистецтво",
      "Декоративне мистецтво",
    ];
  };

  return Exhibition;
};
