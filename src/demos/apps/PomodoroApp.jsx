import { useEffect, useRef, useState } from 'react'

// ──────────────────────────────────────────────────────────────
// 포모도로 집중 타이머
// 핵심 학습: useEffect 안에서 setInterval로 1초마다 시간을 줄이고,
//            cleanup 함수로 타이머를 정리해 중복 실행을 막는다.
// ──────────────────────────────────────────────────────────────

const FOCUS = 25 * 60 // 집중 시간 25분 (초 단위)
const BREAK = 5 * 60 // 휴식 시간 5분 (초 단위)

export default function PomodoroApp() {
  const [mode, setMode] = useState('focus') // focus(집중) | break(휴식)
  const [left, setLeft] = useState(FOCUS) // 남은 시간(초)
  const [running, setRunning] = useState(false) // 작동 여부
  const timer = useRef(null) // setInterval 핸들 보관

  // 타이머 동작: running이 true일 때만 1초마다 남은 시간을 줄인다
  useEffect(() => {
    if (!running) return

    timer.current = setInterval(() => {
      setLeft((sec) => sec - 1)
    }, 1000)

    // cleanup: 의존성이 바뀌거나 언마운트될 때 타이머 해제 → 중복 방지
    return () => clearInterval(timer.current)
  }, [running])

  // 0초가 되면 집중 ↔ 휴식 모드를 자동으로 전환한다
  useEffect(() => {
    if (left > 0) return

    const next = mode === 'focus' ? 'break' : 'focus'
    setMode(next)
    setLeft(next === 'focus' ? FOCUS : BREAK)
  }, [left, mode])

  // 처음 상태로 되돌리기
  const reset = () => {
    setRunning(false)
    setMode('focus')
    setLeft(FOCUS)
  }

  // 남은 초를 mm:ss 형태로 변환
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  // 진행률(원형 게이지 계산용)
  const total = mode === 'focus' ? FOCUS : BREAK
  const pct = ((total - left) / total) * 100
  const color = mode === 'focus' ? '#1A45D8' : '#16A34A'
  const R = 80
  const CIRC = 2 * Math.PI * R

  return (
    <div style={S.wrap}>
      {/* 모드 표시 */}
      <div style={S.badges}>
        {[
          ['focus', '집중'],
          ['break', '휴식'],
        ].map(([key, label]) => (
          <span
            key={key}
            style={{
              ...S.badge,
              background: mode === key ? (key === 'focus' ? '#1A45D8' : '#16A34A') : '#f1f3f6',
              color: mode === key ? '#fff' : '#9CA2AD',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* 원형 진행 게이지 + 시간 */}
      <div style={S.clock}>
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="90" cy="90" r={R} fill="none" stroke="#eceef2" strokeWidth="12" />
          <circle
            cx="90"
            cy="90"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - pct / 100)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div style={S.time}>
          {mm}:{ss}
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div style={S.controls}>
        <button style={S.start} onClick={() => setRunning((r) => !r)}>
          {running ? '일시정지' : '시작'}
        </button>
        <button style={S.reset} onClick={reset}>
          리셋
        </button>
      </div>
    </div>
  )
}

const S = {
  wrap: { textAlign: 'center', maxWidth: 320, margin: '0 auto' },
  badges: { display: 'inline-flex', gap: 6, marginBottom: 18 },
  badge: { padding: '5px 14px', borderRadius: 60, fontSize: 13, fontWeight: 700 },
  clock: { position: 'relative', width: 180, height: 180, margin: '0 auto' },
  time: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, fontWeight: 800, letterSpacing: '-0.02em' },
  controls: { display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 },
  start: { padding: '11px 28px', borderRadius: 60, background: '#0A0B0D', color: '#fff', fontWeight: 700, fontSize: 15 },
  reset: { padding: '11px 22px', borderRadius: 60, border: '1px solid #d8dce3', color: '#4a4f57', fontWeight: 600, fontSize: 15 },
}
