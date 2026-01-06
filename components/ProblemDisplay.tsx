
import React from 'react';
import { MathProblem, Animal } from '../types';

interface ProblemDisplayProps {
  problem: MathProblem;
  currentValue: string;
  mascot: Animal;
}

const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ problem, currentValue, mascot }) => {
  const renderVisuals = (count: number, color: string) => {
    return Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
        🍎
      </span>
    ));
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className={`p-4 rounded-3xl ${mascot.color} flex items-center space-x-4 shadow-sm`}>
        <span className="text-5xl">{mascot.emoji}</span>
        <div className="text-lg">
          <p className="font-bold text-gray-800">{mascot.name} 正在看你做题哦！</p>
          <p className="text-sm text-gray-600">加油，这道题难不倒你的！</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-6 text-6xl font-black text-gray-800 tracking-tighter">
        <div className="flex flex-col items-center">
          <span>{problem.operands[0]}</span>
          <div className="flex flex-wrap max-w-[120px] justify-center mt-2">
             {renderVisuals(problem.operands[0], 'red')}
          </div>
        </div>
        
        <span className="text-4xl text-orange-500">{problem.type === 'add' ? '+' : '-'}</span>
        
        <div className="flex flex-col items-center">
          <span>{problem.operands[1]}</span>
           <div className="flex flex-wrap max-w-[120px] justify-center mt-2">
             {renderVisuals(problem.operands[1], 'blue')}
          </div>
        </div>
        
        <span className="text-4xl text-orange-500">=</span>
        
        <div className="w-24 h-24 border-b-8 border-orange-400 flex items-center justify-center text-orange-600 bg-orange-50 rounded-t-xl">
          {currentValue || '?'}
        </div>
      </div>
    </div>
  );
};

export default ProblemDisplay;
