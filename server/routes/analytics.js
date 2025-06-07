const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const Order = require("../models/Order");

// Повертає кількість реєстрацій по днях
router.get("/registrations", async (req, res) => {
  try {
    const data = await Customer.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = data.map((entry) => ({
      date: entry._id,
      count: entry.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Помилка реєстраційної статистики:", err);
    res.status(500).json({ message: "Помилка статистики" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = data.map((entry) => ({
      date: entry._id,
      count: entry.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Помилка статистики замовлень:", err);
    res.status(500).json({ message: "Помилка статистики" });
  }
});

module.exports = router;
