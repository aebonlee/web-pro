import { useState } from 'react'
import { Link } from 'react-router-dom'
import { C, grad } from '../theme'
import { COACHING, APPENDIX } from '../data/coaching'
import { TIPS, TOTAL_TIPS } from '../data/tips'
import { Eyebrow } from '../components/ui'
import Reveal from '../components/Reveal'
import { usePageMeta } from '../hooks/usePageMeta'

const ACCENT = '#6D5BD0' // 코칭 섹션 강조색(인디고)
const APPENDIX_GRAD = 'linear-gradient(135deg,#8B7BE0,#5848B8)'

export default function Coaching() {
  usePageMeta('코칭·가이드', `기술 코칭 ${COACHING.length}회차와 부록 가이드 ${APPENDIX.length}종, 그리고 실전 Tips! ${TOTAL_TIPS}개.`)
  const [tab, setTab] = useState('coaching')

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', background: C.ink, color: '#fff' }}>
        <img src="/assets/silk.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: 'clamp(48px,7vw,100px) clamp(20px,5vw,56px) 0' }}>
          <Eyebrow color="#B5A8F0">COACHING &amp; GUIDES</Eyebrow>
          <h1 style={{ margin: '14px 0 0', fontSize: 'clamp(32px,6.5vw,92px)', lineHeight: 0.96, letterSpacing: '-0.04em', fontWeight: 300, textTransform: 'uppercase' }}>
            코칭 &amp; <span style={{ fontWeight: 800 }}>가이드</span>
          </h1>
          <p style={{ margin: '22px 0 0', maxWidth: 680, fontSize: 'clamp(15px,2vw,18px)', lineHeight: 1.7, color: '#9CA2AD' }}>
            전문가 1:1 기술 코칭 {COACHING.length}회차와 실무 부록 가이드 {APPENDIX.length}종, 그리고 곳곳의 실전 Tips! {TOTAL_TIPS}개를 한곳에 모았습니다.
          </p>
          <div style={{ display: 'flex', gap: 6, marginTop: 'clamp(28px,4vw,40px)', flexWrap: 'wrap' }}>
            {[['coaching', '기술 코칭', COACHING.length], ['appendix', '부록 가이드', APPENDIX.length], ['tips', 'Tips! 모음', TOTAL_TIPS]].map(([id, label, n]) => {
              const active = tab === id
              return (
                <button key={id} onClick={() => setTab(id)} style={{
                  padding: '12px 22px', borderRadius: '14px 14px 0 0', fontSize: 15, fontWeight: 700,
                  background: active ? '#fff' : 'rgba(255,255,255,0.06)', color: active ? C.ink : '#C7CCD6', border: 'none', transition: 'all .2s',
                }}>{label} <span style={{ fontSize: 12, opacity: 0.6 }}>{n}</span></button>
              )
            })}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(32px,4vw,52px) clamp(20px,5vw,56px) clamp(64px,10vw,110px)' }}>
        {tab === 'coaching' && <Cards items={COACHING} coaching />}
        {tab === 'appendix' && <Cards items={APPENDIX} />}
        {tab === 'tips' && <TipsList />}
      </section>
    </main>
  )
}

function Cards({ items, coaching }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: coaching ? 'repeat(auto-fill,minmax(260px,1fr))' : 'repeat(auto-fill,minmax(300px,1fr))', gap: 'clamp(14px,1.6vw,18px)' }}>
      {items.map((g, i) => (
        <Reveal key={g.id} delay={(i % 3) * 60}>
          <Link to={`/coaching/${g.id}`} className="card-link" style={{
            display: 'flex', flexDirection: 'column', minHeight: coaching ? 200 : 220, background: '#fff',
            border: `1px solid ${C.line}`, borderRadius: 20, padding: 'clamp(22px,2.4vw,30px)', position: 'relative', overflow: 'hidden',
          }}>
            <div aria-hidden style={{ position: 'absolute', top: -36, right: -36, width: 120, height: 120, borderRadius: 99, background: APPENDIX_GRAD, opacity: 0.12 }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', color: ACCENT }}>{coaching ? 'COACHING' : 'APPENDIX'}</span>
            <h3 style={{ margin: '12px 0 8px', fontSize: 'clamp(17px,2vw,20px)', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.32 }}>{g.title}</h3>
            <p style={{ margin: 0, flex: 1, color: '#6B7178', fontSize: 14, lineHeight: 1.6 }}>{g.summary}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
              {g.tags.slice(0, 3).map((t) => (
                <span key={t} style={{ fontSize: 11.5, fontWeight: 600, color: ACCENT, background: `${ACCENT}14`, padding: '4px 9px', borderRadius: 60 }}>{t}</span>
              ))}
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}

function TipsList() {
  const [q, setQ] = useState('')
  const filtered = TIPS.filter((t) => !q.trim() || t.text.toLowerCase().includes(q.trim().toLowerCase()) || t.source.includes(q.trim()))
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tip 검색"
        style={{ width: '100%', maxWidth: 360, padding: '12px 16px', borderRadius: 12, border: `1px solid ${C.line}`, fontSize: 14.5, outline: 'none', background: C.cream, marginBottom: 14 }} />
      <p style={{ margin: '0 0 18px', fontSize: 13.5, color: '#9CA2AD' }}>{filtered.length}개 Tip</p>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#9CA2AD', fontSize: 15 }}>‘{q}’에 대한 Tip이 없습니다.</div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
        {filtered.map((t, i) => (
          <Reveal key={i} delay={(i % 6) * 30} style={{ border: `1px solid ${C.line}`, borderLeft: `4px solid #D97706`, borderRadius: 14, padding: '18px 20px', background: '#fffdf8' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: '#D97706', alignSelf: 'center' }}>TIP!</span>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 14.5, lineHeight: 1.7, color: '#2C3037' }}>{t.text}</p>
            <Link to={`/coaching/${t.sourceId}`} style={{ fontSize: 12, fontWeight: 600, color: '#9CA2AD' }}>{t.source} →</Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
