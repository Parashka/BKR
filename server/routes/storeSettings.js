const express = require("express");
const router = express.Router();
const StoreSettings = require("../models/StoreSettings");

// GET /store-name
router.get("/store-name", async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({});
    }
    res.json({ name: settings.name });
  } catch (err) {
    res.status(500).json({ message: "Помилка завантаження назви" });
  }
});

// PUT /store-name
router.put("/store-name", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Назва не може бути порожньою" });

    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({ name });
    } else {
      settings.name = name;
      await settings.save();
    }

    res.json({ message: "Назву оновлено", name: settings.name });
  } catch (err) {
    res.status(500).json({ message: "Помилка оновлення назви" });
  }
});

module.exports = router;
