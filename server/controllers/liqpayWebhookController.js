const crypto = require("crypto");

const LIQPAY_PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY;

function verifySignature(data, signature) {
  const sha1 = crypto.createHash("sha1");
  sha1.update(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
  const expectedSignature = Buffer.from(sha1.digest("hex")).toString("base64");
  return expectedSignature === signature;
}

const handleLiqPayWebhook = (req, res) => {
  try {
    const { data, signature } = req.body;

    if (!verifySignature(data, signature)) {
      return res.status(400).json({ message: "Невірний підпис" });
    }

    const paymentData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

    console.log("Отримано webhook від LiqPay:", paymentData);

    // Тут можна обробити статус платежу:
    // paymentData.status === 'success' / 'failure' / 'wait_secure' / 'sandbox' і т.д.
    // Наприклад, оновити статус замовлення в базі

    // Відповідаємо LiqPay успішним кодом
    res.status(200).json({ message: "OK" });
  } catch (err) {
    console.error("Помилка webhook LiqPay:", err);
    res.status(500).json({ message: "Помилка обробки webhook" });
  }
};

module.exports = { handleLiqPayWebhook };
