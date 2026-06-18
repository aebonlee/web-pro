import { useState } from 'react'

// ──────────────────────────────────────────────────────────────
// 칸반 보드 (할 일 관리)
// 핵심 학습: 카드마다 소속 컬럼(col)을 상태로 두고, 버튼으로
//            컬럼 사이를 이동시킨다. 이동 시 불변성을 지켜 갱신.
// ──────────────────────────────────────────────────────────────

// 보드의 컬럼 정의 (왼쪽 → 오른쪽 순서)
const COLUMNS = [
  { id: 'todo', title: '할 일' },
  { id: 'doing', title: '진행중' },
  { id: 'done', title: '완료' },
]

export default function KanbanApp() {
  // 각 카드는 { id, text, col } — col이 어느 컬럼에 있는지 가리킨다
  const [cards, setCards] = useState([
    { id: 1, text: 'UI 설계', col: 'todo' },
    { id: 2, text: 'API 연동', col: 'doing' },
    { id: 3, text: '프로젝트 셋업', col: 'done' },
  ])

  // 카드를 이전(-1)/다음(+1) 컬럼으로 이동
  const move = (id, dir) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== id) return card // 대상이 아니면 그대로

        // 현재 컬럼 위치를 찾아 범위 안에서 이동
        const cur = COLUMNS.findIndex((c) => c.id === card.col)
        const next = Math.min(COLUMNS.length - 1, Math.max(0, cur + dir))

        return { ...card, col: COLUMNS[next].id }
      }),
    )
  }

  return (
    <div style={S.board}>
      {COLUMNS.map((col, ci) => (
        <div key={col.id} style={S.column}>
          <div style={S.colTitle}>{col.title}</div>

          <div style={S.cards}>
            {/* 이 컬럼에 속한 카드만 골라서 렌더링 */}
            {cards
              .filter((c) => c.col === col.id)
              .map((c) => (
                <div key={c.id} style={S.card}>
                  <div style={S.cardText}>{c.text}</div>
                  <div style={S.cardBtns}>
                    {/* 첫 컬럼에선 왼쪽, 마지막 컬럼에선 오른쪽 비활성화 */}
                    <button
                      style={{ fontSize: 16, color: ci === 0 ? '#d8dce3' : '#1A45D8' }}
                      onClick={() => move(c.id, -1)}
                      disabled={ci === 0}
                    >
                      ‹
                    </button>
                    <button
                      style={{ fontSize: 16, color: ci === COLUMNS.length - 1 ? '#d8dce3' : '#1A45D8' }}
                      onClick={() => move(c.id, 1)}
                      disabled={ci === COLUMNS.length - 1}
                    >
                      ›
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const S = {
  board: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 },
  column: { background: '#f6f7f9', borderRadius: 12, padding: 10, minHeight: 180 },
  colTitle: { fontSize: 13, fontWeight: 700, color: '#4a4f57', marginBottom: 10, paddingLeft: 4 },
  cards: { display: 'flex', flexDirection: 'column', gap: 8 },
  card: { background: '#fff', border: '1px solid #eceef2', borderRadius: 10, padding: '10px 12px' },
  cardText: { fontSize: 13.5, fontWeight: 600, marginBottom: 8 },
  cardBtns: { display: 'flex', justifyContent: 'space-between' },
}
