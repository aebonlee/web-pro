# Claude Code 활용 설계서

DreamIT Biz Edition — 한 번 설정하면 모든 세션·프로젝트에서 재현되는 품질. "내가 안 봐도 지켜지는 구조".

## 들어가며 — 왜 "설정"인가

대상 환경은 VS Code 터미널 CLI + Claude 웹(점검·논의) + 모바일(스마트폰·태블릿, Remote Control)입니다. 핵심 원칙은 하나 — "내가 안 봐도 지켜지는 구조". 매번 프롬프트로 부탁하면 빠뜨릴 수 있지만, 스킬·훅·플러그인으로 표준을 한 번 박아두면 모든 세션·모든 프로젝트에서 같은 품질이 재현됩니다. (적용 프로젝트: AI Reboot Academy · template 시리즈 · 신규 사이트)

> ⚠️ **주의** 설정 문법은 Claude Code 업데이트가 잦습니다. 적용 전 `claude update` 후 공식 문서(docs.claude.com/en/docs/claude-code)와 반드시 대조하세요.

## 1. 커스텀 스킬(Skills) — 나의 표준을 명령어로

반복되는 작업 방식을 /명령어 하나로 만드는 기능입니다. 위치는 ~/.claude/skills/<이름>/SKILL.md(개인용·전 프로젝트) 또는 .claude/skills/<이름>/SKILL.md(프로젝트 전용). /<이름>으로 직접 부르거나, Claude가 상황에 맞으면 자동으로 호출합니다. (기존 .claude/commands/는 레거시 — 신규는 skills 형식)

## ① 아트디렉션 스킬 (art-direction)

```markdown
---
name: art-direction
description: 신규 웹 프로젝트의 아트디렉션 스펙 작성. 무드·팔레트·이미지 스타일에서 미드저니 프롬프트와 CSS 토큰을 파생.
---
# 작성 절차
1. 무드 한 줄 선언 · 키워드 3 · 금지 3 · 레퍼런스를 질문한다.
2. 팔레트를 수채 원리로: Paper(60%)·Ink(30%)·Pigment(8%)·Accent(2%)·Wash.
   순백·순흑 금지, 본문 대비 WCAG AA 이상.
3. 이미지 스타일(화풍·구도·조명·질감·색 HEX·금지)을 정의.
4. 미드저니 프롬프트 4종(히어로 21:9 / 오브제 1:1 / 워시 / 아이콘)을 영어로 파생.
5. CSS 토큰(:root 변수, soft-light 오버레이, 그레인, 리빌 모션)을 생성.
6. 시그니처(이 주제가 아니면 존재할 수 없는 장치)가 비면 코드를 시작하지 않는다.
7. 산출물을 CLAUDE.md의 ## Art Direction 섹션으로 저장.
# 검증: 다른 주제에 옮겨도 어울리면 실패(주제 고유 어휘만). 강조색은 시작 CTA·전환 CTA 두 곳에만.
```

## ② 메타 위생 스킬 (meta-hygiene)

```markdown
---
name: meta-hygiene
description: 배포 전 메타 태그·SEO 위생 점검. canonical, OG/Twitter 풀세트, robots, theme-color, viewport, 파비콘 검사·생성.
---
# 점검 항목 (전부 통과해야 배포)
- title + meta description (한국어, 검색 의도)
- canonical URL
- OG: title/description/image(1200x630)/url/type/site_name/locale(ko_KR)
- twitter:card = summary_large_image + image/title/description
- meta robots (index,follow — 비공개는 noindex 명시)
- theme-color (팔레트의 Ink 또는 Pigment) / 404 / favicon / apple-touch-icon
누락 시: 항목별로 생성해 <head>에 삽입하고 변경 diff를 보고한다.
```

## ③ 교재 변환 스킬 (textbook-convert)

```markdown
---
name: textbook-convert
description: PPTX 워크북을 한글 .docx 교재로 변환하는 표준 파이프라인. zoom-patch와 검증 단계 필수.
---
# 절차 (순서 고정, 생략 금지)
1. python-docx 헬퍼로 변환 (스타일 맵 적용)
2. zoom-patch 적용 (필수 — 누락 시 한글 환경 배율 깨짐)
3. 검증: 목차-본문 페이지 일치 / 그림 번호 연속 / 표 깨짐 / 한글 폰트 임베드
4. 검증 리포트 출력 후에만 완료 보고. 실패 항목은 수정 후 재검증.
```

## 스킬 운영 팁

- 반복 3회 이상 한 작업부터 스킬로 만든다. 1회성은 그냥 프롬프트로.
- 이름은 동사형/도메인명으로 짧게 — Claude의 자동 호출 정확도가 올라간다.
- 수업용 스킬은 프로젝트 스코프(.claude/skills/)에 넣어 저장소째 학생에게 배포 가능.

## 2. 훅(Hooks) — 반드시 실행되어야 하는 것

