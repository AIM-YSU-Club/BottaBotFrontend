# BottaBot Frontend

여성대학교(yeonsung.ac.kr) 학교 이메일 계정으로 로그인해서 쓰는 AI 노트북 서비스의 프론트엔드입니다.
NotebookLM과 비슷하게, 노트북 단위로 소스(파일/웹사이트/텍스트)를 모아두고 그 소스를 근거로 AI와 대화합니다.

React + TypeScript + Vite로 만들었고, 백엔드는 별도 저장소의 API 서버(`VITE_API_BASE_URL`)를 호출합니다.

## 주요 기능

- **회원 인증**: 로그인 / 회원가입(학교 이메일 인증) / 아이디 찾기·비밀번호 재설정 / 이메일(아이디) 변경 / 회원 탈퇴
- **노트북**: 생성·목록 조회·검색·제목/설명 수정·삭제
- **소스**: 파일 업로드(PDF/DOCX/TXT/PPTX/XLSX), 웹사이트 URL, 텍스트 붙여넣기 추가 및 삭제, 처리 상태 폴링
- **채팅**: 노트북 소스를 근거로 한 RAG 대화, 답변 스트리밍(SSE), 출처(citation) 표시, 대화 세션 관리
- **라이브러리**: 모든 노트북의 소스를 한 곳에서 모아보기
- **프로필/설정**: 닉네임·비밀번호 변경, 계정 정보 확인, 로그아웃

## 기술 스택

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) (v7)
- [Axios](https://axios-http.com/) — 요청/응답 인터셉터로 토큰 자동 첨부, 401 시 리프레시 토큰으로 재시도
- 별도 UI 라이브러리 없이 순수 CSS(`src/index.css`)로 구성 (CSS 변수 기반 테마, 라이트/다크 모드 지원)

## 시작하기

### 요구 사항

- Node.js 18 이상
- 접근 가능한 백엔드 API 서버 주소

### 설치 및 환경 변수

```bash
npm install
```

프로젝트 루트에 `.env` 파일을 만들고 백엔드 API 주소를 지정합니다.

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 개발 서버 실행

```bash
npm run dev
```

기본 포트는 `8080`이며, 이미 사용 중이면 Vite가 자동으로 다른 포트를 잡습니다(`vite.config.ts`).

### 빌드 / 미리보기 / 린트

```bash
npm run build    # tsc -b && vite build
npm run preview  # 빌드 결과 로컬 미리보기
npm run lint      # ESLint
```

## 폴더 구조

```
src/
├─ api/            # axios 인스턴스 (baseURL, 토큰 인터셉터, 공통 응답 언랩)
├─ assets/         # 이미지 등 정적 리소스
├─ components/
│  ├─ auth/        # 인증 화면 공용 레이아웃(2단 그리드)/헤더/ProtectedRoute
│  ├─ common/      # 폼 필드, 버튼, 아바타·아바타 드롭다운 메뉴 등 범용 UI
│  ├─ notebook/     # 노트북 카드, 섹션 헤더, 채팅 입력창 등
│  └─ settings/    # 설정 화면 레이아웃/행/토글/경고 박스
├─ context/        # UserContext (전역 사용자 상태)
├─ pages/          # 라우트별 화면 (Login, SignUp, Home, Notebook, Settings, Profile ...)
├─ utils/          # notebookStore.ts — 노트북/소스/채팅 API 클라이언트 래퍼
├─ index.css       # 전역 테마(CSS 변수)·컴포넌트 스타일
└─ App.tsx         # 라우터 설정
```

## 라우팅

사이드바 없이 각 화면이 자체 헤더(아바타 드롭다운 등)를 가지는 구조입니다.

| 경로            | 화면                           | 인증 필요 |
| --------------- | ------------------------------ | --------- |
| `/login`        | 로그인                         | ✕         |
| `/signup`       | 회원가입                       | ✕         |
| `/find-account` | 아이디 찾기 / 비밀번호 재설정  | ✕         |
| `/`             | 홈 (노트북 목록)               | ✓         |
| `/notebook/:id` | 노트북 상세(소스+채팅)         | ✓         |
| `/library`      | 라이브러리(전체 소스 모아보기) | ✓         |
| `/profile`      | 내 프로필                      | ✓         |
| `/change-id`    | 이메일(아이디) 변경            | ✓         |
| `/settings`     | 설정                           | ✓         |
| `/deactivate`   | 회원 탈퇴                      | ✓         |

인증이 필요한 라우트는 `ProtectedRoute`가 `sessionStorage`의 `accessToken` 유무로 접근을 제어합니다.

## 참고

- API 요청/응답 포맷은 백엔드 API 명세서(MEM01~06, NB01, SRC01~02, CHAT01)를 기준으로 맞춰져 있습니다.
- 로그인 화면에는 백엔드 연동 없이 바로 확인할 수 있는 테스트 계정이 표시되어 있습니다.
