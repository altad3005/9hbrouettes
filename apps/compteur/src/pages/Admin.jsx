import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Admin() {
    const [teams, setTeams] = useState([])
    const [newTeamName, setNewTeamName] = useState('')
    const [newTeamId, setNewTeamId] = useState('')
    const [raceStartTime, setRaceStartTime] = useState('')
    const [raceEndTime, setRaceEndTime] = useState('')
    const [loadingTime, setLoadingTime] = useState(false)
    const [editingTeam, setEditingTeam] = useState(null)
    const [editScoreValue, setEditScoreValue] = useState(0)
    const [toast, setToast] = useState({ msg: '', ok: true })

    useEffect(() => {
        api.connect()
        const unsubTeams = api.onTeams(setTeams)
        const unsubConfig = api.onConfig(config => {
            setRaceStartTime(config.startTime || '')
            setRaceEndTime(config.endTime || '')
        })
        return () => { unsubTeams(); unsubConfig() }
    }, [])

    const notify = (msg, ok = true) => {
        setToast({ msg, ok })
        setTimeout(() => setToast({ msg: '', ok: true }), 3000)
    }

    const handleUpdateTimer = async () => {
        setLoadingTime(true)
        try {
            await api.updateConfig({ endTime: raceEndTime, startTime: raceStartTime })
            notify('Chrono mis à jour !')
        } catch {
            notify('Erreur lors de la mise à jour', false)
        }
        setLoadingTime(false)
    }

    const handleAddTeam = async (e) => {
        e.preventDefault()
        if (!newTeamId || !newTeamName) return
        try {
            await api.addTeam(newTeamId, newTeamName)
            setNewTeamName('')
            setNewTeamId('')
            notify(`Équipe "${newTeamName}" ajoutée`)
        } catch {
            notify('Erreur lors de la création', false)
        }
    }

    const handleDelete = async (teamId, teamName) => {
        if (!confirm(`Supprimer "${teamName}" ?`)) return
        await api.deleteTeam(teamId)
    }

    const saveScore = async (teamId) => {
        await api.updateTeamScore(teamId, parseInt(editScoreValue))
        setEditingTeam(null)
    }

    return (
        <div className="min-h-screen bg-cream font-condensed">

            {/* Toast */}
            {toast.msg && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl font-bold text-base shadow-lg ${
                    toast.ok ? 'bg-forest text-cream' : 'bg-red-500 text-white'
                }`}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="bg-navy sticky top-0 z-10 px-6 py-5">
                <h1 className="font-poster text-cream text-3xl uppercase tracking-tight">
                    Admin <span className="text-forest">9H Brouette</span>
                </h1>
            </div>

            <div className="p-4 sm:p-6 pb-20 space-y-6">

                {/* Chrono + Ajout */}
                <div className="grid sm:grid-cols-2 gap-4">

                    <div className="bg-white rounded-2xl border border-cream-dark p-6 space-y-3">
                        <h2 className="font-poster text-navy text-base uppercase tracking-wide">⏱ Horaires de la course</h2>
                        <div className="flex gap-3 items-center">
                            <span className="text-navy/50 text-sm font-bold uppercase tracking-wide w-14 shrink-0">Début</span>
                            <input
                                type="datetime-local"
                                className="border border-cream-dark rounded-xl p-3 font-mono text-base text-navy bg-cream focus:border-navy focus:outline-none flex-1"
                                value={raceStartTime}
                                onChange={e => setRaceStartTime(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 items-center">
                            <span className="text-navy/50 text-sm font-bold uppercase tracking-wide w-14 shrink-0">Fin</span>
                            <input
                                type="datetime-local"
                                className="border border-cream-dark rounded-xl p-3 font-mono text-base text-navy bg-cream focus:border-navy focus:outline-none flex-1"
                                value={raceEndTime}
                                onChange={e => setRaceEndTime(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleUpdateTimer}
                            disabled={loadingTime}
                            className="w-full bg-navy text-cream font-bold text-base uppercase py-3 rounded-xl hover:bg-navy/80 transition-colors disabled:opacity-40"
                        >
                            {loadingTime ? '…' : 'Enregistrer'}
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-cream-dark p-6">
                        <h2 className="font-poster text-navy text-base uppercase tracking-wide mb-4">+ Nouvelle équipe</h2>
                        <form onSubmit={handleAddTeam} className="flex gap-3">
                            <input
                                type="text"
                                placeholder="ID"
                                value={newTeamId}
                                onChange={e => setNewTeamId(e.target.value)}
                                className="border border-cream-dark rounded-xl p-3 w-24 font-mono text-base font-bold text-navy bg-cream focus:border-navy focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Nom de l'équipe"
                                value={newTeamName}
                                onChange={e => setNewTeamName(e.target.value)}
                                className="border border-cream-dark rounded-xl p-3 flex-1 text-base text-navy bg-cream focus:border-navy focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-forest text-cream font-poster text-2xl px-5 rounded-xl hover:bg-forest/80 transition-colors shrink-0"
                            >
                                +
                            </button>
                        </form>
                    </div>
                </div>

                {/* Liste équipes */}
                <div>
                    <h2 className="font-poster text-navy text-base uppercase tracking-wide mb-4">
                        Équipes <span className="text-navy/30 font-condensed normal-case font-bold text-sm">({teams.length})</span>
                    </h2>
                    <div className="space-y-3">
                        {teams.map(team => (
                            <div key={team.id} className="bg-white border border-cream-dark rounded-2xl px-5 py-4">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-sm text-navy/30 shrink-0 hidden sm:block">{team.id}</span>
                                    <span className="font-condensed font-bold text-navy text-xl uppercase flex-grow truncate">{team.nom}</span>

                                    {editingTeam !== team.id && (
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-poster text-navy text-2xl tabular-nums">
                                                {team.tours}
                                                <span className="text-navy/25 text-xs font-condensed ml-1">trs</span>
                                            </span>
                                            <button
                                                onClick={() => { setEditingTeam(team.id); setEditScoreValue(team.tours) }}
                                                className="text-navy/25 hover:text-navy p-3 rounded-xl hover:bg-cream transition-colors text-xl"
                                            >✏️</button>
                                            <button
                                                onClick={() => handleDelete(team.id, team.nom)}
                                                className="text-red-300 hover:text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors text-xl"
                                            >🗑️</button>
                                        </div>
                                    )}
                                </div>

                                {editingTeam === team.id && (
                                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-cream-dark">
                                        <span className="text-navy/40 text-sm font-bold uppercase tracking-wide">Tours :</span>
                                        <input
                                            type="number"
                                            value={editScoreValue}
                                            onChange={e => setEditScoreValue(e.target.value)}
                                            className="w-24 p-3 border border-navy rounded-xl text-center font-mono font-bold text-navy bg-cream focus:outline-none text-base"
                                            autoFocus
                                        />
                                        <button onClick={() => saveScore(team.id)} className="bg-forest text-cream font-bold text-base px-6 py-3 rounded-xl">Sauver</button>
                                        <button onClick={() => setEditingTeam(null)} className="text-navy/30 hover:text-navy font-bold text-base px-4 py-3">Annuler</button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {teams.length === 0 && (
                            <div className="text-center text-navy/25 font-condensed font-bold uppercase tracking-widest text-base py-12">
                                Aucune équipe
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
