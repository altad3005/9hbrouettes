import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Classement from './pages/Classement'
import Scan from './pages/Scan'
import Admin from './pages/Admin'
import Protected from './components/Protected'

function App() {
    return (
        <BrowserRouter>
            <nav className="fixed top-0 w-full z-50 flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                <div className="bg-black/80 text-white px-6 py-2 rounded-b-xl flex gap-6 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                    <Link to="/" className="hover:text-lime-400">Public</Link>
                    <Link to="/scan" className="hover:text-lime-400">Scan</Link>
                    <Link to="/admin" className="hover:text-lime-400">Admin</Link>
                </div>
            </nav>

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
        </BrowserRouter>
    )
}

export default App
