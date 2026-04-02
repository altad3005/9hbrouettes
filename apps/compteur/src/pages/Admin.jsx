import { useState, useEffect } from "react";
import { api } from "../api";
import QRCode from "react-qr-code";

export default function Admin() {
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamId, setNewTeamId] = useState("");
    const [raceEndTime, setRaceEndTime] = useState("");
    const [loadingTime, setLoadingTime] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [editScoreValue, setEditScoreValue] = useState(0);

    useEffect(() => {
        api.connect();
        const unsubTeams = api.onTeams(setTeams);
        const unsubConfig = api.onConfig((config) => setRaceEndTime(config.endTime || ""));
        return () => { unsubTeams(); unsubConfig(); };
    }, []);

    const handleUpdateTimer = async () => {
        setLoadingTime(true);
        try {
            await api.updateConfig(raceEndTime);
            alert("✅ Chrono mis à jour !");
        } catch { alert("Erreur"); }
        setLoadingTime(false);
    };

    const handleAddTeam = async (e) => {
        e.preventDefault();
        if (!newTeamId || !newTeamName) return;
        try {
            await api.addTeam(newTeamId, newTeamName);
            setNewTeamName(""); setNewTeamId("");
        } catch { alert("Erreur création"); }
    };

    const handleDelete = async (teamId, teamName) => {
        if (confirm(`Supprimer "${teamName}" ?`)) await api.deleteTeam(teamId);
    };

    const saveScore = async (teamId) => {
        await api.updateTeamScore(teamId, parseInt(editScoreValue));
        setEditingTeam(null);
    };

    return (
        <div className="min-h-screen bg-cream font-condensed">

            <style>{`
            @media print {
                .no-print { display: none !important; }
                @page { size: A4; margin: 0; }
                body { margin: 0; padding: 0; background: white; }
                .print-only {
                    display: block !important;
                    position: absolute; top: 0; left: 0;
                    width: 100%; background: white; z-index: 9999;
                }
                .qr-page {
                    width: 100vw; height: 100vh;
                    display: flex; flex-direction: column;
                    justify-content: center; align-items: center;
                    page-break-after: always; break-after: page;
                    padding: 2cm; box-sizing: border-box;
                }
                .qr-page:last-child { page-break-after: auto; break-after: auto; }
            }
            `}</style>

            <div className="bg-navy no-print sticky top-0 z-10">
                <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
                    <h1 className="font-poster text-cream text-xl sm:text-2xl uppercase tracking-tight">
                        Admin <span className="text-forest">9H Brouette</span>
                    </h1>
                    <button
                        onClick={() => window.print()}
                        className="bg-cream text-navy font-condensed font-bold text-xs sm:text-sm uppercase tracking-wider px-3 sm:px-4 py-2 rounded-lg hover:bg-cream-dark transition-colors"
                    >
                        🖨️ <span className="hidden xs:inline">Imprimer </span>QR
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-6 pb-20 no-print space-y-4 sm:space-y-6">

                <div className="grid md:grid-cols-2 gap-4">

                    <div className="bg-white rounded-2xl border-2 border-cream-dark p-4 sm:p-5">
                        <h2 className="font-poster text-navy text-base sm:text-lg uppercase mb-3">⏱ Heure de fin</h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="datetime-local"
                                className="border-2 border-cream-dark rounded-lg p-2.5 font-mono text-navy bg-cream focus:border-navy focus:outline-none w-full"
                                value={raceEndTime}
                                onChange={(e) => setRaceEndTime(e.target.value)}
                            />
                            <button
                                onClick={handleUpdateTimer}
                                disabled={loadingTime}
                                className="bg-navy text-cream font-condensed font-bold uppercase tracking-wide py-2.5 px-5 rounded-lg hover:bg-navy/80 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                                {loadingTime ? "..." : "Mettre à jour"}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border-2 border-cream-dark p-4 sm:p-5">
                        <h2 className="font-poster text-navy text-base sm:text-lg uppercase mb-3">+ Ajouter une équipe</h2>
                        <form onSubmit={handleAddTeam} className="flex gap-2 flex-wrap">
                            <input
                                type="text"
                                placeholder="ID (ex: eq1)"
                                value={newTeamId}
                                onChange={e => setNewTeamId(e.target.value)}
                                className="border-2 border-cream-dark rounded-lg p-2.5 w-24 font-mono font-bold text-navy bg-cream focus:border-navy focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Nom de l'équipe"
                                value={newTeamName}
                                onChange={e => setNewTeamName(e.target.value)}
                                className="border-2 border-cream-dark rounded-lg p-2.5 flex-1 min-w-[120px] font-condensed text-navy bg-cream focus:border-navy focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-forest text-cream font-poster text-xl px-5 rounded-lg hover:bg-forest/80 transition-colors"
                            >
                                +
                            </button>
                        </form>
                    </div>
                </div>

                <div>
                    <h2 className="font-poster text-navy text-base sm:text-lg uppercase mb-3">
                        Équipes{' '}
                        <span className="text-navy/30 font-condensed font-bold text-sm normal-case">({teams.length})</span>
                    </h2>
                    <div className="space-y-2">
                        {teams.map(team => (
                            <div key={team.id} className="bg-white border-2 border-cream-dark rounded-xl px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="font-mono text-xs bg-cream text-navy/50 px-2 py-1 rounded-lg shrink-0 border border-cream-dark hidden sm:block">
                                        {team.id}
                                    </div>
                                    <div className="font-condensed font-bold text-navy text-base sm:text-lg flex-grow uppercase truncate">
                                        {team.nom}
                                    </div>

                                    {editingTeam !== team.id && (
                                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                            <div className="font-poster text-navy text-lg sm:text-xl tabular-nums min-w-[2.5ch] text-right">
                                                {team.tours}
                                                <span className="font-condensed font-bold text-[10px] text-navy/30 ml-0.5 normal-case">trs</span>
                                            </div>
                                            <button
                                                onClick={() => { setEditingTeam(team.id); setEditScoreValue(team.tours); }}
                                                className="text-navy/30 hover:text-navy p-1.5 rounded-lg hover:bg-cream transition-colors"
                                            >✏️</button>
                                            <button
                                                onClick={() => handleDelete(team.id, team.nom)}
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                            >🗑️</button>
                                        </div>
                                    )}
                                </div>

                                {editingTeam === team.id && (
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t-2 border-cream-dark">
                                        <span className="text-navy/50 text-sm font-bold uppercase tracking-wide">Score :</span>
                                        <input
                                            type="number"
                                            value={editScoreValue}
                                            onChange={e => setEditScoreValue(e.target.value)}
                                            className="w-20 p-2 border-2 border-navy rounded-lg text-center font-mono font-bold text-navy bg-cream focus:outline-none"
                                            autoFocus
                                        />
                                        <button onClick={() => saveScore(team.id)} className="bg-forest text-cream font-bold text-sm px-4 py-2 rounded-lg">OK</button>
                                        <button onClick={() => setEditingTeam(null)} className="text-navy/40 hover:text-navy font-bold text-sm px-3 py-2">Annuler</button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {teams.length === 0 && (
                            <div className="text-center text-navy/30 font-condensed font-bold uppercase tracking-widest text-sm py-8">
                                Aucune équipe
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="print-only hidden">
                {teams.map(team => (
                    <div key={team.id} className="qr-page">
                        <div className="border-8 border-black p-12 w-full h-full flex flex-col items-center justify-center rounded-3xl box-border">
                            <h3 className="text-[5rem] font-black uppercase mb-12 text-center leading-tight">{team.nom}</h3>
                            <div className="bg-white p-4 mb-12">
                                <QRCode size={350} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={team.id} viewBox="0 0 256 256" />
                            </div>
                            <p className="text-4xl font-mono font-bold text-slate-500 mt-8">ID: {team.id}</p>
                            <div className="mt-auto pt-12 text-center opacity-50">
                                <p className="text-2xl font-bold uppercase tracking-widest">9H Brouettes - Grand Prix de Villers</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
