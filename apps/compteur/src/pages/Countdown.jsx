import { useState, useEffect } from 'react'

const INSCRIPTION_URL = import.meta.env.VITE_INSCRIPTION_URL || 'http://localhost:5173'

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ targetDate }) {
    const [diff, setDiff] = useState(targetDate - Date.now())

    useEffect(() => {
        const t = setInterval(() => setDiff(targetDate - Date.now()), 1000)
        return () => clearInterval(t)
    }, [targetDate])

    const days = Math.floor(diff / 86_400_000)
    const hours = Math.floor((diff % 86_400_000) / 3_600_000)
    const minutes = Math.floor((diff % 3_600_000) / 60_000)

    return (
        <div className="min-h-screen bg-navy font-condensed flex flex-col items-center justify-center px-8 text-center gap-16">

            <p className="text-cream/40 text-sm font-bold uppercase tracking-[0.3em]">
                Avant le début de la course
            </p>

            <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-4">
                    <span className="font-poster text-cream tabular-nums" style={{ fontSize: 'clamp(5rem, 22vw, 14rem)', lineHeight: 1 }}>
                        {days}
                    </span>
                    <span className="text-cream/30 text-sm font-bold uppercase tracking-widest">
                        {days === 1 ? 'jour' : 'jours'}
                    </span>
                </div>
                <span className="font-poster text-cream/20 mb-8" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>:</span>
                <div className="flex flex-col items-center gap-4">
                    <span className="font-poster text-cream tabular-nums" style={{ fontSize: 'clamp(5rem, 22vw, 14rem)', lineHeight: 1 }}>
                        {pad(hours)}
                    </span>
                    <span className="text-cream/30 text-sm font-bold uppercase tracking-widest">
                        {hours === 1 ? 'heure' : 'heures'}
                    </span>
                </div>
                <span className="font-poster text-cream/20 mb-8" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>:</span>
                <div className="flex flex-col items-center gap-4">
                    <span className="font-poster text-cream tabular-nums" style={{ fontSize: 'clamp(5rem, 22vw, 14rem)', lineHeight: 1 }}>
                        {pad(minutes)}
                    </span>
                    <span className="text-cream/30 text-sm font-bold uppercase tracking-widest">minutes</span>
                </div>
            </div>

            <a
                href={INSCRIPTION_URL}
                className="bg-forest text-cream font-poster text-3xl uppercase px-14 py-6 rounded-2xl hover:bg-forest/80 transition-colors"
            >
                S'inscrire
            </a>
        </div>
    )
}
