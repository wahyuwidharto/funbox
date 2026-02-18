import './CameraView.css'

function CameraView({ videoRef, isReady, error, onRetry }) {
    if (error) {
        return (
            <div className="camera-error">
                <span className="camera-error-icon">📷</span>
                <p className="camera-error-text">{error}</p>
                {onRetry && (
                    <button className="btn btn-secondary" onClick={onRetry}>
                        Try Again
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="camera-view">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`camera-video ${isReady ? 'camera-video-ready' : ''}`}
            />
            {!isReady && (
                <div className="camera-loading">
                    <div className="spinner" />
                    <p>Starting camera...</p>
                </div>
            )}
        </div>
    )
}

export default CameraView
