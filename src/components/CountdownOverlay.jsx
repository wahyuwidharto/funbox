import { useEffect, useState } from 'react'
import './CountdownOverlay.css'

function CountdownOverlay({ seconds, onComplete }) {
    const [current, setCurrent] = useState(seconds)

    useEffect(() => {
        if (current <= 0) {
            onComplete()
            return
        }

        const timer = setTimeout(() => {
            setCurrent((prev) => prev - 1)
        }, 1000)

        return () => clearTimeout(timer)
    }, [current, onComplete])

    if (current <= 0) return null

    return (
        <div className="countdown-overlay">
            <span key={current} className="countdown-number">
                {current}
            </span>
        </div>
    )
}

export default CountdownOverlay
