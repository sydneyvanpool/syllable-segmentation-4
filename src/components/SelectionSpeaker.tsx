import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakText } from '../utils/audio';

export const SelectionSpeaker: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectedText('');
        setPosition(null);
        return;
      }

      const text = selection.toString().trim();
      if (text.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(text);
        setPosition({
          top: Math.max(10, rect.top + window.scrollY - 44),
          left: Math.max(10, rect.left + window.scrollX + rect.width / 2 - 60),
        });
      } else {
        setSelectedText('');
        setPosition(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  if (!selectedText || !position) return null;

  return (
    <div
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed z-50 animate-bounce"
    >
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault(); // keep selection intact
          speakText(selectedText);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-full shadow-lg text-xs font-semibold hover:bg-amber-700 active:scale-95 transition-all border border-amber-400"
      >
        <Volume2 className="w-3.5 h-3.5" />
        Read Aloud
      </button>
    </div>
  );
};
