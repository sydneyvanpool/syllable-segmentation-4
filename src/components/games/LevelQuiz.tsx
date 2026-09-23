import React, { useState } from 'react';
import { Volume2, ArrowRight, Award, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { SpeakableText } from '../SpeakableText';
import { LEVEL_1_WORDS, LEVEL_2_WORDS } from '../../data/syllableData';
import { QuestionResult, SyllableWord } from '../../types';
import { playSound, speakText } from '../../utils/audio';
import { firePastryConfetti, fireGrandTrophyConfetti } from '../../utils/confetti';
import { SummaryModal } from '../SummaryModal';

interface LevelQuizProps {
  level: 1 | 2;
  onComplete: (score: number, results: QuestionResult[]) => void;
  onHome: () => void;
}

interface QuizQuestion {
  wordObj: SyllableWord;
  promptText: string;
  options: number[];
}

export const LevelQuiz: React.FC<LevelQuizProps> = ({
  level,
  onComplete,
  onHome,
}) => {
  const quizId = level === 1 ? 'level-1-quiz' : 'level-2-quiz';
  const wordPool = level === 1 ? LEVEL_1_WORDS : [...LEVEL_1_WORDS, ...LEVEL_2_WORDS];

  // Helper to generate 10 questions with strictly unique words (no repeats) and balanced syllable representation
  const generateUniqueQuestions = (): QuizQuestion[] => {
    // Group words by syllable count to ensure balanced and diverse syllable questions
    const bySyllable: Record<number, SyllableWord[]> = {};
    wordPool.forEach((w) => {
      if (!bySyllable[w.syllableCount]) {
        bySyllable[w.syllableCount] = [];
      }
      bySyllable[w.syllableCount].push(w);
    });

    // Shuffle each group using Fisher-Yates
    Object.keys(bySyllable).forEach((key) => {
      const count = Number(key);
      const arr = bySyllable[count];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    });

    const chosenWords: SyllableWord[] = [];
    const usedWordKeys = new Set<string>();

    // Syllables to sample from: 1, 2, 3 for Level 1; 1, 2, 3, 4, 5 for Level 2
    const syllableCounts = level === 1 ? [1, 2, 3] : [1, 2, 3, 4, 5];
    const targetCount = 10;

    // Pick evenly across syllable counts first
    let round = 0;
    while (chosenWords.length < targetCount && round < 10) {
      for (const sc of syllableCounts) {
        if (chosenWords.length >= targetCount) break;
        const available = (bySyllable[sc] || []).filter((w) => !usedWordKeys.has(w.word));
        if (available.length > 0) {
          const picked = available[0];
          chosenWords.push(picked);
          usedWordKeys.add(picked.word);
        }
      }
      round++;
    }

    // If still need any more words up to 10, fill from any remaining unique pool words
    if (chosenWords.length < targetCount) {
      const remaining = wordPool.filter((w) => !usedWordKeys.has(w.word));
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      for (const rem of remaining) {
        if (chosenWords.length >= targetCount) break;
        chosenWords.push(rem);
        usedWordKeys.add(rem.word);
      }
    }

    // Final shuffle of the 10 selected unique questions so syllable types are mixed
    for (let i = chosenWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chosenWords[i], chosenWords[j]] = [chosenWords[j], chosenWords[i]];
    }

    const allOptions = level === 1 ? [1, 2, 3] : [1, 2, 3, 4, 5];

    return chosenWords.map((w) => ({
      wordObj: w,
      promptText: `How many syllables in "${w.word}"?`,
      options: allOptions,
    }));
  };

  // 10 strictly non-repeating unique word questions
  const [questions, setQuestions] = useState<QuizQuestion[]>(generateUniqueQuestions);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const currentQ = questions[currentIndex];
  const targetWord = currentQ.wordObj;

  const handleSelectCount = (count: number) => {
    if (answered) return;

    setSelectedCount(count);
    setAnswered(true);

    const correct = count === targetWord.syllableCount;
    setIsCorrect(correct);

    const result: QuestionResult = {
      questionPrompt: `How many syllables in "${targetWord.word}"?`,
      targetWord: targetWord.word,
      studentAnswer: `${count} Syllable${count > 1 ? 's' : ''}`,
      correctAnswer: `${targetWord.syllableCount} Syllable${targetWord.syllableCount > 1 ? 's' : ''}`,
      isCorrect: correct,
      syllableBreakdown: `${targetWord.syllables.join(' • ')} (${targetWord.syllableCount})`,
    };

    setResults((prev) => [...prev, result]);

    if (correct) {
      playSound('correct');
      firePastryConfetti();
    } else {
      playSound('incorrect');
    }
  };

  const handleNext = () => {
    setSelectedCount(null);
    setAnswered(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final score
      const finalResults = [...results];
      const correctScore = finalResults.filter((r) => r.isCorrect).length;
      if (correctScore >= 8) {
        playSound('trophy');
        fireGrandTrophyConfetti();
      }
      setShowSummary(true);
      onComplete(correctScore, finalResults);
    }
  };

  const progressPercent = Math.round(((currentIndex + (answered ? 1 : 0)) / questions.length) * 100);
  const currentScore = results.filter((r) => r.isCorrect).length;
  const isPassed = currentScore >= 8;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-amber-100/95 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-2 right-2 text-4xl opacity-20">
          {level === 1 ? '🎂' : '🍰'}
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              Level {level} Syllable Quiz (10 Questions)
            </h2>
          </div>
          <p className="text-sm sm:text-base text-amber-900 font-medium">
            <SpeakableText
              text={`Answer at least 8 out of 10 correct (80%) to pass and win the ${
                level === 1 ? 'Celebration Cake' : 'Master Pastry'
              } Trophy!`}
              buttonSize="sm"
            />
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-bold text-amber-900 mb-1">
            <span>Question {currentIndex + 1} of 10</span>
            <span>Score so far: {currentScore}/{results.length}</span>
          </div>
          <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden border border-amber-300">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-amber-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Target Word Card */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 sm:p-8 text-center shadow-md space-y-4">
        <div className="text-6xl sm:text-7xl select-none filter drop-shadow-xs">
          {targetWord.emoji}
        </div>

        <div className="flex items-center justify-center gap-3">
          <h3 className="text-3xl sm:text-4xl font-black text-amber-950 capitalize">
            {targetWord.word}
          </h3>
          <button
            type="button"
            onClick={() => speakText(targetWord.word)}
            className="w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center shadow-xs cursor-pointer"
            title={`Hear ${targetWord.word}`}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-500 font-medium">
          Say the word slowly. Count the vowel beats or chin drops!
        </p>
      </div>

      {/* Syllable Count Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block text-center">
          Tap the correct number of syllables:
        </span>
        <div
          className={`grid gap-3 ${
            level === 1 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-5'
          }`}
        >
          {currentQ.options.map((num) => {
            const isSelected = selectedCount === num;
            const isThisCorrect = answered && targetWord.syllableCount === num;
            const isThisWrong = answered && isSelected && !isThisCorrect;

            return (
              <button
                key={num}
                type="button"
                disabled={answered}
                onClick={() => handleSelectCount(num)}
                className={`p-5 rounded-2xl border-3 font-black text-2xl sm:text-3xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-sm ${
                  isSelected ? 'ring-4 ring-amber-400 scale-102' : 'hover:scale-102'
                } ${
                  isThisCorrect
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500'
                    : isThisWrong
                    ? 'bg-rose-100 border-rose-400 text-rose-950 ring-2 ring-rose-500'
                    : 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                } ${answered && !isSelected && !isThisCorrect ? 'opacity-50' : ''}`}
              >
                <span>{num}</span>
                <span className="text-xs font-bold text-stone-600">
                  {num === 1 ? 'Syllable' : 'Syllables'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate Feedback */}
      {answered && (
        <div
          className={`p-5 rounded-3xl border-2 animate-in fade-in flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isCorrect
              ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950'
              : 'bg-amber-100/90 border-amber-400 text-amber-950'
          }`}
        >
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-extrabold text-lg">
              {isCorrect ? '🎉 Correct!' : '💡 Syllables Breakdown:'}
            </div>
            <p className="text-sm font-medium">
              <span className="capitalize font-bold">"{targetWord.word}"</span> has{' '}
              <span className="font-extrabold">{targetWord.syllableCount}</span>{' '}
              syllable{targetWord.syllableCount > 1 ? 's' : ''}:{' '}
              <span className="bg-white/80 px-2 py-0.5 rounded-md font-bold">
                {targetWord.syllables.join(' • ')}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm sm:text-base shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {currentIndex + 1 < questions.length ? 'Next Question' : 'See Quiz Results'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary modal */}
      <SummaryModal
        isOpen={showSummary}
        gameId={quizId}
        results={results}
        trophyEarned={isPassed}
        onPlayAgain={() => {
          setQuestions(generateUniqueQuestions());
          setShowSummary(false);
          setCurrentIndex(0);
          setResults([]);
          setSelectedCount(null);
          setAnswered(false);
        }}
        onHome={onHome}
      />
    </div>
  );
};
