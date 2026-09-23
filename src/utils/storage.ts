import { GameId, UserProgress } from '../types';

const STORAGE_KEY = 'syllable_bakery_progress_v1';

const defaultProgress: UserProgress = {
  trophies: {
    'ingredient-sort-1': false,
    'measure-match-1': false,
    'mix-and-move-1': false,
    'recipe-writer-1': false,
    'level-1-quiz': false,
    'ingredient-sort-2': false,
    'measure-match-2': false,
    'mix-and-move-2': false,
    'recipe-writer-2': false,
    'level-2-quiz': false,
  },
  gameCompletions: {
    'ingredient-sort-1': false,
    'measure-match-1': false,
    'mix-and-move-1': false,
    'recipe-writer-1': false,
    'level-1-quiz': false,
    'ingredient-sort-2': false,
    'measure-match-2': false,
    'mix-and-move-2': false,
    'recipe-writer-2': false,
    'level-2-quiz': false,
  },
  quizScores: {},
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return {
      trophies: { ...defaultProgress.trophies, ...(parsed.trophies || {}) },
      gameCompletions: { ...defaultProgress.gameCompletions, ...(parsed.gameCompletions || {}) },
      quizScores: { ...(parsed.quizScores || {}) },
    };
  } catch (e) {
    console.warn('Failed to load progress from localStorage:', e);
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress to localStorage:', e);
  }
}

export function awardTrophy(gameId: GameId, currentProgress: UserProgress): UserProgress {
  const updated: UserProgress = {
    ...currentProgress,
    trophies: {
      ...currentProgress.trophies,
      [gameId]: true,
    },
    gameCompletions: {
      ...currentProgress.gameCompletions,
      [gameId]: true,
    },
  };
  saveProgress(updated);
  return updated;
}

export function saveQuizResult(quizId: 'level-1-quiz' | 'level-2-quiz', score: number, currentProgress: UserProgress): UserProgress {
  const passed = score >= 8; // 80% out of 10
  const updated: UserProgress = {
    ...currentProgress,
    quizScores: {
      ...currentProgress.quizScores,
      [quizId]: Math.max(currentProgress.quizScores[quizId] || 0, score),
    },
    gameCompletions: {
      ...currentProgress.gameCompletions,
      [quizId]: passed || currentProgress.gameCompletions[quizId],
    },
    trophies: {
      ...currentProgress.trophies,
      [quizId]: passed || currentProgress.trophies[quizId],
    },
  };
  saveProgress(updated);
  return updated;
}

export function isLevel1QuizUnlocked(progress: UserProgress): boolean {
  return (
    progress.gameCompletions['ingredient-sort-1'] &&
    progress.gameCompletions['measure-match-1'] &&
    progress.gameCompletions['mix-and-move-1'] &&
    progress.gameCompletions['recipe-writer-1']
  );
}

export function isLevel2Unlocked(progress: UserProgress): boolean {
  return (progress.quizScores['level-1-quiz'] || 0) >= 8;
}

export function isLevel2QuizUnlocked(progress: UserProgress): boolean {
  return (
    isLevel2Unlocked(progress) &&
    progress.gameCompletions['ingredient-sort-2'] &&
    progress.gameCompletions['measure-match-2'] &&
    progress.gameCompletions['mix-and-move-2'] &&
    progress.gameCompletions['recipe-writer-2']
  );
}

export function countEarnedTrophies(progress: UserProgress): number {
  return Object.values(progress.trophies).filter(Boolean).length;
}

export function resetAllProgress(): UserProgress {
  saveProgress(defaultProgress);
  return defaultProgress;
}
