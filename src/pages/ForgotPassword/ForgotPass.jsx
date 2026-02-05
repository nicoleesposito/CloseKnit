import { useNavigate } from 'react-router-dom'
import './ForgotPass.css'

function ForgotPass() {
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Password reset email sent')
        // Navigate to reset password page
        navigate('/reset-password')
    }
    return (
        <div className="forgot-pass-container">
            <div className="logo">
                <img src="/images/branding/logo.svg" alt="CloseKnit Logo" className="logo-image" />
            </div>

            <div className="forgot-pass-content">
                <h1 className="forgot-pass-title">Forgot Password?</h1>
                <p className="forgot-pass-subtitle">No worries, let's fix that.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="jowax_Erickson29@gmail.com"
                        />
                    </div>

                    <button type="submit" className="continue-button">
                        Continue
                    </button>
                </form>

                <button 
                    className="back-to-login"
                    onClick={() => navigate('/login')}
                >
                    ← Back to log in
                </button>

                <p className="signup-link">
                    Don't have an account? <a 
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            navigate('/signup')
                        }}
                    >
                        Sign up!
                    </a>
                </p>
            </div>
        </div>
    )
}

export default ForgotPass