export let audioCtx: AudioContext | null = null;
let currentBgmType: 'title' | 'select' | null = null;
let isBgmPlaying = false;
let nextNoteTime = 0;
let noteIndex = 0;
let bgmInterval: number | null = null;

// Global Volume Setting (0.0 to 1.0)
let masterVolume = 0.5;

export function setMasterVolume(vol: number) {
    masterVolume = Math.max(0, Math.min(1, vol));
}

export function getMasterVolume() {
    return masterVolume;
}

// Bright, energetic melody for Title
const TITLE_MELODY = [
    523.25, // C5
    659.25, // E5
    783.99, // G5
    1046.50, // C6
    783.99, // G5
    659.25, // E5
    698.46, // F5
    880.00, // A5
];
const TITLE_SPEED = 0.15;

// Slower, calmer melody for Select/Input
const SELECT_MELODY = [
    392.00, // G4
    493.88, // B4
    587.33, // D5
    493.88, // B4
    349.23, // F4
    440.00, // A4
    523.25, // C5
    440.00  // A4
];
const SELECT_SPEED = 0.25;

export function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

const scheduleNotes = () => {
    if (!isBgmPlaying || !audioCtx) return;

    const melody = currentBgmType === 'select' ? SELECT_MELODY : TITLE_MELODY;
    const speed = currentBgmType === 'select' ? SELECT_SPEED : TITLE_SPEED;
    const wave = currentBgmType === 'select' ? 'sine' : 'triangle';

    // Schedule ahead 100ms
    while (nextNoteTime < audioCtx.currentTime + 0.1) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = wave;

        osc.frequency.setValueAtTime(melody[noteIndex % melody.length], nextNoteTime);

        gain.gain.setValueAtTime(0.04 * masterVolume, nextNoteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, nextNoteTime + speed * 0.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(nextNoteTime);
        osc.stop(nextNoteTime + speed);

        nextNoteTime += speed;
        noteIndex++;
    }

    bgmInterval = requestAnimationFrame(scheduleNotes);
}

export function startTitleBGM() {
    initAudio();
    if (isBgmPlaying && currentBgmType === 'title') return;
    stopBGM();
    isBgmPlaying = true;
    currentBgmType = 'title';
    if (audioCtx) {
        nextNoteTime = audioCtx.currentTime + 0.05;
        noteIndex = 0;
        scheduleNotes();
    }
}

export function startSelectBGM() {
    initAudio();
    if (isBgmPlaying && currentBgmType === 'select') return;
    stopBGM();
    isBgmPlaying = true;
    currentBgmType = 'select';
    if (audioCtx) {
        nextNoteTime = audioCtx.currentTime + 0.05;
        noteIndex = 0;
        scheduleNotes();
    }
}

export function stopBGM() {
    isBgmPlaying = false;
    currentBgmType = null;
    if (bgmInterval !== null) {
        cancelAnimationFrame(bgmInterval);
        bgmInterval = null;
    }
}

export function playButtonSE() {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1 * masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
}

export function playBeep(freq = 800, type: OscillatorType = 'sine', vol = 0.1, duration = 0.1) {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(vol * masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
}

let passionAudioBuffer: AudioBuffer | null = null;
let currentPassionSource: AudioBufferSourceNode | null = null;

// Preload the passion audio buffer globally as soon as the module loads
if (typeof window !== 'undefined') {
    fetch(import.meta.env.BASE_URL + 'audio/passion/passion.mp3')
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => {
            const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            return tempCtx.decodeAudioData(arrayBuffer);
        })
        .then(buffer => {
            passionAudioBuffer = buffer;
        })
        .catch(e => console.error("Error loading passion audio buffer:", e));
}

export function playPassionSound() {
    stopPassionSound();

    if (passionAudioBuffer && audioCtx) {
        const source = audioCtx.createBufferSource();
        source.buffer = passionAudioBuffer;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = masterVolume;

        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        source.start(0);
        currentPassionSource = source;
    } else {
        // Fallback if the buffer isn't loaded yet
        const audio = new Audio(import.meta.env.BASE_URL + 'audio/passion/passion.mp3');
        audio.volume = masterVolume;
        audio.play().catch(() => { });
    }
}

export function stopPassionSound() {
    if (currentPassionSource) {
        try {
            currentPassionSource.stop();
        } catch (e) { }
        currentPassionSource = null;
    }
}

export function playSuccessSE() {
    const ctx = initAudio();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    let time = ctx.currentTime;

    notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.1 * masterVolume, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.15);

        time += 0.1; // Overlapping arpeggio
    });
}

export function playFailureSE() {
    const ctx = initAudio();
    const notes = [300, 250, 200];
    let time = ctx.currentTime;

    notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq - 50, time + 0.3);

        gain.gain.setValueAtTime(0.1 * masterVolume, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.3);

        time += 0.25;
    });
}
