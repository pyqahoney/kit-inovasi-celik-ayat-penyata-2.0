import React, { useState, useEffect } from 'react';
import {
  TopNavBar,
  WoodArrowButton,
  GoldenPlayButton,
  AudioSpeakerButton
} from './components/OrganicNav';
import {
  CikguVector,
  BoyVector,
  FrogVector,
  CatVector,
  BunnyVector,
  TreasureChestVector
} from './components/IllustratedCharacters';
import {
  CuteSunVector,
  BlueBirdVector,
  ButterflyVector,
  FoliageForeground
} from './components/StoryGraphics';
import { FrogGame } from './components/FrogGame';
import { TreasureGame } from './components/TreasureGame';
import { MarioGame } from './components/MarioGame';
import { PacmanGame } from './components/PacmanGame';
import { LatihDiri } from './components/LatihDiri';
import { NotaDanVideo } from './components/NotaDanVideo';
import { LembaranKerja } from './components/LembaranKerja';
import { ARModule } from './components/ARModule';
import { PapanPemukaPBS } from './components/PapanPemukaPBS';
import { DokumentasiPembangun } from './components/DokumentasiPembangun';
import { KatakLompatLogo, KembaraHartaKarunLogo, WiraMarioLogo, KuasaPacmanLogo } from './components/GameLogoBadges';
import { INITIAL_STUDENTS, hitungTahapPenguasaan } from './data/learningContent';
import { StudentPBSRecord } from './types';
import { sound, CIKGU_FRESHCY_AUDIOS } from './utils/audio';
import {
  TeacherStandee,
  TeacherTrioShowcase,
  TeacherAvatar,
  TEACHER_PROFILES,
  TeacherId
} from './components/TeacherCharacters';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Camera,
  Layers,
  GraduationCap,
  Smile,
  Frown,
  Home,
  X,
  Volume2,
  CheckCircle2,
  Lock,
  Key,
  Globe,
  LogOut,
  Heart,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  // Screen state matching storyboard flow:
  // 'welcome' (Page 1)
  // 'emotion' (Page 2)
  // 'symbols' (Page 3)
  // 'home' (Page 4)
  // 'intro' (Page 5 & 6)
  // 'learn_menu' (Page 7)
  // 'notes' (Pages 8 - 14)
  // 'video' (Pages 15 - 16)
  // 'drill' (Pages 17 - 23)
  // 'quiz_menu' (Page 24)
  // 'game_frog' (Pages 25 - 34)
  // 'game_treasure' (Pages 35 - 45)
  // 'ar_scanner' (AR Camera Module)
  // 'trialogical_studio' (Artifact Creation)
  // 'pbs_dashboard' (Teacher PBS Dashboard)
  // 'dev_docs' (Developer Architecture & Code)
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');
  const [introSubPage, setIntroSubPage] = useState<1 | 2>(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // User Role Access: 'student' | 'teacher' | 'guest'
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'guest'>(() => {
    const saved = localStorage.getItem('celik_perintah_user_role');
    return (saved as 'student' | 'teacher' | 'guest') || 'student';
  });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showTeacherAuthModal, setShowTeacherAuthModal] = useState(false);
  const [teacherPasswordInput, setTeacherPasswordInput] = useState('');
  const [teacherAuthError, setTeacherAuthError] = useState('');

  // Active Teacher Guide: 'syafiqah' (Baju Kurung Bertudung) | 'aaron' (Baju Kemeja) | 'freshcy' (Baju Kurung)
  const [selectedTeacherId, setSelectedTeacherId] = useState<TeacherId>(() => {
    const saved = localStorage.getItem('celik_perintah_teacher_id');
    return (saved as TeacherId) || 'syafiqah';
  });
  const [showTeacherTrioModal, setShowTeacherTrioModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('celik_perintah_teacher_id', selectedTeacherId);
  }, [selectedTeacherId]);

  const handleSelectTeacher = (id: TeacherId) => {
    setSelectedTeacherId(id);
    sound.playSuccess();
  };

  useEffect(() => {
    localStorage.setItem('celik_perintah_user_role', userRole);
  }, [userRole]);

  // Kata Semangat Emosi state
  const [encouragementData, setEncouragementData] = useState<{
    type: 'happy' | 'thoughtful';
    tajuk: string;
    mesej: string;
    mutiaraKata: string;
    speechText: string;
  } | null>(null);

  const handleTeacherAuthSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = teacherPasswordInput.trim().toLowerCase();
    if (cleaned === 'guru123' || cleaned === 'cikgu2026' || cleaned === 'guru' || cleaned === 'admin') {
      sound.playFanfare();
      setUserRole('teacher');
      setShowTeacherAuthModal(false);
      setTeacherPasswordInput('');
      setTeacherAuthError('');
      if (currentScreen === 'welcome') {
        setCurrentScreen('home');
      }
    } else {
      sound.playWrong();
      setTeacherAuthError('Kata laluan tidak tepat. Sila gunakan kata laluan guru (Petunjuk: guru123 atau cikgu2026)');
    }
  };

  const handleEmotionSelect = (type: 'happy' | 'thoughtful') => {
    const teacherName = TEACHER_PROFILES[selectedTeacherId].nama;
    if (type === 'happy') {
      sound.playSuccess();
      const textToSpeak = `Hebat! Awak ceria dan pintar. Jom terokai ayat perintah bersama ${teacherName}!`;
      setEncouragementData({
        type: 'happy',
        tajuk: 'Hebat & Ceria! 🌟',
        mesej: '“Keceriaanmu membakar semangat untuk berjaya hari ini!”',
        mutiaraKata: 'Awak murid yang pintar dan bersemangat!',
        speechText: textToSpeak
      });
    } else {
      sound.playTone(400, 'sine', 0.2);
      const textToSpeak = `Awak boleh! Jangan risau sahabat kecil, ${teacherName} sentiasa ada bersamamu.`;
      setEncouragementData({
        type: 'thoughtful',
        tajuk: 'Awak Boleh! 🌈',
        mesej: '“Tarik nafas dan senyum, Cikgu sedia membantumu!”',
        mutiaraKata: 'Setiap langkah kecil membawamu ke puncak kejayaan.',
        speechText: textToSpeak
      });
    }
  };

  // Student progress state
  const [students, setStudents] = useState<StudentPBSRecord[]>(() => {
    const saved = localStorage.getItem('celik_perintah_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: StudentPBSRecord) => ({
            ...s,
            kelas: '5 Bestari'
          }));
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_STUDENTS;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>('std-101');

  // Save student updates
  useEffect(() => {
    localStorage.setItem('celik_perintah_students', JSON.stringify(students));
  }, [students]);

  const activeStudent =
    students.find((s) => s.id === currentStudentId) || students[0];

  // Synchronize Background Music with current screen
  // Plays the Nintendo Cafe song on all kit screens (with loop & audio ducking),
  // but stops it and switches to game-specific BGM when entering games,
  // and resumes it when leaving games.
  useEffect(() => {
    if (!soundEnabled) {
      sound.stopBGM();
      return;
    }

    if (currentScreen === 'game_mario') {
      sound.playModuleBGM('mario');
    } else if (currentScreen === 'game_frog') {
      sound.playModuleBGM('frog');
    } else if (currentScreen === 'game_treasure') {
      sound.playModuleBGM('treasure');
    } else if (currentScreen === 'game_pacman') {
      sound.playModuleBGM('pacman');
    } else if (currentScreen === 'quiz_menu') {
      // Halaman kuiz dan permainan dikecualikan daripada lagu latar relaxing nintendo
      sound.stopBGM();
    } else {
      // Loop the Nintendo Cafe background song on all other screens
      sound.playModuleBGM('default');
    }
  }, [currentScreen, soundEnabled]);

  // Global button click SFX and cute background music integration on mount
  useEffect(() => {
    // 1. Universal click sound on every button or interactive element
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest(
        'button, [role="button"], a[href], input[type="button"], input[type="submit"], input[type="radio"], input[type="checkbox"], label, select, summary'
      );
      if (clickable) {
        sound.playClick();
      }
    };

    // 2. Start cute BGM on user's first interaction (satisfying browser autoplay policy)
    const handleFirstInteraction = () => {
      if (sound.enabled) {
        sound.playModuleBGM('default');
      }
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    // Also attempt immediate autoplay
    sound.playModuleBGM('default');

    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      sound.stopBGM();
      sound.stopSpeech();
    };
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (!next) {
      sound.stopSpeech();
      sound.stopBGM();
    } else {
      if (currentScreen === 'game_mario') sound.playModuleBGM('mario');
      else if (currentScreen === 'game_frog') sound.playModuleBGM('frog');
      else if (currentScreen === 'game_treasure') sound.playModuleBGM('treasure');
      else if (currentScreen === 'game_pacman') sound.playModuleBGM('pacman');
      else sound.playModuleBGM('default');
    }
  };

  // Gamification reward helper
  const handleAwardStudent = (
    coinsToAdd: number,
    completedGameStage?: number,
    quizScorePercent?: number,
    newBadge?: string,
    gameStats?: { game: 'katak' | 'hartaKarun' | 'mario' | 'pacman'; betul: number; salah: number }
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== currentStudentId) return s;

        const updatedCoins = s.syilingTerkumpul + coinsToAdd;
        const updatedGameStage = completedGameStage
          ? Math.max(s.tahapPermainanSelesai, completedGameStage)
          : s.tahapPermainanSelesai;
        const updatedQuizScore = quizScorePercent
          ? Math.max(s.skorKuiz, quizScorePercent)
          : s.skorKuiz;
        const updatedBadges =
          newBadge && !s.lencana.includes(newBadge)
            ? [...s.lencana, newBadge]
            : s.lencana;

        const currentSoalan = s.soalanPermainan || {
          katak: { betul: 0, salah: 0 },
          hartaKarun: { betul: 0, salah: 0 },
          mario: { betul: 0, salah: 0 },
          pacman: { betul: 0, salah: 0 }
        };

        const updatedSoalanPermainan = gameStats
          ? {
              ...currentSoalan,
              [gameStats.game]: {
                betul: Math.max(currentSoalan[gameStats.game]?.betul || 0, gameStats.betul),
                salah: gameStats.salah
              }
            }
          : currentSoalan;

        const newTP = hitungTahapPenguasaan(
          updatedQuizScore,
          updatedGameStage,
          s.artifakTrialogikalDicipta,
          s.sesiARSelesai
        );

        return {
          ...s,
          syilingTerkumpul: updatedCoins,
          tahapPermainanSelesai: updatedGameStage,
          skorKuiz: updatedQuizScore,
          lencana: updatedBadges,
          tahapPenguasaan: newTP,
          soalanPermainan: updatedSoalanPermainan,
          tarikhKemasKini: '2026-10-21'
        };
      })
    );
  };

  // Handle AR session complete
  const handleARSessionDone = () => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== currentStudentId) return s;
        const updatedAR = s.sesiARSelesai + 1;
        const updatedCoins = s.syilingTerkumpul + 25;
        const newTP = hitungTahapPenguasaan(
          s.skorKuiz,
          s.tahapPermainanSelesai,
          s.artifakTrialogikalDicipta,
          updatedAR
        );
        return {
          ...s,
          sesiARSelesai: updatedAR,
          syilingTerkumpul: updatedCoins,
          tahapPenguasaan: newTP
        };
      })
    );
  };


  const isLandscapeWide = [
    'welcome',
    'emotion',
    'symbols',
    'home',
    'game_mario',
    'game_pacman',
    'game_treasure',
    'game_frog',
    'theater',
    'pbs_dashboard'
  ].includes(currentScreen);

  const containerMaxWidth = isLandscapeWide
    ? 'w-full max-w-md md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto'
    : 'w-full max-w-md sm:max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto';

  return (
    <div className="min-h-screen bg-[#f7ede2] text-slate-900 py-3 px-2 sm:px-4 flex flex-col justify-between selection:bg-amber-300">
      {/* Top Status Bar: Child/Role Info, Coins & Role Access */}
      <header className={`${containerMaxWidth} flex items-center justify-between pb-2 mb-1 px-3`}>
        {/* Profile / Role Chip - Clickable to switch role in-place without exiting */}
        <div className="flex items-center gap-2">
          {userRole === 'teacher' ? (
            <button
              onClick={() => {
                sound.playClick();
                setShowRoleModal(true);
              }}
              className="flex items-center gap-2 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-500 rounded-2xl shadow-xs transition-all text-left cursor-pointer group"
              title="Peranan Semasa: Guru (Tekan untuk tukar peranan)"
            >
              <TeacherAvatar teacherId={selectedTeacherId} size="sm" withBorder={false} />
              <div>
                <span className="text-xs font-heading font-black text-emerald-950 block leading-tight">
                  Mod Guru ({TEACHER_PROFILES[selectedTeacherId].nama})
                </span>
                <span className="text-[10px] text-emerald-800 font-bold block">
                  Akses Pentaksiran & Analisis PBS · Tukar ▼
                </span>
              </div>
            </button>
          ) : userRole === 'guest' ? (
            <button
              onClick={() => {
                sound.playClick();
                setShowRoleModal(true);
              }}
              className="flex items-center gap-2 px-3 py-1 bg-sky-100 hover:bg-sky-200 border-2 border-sky-400 rounded-2xl shadow-xs transition-all text-left cursor-pointer group"
              title="Peranan Semasa: Orang Luar (Tekan untuk tukar peranan)"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🌍</span>
              <div>
                <span className="text-xs font-heading font-black text-sky-950 block leading-tight">
                  Akses Orang Luar
                </span>
                <span className="text-[10px] text-sky-700 font-bold block">
                  Mod Pelawat (Tanpa Kata Laluan) · Tukar ▼
                </span>
              </div>
            </button>
          ) : (
            /* Student Mode */
            <button
              onClick={() => {
                sound.playClick();
                setShowRoleModal(true);
              }}
              className="flex items-center gap-2 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 rounded-2xl shadow-xs transition-all text-left cursor-pointer group"
              title="Peranan Semasa: Murid (Tekan untuk tukar peranan)"
            >
              <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-xs flex items-center justify-center text-base group-hover:scale-105 transition-transform">
                {activeStudent.avatar}
              </div>
              <div>
                <span className="text-xs font-heading font-black text-amber-950 block leading-tight">
                  {activeStudent.nama.split(' ')[0]} (Murid)
                </span>
                <span className="text-[10px] text-amber-800 font-bold block">
                  {activeStudent.kelas} · TP{activeStudent.tahapPenguasaan} · Tukar ▼
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Gamification Coins & Active Teacher Guide & Role Management */}
        <div className="flex items-center gap-2">
          {/* Active Teacher Guide Button with photo avatar */}
          <button
            onClick={() => {
              sound.playClick();
              setShowTeacherTrioModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/95 hover:bg-white border-2 border-amber-400 rounded-2xl shadow-xs transition-all cursor-pointer group"
            title={`Guru Pembimbing: ${TEACHER_PROFILES[selectedTeacherId].nama} (${TEACHER_PROFILES[selectedTeacherId].gelaran}) - Tekan untuk tukar guru`}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-amber-100">
              <img
                src={TEACHER_PROFILES[selectedTeacherId].fotoUrl}
                alt={TEACHER_PROFILES[selectedTeacherId].nama}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[9px] text-amber-800 font-bold block leading-tight">
                Guru Anda
              </span>
              <span className="text-xs font-heading font-black text-amber-950 block leading-tight">
                {TEACHER_PROFILES[selectedTeacherId].nama}
              </span>
            </div>
            <span className="text-[10px] text-amber-700 font-bold">▼</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-300 border-2 border-amber-400 shadow-sm text-xs font-heading font-black text-amber-950">
            <span>🪙</span>
            <span>{activeStudent.syilingTerkumpul}</span>
          </div>

          {/* CRITICAL: Papan Pemuka PBS dan Dev/Kod HANYA kelihatan dalam Mod Guru! Sembunyikan untuk Murid dan Orang Luar. */}
          {userRole === 'teacher' && (
            <>
              {/* Bilik Guru / PBS Dashboard button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentScreen('pbs_dashboard');
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs shadow-sm transition-all animate-pulse"
                title="Buka Papan Pemuka Pentaksiran Guru"
              >
                <GraduationCap size={15} />
                <span className="hidden sm:inline">Papan Pemuka PBS</span>
              </button>

              {/* Dev Docs button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentScreen('dev_docs');
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-900 text-amber-300 font-heading font-bold text-xs shadow-sm transition-all"
                title="Dokumentasi Pembangun & Skema Firebase"
              >
                <span className="font-mono text-[10px]">Dev / Kod</span>
              </button>
            </>
          )}

          {/* In-Place Role Switcher Button - Does NOT exit screen */}
          <button
            onClick={() => {
              sound.playClick();
              setShowRoleModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 font-heading font-bold text-xs border border-amber-300 shadow-sm transition-all cursor-pointer"
            title="Tukar Peranan Akses Anda"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Tukar Peranan</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage Container */}
      <main className={`flex-1 ${containerMaxWidth} flex flex-col justify-center`}>
        {/* ========================================================
            SCREEN 1: SELAMAT DATANG (Storyboard Page 1)
           ======================================================== */}
        {currentScreen === 'welcome' && (
          <div
            className="relative min-h-[500px] md:min-h-[540px] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-3 sm:p-5 animate-fade-in bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.18), rgba(255,255,255,0.28)), url('/assets/aistudio/halaman_selamat_datang_1b346c8c.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Cute Smiling Sun in top-left corner */}
            <div className="absolute top-2 left-3 z-10">
              <CuteSunVector size={65} />
            </div>

            {/* Flying Blue Birds in the sky matching Page 1 */}
            <div className="absolute top-10 right-28 z-10 hidden sm:block">
              <BlueBirdVector size={45} />
            </div>
            <div className="absolute top-18 right-12 z-10 hidden sm:block">
              <BlueBirdVector size={35} flip={true} />
            </div>

            {/* Fluttering Butterfly */}
            <div className="absolute top-28 left-8 z-10 hidden sm:block">
              <ButterflyVector size={32} />
            </div>

            {/* Top Bar with red X and Audio */}
            <TopNavBar
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onHelp={() => setCurrentScreen('symbols')}
            />

            {/* Main Landscape Stage: Karikatur Cikgu di sebelah Bahagian Akses */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 my-2 z-20 px-2 sm:px-6">
              {/* LEFT COLUMN (Landscape): Karikatur Cikgu + Speech Bubble + Teacher Switcher */}
              <div className="w-full md:w-5/12 flex flex-col items-center justify-center shrink-0">
                <TeacherStandee
                  teacherId={selectedTeacherId}
                  size="md"
                  showBubble={true}
                  audioUrl={selectedTeacherId === 'freshcy' ? CIKGU_FRESHCY_AUDIOS.welcome : undefined}
                  bubbleText={`“Hai! Saya ${TEACHER_PROFILES[selectedTeacherId].nama}. Jom belajar ayat perintah bersama cikgu!”`}
                />

                {/* Quick Teacher Switcher Pills */}
                <div className="flex items-center gap-1 mt-2.5 p-1 bg-white/95 rounded-full border border-amber-300 shadow-md">
                  {(['syafiqah', 'aaron', 'freshcy'] as TeacherId[]).map((tid) => {
                    const prof = TEACHER_PROFILES[tid];
                    const isCur = selectedTeacherId === tid;
                    return (
                      <button
                        key={tid}
                        onClick={() => handleSelectTeacher(tid)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-heading font-black transition-all flex items-center gap-1 ${
                          isCur
                            ? 'bg-amber-500 text-white shadow-xs scale-105'
                            : 'text-slate-700 hover:bg-amber-100'
                        }`}
                        title={`${prof.nama} (${prof.gelaran})`}
                      >
                        <span className="w-4 h-4 rounded-full overflow-hidden border border-amber-400 shrink-0 inline-block">
                          <img src={prof.avatarUrl} alt="" className="w-full h-full object-cover" />
                        </span>
                        <span className="hidden sm:inline">{prof.nama.replace('Cikgu ', '')}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowTeacherTrioModal(true);
                    }}
                    className="px-2.5 py-1 rounded-full text-[11px] font-heading font-extrabold bg-purple-100 text-purple-900 hover:bg-purple-200 border border-purple-300 ml-0.5"
                    title="Lihat profil lengkap 3 cikgu"
                  >
                    3 Guru 👥
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN (Landscape): Tajuk Nota, 3 Pilihan Akses & Butang Mula Emas */}
              <div className="w-full md:w-7/12 flex flex-col items-center justify-center space-y-3.5">
                <div className="px-6 py-2 bg-white/95 backdrop-blur-md rounded-3xl border-3 border-rose-300 shadow-xl">
                  <h1 className="text-3xl sm:text-5xl font-black font-heading text-rose-500 drop-shadow-sm tracking-wide text-center">
                    Selamat Datang
                  </h1>
                </div>

                {/* Note with Paperclip & Red Pin */}
                <div className="relative max-w-lg w-full bg-white/95 rounded-2xl p-4 border-2 border-slate-300 shadow-xl transform -rotate-0.5 hover:rotate-0 transition-transform">
                  <div className="absolute -top-3 left-6 text-2xl">📎</div>
                  <div className="absolute -top-3 right-6 text-2xl">📍</div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 leading-tight">
                        Tajuk: Ayat Perintah
                      </h2>
                      <p className="text-sm font-heading font-bold text-amber-700 mt-0.5">
                        Tahun 5 Bestari (KSSR Semakan)
                      </p>
                    </div>
                    <span className="text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-xl shadow-xs">
                      Modul Interaktif AR 🚀
                    </span>
                  </div>
                </div>

                {/* 3 Main Role Access Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-lg w-full">
                  {/* 1. Akses Murid (Tanpa Password -> Semakan Emosi) */}
                  <button
                    onClick={() => {
                      setUserRole('student');
                      sound.playClick();
                      setCurrentScreen('emotion');
                    }}
                    className="group p-3 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-amber-950 font-heading border-3 border-amber-200 shadow-[0_4px_0_#92400e] active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all transform hover:scale-102 flex flex-col items-center justify-between text-center"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center text-xl shadow-xs mb-1 group-hover:rotate-6 transition-transform">
                      👦
                    </div>
                    <span className="text-sm font-black text-white drop-shadow-xs">Akses Murid</span>
                    <span className="text-[9px] font-bold text-amber-100 bg-amber-950/30 px-2 py-0.5 rounded-full mt-0.5">
                      Tiada Password
                    </span>
                    <span className="text-[10px] text-amber-950 font-black mt-1.5 bg-white/85 px-2 py-0.5 rounded-lg w-full shadow-xs">
                      Mula Belajar 🚀
                    </span>
                  </button>

                  {/* 2. Akses Guru (Perlu Password) */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setTeacherAuthError('');
                      setTeacherPasswordInput('');
                      setShowTeacherAuthModal(true);
                    }}
                    className="group p-3 rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-700 hover:from-emerald-400 hover:to-teal-600 text-white font-heading border-3 border-emerald-300 shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-[0_1px_0_#065f46] transition-all transform hover:scale-102 flex flex-col items-center justify-between text-center"
                  >
                    <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xs mb-1 group-hover:rotate-6 transition-transform bg-purple-100">
                      <img src={TEACHER_PROFILES[selectedTeacherId].avatarUrl} alt="Akses Guru" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-black text-white drop-shadow-xs">Akses Guru</span>
                    <span className="text-[9px] font-bold text-emerald-100 bg-emerald-950/40 px-2 py-0.5 rounded-full mt-0.5 flex items-center gap-1">
                      <Lock size={9} /> Perlu Password
                    </span>
                    <span className="text-[10px] text-emerald-950 font-black mt-1.5 bg-emerald-100 px-2 py-0.5 rounded-lg w-full shadow-xs">
                      Bilik Guru PBS 🔑
                    </span>
                  </button>

                  {/* 3. Akses Orang Luar (Tanpa Password -> Semakan Emosi) */}
                  <button
                    onClick={() => {
                      setUserRole('guest');
                      sound.playClick();
                      setCurrentScreen('emotion');
                    }}
                    className="group p-3 rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-heading border-3 border-sky-200 shadow-[0_4px_0_#1e40af] active:translate-y-1 active:shadow-[0_1px_0_#1e40af] transition-all transform hover:scale-102 flex flex-col items-center justify-between text-center"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center text-xl shadow-xs mb-1 group-hover:rotate-6 transition-transform text-sky-800">
                      🌍
                    </div>
                    <span className="text-sm font-black text-white drop-shadow-xs">Orang Luar</span>
                    <span className="text-[9px] font-bold text-sky-100 bg-blue-950/40 px-2 py-0.5 rounded-full mt-0.5">
                      Tiada Password
                    </span>
                    <span className="text-[10px] text-blue-950 font-black mt-1.5 bg-white/85 px-2 py-0.5 rounded-lg w-full shadow-xs">
                      Teroka Bebas 👁️
                    </span>
                  </button>
                </div>

                {/* Golden Circular Play Button & Quick Start */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <GoldenPlayButton
                    onClick={() => {
                      setUserRole('student');
                      setCurrentScreen('emotion');
                    }}
                    size={74}
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-black text-amber-900 block font-heading">
                      Tekan Butang Emas
                    </span>
                    <span className="text-[11px] text-amber-800 font-bold block">
                      Untuk Terus Mula Belajar 🌟
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Foliage Layer matching Storyboard foreground */}
            <div className="absolute bottom-0 left-0 right-0 z-0">
              <FoliageForeground />
            </div>

            {/* Bottom Navigation: Wooden arrows */}
            <div className="flex items-center justify-between w-full pt-1 relative z-20">
              <div className="w-12" /> {/* spacer */}
              <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-4 py-1 rounded-full shadow-sm">
                Muka Hadapan (Tahun 5 Bestari)
              </div>
              <WoodArrowButton
                direction="next"
                onClick={() => setCurrentScreen('emotion')}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 2: APAKAH PERASAAN ANDA HARI INI? (Storyboard Page 2)
           ======================================================== */}
        {currentScreen === 'emotion' && (
          <div
            className="relative min-h-[500px] md:min-h-[540px] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-3 sm:p-5 animate-fade-in bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(rgba(240, 249, 255, 0.45), rgba(224, 242, 254, 0.55)), url('/assets/aistudio/halaman_selamat_datang_1b346c8c.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Sun in top right corner matching Page 2 */}
            <div className="absolute top-2 right-4 z-10">
              <CuteSunVector size={72} />
            </div>

            {/* Blue birds in top left corner */}
            <div className="absolute top-16 left-6 z-10">
              <BlueBirdVector size={48} />
            </div>
            <div className="absolute top-28 left-16 z-10">
              <BlueBirdVector size={36} flip={true} />
            </div>

            <TopNavBar
              onExit={() => setCurrentScreen('home')}
              onHome={() => setCurrentScreen('home')}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onHelp={() => setCurrentScreen('symbols')}
            />

            {/* Main Landscape Stage: 2 Columns */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 my-2 z-20 px-2 sm:px-6">
              {/* LEFT COLUMN: Tajuk, Speaker & Butang Pilihan Emosi / Kad Semangat */}
              <div className="w-full md:w-7/12 flex flex-col items-center justify-center text-center">
                <div className="px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-3xl border-3 border-rose-300 shadow-xl flex items-center justify-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading text-rose-500 drop-shadow-sm">
                    Apakah perasaan anda hari ini?
                  </h1>
                  <AudioSpeakerButton
                    textToSpeak="Apakah perasaan anda hari ini? Tekan muka gembira jika anda bersemangat untuk belajar!"
                    size="md"
                  />
                </div>

                {/* Words of Encouragement after student presses emotion button */}
                {encouragementData ? (
                  <div className="relative max-w-md w-full p-4 sm:p-5 rounded-3xl bg-white/95 border-4 border-amber-400 shadow-2xl animate-fade-in text-center my-2">
                    {/* Graphical Banner matching emotion */}
                    {encouragementData.type === 'happy' ? (
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-sm animate-bounce">
                          🌟
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 border-2 border-orange-400 flex items-center justify-center text-2xl shadow-sm">
                          😊
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-2xl shadow-sm animate-pulse">
                          🏆
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-sky-100 border-2 border-sky-400 flex items-center justify-center text-2xl shadow-sm animate-pulse">
                          🌈
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-pink-100 border-2 border-pink-400 flex items-center justify-center text-2xl shadow-sm">
                          💖
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-sm animate-bounce">
                          🐰
                        </div>
                      </div>
                    )}

                    <h2 className="text-lg sm:text-xl font-heading font-black text-rose-500 mb-1">
                      {encouragementData.tajuk}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-800 font-extrabold mb-2 text-emerald-800">
                      {encouragementData.mesej}
                    </p>

                    <div className="p-2 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-950 font-heading text-xs font-bold shadow-xs mb-3">
                      ✨ {encouragementData.mutiaraKata}
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <AudioSpeakerButton textToSpeak={encouragementData.speechText} size="md" />
                      <button
                        onClick={() => {
                          sound.playSuccess();
                          setEncouragementData(null);
                          setCurrentScreen('symbols');
                        }}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-heading font-black text-xs sm:text-sm shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all flex items-center gap-1.5 transform hover:scale-102"
                      >
                        <span>Jom Mula!</span>
                        <span>➔</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setEncouragementData(null)}
                      className="mt-2 text-[10px] text-slate-500 hover:text-slate-800 underline font-bold block mx-auto cursor-pointer"
                    >
                      Pilih Semula Perasaan
                    </button>
                  </div>
                ) : (
                  /* The 2 Big Emoji Buttons: Happy Yellow vs Sad Blue */
                  <div className="flex items-center justify-center gap-6 sm:gap-10 my-4">
                    {/* Happy Emoji */}
                    <button
                      onClick={() => handleEmotionSelect('happy')}
                      className="group flex flex-col items-center transform hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      aria-label="Saya rasa gembira"
                    >
                      <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-amber-400 border-4 border-amber-500 shadow-xl flex items-center justify-center group-hover:ring-4 group-hover:ring-amber-300">
                        <span className="text-5xl sm:text-6xl">😊</span>
                      </div>
                      <span className="mt-2 font-heading font-black text-amber-950 text-sm sm:text-base">
                        Gembira & Ceria!
                      </span>
                    </button>

                    {/* Sad / Thoughtful Emoji */}
                    <button
                      onClick={() => handleEmotionSelect('thoughtful')}
                      className="group flex flex-col items-center transform hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      aria-label="Saya rasa risau"
                    >
                      <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-sky-400 border-4 border-sky-500 shadow-xl flex items-center justify-center group-hover:ring-4 group-hover:ring-sky-300">
                        <span className="text-5xl sm:text-6xl">🥺</span>
                      </div>
                      <span className="mt-2 font-heading font-black text-sky-950 text-sm sm:text-base">
                        Perlukan Semangat
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Karikatur Guru di sebelah kanan + Teacher Switcher */}
              <div className="w-full md:w-5/12 flex flex-col items-center justify-center shrink-0 z-20">
                <TeacherStandee
                  teacherId={selectedTeacherId}
                  size="md"
                  showBubble={true}
                  audioUrl={selectedTeacherId === 'freshcy' && !encouragementData ? CIKGU_FRESHCY_AUDIOS.emotion : undefined}
                  bubbleText={
                    encouragementData
                      ? encouragementData.type === 'happy'
                        ? `“Hebat! Semangatmu membakar motivasi belajar hari ini bersama ${TEACHER_PROFILES[selectedTeacherId].nama}!”`
                        : `“Jangan risau sahabat kecil, ${TEACHER_PROFILES[selectedTeacherId].nama} sedia membimbingmu sepanjang pembelajaran ini!”`
                      : `“Hai! Cikgu nak tanya, bagaimana perasaan kamu hari ini? Pilih muka gembira atau perlukan semangat di sebelah ya!”`
                  }
                />

                {/* Quick Teacher Switcher Pills */}
                <div className="flex items-center gap-1 mt-2.5 p-1 bg-white/95 rounded-full border border-amber-300 shadow-md">
                  {(['syafiqah', 'aaron', 'freshcy'] as TeacherId[]).map((tid) => {
                    const prof = TEACHER_PROFILES[tid];
                    const isCur = selectedTeacherId === tid;
                    return (
                      <button
                        key={tid}
                        onClick={() => handleSelectTeacher(tid)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-heading font-black transition-all flex items-center gap-1 ${
                          isCur
                            ? 'bg-amber-500 text-white shadow-xs scale-105'
                            : 'text-slate-700 hover:bg-amber-100'
                        }`}
                        title={`${prof.nama} (${prof.gelaran})`}
                      >
                        <span className="w-4 h-4 rounded-full overflow-hidden border border-amber-400 shrink-0 inline-block">
                          <img src={prof.avatarUrl} alt="" className="w-full h-full object-cover" />
                        </span>
                        <span className="hidden sm:inline">{prof.nama.replace('Cikgu ', '')}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowTeacherTrioModal(true);
                    }}
                    className="px-2.5 py-1 rounded-full text-[11px] font-heading font-extrabold bg-purple-100 text-purple-900 hover:bg-purple-200 border border-purple-300 ml-0.5"
                    title="Lihat profil lengkap 3 cikgu"
                  >
                    3 Guru 👥
                  </button>
                </div>
              </div>
            </div>

            {/* Foreground Foliage */}
            <div className="absolute bottom-0 left-0 right-0 z-0">
              <FoliageForeground />
            </div>

            <div className="flex items-center justify-between w-full pt-1 relative z-10">
              <WoodArrowButton
                direction="prev"
                onClick={() => setCurrentScreen('welcome')}
              />
              <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-4 py-1 rounded-full shadow-sm">
                Semakan Emosi
              </div>
              <WoodArrowButton
                direction="next"
                onClick={() => setCurrentScreen('symbols')}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 3: MAKNA SIMBOL (Storyboard Page 3)
           ======================================================== */}
        {currentScreen === 'symbols' && (
          <div
            className="relative min-h-[500px] md:min-h-[540px] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-3 sm:p-5 animate-fade-in bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.28)), url('/assets/aistudio/halaman_panduan_navigasi_dan_halaman_menu_utama_dde09024.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Sun in top left corner */}
            <div className="absolute top-2 left-3 z-10">
              <CuteSunVector size={70} />
            </div>

            <TopNavBar
              onExit={() => setCurrentScreen('home')}
              onHome={() => setCurrentScreen('home')}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              title=""
            />

            {/* Pop-up 3D Tajuk Panduan Navigasi */}
            <div className="flex justify-center mt-1 mb-2 z-20">
              <div className="relative px-7 py-2.5 rounded-3xl bg-gradient-to-b from-[#a15c38] to-[#7f4f24] border-4 border-[#582f0e] shadow-[0_6px_0_#432818,0_10px_20px_rgba(0,0,0,0.3)] text-center transform hover:scale-102 transition-transform">
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  🧭 Panduan Navigasi & Makna Simbol
                </h1>
              </div>
            </div>

            {/* Main 2-Column Landscape Stage */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 my-2 z-20 px-2 sm:px-6">
              {/* LEFT COLUMN: Wooden Board showing Symbol Meanings */}
              <div className="w-full md:w-7/12 flex flex-col items-center justify-center">
                <div className="relative max-w-xl w-full p-5 sm:p-6 rounded-3xl bg-[#ddb892]/95 border-4 border-[#7f4f24] shadow-[0_8px_0_#582f0e]">
                  <h2 className="text-2xl sm:text-3xl font-heading font-black text-rose-500 text-center mb-4 drop-shadow-sm">
                    Makna Simbol
                  </h2>

                  <div className="grid grid-cols-2 gap-3.5 text-xs sm:text-sm font-heading font-extrabold text-[#582f0e]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-base shadow shrink-0">
                        <X size={20} strokeWidth={3} />
                      </span>
                      <span>keluar</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-7 rounded-xl bg-[#e6ccb2] border-2 border-[#7f4f24] text-[#582f0e] flex items-center justify-center text-sm shadow shrink-0">
                        ➔
                      </span>
                      <span>halaman seterusnya</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-base shadow shrink-0">
                        <Home size={19} strokeWidth={2.5} />
                      </span>
                      <span>halaman utama</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-7 rounded-xl bg-[#e6ccb2] border-2 border-[#7f4f24] text-[#582f0e] flex items-center justify-center text-sm shadow shrink-0">
                        ⬅
                      </span>
                      <span>halaman sebelumnya</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-base shadow shrink-0">
                        <HelpCircle size={20} strokeWidth={2.8} />
                      </span>
                      <span>bantuan</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-base shadow shrink-0">
                        <Volume2 size={20} strokeWidth={2.6} />
                      </span>
                      <span>audio sebutan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Karikatur Guru di sebelah kanan + Teacher Switcher */}
              <div className="w-full md:w-5/12 flex flex-col items-center justify-center shrink-0 z-20">
                <TeacherStandee
                  teacherId={selectedTeacherId}
                  size="md"
                  showBubble={true}
                  audioUrl={selectedTeacherId === 'freshcy' ? CIKGU_FRESHCY_AUDIOS.symbols : undefined}
                  bubbleText={`“Fahami makna 6 simbol ini agar mudah mengemudi kit inovasi bersama ${TEACHER_PROFILES[selectedTeacherId].nama}!”`}
                />

                {/* Quick Teacher Switcher Pills */}
                <div className="flex items-center gap-1 mt-2.5 p-1 bg-white/95 rounded-full border border-amber-300 shadow-md">
                  {(['syafiqah', 'aaron', 'freshcy'] as TeacherId[]).map((tid) => {
                    const prof = TEACHER_PROFILES[tid];
                    const isCur = selectedTeacherId === tid;
                    return (
                      <button
                        key={tid}
                        onClick={() => handleSelectTeacher(tid)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-heading font-black transition-all flex items-center gap-1 ${
                          isCur
                            ? 'bg-amber-500 text-white shadow-xs scale-105'
                            : 'text-slate-700 hover:bg-amber-100'
                        }`}
                        title={`${prof.nama} (${prof.gelaran})`}
                      >
                        <span className="w-4 h-4 rounded-full overflow-hidden border border-amber-400 shrink-0 inline-block">
                          <img src={prof.avatarUrl} alt="" className="w-full h-full object-cover" />
                        </span>
                        <span className="hidden sm:inline">{prof.nama.replace('Cikgu ', '')}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowTeacherTrioModal(true);
                    }}
                    className="px-2.5 py-1 rounded-full text-[11px] font-heading font-extrabold bg-purple-100 text-purple-900 hover:bg-purple-200 border border-purple-300 ml-0.5"
                    title="Lihat profil lengkap 3 cikgu"
                  >
                    3 Guru 👥
                  </button>
                </div>
              </div>
            </div>

            {/* Foreground Foliage */}
            <div className="absolute bottom-0 left-0 right-0 z-0">
              <FoliageForeground />
            </div>

            <div className="flex items-center justify-between w-full pt-1 relative z-10">
              <WoodArrowButton
                direction="prev"
                onClick={() => setCurrentScreen('emotion')}
              />
              <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-4 py-1 rounded-full shadow-sm">
                Makna Simbol
              </div>
              <WoodArrowButton
                direction="next"
                onClick={() => setCurrentScreen('home')}
                label="Ke Menu Utama"
              />
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 4: HALAMAN UTAMA (Storyboard Page 4)
           ======================================================== */}
        {currentScreen === 'home' && (
          <div
            className="relative min-h-[600px] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.22), rgba(255,255,255,0.3)), url('/assets/aistudio/halaman_panduan_navigasi_dan_halaman_menu_utama_dde09024.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Flying bird in sky */}
            <div className="absolute top-4 left-1/3 z-10">
              <BlueBirdVector size={42} />
            </div>

            <TopNavBar
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onHelp={() => setCurrentScreen('symbols')}
              title=""
            />

            {/* Pop-up 3D Tajuk Halaman Utama */}
            <div className="flex justify-center mt-1 mb-2 z-20">
              <div className="relative px-8 py-2.5 rounded-3xl bg-gradient-to-b from-[#a15c38] via-[#8b4513] to-[#582f0e] border-4 border-[#3d1a04] shadow-[0_6px_0_#2b1202,0_10px_20px_rgba(0,0,0,0.35)] text-center transform hover:scale-102 transition-transform">
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] flex items-center gap-2 justify-center">
                  <span>🏠</span>
                  <span>Halaman Utama</span>
                  <span>✨</span>
                </h1>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 my-2 z-10">
              {/* Left Side: Animated Teacher Standee with Speech Bubble & Teacher Switcher */}
              <div className="flex flex-col items-center max-w-xs text-center z-20">
                <TeacherStandee
                  teacherId={selectedTeacherId}
                  size="md"
                  showBubble={true}
                  audioUrl={selectedTeacherId === 'freshcy' ? CIKGU_FRESHCY_AUDIOS.home : undefined}
                  bubbleText="“Sila tekan butang Pengenalan, Jom Belajar atau Kuiz untuk memulakan pengembaraan ilmu anda!”"
                />

                {/* Teacher Switcher on Home */}
                <div className="flex items-center gap-1.5 mt-2 p-1.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-md">
                  {(['syafiqah', 'aaron', 'freshcy'] as TeacherId[]).map((tid) => {
                    const prof = TEACHER_PROFILES[tid];
                    const isCur = selectedTeacherId === tid;
                    return (
                      <button
                        key={tid}
                        onClick={() => handleSelectTeacher(tid)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-heading font-bold transition-all ${
                          isCur
                            ? `${prof.temaWarna.badge} font-black shadow-xs ring-2 ring-amber-400 scale-105`
                            : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                        }`}
                        title={`${prof.nama} (${prof.gelaran})`}
                      >
                        <span className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 shrink-0 inline-block">
                          <img src={prof.fotoUrl} alt="" className="w-full h-full object-cover object-top" />
                        </span>
                        <span className="text-[11px]">{prof.nama.replace('Cikgu ', '')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Directional Signposts matching storyboard Page 4 + Augmented features */}
              <div className="flex-1 max-w-md w-full space-y-3 relative">
                {/* Perched Blue Bird on top of signpost matching Page 4! */}
                <div className="absolute -top-10 right-8 z-20">
                  <BlueBirdVector size={54} perched={true} />
                </div>

                {/* 1. Pengenalan (with lightbulb) */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('intro');
                  }}
                  className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl bg-[#a15c38] hover:bg-[#8b4513] text-white font-heading font-black text-xl border-3 border-[#582f0e] shadow-[0_5px_0_#582f0e] active:translate-y-1 active:shadow-[0_1px_0_#582f0e] transition-all transform hover:scale-102"
                >
                  <span className="tracking-wide">Pengenalan</span>
                  <span className="w-10 h-10 rounded-full bg-blue-600 text-yellow-300 flex items-center justify-center text-xl shadow">
                    💡
                  </span>
                </button>

                {/* 2. Jom Belajar (with book) */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('learn_menu');
                  }}
                  className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl bg-[#a15c38] hover:bg-[#8b4513] text-white font-heading font-black text-xl border-3 border-[#582f0e] shadow-[0_5px_0_#582f0e] active:translate-y-1 active:shadow-[0_1px_0_#582f0e] transition-all transform hover:scale-102"
                >
                  <span className="tracking-wide">Jom belajar</span>
                  <span className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center text-xl shadow">
                    📖
                  </span>
                </button>

                {/* 3. Kuiz (with quiz phone) */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('quiz_menu');
                  }}
                  className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl bg-[#a15c38] hover:bg-[#8b4513] text-white font-heading font-black text-xl border-3 border-[#582f0e] shadow-[0_5px_0_#582f0e] active:translate-y-1 active:shadow-[0_1px_0_#582f0e] transition-all transform hover:scale-102"
                >
                  <span className="tracking-wide">Kuiz & Permainan</span>
                  <span className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl shadow">
                    🎮
                  </span>
                </button>

              </div>
            </div>

            {/* Foreground Foliage */}
            <div className="absolute bottom-0 left-0 right-0 z-0">
              <FoliageForeground />
            </div>

            <div className="flex items-center justify-between w-full pt-1 relative z-10">
              <WoodArrowButton
                direction="prev"
                onClick={() => setCurrentScreen('symbols')}
              />
              <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-4 py-1 rounded-full shadow-sm">
                Halaman Utama
              </div>
              <WoodArrowButton
                direction="next"
                onClick={() => setCurrentScreen('intro')}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 5 & 6: PENGENALAN (Storyboard Pages 5 & 6)
           ======================================================== */}
        {currentScreen === 'intro' && (
          <div
            className="relative min-h-[600px] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.28), rgba(255,255,255,0.36)), url('/assets/aistudio/halaman_panduan_navigasi_dan_halaman_menu_utama_dde09024.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <TopNavBar
              onExit={() => setCurrentScreen('home')}
              onHome={() => setCurrentScreen('home')}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onHelp={() => setCurrentScreen('symbols')}
              title=""
            />

            {/* Pop-up 3D Tajuk Pengenalan */}
            <div className="flex justify-center mt-1 mb-2 z-20">
              <div className="relative px-8 py-2.5 rounded-3xl bg-gradient-to-b from-[#a15c38] via-[#8b4513] to-[#582f0e] border-4 border-[#3d1a04] shadow-[0_6px_0_#2b1202,0_10px_20px_rgba(0,0,0,0.35)] text-center transform hover:scale-102 transition-transform">
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] flex items-center gap-2 justify-center">
                  <span>💡</span>
                  <span>Pengenalan: Celik Ayat Perintah</span>
                  <span>✨</span>
                </h1>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 my-2">
              {/* Left Column: Animated Teacher Standee */}
              <div className="flex flex-col items-center max-w-xs text-center">
                <TeacherStandee
                  teacherId={selectedTeacherId}
                  size="md"
                  showBubble={true}
                  audioUrl={
                    selectedTeacherId === 'freshcy'
                      ? introSubPage === 1
                        ? CIKGU_FRESHCY_AUDIOS.standard
                        : CIKGU_FRESHCY_AUDIOS.sasaran
                      : undefined
                  }
                  bubbleText={
                    introSubPage === 1
                      ? '“Mari kita fahami Standard Kandungan dan Standard Pembelajaran 5.3.2 hari ini!”'
                      : '“Sasaran kita: kuasai 4 jenis ayat perintah dengan tepat!”'
                  }
                />
              </div>

              {/* Right Column: Standard Kandungan / Objektif matching Pages 5 & 6 */}
              <div className="flex-1 max-w-lg w-full">
                {introSubPage === 1 ? (
                  /* Page 5: Standard Kandungan & Pembelajaran */
                  <div className="space-y-4">
                    <div className="p-5 rounded-3xl bg-white/95 border-3 border-dashed border-amber-400 shadow-md">
                      <span className="block text-amber-800 font-heading font-black text-lg text-center mb-1">
                        Standard Kandungan
                      </span>
                      <p className="text-base sm:text-lg font-bold text-slate-900 text-center">
                        5.3 Memahami dan membina ayat mengikut konteks
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white/95 border-3 border-dashed border-amber-400 shadow-md">
                      <span className="block text-amber-800 font-heading font-black text-lg text-center mb-1">
                        Standard Pembelajaran
                      </span>
                      <p className="text-base sm:text-lg font-bold text-slate-900 text-center">
                        5.3.2 Murid dapat memahami dan membina ayat perintah mengikut konteks
                      </p>
                    </div>

                    {/* Cute cat illustration bottom */}
                    <div className="flex justify-center pt-2">
                      <CatVector size={110} />
                    </div>
                  </div>
                ) : (
                  /* Page 6: Objektif & Hasil Pembelajaran */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-3xl bg-white/95 border-3 border-dashed border-amber-400 shadow-md">
                      <h3 className="font-heading font-black text-base text-amber-900 text-center mb-2">
                        Objektif Pembelajaran
                      </h3>
                      <p className="text-xs text-slate-600 mb-2">
                        Pada akhir pengajaran dan pembelajaran, murid dapat:
                      </p>
                      <ol className="text-xs font-bold text-slate-800 space-y-2 list-decimal list-inside">
                        <li>Mengelaskan 4 jenis ayat perintah dengan betul.</li>
                        <li>
                          Menjelaskan sekurang-kurangnya 3 kata perintah yang sesuai dengan konteks ayat.
                        </li>
                      </ol>
                    </div>

                    <div className="p-4 rounded-3xl bg-white/95 border-3 border-dashed border-amber-400 shadow-md">
                      <h3 className="font-heading font-black text-base text-amber-900 text-center mb-2">
                        Hasil Pembelajaran
                      </h3>
                      <ol className="text-xs font-bold text-slate-800 space-y-2 list-decimal list-inside mt-4">
                        <li>
                          Murid dapat menjawab sekurang-kurangnya 3 soalan kuiz berkaitan ayat perintah dengan betul.
                        </li>
                        <li>
                          Murid dapat menyenaraikan 4 jenis ayat perintah berdasarkan nota dan video.
                        </li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between w-full pt-1">
              <WoodArrowButton
                direction="prev"
                onClick={() => {
                  if (introSubPage === 2) {
                    setIntroSubPage(1);
                  } else {
                    setCurrentScreen('home');
                  }
                }}
              />
              <div className="text-xs font-bold text-amber-900 bg-amber-200/70 px-4 py-1 rounded-full">
                Pengenalan ({introSubPage}/2)
              </div>
              <WoodArrowButton
                direction="next"
                onClick={() => {
                  if (introSubPage === 1) {
                    setIntroSubPage(2);
                  } else {
                    setCurrentScreen('learn_menu');
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 7: JOM BELAJAR MENU (Storyboard Page 7)
           ======================================================== */}
        {currentScreen === 'learn_menu' && (
          <div
            className="relative min-h-[580px] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.32)), url('/assets/aistudio/halaman_panduan_navigasi_dan_halaman_menu_utama_dde09024.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Flying butterfly matching Page 7 */}
            <div className="absolute top-20 left-16 z-10">
              <ButterflyVector size={42} />
            </div>

            <TopNavBar
              onExit={() => setCurrentScreen('home')}
              onHome={() => setCurrentScreen('home')}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onHelp={() => setCurrentScreen('symbols')}
              title=""
            />

            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 my-4 z-10">
              {/* Left Side: Selected Teacher Standee */}
              <div className="flex flex-col items-center">
                <TeacherStandee
                  teacherId={selectedTeacherId}
                  size="md"
                  showBubble={true}
                  audioUrl={selectedTeacherId === 'freshcy' ? CIKGU_FRESHCY_AUDIOS.learnMenu : undefined}
                  bubbleText={`“Sila pilih bahagian yang ingin anda terokai bersama ${TEACHER_PROFILES[selectedTeacherId].nama}!”`}
                />
              </div>

              {/* Right Side: Wooden Directional Signpost matching Page 7 */}
              <div className="flex-1 max-w-md w-full space-y-4 relative">
                {/* Perched Blue Bird on the wooden signpost matching Page 7! */}
                <div className="absolute -top-12 right-6 z-20">
                  <BlueBirdVector size={54} perched={true} />
                </div>

                <div className="relative p-6 rounded-3xl bg-[#a15c38] border-4 border-[#582f0e] shadow-[0_8px_0_#582f0e] text-center mb-4">
                  <h1 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-wider">
                    Jom Belajar!
                  </h1>
                  <p className="text-amber-200 text-xs mt-1">
                    Pilih bahagian yang ingin anda terokai:
                  </p>
                </div>

                {/* 1. Nota */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('notes');
                  }}
                  className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl bg-[#ddb892] hover:bg-[#c58f5e] text-[#582f0e] font-heading font-black text-xl border-3 border-[#7f4f24] shadow-[0_5px_0_#7f4f24] active:translate-y-1 transition-all transform hover:scale-102"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                      📖
                    </span>
                    <span>Nota</span>
                  </span>
                  <span>➔</span>
                </button>

                {/* 2. Video */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('video');
                  }}
                  className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl bg-[#ddb892] hover:bg-[#c58f5e] text-[#582f0e] font-heading font-black text-xl border-3 border-[#7f4f24] shadow-[0_5px_0_#7f4f24] active:translate-y-1 transition-all transform hover:scale-102"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">
                      📹
                    </span>
                    <span>Video & Teater</span>
                  </span>
                  <span>➔</span>
                </button>

                {/* 3. Latih Diri */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('drill');
                  }}
                  className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl bg-[#ddb892] hover:bg-[#c58f5e] text-[#582f0e] font-heading font-black text-xl border-3 border-[#7f4f24] shadow-[0_5px_0_#7f4f24] active:translate-y-1 transition-all transform hover:scale-102"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm">
                      💡
                    </span>
                    <span>Latih Diri</span>
                  </span>
                  <span>➔</span>
                </button>

                {/* 4. Lembaran Kerja (Cetak PDF) */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('worksheets');
                  }}
                  className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl bg-[#ddb892] hover:bg-[#c58f5e] text-[#582f0e] font-heading font-black text-xl border-3 border-[#7f4f24] shadow-[0_5px_0_#7f4f24] active:translate-y-1 transition-all transform hover:scale-102"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm">
                      📄
                    </span>
                    <span>Lembaran Kerja (Cetak PDF)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      4 Lembaran
                    </span>
                    <span>➔</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Foreground Foliage */}
            <div className="absolute bottom-0 left-0 right-0 z-0">
              <FoliageForeground />
            </div>

            <div className="flex items-center justify-between w-full pt-1 relative z-10">
              <WoodArrowButton
                direction="prev"
                onClick={() => setCurrentScreen('intro')}
              />
              <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-4 py-1 rounded-full shadow-sm">
                Menu Jom Belajar
              </div>
              <WoodArrowButton
                direction="next"
                onClick={() => setCurrentScreen('notes')}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 24: KUIZ MENU (Storyboard Page 24)
           ======================================================== */}
        {currentScreen === 'quiz_menu' && (
          <div
            className="relative min-h-[580px] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in"
            style={{
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.5)), url('/assets/aistudio/halaman_kuiz_dan_permainan_bg.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Flying Blue Bird in sky */}
            <div className="absolute top-6 right-16 z-10">
              <BlueBirdVector size={48} />
            </div>

            <TopNavBar
              onExit={() => setCurrentScreen('home')}
              onHome={() => setCurrentScreen('home')}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onHelp={() => setCurrentScreen('symbols')}
              title="Pilihan Permainan"
            />

            <div className="flex-1 flex flex-col items-center justify-center my-4 animate-fade-in z-10">
              <h1 className="text-4xl sm:text-5xl font-black font-heading text-slate-900 mb-3 drop-shadow-sm">
                Pilihan Permainan
              </h1>

              {/* Selected Teacher Guidance Banner */}
              <div className="flex items-center gap-3 mb-5 px-4 py-2.5 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-md max-w-xl w-full">
                <TeacherAvatar teacherId={selectedTeacherId} size="md" />
                <div className="text-left flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-heading font-black text-amber-950">
                      {TEACHER_PROFILES[selectedTeacherId].nama}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium leading-snug mt-0.5">
                    “Pilih permainan kegemaran anda dan kumpul sebanyak mungkin syiling emas!”
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (selectedTeacherId === 'freshcy') {
                      sound.playAudioClip(CIKGU_FRESHCY_AUDIOS.quizMenu);
                    } else {
                      sound.speakMalay(
                        `Ayuh murid-murid! Saya ${TEACHER_PROFILES[selectedTeacherId].nama}. Pilih salah satu permainan kegemaran anda dan kumpul sebanyak mungkin syiling emas!`,
                        selectedTeacherId
                      );
                    }
                  }}
                  className="p-2 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 cursor-pointer shadow-xs active:scale-95 transition-all"
                  title={`Dengar nasihat ${TEACHER_PROFILES[selectedTeacherId].nama}`}
                >
                  <Volume2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full">
                {/* Game 1 Card: Lompat Si Katak */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('game_frog');
                  }}
                  className="p-4 rounded-3xl bg-white/95 backdrop-blur-xs border-4 border-emerald-500 shadow-xl cursor-pointer hover:scale-103 transition-all text-center flex flex-col items-center justify-between"
                >
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider mb-2">
                    Permainan 1
                  </span>
                  <div className="my-1">
                    <KatakLompatLogo size={84} />
                  </div>
                  <div className="mt-2 w-full">
                    <h3 className="font-heading font-black text-lg text-emerald-950">
                      Lompat Si Katak
                    </h3>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                        Aras Kesukaran: <span className="font-black text-emerald-700">Mudah</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700">
                        Bilangan Soalan: <span className="font-black text-emerald-800">5 Soalan</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 px-4 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs shadow transition-all">
                    Main Sekarang 🐸
                  </button>
                </div>

                {/* Game 2 Card: Game Kembara Harta Karun */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('game_treasure');
                  }}
                  className="p-4 rounded-3xl bg-white/95 backdrop-blur-xs border-4 border-amber-500 shadow-xl cursor-pointer hover:scale-103 transition-all text-center flex flex-col items-center justify-between"
                >
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-600 text-white uppercase tracking-wider mb-2">
                    Permainan 2
                  </span>
                  <div className="my-1">
                    <KembaraHartaKarunLogo size={84} />
                  </div>
                  <div className="mt-2 w-full">
                    <h3 className="font-heading font-black text-lg text-amber-950">
                      Kembara Harta Karun
                    </h3>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                        Aras Kesukaran: <span className="font-black text-amber-700">Sederhana</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700">
                        Bilangan Soalan: <span className="font-black text-amber-800">7 Soalan</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 px-4 py-1.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-heading font-bold text-xs shadow transition-all">
                    Kembara Harta Karun 🪙
                  </button>
                </div>

                {/* Game 3 Card: Wira Mario */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('game_mario');
                  }}
                  className="p-4 rounded-3xl bg-white/95 backdrop-blur-xs border-4 border-rose-500 shadow-xl cursor-pointer hover:scale-103 transition-all text-center flex flex-col items-center justify-between"
                >
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white uppercase tracking-wider mb-2">
                    Permainan 3
                  </span>
                  <div className="my-1">
                    <WiraMarioLogo size={84} />
                  </div>
                  <div className="mt-2 w-full">
                    <h3 className="font-heading font-black text-lg text-slate-900">
                      Wira Mario
                    </h3>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold border border-rose-300">
                        Aras Kesukaran: <span className="font-black text-rose-700">Mencabar (3 Level)</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700">
                        Bilangan Soalan: <span className="font-black text-rose-800">9 Soalan</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 px-4 py-1.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-heading font-bold text-xs shadow transition-all">
                    Mula Mengembara 🎮
                  </button>
                </div>

                {/* Game 4 Card: Game Kuasa Pac-Man */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setCurrentScreen('game_pacman');
                  }}
                  className="p-4 rounded-3xl bg-slate-900/95 backdrop-blur-xs border-4 border-yellow-400 shadow-xl cursor-pointer hover:scale-103 transition-all text-center flex flex-col items-center justify-between text-white"
                >
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 uppercase tracking-wider mb-2">
                    Permainan 4
                  </span>
                  <div className="my-1">
                    <KuasaPacmanLogo size={84} />
                  </div>
                  <div className="mt-2 w-full">
                    <h3 className="font-heading font-black text-lg text-yellow-400">
                      Game Kuasa Pac-Man
                    </h3>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold border border-yellow-400/40">
                        Aras Kesukaran: <span className="font-black text-yellow-300">Sederhana</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-200">
                        Bilangan Soalan: <span className="font-black text-yellow-400">6 Soalan</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 px-4 py-1.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-xs shadow transition-all">
                    Kuasai Pac-Man 🟡
                  </button>
                </div>
              </div>
            </div>

            {/* Foreground Foliage */}
            <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
              <FoliageForeground />
            </div>

            <div className="flex items-center justify-between w-full pt-1 relative z-10">
              <WoodArrowButton
                direction="prev"
                onClick={() => setCurrentScreen('home')}
              />
              <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-4 py-1 rounded-full shadow-sm">
                Pilih Kuiz
              </div>
              <WoodArrowButton
                direction="next"
                onClick={() => setCurrentScreen('game_frog')}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            SUBMODULE: FROG GAME (Lompat Si Katak Lompat)
           ======================================================== */}
        {currentScreen === 'game_frog' && (
          <FrogGame
            onBack={() => setCurrentScreen('quiz_menu')}
            onHome={() => setCurrentScreen('home')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onComplete={(finalScore, coins) => {
              handleAwardStudent(
                coins,
                1,
                Math.round((finalScore / 5) * 100),
                'Jaguh Katak Lompat',
                { game: 'katak', betul: finalScore, salah: Math.max(0, 5 - finalScore) }
              );
            }}
          />
        )}

        {/* ========================================================
            SUBMODULE: TREASURE GAME (Permainan Harta Karun)
           ======================================================== */}
        {currentScreen === 'game_treasure' && (
          <TreasureGame
            onBack={() => setCurrentScreen('quiz_menu')}
            onHome={() => setCurrentScreen('home')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onComplete={(finalScore, coins) => {
              handleAwardStudent(
                coins,
                2,
                Math.round((finalScore / 7) * 100),
                'Kapten Harta Karun',
                { game: 'hartaKarun', betul: finalScore, salah: Math.max(0, 7 - finalScore) }
              );
            }}
          />
        )}

        {/* ========================================================
            SUBMODULE: MARIO GAME (Wira Mario: Pengembaraan Ayat Perintah)
           ======================================================== */}
        {currentScreen === 'game_mario' && (
          <MarioGame
            onBack={() => setCurrentScreen('quiz_menu')}
            onHome={() => setCurrentScreen('home')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onComplete={(finalScore, coins) => {
              const correctCount = Math.min(9, Math.max(2, Math.round(finalScore / 100)));
              handleAwardStudent(
                coins,
                1,
                Math.round((correctCount / 9) * 100),
                'Wira Mario Bahasa',
                { game: 'mario', betul: correctCount, salah: 0 }
              );
              setCurrentScreen('home');
            }}
          />
        )}

        {/* ========================================================
            SUBMODULE: PAC-MAN GAME (Wira Pac-Man: Labirin Ayat Perintah)
           ======================================================== */}
        {currentScreen === 'game_pacman' && (
          <PacmanGame
            onBack={() => setCurrentScreen('quiz_menu')}
            onHome={() => setCurrentScreen('home')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onComplete={(finalScore, coins) => {
              const correctCount = Math.min(4, Math.max(1, Math.round(finalScore / 150)));
              handleAwardStudent(
                coins,
                2,
                Math.round((correctCount / 4) * 100),
                'Jaguh Pac-Man Ayat Perintah',
                { game: 'pacman', betul: correctCount, salah: 0 }
              );
              setCurrentScreen('home');
            }}
          />
        )}

        {/* ========================================================
            SUBMODULE: NOTA DAN VIDEO
           ======================================================== */}
        {currentScreen === 'notes' && (
          <NotaDanVideo
            initialSubTab="nota"
            onBack={() => setCurrentScreen('learn_menu')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {currentScreen === 'video' && (
          <NotaDanVideo
            initialSubTab="video"
            onBack={() => setCurrentScreen('learn_menu')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* ========================================================
            SUBMODULE: LATIH DIRI
           ======================================================== */}
        {currentScreen === 'drill' && (
          <LatihDiri
            teacherId={selectedTeacherId}
            onBack={() => setCurrentScreen('learn_menu')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onComplete={() => {
              handleAwardStudent(40, undefined, undefined, 'Juara Latih Diri');
            }}
          />
        )}

        {/* ========================================================
            SUBMODULE: LEMBARAN KERJA (CETAK PDF)
           ======================================================== */}
        {currentScreen === 'worksheets' && (
          <LembaranKerja
            teacherId={selectedTeacherId}
            onBack={() => setCurrentScreen('learn_menu')}
            onHome={() => setCurrentScreen('home')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* ========================================================
            SUBMODULE: AUGMENTED REALITY (AR)
           ======================================================== */}
        {currentScreen === 'ar_scanner' && (
          <ARModule
            teacherId={selectedTeacherId}
            onBack={() => setCurrentScreen('home')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onSessionComplete={handleARSessionDone}
          />
        )}


        {/* ========================================================
            SUBMODULE: PAPAN PEMUKA PBS GURU
           ======================================================== */}
        {currentScreen === 'pbs_dashboard' && (
          <PapanPemukaPBS
            students={students}
            currentStudentId={currentStudentId}
            onSelectActiveStudent={(id) => setCurrentStudentId(id)}
            onUpdateStudents={(updated) => setStudents(updated)}
            onBack={() => setCurrentScreen('home')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* ========================================================
            SUBMODULE: DOKUMENTASI PEMBANGUN & SKEMA FIREBASE
           ======================================================== */}
        {currentScreen === 'dev_docs' && (
          <DokumentasiPembangun
            onBack={() => setCurrentScreen('home')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}
      </main>

      {/* Role Selection In-Place Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border-4 border-amber-400 shadow-2xl relative">
            <button
              onClick={() => setShowRoleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center mx-auto mb-2 text-3xl">
                🎭
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                Pilih Peranan Akses Anda
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Tukar mod peranan anda serta-merta tanpa keluar ke halaman muka hadapan.
              </p>
            </div>

            <div className="space-y-3">
              {/* Option 1: Akses Murid */}
              <button
                onClick={() => {
                  setUserRole('student');
                  sound.playSuccess();
                  setShowRoleModal(false);
                }}
                className={`w-full p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all text-left cursor-pointer ${
                  userRole === 'student'
                    ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400'
                    : 'bg-white hover:bg-amber-50 border-slate-200'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-amber-400 flex items-center justify-center text-2xl shrink-0">
                  👦
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-slate-900 text-sm">Akses Murid</span>
                    {userRole === 'student' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Aktif</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium block">
                    Mod pembelajaran interaktif, latihan & permainan
                  </span>
                </div>
              </button>

              {/* Option 2: Akses Guru */}
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  if (userRole === 'teacher') {
                    sound.playClick();
                  } else {
                    setTeacherAuthError('');
                    setTeacherPasswordInput('');
                    setShowTeacherAuthModal(true);
                  }
                }}
                className={`w-full p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all text-left cursor-pointer ${
                  userRole === 'teacher'
                    ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-400'
                    : 'bg-white hover:bg-emerald-50 border-slate-200'
                }`}
              >
                <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-emerald-500 shrink-0 bg-purple-100">
                  <img src={TEACHER_PROFILES[selectedTeacherId].avatarUrl} alt="Guru" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-slate-900 text-sm">Akses Guru ({TEACHER_PROFILES[selectedTeacherId].nama})</span>
                    {userRole === 'teacher' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Aktif</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium block">
                    Papan Pemuka PBS, analisis markah & dev/kod (Perlu Password)
                  </span>
                </div>
              </button>

              {/* Option 3: Akses Orang Luar */}
              <button
                onClick={() => {
                  setUserRole('guest');
                  sound.playSuccess();
                  setShowRoleModal(false);
                }}
                className={`w-full p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all text-left cursor-pointer ${
                  userRole === 'guest'
                    ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-400'
                    : 'bg-white hover:bg-sky-50 border-slate-200'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-sky-500 text-white flex items-center justify-center text-2xl shrink-0">
                  🌍
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-slate-900 text-sm">Akses Orang Luar</span>
                    {userRole === 'guest' && (
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">Aktif</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium block">
                    Mod Pelawat untuk teroka aplikasi tanpa kata laluan
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Password Auth Modal */}
      {showTeacherAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-emerald-500 shadow-2xl relative">
            <button
              onClick={() => setShowTeacherAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 text-3xl">
                🔐
              </div>
              <h3 className="text-2xl font-black font-heading text-slate-900">
                Pengesahan Akses Guru
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Bahagian ini dikhaskan untuk Guru Bahasa Melayu bagi menyemak rekod PBD, Tahap Penguasaan TP1–TP6 dan dokumentasi arkitektur.
              </p>
            </div>

            <form onSubmit={handleTeacherAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-black text-slate-700 mb-1">
                  Masukkan Kata Laluan Guru
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={teacherPasswordInput}
                    onChange={(e) => setTeacherPasswordInput(e.target.value)}
                    placeholder="Masukkan kata laluan guru..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-hidden font-heading text-base font-bold text-slate-900 pl-10"
                    autoFocus
                  />
                  <Key size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
                {teacherAuthError && (
                  <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                    <ShieldAlert size={14} /> {teacherAuthError}
                  </p>
                )}
              </div>

              {/* Helpful Hint banner for user/evaluators */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start gap-2">
                <span className="text-base shrink-0">💡</span>
                <div>
                  <span className="font-bold">Kata Laluan Guru:</span>
                  <div className="font-mono font-bold text-emerald-700 text-sm mt-0.5">guru123</div>
                  <span className="text-[11px] text-emerald-800">
                    (atau taip <code>cikgu2026</code>)
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherAuthModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-black text-sm shadow-[0_4px_0_#065f46] active:translate-y-1 transition-all"
                >
                  Sahkan Akses Guru ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Trio Modal (Kenali 3 Orang Cikgu: Syafiqah, Aaron, Freshcy) */}
      {showTeacherTrioModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => {
                sound.playClick();
                setShowTeacherTrioModal(false);
              }}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg border-2 border-white z-10 cursor-pointer"
              title="Tutup"
            >
              ✕
            </button>
            <TeacherTrioShowcase
              activeTeacherId={selectedTeacherId}
              onSelectTeacher={(tid) => {
                handleSelectTeacher(tid);
                setTimeout(() => setShowTeacherTrioModal(false), 800);
              }}
            />
          </div>
        </div>
      )}

      {/* Footer Branding & DSKP Reference */}
      <footer className="max-w-4xl mx-auto w-full text-center text-[11px] text-amber-900/70 pt-2 font-medium">
        Celik Perintah AR © 2026 · Pentaksiran Bilik Darjah (PBS) KPM · DSKP KSSR Semakan
      </footer>
    </div>
  );
}
