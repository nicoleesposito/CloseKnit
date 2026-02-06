import './Calendar.css'
import { useState } from "react";
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';
import HelpButton from '../../components/HelpButton/HelpButton';

/*
RESOURCES:
Dates -
JS Date.now: https://www.w3schools.com/jsref/jsref_now.asp
https://www.w3schools.com/js/js_date_methods.asp
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
https://www.youtube.com/watch?v=OcncrLyddAs

props: https://react.dev/learn/passing-props-to-a-component
https://www.youtube.com/watch?v=m7OWXtbiXX8

*/

function Calendar(props) {
    const [activeMonthDate, setActiveMonthDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    // false: will show the calendar and timeline. true: will show the add/edit event screen.
    const [isEditing, setIsEditing] = useState(false);

    // Each event is going to have an id which will make it possible to edit the event after it's been submit
    const [editingEventId, setEditingEventId] = useState(null);

    const [selectedDate, setSelectedDate] = useState(new Date());

    // form fields in the add/edit event screen
    const [formTitle, setFormTitle] = useState("");
    const [formType, setFormType] = useState("Event");
    const [formStartTime, setFormStartTime] = useState("12:00 AM");
    const [formEndTime, setFormEndTime] = useState("11:59 PM");
    const [formNote, setFormNote] = useState("");

    // colors for the event types
    const [customColor, setCustomColor] = useState("#2a9d8f");

    const typeColors = {
        Birthday: "#ff6b6b",
        Goal: "#f4a261",
        Event: "#6c63ff",
        Custom: "#2a9d8f",
    };


    const MONTHS_LONG = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const MONTHS_SHORT = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // these are all related in manipulation of date data to build the calendar and make it interactive.
    const today = new Date();
    const todayKey = toDateKey(today);

    const monthLabel = MONTHS_LONG[activeMonthDate.getMonth()];
    const yearLabel = activeMonthDate.getFullYear();

    function goPrevMonth() {
        const y = activeMonthDate.getFullYear();
        const m = activeMonthDate.getMonth();
        setActiveMonthDate(new Date(y, m - 1, 1));
    }

    function goNextMonth() {
        const y = activeMonthDate.getFullYear();
        const m = activeMonthDate.getMonth();
        setActiveMonthDate(new Date(y, m + 1, 1));
    }

    function resetFormToDefaults() {
        setSelectedDate(new Date());
        setFormTitle("");
        setFormType("Event");
        setFormStartTime("12:00 AM");
        setFormEndTime("11:59 PM");
        setFormNote("");
        setCustomColor(typeColors.Custom);
    }

    // Brings up the editing screen and sets the boolean to true for the editing flag. Also brings in the default values and a blank id for the new event.
    function openAddEvent() {
        setEditingEventId(null);
        resetFormToDefaults();
        setIsEditing(true);
    }

    function closeEdit() {
        setIsEditing(false);
        setEditingEventId(null);
    }

    // opens the event through the timeline to edit the details. I use a while loop to iterate through the event's ids. Once it find the id it loads it into the form.
    function openEditEventById(eventId) {
        let found = null;
        let i = 0;

        while (i < events.length) {
            if (events[i].id === eventId) {
                found = events[i];
            }
            i = i + 1;
        }

        if (!found) {
            return;
        }

        setEditingEventId(found.id);

        setFormTitle(found.title);
        setFormType(found.type);
        setFormStartTime(found.startTime);
        setFormEndTime(found.endTime);
        setFormNote(found.note);

        setSelectedDate(dateKeyToDate(found.dateKey));

        // if custom event id is found, it should load the color attached to it for the event
        if (found.type === "Custom") {
            setCustomColor(found.color);
        } else {
            setCustomColor(typeColors.Custom);
        }

        setIsEditing(true);
    }

    // doesn't allow for empty titles to be returned and trims them so that they don't carry extra spaces at the end.
    function saveEvent() {
        const titleTrimmed = formTitle.trim();
        if (titleTrimmed.length === 0) {
            return;
        }

        let eventColor = typeColors[formType];
        if (formType === "Custom") {
            eventColor = customColor;
        }

        // chose to slice the events so that the original array isn't directly affected when editing event.
        if (editingEventId) {
            const nextEvents = events.slice();
            let i = 0;

            // while iterating through the loop, if the sliced event matches the edited event id, the nextEvents variable will have a new object. inside the object the list is updated to match the event's input and sets it has the updated event. The boolean is changed to false to exit editing mode, and the id is set to null so that a new one can be insert into the function
            while (i < nextEvents.length) {
                if (nextEvents[i].id === editingEventId) {
                    nextEvents[i] = {
                        id: editingEventId,
                        title: titleTrimmed,
                        type: formType,
                        dateKey: toDateKey(selectedDate),
                        startTime: formStartTime,
                        endTime: formEndTime,
                        note: formNote.trim(),
                        color: eventColor,
                    };
                }
                i = i + 1;
            }

            setEvents(nextEvents);
            setIsEditing(false);
            setEditingEventId(null);
            return;
        }

        // builds a new event object. date.now() docs explain the function as creating a unique number based on the current time. this makes it easier to give it an id and put into the timeline. ESList identifies this as being an impure function, but don't try to fix it because it will break the timeline feature.
        const newEvent = {
            id: String(Date.now()),
            title: titleTrimmed,
            type: formType,
            dateKey: toDateKey(selectedDate),
            startTime: formStartTime,
            endTime: formEndTime,
            note: formNote.trim(),
            color: eventColor,
        };

        const nextEvents = events.slice();
        nextEvents.push(newEvent);

        setEvents(nextEvents);
        setIsEditing(false);
        setEditingEventId(null);
    }

    // input handlers to grab the element the user types and to read its value. this is then stored into the state.
    function handleTitleChange(changeEvent) {
        const inputElement = changeEvent.target;
        setFormTitle(inputElement.value);
    }

    function handleNoteChange(changeEvent) {
        const inputElement = changeEvent.target;
        setFormNote(inputElement.value);
    }

    function handleStartTimeChange(changeEvent) {
        const inputElement = changeEvent.target;
        setFormStartTime(inputElement.value);
    }

    function handleEndTimeChange(changeEvent) {
        const inputElement = changeEvent.target;
        setFormEndTime(inputElement.value);
    }

    function handleDateChange(changeEvent) {
        const inputElement = changeEvent.target;
        const value = inputElement.value;

        // if no value, then stop
        if (!value) {
            return;
        }

        // breaks the year/month/date format into pieces to convert them into numbers. months start at 0, so subtract 1, then rebuild date and store into state.
        const parts = value.split("-");
        const y = Number(parts[0]);
        const m = Number(parts[1]) - 1;
        const d = Number(parts[2]);

        setSelectedDate(new Date(y, m, d));
    }

    // event button selections
    function chooseBirthday() {
        setFormType("Birthday");
    }
    function chooseGoal() {
        setFormType("Goal");
    }
    function chooseEvent() {
        setFormType("Event");
    }
    function chooseCustom() {
        setFormType("Custom");
    }

    function chooseCustomColor(colorValue) {
        setCustomColor(colorValue);
    }

    function getTypeButtonClass(typeName) {
        let className = "calendar-type-btn";
        if (formType === typeName) {
            className = "calendar-type-btn calendar-type-active";
        }
        return className;
    }

    // returns a clas name for the type of buttons and adds a class to it.
    function getTypeButtonStyle(typeName) {
        const objectStyle = {};
        if (formType === typeName) {
            objectStyle.backgroundColor = typeColors[typeName];
            objectStyle.borderColor = typeColors[typeName];
            objectStyle.color = "#ffffff";
        }
        return objectStyle;
    }

    // applies to custom mode to change the css of the square
    function getColorSquareStyle(colorValue) {
        const objectStyle = {};
        objectStyle.backgroundColor = colorValue;
        objectStyle.border = "2px solid rgba(0,0,0,0.10)";

        if (formType === "Custom") {
            if (customColor === colorValue) {
                objectStyle.border = "3px solid rgba(0,0,0,0.45)";
                objectStyle.boxShadow = "0 4px 10px rgba(0,0,0,0.12)";
            }
        }

        return objectStyle;
    }

    // adds classes to style. this one adds a small pill shape on the newly added events
    function getDayNumberClass(isToday) {
        let className = "calendar-day-number";
        if (isToday) {
            className = "calendar-day-number calendar-today-pill";
        }
        return className;
    }

    function getDayTextClass(isOtherMonth) {
        let className = "calendar-day-text";
        if (isOtherMonth) {
            className = "calendar-day-text calendar-other-month";
        }
        return className;
    }

    function getEditLayout() {
        let headerText = "Add Event";
        if (editingEventId) {
            headerText = "Edit Event";
        }

        // renders the add event page
        return (
            <div className="calendar-panel">
                <div className="calendar-edit-card">
                    <div className="calendar-edit-title">{headerText}</div>
                    <div className="calendar-form-grid">
                        <div className="calendar-label">Title</div>
                        <div className="calendar-input">
                            <input className="calendar-text-input" placeholder="Event Title" value={formTitle} onChange={handleTitleChange} />
                        </div>
                        <div className="calendar-label">Type</div>
                        <div className="calendar-input">
                            <div className="calendar-type-row">
                                <button className={getTypeButtonClass("Birthday")} style={getTypeButtonStyle("Birthday")} onClick={chooseBirthday} type="button">Birthday</button>
                                <button className={getTypeButtonClass("Goal")} style={getTypeButtonStyle("Goal")} onClick={chooseGoal} type="button">Goal</button>
                                <button className={getTypeButtonClass("Event")} style={getTypeButtonStyle("Event")} onClick={chooseEvent} type="button">Event</button>
                                <button className={getTypeButtonClass("Custom")} style={getTypeButtonStyle("Custom")} onClick={chooseCustom} type="button">Custom</button>
                            </div>
                        </div>
                        <div className="calendar-label">Date</div>
                        <div className="calendar-input">
                            <input className="calendar-text-input" type="date" value={toDateInputValue(selectedDate)} onChange={handleDateChange} />
                        </div>
                        <div className="calendar-label">Time</div>
                        <div className="calendar-input">
                            <div className="calendar-time-row">
                                <input className="calendar-time-input" value={formStartTime} onChange={handleStartTimeChange} />
                                <div className="calendar-time-arrow">→</div>
                                <input className="calendar-time-input" value={formEndTime} onChange={handleEndTimeChange} />
                            </div>
                        </div>
                        <div className="calendar-label">Note</div>
                        <div className="calendar-input">
                            <textarea className="calendar-text-area" value={formNote} onChange={handleNoteChange} placeholder="Event Description" />
                        </div>
                        {/* Custom color select*/}
                        {formType === "Custom" && (
                            <>
                                <div className="calendar-label">Select<br />Color</div>
                                <div className="calendar-input">
                                    <div className="calendar-color-square-row">
                                        <button type="button" className="calendar-color-square" style={getColorSquareStyle(typeColors.Birthday)} onClick={function () { chooseCustomColor(typeColors.Birthday); }} />
                                        <button type="button" className="calendar-color-square" style={getColorSquareStyle(typeColors.Goal)} onClick={function () { chooseCustomColor(typeColors.Goal); }} />
                                        <button type="button" className="calendar-color-square" style={getColorSquareStyle(typeColors.Event)} onClick={function () { chooseCustomColor(typeColors.Event); }} />
                                        <button type="button" className="calendar-color-square" style={getColorSquareStyle(typeColors.Custom)} onClick={function () { chooseCustomColor(typeColors.Custom); }} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="calendar-button-row">
                        <button className="calendar-secondary-btn" onClick={closeEdit}>Cancel</button>
                        <button className="calendar-primary-btn" onClick={saveEvent}>Save Changes</button>
                    </div>
                </div>
            </div>
        );
    }

    // renders the calendar and timeline onto the page
    function getCalendarLayout() {
        const calendarDays = buildCalendarDays(activeMonthDate);
        const eventsByDate = groupEventsByDate(events);
        const timeline = buildTimelineBySection(events, today, MONTHS_SHORT);

        return (
            <div className="calendar-panel">
                <div className="calendar-middle-layout">
                    <div className="calendar-timeline-card">
                        <div className="calendar-timeline-title">Your Timeline</div>
                        <TimelineSection title="Upcoming Events" items={timeline.upcoming} onPickEvent={openEditEventById} />
                        <TimelineSection title="Birthdays" items={timeline.birthdays} onPickEvent={openEditEventById} />
                        <TimelineSection title="Goals" items={timeline.goals} onPickEvent={openEditEventById} />
                        <TimelineSection title="Custom Dates" items={timeline.custom} onPickEvent={openEditEventById} />
                    </div>
                    <div className="calendar-card-with-help">
                        <div className="calendar-help-button-container">
                            <HelpButton page="calendar" />
                        </div>
                        <div className="calendar-card">
                            <div className="calendar-topbar">
                                <button className="calendar-nav-btn" onClick={goPrevMonth}>{"<"}</button>
                                <div className="calendar-month-block">
                                    <div className="calendar-month-name">{monthLabel}</div>
                                    <div className="calendar-year-name">{yearLabel}</div>
                                </div>
                                <button className="calendar-nav-btn" onClick={goNextMonth}>{">"}</button>
                            </div>
                        <div className="calendar-dow-row">
                            <div className="calendar-dow-cell">Mon</div>
                            <div className="calendar-dow-cell">Tue</div>
                            <div className="calendar-dow-cell">Wed</div>
                            <div className="calendar-dow-cell">Thu</div>
                            <div className="calendar-dow-cell">Fri</div>
                            <div className="calendar-dow-cell">Sat</div>
                            <div className="calendar-dow-cell">Sun</div>
                        </div>
                        <div className="calendar-day-grid">
                            {calendarDays.map(function (dayObj) {
                                const dateKey = toDateKey(dayObj.date);
                                const isToday = dateKey === todayKey;
                                const dayEvents = eventsByDate[dateKey];
                                let hasEvents = false;
                                if (dayEvents) {
                                    if (dayEvents.length > 0) {
                                        hasEvents = true;
                                    }
                                }
                                let dotOutput = null;
                                if (hasEvents) {
                                    dotOutput = renderOneDot(dayEvents);
                                }

                                return (
                                    <div key={dateKey} className="calendar-day-cell">
                                        <div className="calendar-day-number-wrap">
                                            <div className={getDayNumberClass(isToday)}>
                                                <span className={getDayTextClass(dayObj.isOtherMonth)}>
                                                    {dayObj.dayNumber}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="calendar-dot-row">
                                            {dotOutput}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="calendar-bottombar">
                            <button className="calendar-primary-btn" onClick={openAddEvent}>Add Event</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }

    // changes which page is visible
    let pageContent = null;
    if (isEditing) {
        pageContent = getEditLayout();
    }
    if (!isEditing) {
        pageContent = getCalendarLayout();
    }

    return (
        <div className='calendar-page'>
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="calendar" />
                <main className='manage-main'>
                    {pageContent}
                </main>
                <ActivityFeed />
            </div>
        </div>
    );
}

// timeline rendering
function TimelineSection(props) {

    let emptyOutput = null;
    if (props.items.length === 0) {
        emptyOutput = <div className="calendar-timeline-empty">None</div>;
    }

    let item1 = null;
    if (props.items.length > 0) {
        item1 = <TimelineItem item={props.items[0]} onPickEvent={props.onPickEvent} />;
    }

    let item2 = null;
    if (props.items.length > 1) {
        item2 = <TimelineItem item={props.items[1]} onPickEvent={props.onPickEvent} />;
    }

    return (
        <div className="calendar-timeline-section">
            <div className="calendar-timeline-section-title">{props.title}</div>
            <div className="calendar-timeline-list">
                {emptyOutput}
                {item1}
                {item2}
            </div>
        </div>
    );
}

function TimelineItem(props) {
    function handleClick() {
        if (props.onPickEvent) {
            props.onPickEvent(props.item.id);
        }
    }

    return (
        <button type="button" className="calendar-timeline-item calendar-timeline-click" onClick={handleClick}>
            <div className="calendar-timeline-dot" style={{ backgroundColor: props.item.color }} />
            <div className="calendar-timeline-text">{props.item.title} - {props.item.dateLabel}</div>
        </button>
    );
}

// extra visuals for the calendar.

function renderOneDot(dayEvents) {
    return (
        <div className="calendar-event-dot" style={{ backgroundColor: dayEvents[0].color }} />
    );
}

// builds the calendar itself as a component as a grid to be consistent for each month. function takes the date in the month, pulls the y/m/d amd creates a date for the first day of the month in the variable. The calendar starts on mondays with the math
function buildCalendarDays(anyDateInMonth) {
    const year = anyDateInMonth.getFullYear();
    const month = anyDateInMonth.getMonth();
    const first = new Date(year, month, 1);
    const firstDow = first.getDay();
    const mondayIndex = (firstDow + 6) % 7;
    const gridStart = new Date(year, month, 1 - mondayIndex);
    const days = [];
    let i = 0;

    // 6 weeks are shown, so 42 is the number of iterations in the loop. gridStart variable is applied to the functions to create the grid. stored in d variable to make it easier to reference the date.
    while (i < 42) {
        const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);

        days.push({
            date: d,
            dayNumber: d.getDate(),
            isOtherMonth: d.getMonth() !== month,
        });

        i = i + 1;
    }

    return days;
}

// using the events array to make an empty object that will store the events and group them by date. This will be displayed with the map syntax.
function groupEventsByDate(events) {
    const map = {};
    let i = 0;

    // loop through the events and grab the current event. if the date's key hasn't been found, create an empty array and add the event into the correct area, then move to the next event.
    while (i < events.length) {
        const ev = events[i];
        if (!map[ev.dateKey]) {
            map[ev.dateKey] = [];
        }
        map[ev.dateKey].push(ev);
        i = i + 1;
    }

    return map;
}

// this function is going to return an object with 4 arrays with a max length of 2 into the timeline. It takes all the events, the date, and the names of the month (shortened) and creates a date for today in the Y/M/D format.
function buildTimelineBySection(events, today, MONTHS_SHORT) {
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startKey = toDateKey(startOfToday);
    const upcoming = [];
    const birthdays = [];
    const goals = [];
    const custom = [];
    let i = 0;

    while (i < events.length) {
        const ev = events[i];
        // skip events that are before today
        if (ev.dateKey < startKey) {
            i = i + 1;
            continue;
        }
        // puts the event into the right category
        if (ev.type === "Event") {
            upcoming.push(ev);
        } else if (ev.type === "Birthday") {
            birthdays.push(ev);
        } else if (ev.type === "Goal") {
            goals.push(ev);
        } else if (ev.type === "Custom") {
            custom.push(ev);
        }

        i = i + 1;
    }

    upcoming.sort(sortByDateKey);
    birthdays.sort(sortByDateKey);
    goals.sort(sortByDateKey);
    custom.sort(sortByDateKey);

    return {
        upcoming: takeTwo(upcoming, MONTHS_SHORT),
        birthdays: takeTwo(birthdays, MONTHS_SHORT),
        goals: takeTwo(goals, MONTHS_SHORT),
        custom: takeTwo(custom, MONTHS_SHORT),
    };
}

// converts a date object into year month date format for date inputs
function toDateInputValue(dateObj) {
    const year = dateObj.getFullYear();
    const monthNumber = dateObj.getMonth() + 1;
    const monthString = String(monthNumber).padStart(2, "0");
    const dayNumber = dateObj.getDate();
    const dayString = String(dayNumber).padStart(2, "0");
    const value = year + "-" + monthString + "-" + dayString;

    return value;
}

// converts a date object into a year month date format for storing and comparing dates
function toDateKey(dateObj) {
    return toDateInputValue(dateObj);
}


// converts the date key string back into a real date object
function dateKeyToDate(dateKey) {
    const parts = dateKey.split("-");
    const yearString = parts[0];
    const monthString = parts[1];
    const dayString = parts[2];
    const year = Number(yearString);
    const month = Number(monthString) - 1;
    const day = Number(dayString);
    const dateObj = new Date(year, month, day);

    return dateObj;
}


// turns the date key into a short  label for the timeline
function shortDateLabel(dateKey, MONTHS_SHORT) {
    const parts = dateKey.split("-");
    const monthPart = parts[1];
    const dayPart = parts[2];
    const monthIndex = Number(monthPart) - 1;
    const dayNumber = Number(dayPart);
    const monthName = MONTHS_SHORT[monthIndex];
    const label = monthName + " " + dayNumber;

    return label;
}


// sorts events by date so earlier dates appear first
function sortByDateKey(a, b) {
    let result = 0;

    if (a.dateKey < b.dateKey) {
        result = -1;
    } else if (a.dateKey > b.dateKey) {
        result = 1;
    }

    return result;
}

// converts a event into a smaller object formatted for the timeline display
function toTimelineItem(eventObj, MONTHS_SHORT) {
    const id = eventObj.id;
    const title = eventObj.title;
    const label = shortDateLabel(eventObj.dateKey, MONTHS_SHORT);
    const color = eventObj.color;

    const item = {
        id: id,
        title: title,
        dateLabel: label,
        color: color,
    };

    return item;
}

// returns up to the first two events from a list and converts them into timeline items. might adjust this in the future to show more than 2 events, but not a priority at the moment.
function takeTwo(list, MONTHS_SHORT) {
    const result = [];
    let i = 0;

    while (i < list.length && i < 2) {
        const item = toTimelineItem(list[i], MONTHS_SHORT);
        result.push(item);
        i = i + 1;
    }

    return result;
}

export default Calendar;