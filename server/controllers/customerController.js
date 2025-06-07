const Customer = require("../models/Customer");
const nodemailer = require("nodemailer");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id).select("-password");
    if (!customer) return res.status(404).json({ message: "Користувача не знайдено" });
    res.json({ customer });
  } catch (err) {
    res.status(500).json({ message: "Помилка при отриманні профілю" });
  }
};

const updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.customer._id,
      { name, phone },
      { new: true }
    ).select("-password");
    res.json({ message: "Дані оновлено", customer: updated });
  } catch (err) {
    res.status(500).json({ message: "Помилка при оновленні даних" });
  }
};


const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const customer = await Customer.findById(req.customer._id);
    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) return res.status(400).json({ message: "Неправильний поточний пароль" });

    const hashed = await bcrypt.hash(newPassword, 10);
    customer.password = hashed;
    await customer.save();

    res.json({ message: "Пароль змінено успішно" });
  } catch (err) {
    res.status(500).json({ message: "Помилка при зміні пароля" });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.customer.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Помилка при завантаженні замовлень" });
  }
};

const sendReminderEmail = async (req, res) => {
  const { customerId } = req.params;

  try {
    const customer = await Customer.findById(customerId).populate("cart.productId", "title price");

    if (!customer || customer.cart.length === 0) {
      return res.status(400).json({ message: "Кошик порожній або користувач не знайдений" });
    }
    const itemsList = customer.cart
      .map(item => `${item.productId.title} — ${item.quantity} шт.`)
      .join("\n");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: "Нагадування: у вас залишилися товари у кошику",
      text: `Доброго дня, ${customer.name}!\n\nВи залишили у кошику такі товари:\n\n${itemsList}\n\nНе забудьте завершити покупку!`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Нагадування успішно відправлено" });
  } catch (err) {
    console.error("Помилка відправки листа:", err);
    res.status(500).json({ message: "Помилка при відправці листа" });
  }
};
const updateCustomerRole = async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      { isAdmin },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json({ message: "Роль оновлено", customer: updated });
  } catch (err) {
    console.error("Помилка при оновленні ролі:", err);
    res.status(500).json({ message: "Помилка при оновленні ролі" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Покупця видалено" });
  } catch (err) {
    res.status(500).json({ message: "Помилка при видаленні покупця" });
  }
};
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при завантаженні покупців" });
  }
};

const createCustomer = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "ПІБ та телефон обов’язкові" });
  }

  try {
    if (email) {
      const existing = await Customer.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Цей email вже використовується" });
      }
    }

    const newCustomer = new Customer({ name, email, phone });
    await newCustomer.save();
    res.status(201).json({ message: "Покупця додано", customer: newCustomer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при створенні покупця" });
  }
};
const getAbandonedCarts = async (req, res) => {
  try {
  const customers = await Customer.find({ "cart.0": { $exists: true } })
    .populate("cart.productId", "title price")
    .select("name phone email cart"); 
      
    res.json(customers);
  } catch (err) {
    console.error("Помилка при завантаженні покинутих кошиків:", err);
    res.status(500).json({ message: "Помилка при завантаженні покинутих кошиків" });
  }
};

module.exports = {
  getAllCustomers,
  createCustomer,
  updateCustomerRole,
  deleteCustomer,
  getAbandonedCarts,
  sendReminderEmail,
  getProfile,
  updateProfile,
  updatePassword,
  getCustomerOrders,
};
