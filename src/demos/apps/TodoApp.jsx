import { useState } from 'react'

// ──────────────────────────────────────────────────────────────
// 할 일 관리 Todo 앱
// 핵심 학습: useState로 배열 상태를 다루되, 항상 "새 배열"을 만들어
//            교체함으로써 React의 불변성(immutability) 원칙을 지킨다.
// ──────────────────────────────────────────────────────────────

export default function TodoApp() {
  // 1) 할 일 목록 상태 — 객체 { id, text, done } 의 배열
  const [todos, setTodos] = useState([
    { id: 1, text: 'React 컴포넌트 이해하기', done: true },
    { id: 2, text: 'useState로 상태 관리하기', done: false },
  ])

  // 2) 입력창 상태 (제어 컴포넌트)
  const [input, setInput] = useState('')

  // 3) 보기 필터 상태: all(전체) | active(진행) | done(완료)
  const [filter, setFilter] = useState('all')

  // 새 할 일 추가 — 기존 배열을 펼친 뒤 새 항목을 더해 "새 배열"로 교체
  const addTodo = () => {
    const text = input.trim()
    if (!text) return // 빈 값은 무시

    const newTodo = { id: Date.now(), text, done: false }
    setTodos([...todos, newTodo])
    setInput('') // 입력창 비우기
  }

  // 완료 토글 — 클릭한 id만 새 객체로 교체하고 나머지는 그대로
  const toggle = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  // 삭제 — filter로 해당 id를 제외한 새 배열을 만든다
  const remove = (id) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  // 현재 필터에 맞는 항목만 골라서 렌더링
  const shown = todos.filter((t) => {
    if (filter === 'active') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  // 아직 완료되지 않은 할 일 개수
  const left = todos.filter((t) => !t.done).length

  return (
    <div style={S.wrap}>
      <h3 style={S.title}>📝 할 일 목록</h3>

      {/* 입력 영역 */}
      <div style={S.inputRow}>
        <input
          style={S.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="할 일을 입력하고 Enter"
        />
        <button style={S.addBtn} onClick={addTodo}>
          추가
        </button>
      </div>

      {/* 필터 버튼 */}
      <div style={S.filterRow}>
        {[
          ['all', '전체'],
          ['active', '진행'],
          ['done', '완료'],
        ].map(([key, label]) => (
          <button
            key={key}
            style={filter === key ? S.filterOn : S.filterOff}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
        <span style={S.left}>남은 일 {left}개</span>
      </div>

      {/* 목록 */}
      <ul style={S.list}>
        {shown.map((t) => (
          <li key={t.id} style={S.item}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(t.id)}
              style={{ width: 18, height: 18 }}
            />
            <span style={t.done ? S.textDone : S.text}>{t.text}</span>
            <button style={S.delBtn} onClick={() => remove(t.id)}>
              삭제
            </button>
          </li>
        ))}

        {/* 빈 목록 안내 */}
        {shown.length === 0 && <li style={S.empty}>할 일이 없습니다 🎉</li>}
      </ul>
    </div>
  )
}

// 스타일을 컴포넌트 로직과 분리해 JSX를 간결하게 유지
const S = {
  wrap: { maxWidth: 420, margin: '0 auto' },
  title: { margin: '0 0 14px', fontSize: 20, fontWeight: 800 },
  inputRow: { display: 'flex', gap: 8, marginBottom: 14 },
  input: { flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #d8dce3', fontSize: 14, outline: 'none' },
  addBtn: { padding: '10px 18px', borderRadius: 10, background: '#1A45D8', color: '#fff', fontWeight: 700, fontSize: 14 },
  filterRow: { display: 'flex', gap: 6, marginBottom: 12 },
  filterOn: { padding: '6px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: '#0A0B0D', color: '#fff' },
  filterOff: { padding: '6px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: '#f1f3f6', color: '#4a4f57' },
  left: { marginLeft: 'auto', alignSelf: 'center', fontSize: 12.5, color: '#9CA2AD' },
  list: { display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 },
  item: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, border: '1px solid #eceef2', background: '#fff' },
  text: { flex: 1, fontSize: 14.5, color: '#2c3037' },
  textDone: { flex: 1, fontSize: 14.5, color: '#9CA2AD', textDecoration: 'line-through' },
  delBtn: { color: '#E0470A', fontSize: 13, fontWeight: 600 },
  empty: { textAlign: 'center', color: '#9CA2AD', fontSize: 14, padding: 20 },
}
