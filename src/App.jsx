import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import StepsPage from './pages/StepsPage'
import FrameSelectionPage from './pages/FrameSelectionPage'
import CapturePage from './pages/CapturePage'
import DownloadPage from './pages/DownloadPage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/steps" element={<StepsPage />} />
                <Route path="/frames" element={<FrameSelectionPage />} />
                <Route path="/capture" element={<CapturePage />} />
                <Route path="/download" element={<DownloadPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
