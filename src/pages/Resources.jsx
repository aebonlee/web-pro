import { Link } from 'react-router-dom'
import { C, trackColor, trackGrad } from '../theme'
import { CHAPTERS, TRACKS, byTrack } from '../data/curriculum'
import { labsOf, totalLabs } from '../data/labs'
import { COACHING, APPENDIX } from '../data/coaching'
import { Eyebrow } from '../components/ui'
import Reveal from '../components/Reveal'
import { usePageMeta } from '../hooks/usePageMeta'

const GUIDE_ACCENT = '#6D5BD0' // 코칭·가이드 강조색(인디고)

export default function Resources() {
  usePageMeta('학습 자료·실습', '전 챕터 강의 목차와 실습 예제, 코칭·가이드를 한곳에서.')
  const totalSec = CHAPTERS.reduce((n, c) => n + c.sections.length, 0)
  const totalGuides = COACHING.length + APPENDIX.length

  return (
    <main style={{ background: '#fff' }}>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', background: C.ink, color: '#fff' }}>
        <img src="/assets/silk.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.14 }} />
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px,7vw,108px) clamp(20px,5vw,56px) clamp(36px,5vw,60px)' }}>
          <Eyebrow>RESOURCES</Eyebrow>
          <h1 style={{ margin: '14px 0 0', fontSize: 'clamp(34px,7vw,100px)', lineHeight: 0.96, letterSpacing: '-0.04em', fontWeight: 300, textTransform: 'uppercase' }}>
            학습 자료 &<br /><span style={{ fontWeight: 800 }}>실습 예제</span>
          </h1>
          <p style={{ margin: '24px 0 0', maxWidth: 680, fontSize: 'clamp(15px,2vw,18px)', lineHeight: 1.7, color: '#9CA2AD' }}>
            부트캠프의 모든 강의 내용을 웹에서 바로 학습하세요. {CHAPTERS.length}개 챕터 · {totalSec}개 강의 · {totalLabs}개 실습 예제와 코칭·가이드 {totalGuides}종의 본문과 코드를 한곳에서 제공합니다.
          </p>
          <div style={{ display: 'flex', gap: 28, marginTop: 30, flexWrap: 'wrap' }}>
            {[['챕터', `${CHAPTERS.length}개`], ['강의', `${totalSec}개`], ['실습 예제', `${totalLabs}개`], ['코칭·가이드', `${totalGuides}종`]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, letterSpacing: '-0.02em' }}>{v}</div>
                <div style={{ fontSize: 13, color: '#6B7178', marginTop: 4 }}>{k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BY TRACK */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(36px,5vw,60px) clamp(20px,5vw,56px) clamp(64px,10vw,110px)' }}>
        {Object.values(TRACKS).map((tr) => {
          const tc = trackColor(tr.id)
          return (
            <div key={tr.id} style={{ marginBottom: 'clamp(36px,5vw,56px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span style={{ width: 11, height: 11, borderRadius: 99, background: tc }} />
                <h2 style={{ margin: 0, fontSize: 'clamp(20px,2.6vw,26px)', fontWeight: 800, letterSpacing: '-0.02em' }}>{tr.label}</h2>
                <span style={{ fontSize: 13.5, color: '#9CA2AD' }}>{tr.en}</span>
              </div>
              <p style={{ margin: '0 0 22px 23px', fontSize: 14.5, color: '#6B7178' }}>{tr.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {byTrack(tr.id).map((ch) => {
                  const labs = labsOf(ch.id)
                  return (
                    <Reveal key={ch.id} style={{ border: `1px solid ${C.line}`, borderRadius: 22, padding: 'clamp(22px,3vw,30px)', background: '#fff' }}>
                      {/* chapter head */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                          <span style={{ width: 46, height: 46, borderRadius: 12, background: trackGrad(ch.track), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, flexShrink: 0 }}>{String(ch.no).padStart(2, '0')}</span>
                          <div style={{ minWidth: 0 }}>
                            <h3 style={{ margin: 0, fontSize: 'clamp(17px,2vw,21px)', fontWeight: 700, letterSpacing: '-0.01em' }}>{ch.title}</h3>
                            <div style={{ fontSize: 12.5, color: '#9CA2AD', marginTop: 4 }}>{ch.level} · {ch.sections.length}강의 · 실습 {labs.length}개 · {ch.duration}</div>
                          </div>
                        </div>
                        <Link to={`/lesson/${ch.id}`} className="cta-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 20px', borderRadius: 60, background: trackGrad(ch.track), color: '#fff', fontSize: 13.5, fontWeight: 700, flexShrink: 0 }}>
                          본문 학습 →
                        </Link>
                      </div>

                      {/* sections */}
                      <div style={{ marginTop: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#9CA2AD', marginBottom: 10 }}>강의 목차</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {ch.sections.map((s) => (
                            <Link key={s.no} to={`/lesson/${ch.id}#s-${s.no}`} className="hov-lift" style={{ fontSize: 13, color: '#3A3F49', background: C.soft, padding: '6px 12px', borderRadius: 10 }}>
                              <b style={{ color: tc, fontWeight: 700 }}>{s.no}</b> {s.title}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* labs */}
                      {labs.length > 0 && (
                        <div style={{ marginTop: 18 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#9CA2AD', marginBottom: 10 }}>실습 예제</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
                            {labs.map((lab, i) => (
                              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: C.cream, borderRadius: 12, padding: '12px 14px' }}>
                                <span style={{ color: tc, fontWeight: 800, fontSize: 13, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                                <div>
                                  <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.35 }}>{lab.title}</div>
                                  <div style={{ fontSize: 12, color: '#6B7178', marginTop: 3 }}>{lab.stack.join(' · ')}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Reveal>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* 코칭 · 가이드 */}
        <div style={{ marginTop: 'clamp(12px,2vw,24px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ width: 11, height: 11, borderRadius: 99, background: GUIDE_ACCENT }} />
            <h2 style={{ margin: 0, fontSize: 'clamp(20px,2.6vw,26px)', fontWeight: 800, letterSpacing: '-0.02em' }}>코칭 · 가이드</h2>
            <span style={{ fontSize: 13.5, color: '#9CA2AD' }}>COACHING &amp; GUIDES</span>
          </div>
          <p style={{ margin: '0 0 22px 23px', fontSize: 14.5, color: '#6B7178' }}>
            전문가 1:1 기술 코칭 {COACHING.length}회차와 실무 부록 가이드 {APPENDIX.length}종 — API 키 보안·Supabase·FastAPI 백엔드·배포·SEO 등 실전 노하우를 모았습니다.
          </p>

          {[['기술 코칭', COACHING], ['부록 가이드', APPENDIX]].map(([label, items]) => (
            <div key={label} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#9CA2AD', margin: '0 0 12px 23px' }}>{label} {items.length}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
                {items.map((g) => (
                  <Reveal key={g.id}>
                    <Link to={`/coaching/${g.id}`} className="hov-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: `1px solid ${C.line}`, borderRadius: 18, padding: '20px 22px', background: '#fff' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', color: GUIDE_ACCENT }}>{g.category === 'coaching' ? 'COACHING' : 'APPENDIX'}</span>
                      <h3 style={{ margin: '8px 0 6px', fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{g.title}</h3>
                      <p style={{ margin: 0, fontSize: 13, color: '#6B7178', lineHeight: 1.6, flexGrow: 1 }}>{g.summary}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                        {g.tags.map((t) => (
                          <span key={t} style={{ fontSize: 11.5, color: '#5B616B', background: C.soft, padding: '4px 9px', borderRadius: 8 }}>{t}</span>
                        ))}
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
