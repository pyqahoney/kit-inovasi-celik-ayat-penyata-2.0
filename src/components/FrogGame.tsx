import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TopNavBar, WoodArrowButton } from './OrganicNav';
import { FrogVector } from './IllustratedCharacters';
import { BlueBirdVector, CuteSunVector, FoliageForeground, ButterflyVector } from './StoryGraphics';
import { Camera, CameraOff, Sparkles, RefreshCw, FlipHorizontal, Eye, Maximize2, Mic, MicOff, Volume2, Radio, Hand } from 'lucide-react';
import { sound } from '../utils/audio';

interface FrogGameProps {
  onBack: () => void;
  onHome?: () => void;
  onComplete: (score: number, coins: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const FROG_QUESTIONS = [
  {
    id: 1,
    sentenceStart: '',
    blankText: '_______',
    sentenceEnd: 'hantarkan surat ini kepada Hani dengan segera.',
    fullSentence: 'Tolong hantarkan surat ini kepada Hani dengan segera.',
    options: [
      { key: 'A', text: 'harap', isCorrect: false },
      { key: 'B', text: 'tolong', isCorrect: true },
      { key: 'C', text: 'minta', isCorrect: false }
    ],
    correctOptionKey: 'B',
    explanation: 'Kata "Tolong" tepat untuk memohon pertolongan menghantar surat.'
  },
  {
    id: 2,
    sentenceStart: '',
    blankText: '______',
    sentenceEnd: 'pergi ke kaunter tersebut untuk membuat pembayaran.',
    fullSentence: 'Sila pergi ke kaunter tersebut untuk membuat pembayaran.',
    options: [
      { key: 'A', text: 'jangan', isCorrect: false },
      { key: 'B', text: 'jemput', isCorrect: false },
      { key: 'C', text: 'sila', isCorrect: true }
    ],
    correctOptionKey: 'C',
    explanation: 'Kata silaan "Sila" amat beradab untuk memandu pelanggan ke kaunter.'
  },
  {
    id: 3,
    sentenceStart: '“Tolong berikan penyapu itu kepada saya” merupakan ayat perintah jenis ayat',
    blankText: '___________.',
    sentenceEnd: '',
    fullSentence: '“Tolong berikan penyapu itu kepada saya” merupakan ayat perintah jenis ayat permintaan.',
    options: [
      { key: 'A', text: 'suruhan', isCorrect: false },
      { key: 'B', text: 'permintaan', isCorrect: true },
      { key: 'C', text: 'silaan', isCorrect: false }
    ],
    correctOptionKey: 'B',
    explanation: 'Ayat ini mengandungi kata "Tolong", iaitu kata permintaan.'
  },
  {
    id: 4,
    sentenceStart: 'Terdapat',
    blankText: '_____',
    sentenceEnd: 'jenis ayat perintah.',
    fullSentence: 'Terdapat 4 jenis ayat perintah: suruhan, larangan, silaan dan permintaan.',
    options: [
      { key: 'A', text: '4', isCorrect: true },
      { key: 'B', text: '5', isCorrect: false },
      { key: 'C', text: '3', isCorrect: false }
    ],
    correctOptionKey: 'A',
    explanation: 'Empat jenis ayat perintah ialah: Ayat Suruhan, Ayat Larangan, Ayat Silaan dan Ayat Permintaan.'
  },
  {
    id: 5,
    sentenceStart: '“Keluar dari bilik ini!” merupakan ayat',
    blankText: '____________.',
    sentenceEnd: '',
    fullSentence: '“Keluar dari bilik ini!” merupakan ayat suruhan.',
    options: [
      { key: 'A', text: 'aktif', isCorrect: false },
      { key: 'B', text: 'larangan', isCorrect: false },
      { key: 'C', text: 'suruhan', isCorrect: true }
    ],
    correctOptionKey: 'C',
    explanation: 'Ayat ini memberi arahan terus melakukan perbuatan keluar.'
  }
];

export const FrogGame: React.FC<FrogGameProps> = ({
  onBack,
  onHome,
  onComplete,
  soundEnabled,
  onToggleSound
}) => {
  // Sub-stages: 'intro' | 'rules' | 'guide' | 'ready' | 'playing' | 'celebrate'
  const [subStage, setSubStage] = useState<'intro' | 'rules' | 'guide' | 'ready' | 'playing' | 'celebrate'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLeaf, setSelectedLeaf] = useState<string | null>(null);
  const [frogPosition, setFrogPosition] = useState<'bank' | 'A' | 'B' | 'C' | 'splash'>('bank');
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [flashRed, setFlashRed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Play Frog Module BGM on mount and restore default on unmount
  useEffect(() => {
    sound.playModuleBGM('frog');
    return () => {
      sound.playModuleBGM('default');
    };
  }, []);

  // Augmented Reality (AR) States
  const [arMode, setArMode] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [arRotation, setArRotation] = useState<number>(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Real-world hand detection states (TIDAK Sensitif Warna Kulit - Detect Tangan Sahaja)
  const [detectedHandZone, setDetectedHandZone] = useState<'A' | 'B' | 'C' | null>(null);
  const [handDwellProgress, setHandDwellProgress] = useState<number>(0);
  const [arTimeLeft, setArTimeLeft] = useState<number>(15);
  const [isHandPresent, setIsHandPresent] = useState<boolean>(false);
  const analyzerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);
  const bgLumRef = useRef<Float32Array | null>(null);

  // Oral Mode (Mod Mendengar dan Bertutur) States
  const [oralMode, setOralMode] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [oralResult, setOralResult] = useState<'betul' | 'salah' | null>(null);
  const [oralFeedback, setOralFeedback] = useState<string>('');
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Bind stream to video element whenever cameraActive or arMode changes
  useEffect(() => {
    if (arMode && cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [arMode, cameraActive]);

  const startARCamera = async (targetFacing = facingMode) => {
    try {
      setCameraError(null);
      // Stop old stream if existing
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: targetFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      setCameraActive(true);
      setArMode(true);
      sound.playSuccess();

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch {
      // Fallback to simulated AR mode if device camera is blocked / unsupported
      setCameraError('Kamera tidak dapat diakses. Mod Simulasi AR Maya diaktifkan.');
      setCameraActive(false);
      setArMode(true);
      sound.playSuccess();
    }
  };

  const stopARCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setArMode(false);
  };

  const handleToggleFacingMode = () => {
    sound.playClick();
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (arMode) {
      startARCamera(nextFacing);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const curQ = FROG_QUESTIONS[currentIdx];

  const handleSelectLeaf = (key: string) => {
    if (answerState !== 'idle') return;

    setSelectedLeaf(key);
    sound.playFrogHop();

    // Animate frog jump towards selected lily pad
    setFrogPosition(key as 'A' | 'B' | 'C');

    const isCorrect = key === curQ.correctOptionKey;

    if (isCorrect) {
      setTimeout(() => {
        sound.playApplause();
        setAnswerState('correct');
        setScore((prev) => prev + 1);

        try {
          confetti({
            particleCount: arMode ? 80 : 50,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }, 450);
    } else {
      setTimeout(() => {
        sound.playWaterSplash();
        sound.playWrong();
        setAnswerState('wrong');
        setFrogPosition('splash');
        setFlashRed(true);
        setTimeout(() => setFlashRed(false), 1200);
      }, 450);
    }
  };

  const resetFrogOralState = () => {
    setIsListening(false);
    setSpeechTranscript('');
    setOralResult(null);
    setOralFeedback('');
    setIsSpeakingQuestion(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }
  };

  const handleNextQuestion = () => {
    resetFrogOralState();
    if (currentIdx < FROG_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedLeaf(null);
      setFrogPosition('bank');
      setAnswerState('idle');
    } else {
      // Done all questions!
      const finalScore = score + (answerState === 'correct' ? 1 : 0);
      const earnedCoins = finalScore * 25 + (arMode ? 20 : 0);
      onComplete(finalScore, earnedCoins);
      setSubStage('celebrate');
      sound.playFanfare();
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handleRetryQuestion = () => {
    resetFrogOralState();
    setSelectedLeaf(null);
    setFrogPosition('bank');
    setAnswerState('idle');
  };

  const handleRestart = () => {
    resetFrogOralState();
    setCurrentIdx(0);
    setScore(0);
    setSelectedLeaf(null);
    setFrogPosition('bank');
    setAnswerState('idle');
    setSubStage('intro');
  };

  // Audio reading for oral listening mode
  const speakQuestionAudio = () => {
    sound.playClick();
    setIsSpeakingQuestion(true);
    const correctOpt = curQ.options.find((o) => o.isCorrect);
    const sentenceToRead = curQ.fullSentence.replace(correctOpt?.text || '', 'tempat kosong');
    const optionsPrompt = curQ.options.map((o) => `Daun ${o.key}, ${o.text}`).join('; ');
    const textPrompt = `Soalan ${currentIdx + 1}. ${sentenceToRead}. Pilihan daun teratai ialah: ${optionsPrompt}. Sila sebutkan jawapan daun anda secara lisan!`;
    sound.speakMalay(textPrompt);
    setTimeout(() => {
      setIsSpeakingQuestion(false);
    }, 7000);
  };

  // Evaluate student's oral spoken answer for Frog Game
  const evaluateFrogSpokenText = (transcript: string) => {
    const clean = transcript.toLowerCase().trim().replace(/[.,!?;:"']/g, '');
    if (!clean) return;

    const correctOpt = curQ.options.find((o) => o.isCorrect);
    if (!correctOpt) return;

    const correctWord = correctOpt.text.toLowerCase().trim();
    const correctKey = correctOpt.key.toLowerCase();

    // Check if user says the correct option word or letter
    const isCorrect =
      clean.includes(correctWord) ||
      clean === correctKey ||
      clean === `daun ${correctKey}` ||
      clean === `pilihan ${correctKey}` ||
      clean.includes(`daun ${correctWord}`);

    if (isCorrect) {
      setOralResult('betul');
      setOralFeedback(`Tepat sekali! Sebutan "${transcript}" adalah BETUL! Katak melompat ke Daun ${correctOpt.key}!`);
      sound.speakMalay(`Tepat sekali! Sebutan ${transcript} adalah betul!`);
      handleSelectLeaf(correctOpt.key);
    } else {
      // Check if user spoke one of the other options
      const wrongOpt = curQ.options.find((o) => {
        const wWord = o.text.toLowerCase().trim();
        const wKey = o.key.toLowerCase();
        return clean.includes(wWord) || clean === wKey || clean === `daun ${wKey}`;
      });

      setOralResult('salah');
      if (wrongOpt) {
        setOralFeedback(`Sebutan anda "${transcript}" (Daun ${wrongOpt.key}) belum tepat. Sila cuba lagi!`);
        sound.speakMalay(`Sebutan Daun ${wrongOpt.key} belum tepat. Sila cuba sebut sekali lagi.`);
        handleSelectLeaf(wrongOpt.key);
      } else {
        setOralFeedback(`Suara dikesan: "${transcript}". Jawapan belum tepat. Sila sebut perkataan pada daun yang betul!`);
        sound.speakMalay(`Jawapan belum tepat. Sila cuba sebut perkataan daun teratai sekali lagi.`);
        sound.playWrong();
      }
    }
  };

  // Start Speech Recognition
  const startFrogOralListening = () => {
    sound.playClick();
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setOralFeedback(
        'Pengecaman suara terus tidak disokong pada pelayar ini. Sila sebut jawapan secara lisan dan tekan butang pilihan sebutan di bawah!'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'ms-MY';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript('');
        setOralResult(null);
        setOralFeedback('Sedang mendengar... Sila sebut perkataan jawapan daun anda sekarang 🎙️');
      };

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setSpeechTranscript(text);
        if (event.results[0].isFinal) {
          setIsListening(false);
          evaluateFrogSpokenText(text);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setOralFeedback('Suara belum dikesan dengan jelas. Sila tekan butang mikrofon dan sebut semula.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setOralFeedback('Sila benarkan akses mikrofon pelayar untuk menjawab secara lisan.');
    }
  };

  const stopFrogOralListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    if (speechTranscript) {
      evaluateFrogSpokenText(speechTranscript);
    }
  };

  // Practice oral pronunciation directly
  const handleFrogOralPracticeChoice = (opt: { key: string; text: string }) => {
    sound.playClick();
    setSpeechTranscript(opt.text);
    sound.speakMalay(`Daun ${opt.key}: ${opt.text}`);
    setTimeout(() => {
      evaluateFrogSpokenText(opt.text);
    }, 400);
  };

  // 15-Second AR Hand Gesture Countdown Timer
  useEffect(() => {
    if (!arMode || answerState !== 'idle' || subStage !== 'playing') {
      return;
    }
    setArTimeLeft(15);
    const timer = setInterval(() => {
      setArTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [arMode, currentIdx, answerState, subStage]);

  // When 15 seconds expire in AR mode
  useEffect(() => {
    if (arMode && arTimeLeft === 0 && answerState === 'idle') {
      if (detectedHandZone) {
        sound.playCoin();
        handleSelectLeaf(detectedHandZone);
      } else {
        sound.speakMalay('Masa 15 saat telah tamat. Sila tunjuk simbol tangan sekali lagi!');
        setArTimeLeft(15);
      }
    }
  }, [arTimeLeft, arMode, answerState, detectedHandZone]);

  // Real-Time Optical Hand Tracking in Real World (TIDAK Sensitif Warna Kulit - Detect Tangan Sahaja dalam Kotak)
  useEffect(() => {
    if (!arMode || !cameraActive || answerState !== 'idle' || subStage !== 'playing') {
      setDetectedHandZone(null);
      setIsHandPresent(false);
      setHandDwellProgress(0);
      return;
    }

    let stableCount = 0;
    let candidateZone: 'A' | 'B' | 'C' | null = null;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = analyzerCanvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Draw downscaled frame to analyzer canvas (160 x 120)
      ctx.drawImage(video, 0, 0, 160, 120);
      const frame = ctx.getImageData(0, 0, 160, 120);
      const data = frame.data;
      const totalPixels = 160 * 120;

      // Inisialisasi atau kemas kini baseline latar belakang bilik
      if (!bgLumRef.current || bgLumRef.current.length !== totalPixels) {
        bgLumRef.current = new Float32Array(totalPixels);
        for (let i = 0; i < totalPixels; i++) {
          const pi = i * 4;
          bgLumRef.current[i] = 0.299 * data[pi] + 0.587 * data[pi + 1] + 0.114 * data[pi + 2];
        }
        return;
      }

      const bg = bgLumRef.current;

      // KOTAK SASARAN TANGAN KHAS: Hanya imbas kawasan tengah ini (Mengabaikan muka & badan)
      const boxX1 = 28;
      const boxX2 = 132;
      const boxY1 = 18;
      const boxY2 = 104;

      const colW = (boxX2 - boxX1) / 3;
      const col1End = boxX1 + colW;
      const col2End = boxX1 + colW * 2;
      const midY = boxY1 + (boxY2 - boxY1) * 0.52;

      let totalOccupancy = 0;
      let motionScore = 0;

      let upperLeft = 0;
      let upperMid = 0;
      let upperRight = 0;

      let lowerLeft = 0;
      let lowerMid = 0;
      let lowerRight = 0;

      const prevData = prevFrameDataRef.current;

      for (let y = boxY1; y <= boxY2; y += 2) {
        for (let x = boxX1; x <= boxX2; x += 2) {
          const pixelIdx = y * 160 + x;
          const idx = pixelIdx * 4;

          const curLum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          const bgLum = bg[pixelIdx];
          const diffBg = Math.abs(curLum - bgLum);

          if (prevData) {
            const prevLum = 0.299 * prevData[idx] + 0.587 * prevData[idx + 1] + 0.114 * prevData[idx + 2];
            if (Math.abs(curLum - prevLum) > 16) {
              motionScore++;
            }
          }

          if (diffBg > 18) {
            totalOccupancy++;
            if (y < midY) {
              if (x < col1End) upperLeft++;
              else if (x < col2End) upperMid++;
              else upperRight++;
            } else {
              if (x < col1End) lowerLeft++;
              else if (x < col2End) lowerMid++;
              else lowerRight++;
            }
          } else {
            bg[pixelIdx] = 0.98 * bgLum + 0.02 * curLum;
          }
        }
      }

      prevFrameDataRef.current = new Uint8ClampedArray(data);

      const handPresent = totalOccupancy >= 22 || motionScore >= 16;
      setIsHandPresent(handPresent);

      if (handPresent) {
        const totalUpper = upperLeft + upperMid + upperRight;

        // Pengecaman 3 Simbol Tangan:
        // 1. Daun C = ✋ (Tangan Terbuka): Kawasan okupansi luas ketiga-tiga kolum
        const isBroadHand =
          upperLeft >= 7 &&
          upperMid >= 7 &&
          upperRight >= 7 &&
          totalUpper >= 32;

        // 2. Daun B = ✌️ (2 Jari / Peace): Dua kolum berasingan
        const isTwoFingers =
          !isBroadHand &&
          ((upperLeft >= 6 && upperRight >= 6) ||
           (upperLeft >= 7 && upperMid >= 7 && upperRight <= 5) ||
           (upperMid >= 7 && upperRight >= 7 && upperLeft <= 5));

        let detected: 'A' | 'B' | 'C' = 'A'; // Daun A = ☝️ (1 Jari Telunjuk)

        if (isBroadHand) {
          detected = 'C';
        } else if (isTwoFingers) {
          detected = 'B';
        } else {
          detected = 'A';
        }

        if (detected === candidateZone) {
          stableCount++;
          if (stableCount >= 2) {
            setDetectedHandZone(detected);
            setHandDwellProgress(100);
          }
        } else {
          candidateZone = detected;
          stableCount = 1;
          setHandDwellProgress(50);
        }
      } else {
        stableCount = 0;
      }
    }, 120);

    return () => clearInterval(interval);
  }, [arMode, cameraActive, answerState, subStage, currentIdx]);

  return (
    <div
      className="relative min-h-[580px] md:min-h-[640px] lg:min-h-[700px] w-full mx-auto rounded-3xl overflow-hidden border-4 border-emerald-300 shadow-2xl flex flex-col justify-between p-3 sm:p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.25)), url('/assets/aistudio/halaman_game_katak_ccde46f4.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Top Navbar */}
      <TopNavBar
        onExit={() => {
          stopARCamera();
          onBack();
        }}
        onHome={() => {
          stopARCamera();
          if (onHome) onHome();
          else onBack();
        }}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        title={subStage === 'playing' ? `Soalan ${currentIdx + 1} / ${FROG_QUESTIONS.length}` : 'Lompat Si Katak Lompat'}
      />

      {/* Screen 1: Intro (Page 25) */}
      {subStage === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center my-6 text-center animate-fade-in relative z-10">
          <div className="absolute top-0 right-10">
            <ButterflyVector size={42} />
          </div>

          <div className="relative max-w-lg w-full px-6 py-8 rounded-3xl bg-[#a15c38] border-4 border-[#582f0e] shadow-[0_10px_0_#582f0e] transform hover:scale-102 transition-transform">
            <div className="absolute -top-7 right-4">
              <BlueBirdVector size={50} perched={true} />
            </div>

            <div className="absolute -top-16 left-1/2 -translate-x-1/2">
              <FrogVector pose="happy" size={140} />
            </div>

            <div className="mt-14">
              <span className="block text-amber-200 font-heading tracking-widest text-sm uppercase">PERMAINAN INTERAKTIF PdP</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wider drop-shadow-md mt-1">
                LOMPAT SI KATAK LOMPAT
              </h1>
              <p className="text-amber-100 text-sm mt-2 font-medium">
                Kini dilengkapi <strong>Kamera AR Sebenar</strong>! Bantu Si Katak melompat atas meja belajar anda atau di sungai kartun!
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                sound.playSuccess();
                setSubStage('rules');
              }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-heading font-bold text-lg shadow-[0_6px_0_#065f46] active:translate-y-1 active:shadow-[0_2px_0_#065f46] transition-all transform hover:scale-105"
            >
              Mula Misi 🐸
            </button>
            <button
              onClick={() => {
                startARCamera();
                setSubStage('playing');
              }}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-heading font-black text-base shadow-[0_5px_0_#b45309] active:translate-y-1 transition-all flex items-center gap-2"
            >
              <Camera size={20} />
              <span>Main Terus dalam AR 📷</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Cara Bermain (Page 26) */}
      {subStage === 'rules' && (
        <div className="flex-1 flex flex-col items-center justify-center my-4 animate-fade-in z-10">
          <div className="relative max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#ddb892] border-4 border-[#7f4f24] shadow-[0_8px_0_#582f0e]">
            <div className="absolute -top-6 left-8 w-3 h-10 bg-[#7f4f24] rounded-full" />
            <div className="absolute -top-6 right-8 w-3 h-10 bg-[#7f4f24] rounded-full" />

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#582f0e] text-center mb-4">
              Cara Bermain
            </h2>

            <div className="space-y-3.5 text-base sm:text-lg font-medium text-[#432818]">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">1</span>
                <p>Murid boleh memilih <strong>Mod Sungai</strong> atau <strong>Mod Kamera AR</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">2</span>
                <p>Tekan daun teratai (A, B atau C) dengan jawapan yang betul.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#7f4f24] text-white flex items-center justify-center font-bold text-sm shrink-0">3</span>
                <p>Katak akan melompat di atas daun di dunia nyata melalui kamera AR!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 3: Panduan untuk murid (Page 27) */}
      {subStage === 'guide' && (
        <div className="flex-1 flex flex-col items-center justify-center my-4 animate-fade-in z-10">
          <div className="relative max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#ddb892] border-4 border-[#7f4f24] shadow-[0_8px_0_#582f0e]">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#582f0e] text-center mb-6">
              Panduan untuk murid
            </h2>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="flex flex-col items-center p-3 bg-white/80 rounded-2xl border border-amber-300">
                <div className="w-20 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow">
                  A / B / C
                </div>
                <span className="mt-2 text-sm font-bold text-[#582f0e]">daun jawapan</span>
              </div>

              <div className="flex flex-col items-center p-3 bg-white/80 rounded-2xl border border-amber-300">
                <FrogVector pose="normal" size={80} />
                <span className="mt-2 text-sm font-bold text-[#582f0e]">si katak 3D AR</span>
              </div>

              <div className="col-span-2 flex items-center justify-center gap-4 p-3 bg-white/80 rounded-2xl border border-amber-300">
                <div className="p-2.5 bg-[#a15c38] text-white rounded-lg text-xs font-mono font-bold">
                  A. ...<br />B. ...<br />C. ...
                </div>
                <span className="text-sm font-bold text-[#582f0e]">senarai pilihan jawapan pada papan kayu</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 4: Ready / Jom Selamatkan Si Katak (Page 28) */}
      {subStage === 'ready' && (
        <div className="flex-1 flex flex-col items-center justify-center my-4 animate-fade-in z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 max-w-xl w-full">
            <div className="flex-1 bg-white/95 p-6 rounded-3xl border-4 border-amber-400 shadow-xl relative">
              <span className="text-4xl text-amber-500 font-serif font-black absolute top-2 left-4">“</span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-800 text-center mt-3">
                Jom selamatkan si katak!
              </h2>
              <p className="text-sm text-slate-600 text-center mt-2">
                Pilih jawapan yang paling tepat supaya Si Katak dapat menyeberang dengan selamat.
              </p>
            </div>

            <div className="shrink-0 transform hover:scale-105 transition-transform">
              <FrogVector pose="happy" size={150} />
            </div>
          </div>
        </div>
      )}

      {/* Screen 5: Playing River & Functional AR Camera (Pages 29 to 33) */}
      {subStage === 'playing' && (
        <div className="flex-1 flex flex-col justify-between my-1 animate-fade-in z-10">
          {/* Question Banner Top */}
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border-3 border-amber-400 shadow-md relative max-w-2xl mx-auto w-full">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-lg sm:text-xl font-heading font-bold text-slate-900 leading-relaxed">
                  {curQ.sentenceStart && <span>{curQ.sentenceStart} </span>}
                  <span className={`inline-block px-3 py-0.5 mx-1 font-extrabold rounded-lg ${
                    answerState === 'correct'
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500 underline'
                      : 'bg-amber-100 text-amber-900 border-b-2 border-dashed border-amber-600'
                  }`}>
                    {answerState === 'correct' ? curQ.options.find(o => o.key === curQ.correctOptionKey)?.text : curQ.blankText}
                  </span>
                  {curQ.sentenceEnd && <span> {curQ.sentenceEnd}</span>}
                </p>
              </div>
            </div>

            {/* Feedback message banner if answered */}
            {answerState === 'correct' && (
              <div className="mt-2 text-sm text-emerald-700 font-bold flex items-center gap-1.5 animate-bounce">
                <span>🎉 Tepat sekali! Si Katak berjaya melompat ke daun teratai!</span>
              </div>
            )}
            {answerState === 'wrong' && (
              <div className="mt-2 text-sm text-rose-700 font-bold flex items-center justify-between">
                <span>💦 Alamak, hampir tergelincir! Cuba lagi ya.</span>
                <button
                  onClick={handleRetryQuestion}
                  className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 active:scale-95"
                >
                  Cuba Semula
                </button>
              </div>
            )}
          </div>

          {/* Mode Switcher Bar (Sungai, AR, Lisan) */}
          <div className="flex flex-wrap items-center justify-between gap-2 max-w-2xl mx-auto w-full my-1">
            <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
              <Sparkles size={13} className="text-amber-600" /> Mod Permainan:
            </span>
            <div className="flex items-center gap-1 bg-amber-200/80 p-1 rounded-2xl shadow-inner">
              <button
                type="button"
                onClick={() => {
                  stopARCamera();
                  setOralMode(false);
                  sound.playClick();
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                  !arMode && !oralMode
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-amber-900 hover:bg-amber-300'
                }`}
              >
                🌿 Sungai
              </button>
              <button
                type="button"
                onClick={() => {
                  setOralMode(false);
                  if (!arMode) {
                    startARCamera();
                  } else {
                    stopARCamera();
                  }
                }}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                  arMode
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-amber-900 hover:bg-amber-300'
                }`}
              >
                <Camera size={14} />
                <span>📷 Kamera AR</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  stopARCamera();
                  setOralMode(true);
                  sound.playClick();
                }}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                  oralMode
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                    : 'text-teal-900 hover:bg-teal-200'
                }`}
              >
                <Mic size={14} />
                <span>🎙️ Mendengar & Bertutur</span>
              </button>
            </div>
          </div>

          {/* Oral Mode Interaction Panel */}
          {oralMode && (
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-400 p-3 sm:p-4 rounded-2xl shadow-md max-w-2xl mx-auto w-full my-1 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-2 border-b border-teal-200">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm shadow">
                    🎙️
                  </span>
                  <div>
                    <span className="text-xs font-heading font-black text-teal-950 block">
                      Mod Mendengar & Bertutur Si Katak
                    </span>
                    <span className="text-[10px] text-teal-700 font-bold block">
                      Dengar audio soalan, sebut pilihan daun, dan katak akan melompat secara automatik!
                    </span>
                  </div>
                </div>

                <button
                  onClick={speakQuestionAudio}
                  className={`px-3 py-1 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer ${
                    isSpeakingQuestion
                      ? 'bg-amber-400 text-amber-950 animate-pulse ring-2 ring-amber-300'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  <Volume2 size={13} />
                  <span>{isSpeakingQuestion ? 'Sedang Membaca...' : 'Dengar Soalan 🔊'}</span>
                </button>
              </div>

              {/* Big Microphone button & Speech detection */}
              <div className="flex flex-col items-center justify-center my-2.5">
                <button
                  onClick={isListening ? stopFrogOralListening : startFrogOralListening}
                  disabled={answerState === 'correct'}
                  className={`px-5 py-2.5 rounded-full font-heading font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse'
                      : answerState === 'correct'
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white hover:scale-103'
                  }`}
                >
                  <span className="text-xl">{isListening ? '🔴' : '🎙️'}</span>
                  <span>
                    {isListening
                      ? 'Sedang Mendengar... Sila Sebut Pilihan Daun!'
                      : answerState === 'correct'
                      ? 'Katak Berjaya Melompat ke Daun! ✓'
                      : 'Tekan Mikrofon & Sebut Pilihan Daun (A / B / C)'}
                  </span>
                </button>

                {speechTranscript && (
                  <div className="mt-2 px-3 py-1 bg-white border border-teal-300 rounded-xl text-xs font-mono font-bold text-slate-900 shadow-2xs">
                    Suara dikesan: “{speechTranscript}”
                  </div>
                )}

                {oralFeedback && (
                  <div
                    className={`mt-1.5 px-3 py-1 rounded-xl text-[11px] font-heading font-bold border ${
                      oralResult === 'betul'
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-400 animate-bounce'
                        : 'bg-rose-100 text-rose-950 border-rose-300'
                    }`}
                  >
                    {oralFeedback}
                  </div>
                )}
              </div>

              {/* Quick Pronunciation Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-teal-200/80">
                <span className="text-[10px] text-teal-800 font-bold">Uji sebutan daun:</span>
                {curQ.options.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleFrogOralPracticeChoice(opt)}
                    disabled={answerState === 'correct'}
                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-teal-100 border border-teal-300 text-teal-950 text-xs font-heading font-bold flex items-center gap-1 active:scale-95 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>🗣️</span>
                    <span>Sebut: <strong>"{opt.text}"</strong> (Daun {opt.key})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Arena (Functional AR Camera Viewport OR 2D Cartoon River Stream - Expansive Landscape on Desktop) */}
          <div className={`relative my-1 h-72 sm:h-80 md:h-[420px] lg:h-[480px] xl:h-[520px] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border-4 shadow-2xl transition-all ${
            arMode
              ? 'border-amber-400 bg-black'
              : 'border-sky-400/50 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-500'
          }`}>
            {/* Screen flashes red when answer is wrong */}
            {flashRed && (
              <div className="absolute inset-0 bg-red-600/60 animate-pulse pointer-events-none z-50 rounded-3xl flex items-center justify-center">
                <span className="px-4 py-2 bg-red-950/90 text-red-200 border-2 border-red-400 font-heading font-black text-sm sm:text-base rounded-2xl shadow-2xl">
                  ⚠️ Cuba Lagi! Jawapan kurang tepat
                </span>
              </div>
            )}

            {/* FUNCTIONAL AR CAMERA STREAM */}
            {arMode && (
              <>
                {/* Live Real Video Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover z-0 ${
                    cameraActive ? 'opacity-90' : 'opacity-0'
                  }`}
                />

                {/* Hidden canvas for real-time optical hand tracking */}
                <canvas ref={analyzerCanvasRef} width={160} height={120} className="hidden" />

                {/* 15-Second Timer Bar & Real-World Hand Detection Guidance Banner */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 max-w-md w-11/12 text-center pointer-events-auto flex flex-col items-center gap-1.5">
                  {/* 15-Second Countdown Pill */}
                  <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/85 border-2 border-yellow-400 text-yellow-300 shadow-xl backdrop-blur-md">
                    <span className="text-base animate-pulse">⏳</span>
                    <span className="text-xs font-heading font-black">
                      Masa Menunjukkan Isyarat: <strong className="text-sm text-yellow-200">{arTimeLeft}s</strong>
                    </span>
                    <div className="w-20 sm:w-28 h-2 bg-slate-700 rounded-full overflow-hidden border border-yellow-500/60">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000"
                        style={{ width: `${(arTimeLeft / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className={`px-3 py-1 rounded-2xl border backdrop-blur-md shadow-lg transition-all flex items-center justify-center gap-2 text-xs font-heading font-black ${
                    detectedHandZone
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 animate-pulse'
                      : 'bg-black/75 border-amber-400/80 text-amber-200'
                  }`}>
                    <span>{detectedHandZone ? (detectedHandZone === 'A' ? '☝️' : detectedHandZone === 'B' ? '✌️' : '✋') : '✋'}</span>
                    <span>
                      {detectedHandZone
                        ? `Dikesan: Daun ${detectedHandZone} (${detectedHandZone === 'A' ? '☝️ Telunjuk' : detectedHandZone === 'B' ? '✌️ Dua Jari' : '✋ Tangan Terbuka'})`
                        : 'Tunjukkan simbol tangan dalam kotak sasaran'}
                    </span>
                  </div>
                </div>

                {/* KOTAK SASARAN TANGAN (Imbas tangan sahaja dalam kotak, bukan anggota badan lain) */}
                <div
                  className={`absolute top-[18%] left-[24%] sm:left-[28%] w-[52%] sm:w-[44%] h-[50%] rounded-3xl border-3 border-dashed transition-all pointer-events-none z-20 flex flex-col items-center justify-between p-2.5 ${
                    isHandPresent
                      ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_30px_rgba(52,211,153,0.35)]'
                      : 'border-yellow-300/80 bg-black/25'
                  }`}
                >
                  <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/85 backdrop-blur-sm border border-white/30 text-white text-[10px] font-heading font-black">
                    <span>{isHandPresent ? '✨ Tangan Dikesan' : '✋ Kotak Sasaran Tangan'}</span>
                  </div>

                  <div className="text-center animate-bounce">
                    <span className="text-4xl block mb-1">
                      {detectedHandZone === 'A' ? '☝️' : detectedHandZone === 'B' ? '✌️' : detectedHandZone === 'C' ? '✋' : '✋'}
                    </span>
                    <span className="text-xs font-heading font-black text-yellow-300 bg-black/80 px-3 py-1 rounded-full border border-yellow-400/60 shadow">
                      {detectedHandZone
                        ? `Daun ${detectedHandZone}`
                        : 'Tunjuk ☝️ Daun A · ✌️ Daun B · ✋ Daun C'}
                    </span>
                  </div>

                  <div className="text-[9px] text-white/90 font-bold bg-black/70 px-2 py-0.5 rounded-full border border-white/20">
                    Kamera hanya mengesan tangan di dalam kotak ini
                  </div>
                </div>

                {/* Fallback Holographic Grid if hardware camera is not available */}
                {!cameraActive && (
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center z-0">
                    <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:28px_28px]" />
                    <div className="text-center p-3 z-10 bg-black/50 rounded-2xl border border-cyan-500/40 backdrop-blur">
                      <span className="text-2xl animate-bounce inline-block">📱</span>
                      <p className="text-cyan-300 font-heading font-bold text-xs mt-1">
                        Mod Simulasi AR Spatial
                      </p>
                      <button
                        onClick={() => startARCamera()}
                        className="mt-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded-lg shadow"
                      >
                        Buka Kamera Sebenar 📷
                      </button>
                    </div>
                  </div>
                )}

                {/* AR HUD Overlay: Spatial Tracking & Controls */}
                <div className="absolute inset-3 border border-cyan-400/40 rounded-2xl pointer-events-none flex flex-col justify-between p-2 z-10">
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-cyan-300 bg-black/60 px-2.5 py-0.5 rounded-full self-start backdrop-blur">
                    <span>● PENGESAN TANGAN AR: AKTIF</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-amber-300 bg-black/60 px-2.5 py-0.5 rounded-full self-end backdrop-blur">
                    <span>LOMPAT AR: KATAK DI ALAM NYATA</span>
                  </div>
                </div>

                {/* AR Camera Control buttons */}
                <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-black/70 backdrop-blur px-2.5 py-1 rounded-xl border border-slate-700 text-white text-xs">
                  <button
                    onClick={handleToggleFacingMode}
                    className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-700 rounded text-[11px] text-cyan-300 font-bold"
                    title="Tukar Kamera Depan / Belakang"
                  >
                    <FlipHorizontal size={14} />
                    <span>Tukar Kamera</span>
                  </button>
                  <span className="text-slate-500">|</span>
                  <span className="text-[10px] text-slate-300">Putar:</span>
                  <button
                    onClick={() => setArRotation((prev) => prev - 30)}
                    className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-xs"
                    title="Putar Kiri"
                  >
                    ↺
                  </button>
                  <button
                    onClick={() => setArRotation((prev) => prev + 30)}
                    className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-xs"
                    title="Putar Kanan"
                  >
                    ↻
                  </button>
                </div>
              </>
            )}

            {/* 2D CARTOON RIVER MODE BACKGROUND */}
            {!arMode && (
              <>
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-8 left-10 w-24 h-2 bg-white/70 rounded-full animate-pulse" />
                  <div className="absolute top-20 right-20 w-36 h-2 bg-white/70 rounded-full animate-pulse delay-300" />
                  <div className="absolute bottom-12 left-1/3 w-28 h-2 bg-white/70 rounded-full animate-pulse delay-700" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 pointer-events-none opacity-80">
                  <div className="w-16 h-8 bg-slate-500 rounded-full border border-slate-600" />
                  <div className="w-12 h-6 bg-slate-600 rounded-full border border-slate-700 -mt-2" />
                </div>
              </>
            )}

            {/* Left Riverbank / Starting AR Pad */}
            <div className={`absolute left-0 top-0 bottom-0 w-24 sm:w-28 rounded-r-3xl border-r-4 flex flex-col justify-center items-center z-20 ${
              arMode
                ? 'bg-cyan-950/75 border-cyan-400/80 backdrop-blur'
                : 'bg-emerald-600/90 border-emerald-700'
            }`}>
              <span className="text-white text-[10px] font-bold mb-1 opacity-80 uppercase tracking-wider">
                {arMode ? 'Tapak AR' : 'Tebing'}
              </span>
              {frogPosition === 'bank' && (
                <div
                  draggable={answerState === 'idle'}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', 'frog');
                    setIsDragging(true);
                  }}
                  onDragEnd={() => setIsDragging(false)}
                  className={`animate-float cursor-grab active:cursor-grabbing transition-transform flex flex-col items-center ${
                    isDragging ? 'opacity-60 scale-105' : 'hover:scale-105'
                  }`}
                  style={{ transform: `rotateY(${arRotation}deg)` }}
                  title="Seret Si Katak ke teratai jawapan!"
                >
                  <FrogVector pose="happy" size={75} />
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-heading font-black text-[10px] shadow border border-amber-600 animate-pulse">
                    Seret saya! 🐸
                  </span>
                  {arMode && (
                    <div className="w-16 h-3 rounded-full bg-cyan-400/80 -mt-1 mx-auto animate-pulse" />
                  )}
                </div>
              )}
            </div>

            {/* Compact Top-Right Wood Signboard showing Answer Options */}
            <div className={`absolute right-2 top-2 z-30 max-w-[130px] sm:max-w-[160px] p-2 rounded-xl border-2 shadow-md text-white ${
              arMode
                ? 'bg-slate-900/90 border-cyan-400 backdrop-blur'
                : 'bg-[#a15c38] border-[#582f0e]'
            }`}>
              <span className="block text-[9px] font-bold text-amber-200 uppercase tracking-wider mb-0.5">
                Pilihan Jawapan:
              </span>
              <div className="space-y-0.5 text-[11px] font-bold font-heading">
                {curQ.options.map((opt) => (
                  <div
                    key={opt.key}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                      selectedLeaf === opt.key
                        ? opt.isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                        : 'bg-black/30'
                    }`}
                  >
                    <span className="w-3 text-amber-300">{opt.key}.</span>
                    <span className="truncate">{opt.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Lily Pads (Daun Teratai) A, B, C with direct labels and no bottom description text */}
            {(() => {
              const optA = curQ.options.find((o) => o.key === 'A');
              const optB = curQ.options.find((o) => o.key === 'B');
              const optC = curQ.options.find((o) => o.key === 'C');

              return (
                <>
                  {/* Lily Pad B (Center-Top) - Drag Target & Click */}
                  <div
                    className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-20"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleSelectLeaf('B');
                    }}
                  >
                    <button
                      onClick={() => handleSelectLeaf('B')}
                      onPointerEnter={() => { if (arMode) setDetectedHandZone('B'); }}
                      onPointerLeave={() => { if (arMode && !cameraActive) setDetectedHandZone(null); }}
                      disabled={answerState === 'correct'}
                      aria-label="Pilih Daun Teratai B"
                      className={`group relative min-w-[100px] sm:min-w-[124px] px-3.5 h-14 sm:h-15 rounded-full border-3 shadow-lg flex items-center justify-center gap-2 transform transition-all active:scale-95 ${
                        arMode
                          ? detectedHandZone === 'B'
                            ? 'bg-emerald-500 border-cyan-300 ring-8 ring-cyan-300 scale-110 shadow-[0_0_30px_#22d3ee] backdrop-blur animate-pulse'
                            : 'bg-emerald-600/85 hover:bg-emerald-500 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.8)] backdrop-blur'
                          : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700'
                      } ${selectedLeaf === 'B' ? 'ring-4 ring-yellow-300 scale-105' : 'hover:scale-105'} ${
                        isDragging ? 'ring-4 ring-dashed ring-amber-300 animate-pulse' : ''
                      }`}
                    >
                      <span className="text-white font-heading font-black text-xl drop-shadow">B</span>
                      <span className="text-xs sm:text-sm font-heading font-black text-amber-200 bg-black/50 px-2 py-0.5 rounded-full shadow-xs truncate max-w-[100px]">
                        {optB?.text}
                      </span>
                      
                      {/* Hand Detection Indicator for Lily Pad B */}
                      {arMode && detectedHandZone === 'B' && (
                        <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/90 px-2.5 py-0.5 rounded-full border-2 border-cyan-400 text-cyan-300 text-[10px] font-mono whitespace-nowrap shadow-xl animate-bounce z-40">
                          <span>🖐️ Tangan ({handDwellProgress}%)</span>
                        </div>
                      )}

                      {frogPosition === 'B' && (
                        <div
                          className={`absolute -top-14 left-1/2 -translate-x-1/2 ${answerState === 'correct' ? 'animate-bounce' : ''}`}
                          style={{ transform: `rotateY(${arRotation}deg)` }}
                        >
                          <FrogVector pose={answerState === 'correct' ? 'jumping_joy' : 'normal'} size={answerState === 'correct' ? 82 : 72} />
                          {answerState === 'correct' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-emerald-600 text-yellow-200 text-[10px] font-black shadow border border-yellow-300 animate-pulse">
                              ✨ Berjaya Melompat!
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Lily Pad A (Bottom-Left) - Drag Target & Click */}
                  <div
                    className="absolute bottom-4 sm:bottom-6 left-[18%] sm:left-[22%] z-20"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleSelectLeaf('A');
                    }}
                  >
                    <button
                      onClick={() => handleSelectLeaf('A')}
                      onPointerEnter={() => { if (arMode) setDetectedHandZone('A'); }}
                      onPointerLeave={() => { if (arMode && !cameraActive) setDetectedHandZone(null); }}
                      disabled={answerState === 'correct'}
                      aria-label="Pilih Daun Teratai A"
                      className={`group relative min-w-[100px] sm:min-w-[124px] px-3.5 h-14 sm:h-15 rounded-full border-3 shadow-lg flex items-center justify-center gap-2 transform transition-all active:scale-95 ${
                        arMode
                          ? detectedHandZone === 'A'
                            ? 'bg-emerald-500 border-cyan-300 ring-8 ring-cyan-300 scale-110 shadow-[0_0_30px_#22d3ee] backdrop-blur animate-pulse'
                            : 'bg-emerald-600/85 hover:bg-emerald-500 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.8)] backdrop-blur'
                          : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700'
                      } ${selectedLeaf === 'A' ? 'ring-4 ring-yellow-300 scale-105' : 'hover:scale-105'} ${
                        isDragging ? 'ring-4 ring-dashed ring-amber-300 animate-pulse' : ''
                      }`}
                    >
                      <span className="text-white font-heading font-black text-xl drop-shadow">A</span>
                      <span className="text-xs sm:text-sm font-heading font-black text-amber-200 bg-black/50 px-2 py-0.5 rounded-full shadow-xs truncate max-w-[100px]">
                        {optA?.text}
                      </span>

                      {/* Hand Detection Indicator for Lily Pad A */}
                      {arMode && detectedHandZone === 'A' && (
                        <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/90 px-2.5 py-0.5 rounded-full border-2 border-cyan-400 text-cyan-300 text-[10px] font-mono whitespace-nowrap shadow-xl animate-bounce z-40">
                          <span>🖐️ Tangan ({handDwellProgress}%)</span>
                        </div>
                      )}

                      {frogPosition === 'A' && (
                        <div
                          className={`absolute -top-14 left-1/2 -translate-x-1/2 ${answerState === 'correct' ? 'animate-bounce' : ''}`}
                          style={{ transform: `rotateY(${arRotation}deg)` }}
                        >
                          <FrogVector pose={answerState === 'correct' ? 'jumping_joy' : 'normal'} size={answerState === 'correct' ? 82 : 72} />
                          {answerState === 'correct' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-emerald-600 text-yellow-200 text-[10px] font-black shadow border border-yellow-300 animate-pulse">
                              ✨ Berjaya Melompat!
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Lily Pad C (Bottom-Right) - Drag Target & Click */}
                  <div
                    className="absolute bottom-4 sm:bottom-6 right-[18%] sm:right-[22%] z-20"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleSelectLeaf('C');
                    }}
                  >
                    <button
                      onClick={() => handleSelectLeaf('C')}
                      onPointerEnter={() => { if (arMode) setDetectedHandZone('C'); }}
                      onPointerLeave={() => { if (arMode && !cameraActive) setDetectedHandZone(null); }}
                      disabled={answerState === 'correct'}
                      aria-label="Pilih Daun Teratai C"
                      className={`group relative min-w-[100px] sm:min-w-[124px] px-3.5 h-14 sm:h-15 rounded-full border-3 shadow-lg flex items-center justify-center gap-2 transform transition-all active:scale-95 ${
                        arMode
                          ? detectedHandZone === 'C'
                            ? 'bg-emerald-500 border-cyan-300 ring-8 ring-cyan-300 scale-110 shadow-[0_0_30px_#22d3ee] backdrop-blur animate-pulse'
                            : 'bg-emerald-600/85 hover:bg-emerald-500 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.8)] backdrop-blur'
                          : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700'
                      } ${selectedLeaf === 'C' ? 'ring-4 ring-yellow-300 scale-105' : 'hover:scale-105'} ${
                        isDragging ? 'ring-4 ring-dashed ring-amber-300 animate-pulse' : ''
                      }`}
                    >
                      <span className="text-white font-heading font-black text-xl drop-shadow">C</span>
                      <span className="text-xs sm:text-sm font-heading font-black text-amber-200 bg-black/50 px-2 py-0.5 rounded-full shadow-xs truncate max-w-[100px]">
                        {optC?.text}
                      </span>

                      {/* Hand Detection Indicator for Lily Pad C */}
                      {arMode && detectedHandZone === 'C' && (
                        <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/90 px-2.5 py-0.5 rounded-full border-2 border-cyan-400 text-cyan-300 text-[10px] font-mono whitespace-nowrap shadow-xl animate-bounce z-40">
                          <span>🖐️ Tangan ({handDwellProgress}%)</span>
                        </div>
                      )}

                      {frogPosition === 'C' && (
                        <div
                          className={`absolute -top-14 left-1/2 -translate-x-1/2 ${answerState === 'correct' ? 'animate-bounce' : ''}`}
                          style={{ transform: `rotateY(${arRotation}deg)` }}
                        >
                          <FrogVector pose={answerState === 'correct' ? 'jumping_joy' : 'normal'} size={answerState === 'correct' ? 82 : 72} />
                          {answerState === 'correct' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-emerald-600 text-yellow-200 text-[10px] font-black shadow border border-yellow-300 animate-pulse">
                              ✨ Berjaya Melompat!
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  </div>
                </>
              );
            })()}

            {/* Water splash animation with ripples & sad frog face if wrong */}
            {frogPosition === 'splash' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                {/* Expanding water ripple waves in river */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="w-28 sm:w-36 h-14 sm:h-18 rounded-full border-4 border-cyan-300 animate-ping opacity-75" />
                  <div className="absolute w-44 sm:w-56 h-20 sm:h-26 rounded-full border-3 border-sky-400 animate-ping opacity-50 delay-150" />
                  <div className="absolute w-60 sm:w-72 h-28 sm:h-34 rounded-full border-2 border-blue-400 animate-ping opacity-30 delay-300" />
                </div>

                {/* Sad Frog with tear drops in water splash */}
                <div className="relative flex flex-col items-center animate-bounce z-40">
                  <div className="text-4xl sm:text-5xl animate-pulse">💦 🌊 💦</div>
                  <div className="relative -mt-2">
                    <FrogVector pose="sad" size={105} />
                  </div>
                  <div className="mt-2 px-4 py-2 rounded-2xl bg-slate-950/90 text-cyan-200 border-2 border-cyan-400 shadow-2xl text-center backdrop-blur-md max-w-sm">
                    <p className="text-xs sm:text-sm font-heading font-black text-rose-300 flex items-center justify-center gap-1.5">
                      <span>😢</span>
                      <span>Katak terjatuh ke dalam sungai!</span>
                      <span>💦</span>
                    </p>
                    <p className="text-[11px] text-cyan-200 font-semibold mt-0.5">
                      Muka katak sedih... Tekan "Cuba Semula" untuk selamatkannya ke teratai!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AR Mode Interactive Gesture Button Bar for Quick Selection & Feedback */}
          {arMode && answerState === 'idle' && (
            <div className="flex flex-wrap items-center justify-between gap-2 max-w-2xl mx-auto w-full my-1.5 p-2 rounded-2xl bg-slate-900/90 border-2 border-emerald-400 text-white shadow-xl backdrop-blur-xs">
              <span className="text-xs font-heading font-black text-amber-300 flex items-center gap-1.5 px-2">
                <span>✋</span>
                <span>Pilih Menggunakan Simbol Tangan (15s):</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDetectedHandZone('A');
                    handleSelectLeaf('A');
                  }}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-heading font-black transition-all cursor-pointer ${
                    detectedHandZone === 'A'
                      ? 'bg-yellow-400 text-slate-950 border-white shadow-md scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  }`}
                >
                  <span className="text-base">☝️</span>
                  <span>Daun A</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDetectedHandZone('B');
                    handleSelectLeaf('B');
                  }}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-heading font-black transition-all cursor-pointer ${
                    detectedHandZone === 'B'
                      ? 'bg-yellow-400 text-slate-950 border-white shadow-md scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  }`}
                >
                  <span className="text-base">✌️</span>
                  <span>Daun B</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDetectedHandZone('C');
                    handleSelectLeaf('C');
                  }}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-heading font-black transition-all cursor-pointer ${
                    detectedHandZone === 'C'
                      ? 'bg-yellow-400 text-slate-950 border-white shadow-md scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  }`}
                >
                  <span className="text-base">✋</span>
                  <span>Daun C</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Screen 6: Tahniah Screen (Page 34) */}
      {subStage === 'celebrate' && (
        <div className="flex-1 flex flex-col items-center justify-center my-4 animate-fade-in text-center z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 max-w-xl w-full">
            <div className="flex-1 bg-white/95 p-6 rounded-3xl border-4 border-emerald-400 shadow-xl relative">
              <span className="text-4xl text-emerald-500 font-serif font-black absolute top-2 left-4">“</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 mt-2">
                Tahniah murid-murid!
              </h2>
              <p className="text-emerald-700 font-bold text-base mt-2">
                Terima kasih kerana sudi memberikan perhatian dan kerjasama.
              </p>
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-slate-700">
                  Skor Anda: <strong className="text-emerald-600 text-lg">{score} / {FROG_QUESTIONS.length}</strong>
                </p>
                <p className="text-xs text-amber-700 font-bold mt-1">
                  +{score * 25} Syiling Emas Kancil dimasukkan ke akaun anda! 🪙
                </p>
              </div>

              <div className="mt-5 flex justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-heading font-bold shadow-md transition-all active:scale-95"
                >
                  Ulang Semula
                </button>
                <button
                  onClick={() => {
                    stopARCamera();
                    onBack();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold shadow-md transition-all active:scale-95"
                >
                  Kembali ke Menu Kuiz
                </button>
              </div>
            </div>

            <div className="shrink-0 transform hover:scale-105 transition-transform animate-bounce">
              <FrogVector pose="jumping_joy" size={170} />
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
            else if (subStage === 'ready') setSubStage('guide');
            else if (subStage === 'playing') {
              if (currentIdx > 0) {
                setCurrentIdx((prev) => prev - 1);
                setAnswerState('idle');
                setSelectedLeaf(null);
                setFrogPosition('bank');
              } else {
                setSubStage('ready');
              }
            } else if (subStage === 'celebrate') {
              setSubStage('playing');
            }
          }}
          disabled={subStage === 'intro'}
        />

        <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-4 py-1.5 rounded-full shadow-sm">
          {subStage === 'intro' && 'Muka 1/5'}
          {subStage === 'rules' && 'Cara Bermain'}
          {subStage === 'guide' && 'Panduan'}
          {subStage === 'ready' && 'Bersedia'}
          {subStage === 'playing' && `Soalan ${currentIdx + 1} daripada ${FROG_QUESTIONS.length} ${arMode ? '(Mod AR 📷)' : ''}`}
          {subStage === 'celebrate' && 'Tamat & Tahniah!'}
        </div>

        <WoodArrowButton
          direction="next"
          onClick={() => {
            if (subStage === 'intro') setSubStage('rules');
            else if (subStage === 'rules') setSubStage('guide');
            else if (subStage === 'guide') setSubStage('ready');
            else if (subStage === 'ready') setSubStage('playing');
            else if (subStage === 'playing') {
              handleNextQuestion();
            } else if (subStage === 'celebrate') {
              stopARCamera();
              onBack();
            }
          }}
          label={subStage === 'playing' ? (answerState === 'correct' ? 'Seterusnya' : undefined) : undefined}
        />
      </div>
    </div>
  );
};
