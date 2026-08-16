import test from "node:test";
import assert from "node:assert/strict";
import { createTonePlayer } from "../src/audio.js";

function createAudioParam() {
  return {
    cancelScheduledValues() {},
    exponentialRampToValueAtTime() {},
    setTargetAtTime() {},
    setValueAtTime() {}
  };
}

function createFakeContext({ state = "running" } = {}) {
  const oscillator = {
    frequency: createAudioParam(),
    stopCalls: [],
    addEventListener() {},
    connect(node) { return node; },
    start() {},
    stop(at) { this.stopCalls.push(at); }
  };
  const gain = {
    gain: createAudioParam(),
    connect(node) { return node; }
  };

  return {
    state,
    currentTime: 10,
    destination: {},
    oscillator,
    suspendCalls: 0,
    createOscillator: () => oscillator,
    createGain: () => gain,
    resume: async () => {},
    async suspend() { this.suspendCalls += 1; }
  };
}

test("audio is a harmless no-op when no context is available", () => {
  const player = createTonePlayer({ createContext: () => undefined });

  assert.equal(player.play(523.25), false);
  assert.doesNotThrow(() => player.setEnabled(false));
});

test("context construction failures never escape into gameplay", () => {
  const player = createTonePlayer({
    createContext: () => { throw new Error("unsupported"); }
  });

  assert.doesNotThrow(() => player.play(523.25));
  assert.equal(player.play(523.25), false);
});

test("muting immediately shortens the active oscillator and blocks new tones", () => {
  const context = createFakeContext();
  const player = createTonePlayer({ createContext: () => context });

  assert.equal(player.play(523.25), true);
  player.setEnabled(false);

  assert.deepEqual(context.oscillator.stopCalls, [10.45, 10.025]);
  assert.equal(player.play(587.33), false);
});

test("suspending stops active audio and suspends a running context", async () => {
  const context = createFakeContext();
  const player = createTonePlayer({ createContext: () => context });

  player.play(523.25);
  await player.suspend();

  assert.deepEqual(context.oscillator.stopCalls, [10.45, 10.025]);
  assert.equal(context.suspendCalls, 1);
});
