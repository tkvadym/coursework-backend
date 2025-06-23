const express = require("express");
const exhibitionsRouter = require("./exhibitions");
const galleryRouter = require("./gallery");

const router = express.Router();

// Підключення маршрутів
router.use("/exhibitions", exhibitionsRouter);
router.use("/gallery", galleryRouter);

module.exports = router;
