import { Link } from 'react-router-dom'
import { C, trackColor, trackGrad } from '../theme'
import { TRACKS } from '../data/curriculum'

export function Eyebrow({ children, color = C.orange }) {
  return (
    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color }}>
      {children}
    </p>
  )
}

export function LevelBadge({ level, track }) {
  return (
    <span style={{
      fontSize: 11.5, fontWeight: 700, letterSpacing: '0.02em',
      padding: '4px 11px', borderRadius: 60,
      background: 'rgba(255,255,255,0.1)', color: '#fff', border: `1px solid ${trackColor(track)}55`,
    }}>{level}</span>
  )
}

// 챕터 카드 (다크 배경 위)
export function ChapterCard({ ch, progress }) {
  const tc = trackColor(ch.track)
  const done = progress?.done ?? 0
  const total = ch.sections.length
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <Link to={`/lesson/${ch.id}`} className="card-link"
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#121317', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22,
        padding: 'clamp(24px,2.6vw,34px)', minHeight: 250, color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
      <div aria-hidden style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: 99, background: trackGrad(ch.track), opacity: 0.16, filter: 'blur(8px)' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 14, color: tc, letterSpacing: '0.04em' }}>
          {TRACKS[ch.track].en} · {String(ch.no).padStart(2, '0')}
        </span>
        <LevelBadge level={ch.level} track={ch.track} />
      </div>
      <h3 style={{ margin: '16px 0 10px', fontSize: 'clamp(18px,1.5vw,21px)', fontWeight: 700, lineHeight: 1.32 }}>{ch.title}</h3>
      <p style={{ margin: 0, color: '#9CA2AD', fontSize: 14, lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ch.summary}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, color: '#6B7178', fontSize: 12.5, fontWeight: 600 }}>
          <span>{total}개 강의</span><span>·</span><span>{ch.duration}</span>
        </div>
        {done > 0 ? (
          <span style={{ fontSize: 12.5, fontWeight: 700, color: tc }}>{pct}%</span>
        ) : (
          <span style={{ width: 34, height: 34, borderRadius: 99, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>↗</span>
        )}
      </div>
      {done > 0 && (
        <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.1)', marginTop: 12, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: trackGrad(ch.track), borderRadius: 4 }} />
        </div>
      )}
    </Link>
  )
}

export function TagRow({ tags, color = C.blueD }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tags.map((t) => (
        <span key={t} style={{ fontSize: 12.5, fontWeight: 600, color, background: `${color}14`, padding: '5px 12px', borderRadius: 60 }}>{t}</span>
      ))}
    </div>
  )
}
