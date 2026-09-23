import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Trophy, RotateCcw, Home, ArrowRight } from 'lucide-react';
import { QuestionResult, GameId } from '../types';
import { TROPHIES } from '../data/trophies';
import { SpeakableText } from './SpeakableText';
import { playSound } from '../utils/audio';
import { firePastryConfetti } from '../utils/confetti';

interface SummaryModalProps {
  isOpen: boolean;
  gameId: GameId;
  results: QuestionResult[];
  trophyEarned: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
  onNextGame?: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  gameId,
  results,
  trophyEarned,
  onPlayAgain,
  onHome,
  onNextGame,
}) => {
  useEffect(() => {
    if (isOpen && trophyEarned) {
      playSound('trophy');
      firePastryConfetti();
    }
  }, [isOpen, trophyEarned]);

  if (!isOpen) return null;

  const trophy = TROPHIES.find((t) => t.id === gameId);
  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalCount = results.length;
  const percentage = Math.round((correctCount / totalCount) * 100) || 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border-b-2 border-amber-300 text-center">
          {trophyEarned ? (
            <div className="space-y-1">
              <div className="text-5xl animate-bounce">{trophy?.emoji || '🏆'}</div>
              <h2 className="text-2xl font-black text-amber-950">
                <SpeakableText text="Trophy Earned!" buttonSize="sm" />
              </h2>
              <p className="text-sm font-bold text-amber-900">
                You won the {trophy?.name}!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-4xl">🧑‍🍳</div>
              <h2 className="text-2xl font-black text-amber-950">
                <SpeakableText text="Game Summary" buttonSize="sm" />
              </h2>
              <p className="text-sm font-bold text-amber-900">
                Score: {correctCount} of {totalCount} Correct ({percentage}%)
              </p>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-amber-900 px-2">
            <span>Word & Syllables</span>
            <span>Result</span>
          </div>

          <div className="space-y-2.5">
            {results.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                  item.isCorrect
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-rose-50/80 border-rose-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </span>
                  <div>
                    <div className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-1.5">
                      <span className="capitalize">{item.targetWord}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        {item.syllableBreakdown}
                      </span>
                    </div>
                    {!item.isCorrect && (
                      <p className="text-xs text-stone-600 mt-0.5">
                        Your answer: <span className="font-semibold text-rose-700">{String(item.studentAnswer)}</span> • Correct: <span className="font-semibold text-emerald-700">{String(item.correctAnswer)}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <SpeakableText
                    text={`${item.targetWord}. ${item.syllableBreakdown}`}
                    buttonSize="sm"
                    showButton={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-amber-100/80 border-t border-amber-300 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onHome}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPlayAgain}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-sm shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>

            {onNextGame && (
              <button
                type="button"
                onClick={onNextGame}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Next Game
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
