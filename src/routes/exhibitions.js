const express = require("express");
const router = express.Router();
const { ExhibitionService } = require("../services");

/**
 * GET /api/exhibitions
 * Отримати список всіх виставок з можливістю фільтрації та пагінації
 */
router.get("/", async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      category: req.query.category,
      search: req.query.search,
      organizer: req.query.organizer,
      status: req.query.status,
      sortBy: req.query.sortBy || "startDate",
      sortOrder: req.query.sortOrder || "ASC",
    };

    const result = await ExhibitionService.getAllExhibitions(options);

    res.json({
      success: true,
      data: result.exhibitions,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Помилка при отриманні виставок:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Внутрішня помилка сервера",
    });
  }
});

/**
 * GET /api/exhibitions/:id
 * Отримати виставку за ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const includeArtworks = req.query.includeArtworks === "true";

    const exhibition = await ExhibitionService.getExhibitionById(
      id,
      includeArtworks
    );

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: "Виставку не знайдено",
      });
    }

    res.json({
      success: true,
      data: exhibition,
    });
  } catch (error) {
    console.error("Помилка при отриманні виставки:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Внутрішня помилка сервера",
    });
  }
});

module.exports = router;
