import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { upsertProfile } from '../lib/db'

const AuthCtx = createContext({ user: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) upsertProfile(u)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)

// 구글 / 카카오 OAuth 로그인
export async function signIn(provider) {
  const redirectTo = `${window.location.origin}/auth/callback`
  return supabase.auth.signInWithOAuth({
    provider, // 'google' | 'kakao'
    options: { redirectTo },
  })
}

export async function signOut() {
  await supabase.auth.signOut()
  window.location.href = '/'
}
