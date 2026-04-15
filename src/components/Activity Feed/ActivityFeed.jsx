import "./ActivityFeed.css";
import { useState, useEffect } from "react";

function ActivityFeed(props) {
    const [activities, setActivities] = useState([]);

    // tracks which user rows are expanded open
    const [openUsers, setOpenUsers] = useState({});

    // fetch activities and set up 30-second polling. set to 30 seconds to imitate a "live feed" even though it's not truly real time.
    useEffect(function () {
        if (!props.activeCircleId) {
            setActivities([]);
            return;
        }

        async function fetchActivities() {
            try {
                const response = await fetch('/api/circles/' + props.activeCircleId + '/activity', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setActivities(data);
                }
            } catch {
                console.log('Failed to fetch activity feed');
            }
        }

        fetchActivities();

        const intervalId = setInterval(fetchActivities, 30000);

        // clear the interval when the component unmounts or the circle changes
        return function () {
            clearInterval(intervalId);
        };
    }, [props.activeCircleId]);

    // opens or closes the drop down for a specific user
    function toggleUser(userId) {
        setOpenUsers(function (current) {
            const updated = {};

            const keys = Object.keys(current);
            let i = 0;
            while (i < keys.length) {
                updated[keys[i]] = current[keys[i]];
                i = i + 1;
            }

            updated[userId] = !current[userId];
            return updated;
        });
    }

    // returns the display label for each activity type
    function getActivityText(type) {
        if (type === "journal") {
            return "Shared a journal entry";
        }
        if (type === "memory") {
            return "Added to Memory Board";
        }
        if (type === "calendar") {
            return "Added a calendar event";
        }
        if (type === "comment") {
            return "Commented on a journal entry";
        }
        if (type === "circle_join") {
            return "Joined the circle";
        }
        return "Was active";
    }

    // converts a createdAt string into a time ago label
    function getTimeAgo(createdAt) {
        const now = Date.now();
        const then = new Date(createdAt).getTime();
        const diffMs = now - then;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) {
            return "Just now";
        }
        if (diffMins < 60) {
            return diffMins + " min ago";
        }
        if (diffHours < 24) {
            return diffHours + " hours ago";
        }
        return diffDays + " days ago";
    }

    // groups the flat activities array by user, keeping up to 3 per user
    function groupByUser() {
        const groups = [];
        const userIndexMap = {};

        let i = 0;
        while (i < activities.length) {
            const activity = activities[i];
            const userId = activity.user._id;

            if (userIndexMap[userId] === undefined) {
                userIndexMap[userId] = groups.length;
                groups.push({
                    userId: userId,
                    user: activity.user,
                    activities: []
                });
            }

            const groupIndex = userIndexMap[userId];

            if (groups[groupIndex].activities.length < 3) {
                groups[groupIndex].activities.push(activity);
            }

            i = i + 1;
        }

        return groups;
    }

    // renders one user row with their most recent activity and expandable older ones
    function renderUserGroup(group) {
        const isOpen = openUsers[group.userId] || false;
        const newest = group.activities[0];

        const extras = [];
        let i = 1;
        while (i < group.activities.length) {
            extras.push(group.activities[i]);
            i = i + 1;
        }

        let arrow = "/images/ui/dropdown-arrow.svg";
        if (isOpen === true) {
            arrow = "/images/ui/dropdown-arrow-open.svg";
        }

        const pfp = group.user.profilePicture || "/images/ui/user-pfp.svg";

        return (
            <div className="activity-group" key={group.userId}>
                <img src={pfp} alt={group.user.firstName + " profile"} className="activity-pfp" />
                <div className="activity-right">
                    <div className="activity-header-row">
                        <p className="activity-name">{group.user.firstName}</p>
                        {extras.length > 0 && (
                            <button className="activity-dropdown" type="button" onClick={function () { toggleUser(group.userId); }}>
                                <img src={arrow} alt="Dropdown arrow" className="activity-arrow" />
                            </button>
                        )}
                    </div>
                    <div className="activity-newest">
                        <p className="activity-text">{getActivityText(newest.type)}</p>
                        <p className="activity-time">{getTimeAgo(newest.createdAt)}</p>
                    </div>
                    {isOpen && (
                        <div className="activity-expanded">
                            <div className="activity-timeline">
                                <div className="activity-dot"></div>
                                <div className="activity-line"></div>
                            </div>
                            <div className="activity-expanded-list">
                                {extras.map(function (item, index) {
                                    return (
                                        <div className="activity-item" key={index}>
                                            <p className="activity-text">{getActivityText(item.type)}</p>
                                            <p className="activity-time">{getTimeAgo(item.createdAt)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const userGroups = groupByUser();

    return (
        <aside className="activity">
            <div className="activity-top">
                <h2 className="activity-title">
                    <img src="/images/ui/activity-feed.svg" alt="Activity feed icon" /> Activity Feed
                </h2>
            </div>
            <div className="activity-list">
                {userGroups.length === 0 && (
                    <p className="activity-empty">No activity yet.</p>
                )}
                {userGroups.map(function (group) {
                    return renderUserGroup(group);
                })}
            </div>
        </aside>
    );
}

export default ActivityFeed;
