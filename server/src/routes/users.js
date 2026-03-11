// profile updates, settings, picture uploads
/* eslint-env node */
/* global require, module */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { updateProfilePicture } = require('../controller/userController');

// requires login. accepts a single image file under the field name 'image'
router.patch('/profile-picture', protect, upload.single('image'), updateProfilePicture);

module.exports = router;
