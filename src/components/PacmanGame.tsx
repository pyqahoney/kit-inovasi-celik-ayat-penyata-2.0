import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Flame,
  Gamepad2,
  BookOpen
} from 'lucide-react';
import { sound } from '../utils/audio';
import { TopNavBar, WoodArrowButton } from './OrganicNav';

interface PacmanGameProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onComplete: (score: number, coins: number) => void;
}

// Ayat Perintah Power Pellets Challenges
interface PowerPelletChallenge {
  id: number;
  jenis: 'Ayat Suruhan' | 'Ayat Larangan' | 'Ayat Silaan' | 'Ayat Permintaan';
  soalan: string;
  ayatPenuh: string;
  warna: string;
  simbol: string;
  pilihan: {
    teks: string;
    betul: boolean;
    maklumBalas: string;
  }[];
}

const POWER_CHALLENGES: PowerPelletChallenge[] = [
  {
    id: 1,
    jenis: 'Ayat Suruhan',
    warna: '#ef4444', // Red
    simbol: '⚡',
    soalan: 'Pilih ayat suruhan',
    ayatPenuh: 'Sediakan buku catatan Bahasa Melayu kamu sebelum kelas bermula.',
    pilihan: [
      { teks: 'Sediakan buku catatan kamu sebelum kelas bermula.', betul: true, maklumBalas: 'Tepat sekali! "Sediakan" ialah kata perintah suruhan yang jelas.' },
      { teks: 'Bolehkah saya pinjam pembaris kamu?', betul: false, maklumBalas: 'Kurang tepat. Itu ayat tanya / permintaan sopan.' },
      { teks: 'Wah, cantiknya tulisan kamu!', betul: false, maklumBalas: 'Salah. Itu ayat seruan.' }
    ]
  },
  {
    id: 2,
    jenis: 'Ayat Larangan',
    warna: '#a855f7', // Purple
    simbol: '⛔',
    soalan: 'Pilih ayat larangan',
    ayatPenuh: 'Jangan sesekali bermain di kawasan landasan kereta api itu.',
    pilihan: [
      { teks: 'Tolong belikan saya pensel warna.', betul: false, maklumBalas: 'Salah. "Tolong" ialah kata perintah permintaan.' },
      { teks: 'Jangan sesekali bermain di kawasan landasan kereta api itu.', betul: true, maklumBalas: 'Syabas! "Jangan" melarang seseorang melakukan sesuatu perkara.' },
      { teks: 'Sila beratur di kantin semasa membeli makanan.', betul: false, maklumBalas: 'Salah. "Sila" ialah kata silaan.' }
    ]
  },
  {
    id: 3,
    jenis: 'Ayat Silaan',
    warna: '#10b981', // Green
    simbol: '🌟',
    soalan: 'Pilih ayat silaan',
    ayatPenuh: 'Jemputlah masuk ke dalam dewan dan nikmati hidangan kuih-muih ini.',
    pilihan: [
      { teks: 'Jemputlah masuk dan nikmati hidangan kuih-muih ini.', betul: true, maklumBalas: 'Cemerlang! "Jemput" dan "Sila" ialah kata silaan untuk menjemput orang.' },
      { teks: 'Usah dikenang perkara yang sudah berlalu.', betul: false, maklumBalas: 'Kurang tepat. "Usah" ialah kata larangan.' },
      { teks: 'Kemaskan meja kamu sekarang!', betul: false, maklumBalas: 'Kurang tepat. Itu ayat suruhan tegas.' }
    ]
  },
  {
    id: 4,
    jenis: 'Ayat Permintaan',
    warna: '#3b82f6', // Blue
    simbol: '💫',
    soalan: 'Pilih ayat permintaan',
    ayatPenuh: 'Minta semua hadirin berdiri tegak semasa lagu Negaraku dinyanyikan.',
    pilihan: [
      { teks: 'Minta semua hadirin berdiri tegak semasa lagu Negaraku dimainkan.', betul: true, maklumBalas: 'Hebat! "Minta" dan "Tolong" digunakan untuk memohon pertolongan/keizinan.' },
      { teks: 'Jangan bising di dalam perpustakaan!', betul: false, maklumBalas: 'Salah. Itu ayat larangan.' },
      { teks: 'Pergi bersihkan papan hitam di hadapan.', betul: false, maklumBalas: 'Kurang tepat. Itu ayat suruhan.' }
    ]
  }
];

