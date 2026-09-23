import React from 'react';
import { Home, Trophy as TrophyIcon } from 'lucide-react';
import { GameId, Trophy } from '../types';
import { TROPHIES } from '../data/trophies';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  currentGameId?: GameId | null;
  trophyCount: number;
  totalTrophies?: number;
  isCurrentTrophyEarned?: boolean;
  onHomeClick: () => void;
  onTrophiesClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Syllable Bakery',
  subtitle,
  currentGameId,
  trophyCount,
  totalTrophies = 10,
  isCurrentTrophyEarned = false,
  onHomeClick,
  onTrophiesClick,
}) => {
  const currentTrophy: Trophy | undefined = currentGameId
    ? TROPHIES.find((t) => t.id === currentGameId)
    : undefined;

  return (
    <header className="w-full bg-linear-to-r from-amber-50 via-orange-50 to-amber-50 border-b-2 border-amber-200 px-4 py-3 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Top Left: Trophies Button */}
        <button
          id="header-trophy-btn"
          type="button"
          onClick={onTrophiesClick}
          aria-label={`Show earned trophies. Currently ${trophyCount} of ${totalTrophies} earned`}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border-2 border-amber-300 shadow-xs hover:bg-amber-50 active:scale-95 transition-all text-amber-950 font-bold text-sm sm:text-base cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        >
          <span className="text-xl">🏆</span>
          <span className="hidden xs:inline">Trophies:</span>
          <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-xs sm:text-sm font-extrabold">
            {trophyCount}/{totalTrophies}
          </span>
        </button>

        {/* Center: Game / Page Name + Current Game Trophy Badge if in game */}
        <div className="flex flex-col items-center text-center px-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 max-w-full">
            <h1 className="text-lg sm:text-2xl font-extrabold text-amber-950 truncate tracking-tight">
              {title}
            </h1>
            {currentTrophy && (
              <div
                title={
                  isCurrentTrophyEarned
                    ? `${currentTrophy.name} Earned!`
                    : `Complete this game to earn ${currentTrophy.name}`
                }
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-base transition-all ${
                  isCurrentTrophyEarned
                    ? 'bg-amber-300 ring-2 ring-amber-400 shadow-sm scale-110'
                    : 'bg-gray-200 grayscale opacity-60'
                }`}
              >
                <span>{currentTrophy.emoji}</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-amber-800/80 font-medium truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Top Right: Home Button */}
        <button
          id="header-home-btn"
          type="button"
          onClick={onHomeClick}
          aria-label="Go to Home"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm sm:text-base shadow-sm active:scale-95 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>
    </header>
  );
};
