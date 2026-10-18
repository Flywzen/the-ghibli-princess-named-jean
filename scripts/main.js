import { initializeImages } from "./media.js";
import { musicPlaying, toggleMusic, playChimeNote } from "./audio.js";

initializeImages();

const MAX_Z = 7500;
let targetZ = 0;
let currentZ = 0;
let targetPointerX = 0;
let targetPointerY = 0;
let smoothPointerX = 0;
let smoothPointerY = 0;
let isExploded = false;

const stations = Array.from(document.querySelectorAll(".artboard-station"));
const pips = Array.from(document.querySelectorAll(".ab-pip"));
const doorLeft = document.getElementById("door-left");
const doorRight = document.getElementById("door-right");
const howlDial = document.getElementById("howl-dial-svg");
const zReadout = document.getElementById("z-coord-readout");
const abLabel = document.getElementById("hud-artboard-label");
const hudSwatch = document.getElementById("hud-swatch");

const ARTBOARD_META = [
  { title: "AB_00 // GHIBLI_PRINCESS.AI", color: "#FF7A45", skyTop: [12, 17, 29], skyBot: [48, 34, 44] },
  { title: "AB_01 // YOUR_OWN_PACE.AI", color: "#F5B841", skyTop: [40, 75, 126], skyBot: [229, 152, 102] },
  { title: "AB_02 // OCEAN_MYSTERY.AI", color: "#25CCF7", skyTop: [23, 133, 184], skyBot: [152, 212, 226] },
  { title: "AB_03 // UNDERSTANDING_US.AI", color: "#2ECC71", skyTop: [42, 148, 212], skyBot: [124, 188, 96] },
  { title: "AB_04 // AS_WE_CHANGE.AI", color: "#FF5C8D", skyTop: [58, 42, 72], skyBot: [218, 118, 148] },
  { title: "AB_05 // FOR_JEAN.AI", color: "#4F8EF7", skyTop: [14, 52, 82], skyBot: [24, 88, 118] }
];

const btnExplode = document.getElementById("btn-explode");
btnExplode.addEventListener("click", () => {
  isExploded = !isExploded;
  document.body.classList.toggle("exploded-mode", isExploded);
  btnExplode.classList.toggle("active", isExploded);
  document.getElementById("layer-mode-readout").textContent = isExploded
    ? "MODE: EXPLODED_ISO [8 LAYERS]"
    : "MODE: COMPOSITE";
  playChimeNote(isExploded ? 587.33 : 440, 220, 220);
});

window.addEventListener("pointermove", (e) => {
  targetPointerX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetPointerY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

window.addEventListener("deviceorientation", (e) => {
  if (e.gamma !== null && e.beta !== null) {
    targetPointerX = Math.max(-1, Math.min(1, e.gamma / 25));
    targetPointerY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
  }
}, { passive: true });

function scrollToArtboard(index) {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const targetScroll = (index / 5) * maxScroll;
  window.scrollTo({ top: targetScroll, behavior: "smooth" });
}

pips.forEach((pip) => {
  pip.addEventListener("click", () => {
    const idx = parseInt(pip.dataset.ab, 10);
    scrollToArtboard(idx);
  });
});

document.getElementById("btn-enter-diorama").addEventListener("click", () => {
  if (!musicPlaying) toggleMusic(true);
  scrollToArtboard(1);
});

document.getElementById("astrolabe-trigger").addEventListener("click", () => {
  if (!musicPlaying) toggleMusic(true);
  scrollToArtboard(1);
});

const pCanvas = document.getElementById("particle-canvas");
const pCtx = pCanvas.getContext("2d");
const aCanvas = document.getElementById("atmo-canvas");
const aCtx = aCanvas.getContext("2d");
let cw = window.innerWidth;
let ch = window.innerHeight;

const ambientStars = Array.from({ length: 42 }, () => ({
  x: Math.random(),
  y: Math.random() * 0.65,
  r: 0.8 + Math.random() * 1.8,
  phase: Math.random() * Math.PI * 2
}));

function resizeCanvases() {
  cw = window.innerWidth;
  ch = window.innerHeight;
  pCanvas.width = cw;
  pCanvas.height = ch;
  aCanvas.width = cw;
  aCanvas.height = ch;
}
window.addEventListener("resize", resizeCanvases);
resizeCanvases();

const particles = [];
function spawnBurst(x, y, color = "#F4D799", count = 22) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 1.6 + Math.random() * 4.8;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.9,
      r: 2 + Math.random() * 3.4,
      alpha: 1,
      color
    });
  }
}

