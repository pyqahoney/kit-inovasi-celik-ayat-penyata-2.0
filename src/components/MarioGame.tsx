import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { TopNavBar, WoodArrowButton } from './OrganicNav';
import { sound } from '../utils/audio';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Sparkles,
  Volume2,
  Award,
  Heart,
  HelpCircle,
  Trophy,
  BookOpen,
  Gamepad2,
  Flame,
  Shield,
  Crown
} from 'lucide-react';

interface MarioGameProps {
  onBack: () => void;
  onHome?: () => void;
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

interface WorldCoin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

// -------------------------------------------------------------------
// 3 LEVELS OF MARIO:
// Level 1: 2 Soalan Mudah (Pilih jenis ayat perintah)
// Level 2: 3 Soalan (Lengkapkan ayat perintah guna kata perintah yang betul)
// Level 3: Level Bos di Istana Mario (Selamatkan Princess Peach - 4 Soalan)
// -------------------------------------------------------------------

const LEVEL_1_QUESTIONS: QuestionBlock[] = [
  {
    id: 1,
    x: 340,
    y: 155,
    answered: false,
    jenis: 'permintaan',
    soalan: '“Tolong senyap ketika berada di dalam perpustakaan.”\nApakah jenis ayat perintah di atas?',
    ayatPenuh: 'Tolong senyap ketika berada di dalam perpustakaan.',
    pilihan: [
      {
        teks: 'Ayat Permintaan',
        betul: true,
        maklumBalas: 'Tepat sekali! Kata "Tolong" digunakan untuk meminta pertolongan atau kerjasama secara sopan.'
      },
      {
        teks: 'Ayat Larangan',
        betul: false,
        maklumBalas: 'Bukan, ayat ini bukan melarang sebaliknya meminta kerjasama.'
      },
      {
        teks: 'Ayat Suruhan',
        betul: false,
        maklumBalas: 'Kurang tepat, kata "Tolong" menjadikannya ayat permintaan.'
      }
    ],
    penerangan: 'Kata perintah "Tolong", "Minta" dan "Harap" tergolong dalam Ayat Permintaan.'
  },
  {
    id: 2,
    x: 780,
    y: 155,
    answered: false,
    jenis: 'larangan',
    soalan: '“Jangan buang sampah ke dalam parit atau sungai!”\nApakah jenis ayat perintah di atas?',
    ayatPenuh: 'Jangan buang sampah ke dalam parit atau sungai!',
    pilihan: [
      {
        teks: 'Ayat Silaan',
        betul: false,
        maklumBalas: 'Bukan, ayat ini bukan menjemput tetamu.'
      },
      {
        teks: 'Ayat Larangan',
        betul: true,
        maklumBalas: 'Syabas! Kata "Jangan" menegah atau melarang sesuatu perbuatan berbahaya.'
      },
      {
        teks: 'Ayat Permintaan',
        betul: false,
        maklumBalas: 'Bukan, ayat ini adalah larangan tegas.'
      }
    ],
    penerangan: 'Kata perintah "Jangan" dan "Usah" digunakan untuk menegah seseorang melakukan sesuatu.'
  }
];

const LEVEL_2_QUESTIONS: QuestionBlock[] = [
  {
    id: 1,
    x: 280,
    y: 155,
    answered: false,
    jenis: 'silaan',
    soalan: 'Lengkapkan ayat silaan berikut dengan kata perintah yang betul:\n“_______ jamu selera dengan kuih-muih tradisional yang terhidang ini.”',
    ayatPenuh: 'Sila jamu selera dengan kuih-muih tradisional yang terhidang ini.',
    pilihan: [
      {
        teks: 'Sila',
        betul: true,
        maklumBalas: 'Cemerlang! Kata silaan "Sila" dan "Jemput" mempersilakan tetamu dengan penuh santun.'
      },
      {
        teks: 'Usah',
        betul: false,
        maklumBalas: '"Usah" ialah kata larangan, bukan silaan.'
      },
      {
        teks: 'Minta',
        betul: false,
        maklumBalas: '"Minta" ialah kata permintaan.'
      }
    ],
    penerangan: 'Kata Silaan ("Sila" atau "Jemput") digunakan untuk menjemput seseorang secara beradab.'
  },
  {
    id: 2,
    x: 580,
    y: 145,
    answered: false,
    jenis: 'permintaan',
    soalan: 'Lengkapkan ayat permintaan berikut:\n“_______ semua murid dapat bertenang dan beratur dengan tertib.”',
    ayatPenuh: 'Harap semua murid dapat bertenang dan beratur dengan tertib.',
    pilihan: [
      {
        teks: 'Harap',
        betul: true,
        maklumBalas: 'Bijak! "Harap" menyatakan hasrat dan permohonan kerjasama secara tertib.'
      },
      {
        teks: 'Jangan',
        betul: false,
        maklumBalas: '"Jangan" ialah kata larangan.'
      },
      {
        teks: 'Jemput',
        betul: false,
        maklumBalas: '"Jemput" ialah kata silaan.'
      }
    ],
    penerangan: 'Kata Permintaan ("Tolong", "Minta", "Harap") menyatakan harapan atau permohonan santun.'
  },
  {
    id: 3,
    x: 880,
    y: 155,
    answered: false,
    jenis: 'larangan',
    soalan: 'Lengkapkan ayat larangan berikut:\n“_______ bermain berhampiran kawasan pembinaan yang berbahaya itu.”',
    ayatPenuh: 'Jangan bermain berhampiran kawasan pembinaan yang berbahaya itu.',
    pilihan: [
      {
        teks: 'Jangan',
        betul: true,
        maklumBalas: 'Hebat! Kata "Jangan" menegah murid mendekati bahaya demi keselamatan.'
      },
      {
        teks: 'Tolong',
        betul: false,
        maklumBalas: '"Tolong" ialah kata permintaan.'
      },
      {
        teks: 'Sila',
        betul: false,
        maklumBalas: '"Sila" ialah kata silaan.'
      }
    ],
    penerangan: 'Kata Larangan ("Jangan", "Usah") menegah seseorang daripada melakukan sesuatu perkara.'
  }
];

const LEVEL_3_BOSS_QUESTIONS: QuestionBlock[] = [
  {
    id: 1,
    x: 260,
    y: 155,
    answered: false,
    jenis: 'silaan',
    soalan: '“Sila tanggalkan kasut kamu sebelum masuk ke dalam surau.”\nApakah jenis ayat perintah di atas?',
    ayatPenuh: 'Sila tanggalkan kasut kamu sebelum masuk ke dalam surau.',
    pilihan: [
      {
        teks: 'Ayat Silaan',
        betul: true,
        maklumBalas: 'Tepat sekali! Kata "Sila" mempersilakan seseorang dengan tertib dan adab mulia.'
      },
      {
        teks: 'Ayat Suruhan',
        betul: false,
        maklumBalas: 'Bukan, ada kata hormat "Sila".'
      },
      {
        teks: 'Ayat Larangan',
        betul: false,
        maklumBalas: 'Bukan, ayat ini bukan larangan.'
      }
    ],
    penerangan: 'Ayat Silaan memuliakan dan mempersilakan tetamu dengan beradab.'
  },
  {
    id: 2,
    x: 520,
    y: 145,
    answered: false,
    jenis: 'permintaan',
    soalan: 'Antara yang berikut, manakah BUKAN ayat suruhan?',
    ayatPenuh: 'Tolong ambilkan buku itu untuk cikgu (Bukan ayat suruhan, ini ayat permintaan).',
    pilihan: [
      {
        teks: 'Tolong ambilkan buku latihan itu untuk cikgu.',
        betul: true,
        maklumBalas: 'Bijak! Ini ialah AYAT PERMINTAAN (kerana menggunakan kata "Tolong"), BUKAN ayat suruhan!'
      },
      {
        teks: 'Siapkan kerja sekolah kamu sebelum tidur.',
        betul: false,
        maklumBalas: 'Ini adalah ayat suruhan yang memberi arahan terus.'
      },
      {
        teks: 'Berdiri tegak ketika menyanyikan lagu Negaraku.',
        betul: false,
        maklumBalas: 'Ini adalah ayat suruhan berdisiplin.'
      }
    ],
    penerangan: 'Ayat Suruhan memberi arahan terus tanpa kata permintaan "Tolong/Minta/Harap".'
  },
  {
    id: 3,
    x: 780,
    y: 155,
    answered: false,
    jenis: 'larangan',
    soalan: '“Usah dikenang perkara sedih yang sudah berlalu itu.”\nApakah jenis ayat perintah di atas?',
    ayatPenuh: 'Usah dikenang perkara sedih yang sudah berlalu itu.',
    pilihan: [
      {
        teks: 'Ayat Larangan',
        betul: true,
        maklumBalas: 'Syabas! Kata "Usah" membawa maksud melarang atau menegah daripada berduka.'
      },
      {
        teks: 'Ayat Permintaan',
        betul: false,
        maklumBalas: 'Bukan, "Usah" bukan kata permintaan.'
      },
      {
        teks: 'Ayat Silaan',
        betul: false,
        maklumBalas: 'Bukan, "Usah" adalah larangan lembut.'
      }
    ],
    penerangan: 'Kata larangan "Usah" menasihati atau melarang dengan nada bersahabat.'
  },
  {
    id: 4,
    x: 1040,
    y: 145,
    answered: false,
    jenis: 'permintaan',
    soalan: 'Antara yang berikut, manakah BUKAN ayat suruhan?',
    ayatPenuh: 'Harap kamu semua dapat bersabar menunggu giliran (Ini ayat permintaan).',
    pilihan: [
      {
        teks: 'Harap kamu semua dapat bersabar menunggu giliran.',
        betul: true,
        maklumBalas: 'Cemerlang! Ini ialah AYAT PERMINTAAN (kerana mengandungi kata "Harap"), BUKAN ayat suruhan!'
      },
      {
        teks: 'Padamkan lampu dan kipas sebelum pulang ke rumah.',
        betul: false,
        maklumBalas: 'Ini ialah ayat suruhan mengarah perbuatan menutup suis.'
      },
      {
        teks: 'Kumpulkan buku latihan kamu di atas meja ketua kelas.',
        betul: false,
        maklumBalas: 'Ini ialah ayat suruhan terus.'
      }
    ],
    penerangan: 'Kata "Harap" mengubah ayat menjadi ayat permintaan yang sopan.'
  }
];

const INITIAL_WORLD_COINS: WorldCoin[] = [
  { id: 1, x: 160, y: 165, collected: false },
  { id: 2, x: 220, y: 145, collected: false },
  { id: 3, x: 420, y: 150, collected: false },
  { id: 4, x: 490, y: 135, collected: false },
  { id: 5, x: 670, y: 155, collected: false },
  { id: 6, x: 730, y: 140, collected: false },
  { id: 7, x: 930, y: 150, collected: false },
  { id: 8, x: 1000, y: 135, collected: false },
  { id: 9, x: 1140, y: 155, collected: false }
];

export const MarioGame: React.FC<MarioGameProps> = ({
  onBack,
  onHome,
  onComplete,
  soundEnabled,
  onToggleSound
}) => {
  // Navigation stage: intro -> rules -> guide -> playing
  const [subStage, setSubStage] = useState<'intro' | 'rules' | 'guide' | 'playing'>('intro');

  // Level Progression: 1 (Easy 2Q) -> 2 (Intermediate 3Q) -> 3 (Boss Bowser & Princess 4Q)
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState<1 | 2 | 3>(1);
  const [showLevelMap, setShowLevelMap] = useState<boolean>(false);
  const [levelTransitionModal, setLevelTransitionModal] = useState<1 | 2 | null>(null);

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
  const [blocks, setBlocks] = useState<QuestionBlock[]>(LEVEL_1_QUESTIONS);
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

  // Boss Level State (Level 3)
  const [bossHp, setBossHp] = useState(4); // 4 questions to defeat Bowser
  const [bossDefeated, setBossDefeated] = useState(false);
  const [princessRescued, setPrincessRescued] = useState(false);

  // Controls refs
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const requestRef = useRef<number | null>(null);

  const WORLD_WIDTH = currentLevel === 3 ? 1500 : 1350;
  const GROUND_Y = 250;
  const jumpY = Math.max(0, GROUND_Y - posY);

  // Background Music for Mario Game
  useEffect(() => {
    sound.playModuleBGM('mario');
    return () => {
      sound.playModuleBGM('default');
    };
  }, []);

  // Update blocks and world coins when level changes
  const startLevel = (lvl: 1 | 2 | 3) => {
    setCurrentLevel(lvl);
    setShowLevelMap(false);
    setPosX(60);
    setPosY(GROUND_Y);
    setVelY(0);
    setIsJumping(false);
    setStageFinished(false);
    setLevelTransitionModal(null);
    setFeedback(null);
    setActiveQuestion(null);

    if (lvl === 1) {
      setBlocks(LEVEL_1_QUESTIONS.map((q) => ({ ...q, answered: false })));
    } else if (lvl === 2) {
      setBlocks(LEVEL_2_QUESTIONS.map((q) => ({ ...q, answered: false })));
    } else if (lvl === 3) {
      setBlocks(LEVEL_3_BOSS_QUESTIONS.map((q) => ({ ...q, answered: false })));
      setBossHp(4);
      setBossDefeated(false);
      setPrincessRescued(false);
    }
    setWorldCoins(INITIAL_WORLD_COINS.map((c) => ({ ...c, collected: false })));
    sound.playSuccess();
  };

  const handleRetryAfterGameOver = () => {
    setGameOver(false);
    setLives(3);
    setScore((prev) => Math.max(0, prev - 100));
    startLevel(currentLevel);
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

      if (activeQuestion || stageFinished || levelTransitionModal || princessRescued) return;

      keysPressed.current[e.key] = true;
      keysPressed.current[e.code] = true;

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
  }, [isJumping, activeQuestion, stageFinished, levelTransitionModal, princessRescued]);

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
    setCoinPops((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), x: coin.x, y: coin.y - 12, text: '+1 🪙' }
    ]);
  };

  const jump = () => {
    if (!isJumping && !activeQuestion && !blinkingBlockId) {
      sound.playJump();
      setVelY(-12.8);
      setIsJumping(true);
    }
  };

  // Main game loop (physics & collision)
  useEffect(() => {
    if (activeQuestion || stageFinished || levelTransitionModal || princessRescued) return;

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
        // Check if reached Castle / Boss Arena
        const finishThreshold = currentLevel === 3 ? 1220 : 1100;
        if (next >= finishThreshold && !stageFinished) {
          if (blocks.every((b) => b.answered)) {
            triggerLevelEnd();
          } else {
            setShowCastleLocked(true);
            setTimeout(() => setShowCastleLocked(false), 2500);
            return finishThreshold - 10;
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
        let nextVelY = velY + 0.65;

        // Check head hit with Question Blocks
        blocks.forEach((block) => {
          if (!block.answered && !blinkingBlockId) {
            const distHorizontal = Math.abs(posX - block.x);
            if (distHorizontal < 34 && prevY >= block.y + 26 && nextY <= block.y + 36 && velY < 0) {
              hitBlock(block);
              nextVelY = 2;
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
  }, [
    posX,
    velY,
    isJumping,
    blocks,
    worldCoins,
    activeQuestion,
    blinkingBlockId,
    stageFinished,
    levelTransitionModal,
    princessRescued,
    currentLevel
  ]);

  const hitBlock = (block: QuestionBlock) => {
    if (blinkingBlockId || activeQuestion) return;

    sound.playCoin();
    setBlinkingBlockId(block.id);
    setBouncingBlockId(block.id);

    setCoins((prev) => prev + 1);
    setCoinPops((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), x: block.x + 10, y: block.y - 18, text: '+1 🪙' }
    ]);

    setTimeout(() => {
      setBlinkingBlockId(null);
      setBouncingBlockId(null);
      setActiveQuestion(block);
    }, 600);
  };

  const handleAnswerChoice = (choice: { teks: string; betul: boolean; maklumBalas: string }) => {
    if (!activeQuestion) return;

    if (choice.betul) {
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
      const updatedBlocks = blocks.map((b) =>
        b.id === activeQuestion.id ? { ...b, answered: true } : b
      );
      setBlocks(updatedBlocks);

      // In Level 3: Reduce Bowser's HP
      if (currentLevel === 3) {
        setBossHp((prev) => {
          const nextHp = Math.max(0, prev - 1);
          if (nextHp === 0) {
            setBossDefeated(true);
          }
          return nextHp;
        });
      }

      setTimeout(() => {
        setActiveQuestion(null);
        setFeedback(null);
        // Do not auto-advance: let Mario walk into the castle door himself!
      }, 2200);
    } else {
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

  const triggerLevelEnd = () => {
    if (currentLevel === 1) {
      sound.playFanfare();
      setMaxUnlockedLevel((prev) => Math.max(prev, 2) as 1 | 2 | 3);
      setLevelTransitionModal(1);
    } else if (currentLevel === 2) {
      sound.playFanfare();
      setMaxUnlockedLevel((prev) => Math.max(prev, 3) as 1 | 2 | 3);
      setLevelTransitionModal(2);
    } else if (currentLevel === 3) {
      // Defeated Boss Bowser -> Rescue Princess Peach!
      setBossDefeated(true);
      setPrincessRescued(true);
      setStageFinished(true);
      sound.playFanfare();
      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 }
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full mx-auto p-1 sm:p-3">
      {/* Top Header Navigation */}
      <TopNavBar
        onExit={onBack}
        onHome={onHome || onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onHelp={() =>
          sound.speakMalay(
            'Gunakan butang kiri, kanan dan lompat untuk menggerakkan Mario ke blok tanda soal!'
          )
        }
        title={
          currentLevel === 1
            ? 'Wira Mario: Tahap 1 (Ayat Perintah)'
            : currentLevel === 2
            ? 'Wira Mario: Tahap 2 (Kata Perintah)'
            : 'Wira Mario: Tahap 3 (Istana Raja Musuh & Puteri Peach)'
        }
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
                WIRA MARIO: 3 LEVEL CABARAN
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                <span className="px-3 py-1 bg-emerald-200 text-emerald-950 rounded-full text-xs font-heading font-black">
                  Level 1: 2 Soalan Mudah
                </span>
                <span className="px-3 py-1 bg-amber-200 text-amber-950 rounded-full text-xs font-heading font-black">
                  Level 2: 3 Soalan Lengkapkan
                </span>
                <span className="px-3 py-1 bg-rose-200 text-rose-950 rounded-full text-xs font-heading font-black">
                  Level 3: Bos Istana & Princess Peach 👑
                </span>
              </div>
              <p className="text-slate-800 text-sm sm:text-base font-semibold mt-3 leading-relaxed">
                Kuasai tatabahasa ayat perintah dalam 3 pengembaraan mencabar! Lawan Bos Bowser di istana berapi untuk menyelamatkan Princess Peach!
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  sound.playSuccess();
                  setSubStage('playing');
                  startLevel(1);
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-heading font-black text-base shadow-[0_5px_0_#7f1d1d] active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Gamepad2 size={20} />
                <span>Mula Pengembaraan 🍄</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSubStage('rules');
                }}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-heading font-black text-sm shadow-[0_5px_0_#b45309] active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
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
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#582f0e] text-center mb-4">
                Cara Bermain Wira Mario
              </h2>

              <div className="space-y-3 text-sm sm:text-base font-bold text-[#432818]">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </span>
                  <p>
                    Gunakan butang <strong>KIRI</strong> dan <strong>KANAN</strong> (atau kekunci anak panah) untuk menggerakkan Mario.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </span>
                  <p>
                    Tekan butang <strong>LOMPAT</strong> atau kekunci <strong>SPACE / ⬆</strong> untuk melompat tinggi.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </span>
                  <p>
                    Tanduk bahagian bawah <strong>Blok Tanda Soal [?]</strong> untuk membuka cabaran tatabahasa ayat perintah.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    4
                  </span>
                  <p>
                    Lengkapkan <strong>Tahap 1 (2 Soalan)</strong>, <strong>Tahap 2 (3 Soalan)</strong> dan tumpaskan <strong>Raja Musuh Bowser di Tahap 3 (4 Soalan)</strong> untuk membebaskan Puteri Peach!
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center pt-3 border-t border-[#7f4f24]/30">
                <button
                  onClick={() => setSubStage('intro')}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                >
                  Kembali
                </button>
                <button
                  onClick={() => {
                    sound.playSuccess();
                    setSubStage('playing');
                    startLevel(1);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-heading font-black text-sm shadow-[0_3px_0_#7f1d1d]"
                >
                  Mula Level 1 🎮
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 3: Main Mario Game Board */}
      {subStage === 'playing' && (
        <div
          className={`relative my-2 w-full rounded-3xl overflow-hidden border-4 shadow-2xl flex flex-col justify-between h-[440px] sm:h-[480px] md:h-[500px] lg:h-[560px] xl:h-[600px] md:aspect-[16/9] select-none ${
            currentLevel === 3 ? 'border-red-600' : 'border-amber-500'
          }`}
          style={{
            background:
              currentLevel === 3
                ? 'linear-gradient(to bottom, #450a0a 0%, #7f1d1d 60%, #991b1b 100%)'
                : currentLevel === 2
                ? 'linear-gradient(to bottom, #1e293b 0%, #334155 70%, #475569 100%)'
                : 'linear-gradient(to bottom, #5c94fc 0%, #6ba5fc 70%, #90c0fc 100%)'
          }}
        >
          {/* Retro Status HUD Header (Skor, Syiling, Tahap, Boss HP, Nyawa) */}
          <div className="relative z-30 bg-black/80 backdrop-blur-sm px-3 sm:px-4 py-2 flex items-center justify-between text-white font-mono text-xs sm:text-sm border-b-2 border-amber-400">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <span>MARIO</span>
              <span className="text-white">{String(score).padStart(6, '0')}</span>
            </div>

            <div className="flex items-center gap-1.5 text-yellow-300 font-bold animate-pulse">
              <span className="text-base">🪙</span>
              <span>× {coins}</span>
            </div>

            {/* Level Indicator & Map Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900 border border-amber-400 font-heading font-black text-xs">
                <span className="text-yellow-400">DUNIA 1 - {currentLevel}</span>
                {currentLevel === 3 && (
                  <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                    <Flame size={12} /> RAJA MUSUH
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setShowLevelMap(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-heading font-black text-xs shadow-[0_2px_0_#b45309] active:translate-y-0.5 transition-all cursor-pointer"
                title="Buka Peta Tahap Mario"
              >
                <span>🗺️</span>
                <span className="hidden sm:inline">Peta Tahap</span>
              </button>
            </div>

            {/* Level 3 Boss HP Bar */}
            {currentLevel === 3 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-red-950/90 px-3 py-1 rounded-xl border border-red-500">
                <span className="text-[11px] font-heading font-black text-red-300">HP BOWSER:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`w-3.5 h-3 rounded-sm border ${
                        bar <= bossHp ? 'bg-red-500 border-red-300 shadow-[0_0_6px_#ef4444]' : 'bg-slate-700 border-slate-900 opacity-40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

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
            {/* Banner Panduan Masuk Istana apabila semua soalan selesai */}
            {blocks.every((b) => b.answered) && !stageFinished && !levelTransitionModal && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 text-white font-heading font-black text-xs sm:text-sm px-4 py-1.5 rounded-2xl border-2 border-white shadow-2xl flex items-center gap-2 animate-bounce pointer-events-none text-center">
                <span>🏰</span>
                <span>PINTU ISTANA TERBUKA! Bimbing Mario masuk ke pintu istana (🚪) untuk mara!</span>
                <span>➔</span>
              </div>
            )}

            <div
              className="absolute top-0 bottom-0 flex"
              style={{
                width: `${WORLD_WIDTH}px`,
                transform: `translateX(-${cameraX}px)`,
                transition: 'transform 0.1s linear'
              }}
            >
              {/* Level 1 & 2 Clouds / Level 3 Castle Embers */}
              {currentLevel !== 3 ? (
                <>
                  <div className="absolute top-6 left-60 text-white/90 text-4xl pointer-events-none animate-pulse">☁️</div>
                  <div className="absolute top-12 left-[520px] text-white/90 text-5xl pointer-events-none">☁️</div>
                  <div className="absolute top-8 left-[980px] text-white/90 text-4xl pointer-events-none">☁️</div>
                </>
              ) : (
                <>
                  <div className="absolute top-4 left-60 text-red-400/80 text-2xl pointer-events-none animate-bounce">🔥</div>
                  <div className="absolute top-10 left-[480px] text-orange-400/70 text-xl pointer-events-none animate-pulse">✨</div>
                  <div className="absolute top-6 left-[860px] text-red-400/80 text-2xl pointer-events-none animate-bounce">🔥</div>
                  <div className="absolute top-8 left-[1100px] text-yellow-400/90 text-2xl pointer-events-none animate-pulse">⚡</div>
                </>
              )}

              {/* Bushes / Pipes for Level 1 & 2 */}
              {currentLevel !== 3 && (
                <>
                  <div className="absolute bottom-16 left-32 w-28 h-12 bg-emerald-500 rounded-t-full border-t-4 border-emerald-600 opacity-90" />
                  <div className="absolute bottom-16 left-[440px] w-36 h-14 bg-emerald-600 rounded-t-full border-t-4 border-emerald-700 opacity-90" />
                  <div className="absolute bottom-16 left-[380px] w-14 h-20 bg-emerald-500 border-4 border-emerald-700 rounded-t-lg shadow-lg flex flex-col items-center">
                    <div className="w-16 h-6 bg-emerald-400 border-2 border-emerald-800 rounded-t -mt-1 shadow" />
                  </div>
                </>
              )}

              {/* Floating Brick Blocks & [?] Mystery Question Blocks */}
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
                    {isBlinking && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center text-2xl animate-bounce pointer-events-none drop-shadow-[0_0_12px_#fde047]">
                        ✨
                      </div>
                    )}

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
                    </div>

                    <div className="mt-1 text-center">
                      <span className="text-[10px] font-heading font-black px-1.5 py-0.5 rounded-full border shadow whitespace-nowrap bg-black/75 text-amber-300 border-amber-400/60">
                        {block.answered ? `Soalan ${block.id} Selesai` : `Soalan ${block.id}`}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Gold Floating Coins */}
              {worldCoins.map(
                (coin) =>
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
              )}

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

              {/* LEVEL 1 & 2: Castle & Flagpole */}
              {currentLevel !== 3 && (
                <div className="absolute bottom-16 left-[1080px] flex items-end">
                  <div className="relative flex flex-col items-center">
                    <div className="w-3.5 h-44 bg-slate-300 border-2 border-slate-600 rounded-t" />
                    <div className="absolute top-3 -right-8 w-10 h-7 bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center font-black text-white text-xs shadow animate-pulse">
                      TP
                    </div>
                    <div className="w-10 h-4 bg-emerald-700 border border-emerald-900 rounded" />
                  </div>

                  <div className="ml-6 w-32 h-36 bg-[#c84b31] border-4 border-[#7a1c0d] rounded-t-xl flex flex-col items-center relative shadow-xl">
                    <div className="w-full flex justify-between px-2 -mt-3">
                      <div className="w-6 h-5 bg-[#7a1c0d] rounded-t" />
                      <div className="w-6 h-5 bg-[#7a1c0d] rounded-t" />
                      <div className="w-6 h-5 bg-[#7a1c0d] rounded-t" />
                    </div>
                    <span className="text-2xl mt-3">🏰</span>
                    <span className="text-[10px] font-heading font-black text-amber-200 mt-1 uppercase tracking-wider">
                      {currentLevel === 1 ? 'Istana Tahap 1' : 'Pintu Istana Bos'}
                    </span>
                    <div
                      className={`absolute bottom-0 w-10 h-14 bg-black rounded-t-full border-t-2 ${
                        blocks.every((b) => b.answered)
                          ? 'border-yellow-300 shadow-[0_0_15px_#fde047]'
                          : 'border-amber-500'
                      } flex items-center justify-center`}
                    >
                      {!blocks.every((b) => b.answered) ? (
                        <span className="text-base animate-pulse">🔒</span>
                      ) : (
                        <span className="text-base animate-bounce">🚪✨</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* LEVEL 3: BOS BOWSER & PRINCESS PEACH IN CASTLE ARENA */}
              {currentLevel === 3 && (
                <div className="absolute bottom-16 left-[1180px] flex items-end gap-6">
                  {/* Bowser Boss Monster */}
                  <div
                    className={`relative flex flex-col items-center transition-all duration-500 ${
                      bossDefeated
                        ? 'translate-y-24 opacity-0 rotate-45 scale-75'
                        : 'animate-bounce-short'
                    }`}
                  >
                    {/* Fire Breath Animation */}
                    {!bossDefeated && (
                      <div className="absolute -left-10 top-4 text-2xl animate-pulse">
                        🔥
                      </div>
                    )}

                    {/* Bowser Pixel Character Frame */}
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 border-4 border-amber-300 shadow-2xl flex flex-col items-center justify-center relative">
                      {/* Bowser Horns */}
                      <div className="absolute -top-3 w-full flex justify-between px-3">
                        <span className="text-base">🦏</span>
                        <span className="text-base">🦏</span>
                      </div>
                      <span className="text-4xl">👹</span>
                      <span className="text-[10px] font-heading font-black text-white bg-black/70 px-2 py-0.2 rounded-full uppercase mt-1">
                        BOS BOWSER
                      </span>
                    </div>

                    {/* Boss HP Bar over his head */}
                    <div className="absolute -top-7 px-2 py-0.5 bg-black/85 rounded-full border border-red-500 flex items-center gap-1">
                      <span className="text-[9px] font-black text-red-400">HP:</span>
                      <span className="text-[10px] font-black text-white">{bossHp}/4</span>
                    </div>
                  </div>

                  {/* Princess Peach in Golden Cage */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`relative w-20 h-28 flex flex-col items-center justify-center rounded-2xl border-4 transition-all ${
                        bossDefeated
                          ? 'border-yellow-300 bg-yellow-100/80 shadow-[0_0_25px_#fde047]'
                          : 'border-amber-600 bg-amber-950/70'
                      }`}
                    >
                      {/* Cage Bars when boss not defeated */}
                      {!bossDefeated ? (
                        <>
                          <div className="absolute inset-0 flex justify-around pointer-events-none">
                            <div className="w-1 h-full bg-amber-400 shadow" />
                            <div className="w-1 h-full bg-amber-400 shadow" />
                            <div className="w-1 h-full bg-amber-400 shadow" />
                          </div>
                          <span className="text-3xl relative z-0">👸🏼</span>
                          <span className="text-[9px] font-heading font-black text-rose-300 bg-black/60 px-1 rounded mt-1">
                            Puteri Peach
                          </span>
                        </>
                      ) : (
                        /* Rescued Princess Peach Celebration */
                        <div className="flex flex-col items-center animate-bounce">
                          <span className="text-4xl">👸🏼✨</span>
                          <span className="text-[9px] font-heading font-black text-amber-950 bg-yellow-300 px-1.5 py-0.5 rounded-full shadow mt-1">
                            DISELAMATKAN!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MARIO CHARACTER SPRITE */}
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
                <div className="relative w-12 h-15 flex flex-col items-center">
                  {isJumping && (
                    <div className="absolute -top-3.5 right-0.5 z-40 flex flex-col items-center animate-pulse">
                      <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300 shadow-xs flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      </div>
                      <div className="w-2.5 h-3.5 bg-red-600 rounded-b -mt-0.5" />
                    </div>
                  )}

                  {/* Red Cap with visor */}
                  <div
                    className={`w-9 h-4 bg-red-600 rounded-t-lg relative shadow-xs flex items-center justify-end pr-1 transition-transform ${
                      isJumping ? '-rotate-6 -translate-y-0.5' : ''
                    }`}
                  >
                    <div className="w-4 h-1.5 bg-red-700 rounded-r -mr-1" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center -ml-3">
                      <span className="text-[7px] font-black text-red-600">M</span>
                    </div>
                  </div>

                  {/* Face & Mustache */}
                  <div
                    className={`w-7 h-3.5 bg-[#fcd5b5] relative flex items-center justify-between px-1 border-x border-[#d4a373] ${
                      isJumping ? '-rotate-3' : ''
                    }`}
                  >
                    <div className="w-1.5 h-2 bg-blue-600 rounded-full" />
                    <div className="w-4 h-1.5 bg-[#582f0e] rounded-full -mt-0.5" />
                  </div>

                  {/* Overalls & Shirt */}
                  <div className="w-8 h-4 bg-blue-600 rounded-sm relative flex items-center justify-around border-t border-red-600">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    <div
                      className={`absolute -left-1.5 top-0 w-2 h-3.5 bg-red-600 rounded-full ${
                        isJumping ? 'rotate-45 -translate-y-0.5' : ''
                      }`}
                    />
                    {!isJumping && (
                      <div className="absolute -right-1.5 top-0 w-2 h-3.5 bg-red-600 rounded-full" />
                    )}
                  </div>

                  {/* Shoes */}
                  {isJumping ? (
                    <div className="w-9 flex justify-between items-center -mt-0.5">
                      <div className="w-4 h-3 bg-[#6b4226] rounded-sm transform -rotate-25 shadow-xs border-t border-blue-900" />
                      <div className="w-4 h-3 bg-[#6b4226] rounded-sm transform rotate-30 shadow-xs border-t border-blue-900" />
                    </div>
                  ) : (
                    <div className="w-8 flex justify-between">
                      <div className={`w-3.5 h-2.5 bg-[#6b4226] rounded-sm ${isMoving ? 'animate-bounce' : ''}`} />
                      <div
                        className={`w-3.5 h-2.5 bg-[#6b4226] rounded-sm ${isMoving ? 'animate-bounce delay-75' : ''}`}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Retro Ground Bricks Floor (Height: 64px) - Lava for Level 3 */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-16 border-t-4 flex flex-col ${
                  currentLevel === 3
                    ? 'bg-red-950 border-orange-500'
                    : 'bg-[#e76f51] border-[#264653]'
                }`}
              >
                <div
                  className={`h-3 border-b ${
                    currentLevel === 3
                      ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 border-red-700 animate-pulse'
                      : 'bg-emerald-500 border-emerald-700'
                  }`}
                />
                <div
                  className={`flex-1 ${
                    currentLevel === 3
                      ? 'bg-[repeating-linear-gradient(45deg,#7f1d1d,#7f1d1d_10px,#450a0a_10px,#450a0a_20px)]'
                      : 'bg-[repeating-linear-gradient(45deg,#b05d3b,#b05d3b_10px,#944422_10px,#944422_20px)]'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Castle Locked Warning */}
          {showCastleLocked && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-rose-600 text-white font-heading font-black px-4 py-2 rounded-2xl border-2 border-white shadow-2xl flex items-center gap-2 animate-bounce">
              <span>🔒</span>
              <span className="text-xs sm:text-sm">
                Jawab SEMUA {blocks.length} blok soalan dengan betul dahulu sebelum masuk ke kawasan seterusnya!
              </span>
            </div>
          )}

          {/* Power-up Toast */}
          {powerupAnimation && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-amber-400 text-slate-950 font-heading font-black px-4 py-1.5 rounded-full border-2 border-white shadow-xl flex items-center gap-2 animate-bounce">
              <span>⭐ JAWAPAN TEPAT! (+100 PTS)</span>
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
              >
                <span>{scrollLocked ? '🔒 Skrol Web: DIKUNCI' : '🔓 Skrol Web: DIBUKA'}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-black/30 font-medium text-white">Tukar</span>
              </button>
              <span className="hidden sm:inline">
                Tekan <kbd className="px-1.5 py-0.5 bg-slate-800 text-amber-300 rounded border border-slate-600 font-mono text-[10px]">SPACE</kbd> atau <kbd className="px-1.5 py-0.5 bg-slate-800 text-amber-300 rounded border border-slate-600 font-mono text-[10px]">⬆</kbd> untuk Lompat!
              </span>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-3 touch-none">
              <div className="flex items-center gap-2 touch-none">
                <button
                  onPointerDown={(e) => {
                    e.preventDefault();
                    keysPressed.current['ArrowLeft'] = true;
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    keysPressed.current['ArrowLeft'] = false;
                  }}
                  onPointerLeave={() => {
                    keysPressed.current['ArrowLeft'] = false;
                  }}
                  className="w-12 h-11 rounded-2xl bg-slate-800 border-2 border-slate-600 text-white font-black flex items-center justify-center active:bg-amber-500 active:text-slate-950 transition-all shadow touch-none select-none"
                  aria-label="Gerak Kiri"
                >
                  <ArrowLeft size={20} strokeWidth={3} />
                </button>

                <button
                  onPointerDown={(e) => {
                    e.preventDefault();
                    keysPressed.current['ArrowRight'] = true;
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    keysPressed.current['ArrowRight'] = false;
                  }}
                  onPointerLeave={() => {
                    keysPressed.current['ArrowRight'] = false;
                  }}
                  className="w-12 h-11 rounded-2xl bg-slate-800 border-2 border-slate-600 text-white font-black flex items-center justify-center active:bg-amber-500 active:text-slate-950 transition-all shadow touch-none select-none"
                  aria-label="Gerak Kanan"
                >
                  <ArrowRight size={20} strokeWidth={3} />
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  jump();
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  jump();
                }}
                className="px-5 h-11 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 border-2 border-white text-white font-heading font-black text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all touch-none select-none"
              >
                <ArrowUp size={18} strokeWidth={3} />
                <span>LOMPAT</span>
                <span className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/40">
                  SPACE
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Cabaran Ayat Perintah */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="relative max-w-lg w-full bg-gradient-to-b from-amber-50 via-white to-amber-100 rounded-3xl border-4 border-amber-500 shadow-2xl p-5 sm:p-6 text-slate-900">
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-400 border border-amber-600 flex items-center justify-center font-heading font-black text-slate-900">
                  ?
                </span>
                <span className="font-heading font-black text-base text-amber-950">
                  Cabaran Soalan {activeQuestion.id} (Tahap {currentLevel})
                </span>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full uppercase">
                {activeQuestion.jenis}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-100/80 border-2 border-amber-300 mb-4 text-center">
              <p className="text-base sm:text-lg font-heading font-black text-slate-900 leading-snug whitespace-pre-line">
                {activeQuestion.soalan}
              </p>
            </div>

            <div className="space-y-2 mb-3">
              {activeQuestion.pilihan.map((pilihan, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerChoice(pilihan)}
                  className="w-full text-left p-3 rounded-xl bg-white border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-50 font-heading font-bold text-sm text-slate-800 transition-all shadow-xs flex items-center justify-between group active:scale-98 cursor-pointer"
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

      {/* PETA LEVEL MARIO (Dunia Pengembaraan Ayat Perintah) */}
      {showLevelMap && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-xl w-full bg-gradient-to-b from-sky-400 via-emerald-600 to-amber-900 rounded-3xl border-4 border-amber-400 shadow-2xl p-5 sm:p-6 text-white overflow-hidden">
            {/* Retro Map Header */}
            <div className="flex items-center justify-between border-b-2 border-white/30 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl animate-bounce">🗺️</span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-black text-yellow-300 drop-shadow">
                    PETA TAHAP MARIO
                  </h2>
                  <p className="text-xs text-white/90 font-bold">
                    Dunia 1: Pengembaraan Ayat Perintah
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLevelMap(false)}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center font-black text-sm border border-white/40 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Map Path & Levels */}
            <div className="relative my-3 p-4 rounded-2xl bg-black/45 backdrop-blur-sm border-2 border-amber-300/60">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
                {/* Node 1: Tahap 1 */}
                <div
                  className={`p-3.5 rounded-2xl border-3 flex flex-col items-center text-center transition-all ${
                    currentLevel === 1
                      ? 'bg-amber-500/90 border-yellow-200 ring-4 ring-yellow-400 shadow-lg scale-102'
                      : 'bg-slate-900/90 border-emerald-400'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 border-2 border-white flex items-center justify-center text-2xl mb-2 shadow">
                    🍄
                  </div>
                  <span className="text-xs font-heading font-black text-yellow-300 uppercase">
                    Tahap 1
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Padang Rumput
                  </p>
                  <span className="text-[10px] text-emerald-200 mt-0.5">
                    Kenal Pasti Jenis Ayat
                  </span>
                  <div className="mt-3 w-full">
                    <button
                      onClick={() => {
                        setShowLevelMap(false);
                        if (currentLevel !== 1) startLevel(1);
                      }}
                      className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-heading font-black text-xs shadow transition-all active:translate-y-0.5 cursor-pointer"
                    >
                      {currentLevel === 1 ? 'Sedang Main' : 'Main Tahap 1'}
                    </button>
                  </div>
                </div>

                {/* Node 2: Tahap 2 */}
                <div
                  className={`p-3.5 rounded-2xl border-3 flex flex-col items-center text-center transition-all ${
                    maxUnlockedLevel < 2
                      ? 'bg-slate-950/70 border-slate-700 opacity-60'
                      : currentLevel === 2
                      ? 'bg-amber-500/90 border-yellow-200 ring-4 ring-yellow-400 shadow-lg scale-102'
                      : 'bg-slate-900/90 border-blue-400'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-500 border-2 border-white flex items-center justify-center text-2xl mb-2 shadow">
                    {maxUnlockedLevel < 2 ? '🔒' : '🌿'}
                  </div>
                  <span className="text-xs font-heading font-black text-yellow-300 uppercase">
                    Tahap 2
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Lembah Kata Perintah
                  </p>
                  <span className="text-[10px] text-blue-200 mt-0.5">
                    Lengkapkan Kata Perintah
                  </span>
                  <div className="mt-3 w-full">
                    {maxUnlockedLevel >= 2 ? (
                      <button
                        onClick={() => {
                          setShowLevelMap(false);
                          if (currentLevel !== 2) startLevel(2);
                        }}
                        className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-heading font-black text-xs shadow transition-all active:translate-y-0.5 cursor-pointer"
                      >
                        {currentLevel === 2 ? 'Sedang Main' : 'Main Tahap 2'}
                      </button>
                    ) : (
                      <span className="inline-block py-1 px-2 rounded-lg bg-black/60 text-slate-400 text-[11px] font-bold">
                        Selesaikan Tahap 1
                      </span>
                    )}
                  </div>
                </div>

                {/* Node 3: Tahap 3 (Istana Raja Bowser) */}
                <div
                  className={`p-3.5 rounded-2xl border-3 flex flex-col items-center text-center transition-all ${
                    maxUnlockedLevel < 3
                      ? 'bg-slate-950/70 border-slate-700 opacity-60'
                      : currentLevel === 3
                      ? 'bg-amber-500/90 border-yellow-200 ring-4 ring-yellow-400 shadow-lg scale-102'
                      : 'bg-slate-900/90 border-red-500'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-600 border-2 border-white flex items-center justify-center text-2xl mb-2 shadow">
                    {maxUnlockedLevel < 3 ? '🔒' : '🏰'}
                  </div>
                  <span className="text-xs font-heading font-black text-yellow-300 uppercase">
                    Tahap 3
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Istana Raja Bowser
                  </p>
                  <span className="text-[10px] text-red-200 mt-0.5">
                    Selamatkan Puteri Peach
                  </span>
                  <div className="mt-3 w-full">
                    {maxUnlockedLevel >= 3 ? (
                      <button
                        onClick={() => {
                          setShowLevelMap(false);
                          if (currentLevel !== 3) startLevel(3);
                        }}
                        className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-heading font-black text-xs shadow transition-all active:translate-y-0.5 cursor-pointer"
                      >
                        {currentLevel === 3 ? 'Sedang Main' : 'Lawan Bowser'}
                      </button>
                    ) : (
                      <span className="inline-block py-1 px-2 rounded-lg bg-black/60 text-slate-400 text-[11px] font-bold">
                        Selesaikan Tahap 2
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom info & Close button */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
              <div className="flex items-center gap-3 text-xs font-bold text-amber-200">
                <span>Skor: {score} Mata</span>
                <span>•</span>
                <span>Syiling: {coins} 🪙</span>
                <span>•</span>
                <span>Nyawa: {lives} ❤️</span>
              </div>
              <button
                onClick={() => setShowLevelMap(false)}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-heading font-black text-xs transition-all cursor-pointer"
              >
                Tutup Peta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL TRANSITION 1 -> 2 MODAL */}
      {levelTransitionModal === 1 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-md w-full bg-white rounded-3xl border-4 border-emerald-500 shadow-2xl p-6 text-center">
            <div className="w-16 h-16 mx-auto -mt-12 bg-emerald-500 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-3xl animate-bounce">
              ⭐
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-3">
              Tahniah! Tahap 1 Berjaya!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-700 font-bold mt-1">
              Mario telah berjaya memasuki istana setelah menjawab semua soalan dengan tepat!
            </p>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 my-4 text-xs font-bold text-slate-700">
              Seterusnya: <strong>Tahap 2 (3 Soalan)</strong> – Lengkapkan ayat perintah menggunakan kata perintah yang betul!
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => startLevel(2)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-heading font-black text-sm shadow-[0_4px_0_#0f766e] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Masuk ke Tahap 2 ➔</span>
              </button>
              <button
                onClick={() => {
                  setLevelTransitionModal(null);
                  setShowLevelMap(true);
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-black text-xs border border-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🗺️</span>
                <span>Buka Peta Tahap Mario</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL TRANSITION 2 -> 3 (BOSS LEVEL) MODAL */}
      {levelTransitionModal === 2 && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-md w-full bg-slate-900 rounded-3xl border-4 border-red-500 shadow-2xl p-6 text-center text-white">
            <div className="w-16 h-16 mx-auto -mt-12 bg-red-600 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-3xl animate-bounce">
              🔥
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-red-400 mt-3">
              AMARAN: TAHAP RAJA MUSUH MENANTI!
            </h2>
            <p className="text-xs sm:text-sm text-amber-200 font-bold mt-1">
              Mario telah mara ke pintu kubu Raja Musuh Bowser! Puteri Peach menanti pertolonganmu!
            </p>
            <div className="p-3 bg-red-950/80 rounded-2xl border border-red-600 my-4 text-xs font-semibold text-slate-200 text-left space-y-1">
              <p className="font-bold text-amber-300">Misi Selamatkan Puteri:</p>
              <p>• Selesaikan 4 soalan tatabahasa ayat perintah.</p>
              <p>• Kenal pasti jenis ayat dan mana satu yang BUKAN ayat suruhan.</p>
              <p>• Setiap jawapan tepat akan menewaskan Raja Musuh Bowser!</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => startLevel(3)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white font-heading font-black text-sm shadow-[0_4px_0_#7f1d1d] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame size={18} />
                <span>Lawan Raja Musuh & Selamatkan Puteri! 👸🏼</span>
              </button>
              <button
                onClick={() => {
                  setLevelTransitionModal(null);
                  setShowLevelMap(true);
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-heading font-black text-xs border border-amber-500/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🗺️</span>
                <span>Buka Peta Tahap Mario</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL VICTORY MODAL: Princess Peach Rescued! */}
      {princessRescued && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-lg w-full bg-gradient-to-b from-amber-50 via-white to-pink-50 rounded-3xl border-4 border-amber-400 shadow-2xl p-6 sm:p-8 text-center">
            <div className="w-20 h-20 mx-auto -mt-14 bg-gradient-to-tr from-pink-500 via-rose-400 to-yellow-400 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-4xl animate-bounce">
              👑
            </div>

            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-2xl">✨</span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                Puteri Peach Telah Diselamatkan!
              </h2>
              <span className="text-2xl">✨</span>
            </div>

            {/* Princess Peach Speech Bubble */}
            <div className="my-4 p-4 rounded-2xl bg-pink-100 border-2 border-pink-300 shadow-inner text-center">
              <p className="text-base sm:text-lg font-heading font-bold text-pink-950 italic">
                “Terima kasih Wira Mario! Berkat pengetahuan tatabahasa ayat perintah kamu, Raja Musuh Bowser telah ditewaskan dan beta berjaya dibebaskan!”
              </p>
              <span className="text-xs font-heading font-black text-pink-700 block mt-2">
                — Puteri Peach 💖
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Jumlah Markah</span>
                <span className="text-2xl font-black text-amber-950">{score} Mata</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Syiling Emas</span>
                <span className="text-2xl font-black text-amber-950">{coins} 🪙</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playSuccess();
                onComplete(score, coins);
                onBack();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-heading font-black text-base shadow-[0_4px_0_#0f766e] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Selesai & Simpan Pencapaian ke Rekod PBD</span>
              <span>🏆</span>
            </button>
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
              Jangan berputus asa! Ingat kembali 4 jenis ayat perintah (suruhan, larangan, silaan, permintaan) dan cuba lagi.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={handleRetryAfterGameOver}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-heading font-black text-sm shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            else if (subStage === 'playing') {
              if (currentLevel > 1) {
                startLevel((currentLevel - 1) as 1 | 2);
              } else {
                setSubStage('intro');
              }
            }
          }}
          disabled={subStage === 'intro'}
        />

        <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-4 py-1.5 rounded-full shadow-sm">
          {subStage === 'intro' && 'Pengenalan (Wira Mario)'}
          {subStage === 'rules' && 'Cara Bermain'}
          {subStage === 'guide' && 'Panduan Murid'}
          {subStage === 'playing' && `Tahap ${currentLevel} (Markah: ${score})`}
        </div>

        <WoodArrowButton
          direction="next"
          onClick={() => {
            if (subStage === 'intro') setSubStage('rules');
            else if (subStage === 'rules') {
              setSubStage('playing');
              startLevel(1);
            } else if (subStage === 'playing') {
              if (blocks.every((b) => b.answered)) {
                triggerLevelEnd();
              } else {
                setShowCastleLocked(true);
                setTimeout(() => setShowCastleLocked(false), 2500);
              }
            }
          }}
        />
      </div>
    </div>
  );
};
