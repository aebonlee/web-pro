import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { C } from '../theme'
import CodeBlock from './CodeBlock'

// 헤딩 텍스트에서 "5.1" 같은 섹션 번호를 뽑아 앵커 id 생성 → #s-5.1
const textOf = (children) =>
  Array.isArray(children) ? children.map(textOf).join('') : (children?.props ? textOf(children.props.children) : (children ?? ''))

export const sectionAnchor = (no) => `s-${no}`

function headingId(children) {
  const t = textOf(children).trim()
  const m = t.match(/^(\d+\.\d+)/)
  return m ? `s-${m[1]}` : undefined
}

const comp = (accent) => ({
  h1: () => null, // 본문 h1(장 제목)은 페이지 헤더에서 별도 표기하므로 숨김
  h2: ({ children }) => (
    <h2 id={headingId(children)} style={{ scrollMarginTop: 96, margin: '52px 0 18px', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, letterSpacing: '-0.02em', paddingBottom: 14, borderBottom: `2px solid ${accent}22` }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ margin: '34px 0 12px', fontSize: 'clamp(18px,2.2vw,22px)', fontWeight: 700, color: C.ink2 }}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 style={{ margin: '24px 0 10px', fontSize: 17, fontWeight: 700, color: accent }}>{children}</h4>
  ),
  p: ({ children }) => <p style={{ margin: '14px 0', fontSize: 16, lineHeight: 1.85, color: '#2C3037' }}>{children}</p>,
  ul: ({ children }) => <ul style={{ margin: '14px 0', paddingLeft: 22, listStyle: 'disc' }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ margin: '14px 0', paddingLeft: 24, listStyle: 'decimal' }}>{children}</ol>,
  li: ({ children }) => (
    <li style={{ fontSize: 15.5, lineHeight: 1.75, color: '#2C3037', margin: '6px 0', paddingLeft: 4 }}>{children}</li>
  ),
  a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" style={{ color: C.blueD, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>{children}</a>,
  strong: ({ children }) => <strong style={{ fontWeight: 700, color: C.ink }}>{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote style={{ margin: '18px 0', padding: '14px 20px', borderLeft: `4px solid ${accent}`, background: `${accent}0c`, borderRadius: '0 12px 12px 0', color: '#3A3F49', fontSize: 15 }}>{children}</blockquote>
  ),
  hr: () => <hr style={{ border: 'none', borderTop: `1px solid ${C.line}`, margin: '36px 0' }} />,
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '18px 0' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14.5 }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  th: ({ children }) => <th style={{ textAlign: 'left', padding: '11px 14px', background: C.ink, color: '#fff', fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap' }}>{children}</th>,
  td: ({ children }) => <td style={{ padding: '11px 14px', borderBottom: `1px solid ${C.line}`, verticalAlign: 'top', lineHeight: 1.6 }}>{children}</td>,
  code: ({ className, children }) => {
    // react-markdown v9는 inline prop을 주지 않음 → language 클래스 또는 줄바꿈으로 블록 판별
    const text = String(children ?? '')
    const match = /language-(\w+)/.exec(className || '')
    const isBlock = !!match || text.includes('\n')
    if (!isBlock) {
      return <code style={{ background: '#EEF1F6', color: '#1A45D8', padding: '2px 7px', borderRadius: 6, fontSize: '0.88em', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', wordBreak: 'break-word' }}>{children}</code>
    }
    const lang = match ? match[1] : ''
    return <CodeBlock code={text} lang={lang} />
  },
  pre: ({ children }) => <>{children}</>,
})

export default function Markdown({ children, accent = C.blueD }) {
  return (
    <div className="md-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={comp(accent)}>{children}</ReactMarkdown>
    </div>
  )
}
