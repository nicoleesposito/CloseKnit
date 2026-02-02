import './Login.css'

function Login() {
    return (
        <div className="login-container">
            {/* Left Side - Features */}
            <div className="left-section">
                <div className="logo">
                    <img src="/images/branding/logo.svg" alt="CloseKnit Logo" className="logo-image" />
                </div>

                <div className="features">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <img src="/images/ui/journaling-1.svg" alt="Journal" />
                        </div>
                        <div className="feature-text">
                            <p>Write together, reflect together.</p>
                            <p>Build a shared journal that</p>
                            <p>keeps your stories connected.</p>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <img src="/images/ui/diary-1.svg" alt="Memory Board" />
                        </div>
                        <div className="feature-text">
                            <p>Keep your memories close and</p>
                            <p>your connections closer with a</p>
                            <p>collaborative Memory Board.</p>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <img src="/images/ui/wedding-1.svg" alt="Calendar" />
                        </div>
                        <div className="feature-text">
                            <p>Celebrate life together. Track</p>
                            <p>birthdays, goals, and plans</p>
                            <p>with the people who matter.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Formm */}
            <div className="right-section">
                <div className="login-form">
                    <h1 className="login-title">Sign in to keep the moments going.</h1>

                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="YourEmail123@gmail.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input 
                                    type="password" 
                                    id="password" 
                                />
                                <button type="button" className="toggle-password">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                </button>
                            </div>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>

                        <button type="submit" className="login-button">Log In</button>
                    </form>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="social-buttons">
                        <button className="social-button google">
                            <img src="/images/ui/google.svg" alt="Google" />
                            Continue with Google
                        </button>

                        <button className="social-button apple">
                            <img src="/images/ui/apple.svg" alt="Apple" />
                            Continue with Apple
                        </button>

                        <button className="social-button facebook">
                            <img src="/images/ui/facebook.svg" alt="Facebook" />
                            Continue with Facebook
                        </button>
                    </div>

                    <p className="signup-link">
                        Don't have an account? <a href="#">Sign up!</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login

