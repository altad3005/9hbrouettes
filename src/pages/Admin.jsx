import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import QRCode from "react-qr-code";

export default function Admin() {
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamId, setNewTeamId] = useState("");

    // Pour le chrono
    const [raceEndTime, setRaceEndTime] = useState("");
    const [loadingTime, setLoadingTime] = useState(false);

    // Pour l'édition rapide
    const [editingTeam, setEditingTeam] = useState(null);
    const [editScoreValue, setEditScoreValue] = useState(0);

    // CHARGER LES DONNÉES
    useEffect(() => {
        const q = query(collection(db, "teams"), orderBy("nom"));
        const unsubTeams = onSnapshot(q, (snapshot) => {
            setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubConfig = onSnapshot(doc(db, "config", "course"), (docSnap) => {
            if (docSnap.exists()) {
                setRaceEndTime(docSnap.data().endTime || "");
            }
        });

        return () => { unsubTeams(); unsubConfig(); };
    }, []);

    // UPDATE CHRONO
    const handleUpdateTimer = async () => {
        setLoadingTime(true);
        try {
            await setDoc(doc(db, "config", "course"), { endTime: raceEndTime });
            alert("✅ Chrono mis à jour !");
        } catch (e) { alert("Erreur"); }
        setLoadingTime(false);
    };

    // ADD TEAM
    const handleAddTeam = async (e) => {
        e.preventDefault();
        if (!newTeamId || !newTeamName) return;
        try {
            await setDoc(doc(db, "teams", newTeamId), { nom: newTeamName, tours: 0 });
            setNewTeamName("");
            setNewTeamId("");
        } catch (error) { alert("Erreur création"); }
    };

    // DELETE TEAM
    const handleDelete = async (teamId, teamName) => {
        if (confirm(`Supprimer "${teamName}" ?`)) {
            await deleteDoc(doc(db, "teams", teamId));
        }
    };

    // EDIT SCORE
    const startEditing = (team) => {
        setEditingTeam(team.id);
        setEditScoreValue(team.tours);
    };
    const saveScore = async (teamId) => {
        await updateDoc(doc(db, "teams", teamId), { tours: parseInt(editScoreValue) });
        setEditingTeam(null);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

            <style>{`
            @media print {
                .no-print { display: none !important; }
                .print-only { 
                position: relative !important; 
                opacity: 1 !important; 
                z-index: 10 !important;
                display: grid !important;
                overflow: visible !important;
                }
                body { background: white; }
                @page { margin: 0.5cm; }
            }
            `}</style>

            <div className="p-6 pb-20 no-print">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 border-b-4 border-lime-400 inline-block">
                        ⚙️ ADMINISTRATION QG
                    </h1>
                    <button
                        onClick={handlePrint}
                        className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 flex items-center gap-2"
                    >
                        🖨️ Imprimer les QR Codes
                    </button>
                </div>

                {/* BLOC CONFIG CHRONO */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-slate-200">
                    <h2 className="text-xl font-bold mb-4">⏱️ Config Chrono</h2>
                    <div className="flex gap-4 items-end flex-wrap">
                        <input
                            type="datetime-local"
                            className="border-2 border-slate-300 rounded p-2 font-mono"
                            value={raceEndTime}
                            onChange={(e) => setRaceEndTime(e.target.value)}
                        />
                        <button onClick={handleUpdateTimer} disabled={loadingTime} className="bg-blue-700 text-white font-bold py-2 px-6 rounded hover:bg-blue-800">
                            {loadingTime ? "..." : "Mettre à jour"}
                        </button>
                    </div>
                </div>

                {/* BLOC AJOUT ÉQUIPE */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-slate-200">
                    <h2 className="text-xl font-bold mb-4">Ajouter une équipe</h2>
                    <form onSubmit={handleAddTeam} className="flex gap-4 flex-wrap">
                        <input type="text" placeholder="ID (ex: eq1)" value={newTeamId} onChange={e => setNewTeamId(e.target.value)} className="border-2 border-slate-300 p-2 rounded w-32 font-bold" />
                        <input type="text" placeholder="Nom" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} className="border-2 border-slate-300 p-2 rounded flex-1" />
                        <button type="submit" className="bg-lime-500 text-white px-6 py-2 rounded font-bold uppercase">+ Créer</button>
                    </form>
                </div>

                {/* LISTE ÉQUIPES */}
                <div className="space-y-3">
                    {teams.map(team => (
                        <div key={team.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center gap-4">

                            {/* Partie Gauche : Infos */}
                            <div className="flex items-center gap-4 flex-1">
                                <div className="bg-slate-100 text-slate-500 font-mono text-xs p-2 rounded">{team.id}</div>
                                <div className="font-bold text-lg">{team.nom}</div>
                            </div>

                            {/* Partie Droite : Score et Actions */}
                            <div className="flex items-center gap-4">
                                {editingTeam === team.id ? (
                                    // MODE ÉDITION (Input + OK)
                                    <div className="flex items-center gap-2 bg-blue-50 p-1 rounded border border-blue-200">
                                        <input
                                            type="number"
                                            value={editScoreValue}
                                            onChange={(e) => setEditScoreValue(e.target.value)}
                                            className="w-20 p-1 text-center font-bold border rounded"
                                        />
                                        <button onClick={() => saveScore(team.id)} className="bg-green-500 text-white px-2 py-1 rounded font-bold text-sm hover:bg-green-600">OK</button>
                                        <button onClick={() => setEditingTeam(null)} className="text-red-500 px-2 font-bold hover:bg-red-50 rounded">X</button>
                                    </div>
                                ) : (
                                    // MODE AFFICHAGE (Texte + Crayon)
                                    <>
                                        <div className="font-black text-blue-700 text-xl text-right min-w-[3ch]">{team.tours} trs</div>
                                        <button
                                            onClick={() => startEditing(team)}
                                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100"
                                            title="Modifier manuellement"
                                        >
                                            ✏️
                                        </button>
                                    </>
                                )}

                                {/* Bouton Supprimer */}
                                <div className="border-l pl-4 ml-2">
                                    <button
                                        onClick={() => handleDelete(team.id, team.nom)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                                        title="Supprimer l'équipe"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- ZONE D'IMPRESSION --- */}
            <div className="print-only fixed top-0 left-0 w-full h-full -z-50 opacity-0 pointer-events-none p-8 bg-white overflow-hidden">
                <h2 className="text-2xl font-bold mb-6 text-center w-full no-print">Aperçu des étiquettes</h2>

                <div className="grid grid-cols-2 gap-8 w-full">
                    {teams.map(team => (
                        <div key={team.id} className="border-4 border-black p-6 flex flex-col items-center justify-center text-center page-break-inside-avoid rounded-xl">
                            <h3 className="text-3xl font-black uppercase mb-4">{team.nom}</h3>

                            {/* COMPOSANT QR CODE LOCAL */}
                            <div className="bg-white p-2">
                                <QRCode
                                    size={200}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={team.id}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>

                            <p className="text-xl font-mono font-bold text-slate-500 mt-4">ID: {team.id}</p>
                            <p className="text-sm mt-2 text-slate-400">9H Brouettes - Grand Prix de Villers</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}