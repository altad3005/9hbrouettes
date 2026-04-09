import { useState, useEffect } from 'react'

const API_BASE = '/api'

export default function Inscriptions() {
    const [inscriptions, setInscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterEquipe, setFilterEquipe] = useState('')

    useEffect(() => {
        fetch(`${API_BASE}/inscriptions`)
            .then(r => r.json())
            .then(data => { setInscriptions(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const equipes = [...new Set(inscriptions.map(i => i.team?.nom).filter(Boolean))].sort()

    const filtered = inscriptions.filter(i => {
        const q = search.toLowerCase()
        const matchSearch = !q ||
            `${i.prenom} ${i.nom}`.toLowerCase().includes(q) ||
            (i.email || '').toLowerCase().includes(q) ||
            (i.team?.nom || '').toLowerCase().includes(q)
        const matchEquipe = !filterEquipe || i.team?.nom === filterEquipe
        return matchSearch && matchEquipe
    })

    const nbRepasNormal = inscriptions.filter(i => i.repas === 'normal').length
    const nbRepasVege = inscriptions.filter(i => i.repas === 'vege').length

    return (
        <div className="min-h-screen bg-cream font-condensed">

            {/* Header */}
            <div className="bg-navy sticky top-0 z-10 px-6 py-5 flex items-center justify-between gap-4">
                <h1 className="font-poster text-cream text-3xl uppercase tracking-tight">
                    Inscrits <span className="text-forest">9H Brouette</span>
                </h1>
                <a
                    href={`${API_BASE}/inscriptions/export`}
                    className="bg-forest text-cream font-bold text-sm uppercase px-4 py-2 rounded-xl hover:bg-forest/80 transition-colors shrink-0"
                >
                    Export Excel
                </a>
            </div>

            <div className="p-4 sm:p-6 pb-20 space-y-4">

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-2xl border border-cream-dark p-4 text-center">
                        <div className="font-poster text-navy text-3xl">{inscriptions.length}</div>
                        <div className="text-navy/50 text-xs font-bold uppercase tracking-wide mt-1">Inscrits</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-cream-dark p-4 text-center">
                        <div className="font-poster text-navy text-3xl">{nbRepasNormal}</div>
                        <div className="text-navy/50 text-xs font-bold uppercase tracking-wide mt-1">Repas normal</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-cream-dark p-4 text-center">
                        <div className="font-poster text-forest text-3xl">{nbRepasVege}</div>
                        <div className="text-navy/50 text-xs font-bold uppercase tracking-wide mt-1">Végé</div>
                    </div>
                </div>

                {/* Filtres */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Rechercher…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border border-cream-dark rounded-xl p-3 flex-1 text-base text-navy bg-white focus:border-navy focus:outline-none"
                    />
                    <select
                        value={filterEquipe}
                        onChange={e => setFilterEquipe(e.target.value)}
                        className="border border-cream-dark rounded-xl p-3 text-base text-navy bg-white focus:border-navy focus:outline-none"
                    >
                        <option value="">Toutes équipes</option>
                        <option value="">— Sans équipe</option>
                        {equipes.map(eq => (
                            <option key={eq} value={eq}>{eq}</option>
                        ))}
                    </select>
                </div>

                {/* Liste */}
                {loading ? (
                    <div className="text-center text-navy/25 font-condensed font-bold uppercase tracking-widest text-base py-12">
                        Chargement…
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map(i => (
                            <div key={i.id} className="bg-white border border-cream-dark rounded-2xl px-5 py-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="font-bold text-navy text-lg uppercase leading-tight truncate">
                                            {i.prenom} {i.nom}
                                        </div>
                                        <div className="text-navy/50 text-sm mt-0.5 truncate">{i.email}</div>
                                        {i.telephone && (
                                            <div className="text-navy/40 text-sm">{i.telephone}</div>
                                        )}
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end gap-1">
                                        {i.team?.nom ? (
                                            <span className="bg-navy/10 text-navy text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                                                {i.team?.nom}
                                            </span>
                                        ) : (
                                            <span className="bg-cream-dark text-navy/30 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                                                Sans équipe
                                            </span>
                                        )}
                                        <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                                            i.repas === 'vege'
                                                ? 'bg-forest/15 text-forest'
                                                : 'bg-navy/5 text-navy/50'
                                        }`}>
                                            {i.repas === 'vege' ? 'Végé' : 'Normal'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="text-center text-navy/25 font-condensed font-bold uppercase tracking-widest text-base py-12">
                                Aucun résultat
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
