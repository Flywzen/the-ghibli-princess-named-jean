import { USER_FILES } from "./media.js";

const bgAudio = new Audio();
bgAudio.loop = true;
bgAudio.volume = 0.78;
bgAudio.src = USER_FILES.audio;

let audioCtx = null;
let musicPlaying = false;
let melodyTimer = null;

const KIKI_NOTES = [
  [392.00, 196.00, 380], [440.00, 220.00, 380], [493.88, 246.94, 520],
  [587.33, 293.66, 520], [493.88, 246.94, 520], [523.25, 261.63, 680],
  [587.33, 293.66, 380], [659.25, 329.63, 740], [587.33, 293.66, 460],
  [523.25, 261.63, 520], [493.88, 246.94, 780], [440.00, 220.00, 620]
];
let noteIdx = 0;

function ensureAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}

function playChimeNote(freq, bass, durMs) {
  ensureAudioCtx();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.065, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0008, now + durMs / 1000 + 0.45);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + durMs / 1000 + 0.5);

  if (bass) {
    const bOsc = audioCtx.createOscillator();
    const bGain = audioCtx.createGain();
    bOsc.type = "sine";
    bOsc.frequency.setValueAtTime(bass, now);
    bGain.gain.setValueAtTime(0.001, now);
    bGain.gain.exponentialRampToValueAtTime(0.035, now + 0.04);
    bGain.gain.exponentialRampToValueAtTime(0.0008, now + durMs / 1000 + 0.55);
    bOsc.connect(bGain);
    bGain.connect(audioCtx.destination);
    bOsc.start(now);
    bOsc.stop(now + durMs / 1000 + 0.6);
  }
}

function startSynthLoop() {
  if (melodyTimer) return;
  const step = () => {
    if (!musicPlaying) return;
    const [f, b, d] = KIKI_NOTES[noteIdx % KIKI_NOTES.length];
    noteIdx++;
    playChimeNote(f, b, d);
    melodyTimer = setTimeout(step, d);
  };
  step();
}

function toggleMusic(forceOn) {
  const btn = document.getElementById("btn-audio");
  const label = document.getElementById("audio-label");
  const eq = document.getElementById("eq-bars");
  const next = typeof forceOn === "boolean" ? forceOn : !musicPlaying;

  if (next) {
    musicPlaying = true;
    btn.classList.add("active");
    eq.classList.add("playing");
    label.textContent = "OST:ON";
    bgAudio.play().catch(() => {
      startSynthLoop();
    });
  } else {
    musicPlaying = false;
    btn.classList.remove("active");
    eq.classList.remove("playing");
    label.textContent = "OST:OFF";
    bgAudio.pause();
    if (melodyTimer) {
      clearTimeout(melodyTimer);
      melodyTimer = null;
    }
  }
}

document.getElementById("btn-audio").addEventListener("click", () => toggleMusic());
document.getElementById("island-toggle").addEventListener("click", () => toggleMusic());


export { bgAudio, musicPlaying, toggleMusic, playChimeNote };
