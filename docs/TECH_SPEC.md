# 마음역 MVP 기술명세서

- 문서 버전: 1.0
- 기술 수준: 바이브 코딩 입문 프로젝트
- 실행 우선순위: 로컬 실행 → 정적 데모 → 공개 배포 검토

## 1. 기술 목표

React/Vite 기반의 단일 페이지 웹앱으로 구현한다. 백엔드와 GPT API 없이 브라우저 기능, Unsplash API, localStorage만으로 핵심 흐름을 완성한다.

## 2. 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| UI | React + Vite | 빠른 개발과 단순한 로컬 실행 |
| 언어 | JavaScript | 입문 범위와 구현 속도 우선 |
| 스타일 | CSS Modules 또는 일반 CSS | 추가 프레임워크 없이 구조 학습 |
| 라우팅 | React Router | 화면 흐름과 뒤로가기를 명확히 처리 |
| 상태 | React Context + useReducer | 외부 상태 라이브러리 없이 세션 관리 |
| 영속 저장 | localStorage | 로그인·백엔드 없는 로컬 기록 |
| 사진 | Unsplash REST API | 감정별 사진 검색 |
| 음성 입력 | Web Speech API 계열 기능 감지 | API 비용 없는 Push-to-Talk |
| 음성 출력 | SpeechSynthesis API | 안내 질문 읽기 |
| 카드 출력 | DOM-to-image 라이브러리 또는 Canvas | PNG 생성 |
| 공유 | Web Share API + 다운로드 대체 | 모바일 공유와 데스크톱 대체 지원 |
| 테스트 | Vitest + React Testing Library | 규칙과 주요 컴포넌트 검증 |

패키지 버전은 프로젝트 생성 시점의 안정 버전을 설치하고 lockfile로 고정한다.

## 3. 시스템 구성

```text
┌──────────────── React/Vite SPA ────────────────┐
│                                               │
│ 화면 컴포넌트                                 │
│   ↕                                           │
│ Session Context / Reducer                     │
│   ├─ Reflection Rule Engine                   │
│   ├─ Voice Adapter                            │
│   ├─ Share Card Renderer                      │
│   └─ Crisis Keyword Guard                     │
│                                               │
│ 서비스 계층                                   │
│   ├─ Unsplash Client ───── Unsplash API       │
│   ├─ Storage Service ───── localStorage       │
│   └─ Share Service ─────── Browser APIs       │
└───────────────────────────────────────────────┘
```

생성형 AI, 애플리케이션 서버, 데이터베이스는 사용하지 않는다.

## 4. 권장 디렉터리 구조

```text
maeum-station/
├─ public/
│  ├─ fallback/
│  └─ icons/
├─ src/
│  ├─ app/
│  │  ├─ App.jsx
│  │  └─ router.jsx
│  ├─ components/
│  │  ├─ common/
│  │  ├─ emotion/
│  │  ├─ photo/
│  │  ├─ reflection/
│  │  ├─ voice/
│  │  └─ share-card/
│  ├─ pages/
│  │  ├─ HomePage.jsx
│  │  ├─ ConsentPage.jsx
│  │  ├─ EmotionPage.jsx
│  │  ├─ PhotoPage.jsx
│  │  ├─ ReflectionPage.jsx
│  │  ├─ ActionPage.jsx
│  │  ├─ ResultPage.jsx
│  │  ├─ ShareCardPage.jsx
│  │  ├─ HistoryPage.jsx
│  │  ├─ HelpPage.jsx
│  │  └─ SettingsPage.jsx
│  ├─ context/
│  │  └─ SessionContext.jsx
│  ├─ data/
│  │  ├─ emotions.js
│  │  ├─ questions.js
│  │  ├─ actions.js
│  │  ├─ stationNames.js
│  │  └─ crisisPatterns.js
│  ├─ hooks/
│  │  ├─ useSpeechRecognition.js
│  │  ├─ useSpeechSynthesis.js
│  │  └─ useLocalStorage.js
│  ├─ services/
│  │  ├─ unsplash.js
│  │  ├─ storage.js
│  │  ├─ reflectionEngine.js
│  │  ├─ crisisGuard.js
│  │  └─ share.js
│  ├─ styles/
│  └─ test/
├─ docs/
├─ .env.example
├─ .gitignore
├─ index.html
├─ package.json
└─ vite.config.js
```

