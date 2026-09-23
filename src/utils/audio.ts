// Kid-friendly speech synthesis and celebratory Web Audio API sounds

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: 'correct' | 'incorrect' | 'trophy' | 'step' | 'pop') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'correct') {
      // Cheerful ascending major chime (C5 -> E5 -> G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.35);
      });
    } else if (type === 'incorrect') {
      // Soft gentle low double-tone (encouraging try-again)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, now);
      osc.frequency.linearRampToValueAtTime(261.63, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'trophy') {
      // Grand Victory Fanfare: Triumphant brass & major celebration chords
      // Motifs: C5 -> E5 -> G5 -> C6, followed by a bright triumphant chord burst & celebratory shimmer
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.18, vol: 0.25 },  // C5
        { freq: 659.25, time: 0.16, dur: 0.18, vol: 0.25 }, // E5
        { freq: 783.99, time: 0.32, dur: 0.22, vol: 0.28 }, // G5
        { freq: 1046.5, time: 0.52, dur: 0.65, vol: 0.35 }, // C6 (grand sustained apex)
        { freq: 1318.5, time: 0.52, dur: 0.65, vol: 0.22 }, // E6 harmony
        { freq: 1567.98, time: 0.52, dur: 0.65, vol: 0.18 }, // G6 harmony
      ];

      notes.forEach(({ freq, time, dur, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);
        gain.gain.setValueAtTime(vol, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + dur);
      });

      // Shimmering victory sparkles
      const sparkles = [1318.51, 1567.98, 1760.0, 2093.0];
      sparkles.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const st = 0.68 + idx * 0.08;
        osc.frequency.setValueAtTime(freq, now + st);
        gain.gain.setValueAtTime(0.12, now + st);
        gain.gain.exponentialRampToValueAtTime(0.001, now + st + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + st);
        osc.stop(now + st + 0.15);
      });
    } else if (type === 'step') {
      // Cute marimba hop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
}

let activeInterval: ReturnType<typeof setInterval> | null = null;
let activeTimeout: ReturnType<typeof setTimeout> | null = null;

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (activeInterval) {
    clearInterval(activeInterval);
    activeInterval = null;
  }
  if (activeTimeout) {
    clearTimeout(activeTimeout);
    activeTimeout = null;
  }
}

/**
 * Checks if a string or token represents a blank placeholder (e.g. ______, [blank], etc.)
 */
export function isBlankToken(token: string): boolean {
  const trimmed = token.trim();
  return /^_+$/.test(trimmed) || /^\[blank\]$/i.test(trimmed) || /^<blank>$/i.test(trimmed);
}

export function speakText(
  text: string,
  onWordHighlight?: (wordIndex: number) => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return false;
  }

  stopSpeaking();

  // If text contains a blank (e.g. "______", "___", "[blank]"),
  // split into segments around the blank so we speak before, pause noticeably (e.g. 700ms),
  // then speak after, giving a clear auditory pause where the blank is.
  const blankRegex = /(__{2,}|\[blank\]|<blank>)/i;
  if (blankRegex.test(text)) {
    const parts = text.split(blankRegex);
    // Find segments and pauses
    const queue: { text: string; isBlank: boolean }[] = [];
    for (const part of parts) {
      if (blankRegex.test(part)) {
        queue.push({ text: '', isBlank: true });
      } else if (part.trim().length > 0) {
        queue.push({ text: part.trim(), isBlank: false });
      }
    }

    let currentStep = 0;
    const playNextSegment = () => {
      if (currentStep >= queue.length) {
        onWordHighlight?.(-1);
        onEnd?.();
        return;
      }

      const item = queue[currentStep];
      currentStep++;

      if (item.isBlank) {
        // Play a gentle short chime or silent pause for the blank to highlight it clearly
        try {
          playSound('pop');
        } catch {
          // ignore
        }
        activeTimeout = setTimeout(() => {
          playNextSegment();
        }, 800); // 800ms noticeable pause for the blank
        return;
      }

      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;

      utterance.onend = () => {
        playNextSegment();
      };
      utterance.onerror = () => {
        playNextSegment();
      };

      window.speechSynthesis.speak(utterance);
    };

    playNextSegment();
    return true;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88; // Gentle, clear elementary student reading speed
  utterance.pitch = 1.05;

  const words = text.split(/\s+/).filter(Boolean);
  let boundaryFired = false;

  // Track word index through speech boundary events if supported
  utterance.onboundary = (event) => {
    if (event.name === 'word' && onWordHighlight) {
      boundaryFired = true;
      const charIndex = event.charIndex;
      let cumLength = 0;
      for (let i = 0; i < words.length; i++) {
        const wordLen = words[i].length;
        if (charIndex >= cumLength && charIndex <= cumLength + wordLen + 1) {
          onWordHighlight(i);
          break;
        }
        cumLength += wordLen + 1;
      }
    }
  };

  // Fallback timed progression in case the browser platform does not fire onboundary
  let timerWordIndex = 0;
  activeInterval = setInterval(() => {
    if (!boundaryFired && onWordHighlight && timerWordIndex < words.length) {
      onWordHighlight(timerWordIndex);
      timerWordIndex++;
    }
  }, Math.max(260, Math.floor(4000 / Math.max(words.length, 1))));

  utterance.onend = () => {
    if (activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
    }
    if (onWordHighlight) {
      onWordHighlight(-1);
    }
    onEnd?.();
  };

  utterance.onerror = () => {
    if (activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
    }
    if (onWordHighlight) {
      onWordHighlight(-1);
    }
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}
