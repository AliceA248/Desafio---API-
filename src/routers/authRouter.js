
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/user', authController.verifyToken, authController.getUser);

module.exports = router;
