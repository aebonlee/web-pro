import { useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker'

SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('markup', markup)
SyntaxHighlighter.registerLanguage('sql', sql)
SyntaxHighlighter.registerLanguage('docker', docker)

// 마크다운 fence 언어 → prism 언어 매핑
const LANG = {
  jsx: 'jsx', tsx: 'tsx', js: 'javascript', javascript: 'javascript',
  ts: 'typescript', typescript: 'typescript',
  py: 'python', python: 'python',
  sh: 'bash', shell: 'bash', bash: 'bash', console: 'bash', env: 'bash', nginx: 'bash',
  dockerfile: 'docker', docker: 'docker',
  json: 'json', yaml: 'yaml', yml: 'yaml',
  css: 'css', scss: 'css', html: 'markup', xml: 'markup', markup: 'markup',
  sql: 'sql', text: 'text', txt: 'text', '': 'text',
}

// GitHub Dark 기반 커스텀 테마 — 주석(comment)은 녹색(#3FB950)으로 강조
const theme = {
  'code[class*="language-"]': { color: '#E6EDF3', background: 'none', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13.5, lineHeight: 1.75, whiteSpace: 'pre' },
  'pre[class*="language-"]': { color: '#E6EDF3', background: '#0d1117', margin: 0, padding: '18px 20px', overflow: 'auto' },
  comment: { color: '#3FB950', fontStyle: 'italic' },
  prolog: { color: '#3FB950' },
  doctype: { color: '#3FB950' },
  cdata: { color: '#3FB950' },
  punctuation: { color: '#C9D1D9' },
  property: { color: '#79C0FF' },
  tag: { color: '#7EE787' },
  boolean: { color: '#79C0FF' },
  number: { color: '#79C0FF' },
  constant: { color: '#79C0FF' },
  symbol: { color: '#79C0FF' },
  selector: { color: '#7EE787' },
  'attr-name': { color: '#79C0FF' },
  string: { color: '#A5D6FF' },
  char: { color: '#A5D6FF' },
  builtin: { color: '#FFA657' },
  inserted: { color: '#A5D6FF' },
  operator: { color: '#FF7B72' },
  entity: { color: '#A5D6FF' },
  url: { color: '#A5D6FF' },
  variable: { color: '#FFA657' },
  atrule: { color: '#FF7B72' },
  'attr-value': { color: '#A5D6FF' },
  function: { color: '#D2A8FF' },
  'class-name': { color: '#FFA657' },
  keyword: { color: '#FF7B72' },
  regex: { color: '#7EE787' },
  important: { color: '#FF7B72' },
  deleted: { color: '#FF7B72' },
}

export default function CodeBlock({ code, lang = '' }) {
  const [copied, setCopied] = useState(false)
  const clean = String(code).replace(/\n$/, '')
  const language = LANG[lang.toLowerCase()] || 'text'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(clean)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = clean
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* noop */ }
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div style={{ margin: '20px 0', borderRadius: 12, overflow: 'hidden', border: '1px solid #21262d' }}>
      {/* 헤더: 언어 라벨 + 복사 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#161b22', padding: '8px 8px 8px 16px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#8893A7', textTransform: 'uppercase' }}>{lang || 'code'}</span>
        <button onClick={copy} aria-label="코드 복사" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
          background: copied ? 'rgba(63,185,80,0.16)' : 'rgba(255,255,255,0.06)',
          color: copied ? '#3FB950' : '#C9D1D9', fontSize: 12, fontWeight: 600,
          border: `1px solid ${copied ? 'rgba(63,185,80,0.5)' : 'rgba(255,255,255,0.12)'}`, transition: 'all .2s',
        }}>
          {copied ? (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3FB950" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>복사됨</>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>복사</>
          )}
        </button>
      </div>
      {/* 코드 본문 */}
      <SyntaxHighlighter language={language} style={theme} className="md-code" customStyle={{ borderRadius: 0, margin: 0 }} codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } }}>
        {clean}
      </SyntaxHighlighter>
    </div>
  )
}
