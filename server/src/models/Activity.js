// logs of actions for the feed
/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

// structure of an activity log entry in the database
const activitySchema = new mongoose.Schema({

    type: {
        type: String,
        enum: [
            'journal',
            'memory',
            'calendar',
            'circle_join',
            'circle_invite',
            'comment'
        ],
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    circle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circle',
        required: true
    },

    referenceModel: {
        type: String,
        enum: [
            'JournalEntry',
            'CalendarEvent',
            'MemoryBoard',
            'Circle',
            null
        ],
        default: null
    },

    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },

    description: {
        type: String,
        default: ''
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);