import './LandingPage.css'

const LandingPage = () => {
    return (
        <div>
{/* header */}
            <header className="header">
                <div className="header-left">
                    <img
                        src="/images/branding/logo.svg"
                        alt="CloseKnit Logo"
                        className="image"
                        height="60"
                    />
                </div>

                <nav className="header-center">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#help">FAQs</a>
                </nav>

                <div className="header-right">
                    <a href="/signup" className="cta">Sign Up</a>
                    <a href="/login" className="cta">Login</a>
                </div>
            </header>

{/* mission statement */}
            <section>
                <h1>Your Circle. Your Stories. One Place.</h1>
                <p>
                    CloseKnit helps you share life's moments, memories and goals with the people who matter most.
                    <br /><br />
                    <a href="/signup" className="cta">Get Started</a>
                </p>
            </section>

{/* image */}
            <img
                className="center-img"
                src="/images/branding/globe.png"
                alt="Globe"
            />

{/* why us */}
            <div className="hero">
                <div className="image-card">
                    <img
                        src="/images/branding/woman-laptop.jpg"
                        alt="Person Using Laptop"
                    />
                </div>

                <div className="content-card">
                    <section>
                        <h2>Connecting People, Near and Far</h2>

                        <p>CloseKnit is a platform designed to connect users no matter where they are, whether just minutes apart or across the globe.</p>

                        <p>Join CloseKnit today and start sharing memories, planning moments, and connecting with your favorite people.</p>

                        <button onClick={() => (window.location.href = "/signup")}>
                            Get Started
                        </button>
                    </section>
                </div>
            </div>

{/* FAQ */}
            <div className="centered-box">
                <section>
                    <h3>Frequently Asked Questions</h3>
                    <p>Got questions? Find answers to the most common questions about CloseKnit.</p>
                    <details>
                        <summary>Is CloseKnit free to use?</summary>
                        <p>Yes! CloseKnit is completely free to use. You can create an account, connect with friends and family, and access all the core features like the memory board, shared journal, and calendar at no cost.</p>
                    </details>

                    <details>
                        <summary>What devices are supported?</summary>
                        <p>CloseKnit can be accessed through any modern web browser on desktop, laptop, tablet, or mobile devices. There’s no need to download an app, everything works directly in your browser for a smooth and consistent experience.</p>
                    </details>

                    <details>
                        <summary>Is CloseKnit suitable for kids or teens?</summary>
                        <p>CloseKnit is designed for users aged 13 and older. While the platform encourages positive connections and family-friendly interactions, younger users should have permission and guidance from a parent or guardian when creating an account or sharing content.</p>
                    </details>

                    <details>
                        <summary>Can I leave a circle?</summary>
                        <p>Yes, you can leave a circle at any time. Simply go to your circle settings and select the option to leave. Once you do, you'll no longer receive updates or notifications from that group, but you can rejoin later if invited back.</p>
                    </details>

                    <details>
                        <summary>Can I use CloseKnit internationally?</summary>
                        <p>Yes, CloseKnit can be used anywhere with an internet connection. Whether your loved ones are across town or across the world, you can stay connected and share moments seamlessly through your web browser.</p>
                    </details>
                </section>
            </div>
            <br></br>

{/* footer */}
            <div className="gradient-top">
                <footer className="footer">
                    <div className="footer-left">
                        <img
                            src="/images/branding/logo.svg"
                            alt="CloseKnit Logo"
                            height="60"
                        />
                        <p>
                            CloseKnit brings friends and family together by providing a space
                            to connect and remember what matters most.
                        </p>
                    </div>

                    <div className="footer-center">
                        © 2026 All Rights Reserved | CloseKnit
                    </div>

                    <div className="footer-right">
                        <div>
                            <strong>Menu</strong><br />
                            <a href="#">Home</a><br />
                            <a href="#">About</a><br />
                            <a href="#">FAQs</a>
                        </div>

                        <div>
                            <strong>Get Started</strong><br />
                            <a href="/signup">Sign Up</a><br />
                            <a href="/login">Login</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;

/* Landing Page made by Joseff Mancilla */
