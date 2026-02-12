// ═══════════════════════════════════════════════════════════
// Sound Effects — Synthesized via Web Audio API (no files needed)
// ═══════════════════════════════════════════════════════════

let audioCtx = null;

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(freq, duration = 0.15, type = 'sine', vol = 0.12) {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Audio not available, silently ignore
    }
}

function playNoise(duration = 0.08, vol = 0.06) {
    try {
        const ctx = getCtx();
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    } catch (e) { }
}

export function playDice() {
    playNoise(0.06, 0.08);
    setTimeout(() => playTone(280, 0.08, 'triangle', 0.1), 30);
    setTimeout(() => playNoise(0.04, 0.06), 70);
}

export function playDiceResult() {
    playTone(523, 0.12, 'sine', 0.15);
    setTimeout(() => playTone(659, 0.12, 'sine', 0.15), 80);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.12), 160);
}

export function playCardReveal() {
    playTone(440, 0.08, 'sine', 0.08);
    setTimeout(() => playTone(554, 0.1, 'sine', 0.08), 60);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 120);
}

export function playCorrect() {
    playTone(523, 0.1, 'sine', 0.12);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.12), 100);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.12), 200);
}

export function playWrong() {
    playTone(330, 0.15, 'sawtooth', 0.08);
    setTimeout(() => playTone(262, 0.3, 'sawtooth', 0.08), 150);
}

export function playClick() {
    playTone(800, 0.04, 'square', 0.05);
}

export function playVictory() {
    const notes = [523, 587, 659, 784, 880, 1047];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.25, 'sine', 0.1), i * 120);
    });
    // Sparkle noise
    setTimeout(() => playNoise(0.3, 0.04), 700);
}

export function playBonusCard() {
    playTone(523, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 80);
}

export function playMalusCard() {
    playTone(392, 0.1, 'triangle', 0.1);
    setTimeout(() => playTone(330, 0.2, 'triangle', 0.1), 100);
}
