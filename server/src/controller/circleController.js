/* eslint-env node */
/* global require, module */

const Circle = require('../models/Circle');

// GET /api/circles - get all circles for logged in user
async function getCircles(request, response) {
    try {
        const circles = await Circle.find({
            'members.user': request.user.id
        });
        response.json(circles);
    } catch {
        response.status(500).json({ message: 'Failed to get circles' });
    }
}

// POST /api/circles - create a new circle
async function createCircle(request, response) {
    try {
        const { name } = request.body;

        if (!name || name.trim().length === 0) {
            return response.status(400).json({ message: 'Circle name is required' });
        }

        // check 5 circle limit
        const existingCircles = await Circle.find({ 'members.user': request.user.id });
        if (existingCircles.length >= 5) {
            return response.status(400).json({ message: 'You have reached the 5 circle limit' });
        }

        const newCircle = await Circle.create({
            name: name.trim(),
            owner: request.user.id,
            members: [{ user: request.user.id, role: 'owner' }]
        });

        response.status(201).json(newCircle);
    } catch {
        response.status(500).json({ message: 'Failed to create circle' });
    }
}

// PUT /api/circles/:id - rename a circle
async function updateCircle(request, response) {
    try {
        const { name } = request.body;

        const circle = await Circle.findById(request.params.id);

        if (!circle) {
            return response.status(404).json({ message: 'Circle not found' });
        }

        // only owner can rename
        if (circle.owner.toString() !== request.user.id) {
            return response.status(403).json({ message: 'Only the owner can rename this circle' });
        }

        circle.name = name.trim();
        await circle.save();

        response.json(circle);
    } catch {
        response.status(500).json({ message: 'Failed to update circle' });
    }
}

// DELETE /api/circles/:id - leave a circle
async function leaveCircle(request, response) {
    try {
        const circle = await Circle.findById(request.params.id);

        if (!circle) {
            return response.status(404).json({ message: 'Circle not found' });
        }

        // remove user from members
        circle.members = circle.members.filter(
            member => member.user.toString() !== request.user.id
        );

        // if no members left or user was owner, delete the circle
        if (circle.members.length === 0 || circle.owner.toString() === request.user.id) {
            await Circle.findByIdAndDelete(request.params.id);
        } else {
            await circle.save();
        }

        response.json({ message: 'Left circle successfully' });
    } catch {
        response.status(500).json({ message: 'Failed to leave circle' });
    }
}

module.exports = { getCircles, createCircle, updateCircle, leaveCircle };