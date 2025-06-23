const express = require("express");
const router = express.Router();
const { GalleryService } = require("../services");

/**
 * GET /api/gallery
 * Отримати список всіх картин з можливістю фільтрації та пагінації
 */
router.get("/", async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search,
      exhibitionId: req.query.exhibitionId,
      sortBy: req.query.sortBy || "createdAt",
      sortOrder: req.query.sortOrder || "ASC",
    };

    const result = await GalleryService.getAllArtworks(options);

    res.json({
      success: true,
      data: result.artworks,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Помилка при отриманні картин:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Внутрішня помилка сервера",
    });
  }
});

module.exports = router;
