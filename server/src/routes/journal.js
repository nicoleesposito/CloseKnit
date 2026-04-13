// CRUD journal entries, comments
/* eslint-env node */
/* global require, module */

const express = require('express');
const router = express.Router({ mergeParams: true });
const protect = require('../middleware/auth');
const circleMember = require('../middleware/circleMember');
const {
    getJournalEntries,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addComment,
    deleteComment
} = require('../controller/journalController');

router.get('/', protect, circleMember, getJournalEntries);
router.post('/', protect, circleMember, createJournalEntry);
router.put('/:entryId', protect, circleMember, updateJournalEntry);
router.delete('/:entryId', protect, circleMember, deleteJournalEntry);
router.post('/:entryId/comments', protect, circleMember, addComment);
router.delete('/:entryId/comments/:commentId', protect, circleMember, deleteComment);

module.exports = router;
