import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Classement from './pages/Classement';
import Scan from './pages/Scan';
import Admin from './pages/Admin';
// 1. Import du gardien
import Protected from './components/Protected';

function App() {
    return (
        <BrowserRouter>
            {/* Navbar simplifiée */}
            <nav className="fixed top-0 w-full z-50 flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                <div className="bg-black/80 text-white px-6 py-2 rounded-b-xl flex gap-6 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                    <Link to="/" className="hover:text-lime-400">Public</Link>
                    <Link to="/scan" className="hover:text-lime-400">Scan</Link>
                    <Link to="/admin" className="hover:text-lime-400">Admin</Link>
                </div>
            </nav>

            <div>
                <Routes>
                    {/* PUBLIC : Pas de protection */}
                    <Route path="/" element={<Classement />} />

                    {/* SCAN : Protection "staff" (Code 0000) */}
                    <Route
                        path="/scan"
                        element={
                            <Protected type="staff">
                                <Scan />
                            </Protected>
                        }
                    />

                    {/* ADMIN : Protection "admin" (Code 1234) */}
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
        </BrowserRouter>
    );
}

export default App;