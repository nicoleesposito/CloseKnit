/* eslint-env node */
/* global require, module */

const MemoryBoard = require('../models/MemoryBoard');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');


// show the author (populate)
function populateBoard(query) {
    return query.populate('author', 'firstName lastName profilePicture');
}


// build memoryboard data with the default settings for it
function buildBoardData(body) {
    return {
        titleText: body.titleText || 'Board 1',
        templateId: body.templateId,
        pageCount: body.pageCount || 1,
        borderColorValue: body.borderColorValue || '#5245B5',
        borderWeightNumber: body.borderWeightNumber || 3
    };
}


// check the author permission for memoryboard
function isAuthor(board, userId) {
    return board.author.toString() === userId;
}


// get all boards from the backend
async function getBoards(request, response) {
    try {
        const boards = await populateBoard(
            MemoryBoard.find({ circle: request.params.circleId }).sort({ createdAt: -1 })
        );

        response.json(boards);
    } catch {
        response.status(500).json({ message: 'Failed to get memory boards' });
    }
}


// create a memoryboard
async function createBoard(request, response) {
    try {
        if (!request.body.templateId) {
            return response.status(400).json({ message: 'Template is required' });
        }

        const data = buildBoardData(request.body);
        data.author = request.user.id;
        data.circle = request.params.circleId;

        const newBoard = await MemoryBoard.create(data);

        await populateBoard(newBoard);

        response.status(201).json(newBoard);
    } catch {
        response.status(500).json({ message: 'Failed to create memory board' });
    }
}


// get only a single memory from the memoryboard
async function getBoard(request, response) {
    try {
        const board = await populateBoard(
            MemoryBoard.findById(request.params.boardId)
        );

        if (!board) {
            return response.status(404).json({ message: 'Board not found' });
        }

        response.json(board);
    } catch {
        response.status(500).json({ message: 'Failed to get memory board' });
    }
}


// update the selected memoryboard
async function updateBoard(request, response) {
    try {
        const board = await MemoryBoard.findById(request.params.boardId);

        if (!board) {
            return response.status(404).json({ message: 'Board not found' });
        }

        if (!isAuthor(board, request.user.id)) {
            return response.status(403).json({ message: 'Only the author can edit this board' });
        }

        const body = request.body;

        if (body.titleText !== undefined) {
            board.titleText = body.titleText;
        }

        if (body.pageCount !== undefined) {
            board.pageCount = body.pageCount;
        }

        if (body.borderColorValue !== undefined) {
            board.borderColorValue = body.borderColorValue;
        }

        if (body.borderWeightNumber !== undefined) {
            board.borderWeightNumber = body.borderWeightNumber;
        }

        await board.save();
        await populateBoard(board);

        response.json(board);
    } catch {
        response.status(500).json({ message: 'Failed to update memory board' });
    }
}


// delete a memoryboard
async function deleteBoard(request, response) {
    try {
        const board = await MemoryBoard.findById(request.params.boardId);

        if (!board) {
            return response.status(404).json({ message: 'Board not found' });
        }

        if (!isAuthor(board, request.user.id)) {
            return response.status(403).json({ message: 'Only the author can delete this board' });
        }

        // delete cover image
        if (board.coverImagePublicId) {
            await deleteFromCloudinary(board.coverImagePublicId);
        }

        // delete slot images
        const keys = Array.from(board.slotImagePublicIds.keys());

        for (let i = 0; i < keys.length; i++) {
            const publicId = board.slotImagePublicIds.get(keys[i]);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
        }

        await MemoryBoard.findByIdAndDelete(board._id);

        response.json({ message: 'Board deleted' });
    } catch {
        response.status(500).json({ message: 'Failed to delete memory board' });
    }
}


// upload a slot image for the memoryboard
async function uploadSlotImage(request, response) {
    try {
        const slotKey = request.body.slotKey;

        if (!request.file) {
            return response.status(400).json({ message: 'Image file is required' });
        }

        if (!slotKey) {
            return response.status(400).json({ message: 'Slot key is required' });
        }

        const board = await MemoryBoard.findById(request.params.boardId);

        if (!board) {
            return response.status(404).json({ message: 'Board not found' });
        }

        if (!isAuthor(board, request.user.id)) {
            return response.status(403).json({ message: 'Only the author can upload images' });
        }

        // delete old image if exists
        const existing = board.slotImagePublicIds.get(slotKey);
        if (existing) {
            await deleteFromCloudinary(existing);
        }

        const result = await uploadToCloudinary(request.file.buffer);

        board.slotImageMap.set(slotKey, result.url);
        board.slotImagePublicIds.set(slotKey, result.public_id);

        await board.save();

        response.json({ slotKey: slotKey, url: result.url });
    } catch {
        response.status(500).json({ message: 'Failed to upload slot image' });
    }
}


// upload cover image of the board
async function uploadCoverImage(request, response) {
    try {
        if (!request.file) {
            return response.status(400).json({ message: 'Image file is required' });
        }

        const board = await MemoryBoard.findById(request.params.boardId);

        if (!board) {
            return response.status(404).json({ message: 'Board not found' });
        }

        if (!isAuthor(board, request.user.id)) {
            return response.status(403).json({ message: 'Only the author can change the cover' });
        }

        if (board.coverImagePublicId) {
            await deleteFromCloudinary(board.coverImagePublicId);
        }

        const result = await uploadToCloudinary(request.file.buffer);

        board.coverImageUrl = result.url;
        board.coverImagePublicId = result.public_id;

        await board.save();

        response.json({ url: result.url });
    } catch {
        response.status(500).json({ message: 'Failed to upload cover image' });
    }
}


module.exports = {
    getBoards,
    createBoard,
    getBoard,
    updateBoard,
    deleteBoard,
    uploadSlotImage,
    uploadCoverImage
};