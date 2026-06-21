import { useEffect } from 'react'

const BASE = 'DreamIT 부트캠프'
const DEFAULT_DESC = '웹 기초(HTML·CSS·JS)부터 React 프론트엔드, 생성형 AI 웹 서비스, 실전 배포까지 — 28개 챕터 146개 강의의 실무형 웹 개발 학습 플랫폼.'

// 라우트(페이지)별로 document.title 과 meta description 을 동적으로 갱신.
// SPA 내 탐색·브라우저 탭·북마크 품질을 높인다.
// (소셜 크롤러용 정적 OG는 index.html에서 별도 제공)
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE

    const desc = description || DEFAULT_DESC
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', desc)

    // og:title / og:description 도 함께 갱신(클라이언트 공유 버튼 등에 유효)
    setOg('og:title', title ? `${title} · ${BASE}` : BASE)
    setOg('og:description', desc)

    return () => {
      document.title = BASE
    }
  }, [title, description])
}

function setOg(prop, content) {
  let tag = document.querySelector(`meta[property="${prop}"]`)
  if (tag) tag.setAttribute('content', content)
}
