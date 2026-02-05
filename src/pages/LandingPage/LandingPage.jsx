import './LandingPage.css'

const LandingPage = () => {
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
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#help">FAQs</a>
                </nav>

                <div className="landing-header-right">
                    <a href="/signup" className="landing-cta">Sign Up</a>
                    <a href="/login" className="landing-cta">Login</a>
                </div>
            </header>

{/* mission statement */}
            <section className="landing-section">
                <h1 className="landing-h1">Your Circle. Your Stories. One Place.</h1>
                <p className="landing-p">
                    CloseKnit helps you share life's moments, memories and goals with the people who matter most.
                    <br /><br />
                    <a href="/signup" className="landing-cta">Get Started</a>
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
                        <h2 className="landing-h2">Connecting People, Near and Far</h2>

                        <p className="landing-p">CloseKnit is a platform designed to connect users no matter where they are, whether just minutes apart or across the globe.</p>

                        <p className="landing-p">Join CloseKnit today and start sharing memories, planning moments, and connecting with your favorite people.</p>

                        <button className="landing-button" onClick={() => (window.location.href = "/signup")}>
                            Get Started
                        </button>
                    </section>
                </div>
            </div>

{/* FAQ */}
            <div className="landing-centered-box">
                <section className="landing-section">
                    <h3 className="landing-h3">Frequently Asked Questions</h3>
                    <p className="landing-p">Got questions? Find answers to the most common questions about CloseKnit.</p>
                    <details className="landing-details">
                        <summary className="landing-summary">Is CloseKnit free to use?</summary>
                        <p className="landing-p">Yes! CloseKnit is completely free to use. You can create an account, connect with friends and family, and access all the core features like the memory board, shared journal, and calendar at no cost.</p>
                    </details>

                    <details className="landing-details">
                        <summary className="landing-summary">What devices are supported?</summary>
                        <p className="landing-p">CloseKnit can be accessed through any modern web browser on desktop, laptop, tablet, or mobile devices. There's no need to download an app, everything works directly in your browser for a smooth and consistent experience.</p>
                    </details>

                    <details className="landing-details">
                        <summary className="landing-summary">Is CloseKnit suitable for kids or teens?</summary>
                        <p className="landing-p">CloseKnit is designed for users aged 13 and older. While the platform encourages positive connections and family-friendly interactions, younger users should have permission and guidance from a parent or guardian when creating an account or sharing content.</p>
                    </details>

                    <details className="landing-details">
                        <summary className="landing-summary">Can I leave a circle?</summary>
                        <p className="landing-p">Yes, you can leave a circle at any time. Simply go to your circle settings and select the option to leave. Once you do, you'll no longer receive updates or notifications from that group, but you can rejoin later if invited back.</p>
                    </details>

                    <details className="landing-details">
                        <summary className="landing-summary">Can I use CloseKnit internationally?</summary>
                        <p className="landing-p">Yes, CloseKnit can be used anywhere with an internet connection. Whether your loved ones are across town or across the world, you can stay connected and share moments seamlessly through your web browser.</p>
                    </details>
                </section>
            </div>
            <br></br>

{/* footer */}
            <div className="landing-gradient-top">
                <footer className="landing-footer">
                    <div className="landing-footer-left">
                        <img
                            src="/images/branding/logo.svg"
                            alt="CloseKnit Logo"
                            height="60"
                        />
                        <p className="landing-p">
                            CloseKnit brings friends and family together by providing a space
                            to connect and remember what matters most.
                        </p>
                    </div>

                    <div className="landing-footer-center">
                        © 2026 All Rights Reserved | CloseKnit
                    </div>

                    <div className="landing-footer-right">
                        <div>
                            <strong>Menu</strong><br />
                            <a href="#" className="landing-a">Home</a><br />
                            <a href="#" className="landing-a">About</a><br />
                            <a href="#" className="landing-a">FAQs</a>
                        </div>

                        <div>
                            <strong>Get Started</strong><br />
                            <a href="/signup" className="landing-a">Sign Up</a><br />
                            <a href="/login" className="landing-a">Login</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;

/* Landing Page made by Joseff Mancilla */