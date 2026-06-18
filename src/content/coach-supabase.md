# Supabase 실전 패턴

로그인·RLS·Edge Function — AI 서비스의 백엔드를 백엔드 없이. 키 안전 수칙 ②(Edge Function)의 실전판.

## 1. 소셜 로그인 (구글·카카오)

대시보드 Authentication → Providers에서 구글·카카오를 켜고 키를 넣은 뒤, 코드는 한 줄입니다.

```typescript
// 로그인
await supabase.auth.signInWithOAuth({ provider: 'google' }); // 또는 'kakao'

// 현재 세션 확인
const { data: { session } } = await supabase.auth.getSession();

// 로그아웃
await supabase.auth.signOut();
```

## 2. RLS(Row Level Security) — "내 데이터만"

테이블을 만들면 RLS를 켜고, "본인 행만" 접근하도록 정책을 답니다. RLS가 없으면 anon 키로 누구나 전체를 읽습니다.

```sql
alter table chats enable row level security;

-- 본인이 만든 행만 읽기
create policy "read own" on chats
  for select using (auth.uid() = user_id);

-- 본인 행만 쓰기
create policy "insert own" on chats
  for insert with check (auth.uid() = user_id);
```

## 3. Edge Function으로 API 키 보호

LLM 호출은 브라우저가 아니라 Edge Function에서. 키는 Supabase Secrets에만 두고, 로그인 세션이 없으면 401을 반환합니다.

```typescript
// supabase/functions/ask/index.ts (요지)
const auth = req.headers.get('Authorization');
if (!auth) return new Response('Unauthorized', { status: 401 });
const key = Deno.env.get('SOLAR_API_KEY');     // Secrets에만 존재
const r = await fetch('https://api.upstage.ai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
return new Response(await r.text(), { headers: { 'Content-Type': 'application/json' } });
```

## 자주 겪는 함정

- infinite recursion in policy → 정책 안에서 같은 테이블을 다시 select하지 말 것. 필요하면 security definer 함수로 분리.
- 데이터가 0행 → RLS는 켰는데 정책이 없음. select 정책을 추가했는지 확인.
- anon 키를 service_role로 착각 → 클라이언트엔 anon만. service_role은 절대 노출 금지(키 안전 수칙).

> ℹ️ 구조 한 줄 요약: [브라우저] → (로그인 세션) → [Edge Function: 키 보호] → [LLM]. 키는 Edge Function Secrets에만, 데이터는 RLS로 본인 것만.

---

## 비용 사고 대응 — 한도 초과 경고에서 종결까지

한도 초과 경고 메일에서 원인 특정·삭제·재발 방지까지 — 실제 운영 사례 기반 사고 대응 교안. (중급 · 강의 40분 + 실습 30분)

> ℹ️ Supabase 실전 패턴 · 실제 운영 사례 기반 교안 — 난이도: 중급 · 소요: 강의 40분 + 실습 30분

## 학습 목표

이 단원을 마치면 다음을 할 수 있다.

- Supabase 한도 초과 경고 메일을 읽고 유예 기간(grace period)의 의미와 마감 시점(UTC)을 정확히 해석한다.
- Usage 대시보드에서 어떤 항목이 초과됐는지 식별하고, 초과 항목별로 대응 방향이 어떻게 달라지는지 판단한다.
- SQL로 버킷별 스토리지 사용량을 추적해 원인 파일을 특정한다.
- 삭제 / 이전 / 플랜 업그레이드 중 상황에 맞는 처치를 선택하고, 안전하게 실행한다.
- 같은 사고가 재발하지 않도록 구조적 예방 장치를 설계한다.

## 1. 사건 개요 (실화)

운영 중인 Supabase 조직에 어느 날 다음 경고가 도착했다 — "Organization exceeded its quota in the previous billing cycle. You have a grace period until 13 Jun to bring usage back under quota."