"항상 지켜져야 하는 규칙"은 프롬프트(어길 수 있음)가 아니라 훅(어길 수 없음)으로 만듭니다. PreToolUse = 도구 실행 직전 검사(차단 가능), PostToolUse = 실행 직후 후처리. 설정 위치는 ~/.claude/settings.json(전역) 또는 .claude/settings.json(프로젝트).

## ① 시크릿 스캔 훅 (최우선) — .claude/hooks/secret-scan.sh

```bash
#!/bin/bash
# stdin으로 도구 입력(JSON)을 받아 시크릿 패턴 검사. 발견 시 exit 2 → 도구 실행 차단.
INPUT=$(cat)
PATTERNS='sk-[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9-]{20,}|AIza[0-9A-Za-z_-]{30,}|eyJhbGciOi|SUPABASE_SERVICE_ROLE'
if echo "$INPUT" | grep -qE "$PATTERNS"; then
  echo "시크릿 패턴 감지 — 작업을 차단했습니다. .env로 분리하세요." >&2
  exit 2
fi
exit 0
```

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Write|Edit|Bash",
        "hooks": [ { "type": "command", "command": "bash .claude/hooks/secret-scan.sh" } ] }
    ]
  }
}
```

## ② 커밋 전 게이트 — .claude/hooks/push-gate.sh (출시 프로젝트 전용)

```bash
#!/bin/bash
# push 직전 최소 안전선: .gitignore에 .env 존재 + 스테이징에 .env류 없음
git check-ignore -q .env || { echo ".gitignore에 .env 없음" >&2; exit 2; }
git diff --cached --name-only | grep -qE '\.env($|\.)' && { echo ".env가 스테이징됨" >&2; exit 2; }
exit 0
```

## 훅 운영 팁

- 훅 스크립트는 저장소에 커밋한다 → 학생·협업자도 동일 안전선(플러그인 배포와 연동).
- 훅의 본질은 "차단". 알림만 필요하면 PostToolUse + exit 0.
- 과도한 훅은 속도를 깎는다 — 시크릿·푸시 게이트 2개로 시작해 필요시 추가.

## 3. 내장 리뷰 명령 + 모델 전략 — 출시 품질 루틴

| 시점 | 명령 | 용도 |
| --- | --- | --- |
| 새 프로젝트 시작 | /init | CLAUDE.md 골격 자동 생성(이후 직접 다듬기) |
| PR 머지 전 | /code-review | 변경분 품질·일관성 리뷰 |
| 출시·결제 변경 전 | /security-review | 인증·결제·입력 검증 취약점 점검 |

출시 적용 예: 결제 채널 교체 등 민감한 변경 → /security-review → 지적사항 수정 → /code-review → main 머지. 이 4단계를 출시 체크리스트에 고정합니다.

## 모델 전략 (역할 분담)

- 기본: Opus(에이전트 기본값) — 일반 개발 작업
- /model fable : Fable 5(Opus 상위 티어) — 보안 검토·복잡한 마이그레이션·아키텍처 판단
- Sonnet/Haiku : 단순 반복(리네이밍·포맷팅·더미데이터) — 속도·비용 절약
- 원칙: "막히면 즉시 상위 모델" — 시간 대비 가장 이득.

## 4. 플러그인 — "AI Reboot Academy 플러그인"

플러그인 = 스킬 + 훅 + 슬래시 명령 + MCP 정의를 하나의 설치 단위로 묶은 패키지. /plugin 명령으로 설치하면 학생 입장에선 명령 한 번에 강사의 안전선·표준이 전부 깔립니다.

```text
ai-reboot-plugin/
├── .claude-plugin/plugin.json   # 이름·버전·설명 메타
├── skills/
│   ├── submit-check/SKILL.md     # 제출 전 셀프체크 자동화
│   └── meta-hygiene/SKILL.md     # 메타 위생 점검
├── hooks/hooks.json              # 시크릿 스캔 PreToolUse
└── README.md                     # 설치법 + 수칙 요약
```

```json
// .claude-plugin/plugin.json
{
  "name": "ai-reboot-academy",
  "version": "1.0.0",
  "description": "쉬었음 과정 표준 안전선: 시크릿 스캔 훅 + 제출 전 점검 스킬 + 메타 위생"
}
```

```markdown
---
name: submit-check
description: 경진대회 제출 전 최종 점검. 시크릿·gitignore·localStorage 키·Edge Function 경유·메타 태그를 일괄 검사하고 합격/불합격 리포트를 만든다.
---
1. 전체 코드에서 sk-, key=, token 검색 → 발견 시 불합격 + 위치 보고
2. .gitignore의 .env 존재 / git 히스토리 시크릿 검사
3. localStorage 키 저장 코드 잔존 여부 (실습 코드 삭제 확인)
4. AI 호출이 Supabase Edge Function 경유인지 호출 경로 추적
5. meta-hygiene 스킬 호출로 배포 위생 점검
6. 합격/불합격 + 수정 지시 리포트 출력 (루브릭 보안 항목과 동일 기준)
```

## 배포 시나리오

- 플러그인 저장소를 GitHub에 공개 (예: aebonlee/ai-reboot-plugin)
- 수업: "Claude Code에서 /plugin 으로 이 저장소를 설치하세요" 한 줄
- 이후 학생의 모든 푸시가 시크릿 스캔을 통과해야 하고, /submit-check 한 번이면 제출 준비 완료

> 💡 **Tip!** 루브릭과 플러그인이 같은 기준 → "심사 기준을 도구로 미리 나눠주는" 역설계 교수법의 완성형.

## 5. 서브에이전트 + 병렬 작업 — 동시 다중 프로젝트

서브에이전트 = Task로 띄우는 별도 컨텍스트의 Claude 세션. 본 세션 맥락을 오염시키지 않습니다. 정의 위치는 .claude/agents/<이름>.md — 컨텍스트 격리·병렬이 목적일 때만 사용.

```markdown
---
name: security-reviewer
description: 인증·결제·입력검증·RLS 취약점 점검 전담. 출시 전·결제/로그인 변경 시 사용. 코드 수정 없이 보고서만.
tools: Read, Grep, Glob
---
너는 보안 검토 전담이다. IDOR·권한 상승·시크릿 노출·RLS 누락·입력 미검증을
심각도(Critical/High/Med)별로 분류해 파일:라인과 함께 보고하라. 수정은 하지 않는다.
```

```markdown
---
name: docs-fetcher
description: 라이브러리 공식 문서·API 레퍼런스를 조사해 요약만 본 세션에 전달(컨텍스트 격리용).
tools: WebSearch, WebFetch, Read
---
질문받은 API/라이브러리의 공식 문서를 찾아 "필요한 부분만" 코드 예시 포함 1페이지로 요약하라.
```

## 병렬 운영 패턴

- 백그라운드 실행: 빌드·테스트 같은 긴 명령은 백그라운드로 → 완료 알림 받고 다음 작업.
- 세션 분리: 프로젝트마다 터미널 탭 1개 = Claude Code 세션 1개(각자 다른 CLAUDE.md로 안 섞임).
- 검토 병렬화: 본 세션은 기능 개발, security-reviewer는 동시에 어제 머지분 검토 → 보고서만 합류.

> ⚠️ **주의** 주의: 같은 파일을 두 세션이 동시에 고치지 않도록 영역을 나눌 것(프론트/백, 기능/검토).

## 6. Remote Control + 모바일 — 자리를 비워도 이어지는 작업

Claude Code 세션을 모바일 앱/웹에서 이어받아 확인·지시할 수 있습니다. Away Summary는 멈춰둔 세션에 돌아오면 그동안 진행 맥락을 요약(기본 활성), "Push when Claude decides" 설정 시 Claude가 판단해 진행 상황을 폰으로 알립니다.

| 상황 | 하는 일 |
| --- | --- |
| 출발 전 | 작업 브리프를 건다: "X 기능 구현+테스트. 막히면 멈추고 알림" |
| 운전 중 | 아무것도 안 본다. Claude는 일하고 알림은 쌓인다(조수석 동승자 확인은 OK) |
| 휴게소·정차 | 스마트폰으로 Away Summary 확인 → 한 줄 지시 → 다시 출발 |
| 강의 중 | 쉬는 시간 10분에 푸시 확인 → 승인/방향 수정 |
| 귀가 후 | VS Code에서 세션 이어받아 마무리 + /code-review |

> ⚠️ **주의** 안전 수칙: 기기가 아무리 좋아도 주행 중 화면 확인은 금지. 이 워크플로우의 존재 이유가 "운전 중엔 안 봐도 되게 만드는 것"입니다.

- 설정 확인: /config 에서 Remote Control·Away Summary 항목 확인
- 모바일 Claude 앱 로그인 계정이 CLI 계정과 동일해야 세션이 보임

## 도입 순서 (권장 로드맵)

| 주차 | 작업 | 효과 대상 |
| --- | --- | --- |
| 이번 주 | ② 시크릿 스캔 훅 + 푸시 게이트 | 출시 프로젝트 + 학생 수업(즉시) |
| 이번 주 | ③ /security-review → /code-review 출시 루틴 고정 | 출시 프로젝트 |
| 다음 주 | ① 스킬 3종(art-direction·meta-hygiene·textbook-convert) | 모든 신규 프로젝트 |
| 경진대회 전 | ④ AI Reboot 플러그인 패키징 + 학생 배포 | 수업·루브릭 연동 |
| 출시 후 | ⑤ security-reviewer 에이전트 상시화 + 병렬 패턴 | 멀티 프로젝트 운영 |
| 상시 | ⑥ Remote Control 워크플로우 | 이동·강의 중 |

> ℹ️ DreamIT Biz · Claude Code 활용 설계서 v1.0 — 문법은 업데이트마다 변할 수 있으니 적용 전 공식 문서 대조 필수.
