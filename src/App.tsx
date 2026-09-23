import React, { useState, useEffect } from 'react';
import { GameId, UserProgress, QuestionResult } from './types';
import { TROPHIES } from './data/trophies';
import {
  loadProgress,
  awardTrophy,
  saveQuizResult,
  countEarnedTrophies,
} from './utils/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { TrophyModal } from './components/TrophyModal';
import { ReferenceGuideModal } from './components/ReferenceGuideModal';
import { SelectionSpeaker } from './components/SelectionSpeaker';
import { IngredientSort1 } from './components/games/IngredientSort1';
import { MeasureMatch1 } from './components/games/MeasureMatch1';
import { MixAndMove1 } from './components/games/MixAndMove1';
import { RecipeWriter1 } from './components/games/RecipeWriter1';
import { IngredientSort2 } from './components/games/IngredientSort2';
import { MeasureMatch2 } from './components/games/MeasureMatch2';
import { MixAndMove2 } from './components/games/MixAndMove2';
import { RecipeWriter2 } from './components/games/RecipeWriter2';
import { LevelQuiz } from './components/games/LevelQuiz';
import { stopSpeaking } from './utils/audio';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [currentGame, setCurrentGame] = useState<GameId | null>(null);
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const [isTrophyModalOpen, setIsTrophyModalOpen] = useState<boolean>(false);
  const [isReferenceGuideOpen, setIsReferenceGuideOpen] = useState<boolean>(false);

  // Stop any active speech on unmount or game transition
  useEffect(() => {
    stopSpeaking();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentGame]);

  const handleSelectGame = (gameId: GameId) => {
    stopSpeaking();
    setCurrentGame(gameId);
  };

  const handleHome = () => {
    stopSpeaking();
    setCurrentGame(null);
  };

  const handleGameComplete = (gameId: GameId, results: QuestionResult[]) => {
    // Award trophy and save game completion
    setProgress((prev) => awardTrophy(gameId, prev));
  };

  const handleQuizComplete = (
    quizId: 'level-1-quiz' | 'level-2-quiz',
    score: number,
    results: QuestionResult[]
  ) => {
    setProgress((prev) => {
      const updated = saveQuizResult(quizId, score, prev);
      if (quizId === 'level-1-quiz' && score >= 8) {
        // Automatically switch active tab to Level 2
        setActiveTab(2);
      }
      return updated;
    });
  };

  const earnedTrophyCount = countEarnedTrophies(progress);
  const currentTrophyEarned = currentGame ? !!progress.trophies[currentGame] : false;

  const currentTrophy = currentGame
    ? TROPHIES.find((t) => t.id === currentGame)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col cookie-pattern-bg text-amber-950 selection:bg-amber-300 selection:text-amber-950">
      {/* Floating selection speaker for accessibility */}
      <SelectionSpeaker />

      {/* Persistent Global Header */}
      <Header
        title={currentTrophy ? currentTrophy.gameName : 'Syllable Bakery'}
        subtitle={currentGame ? 'The Vanpool School' : 'Syllable Segmentation Practice'}
        currentGameId={currentGame}
        trophyCount={earnedTrophyCount}
        totalTrophies={10}
        isCurrentTrophyEarned={currentTrophyEarned}
        onHomeClick={handleHome}
        onTrophiesClick={() => setIsTrophyModalOpen(true)}
      />

      {/* Main Game / Menu Stage */}
      <main className="flex-1 flex flex-col justify-start py-4">
        {currentGame === null && (
          <HomePage
            progress={progress}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSelectGame={handleSelectGame}
            onOpenReferenceGuide={() => setIsReferenceGuideOpen(true)}
          />
        )}

        {currentGame === 'ingredient-sort-1' && (
          <IngredientSort1
            onComplete={(results) => handleGameComplete('ingredient-sort-1', results)}
            onHome={handleHome}
            onNextGame={() => handleSelectGame('measure-match-1')}
          />
        )}

        {currentGame === 'measure-match-1' && (
          <MeasureMatch1
            onComplete={(results) => handleGameComplete('measure-match-1', results)}
            onHome={handleHome}
            onNextGame={() => handleSelectGame('mix-and-move-1')}
          />
        )}

        {currentGame === 'mix-and-move-1' && (
          <MixAndMove1
            onComplete={(results) => handleGameComplete('mix-and-move-1', results)}
            onHome={handleHome}
            onNextGame={() => handleSelectGame('recipe-writer-1')}
          />
        )}

        {currentGame === 'recipe-writer-1' && (
          <RecipeWriter1
            onComplete={(results) => handleGameComplete('recipe-writer-1', results)}
            onHome={handleHome}
            onNextGame={() => handleSelectGame('level-1-quiz')}
          />
        )}

        {currentGame === 'level-1-quiz' && (
          <LevelQuiz
            level={1}
            onComplete={(score, results) => handleQuizComplete('level-1-quiz', score, results)}
            onHome={handleHome}
          />
        )}

        {currentGame === 'ingredient-sort-2' && (
          <IngredientSort2
            onComplete={(results) => handleGameComplete('ingredient-sort-2', results)}
            onHome={handleHome}
            onNextGame={() => handleSelectGame('measure-match-2')}
          />
        )}

        {currentGame === 'measure-match-2' && (
          <MeasureMatch2
            onComplete={(results) => handleGameComplete('measure-match-2', results)}
            onHome={handleHome}
            onNextGame={() => handleSelectGame('mix-and-move-2')}
          />
        )}

        {currentGame === 'mix-and-move-2' && (
          <MixAndMove2
            onComplete={(results) => handleGameComplete('mix-and-move-2', results)}
            onHome={handleHome}
            onNextGame={() => handleSelectGame('recipe-writer-2')}
          />
        )}

        {currentGame === 'recipe-writer-2' && (
          <RecipeWriter2
            onComplete={(results) => handleGameComplete('recipe-writer-2', results)}
            onHome={handleHome}
            onNextGame={() => handleSelectGame('level-2-quiz')}
          />
        )}

        {currentGame === 'level-2-quiz' && (
          <LevelQuiz
            level={2}
            onComplete={(score, results) => handleQuizComplete('level-2-quiz', score, results)}
            onHome={handleHome}
          />
        )}
      </main>

      {/* Persistent Global Footer with required Branding */}
      <Footer />

      {/* Trophy Case Modal */}
      <TrophyModal
        isOpen={isTrophyModalOpen}
        onClose={() => setIsTrophyModalOpen(false)}
        earnedTrophies={progress.trophies}
        onSelectGame={handleSelectGame}
      />

      {/* Reference Guide Modal */}
      <ReferenceGuideModal
        isOpen={isReferenceGuideOpen}
        onClose={() => setIsReferenceGuideOpen(false)}
      />
    </div>
  );
}
