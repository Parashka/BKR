const Customer = require("../models/Customer");
const GiftCard = require("../models/GiftCard");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
exports.getGiftCards = async (req, res) => {
  try {
    const cards = await GiftCard.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    console.error("Помилка при отриманні карток:", err);
    res.status(500).json({ message: "Помилка при отриманні подарункових карток" });
  }
};
exports.createGiftCard = async (req, res) => {
  const { code, title, type, discountPercent } = req.body;

  if (!code || !title || !type) {
    return res.status(400).json({ message: "Всі поля обов’язкові" });
  }

  if (
    (type === "product-discount" || type === "cart-discount") &&
    (discountPercent === undefined || discountPercent < 0 || discountPercent > 100)
  ) {
    return res.status(400).json({ message: "Неправильний відсоток знижки" });
  }

  try {
    const existing = await GiftCard.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Карта з таким кодом вже існує" });
    }

    const card = new GiftCard({ code, title, type, discountPercent });
    await card.save();

    res.status(201).json({ message: "Картку створено", card });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при створенні картки" });
  }
};

exports.deleteGiftCard = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await GiftCard.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Картку не знайдено" });
    }

    res.json({ message: "Картку видалено" });
  } catch (err) {
    console.error("Помилка при видаленні картки:", err);
    res.status(500).json({ message: "Помилка сервера при видаленні картки" });
  }
};


exports.sendGiftCards = async (req, res) => {
  const { giftCardId, sendToAll, sendToAbandoned, customerIds } = req.body;

  try {
    const giftCard = await GiftCard.findById(giftCardId);
    if (!giftCard) return res.status(404).json({ message: "Картку не знайдено" });

    let recipients = [];

    if (sendToAll) {
      recipients = await Customer.find({}, "email name");
    } else if (sendToAbandoned) {
      recipients = await Customer.find({ "cart.0": { $exists: true } }, "email name");
    } else if (Array.isArray(customerIds) && customerIds.length > 0) {
      recipients = await Customer.find({ _id: { $in: customerIds } }, "email name");
    } else {
      return res.status(400).json({ message: "Не обрано отримувачів" });
    }

    const results = [];

    for (const user of recipients) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `🎁 Ви отримали подарункову картку!`,
        html: `
          <p>Привіт, <b>${user.name}</b>!</p>
          <p>Ми даруємо вам подарункову картку на <b>${giftCard.amount || giftCard.discountPercent + "% знижки"}</b>.</p>
          <p><i>${giftCard.title}</i></p>
          <p>Використайте код: <b>${giftCard.code || "XXXX-XXXX"}</b></p>
          <p>Дякуємо, що ви з нами! 💙</p>
        `,
      };

      const sent = await transporter.sendMail(mailOptions);
      results.push({ email: user.email, status: "ok", id: sent.messageId });
    }

    res.json({ message: `Надіслано ${results.length} листів`, details: results });
  } catch (err) {
    console.error("Помилка при надсиланні:", err);
    res.status(500).json({ message: "Помилка при надсиланні подарункових карток" });
  }
};
