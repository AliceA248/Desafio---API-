const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/user', authMiddleware.authenticateToken, authController.getUser);

module.exports = router;