## 5. 라우팅

| 경로 | 화면 | 직접 접근 처리 |
|---|---|---|
| `/` | 홈 | 항상 가능 |
| `/consent` | 안내·저장 선택 | 항상 가능 |
| `/session/emotion` | 감정 선택 | 세션 없으면 생성 |
| `/session/photo` | 사진 선택 | 감정 단계 미완료 시 이전 화면 안내 |
| `/session/reflect/:step` | 성찰 질문 | 유효한 단계만 허용 |
| `/session/action` | 작은 행동 | 이전 답변 유지 |
| `/session/result` | 비공개 결과 | 완료 세션 필요 |
| `/session/share` | 카드 편집 | 완료 세션 필요 |
| `/history` | 기록 목록 | 항상 가능 |
| `/history/:id` | 기록 상세 | 없으면 목록으로 이동 |
| `/help` | 도움받기 | 항상 가능 |
| `/settings` | 설정 | 항상 가능 |

GitHub Pages 배포 시 새로고침 404를 피하기 위해 HashRouter 사용을 우선 검토한다.

## 6. 상태 모델

### 진행 중 세션

```js
const session = {
  id: "uuid",
  startedAt: "2026-09-30T12:00:00.000Z",
  emotions: ["anxious"],
  intensity: 3,
  photo: {
    id: "unsplash-photo-id",
    url: "https://images.unsplash.com/...",
    alt: "foggy railway",
    photographerName: "Name",
    photographerUrl: "https://unsplash.com/@name?...",
    downloadLocation: "https://api.unsplash.com/photos/.../download"
  },
  answers: {
    photoReason: "",
    focus: "",
    emotionSpecific: ""
  },
  selectedNeed: "rest",
  selectedAction: "breathe_3m",
  customAction: "",
  stationName: "안개역",
  privateSummary: "",
  publicText: "",
  status: "in_progress"
};
```

### 저장 기록

```js
const reflectionRecord = {
  schemaVersion: 1,
  id: "uuid",
  completedAt: "2026-09-30T12:07:00.000Z",
  emotions: ["anxious"],
  intensity: 3,
  photo: { /* 필요한 메타데이터만 */ },
  answers: { /* 사용자가 저장에 동의한 경우 */ },
  selectedNeed: "rest",
  selectedAction: "breathe_3m",
  stationName: "안개역",
  privateSummary: "...",
  cardStyle: {
    ratio: "portrait",
    align: "center",
    overlay: 0.45,
    grayscale: false
  }
};
```

## 7. localStorage 키

| 키 | 내용 |
|---|---|
| `maeumStation:settings:v1` | 음성 출력, 자동 저장 등 설정 |
| `maeumStation:draft:v1` | 진행 중 세션 1개 |
| `maeumStation:records:v1` | 완료 기록 배열 |
| `maeumStation:onboarding:v1` | 첫 안내 확인 여부 |

모든 읽기는 JSON 파싱 오류를 처리하고, 실패 시 안전한 기본값으로 복구한다. 저장 용량 오류는 사용자에게 기록 정리를 안내한다.

## 8. 규칙 엔진

### 입력

- 선택한 대표 감정
- 선택한 필요
- 현재 질문 단계
- 선택한 작은 행동

### 출력

- 다음 질문 ID
- 질문 문구
- 필요 선택지
- 마음역 이름
- 결과 문장

```js
function getQuestionFlow(primaryEmotion) {
  return questionFlows[primaryEmotion] ?? questionFlows.unknown;
}

function buildResult({ emotion, need, action, stationName }) {
  return {
    stationName,
    summary: `오늘 나는 ${emotion.label} 마음을 알아차렸습니다.`,
    nextStep: action.label,
  };
}
```

규칙 함수는 UI와 분리하고 순수 함수로 작성해 단위 테스트한다.

## 9. Unsplash 연동

### 필요한 요청

