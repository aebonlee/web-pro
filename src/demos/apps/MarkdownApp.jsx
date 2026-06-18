import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ──────────────────────────────────────────────────────────────
// 실시간 마크다운 미리보기
// 핵심 학습: textarea를 state로 제어(controlled component)하고,
//            입력값이 바뀔 때마다 마크다운을 즉시 HTML로 렌더링한다.
// ──────────────────────────────────────────────────────────────

// 처음 보여줄 예시 마크다운
const SAMPLE = `# 마크다운 미리보기

**굵게**, *기울임*, \`코드\`를 지원합니다.

- 입력과 동시에
- 실시간으로 변환됩니다

> 인용문도 가능해요.
`

export default function MarkdownApp() {
  // 입력값을 상태로 보관 → 입력=출력이 항상 동기화된다
  const [text, setText] = useState(SAMPLE)

  // 단어 수 계산 (공백 기준 분리)
  const words = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div>
      <div style={S.grid}>
        {/* 왼쪽: 입력 (state로 제어) */}
        <textarea
          style={S.editor}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* 오른쪽: 입력값을 마크다운으로 렌더링 */}
        <div style={S.preview}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      </div>

      {/* 글자/단어 카운터 */}
      <div style={S.counter}>
        글자 {text.length}자 · 단어 {words}개
      </div>
    </div>
  )
}

const S = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minHeight: 220 },
  editor: {
    padding: 14,
    borderRadius: 12,
    border: '1px solid #d8dce3',
    fontSize: 13.5,
    lineHeight: 1.6,
    fontFamily: 'ui-monospace, Menlo, monospace',
    resize: 'vertical',
    outline: 'none',
  },
  preview: {
    padding: 14,
    borderRadius: 12,
    border: '1px solid #eceef2',
    background: '#fafafb',
    fontSize: 14,
    overflow: 'auto',
  },
  counter: { marginTop: 10, fontSize: 12.5, color: '#9CA2AD' },
}
