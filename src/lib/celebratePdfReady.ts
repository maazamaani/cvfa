const CONFETTI_COLORS = ["#007c6f", "#38cbba", "#ffffff", "#fcd34d", "#6ee7b7"];

export async function celebratePdfReady(): Promise<void> {
  const { default: confetti } = await import("canvas-confetti");

  const burst = (particleCount: number, spread: number, y: number) => {
    void confetti({
      particleCount,
      spread,
      startVelocity: 42,
      origin: { x: 0.5, y },
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
      ticks: 200,
    });
  };

  burst(80, 62, 0.62);
  window.setTimeout(() => burst(55, 88, 0.58), 160);
  window.setTimeout(() => burst(40, 110, 0.64), 320);
}
