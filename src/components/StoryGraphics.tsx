import React from 'react';

// Cute Smiling Sun in the sky (Pages 1, 2, 3)
export const CuteSunVector: React.FC<{ size?: number; className?: string }> = ({ size = 70, className = '' }) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow">
        {/* Sun Rays */}
        <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" className="animate-spin-slow origin-center">
          <line x1="50" y1="8" x2="50" y2="18" />
          <line x1="50" y1="82" x2="50" y2="92" />
          <line x1="8" y1="50" x2="18" y2="50" />
          <line x1="82" y1="50" x2="92" y2="50" />
          <line x1="20" y1="20" x2="27" y2="27" />
          <line x1="73" y1="73" x2="80" y2="80" />
          <line x1="20" y1="80" x2="27" y2="73" />
          <line x1="73" y1="27" x2="80" y2="20" />
        </g>
        {/* Sun Face Body */}
        <circle cx="50" cy="50" r="30" fill="#fb923c" />
        <circle cx="50" cy="50" r="28" fill="#f97316" />
        <circle cx="50" cy="50" r="26" fill="#facc15" />
        {/* Eyes */}
        <circle cx="43" cy="46" r="3" fill="#78350f" />
        <circle cx="57" cy="46" r="3" fill="#78350f" />
        {/* Rosy Cheeks */}
        <circle cx="38" cy="53" r="3.5" fill="#f87171" opacity="0.8" />
        <circle cx="62" cy="53" r="3.5" fill="#f87171" opacity="0.8" />
        {/* Happy Smile */}
        <path d="M44 54 Q50 60 56 54" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};

