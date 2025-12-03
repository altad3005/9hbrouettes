import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { Html5QrcodeScanner } from "html5-qrcode";

const StaffScan = () => {
    const [lastScan, setLastScan] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [manualMode, setManualMode] = useState(false);
    const [teams, setTeams] = useState([]);

    // Verrou de sécurité
    const isProcessing = useRef(false);

    // 1. Charger les équipes
    useEffect(() => {
        const q = query(collection(db, "teams"), orderBy("nom"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    // 2. GESTION INTELLIGENTE DU SCANNER
    // On relance cet effet quand 'manualMode' OU 'lastScan' change.
    useEffect(() => {
        let scanner = null;
        let isMounted = true;

        // On ne démarre le scanner QUE SI :
        // - Pas de mode manuel
        // - ET Pas de scan en cours (message vert)
        if (!manualMode && !lastScan) {

            // Petit délai pour être sûr que le DOM est prêt
            setTimeout(() => {
                if (!isMounted) return;
                // Vérification de sécurité si l'élément existe bien
                if (!document.getElementById("reader")) return;

                scanner = new Html5QrcodeScanner(
                    "reader",
                    { fps: 10, qrbox: 250, aspectRatio: 1.0 },
                    false
                );

                // On lance le scan
                scanner.render(onScanSuccess, onScanFailure);
            }, 100);
        }

        // NETTOYAGE : Quand le composant change ou qu'un scan réussit, on TUE le scanner
        return () => {
            isMounted = false;
            if (scanner) {
                try {
                    scanner.clear().catch(err => console.log("Nettoyage scanner", err));
                } catch (e) {
                    console.log("Erreur clear", e);
                }
            }
        };
    }, [manualMode, lastScan]);

    async function onScanSuccess(decodedText, decodedResult) {
        // Double sécurité avec le useRef
        if (isProcessing.current) return;
        isProcessing.current = true;

        console.log(`Code scanné = ${decodedText}`);

        // On tente d'ajouter le tour
        await handleAddTour(decodedText);

        // Note : Le scanner va s'éteindre tout seul car 'lastScan' va changer dans handleAddTour
    }

    function onScanFailure(error) {
        // Rien à faire, c'est normal tant qu'il cherche
    }

    async function handleAddTour(teamId) {
        try {
            const teamRef = doc(db, "teams", teamId);
            const docSnap = await getDoc(teamRef);

            if (!docSnap.exists()) {
                setScanError(`Équipe introuvable: ${teamId}`);
                // On déverrouille vite pour réessayer
                setTimeout(() => { isProcessing.current = false; }, 1000);
                return;
            }

            // AJOUT DU TOUR
            await updateDoc(teamRef, { tours: increment(1) });

            // SUCCÈS : Cela va déclencher le useEffect de nettoyage (arrêt caméra)
            setLastScan(`Tour ajouté : ${docSnap.data().nom}`);
            setScanError(null);

            // TIMER DE 3 SECONDES AVANT DE RELANCER
            setTimeout(() => {
                setLastScan(null); // Ceci va relancer le useEffect (redémarrage caméra)
                isProcessing.current = false; // On rouvre le verrou
            }, 3000);

        } catch (e) {
            console.error("Erreur", e);
            setScanError("Erreur système");
            isProcessing.current = false;
        }
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-4 text-blue-900">📷 Scanner Brouette</h1>

            {/* MESSAGE DE SUCCÈS (Gros et visible) */}
            {lastScan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-500/90 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl text-center transform scale-110">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-3xl font-black text-green-700 mb-2">{lastScan}</h2>
                        <p className="text-gray-500 font-bold animate-pulse">Pause de 3 secondes...</p>
                    </div>
                </div>
            )}

            {scanError && (
                <div className="bg-red-500 text-white p-4 rounded-xl text-center font-bold mb-4">
                    ⚠️ {scanError}
                </div>
            )}

            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setManualMode(!manualMode)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded shadow font-bold"
                >
                    {manualMode ? "Activer la Caméra" : "Passer en Mode Manuel"}
                </button>
            </div>

            {/* ZONE CAMÉRA */}
            {!manualMode && !lastScan && (
                <div className="bg-white p-4 rounded-xl shadow-lg overflow-hidden">
                    {/* Le div id="reader" est indispensable pour la librairie */}
                    <div id="reader" className="w-full"></div>
                    <p className="text-center text-gray-500 mt-2 text-sm font-bold">Visez le QR Code</p>
                </div>
            )}

            {/* ZONE MANUELLE */}
            {manualMode && (
                <div className="grid grid-cols-2 gap-4 pb-20">
                    {teams.map(team => (
                        <button
                            key={team.id}
                            onClick={() => handleAddTour(team.id)}
                            className="bg-white p-6 rounded-xl shadow border-b-4 border-blue-500 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            <div className="text-xl font-bold text-gray-800 uppercase">{team.nom}</div>
                            <div className="text-green-600 text-sm font-bold">+1 TOUR</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffScan;