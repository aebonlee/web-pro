# docs — 커리큘럼 데이터

이 사이트의 강의 본문은 교재 내용을 **웹페이지로 재구성**하여 제공합니다.
학습자는 사이트에서 직접 공부하며, 교재 원본 파일(PDF)은 배포하지 않습니다.

## 구성
- `curriculum/` — 구조화 커리큘럼 메타데이터(JSON)
  - `react-1.json`(1~4장), `react-2.json`(5~8장), `ai-1.json`(1~4장), `ai-2.json`(5~8장)
  - → `src/data/curriculum.js` 로 병합되어 목차·카드·진도에 사용

## 강의 본문
- 각 챕터의 전체 본문(설명 + 코드 + 실습 소스)은 `src/content/<챕터id>.md` 로 작성되어
  강의 상세 페이지(`/lesson/:id`)에서 렌더링됩니다.
- 실습 예제 목록: `src/data/labs.js`

## 트랙별 챕터
### React 프론트엔드
1. JSX 문법과 React 기본 개념 · 2. Props와 State · 3. UI 디자인 및 구현 · 4. 상태관리/데이터 연동
5. API 연동과 인증 · 6. 리액트 프로젝트 설계 · 7. 리팩터링과 배포 · 8. 프로젝트 실무 적용

### AI 웹 서비스
1. FastAPI/Hugging Face · 2. Transformers · 3. NLP 웹 서비스 · 4. 이미지 생성
5. 음성 AI · 6. 컴퓨터 비전 · 7. 멀티모달 · 8. 배포와 운영