- 사진 검색: `/search/photos`
- 선택·저장·공유 시 다운로드 추적: 응답의 `links.download_location`

### 감정 검색어 매핑 예시

```js
const emotionQueries = {
  calm: ["calm lake", "quiet forest", "soft sunlight"],
  anxious: ["fog landscape", "rain window", "abstract shadow"],
  tired: ["quiet room", "evening sky", "resting nature"],
  lonely: ["empty road", "single light", "distant ocean"],
  angry: ["storm clouds", "red abstract", "rough sea"],
  joyful: ["sunlight", "colorful flowers", "bright sky"],
  unknown: ["abstract nature", "changing weather", "open landscape"]
};
```

사진 검색어는 심리 상태 진단이 아니라 시각적 선택지를 제공하기 위한 것이다.

### 환경변수

```env
VITE_UNSPLASH_ACCESS_KEY=
```

`.env.local`은 Git에 포함하지 않는다. `VITE_` 값은 빌드 결과에서 확인 가능하므로 공개 GitHub Pages에서 비밀 키 보호 수단으로 보지 않는다.

### 배포 모드

```text
로컬 개발: .env.local의 Unsplash Access Key 사용
공개 정적 데모: 샘플 JSON 또는 제한된 데모 데이터 사용
공개 실서비스: 별도 서버리스 프록시 추가 후 재검토
```

## 10. 음성 입력

브라우저에서 음성 인식 생성자를 기능 감지한다.

```js
const Recognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
```

구현 규칙:

- `Recognition`이 없으면 음성 버튼을 비활성화하고 텍스트 사용을 안내한다.
- 언어는 `ko-KR`을 기본값으로 한다.
- 연속 청취가 아닌 한 번 말하기 방식으로 설정한다.
- 중간 결과는 상태 표시에만 사용하고 최종 결과만 입력창에 반영한다.
- 오류와 권한 거부를 구분해 메시지를 표시한다.
- 컴포넌트 해제 시 인식을 중지한다.
- 인식 결과를 자동 제출하지 않는다.

브라우저 구현에 따라 음성 처리가 외부 서비스에 의존할 수 있으므로 UI에서 `브라우저 음성 기능 사용`으로 표현하며 완전한 로컬 처리를 보장하지 않는다.

## 11. 음성 출력

`window.speechSynthesis`와 `SpeechSynthesisUtterance`를 사용한다.

- 언어: `ko-KR`
- 사용자가 재생 버튼을 눌렀을 때만 시작
- 질문 화면 이동 시 기존 발화를 취소
- 속도와 음높이는 기본값에서 시작
- 음성 목록이 늦게 로드되는 상황 처리
- 미지원 환경에서는 버튼 숨김

## 12. 위기 키워드 가드

```text
사용자 답변 제출
  → 정규화
  → 위기 패턴 검사
  → 일치: 도움 화면 표시
  → 불일치: 다음 질문 진행
```

구현 원칙:

- 패턴 목록은 `src/data/crisisPatterns.js`에서 관리한다.
- 단순 포함 검색과 정규식을 사용할 수 있으나 진단 점수는 만들지 않는다.
- 테스트에서는 긍정, 부정, 인용 표현에 대한 오탐 가능성을 확인한다.
- 로그나 분석 서버로 답변을 전송하지 않는다.
- 이 기능은 전문가 판단을 대체하지 않는 보조 장치임을 화면에 명시한다.

## 13. 카드 생성

### 카드 비율

| 이름 | 권장 캔버스 |
|---|---:|
| portrait | 1080 × 1350 |
| square | 1080 × 1080 |
| landscape | 1200 × 675 |
| story | 1080 × 1920 |

### 렌더링 요소

- 배경 사진
- 대비용 오버레이
- 마음역 이름
- 사용자가 승인한 공개 문장
- 다음 정거장 문구 선택사항
- 사진가·Unsplash 크레딧
- 마음역 워드마크 선택사항

외부 이미지 CORS로 카드 렌더링이 실패할 수 있으므로 개발 초기에 실제 Unsplash URL로 PNG 생성 가능 여부를 검증한다. 실패 시 Canvas 이미지 로딩 설정 또는 프록시 필요 여부를 판단한다.

