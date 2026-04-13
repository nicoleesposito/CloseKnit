// CRUD boards and images
/* eslint-env node */
/* global require, module */

const express = require('express');
const router = express.Router({ mergeParams: true });
const protect = require('../middleware/auth');
const circleMember = require('../middleware/circleMember');
const upload = require('../middleware/upload');
const {
    getBoards,
    createBoard,
    getBoard,
    updateBoard,
    deleteBoard,
    uploadSlotImage,
    uploadCoverImage
} = require('../controller/memoryboardController');

router.get('/', protect, circleMember, getBoards);
router.post('/', protect, circleMember, createBoard);
router.get('/:boardId', protect, circleMember, getBoard);
router.put('/:boardId', protect, circleMember, updateBoard);
router.delete('/:boardId', protect, circleMember, deleteBoard);
router.post('/:boardId/images', protect, circleMember, upload.single('image'), uploadSlotImage);
router.put('/:boardId/cover', protect, circleMember, upload.single('image'), uploadCoverImage);

module.exports = router;
