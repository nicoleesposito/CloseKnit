import './Home.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/LanguageContext';

// converts a date object into a YYYY-MM-DD string
function toDateKey(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
}

// returns a string for how long ago the board was created
function getMemoryTimestamp(createdAt, t) {
    const now = Date.now();
    const then = new Date(createdAt).getTime();
    const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('home.today');
    if (diffDays === 1) return t('home.oneDayAgo');
    if (diffDays < 7) return t('home.daysAgo').replace('{n}', diffDays);

    const weeks = Math.floor(diffDays / 7);
    if (weeks === 1) return t('home.oneWeekAgo');
    return t('home.weeksAgo').replace('{n}', weeks);
}

function Home(props) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { t } = useLanguage();
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [memoryImages, setMemoryImages] = useState([]);
    const [memoryCreatedAt, setMemoryCreatedAt] = useState(null);

    // fetch calendar events and the most recent memory board when the circle changes
    useEffect(function () {
        if (!props.activeCircleId) {
            setCalendarEvents([]);
            setMemoryImages([]);
            setMemoryCreatedAt(null);
            return;
        }

        async function fetchCalendarEvents() {
            try {
                const response = await fetch('/api/circles/' + props.activeCircleId + '/calendar', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setCalendarEvents(data);
                }
            } catch {
                console.log('Failed to fetch calendar events for home');
            }
        }

        async function fetchMemoryBoard() {
            try {
                const response = await fetch('/api/circles/' + props.activeCircleId + '/memoryboard', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.length === 0) {
                        return;
                    }

                    const latestBoard = data[0];
                    const imageUrls = Object.values(latestBoard.slotImageMap || {});

                    const images = [];
                    let i = 0;
                    while (i < imageUrls.length && images.length < 2) {
                        images.push(imageUrls[i]);
                        i = i + 1;
                    }

                    setMemoryImages(images);
                    setMemoryCreatedAt(latestBoard.createdAt);
                }
            } catch {
                console.log('Failed to fetch memory board for home');
            }
        }

        fetchCalendarEvents();
        fetchMemoryBoard();
    }, [props.activeCircleId]);

    const DAY_LABELS = t('home.dayLabels');

    const today = new Date();
    const todayKey = toDateKey(today);
    const todayDow = today.getDay();
    const mondayOffset = (todayDow + 6) % 7;
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset);

    // build a lookup map of dateKey event color so we can check each day quickly
    const eventDayMap = {};
    let evIndex = 0;
    while (evIndex < calendarEvents.length) {
        const ev = calendarEvents[evIndex];
        if (!eventDayMap[ev.dateKey]) {
            eventDayMap[ev.dateKey] = ev.color;
        }
        evIndex = evIndex + 1;
    }

    // 7 day objects for Mon through Sun
    const weekDayObjects = [];
    let dayIndex = 0;
    while (dayIndex < 7) {
        const dayDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + dayIndex);
        const dayKey = toDateKey(dayDate);

        weekDayObjects.push({
            label: DAY_LABELS[dayIndex],
            number: dayDate.getDate(),
            isToday: dayKey === todayKey,
            eventColor: eventDayMap[dayKey] || null,
            key: dayKey
        });

        dayIndex = dayIndex + 1;
    }


    let photo1Src = "/images/ui/dog-home.svg";
    let photo2Src = "/images/ui/dog-home2.svg";

    if (memoryImages.length > 0) {
        photo1Src = memoryImages[0];
    }

    if (memoryImages.length > 1) {
        photo2Src = memoryImages[1];
    }

    const timestampDisplay = memoryCreatedAt ? getMemoryTimestamp(memoryCreatedAt, t) : t('home.noMemoriesYet');

    return (
        <div>
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="home" />
                <main className='manage-main'>
                    <div className="home-content">

                        {/* Welcome Section */}
                        <div className="welcome-header">
                            <h1 className="greeting">{t('home.hi')} {user?.firstName}</h1>
                            <p className="welcome-text">{t('home.welcomeBack')}</p>
                        </div>

                        {/* Calendar Widget */}
                        <div className="calendar-widget">
                            <h3 className="widget-title">{t('home.thisWeek')}</h3>
                            <div className="week-days">
                                {weekDayObjects.map(function (dayObj) {
                                    let dayClass = "day";
                                    if (dayObj.isToday) {
                                        dayClass = "day active";
                                    }

                                    let dotOutput = null;
                                    if (dayObj.eventColor) {
                                        dotOutput = <div className="event-dot" style={{ backgroundColor: dayObj.eventColor }}></div>;
                                    }

                                    return (
                                        <div key={dayObj.key} className={dayClass}>
                                            <span className="day-label">{dayObj.label}</span>
                                            <span className="day-number">{dayObj.number}</span>
                                            {dotOutput}
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                className="widget-arrow"
                                onClick={() => navigate('/calendar')}
                                aria-label="Go to calendar"
                            >
                                <img src="/images/ui/arrowcircleright.svg" alt="" />
                            </button>
                        </div>

                        {/* Cards Grid */}
                        <div className="cards-grid">

                            {/* Memory Board Card */}
                            <div className="card memory-card">
                                <span className="memory-timestamp">{timestampDisplay}</span>
                                <div className="memory-photos">
                                    <img src={photo1Src} alt="Recent memory" className="memory-photo" />
                                    <img src={photo2Src} alt="Recent memory" className="memory-photo" />
                                </div>
                                <button
                                    className="widget-arrow"
                                    onClick={() => navigate('/memoryboard')}
                                    aria-label="Go to memory board"
                                >
                                    <img src="/images/ui/arrowcircleright.svg" alt="" />
                                </button>
                            </div>

                            {/* Journal Card */}
                            <div className="card journal-card">
                                <h3 className="journal-title">{t('home.journalTitle')}</h3>
                                <div className="journal-content">
                                    <img
                                        src="/images/ui/journal.svg"
                                        alt=""
                                        className="journal-icon"
                                    />
                                    <p className="journal-prompt">{t('home.journalPrompt')}</p>
                                </div>
                                <button
                                    className="widget-arrow"
                                    onClick={() => navigate('/journal')}
                                    aria-label="Go to journal"
                                >
                                    <img src="/images/ui/arrowcircleright.svg" alt="" />
                                </button>
                            </div>

                        </div>

                        {/* Circle Selector */}
                        <div className="circle-selector">
                            {props.circles && props.circles.map(circle => (
                                <button
                                    key={circle._id}
                                    className={`circle-btn ${circle._id === props.activeCircleId ? 'active' : 'empty'}`}
                                    onClick={() => props.setActiveCircleId(circle._id)}
                                    aria-label={circle.name === props.circleName
                                        ? "Current circle"
                                        : `Switch to ${circle.name}`}
                                >
                                    {circle.name}
                                </button>
                            ))}
                        </div>

                    </div>
                </main>
                <ActivityFeed activeCircleId={props.activeCircleId} />
            </div>
        </div>
    );
}

export default Home
