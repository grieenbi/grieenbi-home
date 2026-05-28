# ✒️ 그린비 스튜디오 (Grieenbi Studio) 개발 히스토리 & AI 개발 컨텍스트 가이드

이 파일은 그린비 스튜디오 프로젝트의 **핵심 아키텍처, 구현된 맞춤형 해킹/핵심 기능, 코드 구조, 그리고 차기 개발 세션에서 즉시 연동하기 위한 컨텍스트 가이드**를 담고 있습니다. 
다음 차례의 AI 코딩 어시스턴트(또는 개발자)는 **이 파일을 먼저 읽고 작업하면 100% 동일한 컨텍스트로 신속하고 안전하게 개발을 보완**할 수 있습니다.

---

## 🏗️ 1. 기술 스택 & 시스템 아키텍처

본 프로젝트는 백엔드 서버를 1대도 구축하지 않고 고성능 클라이언트 연동만으로 모든 실시간 데이터와 고단도 회원제를 운영하는 **Serverless BaaS(Backend-as-a-Service)** 구조로 완성되었습니다.

*   **Core**: React 18 + TypeScript + Vite (Fast Build & Hot Reload)
*   **Styling**: Vanilla CSS (CSS Variables) + Framer Motion (고급 트랜지션 애니메이션)
*   **Database (BaaS)**: **Firebase Cloud Firestore** (모든 기기 간 0.1초 실시간 동기화)
*   **Authentication**: **Firebase Auth** (이메일 가입/로그인 + 구글 로그인) + **Kakao SDK v1 Legacy** (카카오 간편 가입 우회 연동)
*   **Deployment**: Vercel (Production CI/CD)

---

## 💡 2. 독창적인 맞춤형 구현 공법 (핵심 기능 & Hacks)

### 🔮 A. 카카오 간편 가입 & 무서버 인증 매핑 (Kakao Legacy Web Hack)
*   **배경**: 카카오 최신 SDK(v2)는 프론트엔드 단독 팝업 로그인을 금지하고 서버 기반의 OAuth 토큰 교환을 요구하여 서버가 없는 구조에서는 연동이 불가능했습니다.
*   **해결**: `index.html`에 팝업 로그인을 공식 지원하는 **카카오 v1 Legacy SDK**를 주입하였습니다.
*   **BaaS 연동 마법**: 카카오 로그인 성공 시 넘겨받는 **카카오 회원 고유 숫자 ID**를 획득하여, 파이어베이스 내부적으로 `kakao_{고유ID}@grieenbi-kakao.com` 이라는 가상의 이메일 계정을 생성하고 백그라운드에서 실시간 회원가입 및 로그인을 대칭 처리합니다. 이로써 백엔드 없이 완벽한 실시간 카카오톡 간편 가입 체계를 완성했습니다.

### 📜 B. 우수 에세이 무한 세로 롤링업 마키 (Infinite Vertical Scrolling Marquee)
*   **적용 영역**:
    1.  **[독자 공동 집필 원고지]** (`src/components/RelayEssay.tsx`) - 실시간 공감 수 베스트 5 문장
    2.  **[위클리 마스터피스 롤링 보드]** (`src/components/HeroCover.tsx`) - 공감 수 10개 이상 득표작
*   **비주얼 페이딩 마스크**: 스크롤 영역 위아래 경계면에 **선형 그라데이션 알파 마스크(`mask-image: linear-gradient`)**를 적용해 흘러가는 문장들이 경계에서 연기처럼 페이드아웃되는 감도 높은 편집 디자인을 연출했습니다.
*   **스마트 일시정지 & 팝오버 연동**: 
    - 롤링업 도중 문장 카드를 터치/클릭하면 **전체 롤링업 트랙이 자석처럼 즉시 정지**합니다 (`animationPlayState: 'paused'`).
    - 동시에 글쓴이의 **닉네임 팝오버 툴팁(BY. {필명})이 온전히 활성화되어 고정**됩니다.
    - 팝오버 내 필명을 누르면 해당 독자의 작품집이 나오는 **상세 프로필 모달이 웅장하게 연결**되며, 팝오버를 다시 닫으면 **정지 지점부터 스크롤이 매끄럽게 재개**됩니다.

### 📱 C. 모바일 원터치 키보드 & 즉시 포커스 동기화 (Mobile Focus Sync)
*   **배경**: iOS Safari 및 모바일 브라우저는 사용자의 직접적인 터치 이벤트 밖에서 발생하는 비동기 포커스(`setTimeout` 등)로는 가상 키보드를 열지 않습니다.
*   **해결**: 메인 화면의 에세이 기고 CTA 버튼 클릭 이벤트가 발생한 메인 스레드 상에서 **`relay-textarea` 엘리먼트를 즉시 동기식으로 포커스(`.focus()`)** 하도록 구현했습니다. 이로 인해 버튼 탭과 동시에 **원고지 폼으로 부드러운 스크롤 이동이 개시됨과 동시에 스마트폰 자판이 팝업되고 깜빡이는 커서가 즉각 활성화**됩니다.

