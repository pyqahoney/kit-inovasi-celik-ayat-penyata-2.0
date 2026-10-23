import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

// 1. Logo Katak Si Katak Lompat
export const KatakLompatLogo: React.FC<LogoProps> = ({ size = 100, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative shrink-0 rounded-full select-none transform hover:scale-105 transition-transform duration-200 drop-shadow-xl ${className}`}
  >
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
      <defs>
        <radialGradient id="pondGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#cbf3f0" />
          <stop offset="100%" stopColor="#2ec4b6" />
        </radialGradient>
        <linearGradient id="frogSkin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#80ed99" />
          <stop offset="100%" stopColor="#38b000" />
        </linearGradient>
        <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe6a7" />
          <stop offset="50%" stopColor="#e0a96d" />
          <stop offset="100%" stopColor="#99582a" />
        </linearGradient>
        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Outer Blue Circle Border */}
      <circle cx="100" cy="100" r="95" fill="#1b4965" stroke="#f6bd60" strokeWidth="6" filter="url(#badgeShadow)" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#2b6cb0" strokeWidth="3" strokeDasharray="6,4" />

      {/* Inner Pond Water */}
      <circle cx="100" cy="100" r="80" fill="url(#pondGrad)" />

      {/* Water ripple rings */}
      <ellipse cx="100" cy="142" rx="48" ry="12" fill="none" stroke="#48cae4" strokeWidth="3" opacity="0.8" />
      <ellipse cx="100" cy="142" rx="36" ry="9" fill="none" stroke="#90e0ef" strokeWidth="2" opacity="0.9" />

      {/* Lily Pads */}
      <ellipse cx="40" cy="85" rx="16" ry="8" fill="#52b788" />
      <ellipse cx="160" cy="85" rx="16" ry="8" fill="#52b788" />
      <ellipse cx="38" cy="135" rx="14" ry="7" fill="#52b788" />
      <ellipse cx="162" cy="135" rx="14" ry="7" fill="#52b788" />

      {/* Center Main Lily Pad */}
      <ellipse cx="100" cy="144" rx="42" ry="16" fill="#2d6a4f" stroke="#1b4332" strokeWidth="2" />
      <path d="M100 144 L118 136 M100 144 L82 136 M100 144 L100 160" stroke="#74c69d" strokeWidth="1.5" />

      {/* Water Splashes */}
      <circle cx="68" cy="138" r="3" fill="#00b4d8" />
      <circle cx="132" cy="138" r="3" fill="#00b4d8" />
      <path d="M74 135 Q70 128 72 122 Q75 128 76 134 Z" fill="#48cae4" />
      <path d="M126 135 Q130 128 128 122 Q125 128 124 134 Z" fill="#48cae4" />

      {/* Happy Jumping Frog */}
      <g transform="translate(100, 106) scale(0.9) translate(-100, -106)">
        {/* Feet webbed */}
        <ellipse cx="70" cy="146" rx="9" ry="5" fill="#38b000" />
        <ellipse cx="130" cy="146" rx="9" ry="5" fill="#38b000" />

        {/* Legs jumping */}
        <path d="M68 128 Q52 136 68 146" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
        <path d="M132 128 Q148 136 132 146" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />

        {/* Frog Body */}
        <ellipse cx="100" cy="115" rx="28" ry="24" fill="url(#frogSkin)" />
        {/* Yellow tummy */}
        <ellipse cx="100" cy="118" rx="18" ry="15" fill="#e9edc9" />

        {/* Arms outstretched high in joy */}
        <path d="M80 105 Q62 90 60 76" fill="none" stroke="#38b000" strokeWidth="6" strokeLinecap="round" />
        <circle cx="58" cy="74" r="5" fill="#52b788" />
        <circle cx="54" cy="79" r="4" fill="#52b788" />
        <circle cx="65" cy="74" r="4" fill="#52b788" />

        <path d="M120 105 Q138 90 140 76" fill="none" stroke="#38b000" strokeWidth="6" strokeLinecap="round" />
        <circle cx="142" cy="74" r="5" fill="#52b788" />
        <circle cx="146" cy="79" r="4" fill="#52b788" />
        <circle cx="135" cy="74" r="4" fill="#52b788" />

        {/* Frog Head */}
        <ellipse cx="100" cy="92" rx="26" ry="18" fill="url(#frogSkin)" />
        {/* Eye sockets */}
        <circle cx="86" cy="76" r="10" fill="#38b000" />
        <circle cx="114" cy="76" r="10" fill="#38b000" />
        <circle cx="86" cy="76" r="7" fill="#ffffff" />
        <circle cx="114" cy="76" r="7" fill="#ffffff" />
        <circle cx="87" cy="76" r="4" fill="#000000" />
        <circle cx="113" cy="76" r="4" fill="#000000" />
        <circle cx="89" cy="74" r="1.5" fill="#ffffff" />
        <circle cx="115" cy="74" r="1.5" fill="#ffffff" />

        {/* Big Happy Smile */}
        <path d="M86 94 Q100 112 114 94 Z" fill="#9e2a2b" stroke="#540b0e" strokeWidth="2" />
        <path d="M92 102 Q100 108 108 102" fill="#ffb4a2" />

        {/* Rosy Cheeks */}
        <circle cx="80" cy="96" r="4" fill="#ff85a1" opacity="0.6" />
        <circle cx="120" cy="96" r="4" fill="#ff85a1" opacity="0.6" />
      </g>

      {/* Sparkles */}
      <path d="M48 60 L50 54 L52 60 L58 62 L52 64 L50 70 L48 64 L42 62 Z" fill="#ffea00" />
      <path d="M152 60 L154 54 L156 60 L162 62 L156 64 L154 70 L152 64 L146 62 Z" fill="#ffea00" />

      {/* Top Banner Text "KATAK SI" */}
      <g filter="url(#badgeShadow)">
        <text
          x="100"
          y="38"
          textAnchor="middle"
          fill="#ff0054"
          stroke="#540b0e"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="1.5"
        >
          KATAK SI
        </text>
        <text
          x="100"
          y="38"
          textAnchor="middle"
          fill="#ffd166"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="1.5"
        >
          KATAK SI
        </text>
      </g>

      {/* Bottom Banner Text "KATAK LOMPAT" */}
      <g filter="url(#badgeShadow)">
        <text
          x="100"
          y="182"
          textAnchor="middle"
          fill="#e63946"
          stroke="#540b0e"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="17"
          letterSpacing="1"
        >
          KATAK LOMPAT
        </text>
        <text
          x="100"
          y="182"
          textAnchor="middle"
          fill="#ffb703"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="17"
          letterSpacing="1"
        >
          KATAK LOMPAT
        </text>
      </g>
    </svg>
  </div>
);

// 2. Logo Game Kembara Harta Karun
export const KembaraHartaKarunLogo: React.FC<LogoProps> = ({ size = 100, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative shrink-0 rounded-full select-none transform hover:scale-105 transition-transform duration-200 drop-shadow-xl ${className}`}
  >
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="skyTropical" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#48cae4" />
          <stop offset="70%" stopColor="#90e0ef" />
          <stop offset="100%" stopColor="#ffd166" />
        </linearGradient>
        <linearGradient id="goldChest" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd166" />
          <stop offset="50%" stopColor="#ffb703" />
          <stop offset="100%" stopColor="#fb8500" />
        </linearGradient>
        <linearGradient id="woodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a15c38" />
          <stop offset="100%" stopColor="#582f0e" />
        </linearGradient>
      </defs>

      {/* Outer Ship Steering Wheel Rope Ring */}
      <circle cx="100" cy="100" r="95" fill="#7f4f24" stroke="#ffb703" strokeWidth="6" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#ddb892" strokeWidth="3" strokeDasharray="5,3" />

      {/* Inner Sky */}
      <circle cx="100" cy="100" r="80" fill="url(#skyTropical)" />

      {/* Ocean Waves */}
      <path d="M22 135 Q50 125 100 135 Q150 145 178 135 L178 175 L22 175 Z" fill="#0077b6" opacity="0.6" />
      <path d="M22 142 Q60 132 100 140 Q140 148 178 140 L178 175 L22 175 Z" fill="#023e8a" opacity="0.8" />

      {/* Island Sand */}
      <ellipse cx="100" cy="148" rx="55" ry="16" fill="#ffe8d6" stroke="#ddb892" strokeWidth="2" />

      {/* Palm Trees in Background */}
      <path d="M72 135 Q78 95 90 75" fill="none" stroke="#6f4e37" strokeWidth="4" strokeLinecap="round" />
      <path d="M90 75 Q70 65 65 72 M90 75 Q85 58 75 62 M90 75 Q98 58 105 62 M90 75 Q110 68 108 76" fill="none" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" />

      {/* Pirate Treasure Map with Red X */}
      <rect x="42" y="82" width="32" height="24" rx="3" fill="#faedcd" stroke="#d4a373" strokeWidth="1.5" transform="rotate(-15 58 94)" />
      <path d="M50 92 L62 98 M62 92 L50 98" stroke="#d00000" strokeWidth="2.5" strokeLinecap="round" />

      {/* Swords crossed in background */}
      <path d="M125 76 L155 125 M125 76 L120 80 M155 125 L158 128" stroke="#ced4da" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M155 76 L125 125" stroke="#ced4da" strokeWidth="3.5" strokeLinecap="round" />

      {/* Open Treasure Chest */}
      <g transform="translate(100, 126) scale(0.95) translate(-100, -126)">
        {/* Chest Base */}
        <rect x="68" y="112" width="64" height="34" rx="4" fill="url(#woodGrad)" stroke="#3d1d05" strokeWidth="2.5" />
        <rect x="74" y="112" width="6" height="34" fill="#ffb703" />
        <rect x="120" y="112" width="6" height="34" fill="#ffb703" />
        <circle cx="100" cy="126" r="3" fill="#ffb703" />

        {/* Chest Lid open */}
        <path d="M66 112 Q100 86 134 112" fill="none" stroke="url(#woodGrad)" strokeWidth="12" strokeLinecap="round" />
        <path d="M66 112 Q100 86 134 112" fill="none" stroke="#ffb703" strokeWidth="3" />

        {/* Overflowing Gold Coins & Gems */}
        <circle cx="92" cy="110" r="5" fill="#ffd166" stroke="#e09f3e" strokeWidth="1" />
        <circle cx="104" cy="108" r="5" fill="#ffd166" stroke="#e09f3e" strokeWidth="1" />
        <circle cx="82" cy="112" r="4.5" fill="#ffd166" stroke="#e09f3e" strokeWidth="1" />
        <circle cx="116" cy="111" r="4.5" fill="#ffd166" stroke="#e09f3e" strokeWidth="1" />
        <polygon points="98,102 103,98 108,102 105,108 101,108" fill="#e63946" stroke="#fff" strokeWidth="0.8" />
        <polygon points="88,105 92,100 96,105 94,110 90,110" fill="#48cae4" stroke="#fff" strokeWidth="0.8" />
        <polygon points="106,105 110,100 114,105 112,110 108,110" fill="#a06cd5" stroke="#fff" strokeWidth="0.8" />

        {/* Golden Royal Crown */}
        <polygon points="92,104 95,95 100,100 105,95 108,104" fill="url(#goldChest)" stroke="#99582a" strokeWidth="1" />
        <circle cx="95" cy="95" r="1.5" fill="#fff" />
        <circle cx="100" cy="100" r="1.5" fill="#fff" />
        <circle cx="105" cy="95" r="1.5" fill="#fff" />
      </g>

      {/* Sparkles */}
      <path d="M46 54 L48 48 L50 54 L56 56 L50 58 L48 64 L46 58 L40 56 Z" fill="#ffd166" />
      <path d="M156 54 L158 48 L160 54 L166 56 L160 58 L158 64 L156 58 L150 56 Z" fill="#ffd166" />

      {/* Arched Title "KEMBARA" */}
      <g>
        <text
          x="100"
          y="40"
          textAnchor="middle"
          fill="#d00000"
          stroke="#471400"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="2"
        >
          KEMBARA
        </text>
        <text
          x="100"
          y="40"
          textAnchor="middle"
          fill="#ffb703"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="2"
        >
          KEMBARA
        </text>
      </g>

      {/* Bottom Title "HARTA KARUN" */}
      <g>
        <text
          x="100"
          y="182"
          textAnchor="middle"
          fill="#d00000"
          stroke="#471400"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="18"
          letterSpacing="1"
        >
          HARTA KARUN
        </text>
        <text
          x="100"
          y="182"
          textAnchor="middle"
          fill="#ffb703"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="18"
          letterSpacing="1"
        >
          HARTA KARUN
        </text>
      </g>
    </svg>
  </div>
);

