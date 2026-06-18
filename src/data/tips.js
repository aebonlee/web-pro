// 코칭·부록 전반에서 모은 실전 Tips!
export const TIPS = [
  {
    "text": "좋은 아키텍처는 그림 한 장으로 설명됩니다. Day 7 \"AI 통합 아키텍처\" 도식처럼 [브라우저]→[Edge Function]→[LLM], [Supabase Auth/DB]를 한 장에 그려 보세요.",
    "source": "1회차 · AI 서비스 아키텍처 코칭",
    "sourceId": "coach-1",
    "category": "coaching"
  },
  {
    "text": "AI 앱은 응답이 느릴 수 있습니다 — 진행 단계 표시·예시 입력·스트리밍으로 \"멈춘 게 아니라 일하는 중\"임을 보여주세요. 빈 화면이 가장 나쁜 UX입니다.",
    "source": "2회차 · UI/UX 개선 코칭",
    "sourceId": "coach-2",
    "category": "coaching"
  },
  {
    "text": "구현 예시 26개가 전부 이 패턴입니다 — system 프롬프트로 JSON 스키마를 강제하고, 키가 없으면 휴리스틱 폴백으로 동작. \"프로젝트 구현 예시\" 갤러리의 파이프라인 탭에서 직접 확인하세요.",
    "source": "3회차 · LLM 최적화 코칭",
    "sourceId": "coach-3",
    "category": "coaching"
  },
  {
    "text": "루브릭과 플러그인이 같은 기준 → \"심사 기준을 도구로 미리 나눠주는\" 역설계 교수법의 완성형.",
    "source": "Claude Code 활용 설계서",
    "sourceId": "coach-claude",
    "category": "appendix"
  },
  {
    "text": "\"오늘 할 일: ① 결제 버튼 색 수정 ② 공지 페이지 추가 ③ 어제 머지분 점검. ①부터 시작하고, 끝나면 보고하고 다음으로 넘어가.\"",
    "source": "Claude Code와 일하는 하루 — 일상 가이드",
    "sourceId": "coach-daily",
    "category": "appendix"
  },
  {
    "text": "기억법: 4xx = \"너(내 요청) 잘못\", 5xx = \"나(서버) 잘못\". 4xx면 보낸 요청을, 5xx면 서버 로그를 먼저 의심하세요.",
    "source": "배포·버그 119",
    "sourceId": "coach-deploy",
    "category": "appendix"
  },
  {
    "text": "막히면 에러 메시지를 그대로 복사해 \"이 에러의 원인과 해결을 단계로 알려줘\"라고 붙여넣으세요. 추측보다 메시지가 답을 더 빨리 줍니다.",
    "source": "배포·버그 119",
    "sourceId": "coach-deploy",
    "category": "appendix"
  },
  {
    "text": "API 키는 항상 안전 수칙대로 — .env + .gitignore, 그리고 호출은 Supabase Edge Function 경유로 키를 숨기세요. (부록: AI API Key 안전 수칙 참고)",
    "source": "국산 LLM 선택 가이드",
    "sourceId": "coach-llm",
    "category": "appendix"
  },
  {
    "text": "💬 생각해보기 — 이 시점에서 가장 먼저 확인해야 할 것은 무엇일까? (힌트: \"무엇이 초과됐는가\"를 모르면 어떤 대응도 고를 수 없다)",
    "source": "Supabase 실전 패턴",
    "sourceId": "coach-supabase",
    "category": "appendix"
  },
  {
    "text": "핵심 한 줄 — \"진단 없는 처방은 없다. 수치를 먼저 보고, 지우기 전에 dry-run, 그리고 죽은 프로젝트도 청구서에는 살아 있다.\"",
    "source": "Supabase 실전 패턴",
    "sourceId": "coach-supabase",
    "category": "appendix"
  },
  {
    "text": "og:image는 절대 URL(https://...)이어야 합니다. 상대 경로는 크롤러가 못 읽습니다.",
    "source": "SEO·OG 메타 & 공유 캐시 잡기",
    "sourceId": "coach-seo",
    "category": "appendix"
  },
  {
    "text": "소셜 미리보기는 디버거에서 강제로 다시 긁게 할 수 있습니다 — 카카오 공유 디버거 → '스크랩 정보 초기화'.",
    "source": "SEO·OG 메타 & 공유 캐시 잡기",
    "sourceId": "coach-seo",
    "category": "appendix"
  },
  {
    "text": "OG 한글이 깨지면 렌더링 환경에 한글 폰트가 없는 것 — 로컬에서 생성해 커밋하거나 CI에 fonts-noto-cjk 설치.",
    "source": "SEO·OG 메타 & 공유 캐시 잡기",
    "sourceId": "coach-seo",
    "category": "appendix"
  },
  {
    "text": "바꿔도 안 바뀌면 파일명에 버전을 붙이세요(og-image-v2.png). URL이 바뀌면 캐시가 옛것을 못 줍니다.",
    "source": "SEO·OG 메타 & 공유 캐시 잡기",
    "sourceId": "coach-seo",
    "category": "appendix"
  },
  {
    "text": "리다이렉트는 두 곳에 등록: 개발자 콘솔엔 Supabase 콜백 URL, Supabase엔 내 사이트 /auth/callback.",
    "source": "Google·Kakao 개발자 콘솔 — 로그인·필수 설정",
    "sourceId": "coach-console",
    "category": "appendix"
  },
  {
    "text": "카카오는 플랫폼 → Web에 사이트 도메인을 등록해야 정상 동작합니다.",
    "source": "Google·Kakao 개발자 콘솔 — 로그인·필수 설정",
    "sourceId": "coach-console",
    "category": "appendix"
  },
  {
    "text": "redirect_uri_mismatch 에러의 99%는 콘솔 URI와 Supabase 콜백 URL의 오타·끝 슬래시 차이입니다.",
    "source": "Google·Kakao 개발자 콘솔 — 로그인·필수 설정",
    "sourceId": "coach-console",
    "category": "appendix"
  }
];

export const TOTAL_TIPS = TIPS.length;
