import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { TopNavBar, WoodArrowButton } from './OrganicNav';
import { sound } from '../utils/audio';
import { ArrowLeft, ArrowRight, ArrowUp, Sparkles, Volume2, Award, Heart, HelpCircle, Trophy, BookOpen, Gamepad2 } from 'lucide-react';

interface MarioGameProps {
  onBack: () => void;
  onComplete: (score: number, coins: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

interface QuestionBlock {
  id: number;
  x: number;
  y: number;
  answered: boolean;
  soalan: string;
  ayatPenuh: string;
  pilihan: { teks: string; betul: boolean; maklumBalas: string }[];
  penerangan: string;
  jenis: 'suruhan' | 'larangan' | 'silaan' | 'permintaan';
}

const MARIO_QUESTIONS: QuestionBlock[] = [
  {
    id: 1,
    x: 230,
    y: 155,
    answered: false,
    jenis: 'permintaan',
    soalan: '“Tolong senyap ketika berada di dalam perpustakaan.”',
    ayatPenuh: 'Tolong senyap ketika berada di dalam perpustakaan.',
    pilihan: [
      { teks: 'Ayat Permintaan', betul: true, maklumBalas: 'Tepat sekali! Kata "Tolong" digunakan untuk meminta bantuan atau kerjasama secara sopan.' },
      { teks: 'Ayat Larangan', betul: false, maklumBalas: 'Bukan, ayat ini bukan melarang tetapi meminta kerjasama.' },
      { teks: 'Ayat Suruhan', betul: false, maklumBalas: 'Kurang tepat, kata "Tolong" menjadikannya ayat permintaan.' }
    ],
    penerangan: 'Kata perintah "Tolong", "Minta", dan "Harap" tergolong dalam Ayat Permintaan.'
  },
  {
    id: 2,
    x: 480,
    y: 155,
    answered: false,
    jenis: 'larangan',
    soalan: '“Jangan buang sampah ke dalam parit atau sungai!”',
    ayatPenuh: 'Jangan buang sampah ke dalam parit atau sungai!',
    pilihan: [
      { teks: 'Ayat Silaan', betul: false, maklumBalas: 'Bukan, ayat ini bukan menjemput atau mempersilakan.' },
      { teks: 'Ayat Larangan', betul: true, maklumBalas: 'Syabas! Kata "Jangan" menegah atau melarang sesuatu perbuatan berbahaya.' },
      { teks: 'Ayat Permintaan', betul: false, maklumBalas: 'Bukan, ini adalah larangan tegas.' }
    ],
    penerangan: 'Kata perintah "Jangan" dan "Usah" digunakan untuk menegah seseorang melakukan sesuatu.'
  },
  {
    id: 3,
    x: 740,
    y: 145,
    answered: false,
    jenis: 'silaan',
    soalan: '“Sila jamu selera dengan kuih-muih tradisional yang terhidang ini.”',
    ayatPenuh: 'Sila jamu selera dengan kuih-muih tradisional yang terhidang ini.',
    pilihan: [
      { teks: 'Ayat Suruhan', betul: false, maklumBalas: 'Bukan, ayat ini menggunakan kata hormat "Sila".' },
      { teks: 'Ayat Permintaan', betul: false, maklumBalas: 'Bukan, kata "Sila" menunjukkan adab menjemput tetamu.' },
      { teks: 'Ayat Silaan', betul: true, maklumBalas: 'Cemerlang! Kata "Sila" dan "Jemput" mempersilakan tetamu dengan penuh santun.' }
    ],
    penerangan: 'Ayat Silaan digunakan untuk menjemput atau mempersilakan seseorang dengan adab tertib.'
  },
  {
    id: 4,
    x: 1000,
    y: 155,
    answered: false,
    jenis: 'suruhan',
    soalan: '“Kemas bilik tidur kamu sebelum keluar bermain bersama kawan-kawan.”',
    ayatPenuh: 'Kemas bilik tidur kamu sebelum keluar bermain bersama kawan-kawan.',
    pilihan: [
      { teks: 'Ayat Suruhan', betul: true, maklumBalas: 'Hebat! Ayat ini memberi arahan terus melakukan perbuatan mengemas.' },
      { teks: 'Ayat Larangan', betul: false, maklumBalas: 'Bukan, ayat ini menyuruh melakukan sesuatu, bukan melarang.' },
      { teks: 'Ayat Silaan', betul: false, maklumBalas: 'Bukan, ini adalah suruhan daripada ibu bapa atau penjaga.' }
    ],
    penerangan: 'Ayat Suruhan bertujuan memberi perintah atau arahan terus secara berhemah.'
  },
  {
    id: 5,
    x: 1260,
    y: 145,
    answered: false,
    jenis: 'permintaan',
    soalan: 'Antara kata berikut, yang manakah merupakan KATA PERINTAH SILAAN?',
    ayatPenuh: 'Antara kata berikut, yang manakah merupakan kata perintah silaan?',
    pilihan: [
      { teks: 'Usah & Jangan', betul: false, maklumBalas: 'Usah dan Jangan ialah kata larangan.' },
      { teks: 'Jemput & Sila', betul: true, maklumBalas: 'Bijak! "Jemput" dan "Sila" ialah kata silaan yang memuliakan pendengar.' },
      { teks: 'Tolong & Minta', betul: false, maklumBalas: 'Tolong dan Minta ialah kata permintaan.' }
    ],
    penerangan: 'Kata Silaan membolehkan kita menjemput orang lain dengan mesra dan sopan.'
  }
];

interface WorldCoin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

const INITIAL_WORLD_COINS: WorldCoin[] = [
  { id: 1, x: 150, y: 165, collected: false },
  { id: 2, x: 190, y: 145, collected: false },
  { id: 3, x: 355, y: 135, collected: false }, // above green pipe
  { id: 4, x: 420, y: 160, collected: false },
  { id: 5, x: 610, y: 155, collected: false },
  { id: 6, x: 660, y: 140, collected: false },
  { id: 7, x: 895, y: 130, collected: false }, // above tall pipe
  { id: 8, x: 1120, y: 155, collected: false },
  { id: 9, x: 1180, y: 140, collected: false },
  { id: 10, x: 1360, y: 150, collected: false }
];

export const MarioGame: React.FC<MarioGameProps> = ({
  onBack,
  onComplete,
  soundEnabled,
  onToggleSound
}) => {
  // Navigation stage: intro -> rules -> guide -> playing
  const [subStage, setSubStage] = useState<'intro' | 'rules' | 'guide' | 'playing'>('intro');

  // Mario physics & state
  const [posX, setPosX] = useState(60);
  const [posY, setPosY] = useState(250); // Ground level
  const [velY, setVelY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [facing, setFacing] = useState<'right' | 'left'>('right');
  const [isMoving, setIsMoving] = useState(false);

  // Game stats
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [blocks, setBlocks] = useState<QuestionBlock[]>(MARIO_QUESTIONS);
  const [worldCoins, setWorldCoins] = useState<WorldCoin[]>(INITIAL_WORLD_COINS);
  const [activeQuestion, setActiveQuestion] = useState<QuestionBlock | null>(null);
  const [blinkingBlockId, setBlinkingBlockId] = useState<number | null>(null);
  const [bouncingBlockId, setBouncingBlockId] = useState<number | null>(null);
  const [coinPops, setCoinPops] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [stageFinished, setStageFinished] = useState(false);
  const [powerupAnimation, setPowerupAnimation] = useState(false);
  const [showCastleLocked, setShowCastleLocked] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Controls refs
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const requestRef = useRef<number | null>(null);

  const WORLD_WIDTH = 1580;
  const GROUND_Y = 250;
  const jumpY = Math.max(0, GROUND_Y - posY);

  const handleRetryAfterGameOver = () => {
    setGameOver(false);
    setPosX(60);
    setPosY(GROUND_Y);
    setVelY(0);
    setLives(3);
    setScore(0);
    setCoins(0);
    setBlocks(MARIO_QUESTIONS.map(b => ({ ...b, answered: false })));
    setWorldCoins(INITIAL_WORLD_COINS.map(c => ({ ...c, collected: false })));
    setBlinkingBlockId(null);
    setBouncingBlockId(null);
    setCoinPops([]);
    sound.playClick();
  };

  // Viewport camera offset (smooth side-scroller)
  const cameraX = Math.max(0, Math.min(posX - 220, WORLD_WIDTH - 640));

  // User toggle for web scrolling lock
  const [scrollLocked, setScrollLocked] = useState<boolean>(true);

  // Lock or unlock body scroll dynamically based on user setting
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;

    if (scrollLocked) {
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.overscrollBehavior = 'auto';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
    };
  }, [scrollLocked]);

  // Handle keyboard inputs with preventDefault when scroll is locked
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Is it a game navigation or jump key?
      const isGameControl =
        e.code === 'Space' ||
        e.key === ' ' ||
        e.key === 'Spacebar' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.code === 'KeyW' ||
        e.code === 'KeyA' ||
        e.code === 'KeyS' ||
        e.code === 'KeyD';

      if (scrollLocked && isGameControl) {
        // Prevent default browser scroll / page-down behavior
        e.preventDefault();
        e.stopPropagation();
      }

      if (activeQuestion || stageFinished) return;

      keysPressed.current[e.key] = true;
      keysPressed.current[e.code] = true;

      // Jump action: Spacebar, ArrowUp, or KeyW
      const isJumpKey =
        e.code === 'Space' ||
        e.key === ' ' ||
        e.key === 'Spacebar' ||
        e.code === 'ArrowUp' ||
        e.key === 'ArrowUp' ||
        e.code === 'KeyW';

      if (isJumpKey && !isJumping) {
        jump();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const isGameControl =
        e.code === 'Space' ||
        e.key === ' ' ||
        e.key === 'Spacebar' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.code === 'KeyW' ||
        e.code === 'KeyA' ||
        e.code === 'KeyS' ||
        e.code === 'KeyD';

      if (scrollLocked && isGameControl) {
        e.preventDefault();
        e.stopPropagation();
      }

      keysPressed.current[e.key] = false;
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isJumping, activeQuestion, stageFinished]);

