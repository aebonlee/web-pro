// ──────────────────────────────────────────────────────────────
// 프로필 카드 갤러리
// 핵심 학습: 배열 데이터를 map으로 반복 렌더링하고, 각 카드에
//            필요한 값만 props로 전달한다. 조건부 렌더링으로 배지 표시.
// ──────────────────────────────────────────────────────────────

// 화면에 그릴 데이터 (실무에서는 API 응답으로 대체)
const MEMBERS = [
  { id: 1, name: '김리액트', role: '프론트엔드', emoji: '🧑‍💻', active: true },
  { id: 2, name: '이파이', role: 'AI 엔지니어', emoji: '👩‍🔬', active: true },
  { id: 3, name: '박배포', role: 'DevOps', emoji: '🧑‍🔧', active: false },
  { id: 4, name: '최풀스택', role: '풀스택', emoji: '🧑‍🚀', active: true },
]

// 재사용 카드 컴포넌트 — 부모가 내려준 props만 사용
function Card({ name, role, emoji, active }) {
  return (
    <div style={S.card}>
      <div style={S.avatar}>{emoji}</div>
      <div style={S.name}>{name}</div>
      <div style={S.role}>{role}</div>

      {/* 조건부 렌더링: 재직 여부에 따라 배지 색/문구가 달라진다 */}
      <span style={active ? S.badgeOn : S.badgeOff}>
        {active ? '재직중' : '휴직'}
      </span>
    </div>
  )
}

export default function ProfileApp() {
  return (
    <div style={S.grid}>
      {/* 배열을 돌면서 카드를 생성 — key로 각 항목을 구분 */}
      {MEMBERS.map((m) => (
        <Card key={m.id} name={m.name} role={m.role} emoji={m.emoji} active={m.active} />
      ))}
    </div>
  )
}

const S = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 },
  card: { border: '1px solid #eceef2', borderRadius: 16, padding: 20, textAlign: 'center', background: '#fff' },
  avatar: { width: 56, height: 56, borderRadius: 99, background: '#eef1f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' },
  name: { fontSize: 16, fontWeight: 800 },
  role: { fontSize: 13, color: '#6B7178', marginTop: 4 },
  badgeOn: { display: 'inline-block', marginTop: 10, fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 60, background: '#dcfce7', color: '#16A34A' },
  badgeOff: { display: 'inline-block', marginTop: 10, fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 60, background: '#f1f3f6', color: '#9CA2AD' },
}
