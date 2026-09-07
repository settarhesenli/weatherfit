const express = require("express");
const Item = require("../models/Item");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GET /items
// Bütün clothing items-ləri gətirir
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      message: "Failed to get items",
    });
  }
});

// POST /items
// Yeni clothing item yaradır
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, imageUrl, weather } = req.body;

    if (!name || !imageUrl || !weather) {
      return res.status(400).json({
        message: "name, imageUrl and weather are required",
      });
    }

    const item = await Item.create({
      name,
      imageUrl,
      weather,
      owner: req.user._id,
      likes: [],
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({
      message: "Failed to create item",
    });
  }
});

module.exports = router;
