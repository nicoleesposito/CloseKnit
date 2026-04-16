/* eslint-env node */
/* global require, module */

const express = require('express');
const router = express.Router();
const { getNotifications } = require('../controller/notificationController');
const protect = require('../middleware/auth');

router.get('/', protect, getNotifications);

module.exports = router;
