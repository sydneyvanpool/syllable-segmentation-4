import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/audio';

interface SpeakableTextProps {
  text: string;
  className?: string;
  textClassName?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  buttonPosition?: 'start' | 'end';
  buttonClassName?: string;
  showButton?: boolean;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
  id?: string;
}

export const SpeakableText: React.FC<SpeakableTextProps> = ({
  text,
  className = '',
  textClassName = '',
  buttonSize = 'md',
  buttonPosition = 'start',
  buttonClassName = '',
  showButton = true,
  onSpeakStart,
  onSpeakEnd,
  id,
}) => {
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const words = text.split(/(\s+)/);

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      setHighlightedWordIndex(-1);
      onSpeakEnd?.();
      return;
    }

    setIsPlaying(true);
    onSpeakStart?.();

    // Map word boundaries
    speakText(
      text,
      (wordIdx) => {
        setHighlightedWordIndex(wordIdx);
      },
      () => {
        setIsPlaying(false);
        setHighlightedWordIndex(-1);
        onSpeakEnd?.();
      }
    );
  };

  const handleWordClick = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
    if (cleanWord) {
      speakText(cleanWord);
    }
  };

  const buttonSizeClasses = {
    sm: 'w-6 h-6 p-0.5 text-xs',
    md: 'w-8 h-8 p-1 text-sm',
    lg: 'w-10 h-10 p-1.5 text-base',
  }[buttonSize];

  let actualWordCounter = -1;

  const buttonNode = showButton ? (
    <button
      type="button"
      onClick={handleSpeak}
      aria-label={`Read aloud: ${text}`}
      title="Listen to this read aloud"
      className={`${buttonSizeClasses} inline-flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 shadow-xs active:scale-95 transition-all border border-amber-300 shrink-0 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-400 align-middle mr-1.5 ${buttonClassName}`}
    >
      {isPlaying ? (
        <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-amber-800" />
      )}
    </button>
  ) : null;

  return (
    <span className={`inline ${className}`} id={id}>
      {buttonPosition === 'start' && buttonNode}

      <span className={`inline leading-relaxed ${textClassName}`}>
        {words.map((chunk, index) => {
          const isWhitespace = /^\s+$/.test(chunk);
          if (isWhitespace) {
            return <React.Fragment key={index}>{chunk}</React.Fragment>;
          }

          actualWordCounter++;
          const currentWordIdx = actualWordCounter;
          const isHighlighted = highlightedWordIndex === currentWordIdx;

          return (
            <span
              key={index}
              onClick={(e) => handleWordClick(chunk, e)}
              className={`cursor-pointer transition-colors duration-150 rounded-xs ${
                isHighlighted
                  ? 'bg-amber-300 text-amber-950 font-semibold px-0.5 shadow-xs'
                  : 'hover:bg-amber-100/70'
              }`}
              title="Click to hear this word"
            >
              {chunk}
            </span>
          );
        })}
      </span>

      {buttonPosition === 'end' && buttonNode}
    </span>
  );
};
