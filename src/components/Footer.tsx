import React from 'react';
import { SpeakableText } from './SpeakableText';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto py-5 px-4 bg-amber-100/70 border-t-2 border-amber-200 text-center">
      <div className="max-w-md mx-auto flex flex-col items-center justify-center gap-0.5 text-[13px] font-normal">
        <div className="text-[16px] font-normal text-amber-950 flex items-center justify-center gap-1">
          <span>🧁</span>
          <SpeakableText text="Syllable Bakery" buttonSize="sm" className="text-[16px] font-normal" />
        </div>
        <div className="text-xs sm:text-sm font-semibold text-amber-800 flex items-center justify-center">
          <SpeakableText text="The Vanpool School" buttonSize="sm" />
        </div>
      </div>
    </footer>
  );
};
