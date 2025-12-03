import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { Html5QrcodeScanner } from "html5-qrcode";

const StaffScan = () => {
    const [lastScan, setLastScan] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [manualMode, setManualMode] = useState(false);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "teams"), orderBy("nom"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let scanner = null;
        if (!manualMode) {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: 250 },
                false
            );
            scanner.render(onScanSuccess, onScanFailure);
        }
        return () => {
            if (scanner) {
                scanner.clear().catch(error => console.error("Failed to clear html5-qrcode scanner. ", error));
            }
        };
    }, [manualMode]);

    async function onScanSuccess(decodedText, decodedResult) {
        console.log(`Code scanné = ${decodedText}`, decodedResult);
        await handleAddTour(decodedText);
    }

    function onScanFailure(error) {
        console.warn(`Code scan error = ${error}`);
    }

    async function handleAddTour(teamId) {
        try {
            const teamRef = doc(db, "teams", teamId);
            const docSnap = await getDoc(teamRef);

            if (!docSnap.exists()) {
                setScanError(`L'équipe "${teamId}" n'existe pas !`);
                return;
            }

            await updateDoc(teamRef, {
                tours: increment(1)
            });

            setLastScan(`Tour ajouté pour : ${docSnap.data().nom} !`);
            setScanError(null);
            setTimeout(() => setLastScan(null), 3000);

        } catch (e) {
            console.error("Erreur", e);
            setScanError("Erreur lors de l'ajout du tour.");
        }
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-4 text-blue-900">📷 Scanner Brouette</h1>

            {lastScan && (
                <div className="bg-green-500 text-white p-4 rounded-xl text-center text-xl font-bold mb-4 animate-bounce">
                    ✅ {lastScan}
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
                    className="px-4 py-2 bg-indigo-600 text-white rounded shadow"
                >
                    {manualMode ? "Activer la Caméra" : "Passer en Mode Manuel"}
                </button>
            </div>

            {!manualMode && (
                <div className="bg-white p-4 rounded-xl shadow-lg">
                    <div id="reader" width="100%"></div>
                    <p className="text-center text-gray-500 mt-2 text-sm">Visez le QR Code de la brouette</p>
                </div>
            )}

            {manualMode && (
                <div className="grid grid-cols-2 gap-4">
                    {teams.map(team => (
                        <button
                            key={team.id}
                            onClick={() => handleAddTour(team.id)}
                            className="bg-white p-6 rounded-xl shadow border-b-4 border-blue-500 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            <div className="text-xl font-bold text-gray-800">{team.nom}</div>
                            <div className="text-gray-500 text-sm">Ajouter +1 tour</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffScan;