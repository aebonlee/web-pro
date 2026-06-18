# SEO·OG 메타 & 공유 캐시 잡기

링크를 카톡·슬랙·페이스북에 붙였을 때 뜨는 제목·설명·썸네일은 모두 **메타 태그**가 결정합니다. 검색 노출(SEO)과 공유 미리보기(OG)를 한 번에 잡고, "분명 바꿨는데 옛 이미지가 그대로"인 캐시 문제까지 해결하는 실전 가이드입니다.

## 1. 메타 태그 풀세트

`index.html`의 `<head>`에 아래를 넣습니다. SEO 기본(title·description) + Open Graph + Twitter Card 세트입니다.

```html
<!-- 기본 SEO -->
<title>DreamIT 부트캠프 — React & AI 웹 서비스</title>
<meta name="description" content="웹 기초부터 React·AI·배포까지 실무형 학습 플랫폼." />

<!-- Open Graph (카카오·페이스북·슬랙 공유) -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://bootcamp.dreamitbiz.com/" />
<meta property="og:title" content="DreamIT 부트캠프" />
<meta property="og:description" content="웹 개발의 처음부터 끝까지, 한 곳에서." />
<meta property="og:image" content="https://bootcamp.dreamitbiz.com/og-image-v2.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="DreamIT 부트캠프" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://bootcamp.dreamitbiz.com/og-image-v2.png" />
```

> 💡 **Tip!** og:image는 **절대 URL**(https://...)이어야 합니다. 상대 경로(`/og-image.png`)는 크롤러가 못 읽습니다.

## 2. OG 이미지 규격

| 항목 | 권장값 |
| --- | --- |
| 크기 | **1200 × 630** (1.91:1) |
| 용량 | 1MB 이하 (작을수록 빠름) |
| 포맷 | PNG / JPG |
| 텍스트 | 가장자리 80px 여백 안에 배치 (잘림 방지) |

이미지는 디자인 툴로 만들어도 되지만, 코드로 생성하면 내용이 바뀔 때 자동화할 수 있습니다. 이 사이트는 `sharp`로 SVG를 PNG로 렌더링합니다.

```bash
# SVG → 1200x630 PNG 생성 (scripts/gen-og.mjs)
npm run og
```

## 3. 한글이 깨지는 진짜 원인 — 폰트

> ⚠️ **주의** OG 이미지의 한글이 □□□(두부)로 깨진다면 **렌더링 환경에 한글 폰트가 없는 것**입니다. macOS·Windows에는 한글 폰트가 있지만, **GitHub Actions(우분투) 같은 CI 서버에는 없습니다.**

해결책 두 가지:

- **(권장) 로컬에서 생성해 커밋**: 한글 폰트가 있는 내 PC에서 `npm run og`로 만든 PNG를 그대로 커밋하고, CI에서는 재생성하지 않습니다.
- **CI에 폰트 설치**: 워크플로에 `sudo apt-get install -y fonts-noto-cjk` 단계를 추가합니다.

## 4. "바꿨는데 안 바뀐다" — 공유 캐시

이미지를 새로 올렸는데도 옛날 썸네일이 계속 보이면 **캐시** 때문입니다. 두 층이 있습니다.

- **CDN/브라우저 캐시**: Cloudflare·브라우저가 이미지를 며칠씩 들고 있습니다.
- **소셜 스크랩 캐시**: 카카오·페이스북은 한 번 긁은 미리보기를 저장합니다.

가장 확실한 해결책은 **파일명에 버전을 붙이는 것**입니다. URL이 바뀌면 어떤 캐시도 옛것을 줄 수 없습니다.

```text
og-image.png   →   og-image-v2.png   (메타 태그의 og:image도 함께 교체)
```

> 💡 **Tip!** 소셜 미리보기는 **디버거에서 강제로 다시 긁게** 할 수 있습니다.
> 카카오: [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing) → "스크랩 정보 초기화"
> 페이스북: Sharing Debugger → "Scrape Again"

## 5. 제출 전 셀프 체크 ✅

- [ ] title·description이 페이지 내용과 일치하는가
- [ ] og:image가 **절대 URL**이고 1200×630인가
- [ ] 한글이 안 깨지는가(실제 PNG를 눈으로 확인)
- [ ] 내용이 바뀌었다면 파일명 버전을 올렸는가
- [ ] 카카오 디버거로 실제 미리보기를 확인했는가
