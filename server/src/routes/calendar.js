// CRUD events
/* eslint-env node */

const express = require('express');
const router = express.Router({ mergeParams: true });
const protect = require('../middleware/auth');
const circleMember = require('../middleware/circleMember');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controller/calendarController');

router.get('/', protect, circleMember, getEvents);
router.post('/', protect, circleMember, createEvent);
router.put('/:eventId', protect, circleMember, updateEvent);
router.delete('/:eventId', protect, circleMember, deleteEvent);

module.exports = router;
