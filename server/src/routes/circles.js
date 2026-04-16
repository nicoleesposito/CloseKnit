/* eslint-env node */
/* global require, module */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getCircles, createCircle, updateCircle, leaveCircle, getMembers, addMember, removeMember, sendInvitation, getInvitations, respondToInvitation } = require('../controller/circleController');

router.get('/', protect, getCircles);
router.post('/', protect, createCircle);
router.get('/invitations', protect, getInvitations);
router.put('/:id', protect, updateCircle);
router.delete('/:id', protect, leaveCircle);
router.get('/:id/members', protect, getMembers);
router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);
router.post('/:id/invitations', protect, sendInvitation);
router.patch('/:id/invitations/:invitationId', protect, respondToInvitation);

module.exports = router;