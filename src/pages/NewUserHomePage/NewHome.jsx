import './NewHome.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';
import { useNavigate } from "react-router-dom";

function NewHome(props) {
    const navigate = useNavigate();

    return (
        <div>
            <Header currentCircle={props.circleName || "My Circle"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="home" />
                <main className='manage-main'>
                    <div className="welcome-page-content">
                        <div className="welcome-intro">
                            <h1 className="greeting">Hi, Nicole</h1>
                            <p className="welcome-title">Welcome to CloseKnit!</p>
                            
                            <p className="welcome-description">
                                You're just one step away from building your first circle. Circles help you stay 
                                connected to friends & family through shared calendars, journals, and memory 
                                boards, all in one place.
                            </p>

                            <p className="welcome-status">
                                Your circle is already set up, but you're the only member.<br />
                                Invite someone to start seeing updates here.
                            </p>
                        </div>

                        <div className="invite-section">
                            <h2 className="invite-heading">Ready to bring your circle to life?</h2>
                            <button 
                                className="send-invites-button"
                                onClick={() => navigate('/managecircles')}
                            >
                                Send Invites
                            </button>
                        </div>

                        <div className="circle-info-section">
                            <p className="circle-info-text">
                                You can easily find all of your joined circles in this tab. Press one to 
                                switch between them!
                            </p>
                            
                            <div className="circle-selector welcome-circles">
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
                                    className="circle-btn placeholder"
                                    onClick={() => navigate('/managecircles')}
                                    aria-label="Manage circles"
                                >
                                    N
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
                    </div>
                </main>
                <ActivityFeed />
            </div>
        </div>
    );
}

export default NewHome