import { useNavigate } from 'react-router-dom'
import './WelcomePage.css'

function WelcomePage() {
    const navigate = useNavigate()

    return (
        <div className="page welcome-page">
            <div className="welcome-content animate-fade-in">
                <div className="welcome-card">
                    <div className="welcome-logo">
                        <span className="logo-icon">📸</span>
                        <h1 className="logo-text">FunBox</h1>
                    </div>

                    <p className="welcome-subtitle">
                        Step into the booth, strike a pose, and take home your favorite moments — all in just a few taps!
                    </p>

                    <button
                        className="btn btn-primary btn-xl welcome-cta"
                        onClick={() => navigate('/steps')}
                    >
                        START →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage
