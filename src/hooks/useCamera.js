import { useRef, useState, useEffect, useCallback } from 'react'

export function useCamera() {
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const [isReady, setIsReady] = useState(false)
    const [error, setError] = useState(null)

    const startCamera = useCallback(async () => {
        try {
            setError(null)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user',
                },
                audio: false,
            })

            streamRef.current = stream

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play()
                    setIsReady(true)
                }
            }
        } catch (err) {
            console.error('Camera error:', err)
            if (err.name === 'NotAllowedError') {
                setError('Camera access was denied. Please allow camera access in your browser settings.')
            } else if (err.name === 'NotFoundError') {
                setError('No camera found. Please connect a camera and try again.')
            } else {
                setError(`Camera error: ${err.message}`)
            }
        }
    }, [])

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !isReady) return null

        const video = videoRef.current
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        // Mirror the image (selfie mode)
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(video, 0, 0)

        return canvas.toDataURL('image/jpeg', 0.92)
    }, [isReady])

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
            setIsReady(false)
        }
    }, [])

    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [stopCamera])

    return {
        videoRef,
        isReady,
        error,
        startCamera,
        capturePhoto,
        stopCamera,
    }
}
