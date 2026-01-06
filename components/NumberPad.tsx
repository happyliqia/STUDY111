
import React from 'react';

interface NumberPadProps {
  onInput: (num: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
}

const NumberPad: React.FC<NumberPadProps> = ({ onInput, onDelete, onSubmit }) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {numbers.map((btn) => (
        <button
          key={btn}
          onClick={() => {
            if (btn === 'C') onDelete();
            else if (btn === '✓') onSubmit();
            else onInput(btn);
          }}
          className={`h-16 text-2xl font-bold rounded-2xl shadow-md transition-all active:scale-95 ${
            btn === '✓' 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : btn === 'C'
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export default NumberPad;
