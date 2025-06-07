// Додаткові залежності
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Customer = require("../models/Customer");
const protectCustomer = require("../middleware/protectCustomer");
const router = express.Router();

// Тимчасове сховище (можна замінити на Redis)
const pendingRegistrations = new Map();

// Транспорт для відправки email
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// 1. Ініціація реєстрації
router.post("/initiate-registration", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Усі поля обов’язкові" });
  }

  try {
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email вже зареєстрований" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    pendingRegistrations.set(email, {
      name,
      email,
      phone,
      password: hashedPassword,
      code,
      expires: Date.now() + 10 * 60 * 1000 // 10 хвилин
    });

    await transporter.sendMail({
      from: "your_email@gmail.com",
      to: email,
      subject: "Код підтвердження реєстрації",
      text: `Ваш код підтвердження: ${code}`
    });

    res.json({ message: "Код відправлено на email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: "Неправильний email або пароль" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Неправильний email або пароль" });
    }

    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET || "default_secret", {
      expiresIn: "7d",
    });

    res.json({
      message: "Вхід успішний",
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка входу" });
  }
});
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;
  const data = pendingRegistrations.get(email);

  if (!data) {
    return res.status(400).json({ message: "Реєстрацію не знайдено або час вийшов" });
  }

  if (data.code !== code) {
    return res.status(400).json({ message: "Невірний код" });
  }

  if (Date.now() > data.expires) {
    pendingRegistrations.delete(email);
    return res.status(400).json({ message: "Термін дії коду вичерпано" });
  }

  try {
    const newCustomer = new Customer({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password
    });

    await newCustomer.save();
    pendingRegistrations.delete(email);

    res.status(201).json({ message: "Реєстрація підтверджена" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка збереження користувача" });
  }
});
router.get("/me", protectCustomer, async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    res.json({ customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});
module.exports = router;
