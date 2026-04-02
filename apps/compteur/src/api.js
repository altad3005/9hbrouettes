const WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`
const API_BASE = '/api'

class AppAPI {
  constructor() {
    this._ws = null
    this._listeners = { teams: [], config: [] }
    this._reconnectTimer = null
    this._cache = { teams: null, config: null }
  }

  connect() {
    if (this._ws && this._ws.readyState < 2) return

    this._ws = new WebSocket(WS_URL)

    this._ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type in this._cache) this._cache[msg.type] = msg.data
      ;(this._listeners[msg.type] || []).forEach((fn) => fn(msg.data))
    }

    this._ws.onclose = () => {
      this._reconnectTimer = setTimeout(() => this.connect(), 2000)
    }

    this._ws.onerror = () => {
      this._ws.close()
    }
  }

  disconnect() {
    clearTimeout(this._reconnectTimer)
    this._ws?.close()
  }

  onTeams(callback) {
    this._listeners.teams.push(callback)
    if (this._cache.teams !== null) callback(this._cache.teams)
    return () => {
      this._listeners.teams = this._listeners.teams.filter((fn) => fn !== callback)
    }
  }

  onConfig(callback) {
    this._listeners.config.push(callback)
    if (this._cache.config !== null) callback(this._cache.config)
    return () => {
      this._listeners.config = this._listeners.config.filter((fn) => fn !== callback)
    }
  }

  async addTeam(id, nom) {
    await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nom }),
    })
  }

  async updateTeamScore(id, tours) {
    await fetch(`${API_BASE}/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tours }),
    })
  }

  async deleteTeam(id) {
    await fetch(`${API_BASE}/teams/${id}`, { method: 'DELETE' })
  }

  async decrementTour(teamId) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/decrement`, { method: 'POST' })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Erreur inconnue')
    }
    return res.json()
  }

  async incrementTour(teamId) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/increment`, { method: 'POST' })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Erreur inconnue')
    }
    return res.json()
  }

  async updateConfig({ endTime, startTime }) {
    await fetch(`${API_BASE}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endTime, startTime }),
    })
  }
}

export const api = new AppAPI()
