const express = require("express");
const router = express.Router();
const { getCities, getWarehouses } = require("../controllers/novaPostController");

router.get("/cities", getCities);
router.get("/warehouses", getWarehouses);

module.exports = router;