// Grid Maze representation:
// 1 = Wall
// 0 = Pellet
// 2 = Power Pellet (Special Challenge)
// 3 = Ghost House / Empty
// 4 = Fruit / Bonus
const MAZE_GRID: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 2, 1],
  [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 3, 3, 3, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 3, 3, 3, 3, 3, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

interface Ghost {
  id: string;
  name: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}

export const PacmanGame: React.FC<PacmanGameProps> = ({
  onBack,
  soundEnabled,
  onToggleSound,
  onComplete
}) => {
  // Navigation stage: intro -> rules -> guide -> playing
  const [subStage, setSubStage] = useState<'intro' | 'rules' | 'guide' | 'playing'>('intro');

  // Game states
  const [grid, setGrid] = useState<number[][]>(() => MAZE_GRID.map((row) => [...row]));
  const [pacman, setPacman] = useState<{ x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' }>({
    x: 7,
    y: 7,
    dir: 'right'
  });
  const [ghosts, setGhosts] = useState<Ghost[]>([
    { id: 'blinky', name: 'Blinky', x: 6, y: 5, dx: 1, dy: 0, color: '#ef4444' },
    { id: 'pinky', name: 'Pinky', x: 7, y: 5, dx: -1, dy: 0, color: '#ec4899' },
    { id: 'inky', name: 'Inky', x: 8, y: 5, dx: 0, dy: -1, color: '#06b6d4' },
    { id: 'clyde', name: 'Clyde', x: 7, y: 4, dx: 0, dy: 1, color: '#f97316' }
  ]);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [scaredTimer, setScaredTimer] = useState(0); // Scared ghosts mode countdown
  const [activeChallenge, setActiveChallenge] = useState<PowerPelletChallenge | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);
  const [chompFrame, setChompFrame] = useState(false);

  // Direction buffer ref
  const nextDirRef = useRef<'up' | 'down' | 'left' | 'right'>('right');

  // User toggle for web scrolling lock
  const [scrollLocked, setScrollLocked] = useState<boolean>(true);

  // Lock or unlock body scroll dynamically based on user toggle
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

  // Keyboard navigation with conditional preventDefault
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isControlKey =
        e.code === 'Space' ||
        e.key === ' ' ||
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code) ||
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);

      if (scrollLocked && isControlKey) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (activeChallenge || stageFinished) return;

      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.key === 'ArrowUp') {
        nextDirRef.current = 'up';
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS' || e.key === 'ArrowDown') {
        nextDirRef.current = 'down';
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.key === 'ArrowLeft') {
        nextDirRef.current = 'left';
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.key === 'ArrowRight') {
        nextDirRef.current = 'right';
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scrollLocked, activeChallenge, stageFinished]);

  // Scared mode countdown timer
  useEffect(() => {
    if (scaredTimer <= 0) return;
    const timer = setInterval(() => {
      setScaredTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [scaredTimer]);

  // Main Pacman Movement Tick (380ms for relaxed, smooth children gameplay)
  useEffect(() => {
    if (activeChallenge || stageFinished) return;

    const interval = setInterval(() => {
      setChompFrame((prev) => !prev);

      setPacman((prevPacman) => {
        const nextDir = nextDirRef.current;
        let targetX = prevPacman.x;
        let targetY = prevPacman.y;
        let actualDir = prevPacman.dir;

        // Try desired direction
        let tryX = prevPacman.x;
        let tryY = prevPacman.y;
        if (nextDir === 'up') tryY--;
        else if (nextDir === 'down') tryY++;
        else if (nextDir === 'left') tryX--;
        else if (nextDir === 'right') tryX++;

        // Wrap around maze tunnels
        if (tryX < 0) tryX = grid[0].length - 1;
        if (tryX >= grid[0].length) tryX = 0;

        // Check if wall
        if (grid[tryY] && grid[tryY][tryX] !== 1) {
          targetX = tryX;
          targetY = tryY;
          actualDir = nextDir;
        } else {
          // Continue current direction if possible
          let contX = prevPacman.x;
          let contY = prevPacman.y;
          if (prevPacman.dir === 'up') contY--;
          else if (prevPacman.dir === 'down') contY++;
          else if (prevPacman.dir === 'left') contX--;
          else if (prevPacman.dir === 'right') contX++;

          if (contX < 0) contX = grid[0].length - 1;
          if (contX >= grid[0].length) contX = 0;

          if (grid[contY] && grid[contY][contX] !== 1) {
            targetX = contX;
            targetY = contY;
          }
        }

        // Eat pellets / power items
        const cellValue = grid[targetY]?.[targetX];
        if (cellValue === 0) {
          // Regular Pellet
          sound.playChomp();
          setScore((s) => s + 10);
          setGrid((oldGrid) => {
            const newGrid = oldGrid.map((r) => [...r]);
            newGrid[targetY][targetX] = 3; // Empty
            return newGrid;
          });
        } else if (cellValue === 4) {
          // Cherry / Bonus fruit
          sound.playCoin();
          setScore((s) => s + 150);
          setCoins((c) => c + 15);
          setGrid((oldGrid) => {
            const newGrid = oldGrid.map((r) => [...r]);
            newGrid[targetY][targetX] = 3;
            return newGrid;
          });
        } else if (cellValue === 2) {
          // Power Pellet -> Trigger Ayat Perintah Challenge!
          sound.playCoin();
          const challengeIdx = answeredCount % POWER_CHALLENGES.length;
          const challenge = POWER_CHALLENGES[challengeIdx];
          setActiveChallenge(challenge);

          setGrid((oldGrid) => {
            const newGrid = oldGrid.map((r) => [...r]);
            newGrid[targetY][targetX] = 3;
            return newGrid;
          });
        }

        // Check level victory condition (all pellets eaten)
        let remainingPellets = 0;
        grid.forEach((row) => {
          row.forEach((cell) => {
            if (cell === 0 || cell === 2) remainingPellets++;
          });
        });

        if (remainingPellets <= 1 && answeredCount >= 3) {
          triggerVictory();
        }

        return { x: targetX, y: targetY, dir: actualDir };
      });

      // Move ghosts
      setGhosts((prevGhosts) =>
        prevGhosts.map((ghost) => {
          const dirs = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
          ];

          // Filter valid non-wall moves
          const validMoves = dirs.filter((d) => {
            const nx = ghost.x + d.dx;
            const ny = ghost.y + d.dy;
            return grid[ny] && grid[ny][nx] !== 1 && !(d.dx === -ghost.dx && d.dy === -ghost.dy);
          });

          const chosen =
            validMoves.length > 0
              ? validMoves[Math.floor(Math.random() * validMoves.length)]
              : dirs[0];

          let nextX = ghost.x + chosen.dx;
          let nextY = ghost.y + chosen.dy;

          if (nextX < 0) nextX = grid[0].length - 1;
          if (nextX >= grid[0].length) nextX = 0;

          // Check collision with Pac-Man
          if (nextX === pacman.x && nextY === pacman.y) {
            handlePacmanGhostCollision(ghost);
          }

          return {
            ...ghost,
            x: nextX,
            y: nextY,
            dx: chosen.dx,
            dy: chosen.dy
          };
        })
      );
    }, 380);

    return () => clearInterval(interval);
  }, [grid, pacman, activeChallenge, stageFinished, answeredCount]);

  const handlePacmanGhostCollision = useCallback((ghost: Ghost) => {
    if (scaredTimer > 0) {
      // Pacman eats ghost!
      sound.playEatGhost();
      setScore((s) => s + 200);
      setCoins((c) => c + 10);
      // Reset ghost to ghost house
      setGhosts((all) =>
        all.map((g) => (g.id === ghost.id ? { ...g, x: 7, y: 5 } : g))
      );
    } else {
      // Pacman caught
      sound.playWrong();
      setLives((l) => {
        const nextLives = l - 1;
        if (nextLives <= 0) {
          // Restart position
          setPacman({ x: 7, y: 7, dir: 'right' });
          return 3;
        }
        setPacman({ x: 7, y: 7, dir: 'right' });
        return nextLives;
      });
    }
  }, [scaredTimer]);

  const handleChallengeAnswer = (choice: { teks: string; betul: boolean; maklumBalas: string }) => {
    if (!activeChallenge) return;

    if (choice.betul) {
      sound.playApplause();
      setFeedback({ isCorrect: true, text: choice.maklumBalas });
      setScore((prev) => prev + 150);
      setCoins((prev) => prev + 15);
      setAnsweredCount((prev) => prev + 1);

      // Turn ghosts into Scared mode!
      setScaredTimer(10);

      setTimeout(() => {
        setActiveChallenge(null);
        setFeedback(null);
      }, 1800);
    } else {
      sound.playWrong();
      setFeedback({ isCorrect: false, text: choice.maklumBalas });
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  const triggerVictory = () => {
    setStageFinished(true);
    sound.playFanfare();
  };

  // Convert rotation degree based on direction
  const getPacmanRotation = (dir: 'up' | 'down' | 'left' | 'right') => {
    switch (dir) {
      case 'right':
        return 'rotate(0deg)';
      case 'down':
        return 'rotate(90deg)';
      case 'left':
        return 'rotate(180deg) scaleY(-1)';
      case 'up':
        return 'rotate(270deg)';
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full mx-auto select-none touch-none animate-fade-in pb-2">
      {/* Top Bar Navigation */}
      <TopNavBar
        onHome={onBack}
        onExit={onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onHelp={() => sound.speakMalay("Gunakan anak panah untuk menggerakkan Pac-Man memakan bintik dan bintang kuasa ayat perintah!")}
        title="Game Kuasa Pac-Man: Labirin Ayat Perintah"
      />

      {/* Screen 1: Pengenalan Game Kuasa Pac-Man */}
      {subStage === 'intro' && (
        <div
          className="relative my-2 w-full rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl flex flex-col justify-between p-6 sm:p-8 min-h-[460px] sm:min-h-[500px] select-none animate-fade-in"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.8)), url('/assets/aistudio/halaman_game_pacman_9df0c15e.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto z-10">
            <div className="w-20 h-20 rounded-3xl bg-yellow-400 border-4 border-white shadow-2xl flex items-center justify-center text-4xl mb-4 animate-bounce">
              🟡
            </div>

            <div className="bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border-4 border-yellow-400 shadow-2xl text-white">
              <h1 className="text-3xl sm:text-4xl font-heading font-black text-yellow-400 drop-shadow-sm uppercase tracking-wide">
                Game Kuasa Pac-Man
              </h1>
              <span className="inline-block mt-1 px-3 py-1 bg-yellow-400 text-slate-950 rounded-full text-xs font-heading font-black">
                Misi Labirin: Ayat Perintah
              </span>
              <p className="text-slate-200 text-sm sm:text-base font-semibold mt-3 leading-relaxed">
                Kembara Labirin Ayat Perintah bersama Pac-Man! Makan bintik kuasa untuk membuka cabaran tatabahasa, tewaskan hantu nakal, dan kuasai 4 jenis ayat perintah!
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  sound.playSuccess();
                  setSubStage('rules');
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-heading font-black text-base shadow-[0_5px_0_#b45309] active:translate-y-1 transition-all flex items-center gap-2"
              >
                <Gamepad2 size={20} />
                <span>Mula Misi 🟡</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSubStage('rules');
                }}
                className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-yellow-400 font-heading font-black text-sm border-2 border-yellow-400 shadow-[0_5px_0_#0f172a] active:translate-y-1 transition-all flex items-center gap-2"
              >
                <BookOpen size={18} />
                <span>Cara Bermain</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen 2: Cara Bermain Game Kuasa Pac-Man */}
      {subStage === 'rules' && (
        <div
          className="relative my-2 w-full rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl flex flex-col justify-between p-6 sm:p-8 min-h-[460px] sm:min-h-[500px] select-none animate-fade-in"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url('/assets/aistudio/halaman_game_pacman_9df0c15e.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center my-2 z-10">
            <div className="relative max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-4 border-yellow-400 shadow-[0_8px_0_#713f12] text-white">
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-yellow-400 text-center mb-4">
                Cara Bermain
              </h2>

              <div className="space-y-3 text-sm sm:text-base font-bold text-slate-200">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">1</span>
                  <p>Gunakan butang anak panah di skrin atau papan kekunci untuk menggerakkan Pac-Man di dalam labirin.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">2</span>
                  <p>Kutip semua bintik kuning kecil untuk mengumpul markah dan syiling emas.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">3</span>
                  <p>Makan <strong>Bintang Kuasa (⭐)</strong> di penjuru untuk membuka cabaran soalan ayat perintah!</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">4</span>
                  <p>Jawapan yang betul menukarkan hantu menjadi <strong>Hantu Biru</strong> yang boleh dimakan untuk mata bonus gergasi!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 3: Panduan untuk Murid */}
      {subStage === 'guide' && (
        <div
          className="relative my-2 w-full rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl flex flex-col justify-between p-6 sm:p-8 min-h-[460px] sm:min-h-[500px] select-none animate-fade-in"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url('/assets/aistudio/halaman_game_pacman_9df0c15e.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center my-2 z-10">
            <div className="relative max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-4 border-yellow-400 shadow-[0_8px_0_#713f12] text-white">
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-yellow-400 text-center mb-5">
                Panduan untuk Murid
              </h2>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-bold text-slate-200">
                <div className="flex flex-col items-center p-3 bg-slate-800/90 rounded-2xl border-2 border-yellow-500/60 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center font-black text-xl text-slate-950 mb-1">
                    •
                  </div>
                  <span className="font-heading font-black text-yellow-300">Bintik Kuning</span>
                  <span className="text-[11px] text-slate-300 mt-0.5">Kumpul untuk markah & syiling</span>
                </div>

                <div className="flex flex-col items-center p-3 bg-slate-800/90 rounded-2xl border-2 border-yellow-500/60 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 border-2 border-white flex items-center justify-center font-black text-xl text-slate-950 mb-1">
                    ⭐
                  </div>
                  <span className="font-heading font-black text-yellow-300">Bintang Kuasa</span>
                  <span className="text-[11px] text-slate-300 mt-0.5">Membuka soalan Ayat Perintah</span>
                </div>

                <div className="flex flex-col items-center p-3 bg-slate-800/90 rounded-2xl border-2 border-yellow-500/60 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-cyan-600 border-2 border-cyan-300 flex items-center justify-center font-black text-xl text-white mb-1">
                    👻
                  </div>
                  <span className="font-heading font-black text-cyan-300">Hantu Biru</span>
                  <span className="text-[11px] text-slate-300 mt-0.5">Makan hantu untuk +200 mata!</span>
                </div>

                <div className="flex flex-col items-center p-3 bg-slate-800/90 rounded-2xl border-2 border-yellow-500/60 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-rose-600 border-2 border-rose-300 flex items-center justify-center font-black text-xl text-white mb-1">
                    🍒
                  </div>
                  <span className="font-heading font-black text-rose-300">Buah Ceri</span>
                  <span className="text-[11px] text-slate-300 mt-0.5">Bonus gergasi +150 mata</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 4: Retro Arcade Pac-Man Canvas Frame */}
      {subStage === 'playing' && (
      <div
        className="relative my-2 w-full rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl flex flex-col justify-between select-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/assets/aistudio/halaman_game_pacman_9df0c15e.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Arcade HUD Header */}
        <div className="relative z-30 bg-slate-950/95 px-3 sm:px-4 py-2 flex items-center justify-between text-yellow-400 font-mono text-xs sm:text-sm border-b-2 border-yellow-500/50">
          <div className="flex items-center gap-1.5 font-black">
            <span>PAC-MAN</span>
            <span className="text-white">{String(score).padStart(6, '0')}</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300 font-black">
            <span className="text-base">🪙</span>
            <span>× {coins}</span>
          </div>

          {/* Responsive Orientation Indicator Pill */}
          <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-yellow-300 bg-yellow-950/80 px-2.5 py-0.5 rounded-full border border-yellow-400/50">
            <span>🖥️</span>
            <span>Landskap Desktop Arcade</span>
          </div>
          <div className="flex md:hidden items-center gap-1 text-[10px] font-bold text-yellow-200 bg-yellow-950/80 px-2 py-0.5 rounded-full border border-yellow-400/40">
            <span>📱</span>
            <span>Potret Telefon</span>
          </div>

          {/* Scared mode indicator */}
          {scaredTimer > 0 && (
            <div className="flex items-center gap-1 text-cyan-300 font-black animate-pulse bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-400 text-xs">
              <Flame size={14} className="text-cyan-400" />
              <span>HANTU BIRU: {scaredTimer}s</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-yellow-300 font-black">
            <span>NYAWA:</span>
            <div className="flex gap-1 text-base">
              {Array.from({ length: lives }).map((_, i) => (
                <span key={i} className="text-yellow-400">🟡</span>
              ))}
            </div>
          </div>
        </div>

        {/* The Maze Viewport */}
        <div className="relative flex-1 p-3 flex items-center justify-center bg-[#070b19] overflow-hidden">
          <div
            className="relative p-2 rounded-2xl bg-[#030712] border-2 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)] w-full max-w-[560px] aspect-[15/11] overflow-hidden select-none"
          >
            {/* 1. Background Grid: Walls, Pellets, Power Stars, and Cherries */}
            <div
              className="grid gap-1 w-full h-full"
              style={{
                gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`
              }}
            >
              {grid.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  // Wall Cell
                  if (cell === 1) {
                    return (
                      <div
                        key={`wall-${rIdx}-${cIdx}`}
                        className="w-full h-full rounded-sm bg-gradient-to-br from-blue-700 to-blue-950 border border-blue-500/80 shadow-xs"
                      />
                    );
                  }

                  return (
                    <div
                      key={`cell-${rIdx}-${cIdx}`}
                      className="relative w-full h-full flex items-center justify-center bg-transparent"
                    >
                      {/* Standard Pellet */}
                      {cell === 0 && (
                        <div className="w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_6px_#fef08a]" />
                      )}

                      {/* Power Pellet (Special Ayat Perintah Star) */}
                      {cell === 2 && (
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-yellow-300 animate-pulse shadow-[0_0_10px_#facc15] flex items-center justify-center text-[9px] font-black text-black">
                          ⭐
                        </div>
                      )}

                      {/* Bonus Cherry */}
                      {cell === 4 && (
                        <span className="text-sm animate-bounce">🍒</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* 2. Smooth Gliding Pac-Man Overlay */}
            <div
              className="absolute z-20 flex items-center justify-center pointer-events-none"
              style={{
                width: `${100 / grid[0].length}%`,
                height: `${100 / grid.length}%`,
                left: `${(pacman.x / grid[0].length) * 100}%`,
                top: `${(pacman.y / grid.length) * 100}%`,
                transition: 'left 350ms linear, top 350ms linear'
              }}
            >
              <div
                className="relative w-6 h-6 transition-transform duration-100"
                style={{ transform: getPacmanRotation(pacman.dir) }}
              >
                <div
                  className={`w-full h-full rounded-full bg-yellow-400 shadow-[0_0_12px_#facc15] relative ${
                    chompFrame ? 'clip-mouth-open' : 'clip-mouth-half'
                  }`}
                  style={{
                    clipPath: chompFrame
                      ? 'polygon(100% 0%, 50% 50%, 100% 100%, 100% 100%, 0% 100%, 0% 0%)'
                      : 'polygon(100% 20%, 50% 50%, 100% 80%, 100% 100%, 0% 100%, 0% 0%)'
                  }}
                />
                <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>
            </div>

            {/* 3. Smooth Gliding Ghosts Overlay */}
            {ghosts.map((ghost) => (
              <div
                key={ghost.id}
                className="absolute z-10 flex items-center justify-center pointer-events-none"
                style={{
                  width: `${100 / grid[0].length}%`,
                  height: `${100 / grid.length}%`,
                  left: `${(ghost.x / grid[0].length) * 100}%`,
                  top: `${(ghost.y / grid.length) * 100}%`,
                  transition: 'left 350ms linear, top 350ms linear'
                }}
              >
                <div
                  className={`w-6 h-6 rounded-t-full relative flex flex-col justify-between items-center p-0.5 shadow-md ${
                    scaredTimer > 0 ? 'bg-blue-600 animate-pulse' : ''
                  }`}
                  style={{
                    backgroundColor: scaredTimer > 0 ? '#1d4ed8' : ghost.color
                  }}
                >
                  <div className="flex gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-blue-900" />
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-blue-900" />
                    </div>
                  </div>
                  <div className="w-full flex justify-between px-0.5">
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Keyboard Controls Footer */}
        <div className="relative z-30 bg-black/95 backdrop-blur px-3 py-2 border-t-2 border-yellow-500 flex flex-col sm:flex-row items-center justify-between gap-2 touch-none">
          <div className="flex items-center gap-2 text-[11px] text-yellow-300 font-bold">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setScrollLocked((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer select-none active:scale-95 ${
                scrollLocked
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300 hover:bg-yellow-300'
                  : 'bg-slate-800 text-yellow-300 border-slate-600 hover:bg-slate-700'
              }`}
              title="Klik untuk buka atau kunci skrol halaman web"
            >
              <span>{scrollLocked ? '🔒 Skrol Web: DIKUNCI' : '🔓 Skrol Web: DIBUKA'}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-black/30 font-medium text-white">Tukar</span>
            </button>
            <span className="hidden sm:inline">
              Gunakan <kbd className="px-1.5 py-0.5 bg-slate-800 text-yellow-300 rounded border border-slate-600 font-mono text-[10px]">⬆ ⬇ ⬅ ➔</kbd> atau <kbd className="px-1.5 py-0.5 bg-slate-800 text-yellow-300 rounded border border-slate-600 font-mono text-[10px]">W A S D</kbd> untuk Pac-Man!
            </span>
          </div>

          {/* On-Screen Touch D-PAD Buttons */}
          <div className="flex items-center gap-1.5 touch-none">
            <button
              onPointerDown={(e) => { e.preventDefault(); nextDirRef.current = 'left'; }}
              className="w-11 h-10 rounded-2xl bg-slate-800 border-2 border-slate-600 text-yellow-400 font-black flex items-center justify-center active:bg-yellow-500 active:text-slate-950 transition-all shadow touch-none select-none"
              aria-label="Kiri"
            >
              <ArrowLeft size={18} strokeWidth={3} />
            </button>

            <div className="flex flex-col gap-1">
              <button
                onPointerDown={(e) => { e.preventDefault(); nextDirRef.current = 'up'; }}
                className="w-11 h-8 rounded-xl bg-slate-800 border-2 border-slate-600 text-yellow-400 font-black flex items-center justify-center active:bg-yellow-500 active:text-slate-950 transition-all shadow touch-none select-none"
                aria-label="Atas"
              >
                <ArrowUp size={16} strokeWidth={3} />
              </button>
              <button
                onPointerDown={(e) => { e.preventDefault(); nextDirRef.current = 'down'; }}
                className="w-11 h-8 rounded-xl bg-slate-800 border-2 border-slate-600 text-yellow-400 font-black flex items-center justify-center active:bg-yellow-500 active:text-slate-950 transition-all shadow touch-none select-none"
                aria-label="Bawah"
              >
                <ArrowDown size={16} strokeWidth={3} />
              </button>
            </div>

            <button
              onPointerDown={(e) => { e.preventDefault(); nextDirRef.current = 'right'; }}
              className="w-11 h-10 rounded-2xl bg-slate-800 border-2 border-slate-600 text-yellow-400 font-black flex items-center justify-center active:bg-yellow-500 active:text-slate-950 transition-all shadow touch-none select-none"
              aria-label="Kanan"
            >
              <ArrowRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* POPUP MODAL: Cabaran Bintang Kuasa Ayat Perintah */}
      {activeChallenge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="relative max-w-lg w-full bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 rounded-3xl border-4 border-yellow-400 shadow-2xl p-5 sm:p-6 text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-yellow-500/40 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-yellow-400 border border-yellow-600 flex items-center justify-center font-heading font-black text-slate-950">
                  {activeChallenge.simbol}
                </span>
                <span className="font-heading font-black text-base text-yellow-400">
                  Kuasa Pac-Man: {activeChallenge.jenis}
                </span>
              </div>
              <span className="text-xs font-bold text-yellow-950 bg-yellow-300 px-2.5 py-0.5 rounded-full uppercase">
                +150 Markah
              </span>
            </div>

            {/* Question Prompt Box (Jawapan disembunyikan daripada kotak soalan) */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border-2 border-yellow-500/60 mb-4 text-center shadow-inner">
              <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-widest block mb-1">
                Cabaran Tatabahasa {activeChallenge.jenis}
              </span>
              <p className="text-base sm:text-lg font-heading font-black text-white leading-snug">
                {activeChallenge.soalan} yang betul:
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Pilih satu pilihan jawapan yang tepat di bawah untuk mengaktifkan kuasa Pac-Man!
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2 mb-3">
              {activeChallenge.pilihan.map((pilihan, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChallengeAnswer(pilihan)}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/90 hover:bg-yellow-500 hover:text-slate-950 border-2 border-yellow-500/50 font-heading font-bold text-sm text-yellow-100 transition-all shadow-xs flex items-center justify-between group active:scale-98"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center text-xs font-black">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{pilihan.teks}</span>
                  </div>
                  <span className="text-yellow-400 group-hover:text-slate-950 group-hover:translate-x-1 transition-transform">➔</span>
                </button>
              ))}
            </div>

            {/* Answer Feedback Banner */}
            {feedback && (
              <div
                className={`p-3 rounded-xl border-2 text-xs font-bold animate-fade-in flex items-center gap-2 ${
                  feedback.isCorrect
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                    : 'bg-rose-950 border-rose-400 text-rose-200'
                }`}
              >
                <span className="text-lg">{feedback.isCorrect ? '🌟' : '❌'}</span>
                <span>{feedback.text}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP VICTORY: Tahniah & Penamat Pengembaraan Pac-Man */}
      {stageFinished && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-md w-full bg-slate-900 rounded-3xl border-4 border-yellow-400 shadow-2xl p-6 text-center text-white">
            <div className="w-20 h-20 mx-auto -mt-12 bg-yellow-400 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-4xl animate-bounce">
              🟡
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-black text-yellow-400 mt-3">
              Tahniah Wira Pac-Man!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-400 font-bold mt-1">
              Kamu telah berjaya membersihkan Labirin Ayat Perintah!
            </p>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-slate-800 rounded-2xl border-2 border-yellow-500/50">
                <span className="text-[10px] font-bold text-yellow-300 uppercase block">Markah Pac-Man</span>
                <span className="text-2xl font-black text-white">{score} PTS</span>
              </div>
              <div className="p-3 bg-slate-800 rounded-2xl border-2 border-yellow-500/50">
                <span className="text-[10px] font-bold text-yellow-300 uppercase block">Syiling Emas</span>
                <span className="text-2xl font-black text-yellow-400">{coins} 🪙</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => {
                  sound.playSuccess();
                  onComplete(score, coins);
                  onBack();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-heading font-black text-sm shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <span>Selesai & Simpan Markah PBS</span>
                <span>🏆</span>
              </button>

              <button
                onClick={() => {
                  setStageFinished(false);
                  setScore(0);
                  setCoins(0);
                  setLives(3);
                  setAnsweredCount(0);
                  setGrid(MAZE_GRID.map((r) => [...r]));
                  setPacman({ x: 7, y: 7, dir: 'right' });
                  sound.playClick();
                }}
                className="w-full py-2 text-xs font-bold text-yellow-300/80 hover:text-yellow-300 underline"
              >
                Main Semula Labirin Ini
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

        <div className="text-xs font-bold text-yellow-400 bg-slate-900/95 border border-yellow-500/50 px-4 py-1.5 rounded-full shadow-sm">
          {subStage === 'intro' && 'Pengenalan (Kuasa Pac-Man)'}
          {subStage === 'rules' && 'Cara Bermain'}
          {subStage === 'guide' && 'Panduan Murid'}
          {subStage === 'playing' && `Labirin (Markah: ${score})`}
        </div>

        <WoodArrowButton
          direction="next"
          onClick={() => {
            if (subStage === 'intro') setSubStage('rules');
            else if (subStage === 'rules') setSubStage('guide');
            else if (subStage === 'guide') setSubStage('playing');
            else if (subStage === 'playing') {
              if (answeredCount >= 4) {
                setStageFinished(true);
              }
            }
          }}
          label={subStage === 'guide' ? 'Mula Main' : undefined}
        />
      </div>
    </div>
  );
};
