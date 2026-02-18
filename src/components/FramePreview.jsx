import './FramePreview.css'

function FramePreview({ photos, frameStyle, onRemovePhoto }) {
    const isWhite = frameStyle === 'white'
    const bgColor = isWhite ? '#FFFFFF' : '#1A1A1A'
    const slotBorder = isWhite ? '#D4D4D4' : '#404040'
    const textColor = isWhite ? '#1A1A1A' : '#FFFFFF'

    return (
        <div className="frame-preview" style={{ backgroundColor: bgColor }}>
            <div className="frame-preview-grid">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`frame-slot ${photos[i] ? 'frame-slot-filled' : ''}`}
                        style={{ borderColor: slotBorder }}
                    >
                        {photos[i] ? (
                            <>
                                <img src={photos[i]} alt={`Photo ${i + 1}`} className="frame-slot-image" />
                                <button
                                    className="frame-slot-remove"
                                    onClick={() => onRemovePhoto(i)}
                                    aria-label={`Remove photo ${i + 1}`}
                                >
                                    ✕
                                </button>
                            </>
                        ) : (
                            <div className="frame-slot-empty" style={{ color: slotBorder }}>
                                <span className="frame-slot-icon">📷</span>
                                <span className="frame-slot-label">{i + 1}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <span className="frame-preview-brand" style={{ color: textColor }}>
                FunBox
            </span>
        </div>
    )
}

export default FramePreview
