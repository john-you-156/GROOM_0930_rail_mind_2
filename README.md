# 마음역

사진과 단계별 질문을 통해 오늘의 마음을 돌아보고, 작은 다음 행동을 정하는 React/Vite 자기성찰 웹앱입니다.

현재 버전은 GPT 또는 유료 AI API 없이 동작합니다.

## 구현된 기능

- 감정 최대 3개와 강도 선택
- 샘플 사진 또는 Unsplash API 사진 선택
- 감정별 규칙 기반 성찰 질문
- 텍스트 입력
- 지원 브라우저의 Push-to-Talk 음성 입력
- 브라우저 음성합성을 이용한 질문 읽기
- 작은 행동 선택과 마음역 결과 생성
- localStorage 기록 저장·조회·삭제
- 공유 카드 편집과 PNG 저장
- 지원 환경의 기본 공유 메뉴
- 위기 도움 화면과 긴급 연락처
- 모바일 우선 반응형 디자인

## 로컬 실행

Node.js와 npm 또는 pnpm이 필요합니다.

```bash
npm install
npm run dev
```

프로덕션 빌드:

```bash
npm run build
npm run preview
```

## Unsplash API 연결

API 키가 없어도 샘플 사진 모드로 모든 흐름을 사용할 수 있습니다.

실제 사진 검색을 연결하려면 프로젝트 루트에 `.env.local`을 만들고 Access Key를 입력합니다.

```env
VITE_UNSPLASH_ACCESS_KEY=your_access_key
```

`.env.local`은 Git에 포함되지 않습니다. `VITE_` 환경변수는 빌드된 브라우저 코드에서 확인할 수 있으므로 공개 배포 시 비밀 키 보호 수단으로 사용할 수 없습니다. 공개 서비스에서는 서버리스 프록시를 추가해야 합니다.

## 데이터와 개인정보

- 마음 기록은 현재 브라우저의 localStorage에만 저장됩니다.
- 음성 원본 파일은 저장하지 않습니다.
- 공유 카드에는 사용자가 확인한 문장만 포함합니다.
- localStorage는 암호화 저장소가 아니므로 공용 기기에서는 기록을 남기지 않는 것이 좋습니다.

## 중요 안내

마음역은 의료 서비스, 심리 진단 또는 전문 상담의 대체재가 아닙니다. 즉각적인 위험이 있는 경우 112 또는 119, 자살예방상담전화 109, 정신건강상담전화 1577-0199 등 사람의 도움을 먼저 이용해야 합니다.

## 기획·기술 문서

문서 검토 순서는 [`docs/README.md`](./docs/README.md)를 참고하세요.

전문가 검수는 [`docs/EXPERT_REVIEW_PACKET.md`](./docs/EXPERT_REVIEW_PACKET.md)에 기록하며, 현재 상태는 `검수 대기`입니다.

## GitHub Pages 배포

`.github/workflows/deploy-pages.yml`이 `main` 브랜치 푸시마다 테스트와 빌드를 실행하고 `dist`를 GitHub Pages에 배포합니다.

GitHub 저장소의 `Settings → Pages → Build and deployment`에서 Source를 `GitHub Actions`로 선택해야 합니다.

공개 GitHub Pages 빌드에는 Unsplash 키를 넣지 않으며 샘플 사진 모드로 동작합니다. 실제 Unsplash API를 공개 서비스에서 사용하려면 키를 숨기는 서버리스 프록시가 필요합니다.

## Vercel 공개 배포

Vercel로 배포하면 `api/photos.js`와 `api/download.js`가 서버리스 함수로 실행되어 공개 앱에서도 실제 Unsplash 사진을 사용할 수 있습니다.

1. Vercel에서 이 GitHub 저장소를 Import합니다.
2. 프로젝트 환경변수 `UNSPLASH_ACCESS_KEY`에 Unsplash Access Key를 저장합니다.
3. Production으로 배포합니다.

키 이름에 `VITE_`를 붙이지 않아야 브라우저 번들에 포함되지 않습니다. 프런트엔드는 같은 출처의 `/api/photos`만 호출하며, 프록시를 사용할 수 없는 환경에서는 샘플 사진으로 자동 전환됩니다.
