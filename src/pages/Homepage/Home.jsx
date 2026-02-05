import './Home.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';
import { useNavigate } from "react-router-dom";

function Home(props) {
    const navigate = useNavigate();

    return (
        <div>
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="home" />
                <main className='manage-main'>
                    <div className="home-content">
                        {/* Welcome Section */}
                        <div className="welcome-header">
                            <h1 className="greeting">Hi, Nicole</h1>
                            <p className="welcome-text">Welcome back!</p>
                        </div>

                        {/* Calendar Widget */}
                        <div className="calendar-widget">
                            <h3 className="widget-title">This week in your circle:</h3>
                            <div className="week-days">
                                <div className="day">
                                    <span className="day-label">MON</span>
                                    <span className="day-number">30</span>
                                </div>
                                <div className="day">
                                    <span className="day-label">TUE</span>
                                    <span className="day-number">31</span>
                                </div>
                                <div className="day">
                                    <span className="day-label">WED</span>
                                    <span className="day-number">1</span>
                                </div>
                                <div className="day active">
                                    <span className="day-label">THU</span>
                                    <span className="day-number">2</span>
                                    <div className="event-dot"></div>
                                </div>
                                <div className="day">
                                    <span className="day-label">FRI</span>
                                    <span className="day-number">3</span>
                                </div>
                                <div className="day">
                                    <span className="day-label">SAT</span>
                                    <span className="day-number">4</span>
                                </div>
                                <div className="day">
                                    <span className="day-label">SUN</span>
                                    <span className="day-number">5</span>
                                </div>
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
                                <span className="memory-timestamp">2 Weeks<br />ago</span>
                                <div className="memory-photos">
                                    <img 
                                        src="/images/ui/dog-home.svg" 
                                        alt="Recent memory" 
                                        className="memory-photo"
                                    />
                                    <img 
                                        src="/images/ui/dog-home2.svg" 
                                        alt="Recent memory" 
                                        className="memory-photo"
                                    />
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
                                <h3 className="journal-title">Continue Collaborative Journaling</h3>
                                <div className="journal-content">
                                    <img 
                                        src="/images/ui/journal.svg" 
                                        alt="" 
                                        className="journal-icon"
                                    />
                                    <p className="journal-prompt">Share a memory from your latest trip and capture the moments that made it special</p>
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
                            <button 
                                className="circle-btn empty"
                                onClick={() => navigate('/managecircles')}
                                aria-label="Manage circles"
                            ></button>
                            <button 
                                className="circle-btn empty"
                                onClick={() => navigate('/managecircles')}
                                aria-label="Manage circles"
                            ></button>
                            <button 
                                className="circle-btn active"
                                aria-label="Current circle"
                            >
                                C2026
                            </button>
                            <button 
                                className="circle-btn empty"
                                onClick={() => navigate('/managecircles')}
                                aria-label="Manage circles"
                            ></button>
                            <button 
                                className="circle-btn empty"
                                onClick={() => navigate('/managecircles')}
                                aria-label="Manage circles"
                            ></button>
                        </div>
                    </div>
                </main>
                <ActivityFeed />
            </div>
        </div>
    );
}

export default Home