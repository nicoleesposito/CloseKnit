// journal posts within a circle
/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

// structure of a journal entry in the database
const journalEntrySchema = new mongoose.Schema({

    titleText: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    shortDescriptionText: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ''
    },

    bodyText: {
        type: String,
        trim: true,
        default: ''
    },

    fontName: {
        type: String,
        enum: [
            'Poppins',
            'Arial',
            'Georgia',
            'Times New Roman'
        ],
        default: 'Poppins'
    },

    textAlign: {
        type: String,
        enum: [
            'left',
            'center',
            'right'
        ],
        default: 'left'
    },

    isBold: {
        type: Boolean,
        default: false
    },

    isItalic: {
        type: Boolean,
        default: false
    },

    isUnderline: {
        type: Boolean,
        default: false
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
    },

    comments: [
        {
            text: {
                type: String,
                required: true,
                trim: true,
                maxlength: 2000
            },

            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        },
        { timestamps: true }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);