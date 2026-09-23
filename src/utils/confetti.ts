import confetti from 'canvas-confetti';

export function firePastryConfetti() {
  try {
    // Bakery sprinkle colors: strawberry, butter cream, mint frosting, chocolate, blueberry
    const bakeryColors = ['#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb923c', '#f43f5e'];

    // Left cannon
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 60,
      origin: { x: 0.15, y: 0.75 },
      colors: bakeryColors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
    });

    // Right cannon
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 60,
      origin: { x: 0.85, y: 0.75 },
      colors: bakeryColors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
    });
  } catch (err) {
    console.warn('Confetti error:', err);
  }
}

export function fireGrandTrophyConfetti() {
  try {
    const end = Date.now() + 1500;
    const colors = ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (err) {
    console.warn('Grand confetti error:', err);
  }
}
