/* eslint-env node */
/* global require, module */

const CalendarEvent = require('../models/CalendarEvent');
const logActivity = require('../utilities/activityLog');

// returns all events for the circle, sorted by date ascending
async function getEvents(request, response) {
    try {
        const circleId = request.params.circleId;
        const events = await CalendarEvent.find({ circle: circleId }).sort({ dateKey: 1 });
        response.json(events);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// creates a new event for the circle and logs the activity
async function createEvent(request, response) {
    try {
        const circleId = request.params.circleId;
        const userId = request.user.id;
        const { title, type, dateKey, startTime, endTime, note, color } = request.body;

        const newEvent = await CalendarEvent.create({
            title: title,
            type: type,
            dateKey: dateKey,
            startTime: startTime,
            endTime: endTime,
            note: note,
            color: color,
            author: userId,
            circle: circleId
        });

        await logActivity('calendar', userId, circleId, 'CalendarEvent', newEvent._id, 'added a calendar event');

        response.status(201).json(newEvent);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// updates an event, only the author can edit it
async function updateEvent(request, response) {
    try {
        const eventId = request.params.eventId;
        const userId = request.user.id;
        const { title, type, dateKey, startTime, endTime, note, color } = request.body;

        const event = await CalendarEvent.findById(eventId);

        if (!event) {
            return response.status(404).json({ message: 'Event not found' });
        }

        if (event.author.toString() !== userId) {
            return response.status(403).json({ message: 'Only the author can edit this event' });
        }

        event.title = title;
        event.type = type;
        event.dateKey = dateKey;
        event.startTime = startTime;
        event.endTime = endTime;
        event.note = note;
        event.color = color;

        await event.save();

        response.json(event);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

// deletes an event, only the author can delete it
async function deleteEvent(request, response) {
    try {
        const eventId = request.params.eventId;
        const userId = request.user.id;

        const event = await CalendarEvent.findById(eventId);

        if (!event) {
            return response.status(404).json({ message: 'Event not found' });
        }

        if (event.author.toString() !== userId) {
            return response.status(403).json({ message: 'Only the author can delete this event' });
        }

        await event.deleteOne();

        response.json({ message: 'Event deleted' });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
