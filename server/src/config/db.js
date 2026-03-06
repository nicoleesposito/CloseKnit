// sets up MongoDB connection using mongoose so that anytime the backend needs access to the db, it calls the process.

/* eslint-env node */
/* global require, process, module */


// MongoDB to React app: https://www.youtube.com/watch?v=SV0o0qOmKOQ

const mongoose = require('mongoose');

async function connectDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/closeknit';

    // takes client and passes in username and password
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
}

module.exports = connectDB;