const crypto = require("crypto");

const LIQPAY_PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY;
const LIQPAY_PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY;

function generateSignature(data) {
  const shasum = crypto.createHash("sha1");
  shasum.update(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
  const sha1Result = shasum.digest("hex");
  return Buffer.from(sha1Result, "hex").toString("base64");
}

const createPayment = (req, res) => {
  const { amount, orderInfo, currency, returnUrl, failUrl } = req.body;

  const paymentData = {
    public_key: LIQPAY_PUBLIC_KEY,
    version: "3",
    action: "pay",
    amount,
    currency,
    description: orderInfo,
    order_id: Date.now().toString(),
    sandbox: 1,
    result_url: returnUrl,
    server_url: failUrl,
  };

  const jsonStr = JSON.stringify(paymentData);
  const data = Buffer.from(jsonStr).toString("base64");
  const signature = generateSignature(data);

  res.json({ data, signature, paymentUrl: `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}` });
};

module.exports = { createPayment };
