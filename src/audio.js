function createBrowserAudioContext() {
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : undefined;
}

export function createTonePlayer({
  createContext = createBrowserAudioContext,
  initialEnabled = true
} = {}) {
  let enabled = initialEnabled;
  let context;
  let activeTone;

  function stop() {
    if (!activeTone || !context) return;

    const { oscillator, gain } = activeTone;
    activeTone = undefined;

    try {
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setTargetAtTime(0.0001, context.currentTime, 0.008);
      oscillator.stop(context.currentTime + 0.025);
    } catch {
      // A tone that already ended is already silent.
    }
  }

  function play(frequency) {
    if (!enabled) return false;

    try {
      context ??= createContext();
      if (!context) return false;

      if (context.state === "suspended") {
        const resume = context.resume();
        if (resume?.catch) void resume.catch(() => {});
      }

      stop();

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.12, now + 0.18);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.45);
      activeTone = { oscillator, gain };
      oscillator.addEventListener?.("ended", () => {
        if (activeTone?.oscillator === oscillator) activeTone = undefined;
      }, { once: true });
      return true;
    } catch {
      activeTone = undefined;
      return false;
    }
  }

  function setEnabled(nextEnabled) {
    enabled = Boolean(nextEnabled);
    if (!enabled) stop();
  }

  async function suspend() {
    stop();
    if (context?.state !== "running") return;

    try {
      await context.suspend();
    } catch {
      // Browsers may reject suspension during lifecycle transitions.
    }
  }

  return {
    play,
    stop,
    setEnabled,
    suspend,
    get enabled() {
      return enabled;
    }
  };
}
