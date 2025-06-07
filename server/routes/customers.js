const express = require("express");
const router = express.Router();
const protectCustomer = require("../middleware/protectCustomer");
const {
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
} = require("../controllers/customerController");

router.get("/", getAllCustomers);
router.post("/", createCustomer);
router.put("/:id/role", updateCustomerRole);
router.delete("/:id", deleteCustomer);
router.get("/abandoned-carts", getAbandonedCarts);
router.post("/:customerId/send-reminder", sendReminderEmail);
router.get("/me", protectCustomer, getProfile);
router.put("/update", protectCustomer, updateProfile);
router.put("/update-password", protectCustomer, updatePassword);
router.get("/orders", protectCustomer, getCustomerOrders);


module.exports = router;
