const mongoose = require("mongoose");

const storeSettingsSchema = new mongoose.Schema({
  name: { type: String, default: "Мій магазин" }
});

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);
