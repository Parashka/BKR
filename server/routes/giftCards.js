const express = require("express");
const router = express.Router();
const {
  createGiftCard,
  sendGiftCards,
  deleteGiftCard,
  getGiftCards,
} = require("../controllers/giftcardController");

router.post("/", createGiftCard);
router.post("/send", sendGiftCards);
router.get("/", getGiftCards);

router.delete("/:id", deleteGiftCard);

module.exports = router;