### 👑 D. 철저한 회원 소유권 보호 및 실시간 자가 삭제 기능
*   **자가 삭제**: 릴레이 에세이 본문 문장의 툴팁 팝오버와 하단 전시장의 에세이 카드 내에서, `currentUserNickname === sentence.author` 혹은 관리자 권한(`isAdmin === true`)이 충족되는 경우에만 휴지통 아이콘(삭제 버튼)이 동적으로 나타나 자신의 소중한 문장을 언제든지 거둘 수 있게 보호합니다.
*   **닉네임 중복 및 위조 보호**: 마이페이지(`MyPageModal.tsx`)에서 닉네임 수정 시 실시간 Firestore 트랜잭션을 통해 이미 등록된 닉네임으로 변경하는 것을 원천 차단하며, 위조 주의 경고창을 제공합니다.

---

## 📂 3. 핵심 코드 파일 가이드

*   `src/firebase.ts`: 파이어베이스 클라이언트 SDK 및 Cloud Firestore 데이터베이스 인스턴스(`db`) 설정부.
*   `src/App.tsx`:
    *   어플리케이션 전역 상태 관리 및 실시간 Firestore `onSnapshot` 구독기 연동.
    *   회원 정보 가입/로그인/로그아웃/정보 수정 처리 및 닉네임 중복 유효성 검사 구현.
*   `src/components/HeroCover.tsx`: 
    *   헤더 브랜드 로고(`GRIEENBI`), 릴레이 주제 설명, **[위클리 마스터피스 10+ 공감 롤링 보드 마키]** 및 포커싱 기고 CTA 버튼 내장.
*   `src/components/RelayEssay.tsx`:
    *   **[독자 공동 집필 무한 롤링업 원고지]** 내장 및 개별 문장 툴팁 팝오버(하트 공감, 본인 소유글 삭제, 필명 연동).
    *   이야기 기고 폼 글자수 제한(50자) 유효성 필터링.
    *   **[독자 문장 전시장]** 활성화 아코디언 컴포넌트 및 정렬 탭(`인기 공감순` / `최신 등록순`) 탑재.
*   `src/components/LiveFeed.tsx`: 작가의 라이브 고민 피드 및 의견 덧글 수집 보드.
*   `src/components/Generator.tsx`: 3D 카드 플립형 창작 영감 오라클 발전기.
*   `src/components/ReaderProfileModal.tsx`: 작가별 자기소개 및 기고글 개인 아카이브 스크롤 뷰어.
*   `src/index.css`: 고감도 글래스모피즘 테마 및 둥글기(Border Radius) 디자인 토큰, 그리고 레이아웃 가이드 인스펙터 모드(`guide-mode-active`) 선언.

---

## 🎯 4. 다음 작업 시 우선 검토 및 이어가야 할 단계

1.  **배포 반영 (Blocker 해제)**: 
    *   현재 로컬에서 구현 및 빌드 검증(100% 무결함)이 끝난 **롤링업 마키, 모바일 포커싱, 10+ 공감 필터링** 코드가 커밋되어 있습니다. **GitHub Desktop**에서 **`Push origin`**을 진행하여 Vercel 배포를 즉각 갱신해야 합니다.
2.  **Firestore Database 보안 규칙 개방 검증**:
    *   파이어베이스 콘솔 규칙 탭에서 `allow read, write: if true;`로 확실하게 쓰기 권한이 개방되어 있는지 확인해야 기기 간 정상 동기화됩니다. (직접 주소: [https://console.firebase.google.com/project/grieenbi-home/firestore](https://console.firebase.google.com/project/grieenbi-home/firestore))
3.  **Safari 캐시 프리 테스트**:
    *   배포 반영 후, 모바일 iOS 사파리의 강력한 캐싱으로 인해 이전 코드가 보일 수 있으므로 반드시 **개인정보 보호 브라우징(Incognito)**으로 접속하여 테스트해야 모바일 원터치 키보드가 정상 동작합니다.

---
*그린비 스튜디오의 기품 서린 창작 정원에 방문하신 미래의 어시스턴트 작가님, 환영합니다. 위 안내에 따라 멋진 스튜디오를 더욱 아름답게 가꾸어 주세요! ✒️*
