// fetching activity feed through ID
/* eslint-env node */

const express = require('express');
const router = express.Router({ mergeParams: true });
const protect = require('../middleware/auth');
const circleMember = require('../middleware/circleMember');
const { getActivity } = require('../controller/activityController');

router.get('/', protect, circleMember, getActivity);

module.exports = router;
