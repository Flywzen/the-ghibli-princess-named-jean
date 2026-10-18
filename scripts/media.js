export const USER_FILES = {
  ab0: "assets/Studio Ghibli GIF.gif",
  ab1b: "assets/hayao miyazaki running GIF by Maudit.gif",
  ab2b: "assets/Studio Ghibli GIF by TIFF (2).gif",
  keepsake: "assets/spirited away manga GIF.gif",
  audio: "assets/A Town With An Ocean View (Umi no Mieru Machi) - Kiki's Delivery Service Ost「03」.mp3",
  ab1: "assets/Studio Ghibli GIF by TIFF (1).gif",
  ab2: "assets/Studio Ghibli GIF by TIFF.gif",
  ab3a: "assets/hayao miyazaki kiss GIF.gif",
  ab3b: "assets/hayao miyazaki ghibli GIF.gif",
  ab4a: "assets/spirited away manga GIF (2).gif",
  ab4b: "assets/spirited away manga GIF (1).gif",
  ab5: "assets/spirited away m GIF.gif"
};

function createFallbackSVG(type) {
  const svgs = {
    ab1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#284B7E"/><stop offset="48%" stop-color="#E59866"/><stop offset="75%" stop-color="#F6C88F"/><stop offset="100%" stop-color="#4A3F6B"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#g1)"/>
      <ellipse cx="420" cy="210" rx="340" ry="95" fill="#FBE3B5" opacity="0.85"/>
      <ellipse cx="320" cy="240" rx="280" ry="65" fill="#B67868" opacity="0.65"/>
      <rect y="360" width="800" height="140" fill="#5D4E77" opacity="0.8"/>
      <line x1="120" y1="358" x2="680" y2="358" stroke="#FFF2D6" stroke-width="3"/>
      <rect x="490" y="330" width="32" height="28" fill="#2A2035" stroke="#FFE3B3" stroke-width="1.5"/>
    </svg>`,
    ab2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <rect width="800" height="350" fill="#1785B8"/>
      <circle cx="430" cy="180" r="145" fill="#FFF7E8"/>
      <circle cx="310" cy="220" r="105" fill="#FFF7E8"/>
      <rect y="340" width="800" height="160" fill="#5D7E9B"/>
      <ellipse cx="350" cy="348" rx="260" ry="22" fill="#89C93E"/>
      <polygon points="150,342 150,285 185,255 250,255 280,285 280,342" fill="#F4EDE2"/>
      <polygon points="145,285 185,250 255,250 285,285" fill="#D86C27"/>
      <circle cx="465" cy="240" r="35" fill="#6BA82E"/>
      <path d="M450 342 L462 265" stroke="#4A3525" stroke-width="8"/>
    </svg>`,
    ab3a: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <rect width="800" height="500" fill="#4A89B8"/>
      <path d="M0 320 Q250 240 520 310 T800 280 L800 500 L0 500 Z" fill="#6CA948"/>
      <circle cx="480" cy="195" r="55" fill="#FF5E3A" opacity="0.9"/>
      <circle cx="480" cy="205" r="32" fill="#FFD452"/>
      <circle cx="468" cy="205" r="5" fill="#141820"/><circle cx="492" cy="205" r="5" fill="#141820"/>
    </svg>`,
    ab3b: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500">
      <rect width="600" height="500" fill="#2AA4DF"/>
      <path d="M0 320 Q160 260 600 300 L600 500 L0 500 Z" fill="#5EA83B"/>
      <ellipse cx="260" cy="420" rx="120" ry="70" fill="#3B8BB8"/>
      <circle cx="120" cy="340" r="14" fill="#F59BB0"/><circle cx="460" cy="360" r="12" fill="#FFF3B0"/>
    </svg>`,
    ab4a: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <rect width="800" height="500" fill="#35582C"/>
      <circle cx="160" cy="160" r="95" fill="#F48FB1"/><circle cx="640" cy="180" r="110" fill="#F8BBD0"/>
      <circle cx="240" cy="360" r="105" fill="#EC407A"/><circle cx="560" cy="350" r="95" fill="#FCE4EC"/>
      <circle cx="400" cy="250" r="75" fill="#F48FB1"/>
    </svg>`,
    ab4b: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500">
      <rect width="600" height="500" fill="#193A48"/>
      <path d="M60 120 Q240 180 340 320" stroke="#F4EFE6" stroke-width="70" stroke-linecap="round" fill="none"/>
      <circle cx="400" cy="250" r="65" fill="#F5CBA7"/>
    </svg>`,
    ab5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <rect width="800" height="500" fill="#13577A"/>
      <circle cx="520" cy="95" r="38" fill="#FFF8B8"/>
      <path d="M180 215 Q420 235 780 265" stroke="#F4EFE6" stroke-width="28" stroke-linecap="round" fill="none"/>
      <path d="M0 370 Q200 330 420 365 T800 355 L800 500 L0 500 Z" fill="#6F7E85"/>
    </svg>`
  };
  return "data:image/svg+xml;utf8," + encodeURIComponent(svgs[type] || svgs.ab1);
}

function bindImageWithFallback(id, fileKey) {
  const el = document.getElementById(id);
  if (!el) return;
  // Attach the error handler before loading; fall back once if the asset is missing.
  el.onerror = () => {
    el.onerror = null;
    el.src = createFallbackSVG(fileKey);
  };
  el.src = USER_FILES[fileKey];
}

export function initializeImages() {
  bindImageWithFallback("img-ab-0", "ab0");
  bindImageWithFallback("img-ab-1b", "ab1b");
  bindImageWithFallback("img-ab-2b", "ab2b");
  bindImageWithFallback("img-keepsake", "keepsake");
  bindImageWithFallback("img-ab-1", "ab1");
  bindImageWithFallback("img-ab-2", "ab2");
  bindImageWithFallback("img-ab-3a", "ab3a");
  bindImageWithFallback("img-ab-3b", "ab3b");
  bindImageWithFallback("img-ab-4a", "ab4a");
  bindImageWithFallback("img-ab-4b", "ab4b");
  bindImageWithFallback("img-ab-5", "ab5");
}
