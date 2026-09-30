# 마음역 기획·명세 문서 안내

마음역 MVP는 GPT 또는 다른 생성형 AI API 없이 동작하는 규칙 기반 자기성찰 웹앱으로 설계한다.

## 권장 검토 순서

1. `PRD.md` — 제품 목적, 대상 사용자, MVP 범위와 안전 원칙
2. `UX_FLOW.md` — 화면 구조, 와이어프레임, 텍스트·음성 사용자 흐름
3. `CONVERSATION_CONTENT.md` — 감정별 질문, 작은 행동, 결과 문장 규칙
4. `FUNCTIONAL_SPEC.md` — 기능 ID, 우선순위, 완료 조건
5. `TECH_SPEC.md` — React/Vite 구조, 데이터 모델, API·음성·저장·공유 구현 방식
6. `EXPERT_REVIEW_PACKET.md` — 전문가 콘텐츠 검수 체크리스트와 승인 기록

## 현재 확정 사항

- React + Vite + JavaScript
- 모바일 우선 반응형 웹앱
- GPT 및 유료 AI API 미사용
- 감정별 질문 템플릿과 선택 규칙 사용
- 텍스트 입력과 Push-to-Talk 음성 입력
- 브라우저 음성 인식·음성 합성 사용
- Unsplash 사진 검색 및 출처 표시
- localStorage에 선택적으로 기록 저장
- 공유 카드 PNG 생성과 기본 공유 메뉴
- GitHub Pages용 샘플 데이터 모드 제공

## 다음 작업

기술명세서의 구현 순서에 따라 Vite React 프로젝트를 생성하고, 먼저 샘플 사진만으로 전체 사용자 흐름을 완성한다. Unsplash와 음성 기능은 기본 흐름이 작동한 뒤 연결한다.
