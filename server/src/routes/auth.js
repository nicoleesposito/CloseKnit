// login, register, logout, password reset
/* eslint-env node */
/* global require, module */

const express = require('express');
const router = express.Router();
const { register, login, logout, me } = require('../controller/authController');
const protect = require('../middleware/auth');

// public routes that anyone can access
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// only logged in users can access this
router.get('/me', protect, me);

module.exports = router;
