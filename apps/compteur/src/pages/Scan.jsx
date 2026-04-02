import { useEffect, useState, useRef } from "react"
import { api } from "../api.js"
import { Html5QrcodeScanner } from "html5-qrcode"

const Scan = () => {
    const [lastScan, setLastScan] = useState(null)
    const [scanError, setScanError] = useState(null)
    const [manualMode, setManualMode] = useState(false)
    const [teams, setTeams] = useState([])
    const [confirmedTeamId, setConfirmedTeamId] = useState(null)
    const isProcessing = useRef(false)
    const longPressTimer = useRef(null)

    useEffect(() => {
        api.connect()
        const unsubscribe = api.onTeams(setTeams)
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        let scanner = null
        let isMounted = true

        if (!manualMode && !lastScan) {
            setTimeout(() => {
                if (!isMounted || !document.getElementById("reader")) return
                scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 }, false)
                scanner.render(onScanSuccess, () => {})
            }, 100)
        }

        return () => {
            isMounted = false
            if (scanner) scanner.clear().catch(() => {})
        }
    }, [manualMode, lastScan])

    async function onScanSuccess(decodedText) {
        if (isProcessing.current) return
        isProcessing.current = true
        await handleAddTour(decodedText)
    }

    async function handleAddTour(teamId, manual = false) {
        try {
            const { nom } = await api.incrementTour(teamId)
            setScanError(null)

            if (manual) {
                setConfirmedTeamId(teamId)
                setTimeout(() => setConfirmedTeamId(null), 800)
            } else {
                setLastScan(nom)
                setTimeout(() => {
                    setLastScan(null)
                    isProcessing.current = false
                }, 3000)
            }
        } catch (e) {
            setScanError(e.message || "Erreur système")
            setTimeout(() => { isProcessing.current = false }, 1000)
        }
    }

    return (
        <div className="min-h-screen bg-cream font-condensed flex flex-col">

            {lastScan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/95 p-6">
                    <div className="bg-cream rounded-3xl px-8 py-10 text-center shadow-2xl w-full max-w-sm">
                        <div className="text-6xl mb-4">✅</div>
                        <div className="font-poster text-navy text-4xl uppercase leading-tight mb-3">
                            {lastScan}
                        </div>
                        <div className="font-condensed font-bold text-navy text-sm uppercase tracking-widest mt-2">
                            + 1 tour enregistré
                        </div>
                        <div className="text-navy/40 text-xs mt-1 animate-pulse uppercase tracking-wider">
                            3 secondes...
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-navy px-5 py-4 flex items-center justify-between shrink-0">
                <h1 className="font-poster text-cream text-2xl uppercase tracking-tight">
                    Scanner <span className="text-forest">Brouette</span>
                </h1>
                <button
                    onClick={() => setManualMode(!manualMode)}
                    className={`font-condensed font-bold text-sm uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors ${
                        manualMode ? 'bg-cream text-navy' : 'bg-forest text-cream'
                    }`}
                >
                    {manualMode ? '📷 Caméra' : '⌨️ Manuel'}
                </button>
            </div>

            {scanError && (
                <div className="mx-4 mt-4 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wide">
                    ⚠️ {scanError}
                </div>
            )}

            <div className="flex-grow p-4">

                {!manualMode && !lastScan && (
                    <div className="bg-white rounded-2xl border-2 border-cream-dark overflow-hidden shadow-md">
                        <div id="reader" className="w-full" />
                        <p className="text-center text-navy/40 py-3 text-sm font-bold uppercase tracking-widest">
                            Visez le QR Code
                        </p>
                    </div>
                )}

                {teams.length > 0 && (
                    <div className="mt-4">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="font-poster text-navy/40 text-xs uppercase tracking-widest">Classement</span>
                            <span className="text-navy/25 text-[10px] font-condensed">— maintenir −1 pour retirer un tour</span>
                        </div>
                        <div className="space-y-1.5">
                            {[...teams].sort((a, b) => b.tours - a.tours).map((team, i) => (
                                <div key={team.id} className="bg-white border-2 border-cream-dark rounded-xl px-3 py-2 flex items-center gap-3">
                                    <span className="font-poster text-navy/30 text-base w-5 text-right shrink-0">{i + 1}</span>
                                    <span className="font-condensed font-bold text-navy text-sm uppercase flex-grow truncate">{team.nom}</span>
                                    <span className="font-poster text-navy text-lg tabular-nums shrink-0">
                                        {team.tours}
                                        <span className="font-condensed text-[10px] text-navy/30 ml-0.5">trs</span>
                                    </span>
                                    <button
                                        className="shrink-0 w-7 h-7 rounded-lg border border-navy/10 text-navy/20 font-bold text-sm flex items-center justify-center select-none hover:border-red-300 hover:text-red-400 active:bg-red-50 transition-colors"
                                        onPointerDown={() => {
                                            longPressTimer.current = setTimeout(async () => {
                                                try { await api.decrementTour(team.id) } catch {}
                                            }, 600)
                                        }}
                                        onPointerUp={() => clearTimeout(longPressTimer.current)}
                                        onPointerLeave={() => clearTimeout(longPressTimer.current)}
                                        aria-label={`Retirer un tour à ${team.nom}`}
                                    >
                                        −
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {manualMode && (
                    <div className="grid grid-cols-2 gap-3">
                        {teams.map(team => (
                            <button
                                key={team.id}
                                onClick={() => handleAddTour(team.id, true)}
                                className={`border-2 rounded-xl px-4 py-0 min-h-[80px] flex flex-col justify-center text-left active:scale-95 transition-all shadow-sm ${
                                    confirmedTeamId === team.id
                                        ? 'bg-forest border-forest'
                                        : 'bg-white border-cream-dark hover:border-navy'
                                }`}
                            >
                                <div className={`font-poster text-lg sm:text-xl uppercase leading-tight ${
                                    confirmedTeamId === team.id ? 'text-cream' : 'text-navy'
                                }`}>
                                    {team.nom}
                                </div>
                                <div className={`font-condensed font-bold text-sm uppercase tracking-wider mt-1 ${
                                    confirmedTeamId === team.id ? 'text-cream/80' : 'text-forest'
                                }`}>
                                    {confirmedTeamId === team.id ? '✓ Ajouté !' : '+1 tour'}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Scan
