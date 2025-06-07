const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const protectCustomer = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret"); // ✅

      const customer = await Customer.findById(decoded.id).select("-password");
      if (!customer) {
        return res.status(401).json({ message: "Користувача не знайдено" });
      }

      req.customer = customer;
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Недійсний токен" });
    }
  }

  return res.status(401).json({ message: "Немає токена авторизації" });
};


module.exports = protectCustomer;
