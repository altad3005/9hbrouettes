import { useEffect, useState, useRef } from 'react'
import { api } from '../api.js'

const Scan = () => {
    const [teams, setTeams] = useState([])
    const [confirmedTeamId, setConfirmedTeamId] = useState(null)
    const [scanError, setScanError] = useState(null)
    const longPressTimer = useRef(null)

    useEffect(() => {
        api.connect()
        const unsubscribe = api.onTeams(setTeams)
        return () => unsubscribe()
    }, [])

    async function handleAddTour(teamId) {
        try {
            await api.incrementTour(teamId)
            setScanError(null)
            setConfirmedTeamId(teamId)
            setTimeout(() => setConfirmedTeamId(null), 800)
        } catch (e) {
            setScanError(e.message || 'Erreur système')
        }
    }

    return (
        <div className="min-h-screen bg-cream font-condensed flex flex-col">

            {/* Header */}
            <div className="bg-navy px-6 py-5 shrink-0">
                <h1 className="font-poster text-cream text-3xl uppercase tracking-tight">
                    Encodage <span className="text-forest">Brouette</span>
                </h1>
            </div>

            {/* Erreur */}
            {scanError && (
                <div className="mx-4 mt-4 bg-red-50 border border-red-300 text-red-600 px-5 py-4 rounded-2xl text-base font-bold uppercase tracking-wide">
                    ⚠️ {scanError}
                </div>
            )}

            <div className="flex-grow p-4 space-y-5">

                {/* Grille manuelle */}
                <div className="grid grid-cols-2 gap-4">
                    {teams.map(team => (
                        <button
                            key={team.id}
                            onClick={() => handleAddTour(team.id)}
                            className={`border-2 rounded-2xl px-5 py-8 flex flex-col justify-center text-left active:scale-95 transition-all ${
                                confirmedTeamId === team.id
                                    ? 'bg-forest border-forest'
                                    : 'bg-white border-cream-dark hover:border-navy/40'
                            }`}
                        >
                            <div className={`font-poster text-3xl uppercase leading-tight ${
                                confirmedTeamId === team.id ? 'text-cream' : 'text-navy'
                            }`}>
                                {team.nom}
                            </div>
                            <div className={`font-bold text-base uppercase tracking-wider mt-2 ${
                                confirmedTeamId === team.id ? 'text-cream/70' : 'text-forest'
                            }`}>
                                {confirmedTeamId === team.id ? '✓ Ajouté !' : '+1 tour'}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Mini classement */}
                {teams.length > 0 && (
                    <div>
                        <p className="text-navy/40 text-xs font-bold uppercase tracking-widest mb-3">
                            Classement — maintenir − pour retirer un tour
                        </p>
                        <div className="space-y-2">
                            {[...teams].sort((a, b) => b.tours - a.tours).map((team, i) => (
                                <div key={team.id} className="bg-white border border-cream-dark rounded-xl px-4 py-4 flex items-center gap-3">
                                    <span className="font-poster text-navy/30 text-xl w-6 text-right shrink-0">{i + 1}</span>
                                    <span className="font-bold text-navy text-xl uppercase flex-grow truncate">{team.nom}</span>
                                    <span className="font-poster text-navy text-2xl tabular-nums shrink-0">
                                        {team.tours}
                                        <span className="text-navy/25 text-xs font-condensed ml-1">trs</span>
                                    </span>
                                    <button
                                        className="shrink-0 w-10 h-10 rounded-xl border border-navy/10 text-navy/30 font-bold text-xl flex items-center justify-center select-none hover:border-red-300 hover:text-red-400 transition-colors"
                                        onPointerDown={() => {
                                            longPressTimer.current = setTimeout(async () => {
                                                try { await api.decrementTour(team.id) } catch {}
                                            }, 600)
                                        }}
                                        onPointerUp={() => clearTimeout(longPressTimer.current)}
                                        onPointerLeave={() => clearTimeout(longPressTimer.current)}
                                        aria-label={`Retirer un tour à ${team.nom}`}
                                    >−</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {teams.length === 0 && (
                    <div className="text-center text-navy/25 font-poster text-xl mt-20 uppercase tracking-widest">
                        En attente des équipes…
                    </div>
                )}
            </div>
        </div>
    )
}

export default Scan
