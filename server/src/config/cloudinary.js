// sets up cloudinary to store image files.

/* eslint-env node */
/* global require, process, module */

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'closeknit', transformation: [{ width: 1200, crop: 'limit' }] },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
}

async function deleteFromCloudinary(publicId) {
  await cloudinary.uploader.destroy(publicId);
}

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };