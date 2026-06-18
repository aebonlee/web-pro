import { useState } from 'react'

// ──────────────────────────────────────────────────────────────
// 날씨 조회 위젯
// 핵심 학습: 입력 → 비동기 호출 → 로딩/에러/결과 3가지 상태를 다룬다.
//            (실무에서는 fetch로 외부 날씨 API를 호출)
// ──────────────────────────────────────────────────────────────

// 데모용 모의 데이터 — 실제로는 fetch 응답으로 대체
const MOCK = {
  서울: { temp: 22, desc: '맑음', icon: '☀️', hum: 45 },
  부산: { temp: 25, desc: '구름 조금', icon: '⛅', hum: 60 },
  제주: { temp: 27, desc: '소나기', icon: '🌦️', hum: 78 },
}

export default function WeatherApp() {
  const [city, setCity] = useState('서울') // 입력 도시
  const [data, setData] = useState(MOCK['서울']) // 조회 결과
  const [loading, setLoading] = useState(false) // 로딩 여부
  const [error, setError] = useState('') // 에러 메시지

  // 조회: 호출 시작 시 상태를 초기화하고, 끝나면 결과/에러를 채운다
  const search = async () => {
    setLoading(true)
    setError('')
    setData(null)

    // 실제 네트워크 호출을 흉내내기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 600))

    const found = MOCK[city.trim()]
    if (found) {
      setData(found)
    } else {
      setError('해당 도시 데이터를 찾을 수 없습니다.')
    }

    setLoading(false)
  }

  return (
    <div style={S.wrap}>
      {/* 입력 영역 */}
      <div style={S.row}>
        <input
          style={S.input}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="도시 (서울 / 부산 / 제주)"
        />
        <button style={S.btn} onClick={search}>
          조회
        </button>
      </div>

      {/* 결과 영역: 로딩 → 에러 → 데이터 순으로 분기 렌더링 */}
      <div style={S.panel}>
        {loading ? (
          <span style={{ color: '#6B7178' }}>불러오는 중…</span>
        ) : error ? (
          <span style={{ color: '#E0470A' }}>{error}</span>
        ) : data ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 52 }}>{data.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginTop: 6 }}>{data.temp}°</div>
            <div style={{ fontSize: 15, color: '#3A3F49', marginTop: 4 }}>
              {city} · {data.desc}
            </div>
            <div style={{ fontSize: 13, color: '#9CA2AD', marginTop: 2 }}>습도 {data.hum}%</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const S = {
  wrap: { maxWidth: 360, margin: '0 auto' },
  row: { display: 'flex', gap: 8, marginBottom: 18 },
  input: { flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #d8dce3', fontSize: 14, outline: 'none' },
  btn: { padding: '10px 18px', borderRadius: 10, background: '#1A45D8', color: '#fff', fontWeight: 700, fontSize: 14 },
  panel: { minHeight: 150, borderRadius: 16, border: '1px solid #eceef2', background: 'linear-gradient(160deg,#eaf1ff,#fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
}
