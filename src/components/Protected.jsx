import { useState, useEffect } from "react";

const Protected = ({ children, type = "admin" }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputCode, setInputCode] = useState("");
    const [error, setError] = useState(false);

    // Mots de passe (Tu pourras les changer ici)
    const ADMIN_PASS = "1234";  // Pour toi (Reset, création équipes)
    const STAFF_PASS = "0000";  // Pour les bénévoles (Scan uniquement)

    useEffect(() => {
        // On vérifie si l'utilisateur s'est déjà connecté avant (mémoire du navigateur)
        const storedAuth = localStorage.getItem(`auth_${type}`);
        if (storedAuth === "true") {
            setIsAuthenticated(true);
        }
    }, [type]);

    const handleLogin = (e) => {
        e.preventDefault();

        // Vérification du mot de passe selon le type de page
        let valid = false;
        if (type === "admin" && inputCode === ADMIN_PASS) valid = true;
        if (type === "staff" && (inputCode === STAFF_PASS || inputCode === ADMIN_PASS)) valid = true;

        if (valid) {
            setIsAuthenticated(true);
            localStorage.setItem(`auth_${type}`, "true"); // On se souvient de lui
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

    // SI PAS CONNECTÉ : On affiche le formulaire de login
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

                        {error && <p className="text-red-500 font-bold text-sm">Code incorrect !</p>}

                        <button type="submit" className="bg-lime-400 text-slate-900 font-black py-3 rounded-lg uppercase tracking-wider hover:bg-lime-300 transition-colors">
                            Déverrouiller
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // SI CONNECTÉ : On affiche le contenu protégé + un petit bouton déconnexion discret
    return (
        <>
            {children}
            {/* Bouton de déconnexion flottant en bas à gauche */}
            <button
                onClick={handleLogout}
                className="fixed bottom-2 left-2 opacity-50 hover:opacity-100 text-[10px] bg-red-900 text-white px-2 py-1 rounded z-50"
            >
                🔒 Lock
            </button>
        </>
    );
};

export default Protected;