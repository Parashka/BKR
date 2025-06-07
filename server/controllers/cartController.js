const Customer = require("../models/Customer");
const Product = require("../models/Product");

// Отримати кошик поточного користувача
const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id).populate("cart.productId");
    res.json({ cart: customer.cart.map(item => ({
      product: item.productId,
      quantity: item.quantity
    })) });
  } catch (err) {
    res.status(500).json({ message: "Помилка при завантаженні кошика" });
  }
};

// Додати товар у кошик
const addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const customer = await Customer.findById(req.customer._id);
    const existing = customer.cart.find(item => item.productId.toString() === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      customer.cart.push({ productId, quantity: 1 });
    }

    await customer.save();
    res.json({ message: "Товар додано до кошика" });
  } catch (err) {
    res.status(500).json({ message: "Помилка при додаванні в кошик" });
  }
};

// Оновити кількість товару
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const customer = await Customer.findById(req.customer._id);
    const item = customer.cart.find(item => item.productId.toString() === productId);

    if (!item) return res.status(404).json({ message: "Товар не знайдено в кошику" });

    item.quantity = quantity;
    await customer.save();

    res.json({ message: "Кількість оновлено" });
  } catch (err) {
    res.status(500).json({ message: "Помилка оновлення товару" });
  }
};

// Очистити кошик (опціонально)

const clearCart = async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.customer._id, { cart: [] });
    res.json({ message: "Кошик очищено" });
  } catch (err) {
    console.error("Помилка при очищенні кошика:", err);
    res.status(500).json({ message: "Помилка сервера при очищенні кошика" });
  }
};
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
   const customerId = req.customer._id;

  await Customer.updateOne(
    { _id: customerId },
    { $pull: { cart: { productId: productId } } }
  );


    res.sendStatus(200);
  } catch (error) {
    console.error("Помилка при видаленні товару з кошика:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};


module.exports = { getCart, addToCart, updateCartItem, clearCart,removeFromCart};
