/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

// structure of a memory board in the database
const memoryBoardSchema = new mongoose.Schema({

    titleText: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
        default: 'Board 1'
    },

    templateId: {
        type: String,
        enum: [
            'template-1',
            'template-2',
            'template-3',
            'template-4',
            'template-5',
            'template-6'
        ],
        required: true
    },

    pageCount: {
        type: Number,
        enum: [1, 2],
        default: 1
    },

    // Cloudinary URL
    coverImageUrl: {
        type: String,
        default: null
    },

    // Cloudinary public ID for deletion
    coverImagePublicId: {
        type: String,
        default: null
    },

    // slotKey associates to Cloudinary URL
    slotImageMap: {
        type: Map,
        of: String,
        default: {}
    },

    // slotKey associates to Cloudinary public ID
    slotImagePublicIds: {
        type: Map,
        of: String,
        default: {}
    },

    borderColorValue: {
        type: String,
        default: '#5245B5'
    },

    borderWeightNumber: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
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

module.exports = mongoose.model('MemoryBoard', memoryBoardSchema);