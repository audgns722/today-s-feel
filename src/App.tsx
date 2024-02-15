import React, { useState } from 'react';
import axios from 'axios';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PulseLoader } from 'react-spinners';
import Header from './components/Header';

const App: React.FC = () => {
  // 각 입력 필드에 대한 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [animal, setAnimal] = useState('');
  const [fruit, setFruit] = useState('');
  const [color, setColor] = useState('');
  const [country, setCountry] = useState('');
  const [moods, setMoods] = useState('');
  const [response, setResponse] = useState('');
  const [imageUrl, setImageUrl] = useState('');


  // 기분 상태 체크박스 목록
  const moodOptions = ['우울함', '기쁨', '슬픔', '보통', '행복함'];
  // 사용자의 기분에 따른 배경색을 결정하는 함수
  const getBackgroundStyle = (moods: string) => {
    switch (moods) {
      case '행복함':
        return { background: 'radial-gradient(circle at center, #f9cdff 0%, #fad5ff 10%, #fff9ff 50%, #faf5ff 100%)' };
      case '우울함':
        return { background: 'radial-gradient(circle, rgb(74, 78, 105) 0%, rgb(162 165 203) 10%, rgb(230 230 239) 50%, rgb(215 215 229) 100%)' }; // 어두운 테마
      case '기쁨':
        return { background: 'radial-gradient(circle, rgb(255, 175, 189) 0%, rgb(251 208 182) 10%, rgb(255 241 233) 50%, rgb(255 248 242) 100%)' }; // 따뜻한 테마
      case '슬픔':
        return { background: 'radial-gradient(circle, rgb(106, 133, 182) 0%, rgb(202 218 251) 10%, rgb(235 241 255) 50%, rgb(228 238 255) 100%)' }; // 차분한 테마
      case '보통':
        return { background: 'radial-gradient(circle, rgb(229 255 254) 0%, rgb(239 255 245) 10%, rgb(233 251 233) 50%, rgb(255 255 255) 100%)' }; // 중립적인 테마
      default:
        return { background: 'radial-gradient(circle at center, #f9cdff 0%, #fad5ff 10%, #fff9ff 50%, #faf5ff 100%)' };
    }
  };

  // ChatOpenAI 인스턴스를 초기화합니다.
  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY, // 환경 변수에서 API 키를 가져옵니다.
    temperature: 0.8,
    modelName: 'gpt-3.5-turbo-0125',
  });

  const handleGenerate = async () => {
    const question = `오늘의 기분은 ${moods} 입니다.
    사용자는 평소 ${animal}(animal), ${fruit}(fruit), ${color}(color), ${country}(country) 좋아한다고 합니다. 
    이를 통해 사용자의 기분을 표현해주세요.
    대답은 3~5줄 정도로 해줬으면 좋겠어요.
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
          // prompt: `The mood of the image is ${moods}. Imagine a peaceful forest where a beloved ${animal} is frolicking freely, surrounded by trees laden with favorite ${fruit}. The sky is painted in the user's favorite ${color}, creating a warm and comforting atmosphere. The entire setting is beautifully integrated with the distinctive landscapes or iconic landmarks of the user's favorite ${country}, blending the natural forest environment with cultural and historical elements unique to that country."`,
          prompt: `The picture shows some traditional ${country} houses or ${country} landscapes, with ${animal} walking and laughing under the bright ${color} sunlight during the day. The mood of the image is ${moods}. Negative prompt anime, painting, blurry,`,
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

  return (
    <>
      <div style={getBackgroundStyle(moods)} className="min-h-screen">
        <Header />
        <main>
          <div className="text-center my-5">
            <h1 className="flex items-center justify-center gap-1 text12xl font-bold font-jaram">
              <span className='text-3xl text-gradient'>당신의 기분을 그림으로</span>😁</h1>
          </div>
          <div className="max-w-2xl mx-auto p-6 bg-white/[0.8] rounded-lg shadow-lg text-center">
            <h1 className="text-xl font-bold">당신의 기분을 그려드려요</h1>
            <div className='flex justify-between flex-wrap mt-2'>
              <div className='flex flex-wrap'>
                {moodOptions.map(option => (
                  <label key={option} className="inline-flex items-center mr-4">
                    <input
                      type="radio" // 체크박스 대신 라디오 버튼 사용
                      name="mood" // 모든 라디오 버튼에 동일한 name 속성 부여
                      value={option}
                      checked={moods === option}
                      onChange={(e) => setMoods(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                ))}
              </div>
              <div className='w-full my-2 text-left flex justify-between'>
                <p className='inline-block text-sm'>당신이 평소 좋아하는 동물은?</p>
                <input
                  type="text"
                  value={animal}
                  onChange={(e) => setAnimal(e.target.value)}
                  placeholder="🙈 ex)원숭이"
                  className="border-b-2 text-sm ml-3 outline-none w-2/3 bg-none py-1"
                />
              </div>
              <div className='w-full my-2 text-left flex justify-between'>
                <p className='inline-block text-sm'>당신이 평소 좋아하는 과일은?</p>
                <input
                  type="text"
                  value={fruit}
                  onChange={(e) => setFruit(e.target.value)}
                  placeholder="🍓 ex)딸기"
                  className="border-b-2 text-sm ml-3 outline-none w-2/3 bg-none py-1"
                />
              </div>
              <div className='w-full my-2 text-left flex justify-between'>
                <p className='inline-block text-sm'>당신이 평소 좋아하는 색상은?</p>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="🎨 ex)무지개색"
                  className="border-b-2 text-sm ml-3 outline-none w-2/3 bg-none py-1"
                />
              </div>
              <div className='w-full my-2 text-left flex justify-between'>
                <p className='inline-block text-sm'>당신이 현재 가고싶은 나라는?</p>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="🌍 ex)프랑스"
                  className="border-b-2 text-sm ml-3 outline-none w-2/3 bg-none py-1"
                />
              </div>
            </div>
            <button
              onClick={handleGenerate}
              className="bg-blue-500 text-white p-2 rounded w-full mx-auto mt-2 hover:bg-blue-700 transition-colors"
            >
              생성하기
            </button>
          </div>
          <div className="flex flex-col items-center max-w-2xl mx-auto p-6 bg-white/[0.8] rounded-lg shadow-lg text-left mt-1">
            {isLoading ? (
              <PulseLoader color="#9028ff" size={10} />
            ) : (
              <div className='bg-zinc-100'>{response}</div>
            )}
            <button
              onClick={generateImage}
              className="bg-blue-500 text-white p-2 my-4 rounded w-full mx-auto hover:bg-blue-700 transition-colors"
            >이미지 생성하기</button>
            {
              isLoading2 ? (
                <PulseLoader color="#9028ff" size={10} />
              ) : (
                imageUrl && (
                  <>
                    <img src={imageUrl} alt="Generated" />
                    <a
                      href={imageUrl}
                      download="generated_image.png" // 사용자가 이미지를 다운로드할 때 사용될 파일명 지정
                      className="bg-green-500 text-white p-2 rounded w-full mx-auto text-center hover:bg-green-700 transition-colors mt-4"
                    >
                      이미지 저장하기
                    </a>
                  </>
                )
              )
            }
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
