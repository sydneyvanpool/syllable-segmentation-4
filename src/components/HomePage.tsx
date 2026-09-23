import React from 'react';
import { BookOpen, Lock, Sparkles, CheckCircle2, Play, Award } from 'lucide-react';
import { GameId, UserProgress } from '../types';
import { TROPHIES } from '../data/trophies';
import { SpeakableText } from './SpeakableText';
import { isLevel1QuizUnlocked, isLevel2Unlocked, isLevel2QuizUnlocked } from '../utils/storage';

interface HomePageProps {
  progress: UserProgress;
  activeTab: 1 | 2;
  setActiveTab: (tab: 1 | 2) => void;
  onSelectGame: (gameId: GameId) => void;
  onOpenReferenceGuide: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  progress,
  activeTab,
  setActiveTab,
  onSelectGame,
  onOpenReferenceGuide,
}) => {
  const level1QuizReady = isLevel1QuizUnlocked(progress);
  const level2Unlocked = isLevel2Unlocked(progress);
  const level2QuizReady = isLevel2QuizUnlocked(progress);

  const level1Games: { id: GameId; title: string; desc: string; icon: string; trophyEmoji: string; trophyName: string }[] = [
    {
      id: 'ingredient-sort-1',
      title: 'Ingredient Sort 1',
      desc: 'Hear the bakery word and pick the bowl with 1, 2, or 3 syllables.',
      icon: '🥣',
      trophyEmoji: '🧁',
      trophyName: 'Sweet Cupcake',
    },
    {
      id: 'measure-match-1',
      title: 'Measure Match 1',
      desc: 'Find the picture card that matches the target number of syllables.',
      icon: '⚖️',
      trophyEmoji: '🍪',
      trophyName: 'Crispy Cookie',
    },
    {
      id: 'mix-and-move-1',
      title: 'Mix & Move 1',
      desc: 'Sort 1 and 2 syllable words to move the Chef along the curving board game!',
      icon: '🎲',
      trophyEmoji: '🥐',
      trophyName: 'Golden Croissant',
    },
    {
      id: 'recipe-writer-1',
      title: 'Recipe Writer 1',
      desc: 'Read the decodable recipe step and pick the missing word by syllable count.',
      icon: '📖',
      trophyEmoji: '🥧',
      trophyName: 'Berry Pie',
    },
  ];

  const level2Games: { id: GameId; title: string; desc: string; icon: string; trophyEmoji: string; trophyName: string }[] = [
    {
      id: 'ingredient-sort-2',
      title: 'Ingredient Sort 2',
      desc: 'Listen to big multisyllabic words and sort them into jars up to 5 syllables.',
      icon: '🫙',
      trophyEmoji: '🍩',
      trophyName: 'Glazed Donut',
    },
    {
      id: 'measure-match-2',
      title: 'Measure Match 2',
      desc: 'Match words up to 5 syllables with the pastry kitchen scale.',
      icon: '⚖️',
      trophyEmoji: '🥖',
      trophyName: 'Fresh Baguette',
    },
    {
      id: 'mix-and-move-2',
      title: 'Mix & Move 2',
      desc: 'Count syllables and hop forward that exact number of tiles on the board game!',
      icon: '🎲',
      trophyEmoji: '🥞',
      trophyName: 'Fluffy Pancake',
    },
    {
      id: 'recipe-writer-2',
      title: 'Recipe Writer 2',
      desc: 'Complete advanced decodable recipe instructions with multisyllabic words.',
      icon: '📜',
      trophyEmoji: '🥨',
      trophyName: 'Cinnamon Pretzel',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Welcome & Reference Guide Callout */}
      <div className="text-center space-y-4 bg-white/85 backdrop-blur-xs rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs sm:text-sm">
          <span>👩‍🍳</span> Second Grade Phonics & Syllable Practice
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 tracking-tight">
          Welcome to Syllable Bakery!
        </h2>

        <p className="max-w-2xl mx-auto font-medium text-amber-900 flex items-center justify-center">
          <SpeakableText
            text="Break words into syllable beats, bake delicious pastries, and collect all 10 bakery trophies!"
            buttonSize="sm"
            className="inline-flex items-center justify-center gap-1.5"
            buttonClassName="pl-1 w-[36px] h-[36px] shrink-0"
            textClassName="pl-0 text-center text-[18px] leading-[25.25px]"
          />
        </p>

        {/* Reference Guide Button */}
        <div>
          <button
            type="button"
            onClick={onOpenReferenceGuide}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base shadow-md active:scale-95 transition-all cursor-pointer border-2 border-amber-400"
          >
            <BookOpen className="w-5 h-5" />
            <span>Click Here for Syllable Reference Guide</span>
          </button>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-amber-100 rounded-3xl border-2 border-amber-300 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`px-6 py-3 rounded-2xl font-black text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 1
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-950 hover:bg-amber-200/60'
            }`}
          >
            <span>🌟 Level 1 (Up to 3 Syllables)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (level2Unlocked) {
                setActiveTab(2);
              }
            }}
            disabled={!level2Unlocked}
            className={`px-6 py-3 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center gap-2 ${
              !level2Unlocked
                ? 'opacity-60 cursor-not-allowed text-stone-500'
                : activeTab === 2
                ? 'bg-amber-600 text-white shadow-md cursor-pointer'
                : 'text-amber-950 hover:bg-amber-200/60 cursor-pointer'
            }`}
            title={
              !level2Unlocked
                ? 'Pass Level 1 Quiz with 80%+ to unlock Level 2'
                : 'Level 2'
            }
          >
            {!level2Unlocked && <Lock className="w-4 h-4 text-stone-500" />}
            <span>✨ Level 2 (Up to 5 Syllables)</span>
          </button>
        </div>
      </div>

      {/* LEVEL 1 VIEW */}
      {activeTab === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 4 Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {level1Games.map((game) => {
              const isCompleted = !!progress.gameCompletions[game.id];
              const isTrophyEarned = !!progress.trophies[game.id];

              return (
                <div
                  key={game.id}
                  className="bg-white rounded-3xl border-3 border-amber-200 p-5 sm:p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between gap-4 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="text-[36px] leading-tight font-extrabold text-amber-950">
                          {game.title}
                        </h4>
                      </div>
                    </div>

                    {/* Trophy Indicator on Card */}
                    <div
                      title={
                        isTrophyEarned
                          ? `${game.trophyName} Trophy Earned!`
                          : `Win this game to earn ${game.trophyName} Trophy`
                      }
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center border-2 transition-all shrink-0 ${
                        isTrophyEarned
                          ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300 text-2xl shadow-xs scale-105'
                          : 'bg-stone-100 border-stone-300 text-stone-400 text-xl'
                      }`}
                    >
                      {isTrophyEarned ? game.trophyEmoji : '?'}
                      <span className="text-[8px] font-extrabold uppercase">
                        {isTrophyEarned ? 'Trophy' : 'Locked'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                    <SpeakableText text={game.desc} buttonSize="sm" />
                  </p>

                  <button
                    type="button"
                    onClick={() => onSelectGame(game.id)}
                    className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm sm:text-base shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {isCompleted ? 'Play Again' : 'Play Game'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Level 1 Quiz Card */}
          <div
            className={`rounded-3xl border-3 p-6 sm:p-7 transition-all ${
              level1QuizReady
                ? 'bg-linear-to-r from-amber-100 via-yellow-100 to-amber-100 border-amber-400 shadow-lg'
                : 'bg-stone-100 border-stone-300 opacity-85'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-xs border-2 ${
                    progress.trophies['level-1-quiz']
                      ? 'bg-amber-200 border-amber-400 ring-2 ring-amber-300'
                      : 'bg-white border-amber-300'
                  }`}
                >
                  {progress.trophies['level-1-quiz'] ? '🎂' : level1QuizReady ? '🎂' : '🔒'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-xl sm:text-2xl font-black text-amber-950">
                      Level 1 Syllable Quiz (10 Questions)
                    </h4>
                    {progress.trophies['level-1-quiz'] && (
                      <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        Celebration Cake Trophy Won! (Score: {progress.quizScores['level-1-quiz']}/10)
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900 mt-1 font-medium">
                    <SpeakableText
                      text={
                        level1QuizReady
                          ? 'Finish all 10 questions with 80%+ (at least 8 correct) to unlock Level 2 and win the Celebration Cake Trophy!'
                          : 'Locked! Complete all 4 Level 1 games above to unlock this 10-question quiz.'
                      }
                      buttonSize="sm"
                    />
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={!level1QuizReady}
                onClick={() => onSelectGame('level-1-quiz')}
                className={`px-8 py-3.5 rounded-2xl font-black text-base shadow-md transition-all shrink-0 ${
                  level1QuizReady
                    ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95 cursor-pointer ring-2 ring-amber-400'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {progress.trophies['level-1-quiz']
                  ? 'Retake Quiz'
                  : level1QuizReady
                  ? 'Start Level 1 Quiz'
                  : 'Locked'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2 VIEW */}
      {activeTab === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 4 Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {level2Games.map((game) => {
              const isCompleted = !!progress.gameCompletions[game.id];
              const isTrophyEarned = !!progress.trophies[game.id];

              return (
                <div
                  key={game.id}
                  className="bg-white rounded-3xl border-3 border-amber-200 p-5 sm:p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between gap-4 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="text-[36px] leading-tight font-extrabold text-amber-950">
                          {game.title}
                        </h4>
                      </div>
                    </div>

                    {/* Trophy Indicator */}
                    <div
                      title={
                        isTrophyEarned
                          ? `${game.trophyName} Trophy Earned!`
                          : `Win this game to earn ${game.trophyName} Trophy`
                      }
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center border-2 transition-all shrink-0 ${
                        isTrophyEarned
                          ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300 text-2xl shadow-xs scale-105'
                          : 'bg-stone-100 border-stone-300 text-stone-400 text-xl'
                      }`}
                    >
                      {isTrophyEarned ? game.trophyEmoji : '?'}
                      <span className="text-[8px] font-extrabold uppercase">
                        {isTrophyEarned ? 'Trophy' : 'Locked'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                    <SpeakableText text={game.desc} buttonSize="sm" />
                  </p>

                  <button
                    type="button"
                    onClick={() => onSelectGame(game.id)}
                    className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm sm:text-base shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {isCompleted ? 'Play Again' : 'Play Game'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Level 2 Quiz Card */}
          <div
            className={`rounded-3xl border-3 p-6 sm:p-7 transition-all ${
              level2QuizReady
                ? 'bg-linear-to-r from-amber-100 via-yellow-100 to-amber-100 border-amber-400 shadow-lg'
                : 'bg-stone-100 border-stone-300 opacity-85'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-xs border-2 ${
                    progress.trophies['level-2-quiz']
                      ? 'bg-amber-200 border-amber-400 ring-2 ring-amber-300'
                      : 'bg-white border-amber-300'
                  }`}
                >
                  {progress.trophies['level-2-quiz'] ? '🍰' : level2QuizReady ? '🍰' : '🔒'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-xl sm:text-2xl font-black text-amber-950">
                      Level 2 Master Quiz (10 Questions)
                    </h4>
                    {progress.trophies['level-2-quiz'] && (
                      <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        Master Pastry Trophy Won! (Score: {progress.quizScores['level-2-quiz']}/10)
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900 mt-1 font-medium">
                    <SpeakableText
                      text={
                        level2QuizReady
                          ? 'Complete all 10 questions with 80%+ to win the 10th and final trophy: Master Pastry Trophy!'
                          : 'Locked! Finish all 4 Level 2 games above to unlock this final 10-question master quiz.'
                      }
                      buttonSize="sm"
                    />
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={!level2QuizReady}
                onClick={() => onSelectGame('level-2-quiz')}
                className={`px-8 py-3.5 rounded-2xl font-black text-base shadow-md transition-all shrink-0 ${
                  level2QuizReady
                    ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95 cursor-pointer ring-2 ring-amber-400'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {progress.trophies['level-2-quiz']
                  ? 'Retake Quiz'
                  : level2QuizReady
                  ? 'Start Level 2 Quiz'
                  : 'Locked'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
