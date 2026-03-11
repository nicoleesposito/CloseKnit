/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

// structure of a user in the database. expanded it for better code readability, last push had it all combined and ugly (formatted like docs)
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        default: ''
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    // stored as a hash, never plain text
    password: {
        type: String,
        required: true
    },

    // cloudinary URL
    profilePicture: {
        type: String,
        default: null
    },

    // cloudinary public ID for deletion
    profilePicturePublicId: {
        type: String,
        default: null
    }

}, {
    timestamps: true
});

// export the model so other files can use it
module.exports = mongoose.model('User', userSchema);