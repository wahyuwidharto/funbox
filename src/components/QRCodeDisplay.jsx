import { QRCodeSVG } from 'qrcode.react'
import './QRCodeDisplay.css'

function QRCodeDisplay({ url }) {
    return (
        <div className="qr-container">
            <div className="qr-wrapper">
                <QRCodeSVG
                    value={url}
                    size={200}
                    bgColor="#FFFFFF"
                    fgColor="#1A1A1A"
                    level="M"
                    includeMargin={true}
                />
            </div>
            <p className="qr-hint">Scan with your phone to download</p>
        </div>
    )
}

export default QRCodeDisplay
