const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: String,
    customerPhone: String,
    items: [
      {
        title: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Очікує", "Активне", "Виконано"],
      default: "Очікує",
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cash"], // узгоджено з frontend значеннями
      required: true,
    },
    deliveryMethod: {
      type: String,
      enum: ["Нова пошта"],
      default: "Нова пошта",
    },
    novaPoshtaOffice: String, // Назва/адреса відділення, отримана з Nova Poshta API
    address: String, // Не обов’язкове, залишаємо для можливих майбутніх способів доставки
    city: { type: String }, 
    paid: {
    type: Boolean,
    default: false,
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