  // Clean up coin pop notifications
  useEffect(() => {
    if (coinPops.length === 0) return;
    const timeout = setTimeout(() => {
      setCoinPops((prev) => prev.slice(1));
    }, 700);
    return () => clearTimeout(timeout);
  }, [coinPops]);

  // Collect coin in world
  const collectCoin = (coin: WorldCoin) => {
    sound.playCoin();
    setCoins((prev) => prev + 1);
    setScore((prev) => prev + 50);
    setWorldCoins((prev) =>
      prev.map((c) => (c.id === coin.id ? { ...c, collected: true } : c))
    );
    // Visual coin pop effect
    setCoinPops((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), x: coin.x, y: coin.y - 12, text: '+1 🪙' }
    ]);
  };

  const jump = () => {
    if (!isJumping && !activeQuestion && !blinkingBlockId) {
      sound.playJump();
      // Separaskan lompatan tepat ke aras syiling dan blok misteri
      setVelY(-12.8);
      setIsJumping(true);
    }
  };

  // Main game loop (physics & collision)
  useEffect(() => {
    if (activeQuestion || stageFinished) return;

    const gameLoop = () => {
      let speed = 0;
      if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) {
        speed = 4.2;
        setFacing('right');
        setIsMoving(true);
      } else if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) {
        speed = -4.2;
        setFacing('left');
        setIsMoving(true);
      } else {
        setIsMoving(false);
      }

      setPosX((prev) => {
        const next = Math.max(30, Math.min(prev + speed, WORLD_WIDTH - 60));
        // Check if reached Castle & Flagpole
        if (next >= 1430 && !stageFinished) {
          if (blocks.every((b) => b.answered)) {
            triggerVictory();
          } else {
            setShowCastleLocked(true);
            setTimeout(() => setShowCastleLocked(false), 2500);
            return 1420;
          }
        }
        return next;
      });

      // Check coin collection along Mario's jump arc
      worldCoins.forEach((coin) => {
        if (!coin.collected) {
          const distX = Math.abs(posX - coin.x);
          const distY = Math.abs(posY - coin.y);
          if (distX < 26 && distY < 34) {
            collectCoin(coin);
          }
        }
      });

      // Gravity and jumping physics
      setPosY((prevY) => {
        let nextY = prevY + velY;
        let nextVelY = velY + 0.65; // Smooth gravity matching coin level

        // Check head hit with Question Blocks
        blocks.forEach((block) => {
          if (!block.answered && !blinkingBlockId) {
            // Check bounding box hit
            const distHorizontal = Math.abs(posX - block.x);
            if (distHorizontal < 34 && prevY >= block.y + 26 && nextY <= block.y + 36 && velY < 0) {
              // Mario hit block with head!
              hitBlock(block);
              nextVelY = 2; // Bounce down
              nextY = block.y + 38;
            }
          }
        });

        // Ground collision
        if (nextY >= GROUND_Y) {
          nextY = GROUND_Y;
          nextVelY = 0;
          setIsJumping(false);
        }

        setVelY(nextVelY);
        return nextY;
      });

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [posX, velY, isJumping, blocks, worldCoins, activeQuestion, blinkingBlockId, stageFinished]);

  const hitBlock = (block: QuestionBlock) => {
    if (blinkingBlockId || activeQuestion) return;

    // 1. Play coin chime immediately
    sound.playCoin();

    // 2. Trigger bouncing & blinking (kelip-kelip) animation on the block
    setBlinkingBlockId(block.id);
    setBouncingBlockId(block.id);

    // 3. Award 1 coin instantly for bumping block
    setCoins((prev) => prev + 1);
    setCoinPops((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), x: block.x + 10, y: block.y - 18, text: '+1 🪙' }
    ]);

    // 4. After 600ms of blinking effect, open the Ayat Perintah question modal
    setTimeout(() => {
      setBlinkingBlockId(null);
      setBouncingBlockId(null);
      setActiveQuestion(block);
    }, 600);
  };

  const handleAnswerChoice = (choice: { teks: string; betul: boolean; maklumBalas: string }) => {
    if (!activeQuestion) return;

    if (choice.betul) {
      // Sound effect applause (tepukan gemuruh menggantikan sebutan syabas)
      sound.playApplause();
      setFeedback({ isCorrect: true, text: choice.maklumBalas });
      setScore((prev) => prev + 100);
      setCoins((prev) => prev + 10);
      setPowerupAnimation(true);
      setTimeout(() => setPowerupAnimation(false), 2000);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      // Mark block as answered
      setBlocks((prev) =>
        prev.map((b) => (b.id === activeQuestion.id ? { ...b, answered: true } : b))
      );

      setTimeout(() => {
        setActiveQuestion(null);
        setFeedback(null);
      }, 2200);
    } else {
      // Sound effect salah yang sesuai (womp-womp descending quiz buzzer)
      sound.playWrong();
      setFeedback({ isCorrect: false, text: choice.maklumBalas });
      setLives((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          setTimeout(() => setGameOver(true), 1200);
        }
        return next;
      });
    }
  };

  const triggerVictory = () => {
    setStageFinished(true);
    sound.playFanfare();
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full mx-auto p-1 sm:p-3">
      {/* Top Header Navigation */}
      <TopNavBar
        onExit={onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onHelp={() => sound.speakMalay("Gunakan butang kiri, kanan, dan lompat untuk menggerakkan Mario ke blok tanda soal!")}
        title="Wira Mario: Ayat Perintah"
      />

      {/* Screen 1: Pengenalan Wira Mario */}
      {subStage === 'intro' && (
        <div
          className="relative my-2 w-full rounded-3xl overflow-hidden border-4 border-amber-500 shadow-2xl flex flex-col justify-between p-6 sm:p-8 min-h-[460px] sm:min-h-[500px] select-none animate-fade-in"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/assets/aistudio/halaman_game_mario_d28103bf.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto z-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-400 border-4 border-white shadow-2xl flex items-center justify-center text-4xl mb-4 animate-bounce">
              🍄
            </div>

            <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border-4 border-amber-400 shadow-2xl">
              <h1 className="text-3xl sm:text-4xl font-heading font-black text-rose-600 drop-shadow-sm uppercase tracking-wide">
                Wira Mario
              </h1>
              <span className="inline-block mt-1 px-3 py-1 bg-amber-200 text-amber-950 rounded-full text-xs font-heading font-black">
                Misi Tatabahasa: Ayat Perintah
              </span>
              <p className="text-slate-800 text-sm sm:text-base font-semibold mt-3 leading-relaxed">
                Bantu Wira Mario mengembara di Lembah Bahasa Dunia 1-1! Kutip syiling emas, tanduk blok tanda soal [?], dan kuasai 4 jenis ayat perintah untuk membuka pintu Istana Bahasa!
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  sound.playSuccess();
                  setSubStage('rules');
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-heading font-black text-base shadow-[0_5px_0_#7f1d1d] active:translate-y-1 transition-all flex items-center gap-2"
              >
                <Gamepad2 size={20} />
                <span>Mula Misi 🍄</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSubStage('rules');
                }}
                className="px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-heading font-black text-sm shadow-[0_5px_0_#b45309] active:translate-y-1 transition-all flex items-center gap-2"
              >
                <BookOpen size={18} />
                <span>Cara Bermain</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen 2: Cara Bermain Wira Mario */}
      {subStage === 'rules' && (
        <div
          className="relative my-2 w-full rounded-3xl overflow-hidden border-4 border-amber-500 shadow-2xl flex flex-col justify-between p-6 sm:p-8 min-h-[460px] sm:min-h-[500px] select-none animate-fade-in"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.65)), url('/assets/aistudio/halaman_game_mario_d28103bf.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center my-2 z-10">
            <div className="relative max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#ddb892]/95 border-4 border-[#7f4f24] shadow-[0_8px_0_#582f0e]">
              <div className="absolute -top-5 left-8 w-3 h-8 bg-[#7f4f24] rounded-full" />
              <div className="absolute -top-5 right-8 w-3 h-8 bg-[#7f4f24] rounded-full" />

              <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#582f0e] text-center mb-4">
                Cara Bermain
              </h2>

              <div className="space-y-3 text-sm sm:text-base font-bold text-[#432818]">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">1</span>
                  <p>Gunakan butang <strong>KIRI</strong> dan <strong>KANAN</strong> (atau kekunci anak panah papan kekunci) untuk menggerakkan Mario.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">2</span>
                  <p>Tekan butang <strong>LOMPAT</strong> atau kekunci <strong>SPACE / ⬆</strong> untuk melompat tinggi.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">3</span>
                  <p>Tanduk bahagian bawah <strong>Blok Tanda Soal [?]</strong> untuk membuka soalan ayat perintah.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">4</span>
                  <p>Kutip syiling emas di udara dan selesaikan semua blok soalan untuk masuk ke <strong>Istana Bahasa</strong>!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 3: Panduan untuk Murid */}
      {subStage === 'guide' && (
        <div
          className="relative my-2 w-full rounded-3xl overflow-hidden border-4 border-amber-500 shadow-2xl flex flex-col justify-between p-6 sm:p-8 min-h-[460px] sm:min-h-[500px] select-none animate-fade-in"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.65)), url('/assets/aistudio/halaman_game_mario_d28103bf.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center my-2 z-10">
            <div className="relative max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#ddb892]/95 border-4 border-[#7f4f24] shadow-[0_8px_0_#582f0e]">
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#582f0e] text-center mb-5">
                Panduan untuk Murid
              </h2>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-bold text-[#582f0e]">
                <div className="flex flex-col items-center p-3 bg-white/90 rounded-2xl border-2 border-amber-400 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-amber-400 border-2 border-amber-600 flex items-center justify-center font-black text-xl text-amber-950 mb-1">
                    ?
                  </div>
                  <span className="font-heading font-black">Blok [?]</span>
                  <span className="text-[11px] text-slate-700 mt-0.5">Mengandungi soalan ayat perintah</span>
                </div>

                <div className="flex flex-col items-center p-3 bg-white/90 rounded-2xl border-2 border-amber-400 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-yellow-300 border-2 border-amber-500 flex items-center justify-center font-black text-xl text-amber-950 mb-1">
                    🪙
                  </div>
                  <span className="font-heading font-black">Syiling Emas</span>
                  <span className="text-[11px] text-slate-700 mt-0.5">+1 syiling untuk setiap kutipan</span>
                </div>

                <div className="flex flex-col items-center p-3 bg-white/90 rounded-2xl border-2 border-amber-400 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center font-black text-xl text-amber-950 mb-1">
                    ⭐
                  </div>
                  <span className="font-heading font-black">Super Star</span>
                  <span className="text-[11px] text-slate-700 mt-0.5">Bonus +100 mata kuasa</span>
                </div>

                <div className="flex flex-col items-center p-3 bg-white/90 rounded-2xl border-2 border-amber-400 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-rose-600 border-2 border-rose-800 flex items-center justify-center font-black text-xl text-white mb-1">
                    🏰
                  </div>
                  <span className="font-heading font-black">Istana Bahasa</span>
                  <span className="text-[11px] text-slate-700 mt-0.5">Garisan penamat kemenangan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 4: Main Mario Game Board */}
      {subStage === 'playing' && (
      <div
        className="relative my-2 w-full rounded-3xl overflow-hidden border-4 border-amber-500 shadow-2xl flex flex-col justify-between h-[440px] sm:h-[480px] md:h-[500px] lg:h-[560px] xl:h-[600px] md:aspect-[16/9] select-none"
        style={{
          background: 'linear-gradient(to bottom, #5c94fc 0%, #6ba5fc 70%, #90c0fc 100%)'
        }}
      >
        {/* Retro Status HUD Header (Score, Coins, World, Lives) */}
        <div className="relative z-30 bg-black/75 backdrop-blur-sm px-3 sm:px-4 py-2 flex items-center justify-between text-white font-mono text-xs sm:text-sm border-b-2 border-amber-400">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <span>MARIO</span>
            <span className="text-white">{String(score).padStart(6, '0')}</span>
          </div>

          <div className="flex items-center gap-1.5 text-yellow-300 font-bold animate-pulse">
            <span className="text-base">🪙</span>
            <span>× {coins}</span>
          </div>

          {/* Responsive Orientation Indicator Pill */}
          <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/50">
            <span>🖥️</span>
            <span>Landskap Desktop (16:9)</span>
          </div>
          <div className="flex md:hidden items-center gap-1 text-[10px] font-bold text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-400/40">
            <span>📱</span>
            <span>Potret Telefon</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-bold text-sky-200">
            <span>DUNIA</span>
            <span className="text-white">1 - 1</span>
          </div>

          <div className="flex items-center gap-1 text-rose-400 font-bold">
            <Heart size={16} fill="#f43f5e" />
            <span>× {lives}</span>
          </div>
        </div>

        {/* Viewport with Horizontal Camera Offset */}
        <div
          className="relative flex-1 overflow-hidden transition-transform duration-75 ease-out"
          style={{ width: '100%', height: '100%' }}
        >
          <div
            className="absolute top-0 bottom-0 flex"
            style={{
              width: `${WORLD_WIDTH}px`,
              transform: `translateX(-${cameraX}px)`,
              transition: 'transform 0.1s linear'
            }}
          >
            {/* Background Clouds */}
            <div className="absolute top-6 left-60 text-white/90 text-4xl pointer-events-none animate-pulse">☁️</div>
            <div className="absolute top-12 left-[520px] text-white/90 text-5xl pointer-events-none">☁️</div>
            <div className="absolute top-8 left-[980px] text-white/90 text-4xl pointer-events-none">☁️</div>
            <div className="absolute top-14 left-[1340px] text-white/90 text-5xl pointer-events-none">☁️</div>

            {/* Background Green Bushes & Hills */}
            <div className="absolute bottom-16 left-32 w-28 h-12 bg-emerald-500 rounded-t-full border-t-4 border-emerald-600 opacity-90" />
            <div className="absolute bottom-16 left-[400px] w-36 h-14 bg-emerald-600 rounded-t-full border-t-4 border-emerald-700 opacity-90" />
            <div className="absolute bottom-16 left-[840px] w-32 h-12 bg-emerald-500 rounded-t-full border-t-4 border-emerald-600 opacity-90" />
            <div className="absolute bottom-16 left-[1200px] w-40 h-16 bg-emerald-600 rounded-t-full border-t-4 border-emerald-700 opacity-90" />

            {/* Green Warp Pipes */}
            <div className="absolute bottom-16 left-[350px] w-14 h-20 bg-emerald-500 border-4 border-emerald-700 rounded-t-lg shadow-lg flex flex-col items-center">
              <div className="w-16 h-6 bg-emerald-400 border-2 border-emerald-800 rounded-t -mt-1 shadow" />
            </div>

            <div className="absolute bottom-16 left-[890px] w-16 h-28 bg-emerald-500 border-4 border-emerald-700 rounded-t-lg shadow-lg flex flex-col items-center">
              <div className="w-18 h-7 bg-emerald-400 border-2 border-emerald-800 rounded-t -mt-1 shadow" />
            </div>

            {/* Floating Brick Blocks & [?] Mystery Question Blocks (Bottom-anchored above turf) */}
            {blocks.map((block) => {
              const isBlinking = blinkingBlockId === block.id;
              const isBouncing = bouncingBlockId === block.id;
              const blockBottom = block.id % 2 === 0 ? 175 : 185;

              return (
                <div
                  key={block.id}
                  onClick={() => hitBlock(block)}
                  className={`absolute cursor-pointer transition-all duration-150 ${
                    isBouncing ? '-translate-y-4 scale-110' : ''
                  } ${
                    block.answered
                      ? 'opacity-85'
                      : isBlinking
                      ? 'scale-115 ring-4 ring-yellow-300 shadow-[0_0_25px_#fde047]'
                      : 'animate-bounce'
                  }`}
                  style={{ left: `${block.x}px`, bottom: `${blockBottom}px` }}
                  title={`Blok Soalan ${block.id}: Tekan atau lompat untuk jawab!`}
                >
                  {/* Pure visual sparkle glow when hit */}
                  {isBlinking && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center text-2xl animate-bounce pointer-events-none drop-shadow-[0_0_12px_#fde047]">
                      ✨
                    </div>
                  )}

                  {/* Block Body */}
                  <div
                    className={`w-12 h-12 rounded-lg border-3 flex flex-col items-center justify-center font-black shadow-lg relative transition-all ${
                      isBlinking
                        ? 'bg-gradient-to-b from-white via-yellow-200 to-amber-300 border-yellow-400 text-amber-950 shadow-[0_0_20px_#facc15]'
                        : block.answered
                        ? 'bg-[#b07d62] border-[#6b4226] text-amber-950'
                        : 'bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 border-[#582f0e] text-amber-950 shadow-[0_4px_0_#b45309]'
                    }`}
                  >
                    <span className={`text-xl font-heading font-black ${isBlinking ? 'animate-spin' : ''}`}>
                      {block.answered ? '✓' : isBlinking ? '⭐' : '?'}
                    </span>

                    {/* Corner Rivets */}
                    <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-black/30 rounded-full" />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-black/30 rounded-full" />
                    <span className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-black/30 rounded-full" />
                    <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-black/30 rounded-full" />
                  </div>

                  {/* Subtitle tag below block */}
                  <div className="mt-1 text-center">
                    <span className="text-[10px] font-heading font-black px-1.5 py-0.5 rounded-full border shadow whitespace-nowrap bg-black/75 text-amber-300 border-amber-400/60">
                      {block.answered ? `Misi ${block.id} Selesai` : `Soalan ${block.id}`}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Interactive Gold Floating Coins (Bottom-anchored) */}
            {worldCoins.map((coin) => (
              !coin.collected && (
                <div
                  key={`coin-${coin.id}`}
                  className="absolute z-20 flex flex-col items-center pointer-events-none transition-transform"
                  style={{ left: `${coin.x}px`, bottom: `${coin.id % 2 === 0 ? 175 : 190}px` }}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 border-2 border-yellow-100 shadow-[0_0_12px_#facc15] flex items-center justify-center text-xs font-black animate-pulse">
                    <span className="text-amber-950 font-bold">$</span>
                  </div>
                  <span className="text-[9px] font-heading font-black text-amber-200 bg-black/70 px-1 rounded -mt-0.5 shadow">
                    +1🪙
                  </span>
                </div>
              )
            ))}

            {/* Floating Coin Pop Notifications */}
            {coinPops.map((pop) => (
              <div
                key={`pop-${pop.id}`}
                className="absolute z-40 text-xs font-heading font-black text-yellow-300 bg-black/85 px-2 py-0.5 rounded-full border border-yellow-400 shadow-xl pointer-events-none animate-bounce"
                style={{ left: `${pop.x - 10}px`, bottom: '210px' }}
              >
                {pop.text}
              </div>
            ))}

            {/* Victory Flagpole & Castle at the finish line */}
            <div className="absolute bottom-16 left-[1420px] flex items-end">
              {/* Flagpole */}
              <div className="relative flex flex-col items-center">
                <div className="w-3.5 h-44 bg-slate-300 border-2 border-slate-600 rounded-t" />
                <div className="absolute top-3 -right-8 w-10 h-7 bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center font-black text-white text-xs shadow animate-pulse">
                  TP
                </div>
                <div className="w-10 h-4 bg-emerald-700 border border-emerald-900 rounded" />
              </div>

              {/* Castle */}
              <div className="ml-6 w-32 h-36 bg-[#c84b31] border-4 border-[#7a1c0d] rounded-t-xl flex flex-col items-center relative shadow-xl">
                <div className="w-full flex justify-between px-2 -mt-3">
                  <div className="w-6 h-5 bg-[#7a1c0d] rounded-t" />
                  <div className="w-6 h-5 bg-[#7a1c0d] rounded-t" />
                  <div className="w-6 h-5 bg-[#7a1c0d] rounded-t" />
                </div>
                <span className="text-2xl mt-3">🏰</span>
                <span className="text-[10px] font-heading font-black text-amber-200 mt-1 uppercase tracking-wider">
                  Istana Bahasa
                </span>
                {/* Castle Door */}
                <div className="absolute bottom-0 w-10 h-14 bg-black rounded-t-full border-t-2 border-amber-500 flex items-center justify-center">
                  {!blocks.every(b => b.answered) && (
                    <span className="text-base animate-pulse" title="Terkunci">🔒</span>
                  )}
                </div>
              </div>
            </div>

            {/* MARIO CHARACTER SPRITE (Berdiri Tegak di Atas Tanah / Ground Bricks - Tidak Terapung!) */}
            <div
              className={`absolute z-30 select-none pointer-events-none ${
                powerupAnimation ? 'scale-125 ring-4 ring-yellow-300 rounded-full' : ''
              }`}
              style={{
                left: `${posX}px`,
                bottom: `${64 + jumpY}px`,
                transform: `scaleX(${facing === 'left' ? -1 : 1})`
              }}
            >
              {/* Mario Pixel Vector Character */}
              <div className="relative w-12 h-15 flex flex-col items-center">
                {/* Punching Arm when Jumping */}
                {isJumping && (
                  <div className="absolute -top-3.5 right-0.5 z-40 flex flex-col items-center animate-pulse">
                    <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300 shadow-xs flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    </div>
                    <div className="w-2.5 h-3.5 bg-red-600 rounded-b -mt-0.5" />
                  </div>
                )}

                {/* Red Cap with visor */}
                <div className={`w-9 h-4 bg-red-600 rounded-t-lg relative shadow-xs flex items-center justify-end pr-1 transition-transform ${isJumping ? '-rotate-6 -translate-y-0.5' : ''}`}>
                  <div className="w-4 h-1.5 bg-red-700 rounded-r -mr-1" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center -ml-3">
                    <span className="text-[7px] font-black text-red-600">M</span>
                  </div>
                </div>

                {/* Face & Mustache */}
                <div className={`w-7 h-3.5 bg-[#fcd5b5] relative flex items-center justify-between px-1 border-x border-[#d4a373] ${isJumping ? '-rotate-3' : ''}`}>
                  <div className="w-1.5 h-2 bg-blue-600 rounded-full" />
                  <div className="w-4 h-1.5 bg-[#582f0e] rounded-full -mt-0.5" />
                </div>

                {/* Overalls & Shirt */}
                <div className="w-8 h-4 bg-blue-600 rounded-sm relative flex items-center justify-around border-t border-red-600">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                  <div className={`absolute -left-1.5 top-0 w-2 h-3.5 bg-red-600 rounded-full ${isJumping ? 'rotate-45 -translate-y-0.5' : ''}`} />
                  {!isJumping && (
                    <div className="absolute -right-1.5 top-0 w-2 h-3.5 bg-red-600 rounded-full" />
                  )}
                </div>

                {/* Shoes: Classic Jump Mid-air Tuck vs Running Bounce */}
                {isJumping ? (
                  <div className="w-9 flex justify-between items-center -mt-0.5">
                    <div className="w-4 h-3 bg-[#6b4226] rounded-sm transform -rotate-25 shadow-xs border-t border-blue-900" />
                    <div className="w-4 h-3 bg-[#6b4226] rounded-sm transform rotate-30 shadow-xs border-t border-blue-900" />
                  </div>
                ) : (
                  <div className="w-8 flex justify-between">
                    <div className={`w-3.5 h-2.5 bg-[#6b4226] rounded-sm ${isMoving ? 'animate-bounce' : ''}`} />
                    <div className={`w-3.5 h-2.5 bg-[#6b4226] rounded-sm ${isMoving ? 'animate-bounce delay-75' : ''}`} />
                  </div>
                )}

                {isJumping && (
                  <div className="absolute -bottom-2.5 text-[10px] opacity-80 animate-pulse">
                    💨
                  </div>
                )}
              </div>
            </div>

            {/* Retro Ground Bricks Floor (Height: 64px) */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#e76f51] border-t-4 border-[#264653] flex flex-col">
              <div className="h-3 bg-emerald-500 border-b border-emerald-700" />
              <div className="flex-1 bg-[repeating-linear-gradient(45deg,#b05d3b,#b05d3b_10px,#944422_10px,#944422_20px)]" />
            </div>
          </div>
        </div>

        {/* Castle Locked Floating Warning */}
        {showCastleLocked && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-rose-600 text-white font-heading font-black px-4 py-2 rounded-2xl border-2 border-white shadow-2xl flex items-center gap-2 animate-bounce">
            <span>🔒</span>
            <span className="text-xs sm:text-sm">Jawab SEMUA 5 blok soalan dengan betul dahulu sebelum masuk ke Istana!</span>
          </div>
        )}

        {/* Floating Power-up / Encouragement Toast */}
        {powerupAnimation && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-amber-400 text-slate-950 font-heading font-black px-4 py-1.5 rounded-full border-2 border-white shadow-xl flex items-center gap-2 animate-bounce">
            <span>⭐ SUPER STAR POWER-UP! (+100 PTS)</span>
          </div>
        )}

        {/* Touch & Mobile Controls Footer */}
        <div className="relative z-30 bg-black/90 backdrop-blur px-3 py-2 border-t-2 border-amber-500 flex flex-col sm:flex-row items-center justify-between gap-2 touch-none">
          <div className="flex items-center gap-2 text-[11px] text-amber-300 font-bold">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setScrollLocked((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer select-none active:scale-95 ${
                scrollLocked
                  ? 'bg-amber-500 text-slate-950 border-amber-300 hover:bg-amber-400'
                  : 'bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700'
              }`}
              title="Klik untuk buka atau kunci skrol halaman web"
            >
              <span>{scrollLocked ? '🔒 Skrol Web: DIKUNCI' : '🔓 Skrol Web: DIBUKA'}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-black/30 font-medium text-white">Tukar</span>
            </button>
            <span className="hidden sm:inline">
              Tekan <kbd className="px-1.5 py-0.5 bg-slate-800 text-amber-300 rounded border border-slate-600 font-mono text-[10px]">SPACE</kbd> atau <kbd className="px-1.5 py-0.5 bg-slate-800 text-amber-300 rounded border border-slate-600 font-mono text-[10px]">⬆</kbd> untuk Lompat!
            </span>
          </div>

          {/* On-Screen Touch D-PAD & Jump Button */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3 touch-none">
            <div className="flex items-center gap-2 touch-none">
              <button
                onPointerDown={(e) => { e.preventDefault(); keysPressed.current['ArrowLeft'] = true; }}
                onPointerUp={(e) => { e.preventDefault(); keysPressed.current['ArrowLeft'] = false; }}
                onPointerLeave={() => { keysPressed.current['ArrowLeft'] = false; }}
                className="w-12 h-11 rounded-2xl bg-slate-800 border-2 border-slate-600 text-white font-black flex items-center justify-center active:bg-amber-500 active:text-slate-950 transition-all shadow touch-none select-none"
                aria-label="Gerak Kiri"
              >
                <ArrowLeft size={20} strokeWidth={3} />
              </button>

              <button
                onPointerDown={(e) => { e.preventDefault(); keysPressed.current['ArrowRight'] = true; }}
                onPointerUp={(e) => { e.preventDefault(); keysPressed.current['ArrowRight'] = false; }}
                onPointerLeave={() => { keysPressed.current['ArrowRight'] = false; }}
                className="w-12 h-11 rounded-2xl bg-slate-800 border-2 border-slate-600 text-white font-black flex items-center justify-center active:bg-amber-500 active:text-slate-950 transition-all shadow touch-none select-none"
                aria-label="Gerak Kanan"
              >
                <ArrowRight size={20} strokeWidth={3} />
              </button>
            </div>

            <button
              onClick={(e) => { e.preventDefault(); jump(); }}
              onPointerDown={(e) => { e.preventDefault(); jump(); }}
              className="px-5 h-11 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 border-2 border-white text-white font-heading font-black text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all touch-none select-none"
            >
              <ArrowUp size={18} strokeWidth={3} />
              <span>LOMPAT</span>
              <span className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/40">SPACE</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* POPUP MODAL: Cabaran Ayat Perintah apabila Mario menyentuh Blok [?] */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="relative max-w-lg w-full bg-gradient-to-b from-amber-50 via-white to-amber-100 rounded-3xl border-4 border-amber-500 shadow-2xl p-5 sm:p-6 text-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-400 border border-amber-600 flex items-center justify-center font-heading font-black text-slate-900">
                  ?
                </span>
                <span className="font-heading font-black text-base text-amber-950">
                  Cabaran Blok {activeQuestion.id}
                </span>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full uppercase">
                {activeQuestion.jenis}
              </span>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-amber-100/80 border-2 border-amber-300 mb-4 text-center">
              <p className="text-base sm:text-lg font-heading font-black text-slate-900 leading-snug">
                {activeQuestion.soalan}
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2 mb-3">
              {activeQuestion.pilihan.map((pilihan, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerChoice(pilihan)}
                  className="w-full text-left p-3 rounded-xl bg-white border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-50 font-heading font-bold text-sm text-slate-800 transition-all shadow-xs flex items-center justify-between group active:scale-98"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-amber-200 group-hover:bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-black">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{pilihan.teks}</span>
                  </div>
                  <span className="text-amber-500 group-hover:translate-x-1 transition-transform">➔</span>
                </button>
              ))}
            </div>

            {/* Answer Feedback Banner */}
            {feedback && (
              <div
                className={`p-3 rounded-xl border-2 text-xs font-bold animate-fade-in flex items-center gap-2 ${
                  feedback.isCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                    : 'bg-rose-100 border-rose-500 text-rose-900'
                }`}
              >
                <span className="text-lg">{feedback.isCorrect ? '🌟' : '❌'}</span>
                <span>{feedback.text}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP VICTORY: Tahniah & Penamat Pengembaraan Mario */}
      {stageFinished && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-md w-full bg-white rounded-3xl border-4 border-amber-500 shadow-2xl p-6 text-center">
            <div className="w-18 h-18 mx-auto -mt-12 bg-amber-400 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-4xl animate-bounce">
              🏆
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-3">
              Tahniah Wira Mario!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-700 font-bold mt-1">
              Kamu telah berjaya menamatkan Lembah Ayat Perintah Dunia 1-1!
            </p>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Markah Mario</span>
                <span className="text-2xl font-black text-amber-950">{score} PTS</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Syiling Emas</span>
                <span className="text-2xl font-black text-amber-950">{coins} 🪙</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => {
                  sound.playSuccess();
                  onComplete(score, coins);
                  onBack();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-heading font-black text-sm shadow-[0_4px_0_#0f766e] active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <span>Selesai & Kembali ke Peta</span>
                <span>🗺️</span>
              </button>

              <button
                onClick={() => {
                  setStageFinished(false);
                  setPosX(60);
                  setPosY(GROUND_Y);
                  setVelY(0);
                  setLives(3);
                  setScore(0);
                  setCoins(0);
                  setBlocks(MARIO_QUESTIONS.map(b => ({ ...b, answered: false })));
                  setWorldCoins(INITIAL_WORLD_COINS.map(c => ({ ...c, collected: false })));
                  setBlinkingBlockId(null);
                  setBouncingBlockId(null);
                  setCoinPops([]);
                  sound.playClick();
                }}
                className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 underline"
              >
                Main Semula Peringkat Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP GAME OVER (Apabila 3 Nyawa Habis) */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-sm w-full bg-slate-900 rounded-3xl border-4 border-rose-500 shadow-2xl p-6 text-center text-white">
            <div className="w-16 h-16 mx-auto -mt-12 bg-rose-600 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-3xl animate-bounce">
              💔
            </div>
            <h2 className="text-2xl font-heading font-black text-rose-400 mt-3">
              Nyawa Telah Habis!
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Jangan berputus asa! Ingat kembali formula kata perintah (suruhan, larangan, silaan, permintaan) dan cuba lagi.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={handleRetryAfterGameOver}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-heading font-black text-sm shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <span>Cuba Sekali Lagi (3 Nyawa)</span>
                <span>🔄</span>
              </button>
              <button
                onClick={onBack}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Kembali ke Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between w-full pt-2 z-10">
        <WoodArrowButton
          direction="prev"
          onClick={() => {
            if (subStage === 'rules') setSubStage('intro');
            else if (subStage === 'guide') setSubStage('rules');
            else if (subStage === 'playing') setSubStage('guide');
          }}
          disabled={subStage === 'intro'}
        />

        <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-4 py-1.5 rounded-full shadow-sm">
          {subStage === 'intro' && 'Pengenalan (Wira Mario)'}
          {subStage === 'rules' && 'Cara Bermain'}
          {subStage === 'guide' && 'Panduan Murid'}
          {subStage === 'playing' && `Dunia 1-1 (Markah: ${score})`}
        </div>

        <WoodArrowButton
          direction="next"
          onClick={() => {
            if (subStage === 'intro') setSubStage('rules');
            else if (subStage === 'rules') setSubStage('guide');
            else if (subStage === 'guide') setSubStage('playing');
            else if (subStage === 'playing') {
              if (blocks.every((b) => b.answered)) {
                triggerVictory();
              } else {
                setShowCastleLocked(true);
                setTimeout(() => setShowCastleLocked(false), 3000);
              }
            }
          }}
          label={subStage === 'guide' ? 'Mula Main' : undefined}
        />
      </div>
    </div>
  );
};
