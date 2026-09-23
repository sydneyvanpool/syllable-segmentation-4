import React, { useState } from 'react';
import { Volume2, ArrowRight, Scale } from 'lucide-react';
import { SpeakableText } from '../SpeakableText';
import { LEVEL_2_WORDS, LEVEL_1_WORDS } from '../../data/syllableData';
import { QuestionResult, SyllableWord } from '../../types';
import { playSound, speakText } from '../../utils/audio';
import { firePastryConfetti } from '../../utils/confetti';
import { SummaryModal } from '../SummaryModal';

interface MeasureMatch2Props {
  onComplete: (results: QuestionResult[]) => void;
  onHome: () => void;
  onNextGame: () => void;
}

interface MatchQuestion {
  targetCount: number;
  options: SyllableWord[];
  correctWord: SyllableWord;
}

export const MeasureMatch2: React.FC<MeasureMatch2Props> = ({
  onComplete,
  onHome,
  onNextGame,
}) => {
  const [questions] = useState<MatchQuestion[]>(() => {
    const targets = [4, 3, 5, 2, 4, 3];
    const allWords = [...LEVEL_1_WORDS, ...LEVEL_2_WORDS];

    return targets.map((target) => {
      const candidates = allWords.filter((w) => w.syllableCount === target);
      const wrong = allWords.filter((w) => w.syllableCount !== target);
      const correct = candidates[Math.floor(Math.random() * candidates.length)] || candidates[0];

      const distinctWrong: SyllableWord[] = [];
      const shuffledWrong = [...wrong].sort(() => Math.random() - 0.5);
      for (const w of shuffledWrong) {
        if (!distinctWrong.some((x) => x.syllableCount === w.syllableCount)) {
          distinctWrong.push(w);
        }
        if (distinctWrong.length >= 2) break;
      }

      const options = [correct, ...distinctWrong].sort(() => Math.random() - 0.5);
      return {
        targetCount: target,
        options,
        correctWord: correct,
      };
    });
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (wordObj: SyllableWord) => {
    if (answered) return;

    setSelectedWord(wordObj.word);
    setAnswered(true);

    const correct = wordObj.syllableCount === currentQ.targetCount;
    setIsCorrect(correct);

    const result: QuestionResult = {
      questionPrompt: `Pick the word with ${currentQ.targetCount} syllables`,
      targetWord: wordObj.word,
      studentAnswer: `${wordObj.word} (${wordObj.syllableCount} syl)`,
      correctAnswer: `${currentQ.correctWord.word} (${currentQ.correctWord.syllableCount} syl)`,
      isCorrect: correct,
      syllableBreakdown: `${wordObj.syllables.join(' • ')} (${wordObj.syllableCount})`,
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
    setSelectedWord(null);
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
        <div className="absolute top-2 right-2 text-4xl opacity-20">🥖</div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-amber-900" />
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              Measure Match 2
            </h2>
          </div>
          <p className="text-sm sm:text-base text-amber-900 font-medium">
            <SpeakableText
              text="Read the words on the scale trays. Tap the word that has the requested number of syllables!"
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

      {/* Target Prompt Box */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 text-center shadow-md space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-sm uppercase tracking-wider border border-amber-300">
          <span>⚖️</span> Digital Pastry Scale Target
        </div>
        <div className="text-2xl sm:text-3xl font-black text-amber-950 flex items-center justify-center gap-2">
          <SpeakableText
            text={`Pick the word with ${currentQ.targetCount} syllables!`}
            buttonSize="md"
          />
        </div>
      </div>

      {/* Word Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {currentQ.options.map((opt) => {
          const isSelected = selectedWord === opt.word;
          const isThisCorrect = answered && opt.syllableCount === currentQ.targetCount;
          const isThisWrong = answered && isSelected && !isThisCorrect;

          return (
            <div
              key={opt.word}
              className={`bg-white rounded-3xl border-3 p-6 shadow-md flex flex-col items-center justify-between gap-4 transition-all ${
                isSelected ? 'ring-4 ring-amber-400 scale-102' : 'hover:scale-102'
              } ${isThisCorrect ? 'ring-4 ring-emerald-500 bg-emerald-50 border-emerald-400' : 'border-amber-200'} ${
                isThisWrong ? 'ring-4 ring-rose-500 bg-rose-50 border-rose-400' : ''
              } ${answered && !isSelected && !isThisCorrect ? 'opacity-60' : ''}`}
            >
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  onClick={() => speakText(opt.word)}
                  className="w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center shadow-xs cursor-pointer"
                  title={`Hear ${opt.word}`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-5xl sm:text-6xl select-none filter drop-shadow-xs">
                {opt.emoji || '🥖'}
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-black text-stone-900 capitalize tracking-tight">
                  {opt.word}
                </h3>
                {answered && (
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 mt-1.5 inline-block">
                    {opt.syllables.join(' • ')} ({opt.syllableCount})
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={answered}
                onClick={() => handleSelectOption(opt)}
                className={`w-full py-2.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-xs active:scale-95 transition-all cursor-pointer ${
                  isThisCorrect
                    ? 'bg-emerald-600 text-white'
                    : isThisWrong
                    ? 'bg-rose-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {answered
                  ? isThisCorrect
                    ? '✓ Match Found!'
                    : isSelected
                    ? '✗ Not This Word'
                    : 'Pick'
                  : 'Choose Word'}
              </button>
            </div>
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
              {isCorrect ? '🎉 Perfect Measurement!' : '💡 Syllable Check:'}
            </div>
            <p className="text-sm font-medium">
              <span className="capitalize font-bold">"{currentQ.correctWord.word}"</span> has{' '}
              <span className="font-extrabold">{currentQ.correctWord.syllableCount}</span>{' '}
              syllables ({currentQ.correctWord.syllables.join(' • ')}).
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
        gameId="measure-match-2"
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
