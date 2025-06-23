const { Gallery, Exhibition, sequelize } = require("../models");
const { Op } = require("sequelize");

/**
 * Сервіс для роботи з галереєю картин виставок
 */
class GalleryService {
  /**
   * Додати картину до виставки
   * @param {number} exhibitionId - ID виставки
   * @param {Object} artworkData - дані картини
   * @returns {Promise<Object>} створена картина
   */
  async addArtworkToExhibition(exhibitionId, artworkData) {
    try {
      // Перевіряємо, чи існує виставка
      const exhibition = await Exhibition.findByPk(exhibitionId);
      if (!exhibition) {
        throw new Error("Виставка з таким ID не існує");
      }

      const artwork = await Gallery.create({
        ...artworkData,
        exhibitionId,
      });

      return artwork.toJSON();
    } catch (error) {
      console.error("Помилка при додаванні картини до виставки:", error);
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
      throw new Error(error.message || "Не вдалося додати картину до виставки");
    }
  }

  /**
   * Отримати картини виставки
   * @param {number} exhibitionId - ID виставки
   * @returns {Promise<Array>} масив картин
   */
  async getExhibitionArtworks(exhibitionId) {
    try {
      const artworks = await Gallery.findAll({
        where: { exhibitionId },
        order: [["createdAt", "ASC"]],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      return artworks;
    } catch (error) {
      console.error("Помилка при отриманні картин виставки:", error);
      throw new Error("Не вдалося отримати картини виставки");
    }
  }

  /**
   * Отримати картину за ID
   * @param {number} artworkId - ID картини
   * @returns {Promise<Object|null>} картина або null
   */
  async getArtworkById(artworkId) {
    try {
      const artwork = await Gallery.findByPk(artworkId, {
        include: [
          {
            model: Exhibition,
            as: "exhibition",
            attributes: ["id", "title", "location"],
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      return artwork;
    } catch (error) {
      console.error("Помилка при отриманні картини:", error);
      throw new Error("Не вдалося отримати картину");
    }
  }

  /**
   * Оновити картину
   * @param {number} artworkId - ID картини
   * @param {Object} updateData - дані для оновлення
   * @returns {Promise<Object|null>} оновлена картина або null
   */
  async updateArtwork(artworkId, updateData) {
    try {
      const artwork = await Gallery.findByPk(artworkId);

      if (!artwork) {
        return null;
      }

      await artwork.update(updateData);
      return artwork.toJSON();
    } catch (error) {
      console.error("Помилка при оновленні картини:", error);
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
      throw new Error("Не вдалося оновити картину");
    }
  }

  /**
   * Видалити картину з виставки
   * @param {number} artworkId - ID картини
   * @returns {Promise<boolean>} true якщо видалено, false якщо не знайдено
   */
  async removeArtworkFromExhibition(artworkId) {
    try {
      const artwork = await Gallery.findByPk(artworkId);

      if (!artwork) {
        return false;
      }

      await artwork.destroy();
      return true;
    } catch (error) {
      console.error("Помилка при видаленні картини:", error);
      throw new Error("Не вдалося видалити картину");
    }
  }

  /**
   * Отримати всі картини з можливістю фільтрації та пагінації
   * @param {Object} options - опції запиту
   * @param {number} options.page - номер сторінки (за замовчуванням 1)
   * @param {number} options.limit - кількість записів на сторінку (за замовчуванням 10)
   * @param {string} options.search - пошук за назвою або автором
   * @param {number} options.exhibitionId - фільтр за виставкою
   * @param {string} options.sortBy - поле для сортування (за замовчуванням createdAt)
   * @param {string} options.sortOrder - порядок сортування (ASC або DESC, за замовчуванням ASC)
   * @returns {Promise<Object>} об'єкт з картинами та метаданими пагінації
   */
  async getAllArtworks(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        exhibitionId,
        sortBy = "createdAt",
        sortOrder = "ASC",
      } = options;

      const offset = (page - 1) * limit;
      const where = {};

      // Фільтр за виставкою
      if (exhibitionId) {
        where.exhibitionId = exhibitionId;
      }

      // Пошук за назвою або автором
      if (search) {
        where[Op.or] = [
          {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            artist: {
              [Op.like]: `%${search}%`,
            },
          },
        ];
      }

      const { count, rows } = await Gallery.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]],
        include: [
          {
            model: Exhibition,
            as: "exhibition",
            attributes: ["id", "title", "location"],
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      const totalPages = Math.ceil(count / limit);

      return {
        artworks: rows,
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
      console.error("Помилка при отриманні картин:", error);
      throw new Error("Не вдалося отримати список картин");
    }
  }
}

module.exports = new GalleryService();
