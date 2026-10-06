# fox9star.github.io

`fox9star`의 개인 웹 실험실입니다. 여행, 공부, 웹 도구 제작에 관한 기록과 직접 실행해 볼 수 있는 작은 프로젝트를 한곳에 모았습니다.

라이브 주소: <https://fox9star.github.io/>

## 홈 화면

- `index.html` — 반응형 메인 홈
- `site.css` — 홈 화면 전용 스타일
- `site.js` — 모바일 메뉴, 스크롤 헤더, 등장 애니메이션
- `404.html` — 존재하지 않는 주소 안내
- `legacy.html` — 기존 프레임 기반 홈 화면 보존본

## 연결된 작업

- `doc/book.html` — Book Management API 검색 데모
- `task/task.html` — LocalStorage 기반 할 일 관리 앱
- `timer.html` — 타이머
- `game.html` — 미니 게임
- `exchange.html` — 환율 조회 데모
- `self.html`, `portfolio.html` — 소개와 포트폴리오

## 로컬에서 미리보기

GitHub Pages는 정적 파일을 제공하므로 별도 빌드 과정 없이 정적 서버로 확인할 수 있습니다.

```powershell
python -m http.server 8787
```

브라우저에서 <http://127.0.0.1:8787/> 을 엽니다.

## GitHub Pages 설정

저장소 이름은 사용자 페이지 규칙에 맞는 `fox9star/fox9star.github.io`를 사용합니다.

1. GitHub 저장소의 **Settings → Pages**로 이동합니다.
2. **Build and deployment**에서 **Deploy from a branch**를 선택합니다.
3. 브랜치 `main`, 폴더 `/ (root)`를 선택하고 저장합니다.
4. 배포가 끝나면 <https://fox9star.github.io/> 에서 확인합니다.

`inc.html`, `index.php`, `wp-content/`와 일부 이미지·Node 실험 파일은 공개 홈페이지와 무관한 로컬 보관 자료라 `.gitignore`로 배포 대상에서 제외합니다. `exchange.html`은 외부 환율 API의 응답 상태에 따라 결과가 달라질 수 있습니다.