- 조직에는 다수의 교육 플랫폼 사이트가 한 인프라에 물려 있는 상태
- 한 달 뒤 유료 결제 기능이 붙는 서비스 런칭을 앞둔 시점
- 경고를 확인한 날이 유예 마감 당일

> 💡 **Tip!** 💬 생각해보기 — 이 시점에서 가장 먼저 확인해야 할 것은 무엇일까? (힌트: "무엇이 초과됐는가"를 모르면 어떤 대응도 고를 수 없다)

## 2. 1단계 — 증상 읽기: Usage 대시보드

Dashboard → Organization → Usage 에서 실제로 확인된 수치:

| 항목 | 사용량 | 한도 | 비율 |
| --- | --- | --- | --- |
| Storage Size | 2.118 GB | 1 GB | 212% ⚠️ |
| Database Size | 0.076 GB | 0.5 GB | 15% |
| Egress | 0.4 GB | 5 GB | 8% |
| MAU | 323 | 50,000 | <1% |
| Edge Function 호출 | 316 | 500,000 | <1% |

## 읽는 법

- 초과 항목은 단 하나, Storage. 나머지는 전부 여유 → 트래픽 문제가 아니라 정적 파일 적체 문제
- 초과 항목에 따라 대응이 완전히 달라진다 (아래 표)

| 초과 항목 | 의심 원인 | 대응 방향 |
| --- | --- | --- |
| Storage | 미디어/문서 파일 적체 | 파일 정리, 외부 스토리지 이전 |
| Egress | 트래픽 증가, 대용량 다운로드 | CDN 캐싱, 정적 호스팅 분리 |
| MAU | 사용자 증가 (좋은 신호!) | 플랜 업그레이드 (수익화 검토) |
| DB Size | 데이터/로그 적체 | 오래된 데이터 아카이빙, 인덱스 점검 |

> ⚠️ **주의** 흔한 함정 — Egress가 원인일 거라고 짐작하고 CDN부터 손대면 헛수고가 된다. 반드시 수치를 먼저 본다. 진단 없는 처방은 없다.

## 3. 2단계 — 흔한 혼동: 로컬 디스크 ≠ 클라우드 스토리지

```bash
$ df -h
/dev/disk1s7   932Gi   180Gi   721Gi   21%   /System/Volumes/Data
```

"내 디스크는 721GB나 남았는데?" — 이건 내 컴퓨터의 디스크다. Supabase Storage 사용량은 클라우드 버킷에 있고, df 로는 절대 보이지 않는다.

| 구분 | 위치 | 확인 방법 |
| --- | --- | --- |
| 로컬 디스크 | 내 컴퓨터 | df -h |
| Supabase Storage | Supabase 클라우드 | 대시보드 Usage 또는 SQL |
| Supabase DB | Supabase 클라우드 | 대시보드 또는 pg_database_size() |

## 4. 3단계 — 원인 특정: 버킷별 용량 추적 SQL

의심 프로젝트의 SQL Editor에서 실행:

```sql
SELECT bucket_id,
       COUNT(*) AS file_count,
       pg_size_pretty(SUM((metadata->>'size')::bigint)) AS total_size
FROM storage.objects
GROUP BY bucket_id
ORDER BY SUM((metadata->>'size')::bigint) DESC;
```

실행 결과:

| bucket_id | file_count | total_size |
| --- | --- | --- |
| (특정 클라이언트)-editions | 441 | 2025 MB |

버킷 하나가 초과분의 사실상 전부. 정체는 — 이미 종료(취소)된 외부 프로젝트가 사용하던 지면 PDF 자료였다.

> ℹ️ 핵심 통찰 — 한도를 잠식한 것은 살아있는 서비스가 아니라 폐기된 프로젝트의 유산이었다. 사이트가 수십 개 규모가 되면 "만든 것을 기억하는 것"도 운영 업무다. 죽은 프로젝트는 조용히 인프라를 먹다가 청구서로 발견된다.

