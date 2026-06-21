import { useEffect, useRef } from 'react'

// 히어로 배경 — 화려한 캔버스 파티클 네트워크.
// 다색 발광 파티클이 반짝이며 떠다니고, 가까운 점끼리 그라데이션 선으로 연결.
// 마우스에 글로우 헤일로 + 끌림, 클릭 시 리플 폭발 + 파티클 튕김, 배경엔 흐르는 오로라 글로우.
// 접근성: prefers-reduced-motion 시 정적 1프레임. 성능: DPR 보정·점 수 상한·rAF·정리.
const PALETTE = ['26,69,216', '75,134,255', '255,106,26', '124,58,237'] // 블루·스카이·오렌지·퍼플

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
    let ripples = []
    let raf = 0, t = 0
    const mouse = { x: -9999, y: -9999, active: false }

    const LINK_DIST = 150   // 점끼리 연결 최대 거리
    const MOUSE_DIST = 210  // 마우스 영향 거리

    function resize() {
      const rect = canvas.getBoundingClientRect()
      w = rect.width; h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(30, Math.min(80, Math.round((w * h) / 13000)))
      particles = Array.from({ length: count }, () => spawn())
    }

    function spawn(x, y) {
      return {
        x: x ?? Math.random() * w,
        y: y ?? Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1.3,
        c: PALETTE[(Math.random() * PALETTE.length) | 0],
        ph: Math.random() * Math.PI * 2, // 반짝임 위상
        ps: 0.6 + Math.random() * 0.8,   // 반짝임 속도
      }
    }

    function step() {
      t += 1
      ctx.clearRect(0, 0, w, h)

      // 1) 흐르는 오로라 글로우 (배경 depth)
      ctx.globalCompositeOperation = 'lighter'
      const blobs = [
        { x: w * (0.3 + 0.18 * Math.sin(t * 0.004)), y: h * (0.35 + 0.16 * Math.cos(t * 0.0032)), c: '75,134,255', r: Math.min(w, h) * 0.5 },
        { x: w * (0.72 + 0.14 * Math.cos(t * 0.0036)), y: h * (0.55 + 0.18 * Math.sin(t * 0.0028)), c: '124,58,237', r: Math.min(w, h) * 0.42 },
        { x: w * (0.55 + 0.2 * Math.sin(t * 0.0026)), y: h * (0.7 + 0.12 * Math.cos(t * 0.0042)), c: '255,106,26', r: Math.min(w, h) * 0.32 },
      ]
      for (const bl of blobs) {
        const g = ctx.createRadialGradient(bl.x, bl.y, 0, bl.x, bl.y, bl.r)
        g.addColorStop(0, `rgba(${bl.c},0.10)`)
        g.addColorStop(1, `rgba(${bl.c},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }
      ctx.globalCompositeOperation = 'source-over'

      // 2) 파티클 이동 + 마우스 끌림
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        p.vx *= 0.995; p.vy *= 0.995 // 클릭 튕김 후 서서히 감속
        // 최소 속도 유지(멈추지 않게)
        if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.04
        if (Math.abs(p.vy) < 0.05) p.vy += (Math.random() - 0.5) * 0.04
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        p.x = Math.max(0, Math.min(w, p.x))
        p.y = Math.max(0, Math.min(h, p.y))

        if (mouse.active) {
          const mdx = mouse.x - p.x, mdy = mouse.y - p.y
          const md = Math.hypot(mdx, mdy)
          if (md < MOUSE_DIST) {
            const f = (1 - md / MOUSE_DIST) * 0.5
            p.x += (mdx / (md || 1)) * f
            p.y += (mdy / (md || 1)) * f
          }
        }
      }

      // 3) 연결선 (그라데이션)
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.22
            const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
            g.addColorStop(0, `rgba(${a.c},${alpha})`)
            g.addColorStop(1, `rgba(${b.c},${alpha})`)
            ctx.strokeStyle = g
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
        // 마우스 연결선 (밝게)
        if (mouse.active) {
          const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y)
          if (dm < MOUSE_DIST) {
            ctx.strokeStyle = `rgba(${a.c},${(1 - dm / MOUSE_DIST) * 0.4})`
            ctx.lineWidth = 1.2
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke()
          }
        }
      }

      // 4) 발광 파티클 (반짝임)
      for (const p of particles) {
        const tw = 0.6 + 0.4 * Math.sin(t * 0.03 * p.ps + p.ph) // 0.2~1.0
        ctx.shadowColor = `rgba(${p.c},0.9)`
        ctx.shadowBlur = 12
        ctx.fillStyle = `rgba(${p.c},${0.45 + tw * 0.45})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.85 + tw * 0.5), 0, Math.PI * 2); ctx.fill()
      }
      ctx.shadowBlur = 0

      // 5) 마우스 글로우 헤일로
      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_DIST * 0.6)
        g.addColorStop(0, 'rgba(75,134,255,0.16)')
        g.addColorStop(1, 'rgba(75,134,255,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, MOUSE_DIST * 0.6, 0, Math.PI * 2); ctx.fill()
      }

      // 6) 클릭 리플
      ripples = ripples.filter((rp) => rp.a > 0.01)
      for (const rp of ripples) {
        rp.r += (rp.max - rp.r) * 0.06
        rp.a *= 0.94
        ctx.strokeStyle = `rgba(${rp.c},${rp.a})`
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2); ctx.stroke()
      }

      raf = requestAnimationFrame(step)
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = mouse.x >= 0 && mouse.x <= w && mouse.y >= 0 && mouse.y <= h
    }
    function onLeave() { mouse.active = false }
    function onDown(e) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left, y = e.clientY - rect.top
      if (x < 0 || x > w || y < 0 || y > h) return
      ripples.push({ x, y, r: 0, max: 160, a: 0.5, c: '26,69,216' })
      // 근처 파티클 바깥으로 튕기기
      for (const p of particles) {
        const dx = p.x - x, dy = p.y - y, d = Math.hypot(dx, dy)
        if (d < 200) {
          const f = (1 - d / 200) * 4
          p.vx += (dx / (d || 1)) * f
          p.vy += (dy / (d || 1)) * f
        }
      }
    }

    resize()
    if (reduce) {
      step(); cancelAnimationFrame(raf) // 1프레임만 그리고 정지
    } else {
      raf = requestAnimationFrame(step)
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', onLeave, { passive: true })
      window.addEventListener('pointerdown', onDown, { passive: true })
    }
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
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
