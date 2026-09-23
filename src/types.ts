export type GameId =
  | 'ingredient-sort-1'
  | 'measure-match-1'
  | 'mix-and-move-1'
  | 'recipe-writer-1'
  | 'level-1-quiz'
  | 'ingredient-sort-2'
  | 'measure-match-2'
  | 'mix-and-move-2'
  | 'recipe-writer-2'
  | 'level-2-quiz';

export interface Trophy {
  id: GameId;
  name: string;
  gameName: string;
  level: 1 | 2;
  emoji: string;
  description: string;
  howToEarn: string;
}

export interface SyllableWord {
  word: string;
  syllables: string[]; // e.g. ["cup", "cake"]
  syllableCount: number;
  hint?: string;
  emoji?: string;
}

export interface QuestionResult {
  questionPrompt: string;
  targetWord: string;
  studentAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  syllableBreakdown: string;
}

export interface UserProgress {
  trophies: Record<GameId, boolean>;
  gameCompletions: Record<GameId, boolean>;
  quizScores: {
    'level-1-quiz'?: number;
    'level-2-quiz'?: number;
  };
}
