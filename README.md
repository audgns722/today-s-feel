# 오늘 기분 어때?
"Today's Feel"은 현재 기분을 AI가 그림으로 표현해주는 창의적인 웹 애플리케이션입니다. 당신의 기분, 좋아하는 것들을 입력하고, AI는 그에 맞는 그림을 생성하여 기분을 시각적으로 표현해줍니다.

## 미리보기
<img src='https://github.com/audgns722/today-s-feel/blob/main/sample_img.png?raw=true' alt='썸네일' />

## 설치
```
npx create-react-app . --template typescript
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @langchain/openai @langchain/core
npm install typescript @types/node @types/react @types/react-dom @types/jest
npm install --save react-spinners
npm install axios
npm install --save openai
```

## 제작과정

"Today's Feel"의 개발은 다음과 같은 단계로 진행되었습니다.
- 프로젝트 초기 설정: TypeScript와 Tailwind CSS를 사용하여 리액트 앱을 구성하고 기본 환경을 설정했습니다.

- API 통신: OpenAI의 DALL-E와 GPT-3 API를 사용하여 사용자의 입력을 기반으로 이미지와 텍스트를 생성하도록 설정했습니다. Axios 라이브러리를 통해 API 통신을 구현했습니다.

- UI/UX 디자인: 사용자의 기분을 입력받고 결과를 시각적으로 보여주는 인터페이스를 디자인했습니다. React Spinners 라이브러리를 사용하여 로딩 상태를 보여주는 UI를 추가했습니다.

- 보안 및 최적화: API 키와 같은 중요 정보는 환경 변수를 통해 관리하여 보안을 강화했습니다. 컴포넌트와 상태 관리는 사용자 경험을 최적화하기 위해 세심하게 설계했습니다.

## 추후 업데이트 예정 사항

- 로그인 및 사용자 인증: 사용자별로 그림을 저장하고 관리할 수 있는 기능을 추가하기 위해 로그인 및 사용자 인증 기능을 구현할 예정입니다.

- 게시판 구현: 사용자가 생성한 그림을 공유하고, 다른 사용자와 소통할 수 있는 커뮤니티 게시판을 구현할 계획입니다.

- 개인화 및 추천 시스템: 사용자의 선호도와 이전 활동을 기반으로 개인화된 그림을 추천하는 기능을 개발할 예정입니다.