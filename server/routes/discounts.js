const express = require("express");
const router = express.Router();
const {
  getAllDiscounts,
  createDiscount,
  deleteDiscount,
} = require("../controllers/discountController");

router.get("/", getAllDiscounts);
router.post("/", createDiscount);
router.delete("/:id", deleteDiscount); 

module.exports = router;
