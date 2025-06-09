const Discount = require("../models/Discount");
const Product = require("../models/Product");

const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().populate("productId", "title price");
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: "Помилка при отриманні знижок" });
  }
};

const createDiscount = async (req, res) => {
  const { percentage, productId } = req.body;
  if (!percentage || !productId) {
    return res.status(400).json({ message: "Необхідно вказати всі поля" });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }

    if (!product.originalPrice) {
      product.originalPrice = product.price;
    }
    const discountFactor = (100 - percentage) / 100;
    product.price = Math.round(product.originalPrice * discountFactor);
    await product.save();
    const newDiscount = new Discount({ percentage, productId });
    await newDiscount.save();
    res.status(201).json({ message: "Знижку застосовано", discount: newDiscount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при створенні знижки" });
  }
};
const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: "Знижку не знайдено" });
    }

    const product = await Product.findById(discount.productId);
    if (product && product.originalPrice) {
      product.price = product.originalPrice;
      product.originalPrice = undefined;
      await product.save();
    }

    await discount.deleteOne();
    res.json({ message: "Знижку видалено та ціну відновлено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при видаленні знижки" });
  }
};

module.exports = {
  getAllDiscounts,
  createDiscount,
  deleteDiscount,
};
