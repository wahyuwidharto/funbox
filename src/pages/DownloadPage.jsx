import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { uploadPhoto, getPhotoUrl } from '../utils/api'
import QRCodeDisplay from '../components/QRCodeDisplay'
import './DownloadPage.css'

const TTL_SECONDS = 5 * 60 // 5 minutes

function DownloadPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const imageDataUrl = location.state?.image

    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState(null)
    const [photoUrl, setPhotoUrl] = useState(null)
    const [timeLeft, setTimeLeft] = useState(TTL_SECONDS)

    const handleUpload = useCallback(async () => {
        if (!imageDataUrl) return

        setIsUploading(true)
        setUploadError(null)

        try {
            // Convert data URL to blob
            const res = await fetch(imageDataUrl)
            const blob = await res.blob()

            const result = await uploadPhoto(blob)
            const fullUrl = getPhotoUrl(result.id)
            setPhotoUrl(fullUrl)
        } catch (err) {
            console.error('Upload error:', err)
            setUploadError('Failed to upload photo. You can still download directly.')
            // Fallback: allow direct download from data URL
            setPhotoUrl(null)
        } finally {
            setIsUploading(false)
        }
    }, [imageDataUrl])

    useEffect(() => {
        handleUpload()
    }, [handleUpload])

    // Countdown timer
    useEffect(() => {
        if (!photoUrl) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [photoUrl])

    const handleDirectDownload = () => {
        const link = document.createElement('a')
        link.href = imageDataUrl
        link.download = 'funbox-photo.jpg'
        link.click()
    }

    const handlePrint = () => {
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
      <html>
        <head><title>FunBox Photo</title></head>
        <body style="margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh;">
          <img src="${imageDataUrl}" style="max-width:100%; max-height:100vh;" />
        </body>
      </html>
    `)
        printWindow.document.close()
        printWindow.onload = () => {
            printWindow.print()
        }
    }

    const formatTime = (s) => {
        const min = Math.floor(s / 60)
        const sec = s % 60
        return `${min}:${sec.toString().padStart(2, '0')}`
    }

    if (!imageDataUrl) {
        return (
            <div className="page">
                <div className="download-error animate-fade-in">
                    <h2>Oops!</h2>
                    <p className="text-secondary">No photo found. Let's start over!</p>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
                        Start Over
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="page download-page">
            <div className="download-container animate-fade-in">
                <div className="download-header">
                    <h2>Your Photo is Ready! 🎉</h2>
                    {photoUrl && timeLeft > 0 && (
                        <p className="download-timer text-secondary">
                            Available for download: <strong>{formatTime(timeLeft)}</strong>
                        </p>
                    )}
                </div>

                <div className="download-content">
                    {/* Image Preview */}
                    <div className="download-preview">
                        <img src={imageDataUrl} alt="Your FunBox photo" className="download-image" />
                    </div>

                    {/* QR & Actions */}
                    <div className="download-actions">
                        {isUploading ? (
                            <div className="download-loading">
                                <div className="spinner" />
                                <p className="text-secondary">Uploading your photo...</p>
                            </div>
                        ) : (
                            <>
                                {photoUrl && <QRCodeDisplay url={photoUrl} />}

                                {uploadError && (
                                    <p className="download-error-text">{uploadError}</p>
                                )}

                                <div className="download-buttons">
                                    <button className="btn btn-primary btn-lg" onClick={handleDirectDownload}>
                                        📥 Download
                                    </button>
                                    <button className="btn btn-secondary btn-lg" onClick={handlePrint}>
                                        🖨️ Print
                                    </button>
                                </div>

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/')}
                                >
                                    ← Start Over
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DownloadPage
