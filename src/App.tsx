import React, { useState } from 'react';
import axios from 'axios';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CircleLoader } from 'react-spinners';
import Header from './components/Header';

const App: React.FC = () => {
  // 각 입력 필드에 대한 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [animal, setAnimal] = useState('');
  const [fruit, setFruit] = useState('');
  const [color, setColor] = useState('');
  const [country, setCountry] = useState('');
  const [response, setResponse] = useState('');
  const [imageUrl, setImageUrl] = useState('');


  // ChatOpenAI 인스턴스를 초기화합니다.
  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY, // 환경 변수에서 API 키를 가져옵니다.
    temperature: 0.8,
    modelName: 'gpt-3.5-turbo-0125',
  });

  const handleGenerate = async () => {
    const question = `
    사용자가 ${animal}, ${fruit}, ${color}, ${country} 좋아한다고 합니다. 
    이러한 선호도를 통해 사용자의 기분을 자세하게 표현한다면 어떻게 할까?
    대답은 3~5줄 정도로 해줬으면 좋겠어요
    `;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "사용자의 질문을 보고 오늘의 기분을 정리해서 대답해주세요"],
      ["user", question],
    ]);

    const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());
    setIsLoading(true); // 로딩 시작

    try {
      const result = await chain.invoke({});
      setResponse(result);
    } catch (error) {
      console.error("Error while talking to GPT:", error);
      setResponse("죄송합니다. 요청을 처리하는 중에 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const generateImage = async () => {
    try {
      setIsLoading2(true); // 로딩 시작
      const res = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: "dall-e-3",
          prompt: `Imagine a peaceful forest where a beloved ${animal} is frolicking freely, surrounded by trees laden with favorite ${fruit}. The sky is painted in the user's favorite ${color}, creating a warm and comforting atmosphere. The entire setting is beautifully integrated with the distinctive landscapes or iconic landmarks of the user's favorite ${country}, blending the natural forest environment with cultural and historical elements unique to that country."`,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // 수정된 부분: 응답 구조에 맞게 이미지 URL을 추출
      setImageUrl(res.data.data[0].url);
    } catch (error) {
      console.error("Error generating image:", error);
      setImageUrl(''); // 에러 발생 시 이미지 URL을 초기화
    } finally {
      setIsLoading2(false); // 로딩 종료
    }
  };

  // const fetchImageAndDownload = async () => {
  //   if (!imageUrl) return; // 이미지 URL이 없는 경우 함수 종료

  //   try {
  //     setIsLoading2(true); // 이미지 다운로드 로딩 시작
  //     const response = await fetch(imageUrl);
  //     const blob = await response.blob(); // 이미지를 Blob 객체로 변환
  //     const objectURL = URL.createObjectURL(blob); // Blob 객체로부터 Object URL 생성
  //     const link = document.createElement('a');
  //     link.href = objectURL;
  //     link.download = "generated_image.png"; // 다운로드될 파일명 지정
  //     document.body.appendChild(link); // 링크를 문서에 추가
  //     link.click(); // 프로그래밍 방식으로 링크 클릭 시뮬레이션
  //     document.body.removeChild(link); // 사용 후 링크 제거
  //   } catch (error) {
  //     console.error("Error fetching and downloading image:", error);
  //   } finally {
  //     setIsLoading2(false); // 로딩 종료
  //   }
  // };

  return (
    <>
      <div className="min-h-screen center-gradient">
        <Header />
        <main>
          <div className="text-center my-10">
            <h1 className="flex items-center justify-center gap-1 text12xl font-bold mb-5 font-jaram">
              <span className='text-3xl text-gradient'>당신의 기분을 그림으로</span>😁</h1>
          </div>
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-xl font-bold mb-4">당신의 기분을 그려드려요</h1>
            <div className='flex justify-evenly flex-wrap'>
              <input
                type="text"
                value={animal}
                onChange={(e) => setAnimal(e.target.value)}
                placeholder="😻 좋아하는 동물"
                className="border-2 border-gray-200 p-2 rounded w-2/5 mb-2"
              />
              <input
                type="text"
                value={fruit}
                onChange={(e) => setFruit(e.target.value)}
                placeholder="🍓 좋아하는 과일"
                className="border-2 border-gray-200 p-2 rounded w-2/5 mb-2"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="🎨 좋아하는 색상"
                className="border-2 border-gray-200 p-2 rounded w-2/5 mb-2"
              />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="🌍 가고싶은 나라"
                className="border-2 border-gray-200 p-2 rounded w-2/5 mb-2"
              />
            </div>
            <button
              onClick={handleGenerate}
              className="bg-blue-500 text-white p-2 rounded w-8/12 mx-auto hover:bg-blue-700 transition-colors"
            >
              생성하기
            </button>
          </div>
          <div className="flex flex-col items-center max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-left break-all mt-5">
            {isLoading ? (
              <CircleLoader color="#36D7B7" />
            ) : (
              <div>내 기분... : {response}</div>
            )}
            <button
              onClick={generateImage}
              className="bg-blue-500 text-white p-2 rounded w-8/12 mx-auto hover:bg-blue-700 transition-colors"
            >이미지 생성하기</button>
            {
              imageUrl && (
                <>
                  <img className='mt-2' src={imageUrl} alt="Generated" />
                  <a
                    href={imageUrl}
                    download="generated_image.png" // 사용자가 이미지를 다운로드할 때 사용될 파일명 지정
                    className="bg-green-500 text-white p-2 text-center rounded w-8/12 mx-auto text-center hover:bg-green-700 transition-colors mt-4"
                  >
                    이미지 저장하기
                  </a>
                </>
              )
            }
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
