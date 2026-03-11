/* eslint-env node */
/* global require, module */

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

module.exports = { updateProfilePicture };
