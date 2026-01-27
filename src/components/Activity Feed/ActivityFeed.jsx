import "./ActivityFeed.css";
import { useState } from "react";

function ActivityFeed(props) {
    /* placeholders until backend is done and user profiles exist.
    I made an object instead of an array to reference the place holder data. It's easier with an object to move the data.
    */
    const [feedData, setFeedData] = useState({
        nicole: {
            name: "Nicole",
            pfp: "/images/ui/user-pfp.svg",
            activities: [
                { type: "journal", time: "2 hours ago" },
                { type: "journal", time: "4 hours ago" },
                { type: "memory", time: "5 hours ago" }
            ]
        },
        michelle: {
            name: "Michelle",
            pfp: "/images/ui/user-pfp.svg",
            activities: [
                { type: "journal", time: "3 hours ago" }
            ]
        },
        victoria: {
            name: "Victoria",
            pfp: "/images/ui/user-pfp.svg",
            activities: [
                { type: "calendar", time: "4 hours ago" }
            ]
        },
        sara: {
            name: "Sara",
            pfp: "/images/ui/user-pfp.svg",
            activities: [
                { type: "journal", time: "6 hours ago" }
            ]
        },
        joseff: {
            name: "Joseff",
            pfp: "/images/ui/user-pfp.svg",
            activities: [
                { type: "journal", time: "8 hours ago" }
            ]
        }
    });

    // this is storing the state for whether or not the drop down is open for each person with a boolean flag.
    const [openUsers, setOpenUsers] = useState({
        nicole: false,
        michelle: false,
        victoria: false,
        sara: false,
        joseff: false
    });

    // if statement to display the text for the activity status. It's pulling the type of entry from the object created on line 49-55, and if it matches the type it will return the message for that activity.
    function getActivityText(type) {
        if (type === "journal") {
            return "Shared a new journal Entry";
        }
        if (type === "memory") {
            return "Added to Memoryboard";
        }
        if (type === "calendar") {
            return "Added to Calendar";
        }
        return "";
    }

    // here I created a new object, put the previous values (from useState of setOpenUsers), and changed only the value that is toggled (otherwise all users would open, not just one).
    function toggleUser(userKey) {
        setOpenUsers(function (currentState) {
            const updated = {};

            // copy each user and put it into the newly created object "updated." So the updated object is going to have the current state for the user.
            updated.nicole = currentState.nicole;
            updated.michelle = currentState.michelle;
            updated.victoria = currentState.victoria;
            updated.sara = currentState.sara;
            updated.joseff = currentState.joseff;

            // and then when the specific user is updated, it will change the updated value's boolean and only show the one user that was changed.
            updated[userKey] = !currentState[userKey];

            return updated;
        });
    }

    // this function will be for when the user interacts with something, which will add an activity to the activity feed. The user and the type of activity (journal, calendar, or memoryboard) is passed through the addActivity function. The current feed is what the feed currently has in it in the current state, which is used to build a new object in the variable "updated"
    function addActivity(userKey, type) {
        setFeedData(function (currentFeed) {
            const updated = {};

            // similar to the toggleUser function. each name, profile photo, and activity from a specific user is copied and put it into the newly created object "updated." So the updated object is going to have the current state for the user's interaction history.
            updated.nicole = {
                name: currentFeed.nicole.name,
                pfp: currentFeed.nicole.pfp,
                activities: currentFeed.nicole.activities
            };

            updated.michelle = {
                name: currentFeed.michelle.name,
                pfp: currentFeed.michelle.pfp,
                activities: currentFeed.michelle.activities
            };

            updated.victoria = {
                name: currentFeed.victoria.name,
                pfp: currentFeed.victoria.pfp,
                activities: currentFeed.victoria.activities
            };

            updated.sara = {
                name: currentFeed.sara.name,
                pfp: currentFeed.sara.pfp,
                activities: currentFeed.sara.activities
            };

            updated.joseff = {
                name: currentFeed.joseff.name,
                pfp: currentFeed.joseff.pfp,
                activities: currentFeed.joseff.activities
            };

            const newActivity = { type: type, time: "Just now" };

            // starts with the newest activity, then pushes the older items after it and then stops when it reaches 3 total items using a while loop to iterate through each of the activities
            const newList = [];
            newList.push(newActivity);

            let i = 0;
            while (i < currentFeed[userKey].activities.length) {
                if (newList.length < 3) {
                    newList.push(currentFeed[userKey].activities[i]);
                }
                i = i + i;
            }

            // for the user who shared an activity, their old activity is replaced with the new list.
            updated[userKey].activities = newList;

            return updated;
        });
    }

    // if there is an update from another page using the addActivity function to add a new activity into the feed, the properties are registered into the feed itself.
    if (props.registerAddActivity) {
        props.registerAddActivity(addActivity);
    }

    // the function is going to grab the user key ( for example "michelle" and "calendar" from the object). I also grab the other object with the user's boolean flag depending on if it's been toggle open or not). I put these both into variables for easier manipulation
    function renderUser(userKey) {
        const user = feedData[userKey];
        const isOpen = openUsers[userKey];
        const newest = user.activities[0];

        // extras is essentially any activity that is in the open drop down menu. 0 is the newest index, so starting at 1 will build the older activities and push them further into the list.
        const extras = [];
        let i = 1;

        while (i < user.activities.length) {
            extras.push(user.activities[i]);
            i = i + 1;
        }

        // changes the arrow on open. will likely add animations later in css if time permits.
        let arrow = "/images/ui/dropdown-arrow.svg";
        if (isOpen === true) {
            arrow = "/images/ui/dropdown-arrow-open.svg";
        }

        // this part that's being returned is specifically for one user and their activity.
        return (
            <div className="activity-group" key={userKey}>
                <img src={user.pfp} alt={user.name + " profile"} className="activity-pfp" />
                <div className="activity-right">
                    <div className="activity-header-row">
                        <p className="activity-name">{user.name}</p>
                        <button className="activity-dropdown" type="button" onClick={function () { toggleUser(userKey); }}><img src={arrow} alt="Dropdown arrow" className="activity-arrow"></img></button>
                    </div>
                    <div className="activity-newest">
                        <p className="activity-text">{getActivityText(newest.type)}</p>
                        <p className="activity-time">{newest.time}</p>
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
                                            <p className="activity-time">{item.time}</p>
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
    // this return is for the entire activity feed component after putting each user in.
    return (
        <aside className="activity">
            <div className="activity-top">
                <h2 className="activity-title"><img src="/images/ui/activity-feed.svg" alt="Activity feed icon" /> Activity Feed</h2>
            </div>

            <div className="activity-list">
                {renderUser("nicole")}
                {renderUser("michelle")}
                {renderUser("victoria")}
                {renderUser("sara")}
                {renderUser("joseff")}
            </div>
        </aside>
    );
}

export default ActivityFeed;
