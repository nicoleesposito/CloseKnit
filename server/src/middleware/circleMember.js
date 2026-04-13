// checks if a user belongs to a specific circle before allowing access to circle routes
/* eslint-env node */
/* global require, module */

const Circle = require('../models/Circle');

// this runs before circle routes to make sure the user is a member
async function circleMember(request, response, next) {
    try {
        const circleId = request.params.circleId;

        const circle = await Circle.findById(circleId);

        if (!circle) {
            return response.status(404).json({ message: 'Circle not found' });
        }

        // checks if the logged in user is in the members list
        let isMember = false;

        let index = 0;
        while (index < circle.members.length) {
            const member = circle.members[index];

            if (member.user.toString() === request.user.id) {
                isMember = true;
            }

            index = index + 1;
        }

        if (isMember === false) {
            return response.status(403).json({ message: 'Not a member of this circle' });
        }

        // attach the circle to the request so other functions can use it
        request.circle = circle;
        next();

    } catch {
        response.status(500).json({ message: 'Failed to verify circle membership' });
    }
}

module.exports = circleMember;
