import './LandingPage.css'
import { useLanguage } from '../../context/LanguageContext';

const LandingPage = () => {
    const { t } = useLanguage();
    return (
        <div className="landing-page">
{/* header */}
            <header className="landing-header">
                <div className="landing-header-left">
                    <img
                        src="/images/branding/logo.svg"
                        alt="CloseKnit Logo"
                        className="landing-image"
                        height="60"
                    />
                </div>

                <nav className="landing-header-center">
                    <a href="#home">{t('landing.navHome')}</a>
                    <a href="#about">{t('landing.navAbout')}</a>
                    <a href="#help">{t('landing.navFaqs')}</a>
                </nav>

                <div className="landing-header-right">
                    <a href="/signup" className="landing-cta">{t('landing.signUp')}</a>
                    <a href="/login" className="landing-cta">{t('landing.login')}</a>
                </div>
            </header>

{/* mission statement */}
            <section className="landing-section">
                <h1 className="landing-h1">{t('landing.hero')}</h1><br></br>
                <p className="landing-p">
                    {t('landing.tagline')}
                    <br /><br />
                    <a href="/signup" className="landing-cta">{t('landing.getStarted')}</a>
                </p>
            </section>

{/* image */}
            <img
                className="landing-center-img"
                src="/images/branding/globe.png"
                alt="Globe"
            />

{/* why us */}
            <div className="landing-hero">
                <div className="landing-image-card">
                    <img
                        src="/images/branding/woman-laptop.jpg"
                        alt="Person Using Laptop"
                    />
                </div>

                <div className="landing-content-card">
                    <section className="landing-section">
                        <h2 className="landing-h2">{t('landing.connectingTitle')}</h2>

                        <p className="landing-p">{t('landing.connectingText1')}</p>

                        <p className="landing-p">{t('landing.connectingText2')}
                            <br></br>
                            <button className="landing-button" onClick={() => (window.location.href = "/signup")}>
                            {t('landing.getStarted')}
                        </button></p>

                        
                    </section>
                </div>
            </div>

{/* FAQ */}
            <div className="landing-centered-box">
                <section className="landing-section">
                    <h3 className="landing-h3">{t('landing.faqTitle')}</h3>
                    <p className="landing-p">{t('landing.faqIntro')}</p>
                    <details className="landing-details">
                        <summary className="landing-summary">{t('landing.faq1Q')}</summary>
                        <p className="landing-p">{t('landing.faq1A')}</p>
                    </details>

                    <details className="landing-details">
                        <summary className="landing-summary">{t('landing.faq2Q')}</summary>
                        <p className="landing-p">{t('landing.faq2A')}</p>
                    </details>

                    <details className="landing-details">
                        <summary className="landing-summary">{t('landing.faq3Q')}</summary>
                        <p className="landing-p">{t('landing.faq3A')}</p>
                    </details>

                    <details className="landing-details">
                        <summary className="landing-summary">{t('landing.faq4Q')}</summary>
                        <p className="landing-p">{t('landing.faq4A')}</p>
                    </details>

                    <details className="landing-details">
                        <summary className="landing-summary">{t('landing.faq5Q')}</summary>
                        <p className="landing-p">{t('landing.faq5A')}</p>
                    </details>
                </section>
            </div>
            <br></br>

{/* footer */}
            <div className="landing-gradient-top">
                <footer className="landing-footer">
                    <div className="landing-footer-logo-block">
                        <img
                            src="/images/branding/logo.svg"
                            alt="CloseKnit Logo"
                            height="60"
                        />
                        <p className="landing-p">
                            {t('landing.footerTagline')}
                        </p>
                    </div>

                    <div className="landing-footer-center">
                        {t('landing.footerCopyright')}
                    </div>

                    <div className="landing-footer-right">
                        <div>
                            <strong>{t('landing.footerMenu')}</strong><br />
                            <a href="#" className="landing-a">{t('landing.navHome')}</a><br />
                            <a href="#" className="landing-a">{t('landing.navAbout')}</a><br />
                            <a href="#" className="landing-a">{t('landing.navFaqs')}</a>
                        </div>

                        <div>
                            <strong>{t('landing.footerGetStarted')}</strong><br />
                            <a href="/signup" className="landing-a">{t('landing.signUp')}</a><br />
                            <a href="/login" className="landing-a">{t('landing.login')}</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;

/* Landing Page made by Joseff Mancilla */
