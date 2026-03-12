/* eslint-env node */
/* global require, module */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getCircles, createCircle, updateCircle, leaveCircle } = require('../controller/circleController');

router.get('/', protect, getCircles);
router.post('/', protect, createCircle);
router.put('/:id', protect, updateCircle);
router.delete('/:id', protect, leaveCircle);

module.exports = router;