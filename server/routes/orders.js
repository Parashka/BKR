const express = require("express");
const router = express.Router();
const protectCustomer = require("../middleware/protectCustomer");
const {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  createOrderFromCart,
} = require("../controllers/orderController");

router.get("/", getAllOrders);
router.post("/", createOrder);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);
router.post("/from-cart", protectCustomer, createOrderFromCart);

module.exports = router;
