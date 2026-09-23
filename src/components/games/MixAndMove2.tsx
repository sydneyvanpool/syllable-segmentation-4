import React, { useState } from 'react';
import { Volume2, ArrowRight, Footprints, Sparkles } from 'lucide-react';
import { SpeakableText } from '../SpeakableText';
import { LEVEL_2_WORDS, LEVEL_1_WORDS } from '../../data/syllableData';
import { QuestionResult, SyllableWord } from '../../types';
import { playSound, speakText } from '../../utils/audio';
import { firePastryConfetti } from '../../utils/confetti';
import { SummaryModal } from '../SummaryModal';

interface MixAndMove2Props {
  onComplete: (results: QuestionResult[]) => void;
  onHome: () => void;
  onNextGame: () => void;
}

// 12 Board stepping stones winding through the bakery
const BOARD_TILES_LEVEL_2 = [
  { id: 0, label: 'Kitchen Door', icon: '🚪' },
  { id: 1, label: 'Sugar Bin', icon: '🍬' },
  { id: 2, label: 'Rolling Pin', icon: '🥢' },
  { id: 3, label: 'Egg Cart', icon: '🥚' },
  { id: 4, label: 'Milk Jug', icon: '🥛' },
  { id: 5, label: 'Choco Fountain', icon: '🍫' },
  { id: 6, label: 'Berry Basket', icon: '🍓' },
  { id: 7, label: 'Dough Table', icon: '🍞' },
  { id: 8, label: 'Frosting Station', icon: '🧁' },
  { id: 9, label: 'Sprinkle Box', icon: '✨' },
  { id: 10, label: 'Warm Oven', icon: '♨️' },
  { id: 11, label: 'Grand Pancake Tower!', icon: '🥞' },
];

export const MixAndMove2: React.FC<MixAndMove2Props> = ({
  onComplete,
  onHome,
  onNextGame,
}) => {
  // Pool of varied syllable words
  const [questions] = useState<SyllableWord[]>(() => {
    const list = [
      ...LEVEL_2_WORDS.filter((w) => w.syllableCount >= 2),
      ...LEVEL_1_WORDS.filter((w) => w.syllableCount >= 2),
    ];
    return list.sort(() => Math.random() - 0.5).slice(0, 6);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [boardPosition, setBoardPosition] = useState<number>(0);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const currentWord = questions[currentIndex];

  const handleSelectCount = (count: number) => {
    if (answered) return;

    setSelectedCount(count);
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
      playSound('step');
      firePastryConfetti();
      // Move forward that exact number of syllables!
      setBoardPosition((prev) =>
        Math.min(BOARD_TILES_LEVEL_2.length - 1, prev + currentWord.syllableCount)
      );
    } else {
      playSound('incorrect');
    }
  };

  const handleNext = () => {
    setSelectedCount(null);
    setAnswered(false);

    if (currentIndex + 1 < questions.length && boardPosition < BOARD_TILES_LEVEL_2.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Reached end or answered all questions
      setShowSummary(true);
      onComplete(results);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-amber-100/90 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-2 right-2 text-4xl opacity-20">🥞</div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎲</span>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              Mix & Move 2: Board Game Hop
            </h2>
          </div>
          <p className="text-sm sm:text-base text-amber-900 font-medium">
            <SpeakableText
              text="Count the syllables in each word! For each correct answer, your Baker hops forward that exact number of tiles on the board game!"
              buttonSize="sm"
            />
          </p>
        </div>
      </div>

      {/* Curving Board Game Layout */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-5 sm:p-6 shadow-md overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-1">
            <Footprints className="w-4 h-4 text-amber-700" />
            Curving Grand Bakery Track
          </span>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
            Tile {boardPosition + 1} of {BOARD_TILES_LEVEL_2.length}
          </span>
        </div>

        {/* 12 stepping stones curved in an S-curve path */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
          {BOARD_TILES_LEVEL_2.map((tile, idx) => {
            const isChefHere = boardPosition === idx;
            const isPast = boardPosition > idx;

            return (
              <div
                key={tile.id}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border-2 transition-all relative min-h-[90px] ${
                  isChefHere
                    ? 'bg-amber-300 border-amber-500 ring-4 ring-amber-400 scale-105 shadow-md z-10'
                    : isPast
                    ? 'bg-emerald-100 border-emerald-300 opacity-90'
                    : 'bg-stone-50 border-stone-200 opacity-70'
                }`}
              >
                {isChefHere && (
                  <div className="absolute -top-3 bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs animate-bounce">
                    Chef Here!
                  </div>
                )}

                <div className="text-2xl sm:text-3xl mb-1">
                  {isChefHere ? '🧑‍🍳' : tile.icon}
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-800 text-center line-clamp-1">
                  {tile.label}
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold text-stone-500">
                  #{idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Word Card */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 sm:p-8 text-center shadow-md space-y-4">
        <div className="text-6xl filter drop-shadow-xs select-none">
          {currentWord.emoji || '🥞'}
        </div>

        <div className="flex items-center justify-center gap-3">
          <h3 className="text-3xl sm:text-4xl font-black text-amber-950 capitalize">
            {currentWord.word}
          </h3>
          <button
            type="button"
            onClick={() => speakText(currentWord.word)}
            className="w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center shadow-xs cursor-pointer"
            title={`Hear ${currentWord.word}`}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-500">
          How many syllables? That is how many steps you get to move!
        </p>
      </div>

      {/* Syllable Options (1 to 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((count) => {
          const isSelected = selectedCount === count;
          const isThisCorrect = answered && currentWord.syllableCount === count;
          const isThisWrong = answered && isSelected && !isThisCorrect;

          return (
            <button
              key={count}
              type="button"
              disabled={answered}
              onClick={() => handleSelectCount(count)}
              className={`p-4 sm:p-5 rounded-3xl border-3 shadow-md flex flex-col items-center justify-center gap-1 transition-all cursor-pointer bg-white border-amber-300 ${
                isSelected ? 'ring-4 ring-amber-400 scale-102' : 'hover:scale-102'
              } ${isThisCorrect ? 'ring-4 ring-emerald-500 bg-emerald-100 border-emerald-400' : ''} ${
                isThisWrong ? 'ring-4 ring-rose-500 bg-rose-100 border-rose-400' : ''
              } ${answered && !isSelected && !isThisCorrect ? 'opacity-50' : ''}`}
            >
              <span className="text-3xl font-black text-amber-950">{count}</span>
              <span className="text-xs font-bold text-amber-800">
                {count === 1 ? 'One clap' : `${count} claps`}
              </span>
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
              {isCorrect
                ? `🎉 Hop! Moved forward ${currentWord.syllableCount} spaces!`
                : '💡 Syllable Check:'}
            </div>
            <p className="text-sm font-medium">
              <span className="capitalize font-bold">"{currentWord.word}"</span> has{' '}
              <span className="font-extrabold">{currentWord.syllableCount}</span>{' '}
              syllables ({currentWord.syllables.join(' • ')}).
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm sm:text-base shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {currentIndex + 1 < questions.length && boardPosition < BOARD_TILES_LEVEL_2.length - 1
              ? 'Next Word'
              : 'See Results'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <SummaryModal
        isOpen={showSummary}
        gameId="mix-and-move-2"
        results={results}
        trophyEarned={true}
        onPlayAgain={() => {
          setShowSummary(false);
          setCurrentIndex(0);
          setBoardPosition(0);
          setResults([]);
          setSelectedCount(null);
          setAnswered(false);
        }}
        onHome={onHome}
        onNextGame={onNextGame}
      />
    </div>
  );
};
