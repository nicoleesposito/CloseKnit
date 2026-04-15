/* eslint-env node */
/* global require, module */

const Circle = require('../models/Circle');
const User = require('../models/User');

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

// get the member list for a circle
async function getMembers(request, response) {
    try {
        const circleId = request.params.id;
        const userId = request.user.id;

        const circle = await Circle.findById(circleId);

        if (!circle) {
            return response.status(404).json({ message: 'Circle not found' });
        }

        // check requesting user is a member before returning the list
        let isMember = false;
        let index = 0;
        while (index < circle.members.length) {
            if (circle.members[index].user.toString() === userId) {
                isMember = true;
            }
            index = index + 1;
        }

        if (isMember === false) {
            return response.status(403).json({ message: 'Not a member of this circle' });
        }

        await circle.populate('members.user', 'firstName lastName email profilePicture');
        response.json(circle.members);
    } catch {
        response.status(500).json({ message: 'Failed to get members' });
    }
}

// add a member by email
async function addMember(request, response) {
    try {
        const circleId = request.params.id;
        const userId = request.user.id;
        const { email } = request.body;

        if (!email || email.trim().length === 0) {
            return response.status(400).json({ message: 'Email is required' });
        }

        const circle = await Circle.findById(circleId);

        if (!circle) {
            return response.status(404).json({ message: 'Circle not found' });
        }

        // check requesting user is a member of this circle
        let isMember = false;
        let index = 0;
        while (index < circle.members.length) {
            if (circle.members[index].user.toString() === userId) {
                isMember = true;
            }
            index = index + 1;
        }

        if (isMember === false) {
            return response.status(403).json({ message: 'Not a member of this circle' });
        }

        // check the 8 member limit
        if (circle.members.length >= 8) {
            return response.status(400).json({ message: 'This circle is full (8 member limit)' });
        }

        // look up the user by email
        const userToAdd = await User.findOne({ email: email.trim().toLowerCase() });

        if (!userToAdd) {
            return response.status(404).json({ message: 'No account found with that email' });
        }

        // check they are not already in the circle
        let alreadyMember = false;
        index = 0;
        while (index < circle.members.length) {
            if (circle.members[index].user.toString() === userToAdd._id.toString()) {
                alreadyMember = true;
            }
            index = index + 1;
        }

        if (alreadyMember === true) {
            return response.status(400).json({ message: 'That user is already in this circle' });
        }

        circle.members.push({ user: userToAdd._id, role: 'member' });
        await circle.save();

        await circle.populate('members.user', 'firstName lastName email profilePicture');
        response.json(circle.members);
    } catch {
        response.status(500).json({ message: 'Failed to add member' });
    }
}

// remove a member (owner only)
async function removeMember(request, response) {
    try {
        const circleId = request.params.id;
        const ownerId = request.user.id;
        const memberIdToRemove = request.params.userId;

        const circle = await Circle.findById(circleId);

        if (!circle) {
            return response.status(404).json({ message: 'Circle not found' });
        }

        // only the owner can remove members
        if (circle.owner.toString() !== ownerId) {
            return response.status(403).json({ message: 'Only the circle owner can remove members' });
        }

        // owner cannot remove themselves
        if (memberIdToRemove === ownerId) {
            return response.status(400).json({ message: 'The owner cannot be removed from the circle' });
        }

        const updatedMembers = [];
        let index = 0;
        while (index < circle.members.length) {
            if (circle.members[index].user.toString() !== memberIdToRemove) {
                updatedMembers.push(circle.members[index]);
            }
            index = index + 1;
        }

        circle.members = updatedMembers;
        await circle.save();

        await circle.populate('members.user', 'firstName lastName email profilePicture');
        response.json(circle.members);
    } catch {
        response.status(500).json({ message: 'Failed to remove member' });
    }
}

module.exports = { getCircles, createCircle, updateCircle, leaveCircle, getMembers, addMember, removeMember };