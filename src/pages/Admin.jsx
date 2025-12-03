import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import QRCode from "react-qr-code";

export default function Admin() {
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamId, setNewTeamId] = useState("");
    const [raceEndTime, setRaceEndTime] = useState("");
    const [loadingTime, setLoadingTime] = useState(false);
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
                /* CACHER TOUT L'INTERFACE ADMIN */
                .no-print { display: none !important; }
                
                /* CONFIGURATION DE LA PAGE */
                @page { 
                    size: A4; 
                    margin: 0; 
                }
                body { 
                    margin: 0; 
                    padding: 0; 
                    background: white;
                }

                /* AFFICHER LA ZONE D'IMPRESSION */
                .print-only { 
                    display: block !important; 
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background: white;
                    z-index: 9999;
                }

                /* CHAQUE ÉTIQUETTE PREND 100% DE LA HAUTEUR DE PAGE */
                .qr-page {
                    width: 100vw;
                    height: 100vh; /* Force la hauteur totale */
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    page-break-after: always; /* Force le saut de page après */
                    break-after: page;        /* Syntaxe moderne */
                    padding: 2cm;
                    box-sizing: border-box;
                }

                /* Pas de saut de page après le dernier élément pour éviter une page blanche */
                .qr-page:last-child {
                    page-break-after: auto;
                    break-after: auto;
                }
            }
            `}</style>

            {/* --- INTERFACE ADMIN (Cachée à l'impression) --- */}
            <div className="p-6 pb-20 no-print">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 border-b-4 border-lime-400 inline-block">
                        ⚙️ ADMINISTRATION QG
                    </h1>
                    <button
                        onClick={handlePrint}
                        className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 flex items-center gap-2"
                    >
                        🖨️ Imprimer les QR Codes (A4)
                    </button>
                </div>

                {/* --- BLOCS ADMIN --- */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Config Chrono */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
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

                    {/* Ajout Équipe */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                        <h2 className="text-xl font-bold mb-4">Ajouter une équipe</h2>
                        <form onSubmit={handleAddTeam} className="flex gap-4 flex-wrap">
                            <input type="text" placeholder="ID (ex: eq1)" value={newTeamId} onChange={e => setNewTeamId(e.target.value)} className="border-2 border-slate-300 p-2 rounded w-24 font-bold" />
                            <input type="text" placeholder="Nom" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} className="border-2 border-slate-300 p-2 rounded flex-1" />
                            <button type="submit" className="bg-lime-500 text-white px-6 py-2 rounded font-bold uppercase">+</button>
                        </form>
                    </div>
                </div>

                {/* Liste Équipes */}
                <div className="space-y-3">
                    {teams.map(team => (
                        <div key={team.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="bg-slate-100 text-slate-500 font-mono text-xs p-2 rounded">{team.id}</div>
                                <div className="font-bold text-lg">{team.nom}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                {editingTeam === team.id ? (
                                    <div className="flex gap-2">
                                        <input type="number" value={editScoreValue} onChange={(e) => setEditScoreValue(e.target.value)} className="w-20 p-1 border rounded" />
                                        <button onClick={() => saveScore(team.id)} className="bg-green-500 text-white px-2 rounded">OK</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="font-black text-blue-700 text-xl text-right min-w-[3ch]">{team.tours} trs</div>
                                        <button onClick={() => startEditing(team)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100">✏️</button>
                                    </>
                                )}
                                <button onClick={() => handleDelete(team.id, team.nom)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- ZONE D'IMPRESSION (Invisible à l'écran, visible à l'impression) --- */}
            {/* On utilise display:none par défaut, et le CSS @media print le passera en display:block */}
            <div className="print-only hidden">
                {teams.map(team => (
                    <div key={team.id} className="qr-page">

                        {/* CONTENU DE LA PAGE A4 */}
                        <div className="border-8 border-black p-12 w-full h-full flex flex-col items-center justify-center rounded-3xl box-border">

                            <h3 className="text-[5rem] font-black uppercase mb-12 text-center leading-tight">
                                {team.nom}
                            </h3>

                            <div className="bg-white p-4 mb-12">
                                <QRCode
                                    size={350}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={team.id}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>

                            <p className="text-4xl font-mono font-bold text-slate-500 mt-8">ID: {team.id}</p>

                            <div className="mt-auto pt-12 text-center opacity-50">
                                <p className="text-2xl font-bold uppercase tracking-widest">
                                    9H Brouettes - Grand Prix de Villers
                                </p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}