import { useState, useEffect } from 'react'
import { api } from '../api'
import SponsorsBanner from '../components/SponsorsBanner'
import logoImg from '../assets/hero.png'

const Classement = () => {
    const [teams, setTeams] = useState([])
    const [timeLeft, setTimeLeft] = useState("")
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
            if (diff < 0) { setTimeLeft("TERMINÉ"); setIsUrgent(false); return }
            setIsUrgent(diff < 3_600_000)
            const h = Math.floor(diff / 3_600_000)
            const m = Math.floor((diff % 3_600_000) / 60_000)
            const s = Math.floor((diff % 60_000) / 1000)
            setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
        }, 1000)
        return () => clearInterval(timer)
    }, [targetDate])

    return (
        <div className="flex flex-col h-screen bg-cream font-condensed overflow-hidden">

            <header className="shrink-0 bg-navy px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
                <img src={logoImg} alt="Logo 9HB" className="h-10 sm:h-14 w-auto object-contain shrink-0" />

                <div className="text-center flex-1">
                    <p className="text-cream/50 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] mb-0.5">
                        Temps restant
                    </p>
                    <div className={`font-poster tabular-nums leading-none transition-colors text-3xl sm:text-5xl ${
                        isUrgent ? 'text-red-400 animate-pulse' : 'text-cream'
                    }`}>
                        {timeLeft || "--:--:--"}
                    </div>
                </div>

                <img src={logoImg} alt="" className="hidden sm:block h-14 w-auto object-contain shrink-0" aria-hidden />
            </header>

            <SponsorsBanner />

            <div className="shrink-0 bg-cream px-4 sm:px-5 pt-3 pb-1 flex items-baseline gap-3">
                <span className="font-poster text-navy text-xl sm:text-2xl tracking-tight">CLASSEMENT</span>
                <span className="text-navy/40 text-xs sm:text-sm font-bold uppercase tracking-widest">
                    {teams.length} équipes
                </span>
            </div>

            <main className="flex-grow overflow-y-auto px-3 sm:px-4 pb-4 space-y-2">

                {teams[0] && (
                    <div className="bg-navy rounded-xl px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
                        <div className="font-poster text-forest text-4xl sm:text-5xl w-10 sm:w-12 text-right shrink-0">1</div>
                        <div className="flex-grow min-w-0">
                            <div className="font-poster text-cream text-2xl sm:text-3xl uppercase leading-none truncate">
                                {teams[0].nom}
                            </div>
                            <div className="text-cream/30 text-xs font-mono mt-1">#{teams[0].id}</div>
                        </div>
                        <div className="shrink-0 text-right">
                            <div className="font-poster text-forest text-4xl sm:text-5xl tabular-nums leading-none">{teams[0].tours}</div>
                            <div className="text-cream/40 text-[10px] font-condensed uppercase tracking-widest text-center">tours</div>
                        </div>
                    </div>
                )}

                {(teams[1] || teams[2]) && (
                    <div className="grid grid-cols-2 gap-2">
                        {[1, 2].map(i => teams[i] && (
                            <div key={teams[i].id} className="bg-navy/80 rounded-xl px-3 sm:px-4 py-3 flex flex-col">
                                <div className="font-poster text-forest text-xl sm:text-2xl leading-none mb-1">{i + 1}</div>
                                <div className="font-poster text-cream text-lg sm:text-xl uppercase leading-tight truncate flex-grow">
                                    {teams[i].nom}
                                </div>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="font-poster text-cream/90 text-2xl sm:text-3xl tabular-nums">{teams[i].tours}</span>
                                    <span className="text-cream/40 text-[10px] font-condensed uppercase tracking-wider">tours</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {teams.slice(3).map((team, i) => (
                    <div key={team.id} className="bg-white border-2 border-cream-dark rounded-xl px-3 sm:px-4 py-2.5 flex items-center gap-3">
                        <div className="font-poster text-navy/40 text-xl sm:text-2xl w-7 sm:w-8 text-right shrink-0">{i + 4}</div>
                        <div className="flex-grow min-w-0">
                            <div className="font-condensed font-bold text-navy text-base sm:text-lg uppercase leading-none truncate">
                                {team.nom}
                            </div>
                        </div>
                        <div className="shrink-0 font-poster text-navy text-xl sm:text-2xl tabular-nums">
                            {team.tours}
                            <span className="text-navy/30 text-[10px] font-condensed font-bold uppercase tracking-wider ml-1">trs</span>
                        </div>
                    </div>
                ))}

                {teams.length === 0 && (
                    <div className="text-center text-navy/30 font-poster text-lg mt-16 uppercase tracking-widest">
                        En attente des équipes...
                    </div>
                )}
            </main>
        </div>
    )
}

export default Classement