function downloadOfficialTicket() {
  const c = document.createElement("canvas");
  c.width = 1080;
  c.height = 640;
  const ctx = c.getContext("2d");

  const g = ctx.createLinearGradient(0, 0, 1080, 640);
  g.addColorStop(0, "#0E1726");
  g.addColorStop(1, "#1C2B42");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1080, 640);

  ctx.strokeStyle = "#D8B26E";
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, 1024, 584);
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, 1000, 560);

  ctx.fillStyle = "#F4D799";
  ctx.font = "500 20px 'JetBrains Mono', monospace";
  ctx.fillText("SPIRIT REALM RAILWAY // RAFLY & JEAN", 70, 92);

  ctx.fillStyle = "#F5F0E6";
  ctx.font = "bold 46px 'Cinzel Decorative', serif";
  ctx.fillText("RAFLY  ×  JEAN ERLIKA", 70, 175);

  ctx.fillStyle = "#D8B26E";
  ctx.font = "italic 30px 'Cormorant Garamond', serif";
  ctx.fillText("Still beside you.", 70, 225);

  ctx.beginPath();
  ctx.setLineDash([8, 6]);
  ctx.moveTo(70, 260);
  ctx.lineTo(1010, 260);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#F5F0E6";
  ctx.font = "22px 'JetBrains Mono', monospace";
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric"
  });
  ctx.fillText(`OPENED ON   : ${dateStr.toUpperCase()}`, 70, 320);
  ctx.fillText(`A REMINDER    : AT YOUR OWN PACE`, 70, 365);
  ctx.fillText(`INSIDE JOKE    : RARE = WEIRD (ONLY FOR RAFLY)`, 70, 410);
  ctx.fillText(`RAFLY & JEAN   : STILL CURIOUS`, 70, 455);

  ctx.strokeStyle = "#FF7A45";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(890, 420, 78, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#FF7A45";
  ctx.font = "bold 20px 'JetBrains Mono', monospace";
  ctx.fillText("FOR", 840, 415);
  ctx.fillText("JEAN", 818, 442);

  ctx.fillStyle = "rgba(245, 240, 230, 0.75)";
  ctx.font = "italic 24px 'Cormorant Garamond', serif";
  ctx.fillText('"Stay curious about me, Jean."', 70, 550);

  const link = document.createElement("a");
  link.download = "RAFLY_JEAN_KEEPSAKE.png";
  link.href = c.toDataURL("image/png");
  link.click();
}

let stampCount = 0;
document.getElementById("btn-stamp-ticket").addEventListener("click", (e) => {
  stampCount++;
  const btn = e.currentTarget;
  btn.classList.add("active");
  btn.textContent = `TICKET STAMPED [${stampCount}]`;
  document.getElementById("stamp-status").textContent = "YOUR OWN PACE";
  playChimeNote(659.25, 329.63, 300);
  const rect = btn.getBoundingClientRect();
  spawnBurst(rect.left + rect.width / 2, rect.top, "#F5B841", 22);
  anime({
    targets: "#img-ab-1",
    scale: [1.14, 1.06],
    duration: 650,
    easing: "cubicBezier(0.16, 1, 0.3, 1)"
  });
});

let sparkCount = 0;
document.getElementById("btn-spark-calcifer").addEventListener("click", (e) => {
  sparkCount++;
  const btn = e.currentTarget;
  btn.classList.add("active");
  document.getElementById("spark-counter").textContent = `CALCIFER: ${sparkCount} SPARKS`;
  playChimeNote(587.33, 293.66, 260);
  const rect = btn.getBoundingClientRect();
  spawnBurst(rect.left + rect.width / 2, rect.top - 80, "#FF7A45", 26);
  anime({
    targets: "#img-ab-3a",
    scale: [1.15, 1.06],
    duration: 700,
    easing: "cubicBezier(0.16, 1, 0.3, 1)"
  });
});

document.getElementById("btn-accept-confession").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.classList.add("active");
  btn.textContent = "FOR YOU, JEAN";

  const passBanner = document.getElementById("official-pass");
  const dlBtn = document.getElementById("btn-download-ticket");
  const now = new Date();
  document.getElementById("official-date-slot").textContent = now.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  }).toUpperCase();
  passBanner.classList.add("revealed");
  dlBtn.style.display = "inline-flex";

  if (!musicPlaying) toggleMusic(true);

  playChimeNote(523.25, 261.63, 350);
  setTimeout(() => playChimeNote(659.25, 329.63, 350), 140);
  setTimeout(() => playChimeNote(783.99, 392.00, 600), 280);

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      spawnBurst(
        cw * (0.2 + Math.random() * 0.6),
        ch * (0.18 + Math.random() * 0.42),
        i % 2 === 0 ? "#F4D799" : "#FF7A9E",
        28
      );
    }, i * 150);
  }
});

document.getElementById("btn-download-ticket").addEventListener("click", downloadOfficialTicket);

document.getElementById("btn-send-wa").addEventListener("click", () => {
  const text = encodeURIComponent("Raf, I read the page you made for me.");
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
});

function lerp(a, b, t) {
  return a + (b - a) * t;
}