## 5. 4단계 — 처치 결정

## 결정 트리

```text
초과 파일의 정체는?
├─ 살아있는 서비스의 자산
│   ├─ 공개 정적 자산 (교안 이미지, 공개 PDF)
│   │   → 정적 호스팅(GitHub Pages, CDN)으로 이전. Storage에 둘 이유 없음
│   └─ 인증 필요한 자산 (라이선스 콘텐츠, 사용자 업로드)
│       → Storage가 제자리. 플랜 업그레이드 또는 수명주기 정책으로 관리
└─ 종료된 프로젝트의 유산
    ├─ 계약상 보관/반환/파기 의무 확인  ← 지우기 전에 반드시!
    └─ 확인 후: 로컬 백업 1부 → 버킷 삭제
```

## 이번 사례의 판단

- 파일 소유자(클라이언트)와의 관계 확인 → 프로젝트 취소로 보존 의무 없음
- 라이선스 지면 자료 → 오히려 계속 공개하는 쪽이 저작권 리스크
- 결론: 삭제

## 안전한 삭제 패턴 (스크립트 핵심 구조)

```javascript
// 1) dry-run 모드: 삭제 대상을 보여주기만 한다
//    node delete-bucket.mjs --dry-run
// 2) 검증 후 실제 삭제: 100개 단위 청크로 분할 삭제
// 3) 빈 버킷 제거

const { data } = await supabase.storage.from(BUCKET)
  .list(prefix, { limit: 100, offset });   // 페이지네이션 + 폴더 재귀

await supabase.storage.from(BUCKET).remove(chunk);  // 청크 단위 삭제
await supabase.storage.deleteBucket(BUCKET);        // 마지막에 버킷 자체 삭제
```

## 삭제 원칙 3가지

- dry-run 먼저. 삭제 대상 수와 용량이 예상(441개 / 2,025MB)과 일치하는지 눈으로 확인한 후 실행한다.
- service_role 키는 RLS를 우회하는 관리자 키. 로컬에서만 쓰고, 코드에 하드코딩하거나 커밋하지 않는다. (→ "AI API Key 안전 수칙" 단원 참조)
- 삭제해도 Usage 수치는 바로 안 떨어진다. 반영까지 1시간 이상 걸릴 수 있다. 마감 직전에 삭제로 승부 보는 계획은 세우지 않는다.

## 6. 5단계 — 마감 시점 계산: 청구는 UTC로 돈다

Supabase의 청구 주기와 마감은 UTC(그리니치 표준시) 기준이다.

- "6월 13일 마감" = UTC 6월 13일 23:59 = 한국 시간(KST, UTC+9) 6월 14일 08:59
- 즉 한국에서 보면 표시된 날짜보다 약 9시간의 추가 여유가 있다

> ⚠️ **주의** 단, 이 여유에 기대는 습관은 위험하다. 시간대 계산은 최후의 확인 수단이지 계획의 전제가 아니다.

## 유예 기간(grace period)의 무서운 규칙

- 유예 기간 안에 한도 아래로 복귀하면 제한 없음
- 그러나 유예가 한 번 소진된 조직은, 다음 초과 시 경고 없이 즉시 제한된다 (두 번째 유예는 없다)
- → 사고를 한 번 겪은 조직은 한도 턱밑 운영을 피하고 여유 마진을 확보해야 한다

## 7. 패턴 정리 — 재발 방지 설계

이번 사고에서 추출되는 운영 패턴 5가지:

## 패턴 1 · 스토리지 역할 분담 원칙

| 파일 성격 | 올바른 위치 |
| --- | --- |
| 공개 정적 자산 (이미지, 공개 PDF, JS/CSS) | 정적 호스팅 (GitHub Pages, Cloudflare) |
| 인증 필요 파일 (사용자 업로드, 라이선스 콘텐츠) | Supabase Storage + RLS/signed URL |
| 강의 영상 | YouTube(일부공개)/Vimeo 임베드 |

