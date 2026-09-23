import React, { useState } from 'react';
import { X, Award, HelpCircle, CheckCircle2 } from 'lucide-react';
import { TROPHIES } from '../data/trophies';
import { Trophy, GameId } from '../types';
import { SpeakableText } from './SpeakableText';

interface TrophyModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedTrophies: Record<GameId, boolean>;
  onSelectGame?: (gameId: GameId) => void;
}

export const TrophyModal: React.FC<TrophyModalProps> = ({
  isOpen,
  onClose,
  earnedTrophies,
  onSelectGame,
}) => {
  const [selectedTrophy, setSelectedTrophy] = useState<Trophy | null>(null);

  if (!isOpen) return null;

  const earnedCount = Object.values(earnedTrophies).filter(Boolean).length;

  const handleTrophyClick = (trophy: Trophy) => {
    setSelectedTrophy(trophy);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border-b-2 border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏆</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 flex items-center gap-1.5">
                <SpeakableText text="Bakery Trophy Case" buttonSize="sm" />
              </h2>
              <p className="text-xs sm:text-sm text-amber-900 font-medium">
                {earnedCount} of 10 Trophies Collected!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close trophies"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-amber-950 flex items-center justify-center font-bold text-lg shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="bg-white/80 rounded-2xl p-3 sm:p-4 border border-amber-200 text-xs sm:text-sm text-amber-900">
            <SpeakableText
              text="Click any locked '?' trophy to reveal which bakery game to play to win it! Collect all 10 to become the Master Baker!"
              buttonSize="sm"
            />
          </div>

          {/* Level 1 Trophies */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-amber-900 mb-2.5 flex items-center gap-1.5">
              <span>🌟</span>
              <span>Level 1 Trophies</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {TROPHIES.filter((t) => t.level === 1).map((trophy) => {
                const isEarned = !!earnedTrophies[trophy.id];
                return (
                  <button
                    key={trophy.id}
                    type="button"
                    onClick={() => handleTrophyClick(trophy)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                      isEarned
                        ? 'bg-gradient-to-b from-yellow-50 to-amber-100 border-amber-400 shadow-sm hover:scale-105'
                        : 'bg-stone-100 border-stone-300 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    {isEarned ? (
                      <>
                        <div className="text-4xl mb-1 filter drop-shadow-sm animate-bounce">
                          {trophy.emoji}
                        </div>
                        <span className="text-xs font-bold text-amber-950 line-clamp-1">
                          {trophy.name.replace(' Trophy', '')}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> Earned!
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-2xl font-black mb-1 border border-stone-300">
                          ?
                        </div>
                        <span className="text-xs font-bold text-stone-500 line-clamp-1">
                          Locked
                        </span>
                        <span className="text-[10px] text-amber-700 font-medium underline mt-1">
                          Tap to reveal
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level 2 Trophies */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-amber-900 mb-2.5 flex items-center gap-1.5">
              <span>✨</span>
              <span>Level 2 Trophies</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {TROPHIES.filter((t) => t.level === 2).map((trophy) => {
                const isEarned = !!earnedTrophies[trophy.id];
                return (
                  <button
                    key={trophy.id}
                    type="button"
                    onClick={() => handleTrophyClick(trophy)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                      isEarned
                        ? 'bg-gradient-to-b from-yellow-50 to-amber-100 border-amber-400 shadow-sm hover:scale-105'
                        : 'bg-stone-100 border-stone-300 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    {isEarned ? (
                      <>
                        <div className="text-4xl mb-1 filter drop-shadow-sm">
                          {trophy.emoji}
                        </div>
                        <span className="text-xs font-bold text-amber-950 line-clamp-1">
                          {trophy.name.replace(' Trophy', '')}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> Earned!
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-2xl font-black mb-1 border border-stone-300">
                          ?
                        </div>
                        <span className="text-xs font-bold text-stone-500 line-clamp-1">
                          Locked
                        </span>
                        <span className="text-[10px] text-amber-700 font-medium underline mt-1">
                          Tap to reveal
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Trophy Detail Card */}
          {selectedTrophy && (
            <div className="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-md flex flex-col sm:flex-row items-center gap-4 animate-in fade-in">
              <div className="text-5xl shrink-0 p-3 bg-amber-100 rounded-2xl">
                {earnedTrophies[selectedTrophy.id] ? selectedTrophy.emoji : '❓'}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-lg font-extrabold text-amber-950">
                    {selectedTrophy.name}
                  </h4>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      earnedTrophies[selectedTrophy.id]
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {earnedTrophies[selectedTrophy.id] ? 'Unlocked!' : 'Hint to Earn'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900">
                  <SpeakableText
                    text={
                      earnedTrophies[selectedTrophy.id]
                        ? selectedTrophy.description
                        : `To earn this trophy: ${selectedTrophy.howToEarn}`
                    }
                    buttonSize="sm"
                  />
                </p>
                {onSelectGame && !earnedTrophies[selectedTrophy.id] && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectGame(selectedTrophy.id);
                        onClose();
                      }}
                      className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                    >
                      Go to {selectedTrophy.gameName}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
