import React from 'react';
import { Home, X, HelpCircle, Volume2, VolumeX, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { sound } from '../utils/audio';

// Top Bar with X, Home, Help, and Dual Audio Toggle Popover
export const TopNavBar: React.FC<{
  onHome?: () => void;
  onExit?: () => void;
  onHelp?: () => void;
  soundEnabled: boolean;
  onToggleSound?: () => void;
  title?: string;
  className?: string;
}> = ({ onHome, onExit, onHelp, soundEnabled, onToggleSound, title, className = '' }) => {
  const [showAudioMenu, setShowAudioMenu] = React.useState(false);
  const [bgmOn, setBgmOn] = React.useState(sound.bgmEnabled);
  const [sfxOn, setSfxOn] = React.useState(sound.sfxEnabled);

  React.useEffect(() => {
    const unsub = sound.onAudioStateChange((st) => {
      setBgmOn(st.bgmEnabled);
      setSfxOn(st.sfxEnabled);
    });
    return () => unsub();
  }, []);

  const handleToggleBgm = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const next = sound.toggleBGM();
    setBgmOn(next);
    if (onToggleSound) onToggleSound();
  };

  const handleToggleSfx = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const next = sound.toggleSFX();
    setSfxOn(next);
    if (onToggleSound) onToggleSound();
  };

  return (
    <div className={`relative flex items-center justify-between w-full px-4 py-2 z-30 ${className}`}>
      {/* Left side actions */}
      <div className="flex items-center gap-2">
        {onExit && (
          <button
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            aria-label="Kembali"
            title="Kembali"
            className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-lg border-2 border-white transition-all transform hover:rotate-6 cursor-pointer"
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
            aria-label="Laman Utama"
            title="Laman Utama"
            className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-lg border-2 border-white transition-all transform hover:-rotate-6 cursor-pointer"
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
      <div className="flex items-center gap-2 relative">
        {/* Audio Toggle Button Opening 2 Options */}
        <button
          onClick={() => {
            sound.playClick();
            setShowAudioMenu((prev) => !prev);
          }}
          aria-label="Pilihan Bunyi & Muzik"
          title="Tekan untuk memilih tutup lagu latar atau tutup kesan bunyi"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg border-2 border-white transition-all text-xs font-heading font-black cursor-pointer ${
            bgmOn || sfxOn
              ? 'bg-amber-400 text-amber-950 hover:bg-amber-500'
              : 'bg-slate-300 text-slate-600 hover:bg-slate-400'
          }`}
        >
          {bgmOn ? (
            <Volume2 size={20} strokeWidth={2.8} />
          ) : sfxOn ? (
            <Volume2 size={20} strokeWidth={2.8} className="text-amber-800" />
          ) : (
            <VolumeX size={20} strokeWidth={2.8} />
          )}
          <span className="hidden sm:inline">
            {bgmOn ? '🎵 Muzik Aktif' : sfxOn ? '🔊 Bunyi Sahaja' : '🔇 Bisu'}
          </span>
        </button>

        {/* 2 Options Popover Menu */}
        {showAudioMenu && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setShowAudioMenu(false)}
            />
            <div className="absolute top-12 right-0 z-50 w-72 p-4 rounded-2xl bg-amber-50 border-3 border-amber-600 shadow-2xl animate-fade-in text-slate-900">
              <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-amber-200">
                <span className="font-heading font-black text-sm text-[#78350f]">
                  Tetapan Bunyi & Muzik
                </span>
                <button
                  onClick={() => setShowAudioMenu(false)}
                  className="w-6 h-6 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {/* Option 1: Lagu Latar (BGM) */}
                <div className="p-2.5 rounded-xl bg-white border-2 border-amber-200 shadow-xs flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-heading font-black text-slate-900 flex items-center gap-1">
                      <span>🎵</span>
                      <span>Lagu Latar</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      Muzik santun permainan
                    </span>
                  </div>
                  <button
                    onClick={handleToggleBgm}
                    className={`px-3 py-1.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                      bgmOn
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    {bgmOn ? 'Tutup Lagu' : 'Buka Lagu'}
                  </button>
                </div>

                {/* Option 2: Kesan Bunyi (SFX) */}
                <div className="p-2.5 rounded-xl bg-white border-2 border-amber-200 shadow-xs flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-heading font-black text-slate-900 flex items-center gap-1">
                      <span>🔊</span>
                      <span>Kesan Bunyi</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      Klik butang dan syiling
                    </span>
                  </div>
                  <button
                    onClick={handleToggleSfx}
                    className={`px-3 py-1.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                      sfxOn
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    {sfxOn ? 'Tutup Bunyi' : 'Buka Bunyi'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowAudioMenu(false)}
                className="mt-3 w-full py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-heading font-bold text-xs shadow-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </>
        )}

        {onHelp && (
          <button
            onClick={() => {
              sound.playClick();
              onHelp();
            }}
            aria-label="Bantuan dan Makna Simbol"
            title="Bantuan dan Makna Simbol"
            className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white flex items-center justify-center shadow-lg border-2 border-white transition-all transform hover:scale-105 cursor-pointer"
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