Supabase는 Auth와 DB API에 집중시킨다. 사이트가 늘어도 Storage 비용이 따라 늘지 않는 구조.

## 패턴 2 · 프로젝트 수명주기 관리

- 프로젝트 상태 필드 운영: 운영 중 / 아카이브 / 폐기
- 종료된 프로젝트는 종료 절차 체크리스트를 거친다: 계약상 데이터 의무 확인 → 백업 → 버킷/테이블 정리 → 포탈에서 아카이브 처리

## 패턴 3 · 비용 귀속의 분리

- 클라이언트 프로젝트의 파일이 내 인프라 비용을 쓰고 있지 않은가?
- 외주/분양 프로젝트는 별도 조직(org)으로 분리해 소유권 이전과 비용 정산을 깔끔하게
- 견적에 인프라 운영비 항목을 포함하는 관행

## 패턴 4 · 수익 서비스와 실험 서비스의 인프라 분리

| 조직 | 구성 | 플랜 / Spend Cap |
| --- | --- | --- |
| 수익 조직 | 결제 붙은 상용 서비스 | Pro + Spend Cap OFF (서비스 연속성 우선) + 사용량 알림 |
| 실험 조직 | 학습 플랫폼, 프로토타입 | Free 또는 Pro + Spend Cap ON (비용 고정 우선) |

결제가 진행 중인 서비스의 Auth/DB가 한도 때문에 멈추는 시나리오는 허용 불가. 돈을 받는 인프라에는 일일 백업이 있어야 한다 (Pro: 일일 백업 7일 보관).

## 패턴 5 · 주기적 헬스체크

- 버킷별 용량 SQL을 월 1회 정기 점검 항목에 포함
- Usage 대시보드의 사용량 알림 설정
- 다수 사이트 운영 시: 전체 사이트 응답 상태 + 스토리지 현황 대시보드 자동화

## 8. 사고 대응 체크리스트 (요약)

```text
□ 1. 경고 메일에서 유예 마감일 확인 — UTC 기준으로 환산
□ 2. Usage 대시보드에서 초과 항목 특정 (Storage? Egress? MAU?)
□ 3. (Storage라면) SQL로 버킷별 용량 조회 → 원인 버킷 특정
□ 4. 파일 정체 파악: 살아있는 자산인가, 죽은 프로젝트의 유산인가
□ 5. 계약/저작권상 보관·파기 의무 확인
□ 6. 처치 선택: 삭제 / 이전 / 업그레이드
□ 7. 삭제 시: dry-run → 검증 → 청크 삭제 → 백업 보관
□ 8. 수치 반영 지연 감안하여 마감 전 대시보드 재확인
□ 9. 재발 방지: 역할 분담·수명주기·조직 분리 패턴 적용
```

## 9. 실습 과제

- [기초] 본인 프로젝트의 SQL Editor에서 버킷별 용량 조회 쿼리를 실행하고, 결과를 캡처해 제출하라. 가장 큰 버킷의 파일들은 위 "역할 분담 원칙" 기준으로 올바른 위치에 있는가?
- [응용] 본인 프로젝트의 Usage 대시보드를 열고, 5개 주요 항목(Storage/DB/Egress/MAU/Functions)의 현재 비율을 표로 정리하라. 6개월 후 사용자가 10배가 되면 어떤 항목이 가장 먼저 한도에 닿을지 예측하고 근거를 쓰라.
- [심화] dry-run 모드가 있는 버킷 정리 스크립트를 작성하라. 조건: ① --dry-run 플래그 지원 ② 폴더 재귀 탐색 ③ 청크 단위 삭제 ④ service_role 키는 환경변수로만 받기.

> 💡 **Tip!** 핵심 한 줄 — "진단 없는 처방은 없다. 수치를 먼저 보고, 지우기 전에 dry-run, 그리고 죽은 프로젝트도 청구서에는 살아 있다."
