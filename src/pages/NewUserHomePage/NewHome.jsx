import './NewHome.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/LanguageContext';

function NewHome(props) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();

    return (
        <div>
            <Header currentCircle={props.circleName || "My Circle"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="home" />
                <main className='manage-main'>
                    <div className="welcome-page-content">
                        <div className="welcome-intro">
                            <h1 className="greeting">{t('home.hi')} {user?.firstName}</h1>
                            <p className="welcome-title">{t('newHome.welcomeTitle')}</p>

                            <p className="welcome-description">
                                {t('newHome.welcomeDescription')}
                            </p>

                            <p className="welcome-status">
                                {t('newHome.welcomeStatus')}
                            </p>
                        </div>

                        <div className="invite-section">
                            <h2 className="invite-heading">{t('newHome.inviteHeading')}</h2>
                            <button
                                className="send-invites-button"
                                onClick={() => navigate('/managecircles')}
                            >
                                {t('newHome.sendInvites')}
                            </button>
                        </div>

                        <div className="circle-info-section">
                            <p className="circle-info-text">
                                {t('newHome.circleInfoText')}
                            </p>

                            <div className="circle-selector welcome-circles">
                                <button
                                    className="circle-btn empty"
                                    onClick={() => navigate('/managecircles?create=true')}
                                    aria-label="Manage circles"
                                ></button>
                                <button
                                    className="circle-btn empty"
                                    onClick={() => navigate('/managecircles?create=true')}
                                    aria-label="Manage circles"
                                ></button>
                                <button
                                    className="circle-btn empty"
                                    onClick={() => navigate('/managecircles')}
                                    aria-label="Manage circles"
                                ></button>
                                <button
                                    className="circle-btn empty"
                                    onClick={() => navigate('/managecircles?create=true')}
                                    aria-label="Manage circles"
                                ></button>
                                <button
                                    className="circle-btn empty"
                                    onClick={() => navigate('/managecircles?create=true')}
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