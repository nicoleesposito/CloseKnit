// sets up cloudinary to store image files.

/* eslint-env node */
/* global require, process, module */

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function deleteFromCloudinary(publicId) {
  await cloudinary.uploader.destroy(publicId);
}

module.exports = { cloudinary, deleteFromCloudinary };