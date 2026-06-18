# 배포·버그 119

실습 중 가장 자주 막히는 10가지 — 증상 → 원인 → 해결. 에러 메시지째 Claude Code에 붙여넣으면 절반은 끝.

## HTTP 상태 코드 기초 — 숫자가 곧 단서

웹은 요청을 보내면 서버가 3자리 숫자(상태 코드)로 답합니다. 앞자리만 봐도 성격을 알 수 있어요. 브라우저 개발자도구(F12) → Network 탭에서 각 요청의 코드를 확인하는 습관을 들이세요.

- 1xx 정보 — 처리 중(거의 볼 일 없음)
- 2xx 성공 — 요청이 잘 처리됨
- 3xx 리다이렉트 — 다른 곳으로 이동
- 4xx 클라이언트(내 요청) 잘못 — URL·입력·인증 문제
- 5xx 서버 잘못 — 서버 코드·인프라 문제

> 💡 **Tip!** 기억법: 4xx = "너(내 요청) 잘못", 5xx = "나(서버) 잘못". 4xx면 보낸 요청을, 5xx면 서버 로그를 먼저 의심하세요.

## 자주 보는 코드

| 코드 | 의미 | 흔한 원인 · 대처 |
| --- | --- | --- |
| 200 OK | 정상 처리 | 문제 없음 |
| 201 Created | 생성 성공(POST) | 리소스가 새로 만들어짐 |
| 204 No Content | 성공, 본문 없음 | DELETE·UPDATE 후 흔함 |
| 301 / 302 | 영구 / 임시 이동 | 리다이렉트 — 도메인·경로 변경 |
| 304 Not Modified | 캐시 그대로 사용 | 바뀐 게 없어 캐시 응답(정상) |
| 400 Bad Request | 요청 형식 오류 | 파라미터·JSON 형식 확인 |
| 401 Unauthorized | 인증 안 됨 | 로그인·토큰·세션 확인 |
| 403 Forbidden | 권한 없음 | RLS·접근 권한 확인 |
| 404 Not Found | 경로·리소스 없음 | URL 오타·라우팅·Vite base·SPA 404 트릭 |
| 405 Method Not Allowed | 메서드 안 맞음 | GET/POST 등 호출 방식 확인 |
| 409 Conflict | 충돌(중복 등) | unique 제약·동시성 |
| 422 Unprocessable | 검증 실패 | 입력값 유효성 확인 |
| 429 Too Many Requests | 요청 한도 초과 | rate limit — 재시도 간격(백오프) 두기 |
| 500 Internal Server Error | 서버 코드 오류 | 서버/Edge Function 로그 확인 |
| 502 Bad Gateway | 게이트웨이 오류 | 프록시·업스트림 서버 상태 |
| 503 Service Unavailable | 일시 불가(과부하·점검) | 잠시 후 재시도 |
| 504 Gateway Timeout | 업스트림 응답 지연 | 타임아웃·외부 API 지연 확인 |

> ⚠️ **주의** 500이 떴다고 코드만 붙들지 마세요 — 진짜 원인은 서버 로그에 있습니다. Supabase Edge Function은 대시보드 Logs, GitHub Actions는 실행 로그를 먼저 보세요.

## 자주 막히는 10가지 (증상 → 원인 → 해결)

| 증상 | 원인 | 해결 |
| --- | --- | --- |
| 배포 후 새로고침하면 404 | SPA 라우팅을 정적 서버가 모름 | 404.html 리다이렉트 트릭 또는 HashRouter, base 경로 설정 |
| 배포본이 흰 화면·CSS 깨짐 | Vite base 경로 불일치 | vite.config의 base를 './' 또는 '/저장소명/'으로 |
| 로컬은 되는데 배포본 기능 마비 | .env가 빌드에 안 들어감 | GitHub Actions Secret 등록 / .env 주입 확인 |
| 배포본에서 로그인·AI 안 됨 | VITE_ 환경변수 미설정 | 브라우저 노출용은 VITE_ 접두사, 빌드 시 주입 필요 |
| 콘솔에 CORS 에러 | 브라우저에서 외부 API 직접 호출 | Supabase Edge Function 프록시 경유로 변경 |
| Supabase infinite recursion in policy | RLS 정책이 자기 테이블을 다시 조회 | 정책에서 자기참조 제거 / security definer 함수로 분리 |
| 데이터 0행·권한 오류 | RLS가 anon을 차단 | 읽기 정책 추가 또는 인증 세션으로 호출 |
| 빌드 실패: noUnusedLocals | 미사용 import·변수 | 제거하거나 실제로 사용 |
| 커스텀 도메인이 풀림 | public/CNAME 누락 | CNAME 파일 유지 + DNS 레코드 확인 |
| push했는데 배포가 안 됨 | Actions 워크플로 실패 | gh run list로 실패 로그 확인 후 원인 수정 |

> 💡 **Tip!** 막히면 에러 메시지를 그대로 복사해 "이 에러의 원인과 해결을 단계로 알려줘"라고 붙여넣으세요. 추측보다 메시지가 답을 더 빨리 줍니다.

## 디버깅 3원칙

- 한 번에 하나만 바꾼다 — 여러 개 동시에 고치면 무엇이 효과였는지 모른다.
- 에러 메시지를 끝까지 읽는다 — 파일·라인·원인이 대부분 적혀 있다.
- 재현 → 격리 → 수정 → 재확인 — 고쳤다고 믿지 말고 다시 돌려본다.
