const Product = require("../models/Product");
const multer = require("multer");
const path = require("path"); 
const express = require("express");

const createProduct = async (req, res) => {
  const { title, description, price, quantity } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: "Назва та ціна обов’язкові" });
  }

  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({
      title,
      description,
      price,
      quantity,
      imageUrl,
    });

    await newProduct.save();
    res.status(201).json({ message: "Товар створено успішно", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при завантаженні товарів" });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, quantity } = req.body;

  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { title, description, price, quantity },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Товар не знайдено" });

    res.json({ message: "Товар оновлено", product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при оновленні" });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Товар не знайдено" });
    res.json({ message: "Товар видалено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при видаленні" });
  }
};
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
};