import './StepCard.css'

function StepCard({ number, icon, title, description, colorClass }) {
    return (
        <div className={`step-card card ${colorClass || ''}`}>
            <div className="step-card-icon">{icon}</div>
            <div className="step-card-content">
                <span className="step-card-number">Step {number}</span>
                <h3 className="step-card-title">{title}</h3>
                <p className="step-card-description">{description}</p>
            </div>
        </div>
    )
}

export default StepCard
