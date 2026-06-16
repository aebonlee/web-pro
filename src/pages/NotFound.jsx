import { Link } from 'react-router-dom'
import { C, grad } from '../theme'

export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 20px', background: '#fff' }}>
      <div style={{ fontSize: 'clamp(80px,18vw,180px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, background: grad.blue, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
      <h1 style={{ margin: '12px 0 0', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: C.ink }}>페이지를 찾을 수 없습니다</h1>
      <p style={{ margin: '12px 0 28px', color: '#6B7178', fontSize: 15 }}>요청하신 페이지가 이동되었거나 존재하지 않습니다.</p>
      <Link to="/" className="cta-pill" style={{ padding: '14px 30px', borderRadius: 60, background: grad.blue, color: '#fff', fontSize: 15, fontWeight: 700 }}>홈으로 →</Link>
    </main>
  )
}
