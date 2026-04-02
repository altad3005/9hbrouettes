import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { api } from './api'
import Classement from './pages/Classement'
import Scan from './pages/Scan'
import Admin from './pages/Admin'
import Protected from './components/Protected'
import Countdown from './pages/Countdown'

function BottomNav() {
    const base = 'flex flex-col items-center gap-0.5 flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors'
    const active = 'text-forest'
    const inactive = 'text-cream/40'

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-navy border-t border-white/10 flex">
            <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <span className="text-lg">🏆</span>
                Public
            </NavLink>
            <NavLink to="/scan" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <span className="text-lg">✍️</span>
                Encodage
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <span className="text-lg">⚙️</span>
                Admin
            </NavLink>
        </nav>
    )
}

function App() {
    const [startTime, setStartTime] = useState(null)
    const [configLoaded, setConfigLoaded] = useState(false)

    useEffect(() => {
        api.connect()
        const unsub = api.onConfig(config => {
            setStartTime(config.startTime ? new Date(config.startTime).getTime() : null)
            setConfigLoaded(true)
        })
        return () => unsub()
    }, [])

    const eventStarted = !startTime || Date.now() >= startTime

    if (!configLoaded) return <div className="min-h-screen bg-navy" />

    if (!eventStarted) return <Countdown targetDate={startTime} />

    return (
        <BrowserRouter>
            <div className="pb-14">
                <Routes>
                    <Route path="/" element={<Classement />} />
                    <Route
                        path="/scan"
                        element={
                            <Protected type="staff">
                                <Scan />
                            </Protected>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <Protected type="admin">
                                <Admin />
                            </Protected>
                        }
                    />
                </Routes>
            </div>
            <BottomNav />
        </BrowserRouter>
    )
}

export default App
