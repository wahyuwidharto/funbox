import { useNavigate } from 'react-router-dom'
import StepCard from '../components/StepCard'
import './StepsPage.css'

const steps = [
    {
        icon: '🖼️',
        title: 'Choose Your Frame',
        description: 'Pick your favorite photo frame style — classic white or sleek black.',
        color: 'card-yellow',
    },
    {
        icon: '📸',
        title: 'Strike a Pose',
        description: 'Stand in front of the camera and get ready for your close-up!',
        color: 'card-pink',
    },
    {
        icon: '⏱️',
        title: 'Smile!',
        description: 'A 5-second countdown, then snap! Repeat 4 times.',
        color: 'card-teal',
    },
    {
        icon: '📱',
        title: 'Get Your Photos',
        description: 'Scan the QR code to instantly download your photo strip.',
        color: '',
    },
]

function StepsPage() {
    const navigate = useNavigate()

    return (
        <div className="page steps-page">
            <div className="steps-container animate-fade-in">
                <div className="steps-header">
                    <h2>How It Works</h2>
                    <p className="text-secondary">Super easy — just follow these steps</p>
                </div>

                <div className="steps-list stagger-children">
                    {steps.map((step, i) => (
                        <StepCard
                            key={i}
                            number={i + 1}
                            icon={step.icon}
                            title={step.title}
                            description={step.description}
                            colorClass={step.color}
                        />
                    ))}
                </div>

                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate('/frames')}
                >
                    LET'S GO →
                </button>
            </div>
        </div>
    )
}

export default StepsPage
