// saves an action to the activity feed for a circle
/* eslint-env node */
/* global require, module */

const Activity = require('../models/Activity');

// creates an activity entry in the database
async function logActivity(type, userId, circleId, referenceModel, referenceId, description) {
    try {
        await Activity.create({
            type: type,
            user: userId,
            circle: circleId,
            referenceModel: referenceModel,
            referenceId: referenceId,
            description: description
        });
    } catch (error) {
        // log the error but don't stop the request if logging fails
        console.log('Activity log failed:', error.message);
    }
}

module.exports = logActivity;
