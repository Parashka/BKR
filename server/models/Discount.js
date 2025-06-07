const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    percentage: { type: Number, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true, // один товар — одна знижка
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);
