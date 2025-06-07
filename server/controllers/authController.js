const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: 'Введіть логін/емейл і пароль' });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Невірний пароль' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Вхід успішний',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Помилка логіну:', error.message);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword, secretQuestion, secretAnswer } = req.body;

  if (!username || !email || !password || !confirmPassword || !secretQuestion || !secretAnswer) {
    return res.status(400).json({ message: 'Будь ласка, заповніть усі поля' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Паролі не співпадають' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Такий логін або email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      secretQuestion,
      secretAnswer
    });

    await newUser.save();
    res.status(201).json({ message: 'Реєстрація успішна' });

  } catch (error) {
    console.error('Помилка реєстрації:', error.message);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

module.exports = {
  registerUser,
  loginUser
};
