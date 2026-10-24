import React from 'react';

// Cikgu Syafiqah Vector Illustration
export const CikguVector: React.FC<{
  speaking?: boolean;
  size?: number;
  className?: string;
  onClick?: () => void;
}> = ({ speaking = false, size = 180, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none ${onClick ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''} ${className}`}
      style={{ width: size, height: size * 1.2 }}
      title="Cikgu Syafiqah (Tekan untuk dengar penerangan)"
    >
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Soft Aura Glow if speaking */}
        {speaking && (
          <circle cx="100" cy="110" r="85" fill="#fef08a" opacity="0.4" className="animate-pulse" />
        )}

        {/* Hijab Base (Pastel Caramel/Peach) */}
        <path
          d="M50 110 C45 60 70 30 100 30 C130 30 155 60 150 110 C145 150 155 190 165 235 C135 240 65 240 35 235 C45 190 55 150 50 110 Z"
          fill="#d4a373"
        />

        {/* Hijab Inner drape shadow */}
        <path
          d="M60 120 C60 75 75 48 100 48 C125 48 140 75 140 120 C135 155 125 185 100 185 C75 185 65 155 60 120 Z"
          fill="#c58f5e"
        />

        {/* Face Oval */}
        <ellipse cx="100" cy="115" rx="35" ry="38" fill="#fed7aa" />

        {/* Cheerful Eyebrows */}
        <path d="M78 95 Q86 91 94 95" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M106 95 Q114 91 122 95" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

        {/* Big Kind Eyes */}
        <circle cx="85" cy="106" r="6" fill="#451a03" />
        <circle cx="87" cy="104" r="2" fill="#ffffff" />
        <circle cx="115" cy="106" r="6" fill="#451a03" />
        <circle cx="117" cy="104" r="2" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx="76" cy="116" rx="6" ry="3.5" fill="#f87171" opacity="0.6" />
        <ellipse cx="124" cy="116" rx="6" ry="3.5" fill="#f87171" opacity="0.6" />

        {/* Cute Small Nose */}
        <circle cx="100" cy="115" r="1.8" fill="#ea580c" />

        {/* Mouth (Open if speaking, cheerful smile otherwise) */}
        {speaking ? (
          <ellipse cx="100" cy="126" rx="6" ry="5" fill="#be123c" className="animate-pulse" />
        ) : (
          <path d="M92 124 Q100 131 108 124" stroke="#be123c" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        )}

        {/* Hijab front fold & brooch */}
        <path
          d="M80 152 C90 162 110 162 120 152 C125 175 115 195 100 200 C85 195 75 175 80 152 Z"
          fill="#faedcd"
        />
        <circle cx="100" cy="162" r="4.5" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />

        {/* Blouse / Baju Kurung Body */}
        <path
          d="M62 195 C75 190 125 190 138 195 L155 240 L45 240 Z"
          fill="#e29578"
        />

        {/* Hands holding Open Book */}
        <g transform="translate(68, 185)">
          {/* Book Left Page */}
          <path d="M32 20 L5 12 L7 38 L32 44 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Book Right Page */}
          <path d="M32 20 L59 12 L57 38 L32 44 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Book Spine & Cover */}
          <path d="M31 18 L33 18 L33 46 L31 46 Z" fill="#b91c1c" />
          {/* Small text lines on book */}
          <line x1="12" y1="20" x2="26" y2="23" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="12" y1="26" x2="26" y2="29" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="38" y1="23" x2="52" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="38" y1="29" x2="52" y2="26" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Small fingers */}
          <ellipse cx="6" cy="30" rx="3.5" ry="3.5" fill="#fed7aa" />
          <ellipse cx="58" cy="30" rx="3.5" ry="3.5" fill="#fed7aa" />
        </g>
      </svg>
    </div>
  );
};

// Safari Explorer / Pengembara Cilik Boy Vector Illustration
export const BoyVector: React.FC<{
  pose?: 'wave' | 'binoculars' | 'flag' | 'magnify' | 'pirate';
  size?: number;
  className?: string;
  onClick?: () => void;
}> = ({ pose = 'wave', size = 180, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none ${onClick ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''} ${className}`}
      style={{ width: size, height: size * 1.25 }}
    >
      <svg
        viewBox="0 0 200 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Safari Hat / Pirate Bandana */}
        {pose === 'pirate' ? (
          <g>
            {/* Pirate Tricorne Hat */}
            <path d="M40 75 Q100 25 160 75 Q180 85 170 95 Q100 85 30 95 Q20 85 40 75 Z" fill="#1e293b" />
            {/* White skull emblem */}
            <circle cx="100" cy="65" r="7" fill="#ffffff" />
            <path d="M96 72 L104 72" stroke="#1e293b" strokeWidth="2" />
          </g>
        ) : (
          <g>
            {/* Safari Hat Crown */}
            <ellipse cx="100" cy="62" rx="42" ry="26" fill="#3b82f6" />
            {/* Hat Brim */}
            <ellipse cx="100" cy="74" rx="60" ry="14" fill="#2563eb" />
            {/* Hat Band */}
            <path d="M60 67 Q100 75 140 67" stroke="#1d4ed8" strokeWidth="5" fill="none" />
          </g>
        )}

        {/* Hair Fringe */}
        <path
          d="M68 76 Q85 92 100 78 Q115 90 132 76 Q125 65 100 68 Q75 65 68 76 Z"
          fill="#451a03"
        />

        {/* Boy Face */}
        <ellipse cx="100" cy="100" rx="36" ry="34" fill="#ffedd5" />

        {/* Cheerful Eyebrows */}
        <path d="M78 86 Q86 82 94 86" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M106 86 Q114 82 122 86" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />

        {/* Eyes: Left eye open, Right eye winking or open */}
        <circle cx="85" cy="96" r="6" fill="#1c1917" />
        <circle cx="87" cy="94" r="2" fill="#ffffff" />

        {pose === 'wave' || pose === 'flag' ? (
          <path d="M108 96 Q116 90 124 96" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <>
            <circle cx="115" cy="96" r="6" fill="#1c1917" />
            <circle cx="117" cy="94" r="2" fill="#ffffff" />
          </>
        )}

        {/* Cheeks */}
        <ellipse cx="74" cy="105" rx="6" ry="4" fill="#fb7185" opacity="0.6" />
        <ellipse cx="126" cy="105" rx="6" ry="4" fill="#fb7185" opacity="0.6" />

        {/* Smile */}
        <path d="M88 112 Q100 124 112 112" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Neckerchief / Scarf */}
        <path d="M84 130 L100 148 L116 130 Z" fill="#f97316" />

        {/* Yellow Explorer Shirt */}
        <path d="M68 135 L132 135 L142 195 L58 195 Z" fill="#fde047" />

        {/* Vest overlay */}
        <path d="M68 135 L88 135 L82 195 L58 195 Z" fill="#38bdf8" />
        <path d="M132 135 L112 135 L118 195 L142 195 Z" fill="#38bdf8" />

        {/* Blue Shorts */}
        <path d="M64 195 L136 195 L140 225 L106 225 L100 205 L94 225 L60 225 Z" fill="#1d4ed8" />

        {/* Legs & Shoes */}
        <rect x="74" y="224" width="12" height="15" fill="#fed7aa" />
        <rect x="114" y="224" width="12" height="15" fill="#fed7aa" />
        <ellipse cx="80" cy="242" rx="10" ry="5" fill="#475569" />
        <ellipse cx="120" cy="242" rx="10" ry="5" fill="#475569" />

        {/* Poses / Accessories */}
        {pose === 'wave' && (
          <g>
            {/* Waving Right Hand */}
            <path d="M132 145 Q165 125 170 95" stroke="#fed7aa" strokeWidth="12" strokeLinecap="round" />
            <circle cx="170" cy="92" r="7" fill="#fed7aa" />
            {/* Left Arm down */}
            <path d="M68 145 Q50 170 60 185" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" />
          </g>
        )}

        {pose === 'flag' && (
          <g>
            {/* Left hand holding flagpole */}
            <path d="M68 145 Q45 120 48 90" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" />
            {/* Flagpole */}
            <line x1="48" y1="50" x2="48" y2="210" stroke="#78350f" strokeWidth="4" />
            {/* Orange Triangular Flag */}
            <polygon points="48,50 120,75 48,100" fill="#f97316" />
          </g>
        )}

        {pose === 'binoculars' && (
          <g>
            {/* Binoculars held in front of eyes */}
            <rect x="78" y="90" width="18" height="14" rx="4" fill="#334155" />
            <rect x="104" y="90" width="18" height="14" rx="4" fill="#334155" />
            <line x1="96" y1="97" x2="104" y2="97" stroke="#64748b" strokeWidth="3" />
            <circle cx="87" cy="97" r="5" fill="#38bdf8" />
            <circle cx="113" cy="97" r="5" fill="#38bdf8" />
          </g>
        )}

        {pose === 'magnify' && (
          <g>
            {/* Holding Magnifying Glass */}
            <path d="M132 145 Q150 160 160 145" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" />
            <circle cx="165" cy="135" r="14" fill="#e0f2fe" stroke="#334155" strokeWidth="4" />
            <line x1="175" y1="145" x2="190" y2="160" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};

// Si Katak Comel Hijau (Green Jumping Frog Vector)
export const FrogVector: React.FC<{
  pose?: 'normal' | 'happy' | 'peace' | 'jump' | 'sad' | 'jumping_joy';
  size?: number;
  className?: string;
  onClick?: () => void;
}> = ({ pose = 'normal', size = 160, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none ${onClick ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''} ${className}`}
      style={{ width: size, height: size * 0.9 }}
    >
      <svg
        viewBox="0 0 200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Sparkles if jumping for joy */}
        {pose === 'jumping_joy' && (
          <g className="animate-pulse">
            <polygon points="35,30 38,20 41,30 50,33 41,36 38,45 35,36 25,33" fill="#facc15" />
            <polygon points="165,30 168,20 171,30 180,33 171,36 168,45 165,36 155,33" fill="#facc15" />
            <polygon points="100,10 102,4 104,10 110,12 104,14 102,20 100,14 94,12" fill="#38bdf8" />
          </g>
        )}

        {/* Big Frog Body */}
        <ellipse cx="100" cy="115" rx="55" ry="45" fill={pose === 'sad' ? '#4d7c0f' : '#65a30d'} />
        {/* Soft yellow-green belly */}
        <ellipse cx="100" cy="122" rx="38" ry="30" fill={pose === 'sad' ? '#bef264' : '#d9f99d'} />

        {/* Big Round Bulging Frog Eyes Top */}
        <circle cx="68" cy="55" r="26" fill={pose === 'sad' ? '#4d7c0f' : '#65a30d'} />
        <circle cx="132" cy="55" r="26" fill={pose === 'sad' ? '#4d7c0f' : '#65a30d'} />

        {/* Eye Whites */}
        <circle cx="68" cy="55" r="18" fill="#ffffff" />
        <circle cx="132" cy="55" r="18" fill="#ffffff" />

        {/* Pupil & Eyebrows */}
        {pose === 'sad' ? (
          // Drooping sad tearful eyes
          <>
            {/* Sad downturned eyebrows */}
            <path d="M52 40 Q68 48 84 44" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
            <path d="M116 44 Q132 48 148 40" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="68" cy="60" rx="9" ry="8" fill="#14532d" />
            <ellipse cx="132" cy="60" rx="9" ry="8" fill="#14532d" />
            <circle cx="71" cy="58" r="3" fill="#ffffff" />
            <circle cx="135" cy="58" r="3" fill="#ffffff" />
            {/* Big Water Tears */}
            <ellipse cx="56" cy="74" rx="4" ry="6" fill="#38bdf8" opacity="0.9" />
            <ellipse cx="144" cy="74" rx="4" ry="6" fill="#38bdf8" opacity="0.9" />
            <path d="M56 68 Q54 75 56 80 Q58 75 56 68 Z" fill="#0284c7" />
            <path d="M144 68 Q142 75 144 80 Q146 75 144 68 Z" fill="#0284c7" />
          </>
        ) : pose === 'peace' || pose === 'jumping_joy' ? (
          // Squeezed shut happy eyes (^ ^)
          <>
            <path d="M54 58 Q68 38 82 58" stroke="#14532d" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M118 58 Q132 38 146 58" stroke="#14532d" strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="68" cy="55" r="11" fill="#14532d" />
            <circle cx="71" cy="52" r="4" fill="#ffffff" />
            <circle cx="132" cy="55" r="11" fill="#14532d" />
            <circle cx="135" cy="52" r="4" fill="#ffffff" />
          </>
        )}

        {/* Mouth */}
        {pose === 'sad' ? (
          // Sad downturned trembling mouth
          <path d="M72 110 Q100 88 128 110" stroke="#14532d" strokeWidth="4" strokeLinecap="round" fill="none" />
        ) : pose === 'happy' || pose === 'jumping_joy' ? (
          // Giant joyous open laughing mouth
          <g>
            <path d="M60 92 Q100 142 140 92 Z" fill="#ef4444" stroke="#14532d" strokeWidth="3" />
            <ellipse cx="100" cy="116" rx="20" ry="10" fill="#f87171" />
          </g>
        ) : (
          <path d="M65 95 Q100 120 135 95" stroke="#14532d" strokeWidth="4" strokeLinecap="round" fill="none" />
        )}

        {/* Rosy Cheeks */}
        <circle cx="56" cy="100" r={pose === 'sad' ? 5 : 8} fill={pose === 'sad' ? '#93c5fd' : '#f87171'} opacity="0.7" />
        <circle cx="144" cy="100" r={pose === 'sad' ? 5 : 8} fill={pose === 'sad' ? '#93c5fd' : '#f87171'} opacity="0.7" />

        {/* Front webbed hands */}
        <g>
          {pose === 'jumping_joy' ? (
            // Both hands thrown high in air celebrating
            <>
              <path d="M65 90 Q40 60 30 45" stroke="#4d7c0f" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="28" cy="42" rx="7" ry="5" fill="#4d7c0f" />
              <ellipse cx="22" cy="46" rx="5" ry="4" fill="#4d7c0f" />
              <ellipse cx="32" cy="48" rx="5" ry="4" fill="#4d7c0f" />

              <path d="M135 90 Q160 60 170 45" stroke="#4d7c0f" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="172" cy="42" rx="7" ry="5" fill="#4d7c0f" />
              <ellipse cx="178" cy="46" rx="5" ry="4" fill="#4d7c0f" />
              <ellipse cx="168" cy="48" rx="5" ry="4" fill="#4d7c0f" />
            </>
          ) : pose === 'peace' ? (
            // Peace hand on the right
            <g transform="translate(138, 85)">
              <path d="M0 25 L8 5 L14 18 L24 8 L22 30 Z" fill="#4d7c0f" />
            </g>
          ) : pose === 'sad' ? (
            // Drooping sad limp hands
            <>
              <path d="M65 125 C50 145 42 165 48 172" stroke="#365314" strokeWidth="6" strokeLinecap="round" />
              <path d="M135 125 C150 145 158 165 152 172" stroke="#365314" strokeWidth="6" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M135 125 C145 135 155 145 150 155 C145 160 135 155 130 145 Z" fill="#4d7c0f" />
              <path d="M65 125 C55 135 45 145 50 155 C55 160 65 155 70 145 Z" fill="#4d7c0f" />
            </>
          )}
        </g>

        {/* Back Frog webbed feet */}
        <ellipse cx="40" cy="148" rx="22" ry="10" fill="#4d7c0f" />
        <ellipse cx="160" cy="148" rx="22" ry="10" fill="#4d7c0f" />
      </svg>
    </div>
  );
};

// Si Kucing Comel Kuning Berloceng (Orange Tabby Cat Vector)
export const CatVector: React.FC<{ size?: number; className?: string }> = ({ size = 130, className = '' }) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size * 0.9 }}>
      <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow">
        {/* Cat Ears */}
        <polygon points="40,55 30,15 65,35" fill="#f59e0b" />
        <polygon points="36,48 34,22 56,36" fill="#fbcfe8" />
        <polygon points="120,55 130,15 95,35" fill="#f59e0b" />
        <polygon points="124,48 126,22 104,36" fill="#fbcfe8" />

        {/* Head */}
        <ellipse cx="80" cy="65" rx="46" ry="38" fill="#fbbf24" />
        {/* White muzzle */}
        <ellipse cx="80" cy="76" rx="22" ry="16" fill="#ffffff" />

        {/* Eyes */}
        <circle cx="64" cy="58" r="5" fill="#451a03" />
        <circle cx="65.5" cy="56.5" r="1.8" fill="#ffffff" />
        <circle cx="96" cy="58" r="5" fill="#451a03" />
        <circle cx="97.5" cy="56.5" r="1.8" fill="#ffffff" />

        {/* Nose & Mouth */}
        <polygon points="80,72 76,68 84,68" fill="#f43f5e" />
        <path d="M75 75 Q80 80 85 75" stroke="#451a03" strokeWidth="2" fill="none" />

        {/* Cheeks */}
        <circle cx="56" cy="68" r="5" fill="#fca5a5" opacity="0.6" />
        <circle cx="104" cy="68" r="5" fill="#fca5a5" opacity="0.6" />

        {/* Collar & Golden Bell */}
        <path d="M50 94 Q80 106 110 94" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
        <circle cx="80" cy="102" r="7" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
        <circle cx="80" cy="104" r="2" fill="#713f12" />

        {/* Body Base */}
        <path d="M50 98 C45 130 115 130 110 98 Z" fill="#fbbf24" />
      </svg>
    </div>
  );
};

// Si Arnab Putih Comel (White Bunny Vector)
export const BunnyVector: React.FC<{ size?: number; className?: string }> = ({ size = 110, className = '' }) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size * 0.95 }}>
      <svg viewBox="0 0 140 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow">
        {/* Bunny Ears */}
        <ellipse cx="50" cy="28" rx="8" ry="24" fill="#f1f5f9" transform="rotate(-15 50 28)" />
        <ellipse cx="50" cy="28" rx="4" ry="16" fill="#fbcfe8" transform="rotate(-15 50 28)" />
        <ellipse cx="72" cy="25" rx="8" ry="25" fill="#f1f5f9" transform="rotate(10 72 25)" />
        <ellipse cx="72" cy="25" rx="4" ry="17" fill="#fbcfe8" transform="rotate(10 72 25)" />

        {/* Head */}
        <ellipse cx="60" cy="60" rx="30" ry="24" fill="#f8fafc" />
        {/* Eyes */}
        <circle cx="50" cy="56" r="4" fill="#1e293b" />
        <circle cx="51.5" cy="54.5" r="1.5" fill="#ffffff" />
        <circle cx="70" cy="56" r="4" fill="#1e293b" />
        <circle cx="71.5" cy="54.5" r="1.5" fill="#ffffff" />

        {/* Nose & Mouth */}
        <polygon points="60,63 57,60 63,60" fill="#f43f5e" />
        <circle cx="43" cy="63" r="4.5" fill="#fca5a5" opacity="0.6" />
        <circle cx="77" cy="63" r="4.5" fill="#fca5a5" opacity="0.6" />

        {/* Body */}
        <ellipse cx="80" cy="90" rx="36" ry="26" fill="#f1f5f9" />
        {/* Fluffy Tail */}
        <circle cx="116" cy="85" r="10" fill="#ffffff" />
      </svg>
    </div>
  );
};

// Peti Harta Karun (Treasure Chest Vector)
export const TreasureChestVector: React.FC<{
  isOpen?: boolean;
  size?: number;
  className?: string;
  onClick?: () => void;
}> = ({ isOpen = true, size = 160, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none ${onClick ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''} ${className}`}
      style={{ width: size, height: size * 0.85 }}
    >
      <svg viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
        {/* Glow */}
        {isOpen && (
          <ellipse cx="90" cy="65" rx="60" ry="35" fill="#fef08a" opacity="0.6" className="animate-pulse" />
        )}

        {/* Open Lid */}
        {isOpen ? (
          <path
            d="M30 45 C30 25 150 25 150 45 L145 60 C145 50 35 50 35 60 Z"
            fill="#b45309"
            stroke="#78350f"
            strokeWidth="3"
          />
        ) : (
          <path
            d="M25 70 C25 45 155 45 155 70 Z"
            fill="#b45309"
            stroke="#78350f"
            strokeWidth="3"
          />
        )}

        {/* Golden Coins Spilling out inside */}
        {isOpen && (
          <g>
            <circle cx="70" cy="60" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="90" cy="56" r="12" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="110" cy="62" r="10" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="80" cy="66" r="9" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="102" cy="68" r="9" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          </g>
        )}

        {/* Chest Base */}
        <rect x="25" y="68" width="130" height="65" rx="6" fill="#92400e" stroke="#78350f" strokeWidth="3" />

        {/* Gold Metal Bands */}
        <rect x="42" y="68" width="10" height="65" fill="#eab308" stroke="#a16207" strokeWidth="1.5" />
        <rect x="128" y="68" width="10" height="65" fill="#eab308" stroke="#a16207" strokeWidth="1.5" />

        {/* Gold Lock Plate & Keyhole */}
        <rect x="80" y="80" width="20" height="25" rx="4" fill="#facc15" stroke="#a16207" strokeWidth="2" />
        <circle cx="90" cy="89" r="3.5" fill="#451a03" />
        <polygon points="88.5,89 91.5,89 92.5,98 87.5,98" fill="#451a03" />
      </svg>
    </div>
  );
};
