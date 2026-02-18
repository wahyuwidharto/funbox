import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCamera } from '../hooks/useCamera'
import { composeImage } from '../utils/composeImage'
import CameraView from '../components/CameraView'
import CountdownOverlay from '../components/CountdownOverlay'
import ShutterButton from '../components/ShutterButton'
import FramePreview from '../components/FramePreview'
import './CapturePage.css'

function CapturePage() {
    const location = useLocation()
    const navigate = useNavigate()
    const frameStyle = location.state?.frame || 'white'

    const { videoRef, isReady, error, startCamera, capturePhoto } = useCamera()

    const [photos, setPhotos] = useState([null, null, null, null])
    const [isCountingDown, setIsCountingDown] = useState(false)
    const [showFlash, setShowFlash] = useState(false)
    const [isComposing, setIsComposing] = useState(false)

    const photoCount = photos.filter(Boolean).length
    const allPhotosTaken = photoCount === 4

    useEffect(() => {
        startCamera()
    }, [startCamera])

    const handleShutterClick = () => {
        if (!isReady || isCountingDown || allPhotosTaken) return
        setIsCountingDown(true)
    }

    const handleCountdownComplete = useCallback(() => {
        const dataUrl = capturePhoto()
        if (dataUrl) {
            // Flash effect
            setShowFlash(true)
            setTimeout(() => setShowFlash(false), 300)

            // Fill next empty slot
            setPhotos((prev) => {
                const next = [...prev]
                const emptyIndex = next.findIndex((p) => p === null)
                if (emptyIndex !== -1) {
                    next[emptyIndex] = dataUrl
                }
                return next
            })
        }
        setIsCountingDown(false)
    }, [capturePhoto])

    const handleRemovePhoto = (index) => {
        setPhotos((prev) => {
            const next = [...prev]
            next[index] = null
            return next
        })
    }

    const handleDone = async () => {
        if (!allPhotosTaken) return
        setIsComposing(true)

        try {
            const blob = await composeImage(photos, frameStyle)
            // Navigate to download page with the composed image
            const dataUrl = await blobToDataUrl(blob)
            navigate('/download', { state: { image: dataUrl, frame: frameStyle } })
        } catch (err) {
            console.error('Composition error:', err)
            setIsComposing(false)
        }
    }

    return (
        <div className="capture-page">
            <div className="capture-layout">
                {/* Left: Camera */}
                <div className="capture-camera-section">
                    <div className="capture-camera-wrapper">
                        <CameraView
                            videoRef={videoRef}
                            isReady={isReady}
                            error={error}
                            onRetry={startCamera}
                        />
                        {isCountingDown && (
                            <CountdownOverlay
                                seconds={5}
                                onComplete={handleCountdownComplete}
                            />
                        )}
                        {showFlash && <div className="capture-flash" />}
                    </div>

                    <div className="capture-controls">
                        <div className="capture-info">
                            <span className="capture-count">
                                {photoCount} / 4 photos
                            </span>
                        </div>
                        <ShutterButton
                            onClick={handleShutterClick}
                            disabled={!isReady || isCountingDown || allPhotosTaken}
                        />
                        <div className="capture-info" />
                    </div>
                </div>

                {/* Right: Frame Preview */}
                <div className="capture-preview-section">
                    <div className="capture-preview-header">
                        <h3>Your Photo Strip</h3>
                        <p className="text-secondary text-sm">
                            {allPhotosTaken
                                ? 'All done! Click a photo to retake, or continue.'
                                : 'Click the shutter to capture your photos'}
                        </p>
                    </div>

                    <FramePreview
                        photos={photos}
                        frameStyle={frameStyle}
                        onRemovePhoto={handleRemovePhoto}
                    />

                    {allPhotosTaken && (
                        <button
                            className="btn btn-gold btn-lg capture-done-btn animate-scale-in"
                            onClick={handleDone}
                            disabled={isComposing}
                        >
                            {isComposing ? (
                                <>
                                    <div className="spinner" style={{ width: 20, height: 20 }} />
                                    Processing...
                                </>
                            ) : (
                                'Continue ✨'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function blobToDataUrl(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
    })
}

export default CapturePage
