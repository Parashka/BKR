const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateCartItem, clearCart,removeFromCart } = require("../controllers/cartController");
const protectCustomer = require("../middleware/protectCustomer");

router.get("/", protectCustomer, getCart);
router.post("/add", protectCustomer, addToCart);
router.post("/update", protectCustomer, updateCartItem);
router.post("/clear", protectCustomer, clearCart);
router.delete("/remove/:productId", protectCustomer, removeFromCart);

module.exports = router;
