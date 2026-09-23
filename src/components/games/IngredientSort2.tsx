import React, { useState, useEffect } from 'react';
import { Volume2, ArrowRight } from 'lucide-react';
import { SpeakableText } from '../SpeakableText';
import { LEVEL_2_WORDS } from '../../data/syllableData';
import { QuestionResult } from '../../types';
import { playSound, speakText } from '../../utils/audio';
import { firePastryConfetti } from '../../utils/confetti';
import { SummaryModal } from '../SummaryModal';

interface IngredientSort2Props {
  onComplete: (results: QuestionResult[]) => void;
  onHome: () => void;
  onNextGame: () => void;
}

export const IngredientSort2: React.FC<IngredientSort2Props> = ({
  onComplete,
  onHome,
  onNextGame,
}) => {
  // 6 words covering 1 to 5 syllables
  const [questions] = useState(() => {
    return [...LEVEL_2_WORDS].sort(() => Math.random() - 0.5).slice(0, 6);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedJar, setSelectedJar] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const currentWord = questions[currentIndex];

  useEffect(() => {
    if (currentWord) {
      speakText(`Listen to the ingredient word: ${currentWord.word}`);
    }
  }, [currentIndex]);

  const handleSelectJar = (count: number) => {
    if (answered) return;

    setSelectedJar(count);
    setAnswered(true);

    const correct = count === currentWord.syllableCount;
    setIsCorrect(correct);

    const result: QuestionResult = {
      questionPrompt: `How many syllables in "${currentWord.word}"?`,
      targetWord: currentWord.word,
      studentAnswer: `${count} Syllable${count > 1 ? 's' : ''}`,
      correctAnswer: `${currentWord.syllableCount} Syllable${currentWord.syllableCount > 1 ? 's' : ''}`,
      isCorrect: correct,
      syllableBreakdown: `${currentWord.syllables.join(' • ')} (${currentWord.syllableCount})`,
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
    setSelectedJar(null);
    setAnswered(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
      onComplete(results);
    }
  };

  const progressPercent = Math.round(((currentIndex + (answered ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-amber-100/90 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-2 right-2 text-4xl opacity-20">🍩</div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🫙</span>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              Ingredient Sort 2 (Up to 5 Syllables)
            </h2>
          </div>
          <p className="text-sm sm:text-base text-amber-900 font-medium">
            <SpeakableText
              text="Listen to the multisyllabic ingredient word. Tap the glass jar that matches the number of syllables!"
              buttonSize="sm"
            />
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-bold text-amber-900 mb-1">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden border border-amber-300">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-amber-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Word Card */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 sm:p-8 text-center shadow-md space-y-4">
        <div className="text-6xl sm:text-7xl filter drop-shadow-xs select-none">
          {currentWord.emoji}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => speakText(currentWord.word)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-lg sm:text-xl shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span>Hear Word: "{currentWord.word}"</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-500 font-medium">
          Say it slow: count every vowel beat from 1 up to 5!
        </p>
      </div>

      {/* 5 Glass Jars */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((jarNum) => {
          const isSelected = selectedJar === jarNum;
          const isThisCorrect = answered && currentWord.syllableCount === jarNum;
          const isThisWrong = answered && isSelected && !isThisCorrect;

          return (
            <button
              key={jarNum}
              type="button"
              disabled={answered}
              onClick={() => handleSelectJar(jarNum)}
              className={`p-4 rounded-3xl border-3 shadow-md flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-linear-to-b from-amber-50 to-orange-50 border-amber-300 ${
                isSelected ? 'ring-4 ring-amber-400 scale-102' : 'hover:scale-102'
              } ${isThisCorrect ? 'ring-4 ring-emerald-500 bg-emerald-100 border-emerald-400' : ''} ${
                isThisWrong ? 'ring-4 ring-rose-500 bg-rose-100 border-rose-400' : ''
              } ${answered && !isSelected && !isThisCorrect ? 'opacity-50' : ''}`}
            >
              <div className="text-3xl sm:text-4xl">🫙</div>
              <div className="text-2xl font-black text-amber-950">{jarNum}</div>
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                {jarNum === 1 ? '1 Syllable' : `${jarNum} Syllables`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Answer Feedback Banner */}
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
              {isCorrect ? '🎉 Super Chef! Correct jar!' : '💡 Look at the chunks:'}
            </div>
            <p className="text-sm font-medium">
              <span className="capitalize font-bold">"{currentWord.word}"</span> has{' '}
              <span className="font-extrabold">{currentWord.syllableCount}</span>{' '}
              syllable{currentWord.syllableCount > 1 ? 's' : ''}:{' '}
              <span className="bg-white/80 px-2 py-0.5 rounded-md font-bold tracking-wider">
                {currentWord.syllables.join(' • ')}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm sm:text-base shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {currentIndex + 1 < questions.length ? 'Next Word' : 'See Results'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <SummaryModal
        isOpen={showSummary}
        gameId="ingredient-sort-2"
        results={results}
        trophyEarned={true}
        onPlayAgain={() => {
          setShowSummary(false);
          setCurrentIndex(0);
          setResults([]);
          setSelectedJar(null);
          setAnswered(false);
        }}
        onHome={onHome}
        onNextGame={onNextGame}
      />
    </div>
  );
};
