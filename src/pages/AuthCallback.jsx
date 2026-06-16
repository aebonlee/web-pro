import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { C } from '../theme'

export default function AuthCallback() {
  const { user, loading } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    if (!loading) nav(user ? '/me' : '/login', { replace: true })
  }, [user, loading, nav])

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: '#0A0B0D', color: '#fff' }}>
      <div style={{ width: 44, height: 44, borderRadius: 99, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: C.blue, animation: 'spinSlow .8s linear infinite' }} />
      <p style={{ margin: 0, fontSize: 15, color: '#9CA2AD' }}>로그인 처리 중입니다…</p>
    </main>
  )
}
