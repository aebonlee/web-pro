// 코칭(기술코칭 4회) + 부록 가이드 — rest 학습데이터 이식 + bootcamp 신규
export const GUIDES = [
  {
    "id": "coach-1",
    "title": "1회차 · AI 서비스 아키텍처 코칭",
    "category": "coaching",
    "summary": "프로젝트의 전체 아키텍처를 검토하고 개선 방향을 코칭합니다.",
    "tags": [
      "아키텍처",
      "코칭",
      "LLM API",
      "리팩터링"
    ]
  },
  {
    "id": "coach-2",
    "title": "2회차 · UI/UX 개선 코칭",
    "category": "coaching",
    "summary": "사용자 경험과 인터페이스 디자인을 전문가와 함께 개선합니다.",
    "tags": [
      "UI/UX",
      "코칭",
      "접근성",
      "마이크로카피"
    ]
  },
  {
    "id": "coach-3",
    "title": "3회차 · LLM 최적화 코칭",
    "category": "coaching",
    "summary": "LLM API 호출 최적화와 프롬프트 튜닝을 코칭합니다.",
    "tags": [
      "LLM",
      "프롬프트",
      "비용 최적화",
      "캐싱"
    ]
  },
  {
    "id": "coach-4",
    "title": "4회차 · 경진대회 최종 점검",
    "category": "coaching",
    "summary": "경진대회 출품 전 최종 점검과 발표 리허설을 진행합니다.",
    "tags": [
      "경진대회",
      "최종 점검",
      "발표",
      "배포"
    ]
  },
  {
    "id": "coach-key",
    "title": "AI API Key 안전 수칙",
    "category": "appendix",
    "summary": "AI Reboot Academy · 학생 배포용 — 이 한 장만 지키면 키 사고의 99%는 일어나지 않습니다.",
    "tags": [
      "API Key",
      "보안",
      ".env",
      "시크릿"
    ]
  },
  {
    "id": "coach-claude",
    "title": "Claude Code 활용 설계서",
    "category": "appendix",
    "summary": "DreamIT Biz Edition — 한 번 설정하면 모든 세션·프로젝트에서 재현되는 품질. \"내가 안 봐도 지켜지는 구조\".",
    "tags": [
      "Claude Code",
      "스킬",
      "훅",
      "서브에이전트"
    ]
  },
  {
    "id": "coach-daily",
    "title": "Claude Code와 일하는 하루 — 일상 가이드",
    "category": "appendix",
    "summary": "설계서가 \"시스템을 어떻게 깔 것인가\"라면, 이 문서는 \"내일 아침부터 어떻게 살 것인가\". 설정 없음·외울 것 없음 — 습관 7개가 전부.",
    "tags": [
      "Claude Code",
      "일상 가이드",
      "습관",
      "워크플로우"
    ]
  },
  {
    "id": "coach-deploy",
    "title": "배포·버그 119",
    "category": "appendix",
    "summary": "실습 중 가장 자주 막히는 10가지 — 증상 → 원인 → 해결. 에러 메시지째 Claude Code에 붙여넣으면 절반은 끝.",
    "tags": [
      "배포",
      "디버깅",
      "HTTP 상태 코드",
      "트러블슈팅"
    ]
  },
  {
    "id": "coach-contest",
    "title": "경진대회 출품 가이드",
    "category": "appendix",
    "summary": "제출물 패키지 · 8슬라이드 · 3분 데모 · 예상 Q&A · 루브릭 자가채점 — 출품 직전 한 장.",
    "tags": [
      "경진대회",
      "출품",
      "발표",
      "루브릭"
    ]
  },
  {
    "id": "coach-llm",
    "title": "국산 LLM 선택 가이드",
    "category": "appendix",
    "summary": "경진대회 평가의 25%가 국산 LLM 활용 — 어떤 모델을, 어디에, 왜 쓸지 고르는 기준.",
    "tags": [
      "국산LLM",
      "Solar",
      "HyperCLOVA X",
      "EXAONE"
    ]
  },
  {
    "id": "coach-supabase",
    "title": "Supabase 실전 패턴",
    "category": "appendix",
    "summary": "로그인·RLS·Edge Function — AI 서비스의 백엔드를 백엔드 없이. 키 안전 수칙 ②(Edge Function)의 실전판.",
    "tags": [
      "Supabase",
      "RLS",
      "Edge Function",
      "비용관리"
    ]
  },
  {
    "id": "coach-seo",
    "title": "SEO·OG 메타 & 공유 캐시 잡기",
    "category": "appendix",
    "summary": "검색 노출(SEO)과 공유 미리보기(OG)를 한 번에 잡고, 옛 이미지가 계속 보이는 캐시 문제까지 해결합니다.",
    "tags": [
      "SEO",
      "Open Graph",
      "OG 이미지",
      "캐시"
    ]
  },
  {
    "id": "coach-console",
    "title": "Google·Kakao 개발자 콘솔 — 로그인·필수 설정",
    "category": "appendix",
    "summary": "소셜 로그인을 위한 구글·카카오 개발자 콘솔 앱 등록과 리다이렉트 URI 설정을 Supabase 기준으로 정리합니다.",
    "tags": [
      "OAuth",
      "Google",
      "Kakao",
      "Supabase"
    ]
  }
];

export const COACHING = GUIDES.filter(g => g.category === 'coaching');
export const APPENDIX = GUIDES.filter(g => g.category === 'appendix');
export const getGuide = (id) => GUIDES.find(g => g.id === id);
