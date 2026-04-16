import { useNavigate } from 'react-router-dom'
import './ForgotPass.css'
import { useLanguage } from '../../context/LanguageContext'

function ForgotPass() {
    const navigate = useNavigate()
    const { t } = useLanguage()

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
                <h1 className="forgot-pass-title">{t('auth.forgotPassTitle')}</h1>
                <p className="forgot-pass-subtitle">{t('auth.forgotPassSubtitle')}</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">{t('auth.email')}</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="jowax_Erickson29@gmail.com"
                        />
                    </div>

                    <button type="submit" className="continue-button">
                        {t('auth.continue')}
                    </button>
                </form>

                <button
                    className="back-to-login"
                    onClick={() => navigate('/login')}
                >
                    {t('auth.backToLogin')}
                </button>

                <p className="signup-link">
                    {t('auth.noAccount')} <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            navigate('/signup')
                        }}
                    >
                        {t('auth.signUpLink')}
                    </a>
                </p>
            </div>
        </div>
    )
}

export default ForgotPass