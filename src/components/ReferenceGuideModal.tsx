import React from 'react';
import { X, BookOpen, Sparkles, Smile, Hand, Volume2 } from 'lucide-react';
import { SpeakableText } from './SpeakableText';
import { speakText, playSound } from '../utils/audio';

interface ReferenceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceGuideModal: React.FC<ReferenceGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const testClap = (word: string, syllables: string[]) => {
    playSound('step');
    speakText(syllables.join(' ... '));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-200 via-orange-100 to-amber-200 border-b-2 border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📖</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950">
                <SpeakableText text="Syllable Quick Reference Guide" buttonSize="sm" />
              </h2>
              <p className="text-xs sm:text-sm text-amber-900 font-medium">
                How to break and count syllables like a chef!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-amber-950 flex items-center justify-center font-bold text-lg shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-amber-950">
          {/* Definition Banner */}
          <div className="bg-amber-100/90 rounded-2xl p-4 border-2 border-amber-300 shadow-xs">
            <h3 className="text-base sm:text-lg font-extrabold text-amber-950 mb-1 flex items-center gap-1.5">
              <span>💡</span>
              <SpeakableText text="What is a Syllable?" buttonSize="sm" />
            </h3>
            <p className="text-sm sm:text-base text-amber-900 leading-relaxed">
              <SpeakableText
                text="A syllable is a word part with one talking vowel sound. It is a beat in the word! Words can have 1, 2, 3, 4, or even 5 beats."
                buttonSize="sm"
              />
            </p>
          </div>

          {/* Three Baker Tricks */}
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-amber-950 mb-3 flex items-center gap-1.5">
              <span>🧑‍🍳</span>
              <SpeakableText text="3 Baker Tricks to Count Syllables" buttonSize="sm" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Trick 1: Chin Drop */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs space-y-2">
                <div className="text-2xl">🖐️</div>
                <h4 className="font-bold text-sm sm:text-base text-amber-900">
                  <SpeakableText text="1. The Chin Drop" buttonSize="sm" />
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <SpeakableText
                    text="Put your hand under your chin. Say the word. Count how many times your chin drops down on your hand!"
                    buttonSize="sm"
                  />
                </p>
              </div>

              {/* Trick 2: Clap & Count */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs space-y-2">
                <div className="text-2xl">👏</div>
                <h4 className="font-bold text-sm sm:text-base text-amber-900">
                  <SpeakableText text="2. Clap & Count" buttonSize="sm" />
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <SpeakableText
                    text="Clap your hands for every beat of the word. Cup-cake has 2 claps, so it has 2 syllables!"
                    buttonSize="sm"
                  />
                </p>
              </div>

              {/* Trick 3: Hum It */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs space-y-2">
                <div className="text-2xl">🎶</div>
                <h4 className="font-bold text-sm sm:text-base text-amber-900">
                  <SpeakableText text="3. Hum the Beats" buttonSize="sm" />
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <SpeakableText
                    text="Close your lips and hum the word. Mmm-mmm! Hear the beats clearly like music notes."
                    buttonSize="sm"
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Practice Bakery Words */}
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-amber-950 mb-3 flex items-center gap-1.5">
              <span>🧁</span>
              <SpeakableText text="Bakery Syllable Examples" buttonSize="sm" />
            </h3>

            <div className="space-y-2.5">
              {/* 1 Syllable */}
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                      1 Syllable
                    </span>
                    <span className="font-bold text-sm sm:text-base text-stone-800">
                      pan, egg, milk, whisk, crust
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => testClap('pan', ['pan'])}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
              </div>

              {/* 2 Syllables */}
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                      2 Syllables
                    </span>
                    <span className="font-bold text-sm sm:text-base text-stone-800">
                      muf • fin, but • ter, cook • ie, cup • cake
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => testClap('muffin', ['muf', 'fin'])}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
              </div>

              {/* 3 Syllables */}
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                      3 Syllables
                    </span>
                    <span className="font-bold text-sm sm:text-base text-stone-800">
                      ba • nan • a, straw • ber • ry, cin • na • mon
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => testClap('banana', ['ba', 'nan', 'a'])}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
              </div>

              {/* 4 Syllables */}
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold text-sm flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                      4 Syllables
                    </span>
                    <span className="font-bold text-sm sm:text-base text-stone-800">
                      wa • ter • mel • on, dec • o • ra • tion
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => testClap('watermelon', ['wa', 'ter', 'mel', 'on'])}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
              </div>

              {/* 5 Syllables */}
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-800 font-bold text-sm flex items-center justify-center shrink-0">
                    5
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                      5 Syllables
                    </span>
                    <span className="font-bold text-sm sm:text-base text-stone-800">
                      ir • re • sist • i • ble, un • for • get • ta • ble
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => testClap('irresistible', ['ir', 're', 'sist', 'i', 'ble'])}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-100/70 border-t border-amber-300 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Ready to Bake! 🧑‍🍳
          </button>
        </div>
      </div>
    </div>
  );
};
