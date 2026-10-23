import React from 'react';
import { Home, X, HelpCircle, Volume2, VolumeX, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { sound } from '../utils/audio';

// Top Bar with X, Home, Help, and Sound Toggle
export const TopNavBar: React.FC<{
  onHome?: () => void;
  onExit?: () => void;
  onHelp?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  title?: string;
  className?: string;
}> = ({ onHome, onExit, onHelp, soundEnabled, onToggleSound, title, className = '' }) => {
  return (
    <div className={`flex items-center justify-between w-full px-4 py-2 z-30 ${className}`}>
      {/* Left side actions */}
      <div className="flex items-center gap-2">
        {onExit && (
          <button
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            aria-label="Keluar / Kembali"
            title="Keluar / Kembali"
            className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-lg border-2 border-white transition-all transform hover:rotate-6"
          >
            <X size={26} strokeWidth={3.5} />
          </button>
        )}

        {onHome && (
          <button
            onClick={() => {
              sound.playClick();
              onHome();
            }}
            aria-label="Halaman Utama"
            title="Halaman Utama"
            className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-lg border-2 border-white transition-all transform hover:-rotate-6"
          >
            <Home size={24} strokeWidth={2.8} />
          </button>
        )}
      </div>

      {/* Center Title if provided */}
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-900 tracking-wide drop-shadow-sm text-center">
          {title}
        </h2>
      )}

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Audio Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleSound();
          }}
          aria-label={soundEnabled ? "Bunyi Hidup" : "Bunyi Senyap"}
          title={soundEnabled ? "Lagu Nintendo Café: AKTIF (Tekan untuk bisu)" : "Lagu Latar: BISU (Tekan untuk mainkan lagu)"}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg border-2 border-white transition-all text-xs font-heading font-black cursor-pointer ${
            soundEnabled
              ? 'bg-amber-400 text-amber-950 hover:bg-amber-500'
              : 'bg-slate-300 text-slate-600 hover:bg-slate-400'
          }`}
        >
          {soundEnabled ? <Volume2 size={20} strokeWidth={2.8} /> : <VolumeX size={20} strokeWidth={2.8} />}
          <span className="hidden sm:inline">{soundEnabled ? '🎵 Muzik BGM' : '🔇 Bisu'}</span>
        </button>

        {onHelp && (
          <button
            onClick={() => {
              sound.playClick();
              onHelp();
            }}
            aria-label="Bantuan & Makna Simbol"
            title="Bantuan & Makna Simbol"
            className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white flex items-center justify-center shadow-lg border-2 border-white transition-all transform hover:scale-105"
          >
            <HelpCircle size={26} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
};

// Wooden Arrow Button (Previous / Next page) matching storyboard screenshots
export const WoodArrowButton: React.FC<{
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}> = ({ direction, onClick, disabled = false, label, className = '' }) => {
  return (
    <button
      onClick={() => {
        if (!disabled) {
          sound.playClick();
          onClick();
        }
      }}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Halaman sebelumnya' : 'Halaman seterusnya'}
      title={direction === 'prev' ? 'Halaman sebelumnya' : 'Halaman seterusnya'}
      className={`group relative flex items-center justify-center px-4 py-2.5 rounded-2xl bg-[#e6ccb2] hover:bg-[#ddb892] active:bg-[#b08968] border-3 border-[#7f4f24] shadow-[0_4px_0_#7f4f24] active:shadow-[0_1px_0_#7f4f24] active:translate-y-1 transition-all ${
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer hover:scale-105'
      } ${className}`}
    >
      {/* Wood texture rings & grain subtle lines */}
      <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-20">
        <span className="absolute top-1 left-3 right-3 h-[1px] bg-[#582f0e]" />
        <span className="absolute bottom-1.5 left-2 right-2 h-[1px] bg-[#582f0e]" />
      </span>

      <div className="flex items-center gap-1.5 text-[#582f0e] font-heading font-bold text-sm">
        {direction === 'prev' && (
          <>
            <ArrowLeft size={24} strokeWidth={3.5} className="text-[#582f0e] transition-transform group-hover:-translate-x-1" />
            {label && <span>{label}</span>}
          </>
        )}
        {direction === 'next' && (
          <>
            {label && <span>{label}</span>}
            <ArrowRight size={24} strokeWidth={3.5} className="text-[#582f0e] transition-transform group-hover:translate-x-1" />
          </>
        )}
      </div>
    </button>
  );
};

// Big Golden Circular Play Button (Page 1)
export const GoldenPlayButton: React.FC<{
  onClick: () => void;
  size?: number;
  className?: string;
}> = ({ onClick, size = 100, className = '' }) => {
  return (
    <button
      onClick={() => {
        sound.playSuccess();
        onClick();
      }}
      style={{ width: size, height: size }}
      aria-label="Mula Belajar"
      className={`group relative rounded-full flex items-center justify-center cursor-pointer bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 border-4 border-amber-200 shadow-[0_10px_25px_rgba(217,119,6,0.6)] hover:shadow-[0_15px_30px_rgba(217,119,6,0.8)] active:scale-95 transition-all transform hover:scale-110 ${className}`}
    >
      {/* Inner ring */}
      <div className="w-4/5 h-4/5 rounded-full border-3 border-amber-600/40 flex items-center justify-center bg-gradient-to-t from-amber-600 to-amber-400">
        {/* Play Triangle */}
        <Play size={size * 0.45} fill="#582f0e" color="#582f0e" className="ml-1.5 drop-shadow transition-transform group-hover:scale-110" />
      </div>
    </button>
  );
};

// Cute Speaker Button for Malay Speech & Read-Aloud
export const AudioSpeakerButton: React.FC<{
  textToSpeak: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  persona?: 'syafiqah' | 'aaron' | 'freshcy' | 'neutral';
}> = ({ textToSpeak, size = 'md', label, className = '', persona }) => {
  const [speaking, setSpeaking] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = sound.onSpeechStateChange((isSpeaking) => {
      setSpeaking(isSpeaking);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.speakMalay(textToSpeak, persona);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Dengar sebutan: ${textToSpeak}`}
      title="Tekan untuk dengar audio sebutan"
      className={`inline-flex items-center gap-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold border-2 border-amber-400 shadow-sm transition-all transform hover:scale-105 active:scale-95 ${
        sizeClasses[size]
      } ${speaking ? 'ring-4 ring-amber-400 animate-pulse' : ''} ${className}`}
    >
      <span className="flex items-center justify-center w-full">
        <Volume2 size={size === 'lg' ? 24 : size === 'md' ? 20 : 16} strokeWidth={2.8} />
        {label && <span className="ml-1 pr-2 font-heading">{label}</span>}
      </span>
    </button>
  );
};
