import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TopNavBar, WoodArrowButton } from './OrganicNav';
import { TreasureChestVector, BoyVector } from './IllustratedCharacters';
import { ThreePiratesIllustration } from './StoryGraphics';
import { Check, X, Compass, Map, ShieldAlert, Award, Sparkles, Navigation, Lock } from 'lucide-react';
import { sound } from '../utils/audio';

interface TreasureGameProps {
  onBack: () => void;
  onHome?: () => void;
  onComplete: (score: number, coins: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

// 7 Missions mapped to the exact 7 storyboard questions
const TREASURE_MISSIONS = [
  {
    id: 1,
    misiTajuk: 'Misi 1: Teluk Bertenang',
    zonNama: 'Zon Kata Permintaan',
    koordinat: { x: 18, y: 72 }, // percentage on map
    ikon: '🌊',
    sentenceStart: '',
    blankText: '__________',
    sentenceEnd: 'kamu semua bertenang.',
    fullSentence: 'Minta kamu semua bertenang.',
    leftOption: { text: 'minta', isCorrect: true },
    rightOption: { text: 'tolong', isCorrect: false },
    explanation: 'Kata permintaan "Minta" sesuai untuk menenangkan kumpulan/khalayak ramai.'
  },
  {
    id: 2,
    misiTajuk: 'Misi 2: Pantai Larangan Bersih',
    zonNama: 'Zon Kata Larangan',
    koordinat: { x: 32, y: 50 },
    ikon: '🏖️',
    sentenceStart: '',
    blankText: '__________',
    sentenceEnd: 'meludah di sini.',
    fullSentence: 'Jangan meludah di sini.',
    leftOption: { text: 'jangan', isCorrect: true },
    rightOption: { text: 'harap', isCorrect: false },
    explanation: 'Kata larangan mutlak "Jangan" menegah amalan tidak bersih.'
  },
  {
    id: 3,
    misiTajuk: 'Misi 3: Gerbang Silaan Santun',
    zonNama: 'Zon Kata Silaan',
    koordinat: { x: 48, y: 68 },
    ikon: '🚪',
    sentenceStart: '',
    blankText: '_____',
    sentenceEnd: 'merupakan kata silaan.',
    fullSentence: 'Jemput merupakan kata silaan.',
    leftOption: { text: 'tolong', isCorrect: false },
    rightOption: { text: 'jemput', isCorrect: true },
    explanation: 'Kata "Jemput" ialah kata silaan (manakala "Tolong" ialah kata permintaan).'
  },
  {
    id: 4,
    misiTajuk: 'Misi 4: Lembah Harapan Damai',
    zonNama: 'Zon Kata Permintaan',
    koordinat: { x: 62, y: 44 },
    ikon: '🏞️',
    sentenceStart: '',
    blankText: '_______',
    sentenceEnd: 'kamu dapat memahami masalah saya.',
    fullSentence: 'Harap kamu dapat memahami masalah saya.',
    leftOption: { text: 'tolong', isCorrect: false },
    rightOption: { text: 'harap', isCorrect: true },
    explanation: 'Kata "Harap" menyatakan harapan dan pemahaman situasi peribadi.'
  },
  {
    id: 5,
    misiTajuk: 'Misi 5: Rimba 4 Penjuru Perintah',
    zonNama: 'Zon Pengelasan Tatabahasa',
    koordinat: { x: 74, y: 65 },
    ikon: '🌴',
    sentenceStart: '',
    blankText: 'Terdapat 4 jenis ayat perintah',
    sentenceEnd: '',
    fullSentence: 'Terdapat 4 jenis ayat perintah: Betul.',
    leftOption: { text: 'betul', isCorrect: true },
    rightOption: { text: 'salah', isCorrect: false },
    explanation: 'Pernyataan ini betul (Suruhan, Larangan, Silaan, Permintaan).'
  },
  {
    id: 6,
    misiTajuk: 'Misi 6: Dewan Keraian Diraja',
    zonNama: 'Zon Kata Silaan Jamuan',
    koordinat: { x: 80, y: 32 },
    ikon: '🏰',
    sentenceStart: '',
    blankText: '_______',
    sentenceEnd: 'hadir ke majlis saya malam ini.',
    fullSentence: 'Jemput hadir ke majlis saya malam ini.',
    leftOption: { text: 'sila', isCorrect: false },
    rightOption: { text: 'jemput', isCorrect: true },
    explanation: 'Kata silaan "Jemput" amat sinonim dengan jemputan keraian atau kenduri majlis.'
  },
  {
    id: 7,
    misiTajuk: 'Misi 7: Puncak Peti Emas Karun',
    zonNama: 'Zon Ujian Akhir Suruhan',
    koordinat: { x: 50, y: 22 },
    ikon: '👑',
    sentenceStart: '',
    blankText: '“Baca surat khabar itu sekarang” merupakan ayat perintah',
    sentenceEnd: '',
    fullSentence: '“Baca surat khabar itu sekarang” merupakan ayat perintah: Betul.',
    leftOption: { text: 'betul', isCorrect: true },
    rightOption: { text: 'salah', isCorrect: false },
    explanation: 'Ayat ini ialah contoh ayat suruhan bertatabahasa betul.'
  }
];

export const TreasureGame: React.FC<TreasureGameProps> = ({
  onBack,
  onComplete,
  soundEnabled,
  onToggleSound
}) => {
  // Stages: 'intro' | 'instructions' | 'map' | 'ready' | 'playing' | 'celebrate'
  const [stage, setStage] = useState<'intro' | 'instructions' | 'map' | 'ready' | 'playing' | 'celebrate'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [lastCompletedMissionId, setLastCompletedMissionId] = useState<number | null>(null);
  const [coinAnimating, setCoinAnimating] = useState(false);
  const [scoreEmergeAnim, setScoreEmergeAnim] = useState(true);

  // Play Pirate Adventure Module BGM on mount and restore default on unmount
  useEffect(() => {
    sound.playModuleBGM('treasure');
    return () => {
      sound.playModuleBGM('default');
    };
  }, []);

  // Animate score popping out of the mission treasure chest whenever a new question loads
  useEffect(() => {
    if (stage === 'playing') {
      setScoreEmergeAnim(true);
      const timer = setTimeout(() => {
        setScoreEmergeAnim(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentIdx, stage]);

  const curMisi = TREASURE_MISSIONS[currentIdx];

  const handleSelectCoin = (side: 'left' | 'right') => {
    if (selectedSide !== null || coinAnimating) return;

    setSelectedSide(side);
    const chosen = side === 'left' ? curMisi.leftOption : curMisi.rightOption;

    if (chosen.isCorrect) {
      sound.playCoin();
      sound.playApplause();
      setCoinAnimating(true);
      setScore((prev) => prev + 1);

      const newlyCompleted = !completedMissions.includes(curMisi.id)
        ? [...completedMissions, curMisi.id]
        : completedMissions;

      setCompletedMissions(newlyCompleted);
      setLastCompletedMissionId(curMisi.id);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }

      // Automatically return to the treasure map after coin enters chest!
      setTimeout(() => {
        setCoinAnimating(false);
        setSelectedSide(null);

        // Check if all 7 missions are done
        if (newlyCompleted.length >= TREASURE_MISSIONS.length) {
          const finalScore = score + 1;
          const earnedCoins = finalScore * 25;
          onComplete(finalScore, earnedCoins);
          sound.playFanfare();
          setStage('celebrate');
        } else {
          // Advance index to the next available uncompleted mission and return to MAP!
          const nextUncompleted = TREASURE_MISSIONS.findIndex((m) => !newlyCompleted.includes(m.id));
          const nextIdx = nextUncompleted !== -1 ? nextUncompleted : (currentIdx + 1) % TREASURE_MISSIONS.length;
          setCurrentIdx(nextIdx);
          setStage('map');
          sound.playSuccess();
        }
      }, 1400);
    } else {
      sound.playWrong();
    }
  };

  const handleNext = () => {
    // Return to map as requested: "setiap kali misi selesai, pergi ke peta semula"
    setSelectedSide(null);
    setCoinAnimating(false);
    if (completedMissions.length >= TREASURE_MISSIONS.length) {
      setStage('celebrate');
    } else {
      const nextUncompleted = TREASURE_MISSIONS.findIndex((m) => !completedMissions.includes(m.id));
      const nextIdx = nextUncompleted !== -1 ? nextUncompleted : (currentIdx + 1) % TREASURE_MISSIONS.length;
      setCurrentIdx(nextIdx);
      setStage('map');
      sound.playClick();
    }
  };

  const handleSelectMissionFromMap = (missionIndex: number) => {
    sound.playClick();
    setCurrentIdx(missionIndex);
    setSelectedSide(null);
    setCoinAnimating(false);
    setStage('playing');
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setScore(0);
    setCompletedMissions([]);
    setSelectedSide(null);
    setCoinAnimating(false);
    setStage('intro');
  };

  return (
    <div
      className="relative min-h-[580px] md:min-h-[640px] lg:min-h-[700px] w-full mx-auto rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl flex flex-col justify-between p-3 sm:p-6 transition-all duration-300"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3)), url('${
          stage === 'playing'
            ? '/assets/aistudio/halaman_soalan_game_harta_karun_95f4468a.jpg'
            : '/assets/aistudio/halaman_game_harta_karun_061d3e11.jpg'
        }')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >

      {/* Top Navbar */}
      <TopNavBar
        onExit={onBack}
        onHome={onHome || onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        title={
          stage === 'playing'
            ? curMisi.misiTajuk
            : stage === 'map'
            ? 'Peta Misi Pulau Harta Karun'
            : 'Kembara Harta Karun'
        }
      />

      {/* STAGE 1: INTRO (Pop-Up Tulisan Tajuk & Deskripsi Permainan) */}
      {stage === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center my-4 text-center animate-fade-in z-10 px-2 sm:px-4">
          {/* 3D Pop-Up Card Frame */}
          <div className="relative max-w-2xl w-full p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#fffbeb] via-[#fef3c7] to-[#fde68a] border-4 border-[#b45309] shadow-[0_12px_0_#78350f,0_20px_35px_rgba(0,0,0,0.35)] transform hover:scale-[1.01] transition-transform">
            {/* Pop-Up Header Tag */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 border-2 border-amber-300 text-amber-950 font-heading font-black text-xs sm:text-sm tracking-wider uppercase shadow-md animate-bounce">
              <span>🗺️</span>
              <span>PENGEMBARAAN 7 MISI PULAU AYAT PERINTAH</span>
              <span>✨</span>
            </div>

            {/* 3D Popped-Up Giant Title */}
            <div className="relative py-2 my-1">
              <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#78350f] tracking-wider uppercase drop-shadow-[0_4px_6px_rgba(180,83,9,0.4)]">
                GAME KEMBARA HARTA KARUN
              </h1>
            </div>

            {/* 3D Popped-Up Description Box */}
            <div className="my-4 p-4 sm:p-5 rounded-2xl bg-white/90 border-2 border-amber-400 shadow-inner">
              <p className="text-amber-950 text-base sm:text-xl font-heading font-bold leading-relaxed">
                Jelajahi peta pulau rahsia mengikut misi berperingkat untuk mengumpul semua syiling emas ke dalam peti lanun!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <button
                onClick={() => {
                  sound.playSuccess();
                  setStage('map');
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-heading font-black text-lg shadow-[0_6px_0_#92400e] active:translate-y-1 transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Compass size={22} className="animate-spin-slow" />
                <span>Buka Peta Misi 🗺️</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setStage('instructions');
                }}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-100 text-[#78350f] font-heading font-black text-base border-3 border-amber-400 shadow-[0_4px_0_#d97706] active:translate-y-1 transition-all cursor-pointer"
              >
                Arahan Permainan 📜
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: ARAHAN (Page 36 - Clean without caricatures) */}
      {stage === 'instructions' && (
        <div className="flex-1 flex flex-col items-center justify-center my-4 animate-fade-in z-10 px-2 sm:px-4">
          <div className="relative max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#fffbeb] border-4 border-amber-500 shadow-[0_10px_0_#92400e,0_16px_28px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-amber-300">
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#78350f] tracking-wide">
                ARAHAN PERMAINAN
              </h2>
              <div className="flex -space-x-2">
                <span className="text-3xl">🪙</span>
                <span className="text-3xl">🪙</span>
              </div>
            </div>

            <div className="space-y-4 text-base sm:text-lg font-medium text-slate-800">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-sm shrink-0 shadow">1</span>
                <p>Jelajahi peta pulau dari <strong>Misi 1 hingga Misi 7</strong> untuk membuka peti rahsia agung.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-sm shrink-0 shadow">2</span>
                <p>Teliti soalan ayat perintah yang dipaparkan pada skrin misi.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-sm shrink-0 shadow">3</span>
                <p>
                  Pilih syiling emas jawapan yang betul. Syiling tepat akan keluar tanda <strong className="text-emerald-600 font-bold">✓</strong> dan masuk ke dalam peti emas!
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center pt-3 border-t border-amber-200">
              <button
                onClick={() => setStage('intro')}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-heading font-bold text-xs shadow"
              >
                Kembali
              </button>
              <button
                onClick={() => setStage('map')}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-heading font-black text-sm shadow-[0_3px_0_#92400e] active:translate-y-0.5"
              >
                Lihat Peta Pulau 🗺️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: INTERACTIVE TREASURE MAP (Peta Pengembaraan Pulau Karun) */}
      {stage === 'map' && (
        <div className="flex-1 flex flex-col justify-between my-2 animate-fade-in z-10">
          <div className="flex items-center justify-between px-2 mb-1">
            <div>
              <h3 className="font-heading font-black text-lg text-[#78350f] flex items-center gap-1.5">
                <Compass size={18} className="text-amber-700 animate-spin-slow" /> Peta Pulau Harta Karun (7 Misi)
              </h3>
              <p className="text-xs text-amber-900 font-semibold">
                Selesaikan setiap perhentian misi untuk membuka Peti Emas Agung di Puncak Karun!
              </p>
            </div>
            <div className="bg-amber-200/80 px-3 py-1 rounded-xl text-xs font-heading font-black text-amber-950 border border-amber-400">
              Misi Selesai: {completedMissions.length} / 7
            </div>
          </div>

          {/* Mission Completion Toast when returning to the map */}
          {lastCompletedMissionId && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-2xl shadow-md flex items-center justify-between mb-1 animate-bounce-short border-2 border-emerald-300">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <div>
                  <span className="text-xs sm:text-sm font-heading font-black block">
                    Tahniah! Misi {lastCompletedMissionId} Berjaya Selesai & Syiling Masuk ke Peti!
                  </span>
                  <span className="text-[11px] text-emerald-100 font-semibold block">
                    Pilih ikon misi seterusnya pada peta untuk meneruskan pengembaraan.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setLastCompletedMissionId(null)}
                className="text-white hover:text-amber-200 text-xs font-bold px-2 py-1 rounded-lg bg-black/20 shrink-0 ml-2"
              >
                ✕ Tutup
              </button>
            </div>
          )}

          {/* Antique Parchment Island Map Canvas (Expansive Landscape on Desktop, Ergonomic on Phone) */}
          <div className="relative my-2 h-72 sm:h-80 md:h-[420px] lg:h-[480px] xl:h-[520px] w-full rounded-3xl overflow-hidden border-4 border-[#854d0e] shadow-2xl bg-[#fed7aa]/50 bg-gradient-to-br from-[#fef08a]/60 via-[#ffedd5] to-[#fde047]/40 flex items-center justify-center">
            {/* Map Terrain SVGs: Sea water, island contours, dotted lines, mountains */}
            <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full pointer-events-none select-none">
              {/* Island contour border */}
              <path
                d="M80 320 C100 220 180 180 250 160 C320 140 400 80 500 70 C620 60 720 120 740 220 C760 300 680 380 560 410 C420 430 300 400 200 410 C120 415 70 380 80 320 Z"
                fill="#fde68a"
                stroke="#b45309"
                strokeWidth="4"
                strokeDasharray="6,4"
              />

              {/* Shading beaches */}
              <path
                d="M100 310 C120 230 190 190 260 175 C330 155 410 100 500 90 C600 80 700 130 720 220 C740 290 660 360 550 390 C430 410 320 380 220 390 C140 395 90 360 100 310 Z"
                fill="#fef3c7"
              />

              {/* Mountains & Palm Trees illustrations on map */}
              <polygon points="380,240 410,180 440,240" fill="#92400e" opacity="0.3" />
              <polygon points="420,250 450,170 480,250" fill="#78350f" opacity="0.4" />
              <polygon points="460,255 490,190 520,255" fill="#92400e" opacity="0.3" />

              {/* Compass Rose */}
              <g transform="translate(110, 90)">
                <circle cx="0" cy="0" r="32" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="3,3" />
                <polygon points="0,-30 6,-8 0,0 -6,-8" fill="#b91c1c" />
                <polygon points="0,30 6,8 0,0 -6,8" fill="#78350f" />
                <polygon points="30,0 8,6 0,0 8,-6" fill="#78350f" />
                <polygon points="-30,0 -8,6 0,0 -8,-6" fill="#78350f" />
                <text x="-4" y="-35" fill="#b91c1c" fontSize="12" fontWeight="bold">U</text>
              </g>

              {/* Sea Waves & Pirate Ship icon */}
              <text x="60" y="410" fill="#0284c7" fontSize="24">⛵</text>
              <text x="680" y="380" fill="#0284c7" fontSize="24">🌊</text>
              <text x="700" y="80" fill="#78350f" fontSize="20">🦜</text>

              {/* Dotted Trail connecting missions 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 */}
              <path
                d="M144 324 Q200 240 256 225 Q320 280 384 306 Q440 220 496 198 Q540 270 592 292 Q620 200 640 144 Q500 80 400 99"
                fill="none"
                stroke="#b91c1c"
                strokeWidth="3.5"
                strokeDasharray="6,6"
              />

              {/* Big Red 'X' for Final Mission 7 */}
              <text x="390" y="110" fill="#dc2626" fontSize="28" fontWeight="black">✕</text>
            </svg>

            {/* Interactive Mission Pins positioned along the map trail */}
            {TREASURE_MISSIONS.map((m, idx) => {
              const isCleared = completedMissions.includes(m.id);
              const isCurrent = currentIdx === idx;
              const isUnlocked = idx === 0 || completedMissions.includes(TREASURE_MISSIONS[idx - 1].id) || isCleared;

              return (
                <div
                  key={m.id}
                  style={{ left: `${m.koordinat.x}%`, top: `${m.koordinat.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <button
                    onClick={() => isUnlocked && handleSelectMissionFromMap(idx)}
                    disabled={!isUnlocked}
                    aria-label={`Misi ${m.id}: ${m.misiTajuk}`}
                    className={`relative p-1.5 rounded-full border-3 transition-all transform hover:scale-125 active:scale-95 flex items-center justify-center ${
                      isCleared
                        ? 'bg-emerald-500 border-white text-white shadow-[0_0_12px_rgba(16,185,129,0.9)]'
                        : isCurrent
                        ? 'bg-amber-400 border-red-600 text-slate-900 shadow-[0_0_15px_rgba(239,68,68,0.9)] animate-bounce ring-4 ring-red-400'
                        : isUnlocked
                        ? 'bg-amber-300 border-amber-600 text-amber-950 shadow-md'
                        : 'bg-slate-300 border-slate-400 text-slate-500 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-base sm:text-lg">{m.ikon}</span>

                    {/* Mission Number badge */}
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-black text-[10px] flex items-center justify-center border border-white">
                      {isCleared ? '✓' : m.id}
                    </span>
                  </button>

                  {/* Tooltip on Hover */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none whitespace-nowrap z-30">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold shadow-lg">
                      {m.misiTajuk} {isCleared ? '(Selesai)' : isCurrent ? '(Misi Aktif)' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map bottom bar: Jump to current active mission */}
          <div className="flex items-center justify-between px-2 pt-2">
            <button
              onClick={() => setStage('instructions')}
              className="px-4 py-2 rounded-xl bg-white text-slate-700 font-heading font-bold text-xs border border-amber-300"
            >
              Lihat Arahan
            </button>

            <button
              onClick={() => {
                sound.playSuccess();
                setStage('playing');
              }}
              className="px-8 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-heading font-black text-sm shadow-[0_4px_0_#7f1d1d] active:translate-y-1 transition-all transform hover:scale-105 flex items-center gap-1.5"
            >
              <Navigation size={16} />
              <span>Masuk ke {curMisi.misiTajuk} ⚔️</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: PLAYING MISSION (Exact Storyboard Question Content with Mission & Map integration) */}
      {stage === 'playing' && (
        <div className="flex-1 flex flex-col justify-between my-2 animate-fade-in z-10">
          {/* Mission Top Bar with Map button */}
          <div className="flex items-center justify-between max-w-xl mx-auto w-full mb-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-heading font-black text-xs border border-amber-400">
                {curMisi.misiTajuk}
              </span>
              <span className="text-[11px] text-amber-800 font-semibold hidden sm:inline">
                {curMisi.zonNama}
              </span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setStage('map');
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-heading font-bold text-xs shadow-sm active:scale-95"
            >
              <Map size={14} />
              <span>Peta Misi 🗺️</span>
            </button>
          </div>

          {/* Question Text Box matching Storyboard Page 38-44 */}
          <div className="bg-white/95 p-4 rounded-3xl border-3 border-amber-400 shadow-md max-w-xl mx-auto w-full text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg sm:text-2xl font-heading font-bold text-slate-800">
                {curMisi.sentenceStart && <span>{curMisi.sentenceStart} </span>}
                <span className="border-b-2 border-amber-600 px-2 text-amber-900 font-extrabold">
                  {selectedSide && (selectedSide === 'left' ? curMisi.leftOption.isCorrect : curMisi.rightOption.isCorrect)
                    ? (selectedSide === 'left' ? curMisi.leftOption.text : curMisi.rightOption.text)
                    : curMisi.blankText}
                </span>
                {curMisi.sentenceEnd && <span> {curMisi.sentenceEnd}</span>}
              </p>
            </div>

            {selectedSide !== null && (
              <p className="mt-2 text-xs sm:text-sm font-semibold text-amber-900 animate-fade-in">
                {curMisi.explanation}
              </p>
            )}
          </div>

          {/* Treasure Arena: Left Coin, Open Chest in Center, Right Coin */}
          <div className="relative my-4 flex items-center justify-center gap-4 sm:gap-12">
            {/* Left Coin */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleSelectCoin('left')}
                disabled={selectedSide !== null}
                aria-label={`Pilih syiling emas: ${curMisi.leftOption.text}`}
                className={`relative w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 border-4 border-amber-200 shadow-xl flex items-center justify-center cursor-pointer transition-all transform hover:scale-105 active:scale-95 ${
                  selectedSide === 'left'
                    ? curMisi.leftOption.isCorrect
                      ? 'ring-8 ring-emerald-400 scale-105 animate-pulse'
                      : 'ring-8 ring-rose-500'
                    : ''
                } ${coinAnimating && selectedSide === 'left' ? 'translate-x-12 translate-y-6 opacity-0 transition-all duration-1000' : ''}`}
              >
                {/* Inner coin ring */}
                <div className="w-5/6 h-5/6 rounded-full border-2 border-amber-600/40 flex items-center justify-center bg-gradient-to-t from-amber-500 to-amber-300">
                  <span className="text-amber-950 font-heading font-black text-xl sm:text-2xl text-center px-1 drop-shadow-sm">
                    {curMisi.leftOption.text}
                  </span>
                </div>

                {/* Status Indicator Icon overlay */}
                {selectedSide === 'left' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                    {curMisi.leftOption.isCorrect ? (
                      <span className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <Check size={36} strokeWidth={4} />
                      </span>
                    ) : (
                      <span className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <X size={36} strokeWidth={4} />
                      </span>
                    )}
                  </div>
                )}
              </button>
            </div>

            {/* Open Treasure Chest in the Middle with Student Score Emerging Out of It */}
            <div className="shrink-0 flex flex-col items-center relative">
              {/* Score emerging/floating out of the chest mouth on each question */}
              <div
                className={`absolute -top-12 sm:-top-14 z-30 transition-all duration-700 transform flex flex-col items-center pointer-events-none ${
                  scoreEmergeAnim
                    ? 'scale-110 -translate-y-3 drop-shadow-[0_8px_16px_rgba(217,119,6,0.8)]'
                    : 'scale-100 translate-y-0 opacity-95'
                }`}
              >
                <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-2 border-amber-600 shadow-xl flex items-center gap-1.5 whitespace-nowrap animate-pulse">
                  <span className="text-base sm:text-lg">🪙</span>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[9px] uppercase font-mono font-extrabold text-amber-900 tracking-wider">
                      Markah Peti
                    </span>
                    <span className="text-xs sm:text-sm font-heading font-black text-amber-950">
                      {score} / 7 Markah
                    </span>
                  </div>
                  <Sparkles size={15} className="text-amber-800 animate-spin-slow" />
                </div>
                {/* Pointer arrow pointing down into the chest mouth */}
                <div className="w-2.5 h-2.5 bg-amber-400 rotate-45 -mt-1 border-r border-b border-amber-600 shadow-xs" />
              </div>

              {/* Floating +1 Markah Bonus Burst when answered correctly */}
              {coinAnimating && (
                <div className="absolute -top-24 z-40 animate-bounce duration-700 flex flex-col items-center pointer-events-none">
                  <div className="px-4 py-1.5 rounded-full bg-emerald-500 border-2 border-white text-white font-heading font-black text-base shadow-[0_0_20px_rgba(16,185,129,0.9)] flex items-center gap-1">
                    <span>✨</span>
                    <span>+1 MARKAH EMAS!</span>
                    <span>🪙</span>
                  </div>
                </div>
              )}

              <TreasureChestVector
                isOpen={true}
                size={140}
                onClick={() => sound.playCoin()}
              />
              <span className="text-xs text-[#78350f] font-bold mt-1">Peti Emas Misi</span>
            </div>

            {/* Right Coin */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleSelectCoin('right')}
                disabled={selectedSide !== null}
                aria-label={`Pilih syiling emas: ${curMisi.rightOption.text}`}
                className={`relative w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 border-4 border-amber-200 shadow-xl flex items-center justify-center cursor-pointer transition-all transform hover:scale-105 active:scale-95 ${
                  selectedSide === 'right'
                    ? curMisi.rightOption.isCorrect
                      ? 'ring-8 ring-emerald-400 scale-105 animate-pulse'
                      : 'ring-8 ring-rose-500'
                    : ''
                } ${coinAnimating && selectedSide === 'right' ? '-translate-x-12 translate-y-6 opacity-0 transition-all duration-1000' : ''}`}
              >
                {/* Inner coin ring */}
                <div className="w-5/6 h-5/6 rounded-full border-2 border-amber-600/40 flex items-center justify-center bg-gradient-to-t from-amber-500 to-amber-300">
                  <span className="text-amber-950 font-heading font-black text-xl sm:text-2xl text-center px-1 drop-shadow-sm">
                    {curMisi.rightOption.text}
                  </span>
                </div>

                {/* Status Indicator Icon overlay */}
                {selectedSide === 'right' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                    {curMisi.rightOption.isCorrect ? (
                      <span className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <Check size={36} strokeWidth={4} />
                      </span>
                    ) : (
                      <span className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <X size={36} strokeWidth={4} />
                      </span>
                    )}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 5: CELEBRATE (Page 45) */}
      {stage === 'celebrate' && (
        <div className="flex-1 flex flex-col items-center justify-center my-4 text-center animate-fade-in z-10">
          <div className="max-w-xl w-full bg-white/95 p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-2">
              Tahniah murid-murid!
            </h2>
            <p className="text-amber-800 font-bold text-base mb-3">
              Semua 7 Misi Pulau Harta Karun telah berjaya anda takluki!
            </p>

            <div className="flex justify-center mb-3">
              <TreasureChestVector isOpen={true} size={150} />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-4">
              <p className="text-sm text-slate-700">
                Skor Pengembaraan: <strong className="text-amber-700 text-xl font-black">{score} / {TREASURE_MISSIONS.length}</strong>
              </p>
              <p className="text-xs text-emerald-700 font-bold mt-1">
                +{score * 25} Kancil Coins berjaya disimpan ke peti PBS anda! 🪙✨
              </p>
            </div>

            {/* 3 Pirate children celebration matching storyboard Page 45 */}
            <div className="flex items-center justify-center mb-6">
              <ThreePiratesIllustration size={320} />
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-heading font-bold shadow-md transition-all active:scale-95"
              >
                Ulang Pengembaraan
              </button>
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-heading font-bold shadow-md transition-all active:scale-95"
              >
                Kembali ke Halaman Kuiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Wooden Navigation */}
      <div className="flex items-center justify-between w-full pt-2 z-10">
        <WoodArrowButton
          direction="prev"
          onClick={() => {
            if (stage === 'instructions') setStage('intro');
            else if (stage === 'map') setStage('intro');
            else if (stage === 'playing') {
              if (currentIdx > 0) {
                setCurrentIdx((prev) => prev - 1);
                setSelectedSide(null);
              } else {
                setStage('map');
              }
            } else if (stage === 'celebrate') {
              setStage('playing');
            }
          }}
          disabled={stage === 'intro'}
        />

        <div className="text-xs font-bold text-[#78350f] bg-amber-200/90 px-4 py-1.5 rounded-full shadow-sm">
          {stage === 'intro' && 'Muka 1: Pengenalan'}
          {stage === 'instructions' && 'Arahan'}
          {stage === 'map' && 'Peta Pulau (7 Misi)'}
          {stage === 'playing' && `${curMisi.misiTajuk} (${currentIdx + 1}/7)`}
          {stage === 'celebrate' && 'Tamat & Tahniah!'}
        </div>

        <WoodArrowButton
          direction="next"
          onClick={() => {
            if (stage === 'intro') setStage('map');
            else if (stage === 'instructions') setStage('map');
            else if (stage === 'map') setStage('playing');
            else if (stage === 'playing') {
              handleNext();
            } else if (stage === 'celebrate') {
              onBack();
            }
          }}
          label={stage === 'playing' ? (selectedSide !== null ? 'Misi Seterusnya' : undefined) : undefined}
        />
      </div>
    </div>
  );
};
