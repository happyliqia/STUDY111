
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface MathProblem {
  id: number;
  question: string;
  answer: number;
  type: 'add' | 'sub';
  operands: [number, number];
}

export interface QuizResult {
  score: number;
  total: number;
  timeSpent: number;
  feedback: string;
  animalMascot: string;
}

export interface Animal {
  emoji: string;
  name: string;
  color: string;
}
