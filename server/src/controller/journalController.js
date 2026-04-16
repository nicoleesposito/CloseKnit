/* eslint-env node */
/* global require, module */

const JournalEntry = require('../models/JournalEntry');
const logActivity = require('../utilities/activityLog');


// function to populate author and comment authors
function populateEntry(query) {
    return query
        .populate('author', 'firstName lastName profilePicture')
        .populate('comments.author', 'firstName lastName profilePicture');
}


// function to build entry data with defaults
function buildEntryData(body) {
    return {
        titleText: body.titleText,
        shortDescriptionText: body.shortDescriptionText || '',
        bodyText: body.bodyText || '',
        fontName: body.fontName || 'Poppins',
        textAlign: body.textAlign || 'left',
        isBold: body.isBold || false,
        isItalic: body.isItalic || false,
        isUnderline: body.isUnderline || false
    };
}


// get journal entries from db
async function getJournalEntries(request, response) {
    try {
        const circleId = request.params.circleId;

        const entries = await populateEntry(
            JournalEntry.find({ circle: circleId }).sort({ createdAt: -1 })
        );

        response.json(entries);
    } catch {
        response.status(500).json({ message: 'Failed to get journal entries' });
    }
}


// create a journal entry
async function createJournalEntry(request, response) {
    try {
        const circleId = request.params.circleId;
        const userId = request.user.id;

        if (!request.body.titleText || request.body.titleText.trim().length === 0) {
            return response.status(400).json({ message: 'Title is required' });
        }

        const data = buildEntryData(request.body);
        data.author = userId;
        data.circle = circleId;

        const newEntry = await JournalEntry.create(data);

        await logActivity('journal', userId, circleId, 'JournalEntry', newEntry._id, 'shared a journal entry');

        const populatedEntry = await populateEntry(JournalEntry.findById(newEntry._id));

        response.status(201).json(populatedEntry);
    } catch {
        response.status(500).json({ message: 'Failed to create journal entry' });
    }
}


// update a journal entry
async function updateJournalEntry(request, response) {
    try {
        const entryId = request.params.entryId;

        const entry = await JournalEntry.findById(entryId);

        if (!entry) {
            return response.status(404).json({ message: 'Entry not found' });
        }

        const data = buildEntryData(request.body);

        Object.assign(entry, data);

        await entry.save();

        const populatedEntry = await populateEntry(JournalEntry.findById(entry._id));

        response.json(populatedEntry);
    } catch {
        response.status(500).json({ message: 'Failed to update journal entry' });
    }
}


// delete a journal entry
async function deleteJournalEntry(request, response) {
    try {
        const entryId = request.params.entryId;
        const userId = request.user.id;

        const entry = await JournalEntry.findById(entryId);

        if (!entry) {
            return response.status(404).json({ message: 'Entry not found' });
        }

        if (entry.author.toString() !== userId) {
            return response.status(403).json({ message: 'Only the author can delete this entry' });
        }

        await JournalEntry.findByIdAndDelete(entryId);

        response.json({ message: 'Entry deleted' });
    } catch {
        response.status(500).json({ message: 'Failed to delete journal entry' });
    }
}


// add a comment
async function addComment(request, response) {
    try {
        const entryId = request.params.entryId;
        const userId = request.user.id;
        const text = request.body.text;

        if (!text || text.trim().length === 0) {
            return response.status(400).json({ message: 'Comment text is required' });
        }

        const entry = await JournalEntry.findById(entryId);

        if (!entry) {
            return response.status(404).json({ message: 'Entry not found' });
        }

        entry.comments.push({
            text: text.trim(),
            author: userId
        });

        await entry.save();

        const populatedEntry = await populateEntry(JournalEntry.findById(entry._id));

        response.json(populatedEntry);
    } catch {
        response.status(500).json({ message: 'Failed to add comment' });
    }
}


// delete a comment
async function deleteComment(request, response) {
    try {
        const entryId = request.params.entryId;
        const commentId = request.params.commentId;
        const userId = request.user.id;

        const entry = await JournalEntry.findById(entryId);

        if (!entry) {
            return response.status(404).json({ message: 'Entry not found' });
        }

        const commentToDelete = entry.comments.find(function (comment) {
            return comment._id.toString() === commentId;
        });

        if (!commentToDelete) {
            return response.status(404).json({ message: 'Comment not found' });
        }

        if (commentToDelete.author.toString() !== userId) {
            return response.status(403).json({ message: 'Only the comment author can delete this comment' });
        }

        entry.comments.pull({ _id: commentId });

        await entry.save();

        const populatedEntry = await populateEntry(JournalEntry.findById(entry._id));

        response.json(populatedEntry);
    } catch {
        response.status(500).json({ message: 'Failed to delete comment' });
    }
}


module.exports = {
    getJournalEntries,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addComment,
    deleteComment
};