import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import logoImg from './assets/logo.png'
import brouetteImg from './assets/brouette.png'
import './App.css'

// ── Brouette background ────────────────────────────────────────────────────
function BrouetteBg() {
  const items = useRef([])

  if (items.current.length === 0) {
    const cols = 5, rows = 5
    const cw = 100 / cols, ch = 100 / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.current.push({
          left: `${c * cw + Math.random() * (cw - 10)}%`,
          top:  `${r * ch + Math.random() * (ch - 10)}%`,
          transform: `rotate(${Math.random() * 360}deg)`,
        })
      }
    }
  }

  return (
    <div className="brouette-bg">
      {items.current.map((s, i) => (
        <img key={i} src={brouetteImg} style={s} alt="" />
      ))}
    </div>
  )
}

// ── Toast notification ─────────────────────────────────────────────────────
function Toast({ msg, type }) {
  return (
    <div className={`toast ${type} ${msg ? '' : 'hidden'}`}>
      {msg}
    </div>
  )
}

// ── Main app ───────────────────────────────────────────────────────────────
export default function App() {
  const [teams, setTeams]           = useState([])
  const [loading, setLoading]       = useState(false)
  const [toast, setToast]           = useState({ msg: '', type: '' })
  const [teamAction, setTeamAction] = useState('JOIN')
  const [form, setForm]             = useState({
    prenom: '', nom: '', email: '', telephone: '',
    dateNaissance: '', repas: 'normal',
    teamId: '', newTeamName: '',
  })

  useEffect(() => {
    axios.get('/api/teams').then(({ data }) => setTeams(data))
  }, [])

  const notify = (msg, type) => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: '' }), 4000)
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    let createdTeamId = null

    try {
      let equipe = null

      if (teamAction === 'JOIN') {
        if (!form.teamId) throw new Error('Veuillez sélectionner une équipe.')
        const team = teams.find((t) => t.id === form.teamId)
        equipe = team?.nom ?? null
      } else {
        const teamName = form.newTeamName.trim()
        if (!teamName) throw new Error("Veuillez donner un nom à l'équipe.")

        const exists = teams.some(
          (t) => t.nom.toLowerCase() === teamName.toLowerCase()
        )
        if (exists) throw new Error('Cette équipe existe déjà !')

        const { data: newTeam } = await axios.post('/api/teams', {
          id: crypto.randomUUID(),
          nom: teamName,
        })
        createdTeamId = newTeam.id
        equipe = newTeam.nom
      }

      await axios.post('/api/inscriptions', {
        prenom:        form.prenom,
        nom:           form.nom,
        email:         form.email,
        telephone:     form.telephone || null,
        dateNaissance: form.dateNaissance || null,
        repas:         form.repas,
        equipe,
      })

      notify('Inscription réussie !', 'success')
      setTimeout(() => location.reload(), 2000)
    } catch (err) {
      if (createdTeamId) {
        await axios.delete(`/api/teams/${createdTeamId}`).catch(() => {})
      }
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        'Une erreur est survenue.'
      notify(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toast {...toast} />
      <BrouetteBg />

      <div className="container">
        <img className="logo" src={logoImg} alt="logo" />

        <div className="event-card">
          <p><strong>📅 Date :</strong> Samedi 27 Juin 2026</p>
          <p><strong>📍 Lieu :</strong> Rue Croix-Chabot, Villers-le-Bouillet</p>
          <p><strong>👥 Équipe :</strong> 10 à 20 personnes (+12 ans)</p>
          <hr />
          <p><strong>🎟️ Inscription Course : 20€ / pers.</strong></p>
          <p className="small">Inclus : Entrée prairie, pain saucisse (midi) et 4 jetons.</p>
          <hr />
          <p><strong>Au programme :</strong></p>
          <ul className="schedule">
            <li>09h : Ouverture du site</li>
            <li>10h – 19h : Course &amp; Défis</li>
            <li>20h : Résultats</li>
            <li>21h – 02h : Soirée DJ 🪩</li>
          </ul>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Inscription</h2>

          <div className="row">
            <div className="field">
              <label>Prénom</label>
              <input value={form.prenom} onChange={set('prenom')} type="text" required autoComplete="given-name" />
            </div>
            <div className="field">
              <label>Nom</label>
              <input value={form.nom} onChange={set('nom')} type="text" required autoComplete="family-name" />
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <input value={form.email} onChange={set('email')} type="email" required autoComplete="email" />
          </div>

          <div className="field">
            <label>Téléphone</label>
            <input value={form.telephone} onChange={set('telephone')} type="tel" autoComplete="tel" />
          </div>

          <div className="field">
            <label>Date de naissance</label>
            <input value={form.dateNaissance} onChange={set('dateNaissance')} type="date" />
          </div>

          <div className="field">
            <label>Choix du repas</label>
          </div>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" name="repas" value="normal" checked={form.repas === 'normal'} onChange={set('repas')} />
              Pain saucisse Normal
            </label>
            <label className="radio-option">
              <input type="radio" name="repas" value="vege" checked={form.repas === 'vege'} onChange={set('repas')} />
              Pain saucisse Végé
            </label>
          </div>

          <div className="field">
            <label>Équipe</label>
            <select value={teamAction} onChange={(e) => setTeamAction(e.target.value)}>
              <option value="JOIN">Rejoindre une équipe existante</option>
              <option value="CREATE">Créer une nouvelle équipe</option>
            </select>
          </div>

          {teamAction === 'JOIN' ? (
            <div className="field">
              <label>Choisir l'équipe</label>
              <select value={form.teamId} onChange={set('teamId')} required>
                <option value="" disabled>-- Sélectionner --</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.nom}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="field">
              <label>Nom de la nouvelle équipe</label>
              <input value={form.newTeamName} onChange={set('newTeamName')} type="text" required placeholder="Ex: Les Rapides" />
            </div>
          )}

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? 'En cours…' : "S'inscrire"}
          </button>
        </form>
      </div>
    </>
  )
}
