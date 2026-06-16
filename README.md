# WEB PRO — 웹개발 부트캠프

React 프론트엔드부터 생성형 AI 웹 서비스까지, **16개 챕터 · 62개 강의**로 완성하는 실무형 웹 개발 학습 플랫폼.

🔗 **https://web-pro.dreamitbiz.com**

NOVAWORKS 디자인 아티팩트(블루 그라데이션 + 오렌지 포인트, Pretendard, 플로팅 필 헤더)를 React로 포팅하고,
저장소의 교재 PDF(`docs/`)를 기반으로 커리큘럼을 구성했습니다.

## 기술 스택
- **React 18 + Vite 5** — SPA, `react-router-dom`
- **Supabase** — 인증(구글·카카오 OAuth) + 학습 진도 저장 (`webpro_` 접두사)
- **sharp** — OG 이미지(1200×630) 자동 생성
- **GitHub Actions** — `main` 푸시 시 GitHub Pages 자동 배포 (커스텀 도메인)

## 두 개의 학습 트랙
| 트랙 | 내용 | 챕터 |
|------|------|------|
| **React 프론트엔드** | JSX · Props/State · UI · 상태관리 · API/인증 · 설계 · 배포 · 실무 | 8 |
| **AI 웹 서비스** | FastAPI/Hugging Face · Transformers · NLP · 이미지생성 · 음성 · CV · 멀티모달 · 배포운영 | 8 |

## 로컬 개발
```bash
npm install
cp .env.example .env.local   # Supabase 값 입력
npm run dev                  # http://localhost:5173
npm run og                   # public/og-image.png 재생성
npm run build && npm run preview
```

## 환경 변수
| 키 | 설명 |
|----|------|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon 키 |

> 배포 시 동일 키를 GitHub 저장소 **Secrets** 에 등록하면 Actions 빌드에서 주입됩니다.

## Supabase 준비
1. `supabase/schema.sql` 을 SQL Editor에서 실행 (webpro_ 테이블 + RLS).
2. Authentication → Providers 에서 **Google**, **Kakao** 활성화.
3. Redirect URL 에 `https://web-pro.dreamitbiz.com/auth/callback` (및 로컬 `http://localhost:5173/auth/callback`) 추가.

## 폴더 구조
```
src/
  components/   Header, Footer, Logo, Reveal, ui(ChapterCard 등)
  pages/        Home, Curriculum, Track, Lesson, Login, MyPage, About, AuthCallback, NotFound
  hooks/        useAuth, useProgress, useReveal
  lib/          supabase, db
  data/         curriculum.js  (← docs/curriculum 에서 생성)
  theme.js      디자인 토큰
scripts/gen-og.mjs   OG 이미지 생성기
supabase/schema.sql  DB 스키마
docs/                원본 학습자료(PDF·추출 텍스트·커리큘럼 JSON)
```

## 학습자료 출처
`docs/` 폴더 참조 — 원본 PDF 16종, 추출 텍스트, 커리큘럼 JSON. 자세한 내용은 [`docs/README.md`](docs/README.md).

---
© DreamIT Biz · Powered by React · Vite · Supabase