## 14. 공유

```js
if (navigator.canShare?.({ files: [pngFile] })) {
  await navigator.share({ files: [pngFile], text: publicText });
} else {
  downloadFile(pngFile);
}
```

- 공유는 반드시 사용자 버튼 클릭으로 실행한다.
- 공유 직전 개인정보 확인 체크를 요구한다.
- 공유 취소는 오류로 표시하지 않는다.
- 클립보드 실패 시 수동 복사를 위한 입력창을 표시한다.

## 15. 개인정보와 보안

- 사용자 답변은 서버로 전송하지 않는다.
- 음성 원본을 저장하지 않는다.
- 분석·광고 SDK를 MVP에 넣지 않는다.
- 실제 `.env.local`을 커밋하지 않는다.
- 공개 배포에서는 Unsplash 키 노출 문제를 해결하기 전 실키를 포함하지 않는다.
- HTML로 사용자 입력을 직접 삽입하지 않고 React 텍스트 렌더링을 사용한다.
- 공유 카드에 포함될 문장은 사용자가 명시적으로 확인한다.
- localStorage가 암호화되지 않음을 첫 저장 시 알린다.

## 16. 오류 처리

| 상황 | 사용자 메시지 | 대체 행동 |
|---|---|---|
| 사진 API 실패 | 사진을 불러오지 못했습니다. | 재시도·샘플 사진 |
| 마이크 미지원 | 이 브라우저에서는 음성 입력을 지원하지 않습니다. | 텍스트 입력 |
| 마이크 거부 | 마이크 권한이 꺼져 있습니다. | 설정 안내·텍스트 입력 |
| 카드 생성 실패 | 이미지를 만들지 못했습니다. | 재시도·문구 복사 |
| 공유 미지원 | 바로 공유할 수 없는 환경입니다. | PNG 저장·문구 복사 |
| 저장 실패 | 브라우저 저장 공간이 부족합니다. | 이전 기록 삭제 안내 |

## 17. 테스트 계획

### 단위 테스트

- 감정별 질문 순서
- 마음역 이름 선택
- 결과 문장 조합
- 위기 패턴 일치·불일치
- localStorage 파싱 오류 복구

### 컴포넌트 테스트

- 감정 최대 3개 제한
- 음성 미지원 시 대체 UI
- 공유 개인정보 체크 전 버튼 비활성화
- 기록 개별·전체 삭제 확인

### 수동 테스트

- 모바일 360px 화면
- 마이크 허용·거부
- 새로고침 후 초안 복구
- Unsplash 네트워크 오류
- 긴 문장의 카드 줄바꿈
- Android·iOS 공유 메뉴
- GitHub Pages 경로 새로고침

## 18. 구현 순서

1. Vite React 프로젝트 생성과 라우팅
2. 감정 데이터와 Session reducer
3. 샘플 사진 기반 전체 화면 흐름
4. 규칙 기반 질문과 결과 생성
5. localStorage 기록
6. 카드 미리보기와 PNG 저장
7. Unsplash 검색과 크레딧·다운로드 추적
8. 음성 입력·출력
9. 위기 도움 화면과 패턴 가드
10. 기본 공유와 오류 대체
11. 테스트·접근성·모바일 점검
12. 공개 데모 데이터 모드와 GitHub Pages 배포

## 19. 완료 정의

- `npm install`과 `npm run dev`로 로컬 실행된다.
- GPT 또는 유료 AI API 없이 전체 핵심 흐름이 작동한다.
- Unsplash 키가 없을 때도 샘플 데이터로 사용할 수 있다.
- 텍스트 입력은 모든 지원 환경에서 작동한다.
- 음성 미지원 환경에서도 진행이 막히지 않는다.
- 세션을 저장·조회·삭제할 수 있다.
- 공유 카드 PNG를 생성할 수 있다.
- 민감한 원문이 자동으로 공유 카드에 들어가지 않는다.
- 도움 화면과 긴급 연락처를 언제든 열 수 있다.
- 저장소에 실제 API 키가 포함되지 않는다.
