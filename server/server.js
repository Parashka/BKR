const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/customers', require('./routes/customers'));
app.use('/discounts', require('./routes/discounts'));
app.use('/orders', require('./routes/orders'));
app.use('/gift-cards', require('./routes/giftCards'));
app.use('/store-settings', require('./routes/storeSettings'));
app.use('/customerAuth/customer', require('./routes/customerAuth'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/novaposhta', require('./routes/novapost'));
app.use('/liqpay', require('./routes/liqpayRoutes'));
app.use('/liqpay', require('./routes/liqpayWebhookRoutes'));
app.use('/analytics', require('./routes/analytics'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const distPath = path.join(__dirname, 'client', 'build');
console.log("Dist path:", distPath);

app.use(express.static(distPath));

app.use('/', (req, res) => {
  console.log("Sending index.html from:", distPath);
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
