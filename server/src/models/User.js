/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

// This defines the shape of a user document in MongoDB
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true }, // will be stored as a hash, never plain text
}, { timestamps: true }); // automatically adds createdAt and updatedAt fields

// Export the model so other files can use it
module.exports = mongoose.model('User', userSchema);
