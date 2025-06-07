const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');
const { loginUser } = require('../controllers/authController');
const { protects } = require('../middleware/authMiddleware.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protects, (req, res) => {
  res.status(200).json({
    message: 'Захищений контент!',
    user: req.user
  });
});
module.exports = router;

