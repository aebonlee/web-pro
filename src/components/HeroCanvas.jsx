import { useEffect, useRef } from 'react'

// 히어로 배경 — 캔버스 파티클 네트워크.
// 브랜드 블루/오렌지 점이 떠다니며 가까운 점끼리 선으로 연결되고, 마우스 근처로 반응한다.
// 접근성: prefers-reduced-motion 시 정적 렌더(애니메이션 정지). 성능: DPR 보정·rAF·언마운트/리사이즈 정리.
export default function HeroCanvas({ style }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext && canvas.getContext('2d')
    if (!ctx) return // 캔버스 미지원 환경(jsdom 등)에서는 조용히 건너뜀
    const reduce = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles = []
    let raf = 0
    const mouse = { x: -9999, y: -9999 }

    const BLUE = '26,69,216'
    const SKY = '75,134,255'
    const ORANGE = '255,106,26'
    const LINK_DIST = 130   // 점끼리 연결되는 최대 거리
    const MOUSE_DIST = 170  // 마우스와 연결되는 거리

    function resize() {
      const rect = canvas.getBoundingClientRect()
      w = rect.width; h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // 면적 비례 개수(상·하한) — 모바일에선 가볍게
      const count = Math.max(26, Math.min(70, Math.round((w * h) / 16000)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 1.2,
        accent: Math.random() < 0.12, // 일부만 오렌지 포인트
      }))
    }

    function step() {
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        // 가장자리에서 부드럽게 반사
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        p.x = Math.max(0, Math.min(w, p.x))
        p.y = Math.max(0, Math.min(h, p.y))

        // 마우스 근처면 살짝 끌림
        const mdx = mouse.x - p.x, mdy = mouse.y - p.y
        const md = Math.hypot(mdx, mdy)
        if (md < MOUSE_DIST) {
          const f = (1 - md / MOUSE_DIST) * 0.4
          p.x += (mdx / (md || 1)) * f
          p.y += (mdy / (md || 1)) * f
        }
      }

      // 점끼리 연결선
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.16
            ctx.strokeStyle = `rgba(${BLUE},${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
        // 마우스 연결선
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        if (dm < MOUSE_DIST) {
          ctx.strokeStyle = `rgba(${SKY},${(1 - dm / MOUSE_DIST) * 0.28})`
          ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke()
        }
      }

      // 점
      for (const p of particles) {
        ctx.fillStyle = p.accent ? `rgba(${ORANGE},0.55)` : `rgba(${BLUE},0.45)`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
      }

      raf = requestAnimationFrame(step)
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999 }

    resize()
    if (reduce) {
      step(); cancelAnimationFrame(raf) // 1프레임만 그리고 정지
    } else {
      raf = requestAnimationFrame(step)
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', onLeave, { passive: true })
    }
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}
    />
  )
}
