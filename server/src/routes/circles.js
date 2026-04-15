/* eslint-env node */
/* global require, module */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getCircles, createCircle, updateCircle, leaveCircle, getMembers, addMember, removeMember } = require('../controller/circleController');

router.get('/', protect, getCircles);
router.post('/', protect, createCircle);
router.put('/:id', protect, updateCircle);
router.delete('/:id', protect, leaveCircle);
router.get('/:id/members', protect, getMembers);
router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);

module.exports = router;