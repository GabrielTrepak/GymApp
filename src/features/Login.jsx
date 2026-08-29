import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Cliente')
  const { loginMock } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    loginMock(email || 'usuario@teste.com', role)
    navigate(role === 'Personal' ? '/personal' : '/app')
  }

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <span style={styles.eyebrow}>Acompanhamento de treino</span>
        <h1 style={styles.title}>Entrar</h1>

        <label style={styles.label}>
          E-mail
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
          />
        </label>

        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Entrar como</legend>
          <div style={styles.roleRow}>
            {['Cliente', 'Personal'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  ...styles.roleBtn,
                  ...(role === r ? styles.roleBtnActive : {}),
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" style={styles.submit}>Entrar</button>
      </form>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: 16,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 32,
    width: '100%',
    maxWidth: 360,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  eyebrow: {
    fontFamily: 'var(--font-data)',
    fontSize: 12,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  title: { fontSize: 28 },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 14,
    color: 'var(--text-muted)',
  },
  input: {
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 16,
    fontFamily: 'var(--font-body)',
    color: 'var(--text)',
  },
  fieldset: { border: 'none', padding: 0, margin: 0 },
  legend: { fontSize: 14, color: 'var(--text-muted)', padding: 0, marginBottom: 6 },
  roleRow: { display: 'flex', gap: 8 },
  roleBtn: {
    flex: 1,
    padding: '10px 0',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontWeight: 500,
  },
  roleBtnActive: {
    background: 'var(--ink)',
    color: '#fff',
    borderColor: 'var(--ink)',
  },
  submit: {
    marginTop: 8,
    padding: '12px 0',
    borderRadius: 8,
    border: 'none',
    background: 'var(--accent)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
  },
}
