import './Login.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/useAuth'
import { useLanguage } from '../../context/LanguageContext'

function Login() {
    const navigate = useNavigate()
    const { login, updateUser } = useAuth()
    const { t } = useLanguage()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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
            navigate('/home')

        } catch (err) {

            setError(err.message)

        }

    }, [navigate, updateUser, setError])

    useEffect(function () {

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
        setLoading(true)

        try {
            await login(email, password)
            navigate('/home')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

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
                            <p>{t('auth.feature1Line1')}</p>
                            <p>{t('auth.feature1Line2')}</p>
                            <p>{t('auth.feature1Line3')}</p>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <img src="/images/ui/diary-1.svg" alt="Memory Board" />
                        </div>
                        <div className="feature-text">
                            <p>{t('auth.feature2Line1')}</p>
                            <p>{t('auth.feature2Line2')}</p>
                            <p>{t('auth.feature2Line3')}</p>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <img src="/images/ui/wedding-1.svg" alt="Calendar" />
                        </div>
                        <div className="feature-text">
                            <p>{t('auth.feature3Line1')}</p>
                            <p>{t('auth.feature3Line2')}</p>
                            <p>{t('auth.feature3Line3')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="right-section">
                <div className="login-form">
                    <h1 className="login-title">{t('auth.loginTitle')}</h1>

                    <form onSubmit={handleSubmit}>
                        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                        <div className="form-group">
                            <label htmlFor="email">{t('auth.email')}</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="YourEmail123@gmail.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">{t('auth.password')}</label>
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
                            <a
                                href="#"
                                className="forgot-password"
                                onClick={(event) => {
                                    event.preventDefault()
                                    navigate('/forgot-password')
                                }}
                            >
                                {t('auth.forgotPassword')}
                            </a>
                        </div>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? t('auth.loggingIn') : t('auth.logIn')}
                        </button>
                    </form>

                    <div className="divider">
                        <span>{t('auth.or')}</span>
                    </div>

                    <div className="social-buttons">
                        <button className="social-button google" onClick={handleGoogleClick}>
                            <img src="/images/ui/google.svg" alt="Google" />
                            {t('auth.continueWithGoogle')}
                        </button>
                    </div>

                    <p className="signup-link">
                        {t('auth.noAccount')} <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault()
                                navigate('/signup')
                            }}
                        >
                            {t('auth.signUpLink')}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login