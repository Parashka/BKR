const express = require("express");
const router = express.Router();
const { handleLiqPayWebhook } = require("../controllers/liqpayWebhookController");

router.post("/webhook", express.urlencoded({ extended: false }), handleLiqPayWebhook);

module.exports = router;
