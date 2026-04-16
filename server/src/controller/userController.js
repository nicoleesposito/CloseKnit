/* eslint-env node */
/* global require, module */

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// uploads a new profile picture to cloudinary, deletes the old one, and saves the url to the user
async function updateProfilePicture(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: 'No image provided' });
    }

    const user = await User.findById(req.user.id);

    // delete old cloudinary image if one exists
    if (user.profilePicturePublicId) {
        await deleteFromCloudinary(user.profilePicturePublicId);
    }

    const { url, public_id } = await uploadToCloudinary(req.file.buffer);

    user.profilePicture = url;
    user.profilePicturePublicId = public_id;
    await user.save();

    res.json({ profilePicture: url });
}

// updates first name, last name, and email
async function updateName(req, res) {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    // check if email is already taken by a different user
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing._id.toString() !== req.user.id) {
        return res.status(400).json({ message: 'Email is already in use' });
    }

    const user = await User.findById(req.user.id);
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email.toLowerCase();
    await user.save();

    res.json({ firstName: user.firstName, lastName: user.lastName, email: user.email });
}

// verifies current password and saves a new hashed password
async function updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new password are required' });
    }

    const user = await User.findById(req.user.id);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
        return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
}

module.exports = { updateProfilePicture, updateName, updatePassword };
