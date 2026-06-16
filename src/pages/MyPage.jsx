import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { C, grad, trackColor, trackGrad } from '../theme'
import { CHAPTERS, TRACKS, byTrack } from '../data/curriculum'
import { Eyebrow } from '../components/ui'
import { useAuth, signOut } from '../hooks/useAuth'
import { useProgress } from '../hooks/useProgress'

export default function MyPage() {
  const { user, loading } = useAuth()
  const prog = useProgress()
  const nav = useNavigate()

  useEffect(() => { if (!loading && !user) nav('/login', { replace: true }) }, [user, loading, nav])
  if (loading || !user) return <div style={{ minHeight: '60vh' }} />

  const meta = user.user_metadata || {}
  const name = meta.full_name || meta.name || meta.nickname || (user.email || '').split('@')[0]
  const avatar = meta.avatar_url || meta.picture

  const totalSec = CHAPTERS.reduce((n, c) => n + c.sections.length, 0)
  const totalDone = CHAPTERS.reduce((n, c) => n + prog.doneCount(c.id), 0)
  const overallPct = totalSec ? Math.round((totalDone / totalSec) * 100) : 0

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      {/* HEADER */}
      <section style={{ background: C.ink, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <img src="/assets/silk.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />
        <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', padding: 'clamp(40px,6vw,80px) clamp(20px,5vw,56px) clamp(36px,5vw,56px)' }}>
          <Eyebrow>MY LEARNING</Eyebrow>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 18 }}>
            {avatar
              ? <img src={avatar} alt="" referrerPolicy="no-referrer" style={{ width: 64, height: 64, borderRadius: 99, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
              : <div style={{ width: 64, height: 64, borderRadius: 99, background: grad.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800 }}>{name[0]?.toUpperCase()}</div>}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(24px,3.4vw,34px)', fontWeight: 800, letterSpacing: '-0.02em' }}>{name}님</h1>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: '#9CA2AD' }}>{user.email}</p>
            </div>
            <button onClick={signOut} style={{ padding: '11px 22px', borderRadius: 60, border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 14, fontWeight: 600 }}>로그아웃</button>
          </div>

          {/* overall */}
          <div style={{ marginTop: 32, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 'clamp(22px,3vw,30px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#C7CCD6' }}>전체 진도율</span>
              <span style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800 }}>{overallPct}<span style={{ fontSize: 16, color: '#9CA2AD' }}>%</span></span>
            </div>
            <div style={{ height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${overallPct}%`, background: grad.blue, borderRadius: 8, transition: 'width .5s' }} />
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 13, color: '#9CA2AD' }}>완료한 강의 {totalDone}개 / 전체 {totalSec}개</p>
          </div>
        </div>
      </section>

      {/* TRACKS PROGRESS */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(36px,5vw,60px) clamp(20px,5vw,56px) clamp(64px,10vw,110px)' }}>
        {Object.values(TRACKS).map((tr) => {
          const chs = byTrack(tr.id)
          const tc = trackColor(tr.id)
          return (
            <div key={tr.id} style={{ marginBottom: 'clamp(32px,5vw,52px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <span style={{ width: 10, height: 10, borderRadius: 99, background: tc }} />
                <h2 style={{ margin: 0, fontSize: 'clamp(18px,2.4vw,22px)', fontWeight: 700 }}>{tr.label}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
                {chs.map((ch) => {
                  const done = prog.doneCount(ch.id)
                  const pct = Math.round((done / ch.sections.length) * 100)
                  return (
                    <Link key={ch.id} to={`/lesson/${ch.id}`} className="card-link" style={{ display: 'block', border: `1px solid ${C.line}`, borderRadius: 18, padding: '20px 22px', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: tc }}>CH {String(ch.no).padStart(2, '0')}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: pct === 100 ? tc : '#9CA2AD' }}>{pct === 100 ? '완료 ✓' : `${pct}%`}</span>
                      </div>
                      <h3 style={{ margin: '10px 0 14px', fontSize: 15.5, fontWeight: 700, lineHeight: 1.4 }}>{ch.title}</h3>
                      <div style={{ height: 5, borderRadius: 5, background: C.soft, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: trackGrad(ch.track), borderRadius: 5, transition: 'width .4s' }} />
                      </div>
                      <p style={{ margin: '10px 0 0', fontSize: 12.5, color: '#9CA2AD' }}>{done} / {ch.sections.length} 강의</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}
