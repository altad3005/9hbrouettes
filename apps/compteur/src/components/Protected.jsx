import { useState } from 'react'

const CODES = {
  staff: import.meta.env.VITE_STAFF_CODE,
  admin: import.meta.env.VITE_ADMIN_CODE,
}

export default function Protected({ type, children }) {
  const key = `auth_${type}`
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(key) === 'true')
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return children

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code === CODES[type]) {
      sessionStorage.setItem(key, 'true')
      setUnlocked(true)
    } else {
      setError(true)
      setCode('')
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 font-condensed">
      <div className="bg-white border-2 border-cream-dark rounded-2xl p-8 w-full max-w-xs text-center shadow-lg">
        <div className="font-poster text-navy text-2xl uppercase mb-6">
          {type === 'admin' ? '🔒 Admin' : '🔑 Staff'}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code"
            className={`w-full p-3 text-center text-2xl font-mono border-2 rounded-xl mb-4 bg-cream focus:outline-none transition-colors ${
              error
                ? 'border-red-400 text-red-400 animate-pulse'
                : 'border-cream-dark focus:border-navy text-navy'
            }`}
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-navy text-cream font-poster font-bold uppercase text-lg py-3 rounded-xl hover:bg-navy/80 transition-colors"
          >
            Entrer
          </button>
        </form>
      </div>
    </div>
  )
}
