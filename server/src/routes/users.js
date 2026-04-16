// profile updates, settings, picture uploads
/* eslint-env node */
/* global require, module */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { updateProfilePicture, updateName, updatePassword } = require('../controller/userController');

// requires login. accepts a single image file under the field name 'image'
router.patch('/profile-picture', protect, upload.single('image'), updateProfilePicture);

// requires login. updates first and last name
router.patch('/profile', protect, updateName);

// requires login. updates password
router.patch('/password', protect, updatePassword);

module.exports = router;
