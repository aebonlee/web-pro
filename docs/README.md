# docs — 학습자료 원본

이 사이트의 커리큘럼은 아래 교재 PDF에서 추출·정리되었습니다.

## 구성
- `pdf/` — 원본 교재 PDF 16종 (React 8장 + AI 웹 서비스 8장)
- `text/` — 각 PDF를 `pdftotext -layout` 으로 추출한 텍스트
- `curriculum/` — 텍스트를 정제해 만든 구조화 커리큘럼 JSON
  - `react-1.json` (1~4장), `react-2.json` (5~8장)
  - `ai-1.json` (1~4장), `ai-2.json` (5~8장)
  - → 빌드용 데이터 `src/data/curriculum.js` 로 병합됨

## 트랙별 챕터
### React 프론트엔드
1. JSX 문법과 React 기본 개념
2. Props와 State 이해
3. UI 디자인 및 구현
4. 상태관리 및 데이터 연동
5. API 연동과 인증 프로세스 구현
6. 리액트 프로젝트 설계
7. 프로젝트 리팩터링과 배포
8. 프로젝트 실무 적용

### AI 웹 서비스
1. FastAPI와 Hugging Face
2. Transformers 활용
3. NLP 웹 서비스
4. 이미지 생성 (Stable Diffusion)
5. 음성 AI 웹 프로젝트 (Whisper/TTS)
6. 컴퓨터 비전 웹 서비스
7. 멀티모달 (CLIP/LLaVA)
8. 배포와 운영

## 재생성
```bash
# PDF → 텍스트
for f in docs/pdf/*.pdf; do pdftotext -layout "$f" "docs/text/$(basename "${f%.pdf}").txt"; done
# 커리큘럼 JSON은 추출 텍스트를 정제하여 작성 (docs/curriculum/*.json)
```
