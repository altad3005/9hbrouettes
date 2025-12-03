import { useState, useEffect } from 'react';
import {collection, onSnapshot, query, orderBy, doc} from 'firebase/firestore';
import SponsorsBanner from '../components/SponsorsBanner';
import { db } from '../firebase';
import logoImg from '../assets/logo.png';

const Classement = () => {
    const [teams, setTeams] = useState([]);
    const [timeLeft, setTimeLeft] = useState("");

    // CHARGEMENT
    useEffect(() => {
        const q = query(collection(db, "teams"), orderBy("tours", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const teamsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTeams(teamsData);
        });
        return () => unsubscribe();
    }, []);

    // NOUVEAU CODE CHRONO DYNAMIQUE
    const [targetDate, setTargetDate] = useState(null);

    // 1. On écoute la configuration dans Firebase
    useEffect(() => {
        // Importe bien 'doc' en haut du fichier avec les autres imports !
        // import { collection, ..., doc } from 'firebase/firestore';
        const unsubConfig = onSnapshot(doc(db, "config", "course"), (docSnap) => {
            if (docSnap.exists() && docSnap.data().endTime) {
                setTargetDate(new Date(docSnap.data().endTime).getTime());
            }
        });
        return () => unsubConfig();
    }, []);

    // 2. Le compte à rebours
    useEffect(() => {
        if (!targetDate) return; // On attend d'avoir la date

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference < 0) {
                setTimeLeft("TERMINE");
            } else {
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                const h = hours < 10 ? `0${hours}` : hours;
                const m = minutes < 10 ? `0${minutes}` : minutes;
                const s = seconds < 10 ? `0${seconds}` : seconds;
                setTimeLeft(`${h}:${m}:${s}`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]); // Important : on relance si la date change

    return (
        <div className="flex flex-col h-screen bg-lime-300 font-sans overflow-hidden">

            {/* --- EN-TÊTE --- */}
            <header className="relative flex items-center justify-center px-4 py-4 bg-lime-300 shadow-lg z-20 shrink-0 h-40">

                {/* 1. LOGO (Gauche) */}
                <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
                    <img
                        src={logoImg}
                        alt="Logo 9HB"
                        className="h-32 w-auto object-contain filter drop-shadow-xl"
                    />
                </div>

                {/* 2. CHRONO (Centre) */}
                {/* J'ai ajouté 'mb-3' ici pour remonter le bloc et le décoller de la bordure du bas */}
                <div className="flex flex-col items-center justify-center bg-blue-800 px-12 py-4 rounded-3xl border-4 border-blue-900 shadow-[0_8px_0_rgb(30,58,138)] mb-3">
                    <p className="text-sm font-black text-lime-300 uppercase tracking-[0.4em] mb-1">Temps Restant</p>
                    <div className="text-7xl font-mono font-black text-white tracking-widest tabular-nums leading-none drop-shadow-md">
                        {timeLeft || "--:--:--"}
                    </div>
                </div>

                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <img
                        src={logoImg}
                        alt="Logo 9HB"
                        className="h-32 w-auto object-contain filter drop-shadow-xl"
                    />
                </div>

            </header>

            {/* Bandeau Sponsors */}
            <SponsorsBanner />

            {/* --- TABLEAU DES SCORES --- */}
            <main className="flex-grow overflow-y-auto p-4 space-y-3 bg-lime-300 scrollbar-hide">

                {teams.map((team, index) => {
                    const isFirst = index === 0;
                    const isPodium = index < 3;

                    // Styles de base
                    let containerClass = "bg-white rounded-xl border-2 border-blue-200 shadow-sm opacity-95";
                    let rankClass = "text-blue-300";
                    let textClass = "text-blue-900";
                    let scoreClass = "text-blue-700";

                    // Styles du Podium
                    if (isFirst) {
                        containerClass = "bg-white rounded-2xl border-4 border-blue-800 shadow-xl shadow-blue-900/20 mb-6 opacity-100";
                        rankClass = "text-blue-800";
                    } else if (isPodium) {
                        containerClass = "bg-white rounded-xl border-2 border-blue-600 shadow-md opacity-100";
                        rankClass = "text-blue-600";
                    }

                    return (
                        <div
                            key={team.id}
                            className={`flex items-center px-4 py-3 ${containerClass} relative overflow-hidden transition-all`}
                        >
                            {isFirst && <div className="absolute top-0 right-0 -mt-3 -mr-3 text-7xl opacity-10 text-blue-900 font-black italic select-none">#1</div>}

                            {/* Rang */}
                            <div className={`h-14 w-14 flex-shrink-0 flex items-center justify-center font-black text-4xl mr-6 ${rankClass}`}>
                                {index + 1}
                            </div>

                            {/* Nom de l'équipe */}
                            <div className="flex-grow flex flex-col justify-center">
                                <h2 className={`font-black leading-none uppercase ${isFirst ? 'text-3xl' : 'text-xl'} ${textClass}`}>
                                    {team.nom}
                                </h2>
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mt-1">
                                    #{team.id}
                                </span>
                            </div>

                            {/* Score */}
                            <div className="text-right px-6 min-w-[120px] bg-blue-50 rounded-xl py-2 mx-2 border border-blue-100">
                                <div className={`font-mono font-black leading-none ${isFirst ? 'text-5xl' : 'text-4xl'} ${scoreClass}`}>
                                    {team.tours}
                                </div>
                                <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest text-center mt-1">
                                    Tours
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
};

export default Classement;