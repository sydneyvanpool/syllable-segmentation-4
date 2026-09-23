import React, { useState } from 'react';
import { Volume2, ArrowRight, CheckCircle2, Footprints } from 'lucide-react';
import { SpeakableText } from '../SpeakableText';
import { LEVEL_1_WORDS } from '../../data/syllableData';
import { QuestionResult, SyllableWord } from '../../types';
import { playSound, speakText } from '../../utils/audio';
import { firePastryConfetti } from '../../utils/confetti';
import { SummaryModal } from '../SummaryModal';

interface MixAndMove1Props {
  onComplete: (results: QuestionResult[]) => void;
  onHome: () => void;
  onNextGame: () => void;
}

// 6 stepping tiles for the board game
const BOARD_TILES = [
  { id: 0, label: 'Start Kitchen', icon: '🧑‍🍳', color: 'bg-amber-100' },
  { id: 1, label: 'Sugar Sack', icon: '🍬', color: 'bg-orange-100' },
  { id: 2, label: 'Whisk Table', icon: '🥣', color: 'bg-yellow-100' },
  { id: 3, label: 'Butter Churn', icon: '🧈', color: 'bg-amber-200' },
  { id: 4, label: 'Mixing Bowl', icon: '🥄', color: 'bg-emerald-100' },
  { id: 5, label: 'Golden Oven!', icon: '🥐', color: 'bg-rose-200' },
];

