// configures file uploads with multer
// multer handles form data file uploads in express
// files are stored in memory (req.file.buffer), then controllers upload to Cloudinary
// docs: https://www.npmjs.com/package/multer
// https://expressjs.com/en/resources/middleware/multer.html

/* eslint-env node */
/* global require, module */

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = upload;
