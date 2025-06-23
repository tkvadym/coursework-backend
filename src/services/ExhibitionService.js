const { Exhibition, Gallery, sequelize } = require("../models");
const { Op } = require("sequelize");

/**
 * Сервіс для роботи з виставками
 */
class ExhibitionService {
  /**
   * Отримати всі виставки з можливістю фільтрації та пагінації
   * @param {Object} options - опції запиту
   * @param {number} options.page - номер сторінки (за замовчуванням 1)
   * @param {number} options.limit - кількість записів на сторінку (за замовчуванням 10)
   * @param {string} options.category - фільтр за категорією
   * @param {string} options.search - пошук за назвою або описом
   * @param {string} options.organizer - фільтр за організатором
   * @param {string} options.status - фільтр за статусом (active, upcoming, past)
   * @param {string} options.sortBy - поле для сортування (за замовчуванням startDate)
   * @param {string} options.sortOrder - порядок сортування (ASC або DESC, за замовчуванням ASC)
   * @returns {Promise<Object>} об'єкт з виставками та метаданими пагінації
   */
  async getAllExhibitions(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        search,
        organizer,
        status,
        sortBy = "startDate",
        sortOrder = "ASC",
      } = options;

      const offset = (page - 1) * limit;
      const where = {};
      const today = new Date().toISOString().split("T")[0];

      // Фільтр за категорією
      if (category) {
        where.category = category;
      }

      // Фільтр за організатором
      if (organizer) {
        where.organizer = {
          [Op.like]: `%${organizer}%`,
        };
      }

      // Пошук за назвою або описом
      if (search) {
        where[Op.or] = [
          {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${search}%`,
            },
          },
        ];
      }

      // Фільтр за статусом
      if (status) {
        switch (status) {
          case "active":
            where.startDate = { [Op.lte]: today };
            where.endDate = { [Op.gte]: today };
            break;
          case "upcoming":
            where.startDate = { [Op.gt]: today };
            break;
          case "past":
            where.endDate = { [Op.lt]: today };
            break;
        }
      }

      const { count, rows } = await Exhibition.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      const totalPages = Math.ceil(count / limit);

      return {
        exhibitions: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      console.error("Помилка при отриманні виставок:", error);
      throw new Error("Не вдалося отримати список виставок");
    }
  }

  /**
   * Отримати виставку за ID
   * @param {number} id - ідентифікатор виставки
   * @param {boolean} includeArtworks - чи включати картини галереї
   * @returns {Promise<Object|null>} виставка або null
   */
  async getExhibitionById(id, includeArtworks = false) {
    try {
      const includeOptions = [];

      if (includeArtworks) {
        includeOptions.push({
          model: Gallery,
          as: "artworks",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          order: [["createdAt", "ASC"]],
        });
      }

      const exhibition = await Exhibition.findByPk(id, {
        include: includeOptions,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (!exhibition) {
        return null;
      }

      // Додаємо додаткову інформацію про статус
      const exhibitionData = exhibition.toJSON();
      exhibitionData.status = {
        isActive: exhibition.isActive(),
        isUpcoming: exhibition.isUpcoming(),
        isPast: exhibition.isPast(),
        duration: exhibition.getDuration(),
      };

      return exhibitionData;
    } catch (error) {
      console.error("Помилка при отриманні виставки:", error);
      throw new Error("Не вдалося отримати виставку");
    }
  }

  /**
   * Створити нову виставку
   * @param {Object} exhibitionData - дані виставки
   * @returns {Promise<Object>} створена виставка
   */
  async createExhibition(exhibitionData) {
    try {
      const exhibition = await Exhibition.create(exhibitionData);
      return exhibition.toJSON();
    } catch (error) {
      console.error("Помилка при створенні виставки:", error);
      if (error.name === "SequelizeValidationError") {
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        throw new Error(
          `Помилки валідації: ${validationErrors
            .map((e) => e.message)
            .join(", ")}`
        );
      }
      throw new Error("Не вдалося створити виставку");
    }
  }

  /**
   * Оновити виставку
   * @param {number} id - ідентифікатор виставки
   * @param {Object} updateData - дані для оновлення
   * @returns {Promise<Object|null>} оновлена виставка або null
   */
  async updateExhibition(id, updateData) {
    try {
      const exhibition = await Exhibition.findByPk(id);

      if (!exhibition) {
        return null;
      }

      await exhibition.update(updateData);
      return exhibition.toJSON();
    } catch (error) {
      console.error("Помилка при оновленні виставки:", error);
      if (error.name === "SequelizeValidationError") {
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        throw new Error(
          `Помилки валідації: ${validationErrors
            .map((e) => e.message)
            .join(", ")}`
        );
      }
      throw new Error("Не вдалося оновити виставку");
    }
  }

  /**
   * Видалити виставку
   * @param {number} id - ідентифікатор виставки
   * @returns {Promise<boolean>} true якщо видалено, false якщо не знайдено
   */
  async deleteExhibition(id) {
    try {
      const exhibition = await Exhibition.findByPk(id);

      if (!exhibition) {
        return false;
      }

      await exhibition.destroy();
      return true;
    } catch (error) {
      console.error("Помилка при видаленні виставки:", error);
      throw new Error("Не вдалося видалити виставку");
    }
  }

  /**
   * Отримати статистику виставок
   * @returns {Promise<Object>} статистика
   */
  async getExhibitionsStats() {
    try {
      const today = new Date().toISOString().split("T")[0];

      const [total, active, upcoming, past, byCategory] = await Promise.all([
        Exhibition.count(),
        Exhibition.count({
          where: {
            startDate: { [Op.lte]: today },
            endDate: { [Op.gte]: today },
          },
        }),
        Exhibition.count({
          where: {
            startDate: { [Op.gt]: today },
          },
        }),
        Exhibition.count({
          where: {
            endDate: { [Op.lt]: today },
          },
        }),
        Exhibition.findAll({
          attributes: [
            "category",
            [sequelize.fn("COUNT", sequelize.col("id")), "count"],
          ],
          group: ["category"],
          raw: true,
        }),
      ]);

      return {
        total,
        active,
        upcoming,
        past,
        byCategory: byCategory.reduce((acc, item) => {
          acc[item.category] = parseInt(item.count);
          return acc;
        }, {}),
      };
    } catch (error) {
      console.error("Помилка при отриманні статистики:", error);
      throw new Error("Не вдалося отримати статистику виставок");
    }
  }

  /**
   * Отримати всі доступні категорії
   * @returns {Promise<Array>} масив категорій
   */
  async getCategories() {
    try {
      return Exhibition.getCategories();
    } catch (error) {
      console.error("Помилка при отриманні категорій:", error);
      throw new Error("Не вдалося отримати категорії");
    }
  }

  /**
   * Отримати всіх організаторів
   * @returns {Promise<Array>} масив унікальних організаторів
   */
  async getOrganizers() {
    try {
      const organizers = await Exhibition.findAll({
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col("organizer")), "organizer"],
        ],
        raw: true,
      });

      return organizers.map((item) => item.organizer).sort();
    } catch (error) {
      console.error("Помилка при отриманні організаторів:", error);
      throw new Error("Не вдалося отримати список організаторів");
    }
  }

  /**
   * Пошук виставок за різними критеріями
   * @param {string} query - пошуковий запит
   * @returns {Promise<Array>} масив знайдених виставок
   */
  async searchExhibitions(query) {
    try {
      const exhibitions = await Exhibition.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              description: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              location: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              organizer: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              category: {
                [Op.like]: `%${query}%`,
              },
            },
          ],
        },
        order: [["startDate", "ASC"]],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      return exhibitions;
    } catch (error) {
      console.error("Помилка при пошуку виставок:", error);
      throw new Error("Не вдалося виконати пошук виставок");
    }
  }
}

module.exports = new ExhibitionService();
