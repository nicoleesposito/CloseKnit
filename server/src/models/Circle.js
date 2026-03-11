// groups of users
/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

// structure of a circle in the database
const circleSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },

            role: {
                type: String,
                enum: [
                    'owner',
                    'member'
                ],
                default: 'member'
            },

            joinedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    invitations: [
        {
            email: {
                type: String,
                required: true,
                lowercase: true,
                trim: true
            },

            invitedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },

            status: {
                type: String,
                enum: [
                    'pending',
                    'accepted',
                    'rejected'
                ],
                default: 'pending'
            },

            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model('Circle', circleSchema);