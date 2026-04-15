/* eslint-env node */
/* global require, module */

const Activity = require('../models/Activity');

// returns the 30 most recent activity entries for a circle, newest first
async function getActivity(request, response) {
    try {
        const circleId = request.params.circleId;

        const activities = await Activity.find({ circle: circleId })
            .sort({ createdAt: -1 })
            .limit(30)
            .populate('user', 'firstName lastName profilePicture');

        response.json(activities);
    } catch {
        response.status(500).json({ message: 'Failed to get activity feed' });
    }
}

module.exports = { getActivity };
