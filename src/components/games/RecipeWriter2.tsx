import React, { useState } from 'react';
import { Volume2, ArrowRight, BookOpen, VolumeX } from 'lucide-react';
import { SpeakableText } from '../SpeakableText';
import { RECIPE_SENTENCES_LEVEL_2 } from '../../data/syllableData';
import { QuestionResult } from '../../types';
import { playSound, speakText, stopSpeaking } from '../../utils/audio';
import { firePastryConfetti } from '../../utils/confetti';
import { SummaryModal } from '../SummaryModal';

interface RecipeWriter2Props {
  onComplete: (results: QuestionResult[]) => void;
  onHome: () => void;
  onNextGame: () => void;
}

export const RecipeWriter2: React.FC<RecipeWriter2Props> = ({
  onComplete,
  onHome,
  onNextGame,
}) => {
  const targetCorrect = RECIPE_SENTENCES_LEVEL_2.length;
  const [questions, setQuestions] = useState(RECIPE_SENTENCES_LEVEL_2);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentTask = questions[currentIndex];

  const handleSelectWord = (word: string, syllables: string[], count: number) => {
    if (answered) return;

    setSelectedWord(word);
    setAnswered(true);

    const correct = word === currentTask.correctWord;
    setIsCorrect(correct);

    const result: QuestionResult = {
      questionPrompt: currentTask.instruction,
      targetWord: currentTask.correctWord,
      studentAnswer: `${word} (${count} syl)`,
      correctAnswer: `${currentTask.correctWord} (${currentTask.targetSyllableCount} syl)`,
      isCorrect: correct,
      syllableBreakdown: `${syllables.join(' • ')} (${count})`,
    };

    setResults((prev) => [...prev, result]);

    if (correct) {
      playSound('correct');
      firePastryConfetti();
      setCorrectCount((prev) => prev + 1);
    } else {
      playSound('incorrect');
      const randomTask = RECIPE_SENTENCES_LEVEL_2[Math.floor(Math.random() * RECIPE_SENTENCES_LEVEL_2.length)];
      setQuestions((prev) => [...prev, randomTask]);
    }
  };

  const handleNext = () => {
    setSelectedWord(null);
    setAnswered(false);

    if (correctCount >= targetCorrect || currentIndex + 1 >= questions.length) {
      setShowSummary(true);
      onComplete(results);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const progressPercent = Math.min(100, Math.round((correctCount / targetCorrect) * 100));
  const fullSentence = `${currentTask.before} ${selectedWord || '______'} ${currentTask.after}`;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-amber-100/90 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-2 right-2 text-4xl opacity-20">🥨</div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-900" />
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              Recipe Writer 2 (Master Recipes)
            </h2>
          </div>
          <p className="text-sm sm:text-base text-amber-900 font-medium">
            <SpeakableText
              text="Read the bakery recipe. Pick the multisyllabic word with the requested syllables to finish the recipe!"
              buttonSize="sm"
            />
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-bold text-amber-900 mb-1">
            <span>Recipe Step {currentIndex + 1} of {questions.length}</span>
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

      {/* Recipe Folio Display */}
      <div className="bg-[#fffdf5] rounded-3xl border-3 border-amber-300 p-6 sm:p-8 shadow-lg relative space-y-6">
        <div className="p-6 rounded-2xl bg-amber-50/60 border-2 border-dashed border-amber-300 text-lg sm:text-2xl font-bold text-stone-900 leading-relaxed">
          <div className="leading-relaxed">
            <span>{currentTask.before}</span>{' '}
            <span
              className={`inline-block px-2.5 py-0.5 mx-1 rounded-xl border-2 font-black transition-all align-middle ${
                selectedWord
                  ? answered
                    ? isCorrect
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                      : 'bg-rose-100 border-rose-400 text-rose-950'
                    : 'bg-amber-200 border-amber-400 text-amber-950'
                  : 'bg-white border-amber-300 text-stone-400 min-w-[120px] text-center'
              }`}
            >
              {selectedWord || '______'}
            </span>{' '}
            <span>{currentTask.after}</span>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                  setIsSpeaking(false);
                } else {
                  setIsSpeaking(true);
                  speakText(
                    fullSentence,
                    undefined,
                    () => setIsSpeaking(false)
                  );
                }
              }}
              className="px-4 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-800 animate-pulse" />
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Recipe Step</span>
                </>
              )}
            </button>

            {!selectedWord && (
              <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 border border-amber-300/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <span>⏸️</span> Audio pauses at the blank
              </span>
            )}
          </div>
        </div>

        {/* Word Options */}
        <div className="space-y-2">
          <span className="font-bold text-center text-[22px] text-black uppercase tracking-wider block">
            Choose the word with {currentTask.targetSyllableCount} syllable{currentTask.targetSyllableCount > 1 ? 's' : ''}:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentTask.options.map((opt) => {
              const isSelected = selectedWord === opt.word;
              const isThisCorrect = answered && opt.word === currentTask.correctWord;
              const isThisWrong = answered && isSelected && !isThisCorrect;

              return (
                <button
                  key={opt.word}
                  type="button"
                  disabled={answered}
                  onClick={() => handleSelectWord(opt.word, opt.syllables, opt.syllableCount)}
                  className={`p-4 rounded-2xl border-2 font-black text-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected ? 'ring-4 ring-amber-400 scale-102' : 'hover:scale-102'
                  } ${
                    isThisCorrect
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500'
                      : isThisWrong
                      ? 'bg-rose-100 border-rose-400 text-rose-950 ring-2 ring-rose-500'
                      : 'bg-white border-amber-300 text-amber-950 hover:bg-amber-50'
                  } ${answered && !isSelected && !isThisCorrect ? 'opacity-60' : ''}`}
                >
                  <span className="capitalize">{opt.word}</span>
                  {answered && (
                    <span className="text-xs font-bold text-stone-600">
                      {opt.syllables.join(' • ')} ({opt.syllableCount} syl)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
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
              {isCorrect ? '🎉 Chef Approval! Master step complete!' : '💡 Syllable Check:'}
            </div>
            <p className="text-sm font-medium">
              "{currentTask.correctWord}" has {currentTask.targetSyllableCount} syllables!
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm sm:text-base shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {currentIndex + 1 < questions.length ? 'Next Step' : 'See Results'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <SummaryModal
        isOpen={showSummary}
        gameId="recipe-writer-2"
        results={results}
        trophyEarned={true}
        onPlayAgain={() => {
          setShowSummary(false);
          setCurrentIndex(0);
          setResults([]);
          setSelectedWord(null);
          setAnswered(false);
        }}
        onHome={onHome}
        onNextGame={onNextGame}
      />
    </div>
  );
};
