const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Помилка при завантаженні замовлень" });
  }
};
const createOrderFromCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id).populate("cart.productId");

    if (!customer || customer.cart.length === 0) {
      return res.status(400).json({ message: "Кошик порожній" });
    }

    const items = customer.cart.map(item => ({
      title: item.productId.title,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const newOrder = new Order({
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      items,
      totalPrice,
      paymentMethod: req.body.paymentMethod,
      deliveryWarehouse: req.body.deliveryWarehouse,
    });

    await newOrder.save();

    // Очистити кошик
    customer.cart = [];
    await customer.save();

    res.status(201).json({ message: "Замовлення створено", order: newOrder });
  } catch (err) {
    console.error("Помилка створення замовлення з кошика:", err);
    res.status(500).json({ message: "Помилка при створенні замовлення" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Статус обов’язковий" });
  }

  try {
    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }

    res.json({ message: "Статус оновлено", order: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при оновленні статусу" });
  }
};

const createOrder = async (req, res) => {
const {
  items,
  totalPrice,
  status,
  customerName,
  customerEmail,
  customerPhone,
  paymentMethod,
  deliveryMethod, 
  novaPoshtaOffice,
  city,
  isPaid, 
  isNewCustomer
} = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Потрібно вибрати товари" });
  }

  if (!customerName || !customerPhone) {
    return res.status(400).json({ message: "ПІБ і номер телефону обов’язкові" });
  }

  try {
    if (isNewCustomer && customerEmail) {
      const existing = await Customer.findOne({ email: customerEmail });
      if (existing) {
        return res.status(400).json({ message: "Цей email вже зареєстровано іншим покупцем" });
      }
    }

const newOrder = new Order({
  items,
  totalPrice,
  status,
  customerName,
  customerEmail,
  customerPhone,
  paymentMethod,       
  deliveryMethod,      
  novaPoshtaOffice,    
  city,
  isPaid: !!isPaid, 
});
    await newOrder.save();
    for (const item of items) {
      if (item._id) {
        await Product.findByIdAndUpdate(
          item._id,
          { $inc: { quantity: -item.quantity } },
          { new: true }
        );
      }
    }

    res.status(201).json({ message: "Замовлення створено", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при створенні замовлення" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Замовлення видалено" });
  } catch (err) {
    res.status(500).json({ message: "Помилка при видаленні" });
  }
};


module.exports = {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  createOrderFromCart,
};
