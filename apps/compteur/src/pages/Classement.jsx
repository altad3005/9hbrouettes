import { useState, useEffect } from 'react'
import { api } from '../api'
import SponsorsBanner from '../components/SponsorsBanner'

const medals = ['🥇', '🥈', '🥉']

const Classement = () => {
    const [teams, setTeams] = useState([])
    const [timeLeft, setTimeLeft] = useState('')
    const [targetDate, setTargetDate] = useState(null)
    const [isUrgent, setIsUrgent] = useState(false)

    useEffect(() => {
        api.connect()
        const unsubTeams = api.onTeams(data =>
            setTeams([...data].sort((a, b) => b.tours - a.tours))
        )
        const unsubConfig = api.onConfig(config => {
            if (config.endTime) setTargetDate(new Date(config.endTime).getTime())
        })
        return () => { unsubTeams(); unsubConfig() }
    }, [])

    useEffect(() => {
        if (!targetDate) return
        const timer = setInterval(() => {
            const diff = targetDate - Date.now()
            if (diff < 0) { setTimeLeft('TERMINÉ'); setIsUrgent(false); return }
            setIsUrgent(diff < 3_600_000)
            const h = Math.floor(diff / 3_600_000)
            const m = Math.floor((diff % 3_600_000) / 60_000)
            const s = Math.floor((diff % 60_000) / 1000)
            setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
        }, 1000)
        return () => clearInterval(timer)
    }, [targetDate])

    return (
        <div className="flex flex-col h-screen bg-cream font-condensed overflow-hidden">

            {/* Header */}
            <header className="shrink-0 bg-navy px-5 py-3 text-center">
                <p className="text-cream/40 text-[9px] font-bold uppercase tracking-[0.35em] mb-0.5">
                    Temps restant
                </p>
                <div className={`font-poster tabular-nums leading-none text-4xl sm:text-5xl transition-colors ${
                    isUrgent ? 'text-red-400 animate-pulse' : 'text-cream'
                }`}>
                    {timeLeft || '--:--:--'}
                </div>
            </header>

            <SponsorsBanner />

            {/* Titre section */}
            <div className="shrink-0 px-4 pt-3 pb-2 flex items-baseline gap-2">
                <span className="font-poster text-navy text-xl tracking-tight uppercase">Classement</span>
                <span className="text-navy/30 text-xs font-bold uppercase tracking-widest">{teams.length} équipes</span>
            </div>

            {/* Liste */}
            <main className="flex-grow overflow-y-auto px-3 pb-4 space-y-4">

                {/* Top 3 */}
                {teams.slice(0, 3).map((team, i) => (
                    <div key={team.id} style={{ paddingLeft: '1.25rem', paddingRight: '2rem' }} className={`rounded-2xl py-6 flex items-center gap-4 ${
                        i === 0 ? 'bg-navy' : 'bg-navy/60'
                    }`}>
                        <span className="text-4xl shrink-0 w-10 text-center">{medals[i]}</span>
                        <div className="flex-grow min-w-0">
                            <div className={`font-poster uppercase leading-tight truncate ${
                                i === 0 ? 'text-cream text-4xl sm:text-5xl' : 'text-cream/90 text-3xl sm:text-4xl'
                            }`}>
                                {team.nom}
                            </div>
                        </div>
                        <div className="shrink-0 text-right">
                            <div className={`font-poster tabular-nums leading-none ${
                                i === 0 ? 'text-forest text-5xl sm:text-6xl' : 'text-cream/80 text-4xl sm:text-5xl'
                            }`}>
                                {team.tours}
                            </div>
                            <div className="text-cream/30 text-[10px] uppercase tracking-widest mt-1">tours</div>
                        </div>
                    </div>
                ))}

                {/* Reste */}
                {teams.slice(3).map((team, i) => (
                    <div key={team.id} className="bg-white border border-cream-dark rounded-xl px-5 py-5 flex items-center gap-4">
                        <span className="font-poster text-navy/30 text-2xl w-8 text-right shrink-0">{i + 4}</span>
                        <span className="font-condensed font-bold text-navy text-xl uppercase flex-grow truncate">
                            {team.nom}
                        </span>
                        <span className="font-poster text-navy text-3xl tabular-nums shrink-0">
                            {team.tours}
                            <span className="text-navy/25 text-xs font-condensed ml-1">trs</span>
                        </span>
                    </div>
                ))}

                {teams.length === 0 && (
                    <div className="text-center text-navy/25 font-poster text-base mt-20 uppercase tracking-widest">
                        En attente des équipes…
                    </div>
                )}
            </main>
        </div>
    )
}

export default Classement