let frameTick = 0;
function renderLoop() {
  frameTick += 0.02;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const scrollFraction = Math.max(0, Math.min(1, window.scrollY / maxScroll));
  targetZ = scrollFraction * MAX_Z;

  currentZ = lerp(currentZ, targetZ, 0.11);
  smoothPointerX = lerp(smoothPointerX, targetPointerX, 0.09);
  smoothPointerY = lerp(smoothPointerY, targetPointerY, 0.09);

  zReadout.textContent = `Z: ${Math.round(currentZ).toString().padStart(4, "0")}mm`;

  const activeIdx = Math.min(5, Math.max(0, Math.round(currentZ / 1500)));
  const meta = ARTBOARD_META[activeIdx];
  abLabel.textContent = meta.title;
  hudSwatch.style.background = meta.color;
  hudSwatch.style.boxShadow = `0 0 8px ${meta.color}`;

  pips.forEach((p, idx) => p.classList.toggle("active", idx === activeIdx));

  const doorProgress = Math.max(0, Math.min(1, currentZ / 720));
  const swingDeg = doorProgress * 114;
  if (doorLeft && doorRight) {
    doorLeft.style.transform = `rotateY(${-swingDeg}deg)`;
    doorRight.style.transform = `rotateY(${swingDeg}deg)`;
  }
  if (howlDial) {
    howlDial.style.transform = `rotate(${currentZ * 0.45}deg) scale(${1 - doorProgress * 0.25})`;
    howlDial.style.opacity = String(1 - doorProgress * 0.9);
  }

  const spreadMultiplier = isExploded ? 2.15 : 1.0;

  stations.forEach((station) => {
    const stationBaseZ = parseFloat(station.dataset.z);
    const relZ = stationBaseZ + currentZ;

    if (relZ < -2400 || relZ > 1150) {
      station.style.opacity = "0";
      station.style.visibility = "hidden";
      return;
    }

    station.style.visibility = "visible";
    let alpha = 1;
    if (relZ < -1500) {
      alpha = Math.max(0, 1 - (Math.abs(relZ) - 1500) / 900);
    } else if (relZ > 320) {
      alpha = Math.max(0, 1 - (relZ - 320) / 720);
    }
    station.style.opacity = alpha.toFixed(3);

    const tiltX = smoothPointerY * -5;
    const tiltY = smoothPointerX * 7;
    station.style.transform = `translate3d(0px, 0px, ${relZ.toFixed(1)}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;

    const layers = station.querySelectorAll(".ai-layer");
    const normRel = relZ / 1000;

    layers.forEach((layer) => {
      const baseDepth = parseFloat(layer.dataset.depth || "0") * spreadMultiplier;
      const pyFactor = parseFloat(layer.dataset.py || "0");
      const splitFactor = parseFloat(layer.dataset.split || "0");

      const offsetY = normRel * pyFactor * 95 + smoothPointerY * (baseDepth * 0.08);
      const offsetX = smoothPointerX * (baseDepth * 0.11) + (isExploded ? baseDepth * 0.16 : 0);
      const scaleBoost = splitFactor > 0 && relZ > 0 ? 1 + (relZ / 1000) * 0.18 : 1;

      layer.style.transform = `translate3d(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px, ${baseDepth.toFixed(1)}px) scale3d(${scaleBoost.toFixed(3)}, ${scaleBoost.toFixed(3)}, 1)`;
    });
  });

  const exactIdx = Math.max(0, Math.min(4.999, currentZ / 1500));
  const idxA = Math.floor(exactIdx);
  const idxB = Math.min(5, idxA + 1);
  const t = exactIdx - idxA;

  const topR = Math.round(lerp(ARTBOARD_META[idxA].skyTop[0], ARTBOARD_META[idxB].skyTop[0], t));
  const topG = Math.round(lerp(ARTBOARD_META[idxA].skyTop[1], ARTBOARD_META[idxB].skyTop[1], t));
  const topB = Math.round(lerp(ARTBOARD_META[idxA].skyTop[2], ARTBOARD_META[idxB].skyTop[2], t));

  const botR = Math.round(lerp(ARTBOARD_META[idxA].skyBot[0], ARTBOARD_META[idxB].skyBot[0], t));
  const botG = Math.round(lerp(ARTBOARD_META[idxA].skyBot[1], ARTBOARD_META[idxB].skyBot[1], t));
  const botB = Math.round(lerp(ARTBOARD_META[idxA].skyBot[2], ARTBOARD_META[idxB].skyBot[2], t));

  const grad = aCtx.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, `rgb(${topR},${topG},${topB})`);
  grad.addColorStop(1, `rgb(${botR},${botG},${botB})`);
  aCtx.fillStyle = grad;
  aCtx.fillRect(0, 0, cw, ch);

  aCtx.fillStyle = "rgba(255, 248, 225, 0.55)";
  ambientStars.forEach((st) => {
    const tw = 0.35 + 0.65 * Math.sin(frameTick * 1.8 + st.phase);
    aCtx.globalAlpha = tw * 0.7;
    aCtx.beginPath();
    aCtx.arc(st.x * cw, st.y * ch, st.r, 0, Math.PI * 2);
    aCtx.fill();
  });
  aCtx.globalAlpha = 1;

  pCtx.clearRect(0, 0, cw, ch);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.alpha -= 0.018;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }
    pCtx.save();
    pCtx.globalAlpha = p.alpha;
    pCtx.fillStyle = p.color;
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.restore();
  }

  requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);
