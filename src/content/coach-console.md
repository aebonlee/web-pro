# Google·Kakao 개발자 콘솔 — 로그인·필수 설정

소셜 로그인(구글·카카오)을 붙이려면 각 **개발자 콘솔에서 앱을 등록**하고 **리다이렉트 URI**를 정확히 맞춰야 합니다. 한 글자만 틀려도 로그인 직후 에러가 납니다. Supabase Auth 기준으로 끝까지 따라 할 수 있게 정리했습니다.

## 0. 전체 흐름 한눈에

```text
사용자 → [내 사이트 로그인 버튼]
       → Supabase Auth
       → Google/Kakao 동의 화면
       → Supabase 콜백(https://<프로젝트>.supabase.co/auth/v1/callback)
       → 내 사이트 /auth/callback 로 복귀(세션 발급)
```

> 💡 **Tip!** 리다이렉트는 **두 곳**에 등록해야 합니다. ① 개발자 콘솔에는 **Supabase 콜백 URL**, ② Supabase에는 **내 사이트 URL**. 이 둘을 헷갈리면 대부분의 로그인 오류가 납니다.

## 1. 공통 — Supabase 쪽 설정

Supabase 대시보드 → **Authentication → URL Configuration**:

| 항목 | 값 |
| --- | --- |
| Site URL | `https://bootcamp.dreamitbiz.com` |
| Redirect URLs | `https://bootcamp.dreamitbiz.com/auth/callback` 와 로컬 `http://localhost:5173/auth/callback` |

그리고 **Authentication → Providers** 에서 Google·Kakao를 각각 켜고, 아래에서 발급받은 **Client ID / Secret**을 입력합니다.

## 2. Google — Google Cloud Console

1. [console.cloud.google.com](https://console.cloud.google.com) → 프로젝트 생성
2. **API 및 서비스 → OAuth 동의 화면** 구성 (앱 이름·지원 이메일·도메인)
3. **사용자 인증 정보 → 사용자 인증 정보 만들기 → OAuth 클라이언트 ID**
   - 애플리케이션 유형: **웹 애플리케이션**
   - **승인된 리디렉션 URI** 에 Supabase 콜백 추가:

```text
https://<프로젝트ref>.supabase.co/auth/v1/callback
```

4. 발급된 **클라이언트 ID / 보안 비밀**을 Supabase의 Google Provider에 입력

> ⚠️ **주의** 동의 화면이 "테스트" 상태면 등록한 테스트 사용자만 로그인됩니다. 일반 공개하려면 **게시(Production)** 로 전환하세요.

## 3. Kakao — Kakao Developers

1. [developers.kakao.com](https://developers.kakao.com) → **내 애플리케이션 → 애플리케이션 추가**
2. **앱 키**: REST API 키를 확인 (Supabase에 Client ID로 사용)
3. **카카오 로그인 → 활성화 ON**
4. **카카오 로그인 → Redirect URI** 에 Supabase 콜백 등록:

```text
https://<프로젝트ref>.supabase.co/auth/v1/callback
```

5. **동의 항목**: 닉네임·프로필 등 받을 정보를 "필수/선택"으로 설정
6. **보안 → Client Secret** 발급 후 사용 ON → Supabase의 Kakao Provider에 ID/Secret 입력

> 💡 **Tip!** 카카오는 **플랫폼 → Web** 에 사이트 도메인(`https://bootcamp.dreamitbiz.com`)을 등록해야 정상 동작합니다. 도메인 등록을 빠뜨리는 실수가 잦습니다.

## 4. 코드 — OAuth 호출

설정이 끝나면 앱에서는 한 줄로 로그인합니다. redirectTo가 **Supabase에 등록한 URL과 정확히 일치**해야 합니다.

```jsx
// 구글 / 카카오 로그인
await supabase.auth.signInWithOAuth({
  provider, // 'google' | 'kakao'
  options: { redirectTo: `${window.location.origin}/auth/callback` },
})
```

## 5. 자주 나는 에러와 원인

| 증상 | 원인 |
| --- | --- |
| `redirect_uri_mismatch` | 콘솔의 리디렉션 URI ≠ Supabase 콜백 URL (오타·끝 슬래시) |
| 로그인 후 빈 화면/에러 | Supabase Redirect URLs에 내 `/auth/callback` 미등록 |
| 카카오만 실패 | 플랫폼(Web) 도메인 미등록 또는 동의항목 미설정 |
| 특정 계정만 됨 | 구글 동의 화면이 "테스트" 상태 |

## 6. 셀프 체크 ✅

- [ ] Supabase: Site URL + Redirect URLs(운영·로컬) 등록
- [ ] Supabase: Google·Kakao Provider ON + ID/Secret 입력
- [ ] Google: 승인된 리디렉션 URI = Supabase 콜백
- [ ] Kakao: Redirect URI = Supabase 콜백 + 플랫폼 Web 도메인 등록
- [ ] 로컬·운영 양쪽에서 실제 로그인 테스트