// 3. Logo Wira Mario
export const WiraMarioLogo: React.FC<LogoProps> = ({ size = 100, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative shrink-0 rounded-full select-none transform hover:scale-105 transition-transform duration-200 drop-shadow-xl ${className}`}
  >
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
      <defs>
        <radialGradient id="marioBurst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#70d6ff" />
          <stop offset="100%" stopColor="#0077b6" />
        </radialGradient>
        <linearGradient id="goldCoin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="60%" stopColor="#ffb703" />
          <stop offset="100%" stopColor="#fb8500" />
        </linearGradient>
      </defs>

      {/* Red Circular Border with Gold Studs */}
      <circle cx="100" cy="100" r="95" fill="#d90429" stroke="#ffb703" strokeWidth="6" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#2b2d42" strokeWidth="2.5" />

      {/* Inner Sky Blue Background */}
      <circle cx="100" cy="100" r="80" fill="url(#marioBurst)" />

      {/* Starburst rays */}
      <path d="M100 100 L30 40 M100 100 L170 40 M100 100 L30 160 M100 100 L170 160" stroke="#fff" strokeWidth="2" opacity="0.4" />

      {/* [?] Question Block */}
      <g transform="translate(42, 70) rotate(-10)">
        <rect width="26" height="26" rx="4" fill="#fb8500" stroke="#ffb703" strokeWidth="2" />
        <rect x="3" y="3" width="20" height="20" rx="2" fill="#ffb703" />
        <text x="13" y="18" textAnchor="middle" fill="#fff" fontWeight="900" fontSize="16" fontFamily="monospace">?</text>
      </g>

      {/* Red Mushroom */}
      <g transform="translate(152, 72) rotate(15)">
        <path d="M-12 0 Q0 -14 12 0 Z" fill="#d90429" stroke="#fff" strokeWidth="1" />
        <circle cx="-5" cy="-5" r="2.5" fill="#fff" />
        <circle cx="5" cy="-5" r="2.5" fill="#fff" />
        <rect x="-6" y="0" width="12" height="8" rx="2" fill="#ffedd8" stroke="#333" strokeWidth="0.8" />
      </g>

      {/* Power Star */}
      <g transform="translate(160, 115) scale(0.9)">
        <polygon points="0,-12 3,-3 12,-3 5,2 8,11 0,6 -8,11 -5,2 -12,-3 -3,-3" fill="#ffd166" stroke="#fb8500" strokeWidth="1.5" />
        <ellipse cx="-2" cy="0" rx="1" ry="2" fill="#000" />
        <ellipse cx="2" cy="0" rx="1" ry="2" fill="#000" />
      </g>

      {/* Gold Coins Floating */}
      <ellipse cx="62" cy="115" rx="7" ry="5" fill="url(#goldCoin)" stroke="#d48b00" strokeWidth="1.5" />
      <ellipse cx="140" cy="95" rx="7" ry="5" fill="url(#goldCoin)" stroke="#d48b00" strokeWidth="1.5" />

      {/* Super Mario Hero in Center */}
      <g transform="translate(100, 108) scale(0.95) translate(-100, -108)">
        {/* Cape fluttering */}
        <path d="M78 100 Q60 115 62 135 Q78 125 90 115 Z" fill="#ef233c" stroke="#900" strokeWidth="1.5" />

        {/* Blue Overalls & Legs */}
        <path d="M84 122 L76 142 L90 144 L96 128" fill="#0077b6" stroke="#023e8a" strokeWidth="2" />
        <path d="M104 122 L112 142 L124 138 L114 120" fill="#0077b6" stroke="#023e8a" strokeWidth="2" />
        {/* Brown Boots */}
        <ellipse cx="78" cy="144" rx="10" ry="6" fill="#6f4e37" />
        <ellipse cx="122" cy="140" rx="10" ry="6" fill="#6f4e37" />

        {/* Torso Red Shirt & Overalls */}
        <rect x="85" y="105" width="26" height="22" rx="4" fill="#0077b6" />
        <circle cx="89" cy="112" r="2.5" fill="#ffb703" />
        <circle cx="107" cy="112" r="2.5" fill="#ffb703" />

        {/* Left fist punch up high */}
        <path d="M84 105 L72 82" stroke="#ef233c" strokeWidth="10" strokeLinecap="round" />
        <circle cx="68" cy="74" r="10" fill="#ffffff" stroke="#ced4da" strokeWidth="1.5" />
        <ellipse cx="72" cy="74" rx="3" ry="5" fill="#dee2e6" />

        {/* Right arm running */}
        <path d="M112 108 L126 118" stroke="#ef233c" strokeWidth="9" strokeLinecap="round" />
        <circle cx="130" cy="120" r="7" fill="#ffffff" stroke="#ced4da" strokeWidth="1.5" />

        {/* Mario Head & Cap */}
        <circle cx="102" cy="94" r="14" fill="#ffcc99" />
        {/* Big nose */}
        <ellipse cx="112" cy="94" rx="5" ry="4" fill="#ffb380" />
        {/* Mustache */}
        <path d="M100 97 Q114 97 116 102 Q108 104 100 97" fill="#1b1b1e" />
        {/* Eye */}
        <ellipse cx="106" cy="90" rx="2.5" ry="3.5" fill="#0077b6" />
        <circle cx="107" cy="89" r="1" fill="#fff" />
        {/* Cap with M */}
        <path d="M88 88 Q100 70 120 86 Q128 88 116 92 Z" fill="#d90429" stroke="#900" strokeWidth="1.5" />
        <circle cx="104" cy="80" r="5" fill="#ffffff" />
        <text x="104" y="83" textAnchor="middle" fill="#d90429" fontWeight="900" fontSize="7" fontFamily="sans-serif">M</text>
      </g>

      {/* Top Arched Title "WIRA" */}
      <g>
        <text
          x="100"
          y="40"
          textAnchor="middle"
          fill="#d90429"
          stroke="#540b0e"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="26"
          letterSpacing="2"
        >
          WIRA
        </text>
        <text
          x="100"
          y="40"
          textAnchor="middle"
          fill="#ffb703"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="26"
          letterSpacing="2"
        >
          WIRA
        </text>
      </g>

      {/* Bottom Title "MARIO" */}
      <g>
        <text
          x="100"
          y="182"
          textAnchor="middle"
          fill="#0077b6"
          stroke="#03045e"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="26"
          letterSpacing="2"
        >
          MARIO
        </text>
        <text
          x="100"
          y="182"
          textAnchor="middle"
          fill="#ffd166"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="26"
          letterSpacing="2"
        >
          MARIO
        </text>
      </g>
    </svg>
  </div>
);

// 4. Logo Kuasa Pac-Man
export const KuasaPacmanLogo: React.FC<LogoProps> = ({ size = 100, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative shrink-0 rounded-full select-none transform hover:scale-105 transition-transform duration-200 drop-shadow-xl ${className}`}
  >
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
      <defs>
        <radialGradient id="arcadeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <linearGradient id="pacmanBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="40%" stopColor="#ffb703" />
          <stop offset="100%" stopColor="#fb8500" />
        </linearGradient>
      </defs>

      {/* Neon Cyan & Blue Outer Ring */}
      <circle cx="100" cy="100" r="95" fill="#03071e" stroke="#00b4d8" strokeWidth="6" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#ffd166" strokeWidth="2.5" strokeDasharray="6,4" />

      {/* Arcade Dark Space */}
      <circle cx="100" cy="100" r="80" fill="url(#arcadeGlow)" />

      {/* Maze Grid lines in background */}
      <path d="M40 80 H60 V120 H40 M140 80 H160 V120 H140" fill="none" stroke="#1d4ed8" strokeWidth="2.5" opacity="0.6" />

      {/* 4 Colored Ghosts */}
      {/* Blinky (Red) */}
      <g transform="translate(42, 85) scale(0.7)">
        <path d="M-10 10 V0 Q-10 -10 0 -10 Q10 -10 10 0 V10 L7 8 L3 10 L0 8 L-3 10 L-7 8 Z" fill="#ef233c" />
        <circle cx="-3" cy="-2" r="3" fill="#fff" />
        <circle cx="3" cy="-2" r="3" fill="#fff" />
        <circle cx="-2" cy="-2" r="1.5" fill="#0077b6" />
        <circle cx="4" cy="-2" r="1.5" fill="#0077b6" />
      </g>
      {/* Inky (Cyan) */}
      <g transform="translate(40, 120) scale(0.7)">
        <path d="M-10 10 V0 Q-10 -10 0 -10 Q10 -10 10 0 V10 L7 8 L3 10 L0 8 L-3 10 L-7 8 Z" fill="#48cae4" />
        <circle cx="-3" cy="-2" r="3" fill="#fff" />
        <circle cx="3" cy="-2" r="3" fill="#fff" />
        <circle cx="-2" cy="-2" r="1.5" fill="#0077b6" />
        <circle cx="4" cy="-2" r="1.5" fill="#0077b6" />
      </g>
      {/* Pinky (Pink) */}
      <g transform="translate(160, 85) scale(0.7)">
        <path d="M-10 10 V0 Q-10 -10 0 -10 Q10 -10 10 0 V10 L7 8 L3 10 L0 8 L-3 10 L-7 8 Z" fill="#ff70a6" />
        <circle cx="-3" cy="-2" r="3" fill="#fff" />
        <circle cx="3" cy="-2" r="3" fill="#fff" />
        <circle cx="-4" cy="-2" r="1.5" fill="#0077b6" />
        <circle cx="2" cy="-2" r="1.5" fill="#0077b6" />
      </g>
      {/* Clyde (Orange) */}
      <g transform="translate(162, 120) scale(0.7)">
        <path d="M-10 10 V0 Q-10 -10 0 -10 Q10 -10 10 0 V10 L7 8 L3 10 L0 8 L-3 10 L-7 8 Z" fill="#fb8500" />
        <circle cx="-3" cy="-2" r="3" fill="#fff" />
        <circle cx="3" cy="-2" r="3" fill="#fff" />
        <circle cx="-4" cy="-2" r="1.5" fill="#0077b6" />
        <circle cx="2" cy="-2" r="1.5" fill="#0077b6" />
      </g>

      {/* Lightning energy sparks */}
      <path d="M68 85 L76 96 L72 98 L82 108" fill="none" stroke="#ffd166" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M132 85 L124 96 L128 98 L118 108" fill="none" stroke="#ffd166" strokeWidth="2.5" strokeLinecap="round" />

      {/* Pac-Man Character with Boxing Gloves */}
      <g transform="translate(100, 108) scale(0.95) translate(-100, -108)">
        {/* Yellow Body */}
        <circle cx="100" cy="102" r="26" fill="url(#pacmanBody)" stroke="#d48b00" strokeWidth="1.5" />
        {/* Wide Happy Open Mouth */}
        <path d="M100 102 L124 92 A 26 26 0 0 1 124 112 Z" fill="#0f172a" />
        <path d="M110 100 Q118 102 110 106" fill="#e63946" />
        {/* Big Animated Eye */}
        <ellipse cx="94" cy="90" rx="3.5" ry="5.5" fill="#0f172a" />
        <circle cx="95" cy="88" r="1.5" fill="#ffffff" />

        {/* Red Boxing Gloves Punching Out */}
        {/* Left Glove */}
        <circle cx="72" cy="88" r="10" fill="#d90429" stroke="#900" strokeWidth="1.5" />
        <ellipse cx="68" cy="86" rx="4" ry="7" fill="#ef233c" />
        {/* Right Glove */}
        <circle cx="128" cy="88" r="10" fill="#d90429" stroke="#900" strokeWidth="1.5" />
        <ellipse cx="132" cy="86" rx="4" ry="7" fill="#ef233c" />

        {/* Red Running Shoes */}
        <ellipse cx="88" cy="132" rx="9" ry="5" fill="#d90429" stroke="#900" strokeWidth="1" />
        <ellipse cx="114" cy="132" rx="9" ry="5" fill="#d90429" stroke="#900" strokeWidth="1" />
      </g>

      {/* Golden Glowing Power Pellet */}
      <circle cx="68" cy="134" r="7" fill="#ffb703" stroke="#fff" strokeWidth="1.5" />
      <circle cx="68" cy="134" r="11" fill="none" stroke="#ffd166" strokeWidth="1" opacity="0.6" />

      {/* Top Title "KUASA" */}
      <g>
        <text
          x="100"
          y="40"
          textAnchor="middle"
          fill="#ffb703"
          stroke="#471400"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="2"
        >
          KUASA
        </text>
        <text
          x="100"
          y="40"
          textAnchor="middle"
          fill="#fff3b0"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="2"
        >
          KUASA
        </text>
      </g>

      {/* Bottom Title "PAC-MAN" */}
      <g>
        <text
          x="100"
          y="182"
          textAnchor="middle"
          fill="#d90429"
          stroke="#471400"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="1.5"
        >
          PAC-MAN
        </text>
        <text
          x="100"
          y="182"
          textAnchor="middle"
          fill="#ffd166"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="1.5"
        >
          PAC-MAN
        </text>
      </g>
    </svg>
  </div>
);
