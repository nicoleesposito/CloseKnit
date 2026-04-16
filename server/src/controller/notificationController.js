/* eslint-env node */
/* global require, module */

const Circle = require('../models/Circle');
const CalendarEvent = require('../models/CalendarEvent');
const User = require('../models/User');

// returns today's YYYY-MM-DD date string in local time
function todayDateKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

// returns how many days until a YYYY-MM-DD dateKey (0 = today, negative = past)
function daysUntil(dateKey) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = dateKey.split('-');
    const target = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

// GET /api/notifications
async function getNotifications(request, response) {
    try {
        const userId = request.user.id;

        const currentUser = await User.findById(userId).select('email');
        if (!currentUser) {
            return response.status(404).json({ message: 'User not found' });
        }

        const notifications = [];

        // ── 1. Circle invitations ─────────────────────────────────────────
        const email = currentUser.email.toLowerCase();

        const circlesWithInvites = await Circle.find({
            'invitations.email': email,
            'invitations.status': 'pending'
        }).populate('invitations.invitedBy', 'firstName');

        let invIndex = 0;
        while (invIndex < circlesWithInvites.length) {
            const circle = circlesWithInvites[invIndex];
            let i = 0;
            while (i < circle.invitations.length) {
                const inv = circle.invitations[i];
                if (inv.email === email && inv.status === 'pending') {
                    const inviterName = inv.invitedBy ? inv.invitedBy.firstName : 'Someone';
                    notifications.push({
                        id: 'invitation-' + inv._id.toString(),
                        type: 'invitation',
                        priority: 1,
                        text: inviterName + ' invited you to join ' + circle.name,
                        timestamp: inv.createdAt
                    });
                }
                i = i + 1;
            }
            invIndex = invIndex + 1;
        }

        // ── 2. Calendar events: reminders and new events ──────────────────
        const userCircles = await Circle.find({ 'members.user': userId }).select('_id');
        const circleIds = userCircles.map(function (c) { return c._id; });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const today = todayDateKey();

        // get events that are upcoming (within next 2 days) OR recently created (last 7 days)
        const events = await CalendarEvent.find({
            circle: { $in: circleIds }
        }).populate('author', 'firstName');

        let evIndex = 0;
        while (evIndex < events.length) {
            const ev = events[evIndex];
            const days = daysUntil(ev.dateKey);

            // event reminders: 1 day away or 2 days away
            if (days === 1 || days === 2) {
                const label = days === 1 ? '1 day away' : '2 days away';
                const detail = ev.startTime ? ev.title + ' at ' + ev.startTime : ev.title;
                notifications.push({
                    id: 'reminder-' + ev._id.toString() + '-' + days,
                    type: 'reminder',
                    priority: 2,
                    text: detail + ' — ' + label,
                    timestamp: new Date(ev.dateKey)
                });
            }

            // new events: created in the last 7 days, not by the current user
            const createdAt = new Date(ev.createdAt);
            const isRecent = createdAt >= sevenDaysAgo;
            const isOtherAuthor = ev.author && ev.author._id.toString() !== userId;

            if (isRecent && isOtherAuthor && days >= 0) {
                const authorName = ev.author ? ev.author.firstName : 'Someone';
                const typeLabel = ev.type && ev.type !== 'Event' ? ev.type + ': ' : '';
                notifications.push({
                    id: 'newevent-' + ev._id.toString(),
                    type: 'newevent',
                    priority: 3,
                    text: authorName + ' added a new event — ' + typeLabel + ev.title,
                    timestamp: ev.createdAt
                });
            }

            evIndex = evIndex + 1;
        }

        // ── 3. Sort by priority then timestamp, cap at 3 ──────────────────
        notifications.sort(function (a, b) {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        const capped = notifications.slice(0, 3);

        response.json(capped);
    } catch (err) {
        response.status(500).json({ message: 'Failed to get notifications' });
    }
}

module.exports = { getNotifications };
