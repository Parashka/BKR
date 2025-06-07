const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // Унікальний код карти
    title: { type: String, required: true },              // Назва
    type: {
      type: String,
      required: true,
      enum: ["product-discount", "free-shipping", "cart-discount"], // Тип карти
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      required: function () {
        return this.type === "product-discount" || this.type === "cart-discount";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GiftCard", giftCardSchema);
