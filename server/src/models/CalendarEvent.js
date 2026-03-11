// events scheduled in a circle
/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

// structure of a calendar event in the database
const calendarEventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    type: {
        type: String,
        enum: [
            'Birthday',
            'Goal',
            'Event',
            'Custom'
        ],
        default: 'Event'
    },

    // format is YYYY-MM-DD
    dateKey: {
        type: String,
        required: true
    },

    startTime: {
        type: String,
        default: '12:00 AM'
    },

    endTime: {
        type: String,
        default: '11:59 PM'
    },

    note: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ''
    },

    color: {
        type: String,
        default: '#6c63ff'
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    circle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circle',
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);