export const MixAndMove1: React.FC<MixAndMove1Props> = ({
  onComplete,
  onHome,
  onNextGame,
}) => {
  // Select 5 words (1-syllable and 2-syllables)
  const [questions] = useState<SyllableWord[]>(() => {
    const ones = LEVEL_1_WORDS.filter((w) => w.syllableCount === 1).slice(0, 3);
    const twos = LEVEL_1_WORDS.filter((w) => w.syllableCount === 2).slice(0, 3);
    return [...ones, ...twos].sort(() => Math.random() - 0.5).slice(0, 5);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [boardPosition, setBoardPosition] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState<1 | 2 | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const currentWord = questions[currentIndex];

  const handleSort = (sortCount: 1 | 2) => {
    if (answered) return;

    setSelectedSort(sortCount);
    setAnswered(true);

    const correct = sortCount === currentWord.syllableCount;
    setIsCorrect(correct);

    const result: QuestionResult = {
      questionPrompt: `Sort "${currentWord.word}" into 1 or 2 Syllables`,
      targetWord: currentWord.word,
      studentAnswer: `${sortCount} Syllable`,
      correctAnswer: `${currentWord.syllableCount} Syllable`,
      isCorrect: correct,
      syllableBreakdown: `${currentWord.syllables.join(' • ')} (${currentWord.syllableCount})`,
    };

    setResults((prev) => [...prev, result]);

    if (correct) {
      playSound('step');
      firePastryConfetti();
      // Advance baker on board game!
      setBoardPosition((pos) => Math.min(BOARD_TILES.length - 1, pos + 1));
    } else {
      playSound('incorrect');
    }
  };

  const handleNext = () => {
    setSelectedSort(null);
    setAnswered(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
      onComplete(results);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-amber-100/90 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-2 right-2 text-4xl opacity-20">🥐</div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎲</span>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              Mix & Move 1: Bakery Board Game
            </h2>
          </div>
          <p className="text-sm sm:text-base text-amber-900 font-medium">
            <SpeakableText
              text="Sort each word into the 1-Syllable or 2-Syllable tray to move the Chef across the curving board game to the Golden Oven!"
              buttonSize="sm"
            />
          </p>
        </div>
      </div>

      {/* Curving Board Game Track */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-5 sm:p-6 shadow-md overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-1">
            <Footprints className="w-4 h-4 text-amber-700" />
            Curving Bakery Pathway
          </span>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
            Tile {boardPosition + 1} of {BOARD_TILES.length}
          </span>
        </div>

        {/* Responsive Curving Stepping Stones Track */}
        <div className="relative py-4 px-2">
          {/* Subtle curved background line */}
          <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-3 bg-amber-200 -translate-y-1/2 rounded-full z-0" />

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 relative z-10">
            {BOARD_TILES.map((tile, idx) => {
              const isChefHere = boardPosition === idx;
              const isPast = boardPosition > idx;

              return (
                <div
                  key={tile.id}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all relative ${
                    isChefHere
                      ? 'bg-amber-300 border-amber-500 ring-4 ring-amber-400 scale-105 shadow-md'
                      : isPast
                      ? 'bg-emerald-100 border-emerald-300 opacity-90'
                      : `${tile.color} border-stone-300 opacity-70`
                  }`}
                >
                  {isChefHere && (
                    <div className="absolute -top-3.5 bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs animate-bounce">
                      Chef Here!
                    </div>
                  )}

                  <div className="text-3xl sm:text-4xl mb-1">
                    {isChefHere ? '🧑‍🍳' : tile.icon}
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-stone-800 text-center line-clamp-1">
                    {tile.label}
                  </span>
                  <span className="text-[9px] font-semibold text-stone-500">
                    Step {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target Word to Sort */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 sm:p-8 text-center shadow-md space-y-4">
        <div className="text-6xl select-none filter drop-shadow-xs">{currentWord.emoji}</div>

        <div className="flex items-center justify-center gap-2">
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
          Clap the beats! Is it 1 syllable or 2 syllables?
        </p>
      </div>

      {/* Sorting Trays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1 Syllable Tray */}
        <button
          type="button"
          disabled={answered}
          onClick={() => handleSort(1)}
          className={`p-6 rounded-3xl border-3 shadow-md flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-linear-to-b from-sky-50 to-sky-100 border-sky-300 text-sky-950 ${
            selectedSort === 1 ? 'ring-4 ring-sky-400 scale-102' : 'hover:scale-102'
          } ${answered && currentWord.syllableCount === 1 ? 'ring-4 ring-emerald-500 bg-emerald-100' : ''} ${
            answered && selectedSort === 1 && currentWord.syllableCount !== 1
              ? 'ring-4 ring-rose-500 bg-rose-100'
              : ''
          } ${answered && selectedSort !== 1 && currentWord.syllableCount !== 1 ? 'opacity-50' : ''}`}
        >
          <div className="text-4xl">🍞</div>
          <div className="text-2xl font-black">1 Syllable Tray</div>
          <div className="text-xs font-semibold text-sky-800">
            One clap
          </div>
        </button>

        {/* 2 Syllables Tray */}
        <button
          type="button"
          disabled={answered}
          onClick={() => handleSort(2)}
          className={`p-6 rounded-3xl border-3 shadow-md flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-linear-to-b from-emerald-50 to-emerald-100 border-emerald-300 text-emerald-950 ${
            selectedSort === 2 ? 'ring-4 ring-emerald-400 scale-102' : 'hover:scale-102'
          } ${answered && currentWord.syllableCount === 2 ? 'ring-4 ring-emerald-500 bg-emerald-100' : ''} ${
            answered && selectedSort === 2 && currentWord.syllableCount !== 2
              ? 'ring-4 ring-rose-500 bg-rose-100'
              : ''
          } ${answered && selectedSort !== 2 && currentWord.syllableCount !== 2 ? 'opacity-50' : ''}`}
        >
          <div className="text-4xl">🧁</div>
          <div className="text-2xl font-black">2 Syllables Tray</div>
          <div className="text-xs font-semibold text-emerald-800">
            Two claps
          </div>
        </button>
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
              {isCorrect ? '🎉 Step Forward! Chef advances!' : '💡 Good Try! Look at the syllables:'}
            </div>
            <p className="text-sm font-medium">
              <span className="capitalize font-bold">"{currentWord.word}"</span> has{' '}
              <span className="font-extrabold">{currentWord.syllableCount}</span>{' '}
              syllable{currentWord.syllableCount > 1 ? 's' : ''}:{' '}
              <span className="bg-white/80 px-2 py-0.5 rounded-md font-bold">
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
        gameId="mix-and-move-1"
        results={results}
        trophyEarned={true}
        onPlayAgain={() => {
          setShowSummary(false);
          setCurrentIndex(0);
          setBoardPosition(0);
          setResults([]);
          setSelectedSort(null);
          setAnswered(false);
        }}
        onHome={onHome}
        onNextGame={onNextGame}
      />
    </div>
  );
};
