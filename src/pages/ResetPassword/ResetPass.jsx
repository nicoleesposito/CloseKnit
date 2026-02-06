import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './ResetPass.css'

function ResetPassword() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Password reset')
        // navigate back to login
        navigate('/login')
    }

    return (
        <div className="reset-password-container">
            <div className="logo">
                <img src="/images/branding/logo.svg" alt="CloseKnit Logo" className="logo-image" />
            </div>

            <div className="reset-password-content">
                <h1 className="reset-password-title">Set new password</h1>
                <p className="reset-password-subtitle">Must be at least 8 characters.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"}
                                id="password" 
                                minLength="8"
                                required
                            />
                            <button 
                                type="button" 
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                    {!showPassword && <line x1="1" y1="1" x2="23" y2="23"/>}
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-password" 
                                minLength="8"
                                required
                            />
                            <button 
                                type="button" 
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                    {!showConfirmPassword && <line x1="1" y1="1" x2="23" y2="23"/>}
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="reset-button">
                        Reset Password
                    </button>
                </form>

                <button 
                    className="back-to-login"
                    onClick={() => navigate('/login')}
                >
                    ← Back to log in
                </button>
            </div>
        </div>
    )
}

export default ResetPassword