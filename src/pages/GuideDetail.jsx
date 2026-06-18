import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { C } from '../theme'
import { getGuide } from '../data/coaching'
import { loadContent } from '../content'
import { Eyebrow, TagRow } from '../components/ui'
import Markdown from '../components/Markdown'
import { usePageMeta } from '../hooks/usePageMeta'

const ACCENT = '#6D5BD0'

export default function GuideDetail() {
  const { id } = useParams()
  const g = getGuide(id)
  const [content, setContent] = useState('')

  useEffect(() => {
    let on = true
    setContent('')
    loadContent(id).then((md) => { if (on) setContent(md || '') })
    return () => { on = false }
  }, [id])

  usePageMeta(g ? g.title : null, g?.summary)
  if (!g) return <Navigate to="/coaching" replace />

  const isCoaching = g.category === 'coaching'

  return (
    <main style={{ background: '#fff', color: C.ink }}>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(160deg,#2A1F57,#0A0B0D)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <img src="/assets/silk.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.16 }} />
        <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto', padding: 'clamp(40px,6vw,84px) clamp(20px,5vw,56px) clamp(32px,5vw,52px)' }}>
          <Link to="/coaching" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.72)', fontWeight: 600 }}>← 코칭 · 가이드</Link>
          <div style={{ marginTop: 16 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', color: '#B5A8F0' }}>{isCoaching ? 'COACHING' : 'APPENDIX'}</span>
          </div>
          <h1 style={{ margin: '12px 0 0', fontSize: 'clamp(26px,4.2vw,46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>{g.title}</h1>
          <p style={{ margin: '16px 0 0', maxWidth: 700, fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)' }}>{g.summary}</p>
          <div style={{ marginTop: 20 }}><TagRow tags={g.tags} color="#B5A8F0" /></div>
        </div>
      </section>

      {/* BODY */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(36px,5vw,60px) clamp(20px,5vw,56px) clamp(64px,10vw,110px)' }}>
        {content ? <Markdown accent={ACCENT}>{content}</Markdown> : <p style={{ color: '#9CA2AD' }}>본문을 불러오는 중입니다…</p>}
      </section>
    </main>
  )
}