// Cute Flying / Perched Blue Bird (Pages 1, 2, 4, 12, 14, 15, 16, 23)
export const BlueBirdVector: React.FC<{
  size?: number;
  flip?: boolean;
  className?: string;
  perched?: boolean;
}> = ({ size = 50, flip = false, className = '', perched = false }) => {
  return (
    <div
      className={`relative inline-block select-none ${flip ? '-scale-x-100' : ''} ${className}`}
      style={{ width: size, height: size * 0.8 }}
    >
      <svg viewBox="0 0 80 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow">
        {/* Bird Body */}
        <ellipse cx="42" cy="35" rx="22" ry="18" fill="#38bdf8" />
        {/* Belly soft light blue */}
        <ellipse cx="46" cy="39" rx="14" ry="12" fill="#bae6fd" />
        {/* Bird Head */}
        <circle cx="28" cy="24" r="14" fill="#0284c7" />
        {/* Eye */}
        <circle cx="24" cy="22" r="3" fill="#0f172a" />
        <circle cx="25" cy="21" r="1" fill="#ffffff" />
        {/* Beak */}
        <polygon points="14,24 8,27 15,30" fill="#f97316" />
        {/* Cheerful Wing */}
        {perched ? (
          <path d="M35 32 C45 30 58 36 55 46 C45 48 35 42 35 32 Z" fill="#0369a1" />
        ) : (
          <path d="M35 30 C30 15 50 12 55 24 C50 32 40 34 35 30 Z" fill="#0284c7" className="animate-pulse" />
        )}
        {/* Tail feathers */}
        <polygon points="60,34 74,30 68,38 72,44 58,40" fill="#0369a1" />
        {/* Little Feet */}
        <line x1="38" y1="52" x2="35" y2="60" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="46" y1="52" x2="44" y2="60" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// Cute Butterfly fluttering (Pages 2, 7)
export const ButterflyVector: React.FC<{ size?: number; className?: string }> = ({ size = 38, className = '' }) => {
  return (
    <div className={`relative inline-block select-none animate-float ${className}`} style={{ width: size, height: size * 0.9 }}>
      <svg viewBox="0 0 50 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow">
        {/* Wings Left */}
        <ellipse cx="16" cy="16" rx="13" ry="10" fill="#f472b6" transform="rotate(-25 16 16)" />
        <ellipse cx="17" cy="30" rx="9" ry="7" fill="#fb7185" transform="rotate(15 17 30)" />
        {/* Wings Right */}
        <ellipse cx="34" cy="16" rx="13" ry="10" fill="#f472b6" transform="rotate(25 34 16)" />
        <ellipse cx="33" cy="30" rx="9" ry="7" fill="#fb7185" transform="rotate(-15 33 30)" />
        {/* Wing dots */}
        <circle cx="16" cy="16" r="3.5" fill="#fef08a" />
        <circle cx="34" cy="16" r="3.5" fill="#fef08a" />
        {/* Body */}
        <ellipse cx="25" cy="22" rx="2.5" ry="12" fill="#701a75" />
        {/* Antennae */}
        <path d="M24 10 Q20 4 16 6" stroke="#701a75" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M26 10 Q30 4 34 6" stroke="#701a75" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};

// Lush Green Foliage with Wildflowers & Red Mushroom (Foreground of all storyboard pages!)
export const FoliageForeground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden pointer-events-none select-none relative ${className}`}>
      <svg
        viewBox="0 0 800 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-24 sm:h-28"
      >
        {/* Background Bush layer */}
        <path
          d="M-20 130 C20 70 80 50 140 80 C200 60 280 50 340 75 C420 40 500 55 570 70 C640 45 720 55 820 130 Z"
          fill="#15803d"
        />

        {/* Mid Bush layer (Brighter Green) */}
        <path
          d="M-10 130 C40 85 100 65 170 95 C240 75 310 70 380 90 C450 65 530 75 610 90 C690 65 760 80 810 130 Z"
          fill="#16a34a"
        />

        {/* Foreground Bush layer (Lush Bright Green) */}
        <path
          d="M0 130 C60 95 130 85 200 105 C270 90 350 95 420 110 C500 85 580 95 660 110 C720 90 770 100 800 130 Z"
          fill="#22c55e"
        />

        {/* Large Tropical Leaves Left */}
        <g transform="translate(40, 45)">
          <path d="M0 70 C15 35 45 20 65 30 C50 50 30 70 0 70 Z" fill="#15803d" />
          <path d="M10 70 C25 45 55 35 70 45 C55 60 40 70 10 70 Z" fill="#4ade80" />
          <line x1="10" y1="70" x2="65" y2="35" stroke="#14532d" strokeWidth="1.5" />
        </g>

        {/* Tropical Leaves Center-Right */}
        <g transform="translate(560, 40)">
          <path d="M40 70 C30 35 5 15 -15 25 C0 45 20 65 40 70 Z" fill="#15803d" />
          <path d="M30 70 C20 40 -5 30 -15 40 C0 55 15 65 30 70 Z" fill="#4ade80" />
          <line x1="30" y1="70" x2="-12" y2="30" stroke="#14532d" strokeWidth="1.5" />
        </g>

        {/* Red Toadstool Mushroom with White Spots (Bottom-Right, matching pages 25-34!) */}
        <g transform="translate(690, 68)">
          {/* Stem */}
          <path d="M16 45 C15 35 17 25 20 25 C23 25 25 35 24 45 Z" fill="#fef08a" />
          {/* Cap */}
          <path d="M8 26 C8 12 32 12 32 26 Z" fill="#ef4444" />
          {/* White spots */}
          <circle cx="15" cy="18" r="2.5" fill="#ffffff" />
          <circle cx="25" cy="18" r="2.5" fill="#ffffff" />
          <circle cx="20" cy="23" r="1.8" fill="#ffffff" />
        </g>

        {/* Little Baby Mushroom */}
        <g transform="translate(718, 78)">
          <path d="M10 35 C9 28 11 20 13 20 C15 20 17 28 16 35 Z" fill="#fef08a" />
          <path d="M6 21 C6 11 20 11 20 21 Z" fill="#f97316" />
          <circle cx="13" cy="15" r="2" fill="#ffffff" />
        </g>

        {/* Yellow Wildflowers */}
        <g transform="translate(180, 85)">
          <circle cx="12" cy="12" r="3.5" fill="#ea580c" />
          <circle cx="12" cy="6" r="3" fill="#facc15" />
          <circle cx="12" cy="18" r="3" fill="#facc15" />
          <circle cx="6" cy="12" r="3" fill="#facc15" />
          <circle cx="18" cy="12" r="3" fill="#facc15" />
        </g>

        <g transform="translate(490, 88)">
          <circle cx="10" cy="10" r="3" fill="#f43f5e" />
          <circle cx="10" cy="5" r="2.5" fill="#fef08a" />
          <circle cx="10" cy="15" r="2.5" fill="#fef08a" />
          <circle cx="5" cy="10" r="2.5" fill="#fef08a" />
          <circle cx="15" cy="10" r="2.5" fill="#fef08a" />
        </g>
      </svg>
    </div>
  );
};

// Mother & Daughter Characters (Storyboard Pages 8 & 9)
export const MotherAndDaughterVector: React.FC<{ size?: number; className?: string }> = ({ size = 260, className = '' }) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size * 0.9 }}>
      <svg viewBox="0 0 280 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* MOTHER (Left) */}
        <g id="mother">
          {/* Hair */}
          <path d="M60 45 C45 25 85 10 100 25 C115 10 145 25 130 50 C125 70 120 85 125 100 C100 105 80 100 70 90 C65 75 60 60 60 45 Z" fill="#451a03" />
          {/* Face */}
          <ellipse cx="95" cy="60" rx="20" ry="22" fill="#fed7aa" />
          {/* Cheerful mother eyes & eyebrows */}
          <path d="M84 50 Q90 47 96 50" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
          <circle cx="89" cy="58" r="3" fill="#1c1917" />
          <circle cx="90" cy="57" r="1" fill="#ffffff" />
          <path d="M100 50 Q106 47 112 50" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
          <circle cx="106" cy="58" r="3" fill="#1c1917" />
          <circle cx="107" cy="57" r="1" fill="#ffffff" />
          <circle cx="82" cy="65" r="3.5" fill="#fb7185" opacity="0.6" />
          <circle cx="112" cy="65" r="3.5" fill="#fb7185" opacity="0.6" />
          {/* Warm smile */}
          <path d="M88 70 Q96 77 104 70" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Maroon/Red Blouse */}
          <path d="M72 85 C80 80 110 80 118 85 L125 155 L65 155 Z" fill="#b91c1c" />
          {/* Mother's right hand pointing forward (Giving instruction) */}
          <path d="M118 95 Q145 105 160 90" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" />
          {/* Pointing finger */}
          <line x1="160" y1="90" x2="175" y2="85" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" />
          {/* Left hand on hip */}
          <path d="M72 95 Q55 115 65 135" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
          {/* Blue Trousers */}
          <path d="M68 155 L122 155 L125 235 L100 235 L95 180 L90 235 L65 235 Z" fill="#334155" />
          {/* Shoes */}
          <ellipse cx="78" cy="242" rx="12" ry="5" fill="#1e293b" />
          <ellipse cx="112" cy="242" rx="12" ry="5" fill="#1e293b" />
        </g>

        {/* DAUGHTER (Right) listening with curiosity */}
        <g id="daughter" transform="translate(80, 20)">
          {/* Question mark / listening expression */}
          <text x="120" y="70" fill="#f59e0b" fontSize="24" fontWeight="bold">?</text>
          {/* Girl Pigtails Hair */}
          <path d="M125 90 C110 65 145 55 165 70 C180 55 205 65 195 95 C190 115 180 120 185 130 C165 135 140 130 130 115 Z" fill="#78350f" />
          <circle cx="125" cy="85" r="9" fill="#78350f" />
          <circle cx="195" cy="85" r="9" fill="#78350f" />
          {/* Face */}
          <ellipse cx="160" cy="100" rx="18" ry="19" fill="#fed7aa" />
          {/* Big attentive eyes */}
          <circle cx="152" cy="98" r="3.5" fill="#1c1917" />
          <circle cx="153.5" cy="96.5" r="1.5" fill="#ffffff" />
          <circle cx="168" cy="98" r="3.5" fill="#1c1917" />
          <circle cx="169.5" cy="96.5" r="1.5" fill="#ffffff" />
          <circle cx="146" cy="104" r="3.5" fill="#fb7185" opacity="0.6" />
          <circle cx="174" cy="104" r="3.5" fill="#fb7185" opacity="0.6" />
          {/* Small open mouth (listening attentively) */}
          <ellipse cx="160" cy="109" rx="3" ry="2.5" fill="#b91c1c" />
          {/* Yellow blouse with white collar */}
          <path d="M142 120 L178 120 L185 165 L135 165 Z" fill="#fde047" />
          <polygon points="152,120 160,126 168,120" fill="#ffffff" />
          {/* Blue Pinafore skirt */}
          <path d="M135 165 L185 165 L192 205 L128 205 Z" fill="#3b82f6" />
          {/* Legs & Shoes */}
          <rect x="142" y="205" width="8" height="18" fill="#fed7aa" />
          <rect x="170" y="205" width="8" height="18" fill="#fed7aa" />
          <ellipse cx="146" cy="226" rx="9" ry="4" fill="#f43f5e" />
          <ellipse cx="174" cy="226" rx="9" ry="4" fill="#f43f5e" />
          {/* Hand raised receptive */}
          <path d="M142 130 Q125 125 120 115" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

// Polar Bear Reading Book & Cute White Cat holding Signboard (Storyboard Pages 10 & 11)
export const PolarBearAndBoardCat: React.FC<{
  signText?: string;
  size?: number;
  className?: string;
}> = ({ signText = 'tolong merupakan kata perintah', size = 300, className = '' }) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size * 0.75 }}>
      <svg viewBox="0 0 340 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* POLAR BEAR (Left) reading blue book */}
        <g id="polar_bear" transform="translate(10, 30)">
          {/* Body */}
          <ellipse cx="80" cy="140" rx="50" ry="45" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          {/* Ears */}
          <circle cx="50" cy="55" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="50" cy="55" r="7" fill="#fbcfe8" />
          <circle cx="105" cy="55" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="105" cy="55" r="7" fill="#fbcfe8" />
          {/* Head */}
          <circle cx="78" cy="80" r="36" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          {/* Muzzle */}
          <ellipse cx="78" cy="92" rx="16" ry="12" fill="#ffffff" />
          <ellipse cx="78" cy="88" rx="6" ry="4" fill="#1e293b" />
          <path d="M78 92 L78 97" stroke="#1e293b" strokeWidth="2" />
          <path d="M74 97 Q78 100 82 97" stroke="#1e293b" strokeWidth="2" fill="none" />
          {/* Eyes looking down at book */}
          <path d="M66 78 Q72 82 74 76" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M84 76 Q86 82 92 78" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Arms holding Blue Book */}
          <path d="M52 115 Q78 145 105 125" stroke="#f8fafc" strokeWidth="18" strokeLinecap="round" />
          {/* Blue Book */}
          <g transform="translate(65, 110)">
            <path d="M25 15 L0 8 L3 32 L25 36 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <path d="M25 15 L50 8 L47 32 L25 36 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <line x1="8" y1="16" x2="20" y2="19" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="8" y1="22" x2="20" y2="25" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        </g>

        {/* WHITE CAT (Right) holding Pink Whiteboard */}
        <g id="white_cat_with_board" transform="translate(160, 10)">
          {/* Cat Peeking on Top of Board */}
          <g transform="translate(35, 0)">
            {/* Ears */}
            <polygon points="15,40 10,12 35,28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="14,35 12,18 28,27" fill="#fbcfe8" />
            <polygon points="65,40 70,12 45,28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="66,35 68,18 52,27" fill="#fbcfe8" />
            {/* Head */}
            <ellipse cx="40" cy="48" rx="34" ry="26" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Whiskers */}
            <line x1="10" y1="48" x2="24" y2="49" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="12" y1="54" x2="24" y2="52" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="70" y1="48" x2="56" y2="49" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="68" y1="54" x2="56" y2="52" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Face */}
            <circle cx="28" cy="46" r="3.5" fill="#1e293b" />
            <circle cx="52" cy="46" r="3.5" fill="#1e293b" />
            <polygon points="40,51 37,48 43,48" fill="#f43f5e" />
            <circle cx="22" cy="52" r="3" fill="#fb7185" opacity="0.6" />
            <circle cx="58" cy="52" r="3" fill="#fb7185" opacity="0.6" />
          </g>

          {/* Whiteboard / Chalkboard with Pink Border */}
          <rect x="0" y="65" width="165" height="110" rx="16" fill="#ffffff" stroke="#f43f5e" strokeWidth="5" />
          <rect x="5" y="70" width="155" height="100" rx="12" fill="#fff5f5" />

          {/* Text inside whiteboard */}
          <text
            x="82"
            y="110"
            textAnchor="middle"
            fill="#be123c"
            fontSize="15"
            fontWeight="900"
            fontFamily="Fredoka, sans-serif"
          >
            {signText.split(' merupakan ')[0]}
          </text>
          <text
            x="82"
            y="130"
            textAnchor="middle"
            fill="#1e293b"
            fontSize="13"
            fontWeight="700"
            fontFamily="Fredoka, sans-serif"
          >
            merupakan
          </text>
          <text
            x="82"
            y="150"
            textAnchor="middle"
            fill="#1e293b"
            fontSize="14"
            fontWeight="900"
            fontFamily="Fredoka, sans-serif"
          >
            kata perintah
          </text>

          {/* Cute Cat Paws resting on bottom of board */}
          <circle cx="35" cy="175" r="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="130" cy="175" r="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

// 4 Expressive Shapes Mascots (Storyboard Pages 12 & 14)
export const EmotiveShapeMascot: React.FC<{
  shape: 'triangle' | 'circle' | 'square' | 'oval';
  size?: number;
  className?: string;
}> = ({ shape, size = 65, className = '' }) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow">
        {shape === 'triangle' && (
          // Green Triangle with happy smiling eyes & rosy cheeks
          <g>
            <polygon points="40,8 8,70 72,70" fill="#86efac" stroke="#16a34a" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="32" cy="48" r="3.5" fill="#14532d" />
            <circle cx="48" cy="48" r="3.5" fill="#14532d" />
            <ellipse cx="26" cy="54" rx="3" ry="2" fill="#f87171" opacity="0.8" />
            <ellipse cx="54" cy="54" rx="3" ry="2" fill="#f87171" opacity="0.8" />
            <path d="M34 56 Q40 62 46 56" stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}
        {shape === 'circle' && (
          // Red Circle with big surprised eyes (Larangan)
          <g>
            <circle cx="40" cy="40" r="34" fill="#fda4af" stroke="#e11d48" strokeWidth="3" />
            <circle cx="30" cy="36" r="6" fill="#ffffff" />
            <circle cx="30" cy="36" r="3.5" fill="#881337" />
            <circle cx="50" cy="36" r="6" fill="#ffffff" />
            <circle cx="50" cy="36" r="3.5" fill="#881337" />
            <circle cx="22" cy="48" r="3.5" fill="#f43f5e" opacity="0.7" />
            <circle cx="58" cy="48" r="3.5" fill="#f43f5e" opacity="0.7" />
            <ellipse cx="40" cy="52" rx="4" ry="5" fill="#881337" />
          </g>
        )}
        {shape === 'square' && (
          // Blue Square with joyful sparkling eyes (Silaan)
          <g>
            <rect x="10" y="10" width="60" height="60" rx="14" fill="#93c5fd" stroke="#2563eb" strokeWidth="3" />
            <circle cx="30" cy="36" r="4.5" fill="#1e3a8a" />
            <circle cx="32" cy="34" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="36" r="4.5" fill="#1e3a8a" />
            <circle cx="52" cy="34" r="1.5" fill="#ffffff" />
            <circle cx="22" cy="46" r="4" fill="#f87171" opacity="0.8" />
            <circle cx="58" cy="46" r="4" fill="#f87171" opacity="0.8" />
            <path d="M32 48 Q40 56 48 48" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}
        {shape === 'oval' && (
          // Yellow Oval with shy sweet smile (Permintaan)
          <g>
            <ellipse cx="40" cy="40" rx="34" ry="26" fill="#fde047" stroke="#ca8a04" strokeWidth="3" />
            <circle cx="30" cy="38" r="4" fill="#713f12" />
            <circle cx="50" cy="38" r="4" fill="#713f12" />
            <circle cx="22" cy="46" r="4" fill="#f87171" opacity="0.8" />
            <circle cx="58" cy="46" r="4" fill="#f87171" opacity="0.8" />
            <path d="M34 46 Q40 52 46 46" stroke="#713f12" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
};

// 3 Pirate Children Celebration (Storyboard Page 37 & 45)
export const ThreePiratesIllustration: React.FC<{ size?: number; className?: string }> = ({ size = 320, className = '' }) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size * 0.55 }}>
      <svg viewBox="0 0 360 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Pirate Girl (Left) with pink bandana */}
        <g transform="translate(10, 20)">
          {/* Polka dot Bandana */}
          <path d="M30 40 C15 15 65 10 80 40 C75 55 35 55 30 40 Z" fill="#f43f5e" />
          <circle cx="45" cy="28" r="3" fill="#ffffff" />
          <circle cx="60" cy="24" r="3" fill="#ffffff" />
          <circle cx="52" cy="36" r="2.5" fill="#ffffff" />
          {/* Face */}
          <ellipse cx="55" cy="60" rx="20" ry="18" fill="#fed7aa" />
          <circle cx="48" cy="58" r="3" fill="#1c1917" />
          <circle cx="62" cy="58" r="3" fill="#1c1917" />
          <circle cx="40" cy="65" r="3" fill="#fb7185" opacity="0.6" />
          <circle cx="70" cy="65" r="3" fill="#fb7185" opacity="0.6" />
          <path d="M50 68 Q55 74 60 68" stroke="#be123c" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Striped pink dress */}
          <path d="M38 78 L72 78 L80 130 L30 130 Z" fill="#fbcfe8" />
          <line x1="36" y1="90" x2="74" y2="90" stroke="#f43f5e" strokeWidth="3" />
          <line x1="34" y1="105" x2="76" y2="105" stroke="#f43f5e" strokeWidth="3" />
          <line x1="32" y1="120" x2="78" y2="120" stroke="#f43f5e" strokeWidth="3" />
        </g>

        {/* Pirate Captain Boy (Center) with Tricorne Hat & Steering Wheel */}
        <g transform="translate(130, 0)">
          {/* Big Pirate Hat with Skull */}
          <path d="M10 50 Q50 15 90 50 Q105 60 95 68 Q50 55 5 68 Q-5 60 10 50 Z" fill="#1e293b" />
          <circle cx="50" cy="40" r="6" fill="#ffffff" />
          <line x1="46" y1="46" x2="54" y2="46" stroke="#1e293b" strokeWidth="1.5" />
          {/* Face */}
          <ellipse cx="50" cy="75" rx="22" ry="20" fill="#ffedd5" />
          <circle cx="42" cy="72" r="3.5" fill="#1c1917" />
          <circle cx="58" cy="72" r="3.5" fill="#1c1917" />
          <circle cx="34" cy="80" r="3.5" fill="#fb7185" opacity="0.6" />
          <circle cx="66" cy="80" r="3.5" fill="#fb7185" opacity="0.6" />
          <path d="M44 83 Q50 90 56 83" stroke="#e11d48" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Pirate Captain Coat */}
          <path d="M30 95 L70 95 L78 150 L22 150 Z" fill="#0369a1" />
          <path d="M40 95 L60 95 L60 150 L40 150 Z" fill="#ffffff" />
          <line x1="40" y1="108" x2="60" y2="108" stroke="#dc2626" strokeWidth="3" />
          <line x1="40" y1="122" x2="60" y2="122" stroke="#dc2626" strokeWidth="3" />
          {/* Hands holding ship steering wheel */}
          <circle cx="50" cy="130" r="14" fill="none" stroke="#78350f" strokeWidth="4" />
          <circle cx="50" cy="130" r="4" fill="#ca8a04" />
        </g>

        {/* Pirate Boy with Glasses holding Treasure Map (Right) */}
        <g transform="translate(250, 20)">
          {/* Hair */}
          <path d="M35 40 C20 20 70 15 80 40 C75 50 35 50 35 40 Z" fill="#1e293b" />
          {/* Face */}
          <ellipse cx="55" cy="60" rx="20" ry="18" fill="#fed7aa" />
          {/* Round Glasses */}
          <circle cx="46" cy="58" r="7" fill="none" stroke="#e11d48" strokeWidth="2" />
          <circle cx="64" cy="58" r="7" fill="none" stroke="#e11d48" strokeWidth="2" />
          <line x1="53" y1="58" x2="57" y2="58" stroke="#e11d48" strokeWidth="2" />
          <circle cx="46" cy="58" r="2.5" fill="#1c1917" />
          <circle cx="64" cy="58" r="2.5" fill="#1c1917" />
          <circle cx="38" cy="65" r="3" fill="#fb7185" opacity="0.6" />
          <circle cx="72" cy="65" r="3" fill="#fb7185" opacity="0.6" />
          <path d="M50 70 Q55 75 60 70" stroke="#be123c" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Brown explorer shirt */}
          <path d="M36 80 L74 80 L78 135 L32 135 Z" fill="#991b1b" />
          {/* Parchment Treasure Map */}
          <rect x="36" y="95" width="38" height="26" rx="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <path d="M42 104 Q50 112 58 102 Q66 110 70 106" stroke="#b91c1c" strokeWidth="1.5" strokeDasharray="2,2" fill="none" />
          <text x="66" y="118" fill="#b91c1c" fontSize="10" fontWeight="bold">✕</text>
        </g>
      </svg>
    </div>
  );
};
