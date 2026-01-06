
import React, { useState, useEffect, useCallback } from 'react';
import { MathProblem, QuizResult, Animal } from './types';
import { ANIMALS, MAX_SUM, TOTAL_QUESTIONS } from './constants';
import NumberPad from './components/NumberPad';
import ProblemDisplay from './components/ProblemDisplay';
import { getFeedback } from './services/geminiService';

const generateProblems = (): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const isAdd = Math.random() > 0.5;
    let a, b, answer;

    if (isAdd) {
      answer = Math.floor(Math.random() * (MAX_SUM + 1));
      a = Math.floor(Math.random() * (answer + 1));
      b = answer - a;
    } else {
      a = Math.floor(Math.random() * (MAX_SUM + 1));
      b = Math.floor(Math.random() * (a + 1));
      answer = a - b;
    }

    problems.push({
      id: i,
      question: `${a} ${isAdd ? '+' : '-'} ${b}`,
      answer,
      type: isAdd ? 'add' : 'sub',
      operands: [a, b]
    });
  }
  return problems;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'QUIZ' | 'RESULT'>('START');
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [score, setScore] = useState(0);
  const [mascot, setMascot] = useState<Animal>(ANIMALS[0]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const startQuiz = () => {
    setProblems(generateProblems());
    setCurrentIndex(0);
    setScore(0);
    setGameState('QUIZ');
    setMascot(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
  };

  const handleInput = (val: string) => {
    if (currentInput.length < 2) {
      setCurrentInput(prev => prev + val);
    }
  };

  const handleDelete = () => {
    setCurrentInput(prev => prev.slice(0, -1));
  };

  const handleSubmit = useCallback(async () => {
    if (currentInput === '') return;

    const isCorrect = parseInt(currentInput) === problems[currentIndex].answer;
    if (isCorrect) setScore(prev => prev + 1);

    if (currentIndex + 1 < TOTAL_QUESTIONS) {
      setCurrentIndex(prev => prev + 1);
      setCurrentInput('');
      // Change mascot every 3 questions for fun
      if ((currentIndex + 1) % 3 === 0) {
        setMascot(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
      }
    } else {
      setGameState('RESULT');
      setIsLoadingFeedback(true);
      const feedback = await getFeedback(score + (isCorrect ? 1 : 0), TOTAL_QUESTIONS, mascot.name);
      setResult({
        score: score + (isCorrect ? 1 : 0),
        total: TOTAL_QUESTIONS,
        timeSpent: 0, // Simplified
        feedback,
        animalMascot: mascot.emoji
      });
      setIsLoadingFeedback(false);
    }
  }, [currentInput, currentIndex, problems, score, mascot]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center justify-center">
      {gameState === 'START' && (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative inline-block">
            <span className="text-9xl mb-4 block animate-bounce">🦁</span>
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-white px-4 py-1 rounded-full font-bold shadow-lg transform rotate-12">
              数学好玩！
            </div>
          </div>
          <h1 className="text-5xl font-black text-green-700 tracking-wider">
            森林数学大冒险
          </h1>
          <p className="text-xl text-green-600 font-medium max-w-md mx-auto">
            欢迎来到森林学校！和动物伙伴们一起练习10以内的加减法，成为数学小达人吧！
          </p>
          <button
            onClick={startQuiz}
            className="px-12 py-5 bg-orange-500 hover:bg-orange-600 text-white text-3xl font-bold rounded-full shadow-[0_8px_0_rgb(194,65,12)] transition-all active:translate-y-1 active:shadow-none bounce-hover"
          >
            开始挑战 ➔
          </button>
        </div>
      )}

      {gameState === 'QUIZ' && problems.length > 0 && (
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-[40px] p-8 shadow-2xl border-4 border-white space-y-10 relative">
          <div className="flex justify-between items-center">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl font-bold flex items-center space-x-2">
              <span>进度:</span>
              <span>{currentIndex + 1} / {TOTAL_QUESTIONS}</span>
            </div>
            <div className="flex space-x-1">
               {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                 <div 
                   key={i} 
                   className={`h-3 w-3 rounded-full ${i < currentIndex ? 'bg-green-500' : i === currentIndex ? 'bg-orange-400 animate-pulse' : 'bg-gray-200'}`}
                 />
               ))}
            </div>
          </div>

          <ProblemDisplay 
            problem={problems[currentIndex]} 
            currentValue={currentInput}
            mascot={mascot}
          />

          <NumberPad 
            onInput={handleInput}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
          />

          <div className="text-center">
            <button 
              onClick={() => setGameState('START')}
              className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
            >
              退出挑战
            </button>
          </div>
        </div>
      )}

      {gameState === 'RESULT' && result && (
        <div className="text-center space-y-8 max-w-lg w-full bg-white rounded-[50px] p-10 shadow-2xl border-b-8 border-blue-200 animate-in slide-in-from-bottom duration-700">
          <div className="relative">
            <span className="text-9xl block">{result.score >= 8 ? '🏆' : result.animalMascot}</span>
            {result.score >= 8 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 animate-ping opacity-25">
                 <div className="w-32 h-32 bg-yellow-400 rounded-full"></div>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-4xl font-black text-gray-800">
              {result.score === TOTAL_QUESTIONS ? '超完美的成绩！' : '大冒险结束啦！'}
            </h2>
            <div className="mt-4 flex justify-center items-end space-x-2">
              <span className="text-7xl font-black text-orange-500">{result.score}</span>
              <span className="text-2xl font-bold text-gray-400 mb-2">/ {result.total} 分</span>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl">❝</div>
            <p className="text-blue-800 text-lg leading-relaxed italic relative z-10">
              {isLoadingFeedback ? "正在让老师写评语..." : result.feedback}
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={startQuiz}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-2xl shadow-[0_6px_0_rgb(21,128,61)] transition-all active:translate-y-1 active:shadow-none"
            >
              再来一次 🍀
            </button>
            <button
              onClick={() => setGameState('START')}
              className="text-gray-500 hover:text-gray-700 font-bold"
            >
              返回首页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
