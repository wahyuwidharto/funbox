import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FrameSelectionPage.css'

const frames = [
    {
        id: 'white',
        label: 'Classic White',
        bgColor: '#FFFFFF',
        slotColor: '#E5E5E5',
        textColor: '#1A1A1A',
    },
    {
        id: 'black',
        label: 'Sleek Black',
        bgColor: '#1A1A1A',
        slotColor: '#333333',
        textColor: '#FFFFFF',
    },
]

function FramePreviewMini({ frame, selected, onClick }) {
    return (
        <div
            className={`frame-option card card-interactive ${selected ? 'card-selected' : ''}`}
            onClick={onClick}
        >
            <div
                className="frame-preview-mini"
                style={{ backgroundColor: frame.bgColor }}
            >
                <div className="frame-grid-mini">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="frame-slot-mini"
                            style={{ backgroundColor: frame.slotColor }}
                        />
                    ))}
                </div>
                <span
                    className="frame-brand-mini"
                    style={{ color: frame.textColor }}
                >
                    FunBox
                </span>
            </div>
            <div className="frame-option-label">
                <span className="frame-option-name">{frame.label}</span>
                {selected && <span className="frame-option-check">✓</span>}
            </div>
        </div>
    )
}

function FrameSelectionPage() {
    const [selectedFrame, setSelectedFrame] = useState(null)
    const navigate = useNavigate()

    const handleNext = () => {
        if (selectedFrame) {
            navigate('/capture', { state: { frame: selectedFrame } })
        }
    }

    return (
        <div className="page frame-selection-page">
            <div className="frame-selection-container animate-fade-in">
                <div className="frame-selection-header">
                    <h2>Choose Your Frame</h2>
                    <p className="text-secondary">Select a frame style for your photo strip</p>
                </div>

                <div className="frame-options">
                    {frames.map((frame) => (
                        <FramePreviewMini
                            key={frame.id}
                            frame={frame}
                            selected={selectedFrame === frame.id}
                            onClick={() => setSelectedFrame(frame.id)}
                        />
                    ))}
                </div>

                <button
                    className="btn btn-primary btn-lg"
                    disabled={!selectedFrame}
                    onClick={handleNext}
                >
                    Next →
                </button>
            </div>
        </div>
    )
}

export default FrameSelectionPage
