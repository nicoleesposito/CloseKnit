import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import './SignUp.css'
import { useAuth } from '../../context/useAuth'

function SignUp() {
    const navigate = useNavigate()
    const { login, updateUser } = useAuth()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // runs when Google returns the login token
    const handleGoogleResponse = useCallback(async function (response) {

        try {

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    token: response.credential
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message)
            }

            updateUser(data)
            navigate('/newhome')

        } catch (err) {

            setError(err.message)

        }

    }, [navigate, updateUser, setError])

    useEffect(function () {

        // stops if Google script hasnt loaded yet
        if (!window.google) {
            return
        }

        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse
        })

    }, [handleGoogleResponse])

    function handleGoogleClick() {
        window.google.accounts.id.prompt()
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        // check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            // send registration request to backend
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ firstName, lastName, email, password }),
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message)
            }

            // automatically log the user in after signup. sends them to the home for new user
            await login(email, password)
            navigate('/newhome')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="signup-container">
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
                            <img src="/images/ui/wedding-1.svg" alt="Wedding" />
                        </div>
                        <div className="feature-text">
                            <p>Celebrate life together. Track</p>
                            <p>birthdays, goals, and plans</p>
                            <p>with the people who matter.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="right-section">
                <div className="signup-form">
                    <h1 className="signup-title">Sign up and make every connection count.</h1>

                    <form onSubmit={handleSubmit}>
                        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                        {/* Right Side - Sign Up Form */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(event) => setFirstName(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    placeholder="Erickson"
                                    value={lastName}
                                    onChange={(event) => setLastName(event.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="YourEmail123@gmail.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required
                                    />
                                    <button type="button" className="toggle-password">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        required
                                    />
                                    <button type="button" className="toggle-password">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="signup-button" disabled={loading}>
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="social-buttons">
                        <button className="social-button google" onClick={handleGoogleClick}>
                            <img src="/images/ui/google.svg" alt="Google" />
                            Continue with Google
                        </button>
                    </div>

                    <p className="login-link">
                        Already have an account? <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                navigate('/login')
                            }}
                        >
                            Log in!
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp