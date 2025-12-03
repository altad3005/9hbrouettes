import { useState, useEffect } from "react";

const Protected = ({ children, type = "admin" }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputCode, setInputCode] = useState("");
    const [error, setError] = useState(false);

    // --- CONFIGURATION DES MOTS DE PASSE ---
    const ADMIN_PASS = "1234";  // Accès total (Admin + Scan)
    const STAFF_PASS = "0000";  // Accès Scan uniquement

    // C'est ici que la correction a lieu 👇
    useEffect(() => {
        // On réinitialise les erreurs quand on change de page
        setError(false);
        setInputCode("");

        const storedAuth = localStorage.getItem(`auth_${type}`);

        if (storedAuth === "true") {
            setIsAuthenticated(true);
        } else {
            // IMPORTANT : Si pas de cookie, on force le verrouillage !
            setIsAuthenticated(false);
        }
    }, [type]); // Ce code s'exécute à chaque fois que 'type' change

    const handleLogin = (e) => {
        e.preventDefault();

        let isValid = false;

        // --- LOGIQUE DE SÉCURITÉ ---
        if (type === "admin") {
            // Pour l'admin, SEUL le code admin marche
            if (inputCode === ADMIN_PASS) isValid = true;
        }
        else if (type === "staff") {
            // Pour le staff, le code staff OU admin marche
            if (inputCode === STAFF_PASS || inputCode === ADMIN_PASS) isValid = true;
        }

        if (isValid) {
            setIsAuthenticated(true);
            localStorage.setItem(`auth_${type}`, "true");
            setError(false);
        } else {
            setError(true);
            setInputCode("");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem(`auth_${type}`);
    };

    // AFFICHAGE FORMULAIRE
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
                <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 w-full max-w-sm text-center">
                    <h1 className="text-2xl font-black uppercase text-lime-400 mb-6 tracking-widest">
                        ACCÈS {type === "admin" ? "QG" : "STAFF"}
                    </h1>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="password"
                            placeholder="Code d'accès"
                            className="p-3 rounded-lg bg-slate-700 border-2 border-slate-600 text-center text-xl font-bold tracking-widest text-white focus:border-lime-400 focus:outline-none placeholder-slate-500"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            autoFocus
                        />

                        {error && <p className="text-red-500 font-bold text-sm animate-pulse">Code incorrect !</p>}

                        <button type="submit" className="bg-lime-400 text-slate-900 font-black py-3 rounded-lg uppercase tracking-wider hover:bg-lime-300 transition-colors">
                            Déverrouiller
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
            <button
                onClick={handleLogout}
                className="fixed bottom-2 left-2 opacity-30 hover:opacity-100 text-[10px] bg-red-900 text-white px-2 py-1 rounded z-50 transition-opacity"
            >
                🔒 Lock
            </button>
        </>
    );
};

export default Protected;