import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TopNavBar, WoodArrowButton } from './OrganicNav';
import { sound, CIKGU_FRESHCY_AUDIOS } from '../utils/audio';
import { TeacherStandee, TeacherId, TEACHER_PROFILES } from './TeacherCharacters';
import { BoyVector } from './IllustratedCharacters';
import { FoliageForeground } from './StoryGraphics';
import { Camera, CameraOff, FlipHorizontal, Hand, Sparkles, CheckCircle2, Zap, Mic, MicOff, Volume2, Radio } from 'lucide-react';

interface LatihDiriProps {
  onBack: () => void;
  onHome?: () => void;
  onComplete: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  teacherId?: TeacherId;
}

const DRILL_QUESTIONS = [
  {
    id: 1,
    sentenceStart: '',
    blank1: '_______',
    sentenceMid: 'petik bunga di kebun sekolah itu.',
    answer1: 'Jangan',
    choices: ['Jangan', 'Sila', 'Harap'],
    fullSentence: 'Jangan petik bunga di kebun sekolah itu.',
    clue: 'Ayat Larangan (Menegah atau melarang sesuatu tindakan)'
  },
  {
    id: 2,
    sentenceStart: '',
    blank1: '___________',
    sentenceMid: 'datang ke rumah saya.',
    answer1: 'Jemputlah',
    choices: ['Jemputlah', 'Usah', 'Jangan'],
    fullSentence: 'Jemputlah datang ke rumah saya.',
    clue: 'Ayat Silaan (Menjemput atau mempersilakan dengan sopan)'
  },
  {
    id: 3,
    sentenceStart: '',
    blank1: '____________',
    sentenceMid: 'ambilkan saya secawan air',
    answer1: 'Tolong',
    choices: ['Tolong', 'Usah', 'Jangan'],
    fullSentence: 'Tolong ambilkan saya secawan air.',
    clue: 'Ayat Permintaan (Memohon pertolongan atau bantuan)'
  },
  {
    id: 4,
    sentenceStart: '',
    blank1: '________',
    sentenceMid: 'perintah mengandungi',
    blank2: '________',
    sentenceEnd: 'perintah',
    answer1: 'Ayat',
    answer2: 'kata',
    choices: ['Ayat & kata', 'Huruf & ejaan', 'Frasa & tanda'],
    fullSentence: 'Ayat perintah mengandungi kata perintah.',
    clue: 'Konsep Asas (Hubungan antara ayat perintah dan kata perintah)'
  },
  {
    id: 5,
    sentenceStart: 'Tolong, harap dan minta merupakan kata perintah',
    blank1: '______________',
    sentenceMid: '',
    answer1: 'permintaan',
    choices: ['permintaan', 'larangan', 'silaan'],
    fullSentence: 'Tolong, harap dan minta merupakan kata perintah permintaan.',
    clue: 'Jenis Kata Perintah (Kategori memohon pertolongan atau hasrat)'
  }
];

export const LatihDiri: React.FC<LatihDiriProps> = ({
  onBack,
  onHome,
  onComplete,
  soundEnabled,
  onToggleSound,
  teacherId = 'syafiqah'
}) => {
  const [step, setStep] = useState<'intro' | 'question' | 'congrats'>('intro');
  const [mode, setMode] = useState<'biasa' | 'ar' | 'lisan'>('biasa');
  const [qIndex, setQIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userChoice, setUserChoice] = useState<string | null>(null);

  // AR States
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('user');
  const [grabbedCard, setGrabbedCard] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Real-world Optical Hand Detection States for AR Grab (Non-skin-sensitive target zone)
  const [detectedHandIdx, setDetectedHandIdx] = useState<number | null>(null);
  const [isHandPresent, setIsHandPresent] = useState<boolean>(false);
  const analyzerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);
  const bgLumRef = useRef<Float32Array | null>(null);

  // Oral Mode (Mod Mendengar dan Bertutur) States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [oralResult, setOralResult] = useState<'betul' | 'salah' | null>(null);
  const [oralFeedback, setOralFeedback] = useState<string>('');
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const cur = DRILL_QUESTIONS[qIndex];

  // Camera handling for AR mode
  const startCamera = async (facing = facingMode) => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      streamRef.current = stream;
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      sound.playSuccess();
    } catch {
      setCameraError('Kamera tidak dapat diakses. Menggunakan mod simulasi AR interaktif.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleFacingMode = () => {
    sound.playClick();
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (cameraActive) {
      startCamera(nextFacing);
    }
  };

  useEffect(() => {
    if (mode === 'ar' && (step === 'question' || step === 'intro')) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, step]);

  useEffect(() => {
    sound.playModuleBGM('default');
  }, []);

  const handleReveal = () => {
    sound.playApplause();
    setShowAnswer(true);
  };

  const resetOralState = () => {
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

  const handleNext = () => {
    resetOralState();
    if (step === 'intro') {
      setStep('question');
      setQIndex(0);
      setShowAnswer(false);
      setUserChoice(null);
      setGrabbedCard(null);
    } else if (step === 'question') {
      if (qIndex < DRILL_QUESTIONS.length - 1) {
        setQIndex((prev) => prev + 1);
        setShowAnswer(false);
        setUserChoice(null);
        setGrabbedCard(null);
      } else {
        setStep('congrats');
        stopCamera();
        sound.playApplause();
        sound.playFanfare();
        onComplete();
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    } else if (step === 'congrats') {
      onBack();
    }
  };

  const handlePrev = () => {
    resetOralState();
    if (step === 'congrats') {
      setStep('question');
    } else if (step === 'question') {
      if (qIndex > 0) {
        setQIndex((prev) => prev - 1);
        setShowAnswer(false);
        setUserChoice(null);
        setGrabbedCard(null);
      } else {
        setStep('intro');
      }
    }
  };

  // Audio reading for oral listening mode and question audio
  const speakQuestionAudio = () => {
    sound.playClick();
    setIsSpeakingQuestion(true);
    const questionAudios = [
      CIKGU_FRESHCY_AUDIOS.soalan1,
      CIKGU_FRESHCY_AUDIOS.soalan2,
      CIKGU_FRESHCY_AUDIOS.soalan3,
      CIKGU_FRESHCY_AUDIOS.soalan4,
      CIKGU_FRESHCY_AUDIOS.soalan5
    ];
    const clipUrl = questionAudios[qIndex];
    if (clipUrl) {
      sound.playAudioClip(clipUrl, () => {
        setIsSpeakingQuestion(false);
      });
    } else {
      const sentenceToRead = cur.fullSentence.replace(cur.answer1, 'tempat kosong');
      const speechPrompt = `Soalan ${qIndex + 1}. ${sentenceToRead}. Pembayang ialah: ${cur.clue}. Pilihan jawapan: ${cur.choices.join(', ')}. Sila berikan jawapan anda secara lisan.`;
      sound.speakMalay(speechPrompt, teacherId, () => {
        setIsSpeakingQuestion(false);
      });
    }
  };

  // Evaluate student's spoken oral answer
  const evaluateSpokenText = (transcript: string) => {
    const clean = transcript.toLowerCase().trim().replace(/[.,!?;:"']/g, '');
    if (!clean) return;

    const target = cur.answer1.toLowerCase().trim();
    const isCorrect =
      clean.includes(target) ||
      (cur.id === 4 && (clean.includes('ayat') || clean.includes('kata')));

    if (isCorrect) {
      setOralResult('betul');
      setOralFeedback(`Tepat sekali! Sebutan "${transcript}" adalah BETUL! Jawapannya ialah ${cur.answer1}.`);
      sound.playApplause();
      sound.speakMalay(`Tepat sekali! Jawapan yang anda sebut ialah ${cur.answer1}. Syabas!`, teacherId);
      setShowAnswer(true);
      setUserChoice(cur.answer1);
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch {
        // ignore
      }
    } else {
      setOralResult('salah');
      setOralFeedback(`Jawapan belum tepat. Anda menyebut "${transcript}". Sila cuba sebut sekali lagi dengan jelas!`);
      sound.playWrong();
      sound.speakMalay(`Jawapan belum tepat. Sila cuba sebut sekali lagi dengan jelas.`, teacherId);
    }
  };

  // Start Speech Recognition
  const startOralListening = () => {
    sound.playClick();
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setOralFeedback(
        'Pengecaman suara terus tidak disokong di pelayar ini. Sila sebut jawapan secara lisan dan tekan butang pilihan sebutan di bawah!'
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
        setOralFeedback('Sedang mendengar... Sila sebut kata perintah jawapan anda sekarang 🎙️');
      };

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setSpeechTranscript(text);
        if (event.results[0].isFinal) {
          setIsListening(false);
          evaluateSpokenText(text);
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

  const stopOralListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    if (speechTranscript) {
      evaluateSpokenText(speechTranscript);
    }
  };

  // Practice oral pronunciation directly
  const handleOralPracticeChoice = (choice: string) => {
    sound.playClick();
    setSpeechTranscript(choice);
    sound.speakMalay(choice, teacherId);
    setTimeout(() => {
      evaluateSpokenText(choice);
    }, 400);
  };

  // Handle AR Grab Action (either by hand hover optical detection or direct tap)
  const handleGrabChoice = (choice: string) => {
    if (showAnswer) return;
    sound.playClick();
    setGrabbedCard(choice);
    setUserChoice(choice);

    const isCorrect = choice === cur.answer1 || (cur.id === 4 && choice === 'Ayat & kata');
    if (isCorrect) {
      setTimeout(() => {
        sound.playApplause();
        setShowAnswer(true);
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.5 }
          });
        } catch {
          // ignore
        }
      }, 300);
    } else {
      setTimeout(() => {
        sound.playWrong();
      }, 300);
    }
  };

  // Reset AR detection state when question or mode changes
  useEffect(() => {
    setDetectedHandIdx(null);
    setIsHandPresent(false);
    resetOralState();
  }, [qIndex, mode, step]);

  // Immediate confirmation handler
  const handleConfirmArChoice = () => {
    if (detectedHandIdx !== null && cur.choices[detectedHandIdx]) {
      handleGrabChoice(cur.choices[detectedHandIdx]);
    }
  };

  // Optical Hand Detection within Target Zone (Cekap, Tepat & Tidak Bergantung Warna Kulit)
  useEffect(() => {
    if (mode !== 'ar' || !cameraActive || step !== 'question' || showAnswer) {
      setDetectedHandIdx(null);
      setIsHandPresent(false);
      return;
    }

    let stableCount = 0;
    let candidateIdx: number | null = null;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = analyzerCanvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Draw downscaled frame for optical analysis (160x120)
      ctx.drawImage(video, 0, 0, 160, 120);
      const frame = ctx.getImageData(0, 0, 160, 120);
      const data = frame.data;
      const totalPixels = 160 * 120;

      // Inisialisasi atau adaptasikan baseline latar belakang bilik
      if (!bgLumRef.current || bgLumRef.current.length !== totalPixels) {
        bgLumRef.current = new Float32Array(totalPixels);
        for (let i = 0; i < totalPixels; i++) {
          const pi = i * 4;
          bgLumRef.current[i] = 0.299 * data[pi] + 0.587 * data[pi + 1] + 0.114 * data[pi + 2];
        }
        return;
      }

      const bg = bgLumRef.current;

      // Kotak Sasaran Tangan (Hand Zone): x: 24..136, y: 18..106
      const boxX1 = 24;
      const boxX2 = 136;
      const boxY1 = 18;
      const boxY2 = 106;

      // 3 Kolum mengikut sasaran emoji
      const colW = (boxX2 - boxX1) / 3;
      const col1End = boxX1 + colW;       // ~61
      const col2End = boxX1 + colW * 2;   // ~98

      // Garisan pemisah menegak: Zon Hujung Jari (Upper) vs Zon Pangkal Tangan (Lower)
      const midY = boxY1 + (boxY2 - boxY1) * 0.52; // ~63

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

          // Perbezaan ketara terhadap latar belakang bilik (kekal dikesan walaupun tangan kaku)
          const diffBg = Math.abs(curLum - bgLum);

          // Perbezaan pergerakan bingkai
          if (prevData) {
            const prevLum = 0.299 * prevData[idx] + 0.587 * prevData[idx + 1] + 0.114 * prevData[idx + 2];
            if (Math.abs(curLum - prevLum) > 16) {
              motionScore++;
            }
          }

          if (diffBg > 18) {
            totalOccupancy++;
            if (y < midY) {
              // Bahagian atas jari
              if (x < col1End) upperLeft++;
              else if (x < col2End) upperMid++;
              else upperRight++;
            } else {
              // Bahagian bawah telapak
              if (x < col1End) lowerLeft++;
              else if (x < col2End) lowerMid++;
              else lowerRight++;
            }
          } else {
            // Pelarasan latar belakang automatik apabila tiada objek
            bg[pixelIdx] = 0.98 * bgLum + 0.02 * curLum;
          }
        }
      }

      prevFrameDataRef.current = new Uint8ClampedArray(data);

      // Tangan dikesan apabila ada kehadiran objek dalam kotak
      const handPresent = totalOccupancy >= 24 || motionScore >= 16;
      setIsHandPresent(handPresent);

      if (handPresent) {
        const totalUpper = upperLeft + upperMid + upperRight;
        const totalLeft = upperLeft + lowerLeft;
        const totalMid = upperMid + lowerMid;
        const totalRight = upperRight + lowerRight;

        let detected: number = 0;

        // Pengecaman Tepat & Berkesan:
        // 1. Emoji ✋ (Tangan Terbuka): Kawasan okupansi luas merangkumi ketiga-tiga kolum
        const isBroadHand =
          upperLeft >= 8 &&
          upperMid >= 8 &&
          upperRight >= 8 &&
          totalUpper >= 35;

        // 2. Emoji ✌️ (2 Jari / V):
        // Terbahagi pada dua kolum (kiri & kanan atau kiri & tengah / tengah & kanan)
        const isTwoFingers =
          !isBroadHand &&
          ((upperLeft >= 6 && upperRight >= 6) ||
           (upperLeft >= 8 && upperMid >= 8 && upperRight <= 5) ||
           (upperMid >= 8 && upperRight >= 8 && upperLeft <= 5));

        // 3. Emoji ☝️ (1 Jari / Telunjuk):
        // Tertumpu secara dominan pada satu kolum tegak (terutamanya kolum tengah)
        const isOneFinger =
          !isBroadHand &&
          !isTwoFingers &&
          ((upperMid > 1.5 * upperLeft && upperMid > 1.5 * upperRight) ||
           (upperLeft > 1.8 * upperMid) ||
           (upperRight > 1.8 * upperMid) ||
           totalUpper > 0);

        if (isBroadHand) {
          detected = 2; // ✋
        } else if (isTwoFingers) {
          detected = 1; // ✌️
        } else if (isOneFinger) {
          detected = 0; // ☝️
        } else {
          // Sandaran kolum dominan
          if (totalMid >= totalLeft && totalMid >= totalRight) detected = 0;
          else if (totalLeft > totalRight) detected = 1;
          else detected = 2;
        }

        // Hysteresis temporal: 2 bingkai berturut-turut (~240ms) untuk kestabilan tanpa kelipan
        if (detected === candidateIdx) {
          stableCount++;
          if (stableCount >= 2) {
            setDetectedHandIdx(detected);
          }
        } else {
          candidateIdx = detected;
          stableCount = 1;
        }
      } else {
        stableCount = 0;
      }
    }, 120);

    return () => clearInterval(interval);
  }, [mode, cameraActive, step, showAnswer]);

  return (
    <div className="relative min-h-[620px] max-w-4xl mx-auto rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 flex flex-col justify-between p-4 sm:p-6">
      {/* Hidden canvas for optical hand tracking */}
      <canvas ref={analyzerCanvasRef} width={160} height={120} className="hidden" />

      {/* Top Navbar */}
      <TopNavBar
        onExit={onBack}
        onHome={onHome || onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        title={step === 'question' ? `Latih Diri: Soalan ${qIndex + 1}` : 'Latih Diri'}
      />

      {/* Mode Switcher Tabs (Mod Biasa vs Mod AR vs Mod Lisan) */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-1 z-20">
        <button
          onClick={() => {
            sound.playClick();
            setMode('biasa');
            if (step === 'intro') {
              sound.playAudioClip(CIKGU_FRESHCY_AUDIOS.writtenIntro);
            }
          }}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
            mode === 'biasa'
              ? 'bg-amber-500 text-white shadow-md scale-105 border-2 border-amber-600'
              : 'bg-white/90 text-amber-900 border border-amber-300 hover:bg-amber-100'
          }`}
        >
          <span>✏️</span>
          <span>Mod Bertulis</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setMode('ar');
            if (step === 'intro') {
              sound.playAudioClip(CIKGU_FRESHCY_AUDIOS.arIntro);
            }
          }}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
            mode === 'ar'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-105 border-2 border-purple-400'
              : 'bg-white/90 text-purple-900 border border-purple-300 hover:bg-purple-100'
          }`}
        >
          <span>✋</span>
          <span>Mod AR (Isyarat Tangan)</span>
          <span className="text-[10px] bg-yellow-400 text-amber-950 px-2 py-0.5 rounded-full font-black animate-pulse">
            KAMERA
          </span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setMode('lisan');
            if (step === 'intro') {
              sound.playAudioClip(CIKGU_FRESHCY_AUDIOS.oralIntro);
            }
          }}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
            mode === 'lisan'
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md scale-105 border-2 border-teal-400'
              : 'bg-white/90 text-teal-900 border border-teal-300 hover:bg-teal-100'
          }`}
        >
          <span>🎙️</span>
          <span>Mod Mendengar & Bertutur</span>
          <span className="text-[10px] bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full font-black">
            LISAN
          </span>
        </button>
      </div>

      {/* Intro Screen */}
      {step === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center my-3 animate-fade-in text-center z-10">
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-slate-900 tracking-tight mb-2">
            Latih Diri: Ayat Perintah
          </h1>
          <p className="text-amber-900 text-sm sm:text-lg font-heading font-bold max-w-lg leading-relaxed mb-3">
            “Jom kukuhkan pengetahuan dengan menjawab 5 soalan berkenaan ayat perintah”
          </p>

          <div className="my-2">
            <TeacherStandee
              teacherId={teacherId}
              size="lg"
              showBubble={true}
              audioUrl={
                mode === 'ar'
                  ? CIKGU_FRESHCY_AUDIOS.arIntro
                  : mode === 'lisan'
                  ? CIKGU_FRESHCY_AUDIOS.oralIntro
                  : CIKGU_FRESHCY_AUDIOS.writtenIntro
              }
              bubbleText={
                mode === 'ar'
                  ? `“Anda memilih Mod AR! Tunjukkan emoji bentuk tangan di hadapan kamera untuk menjawab soalan bersama ${TEACHER_PROFILES[teacherId].nama}!”`
                  : mode === 'lisan'
                  ? `“Anda memilih Mod Mendengar dan Bertutur! Dengar audio soalan dan berikan jawapan secara lisan bersama ${TEACHER_PROFILES[teacherId].nama}!”`
                  : `“Sila pilih jawapan yang paling tepat bagi setiap soalan. Bersedia bersama ${TEACHER_PROFILES[teacherId].nama}?”`
              }
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleNext}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-heading font-extrabold text-lg shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-[0_2px_0_#b45309] transition-all transform hover:scale-105 cursor-pointer"
            >
              Mula Latihan 💡
            </button>
          </div>
        </div>
      )}

      {/* Question Screens */}
      {step === 'question' && (
        <div className="flex-1 flex flex-col justify-between my-2 animate-fade-in relative z-10">
          {/* MOD AR: Two-Column Side-by-Side Layout (Soalan Sebelah Kiri, Kamera Sebelah Kanan) */}
          {mode === 'ar' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 my-1 items-stretch flex-1">
              {/* SEBELAH KIRI: Soalan, Pilihan Jawapan & Panduan Bentuk Tangan (7 Kolum) */}
              <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-white/95 border-3 border-purple-400 shadow-xl text-slate-900">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-heading font-black text-sm sm:text-base text-purple-900">
                      Soalan {qIndex + 1} daripada {DRILL_QUESTIONS.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={speakQuestionAudio}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-heading font-black flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 ${
                          isSpeakingQuestion
                            ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 animate-pulse'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                        title="Dengar rakaman Cikgu Freshcy membaca soalan ini"
                      >
                        <Volume2 size={12} />
                        <span>{isSpeakingQuestion ? 'Membaca...' : 'Dengar Soalan 🔊'}</span>
                      </button>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-heading font-bold bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">
                        <span>💡</span>
                        <span><strong>Pembayang:</strong> {cur.clue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Kawalan Isyarat AR Banner on Question Panel */}
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-purple-50 border border-purple-300 mb-2 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-heading font-black text-purple-950">
                      <Hand size={16} className="text-purple-600" />
                      <span>Kawalan Isyarat AR:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {detectedHandIdx !== null ? (
                        <span className="font-heading font-black text-xs px-2.5 py-0.5 rounded-full border bg-emerald-100 text-emerald-950 border-emerald-400 flex items-center gap-1 shadow-2xs">
                          <span>Dikesan</span>
                          <span>{detectedHandIdx === 0 ? '☝️' : detectedHandIdx === 1 ? '✌️' : '✋'}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-purple-700 italic">
                          Tunjukkan tangan di hadapan kamera
                        </span>
                      )}
                      {detectedHandIdx !== null && !showAnswer && (
                        <button
                          onClick={handleConfirmArChoice}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-black text-[11px] shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Zap size={11} />
                          <span>Pilih Sekarang</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sentence with blank */}
                  <div className="text-base sm:text-xl font-heading font-bold my-2 p-3 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-slate-800 leading-relaxed text-center">
                    {cur.sentenceStart && <span>{cur.sentenceStart} </span>}
                    <span
                      className={`inline-block px-3 py-1 rounded-xl mx-1 font-extrabold transition-all ${
                        showAnswer
                          ? 'bg-emerald-500 text-white border-2 border-emerald-400 animate-bounce'
                          : userChoice
                          ? 'bg-amber-400 text-amber-950 border-2 border-amber-600 scale-105'
                          : 'bg-purple-200 text-purple-950 border-2 border-dashed border-purple-400'
                      }`}
                    >
                      {showAnswer ? cur.answer1 : userChoice || cur.blank1}
                    </span>
                    <span>{cur.sentenceMid} </span>
                    {cur.blank2 && (
                      <span
                        className={`inline-block px-3 py-1 rounded-xl mx-1 font-extrabold transition-all ${
                          showAnswer
                            ? 'bg-emerald-500 text-white border-2 border-emerald-400 animate-bounce'
                            : 'bg-purple-200 text-purple-950 border-2 border-dashed border-purple-400'
                        }`}
                      >
                        {showAnswer ? cur.answer2 : cur.blank2}
                      </span>
                    )}
                    {cur.sentenceEnd && <span>{cur.sentenceEnd}</span>}
                  </div>

                  {/* Instructions on Hand Shapes */}
                  <div className="p-2 rounded-xl bg-purple-50/80 border border-purple-200 mb-2.5 text-center">
                    <p className="text-xs font-heading font-bold text-purple-950 flex items-center justify-center gap-1">
                      <span>✋</span>
                      <span>Tunjukkan bentuk tangan anda di hadapan kamera sebelah kanan:</span>
                    </p>
                  </div>

                  {/* 3 Hand-Shape Choices (Tunjuk Emoji Sahaja) */}
                  <div className="space-y-2.5">
                    {cur.choices.map((c, idx) => {
                      const isGrabbed = userChoice === c;
                      const isTarget = detectedHandIdx === idx;
                      const handSymbol = idx === 0 ? '☝️' : idx === 1 ? '✌️' : '✋';

                      return (
                        <button
                          key={c}
                          onClick={() => handleGrabChoice(c)}
                          className={`w-full p-3 rounded-2xl font-heading font-black text-sm sm:text-base border-2 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-xs active:scale-98 ${
                            isGrabbed
                              ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-500 text-amber-950 border-amber-600 ring-3 ring-amber-400 scale-102'
                              : isTarget
                              ? 'bg-purple-100 text-purple-950 border-purple-500 ring-2 ring-purple-400 scale-101'
                              : 'bg-white hover:bg-purple-50 text-slate-800 border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-11 h-11 rounded-2xl bg-purple-100 border-2 border-purple-400 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                              {handSymbol}
                            </span>
                            <div className="text-left">
                              <span className="text-base sm:text-lg font-black text-slate-900">{c}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isTarget && !isGrabbed && (
                              <span className="text-[11px] font-heading font-black text-purple-900 bg-yellow-300 px-2.5 py-0.5 rounded-full border border-purple-400 animate-pulse">
                                Dikesan ✓
                              </span>
                            )}
                            {isGrabbed && (
                              <span className="text-xs font-black text-amber-950 bg-white/90 px-2.5 py-1 rounded-full border border-amber-400 shadow-2xs">
                                Dipilih ✓
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Left Bottom Action: Reveal Answer */}
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Tunjukkan tangan dalam kotak kamera, atau sentuh kad jawapan terus.
                  </span>
                  <button
                    onClick={handleReveal}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    Jawapan Lengkap
                  </button>
                </div>
              </div>

              {/* SEBELAH KANAN: Paparan Kamera Murid Yang Luas & Jelas (5 Kolum) */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl overflow-hidden border-4 border-purple-500 shadow-xl bg-slate-950 relative min-h-[380px] sm:min-h-[440px]">
                {/* Real Camera Feed */}
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover absolute inset-0 ${
                      facingMode === 'user' ? 'scale-x-[-1]' : ''
                    }`}
                  />
                ) : (
                  <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-4 text-center text-white">
                    <div className="w-14 h-14 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-3xl mb-2 animate-bounce">
                      ✋
                    </div>
                    <h4 className="font-heading font-black text-sm text-purple-200">
                      Kamera AR Diaktifkan
                    </h4>
                    <p className="text-[11px] text-slate-300 max-w-xs mt-1">
                      Sila benarkan akses kamera untuk melihat diri anda dan menjawab menggunakan bentuk tangan!
                    </p>
                  </div>
                )}

                {/* Camera Top Controls Bar */}
                <div className="relative z-20 p-2.5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-400/60 backdrop-blur-sm text-white text-[11px] font-heading font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>Kamera Murid</span>
                  </div>

                  <button
                    onClick={toggleFacingMode}
                    className="p-1.5 px-2.5 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs flex items-center gap-1 border border-white/30 backdrop-blur-sm cursor-pointer shadow-xs active:scale-95"
                    title="Tukar Kamera Depan / Belakang"
                  >
                    <FlipHorizontal size={13} />
                    <span className="text-[10px]">Tukar</span>
                  </button>
                </div>

                {/* ZON TUNJUK TANGAN: Kotak Sasaran Tangan (Kurang sensitif dengan warna kulit, tunjuk tangan dulu baru detect) */}
                <div
                  className={`absolute top-[18%] left-[12%] w-[76%] h-[48%] rounded-3xl border-3 border-dashed transition-all pointer-events-none z-15 flex flex-col items-center justify-between p-3 ${
                    isHandPresent
                      ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_25px_rgba(52,211,153,0.35)]'
                      : 'border-yellow-300/80 bg-black/25'
                  }`}
                >
                  <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/30 text-white text-[10px] font-heading font-black">
                    <span>{isHandPresent ? '✨ Tangan Dikesan' : '✋ Zon Tunjuk Tangan'}</span>
                  </div>

                  {!isHandPresent ? (
                    <div className="text-center animate-pulse">
                      <span className="text-3xl block mb-1">✋</span>
                      <span className="text-[11px] font-heading font-black text-yellow-300 bg-black/75 px-3 py-1 rounded-full border border-yellow-400/60 shadow">
                        Sila tunjuk tangan di sini
                      </span>
                    </div>
                  ) : (
                    <div className="text-center animate-bounce">
                      <span className="text-4xl block mb-1">
                        {detectedHandIdx === 0 ? '☝️' : detectedHandIdx === 1 ? '✌️' : '✋'}
                      </span>
                      <span className="text-base font-heading font-black text-emerald-300 bg-black/80 px-3.5 py-1 rounded-full border border-emerald-400 shadow">
                        {detectedHandIdx === 0 ? '☝️' : detectedHandIdx === 1 ? '✌️' : '✋'}
                      </span>
                    </div>
                  )}

                  <div className="text-[9px] text-white/90 font-bold bg-black/60 px-2 py-0.5 rounded-full border border-white/20">
                    Kamera hanya mengesan tangan di dalam kotak ini
                  </div>
                </div>

                {/* Bottom Gesture Indicators & Action Panel */}
                <div className="relative z-20 m-2.5 p-3 rounded-2xl bg-slate-900/95 border-2 border-purple-400 shadow-xl backdrop-blur-md text-white">
                  {/* Real-time Status & Quick Actions */}
                  <div className="flex items-center justify-between gap-2 text-xs mb-2.5 pb-2 border-b border-purple-500/30">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
                      <span>Status Tangan:</span>
                      {detectedHandIdx !== null ? (
                        <span className="font-heading font-black text-yellow-300 bg-yellow-950/80 px-2.5 py-0.5 rounded-lg border border-yellow-500/50 text-base">
                          {detectedHandIdx === 0 ? '☝️' : detectedHandIdx === 1 ? '✌️' : '✋'}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Menunggu isyarat tangan...</span>
                      )}
                    </div>

                    {detectedHandIdx !== null && !showAnswer && (
                      <button
                        onClick={handleConfirmArChoice}
                        className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-heading font-black text-[11px] shadow active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        title="Sahkan pilihan jawapan sekarang"
                      >
                        <Zap size={12} />
                        <span>Pilih Terus</span>
                      </button>
                    )}
                  </div>

                  {/* Interactive Gesture Shape Buttons (Emoji Sahaja) */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setDetectedHandIdx(0);
                        setIsHandPresent(true);
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        detectedHandIdx === 0
                          ? 'bg-yellow-400 text-slate-950 border-white ring-2 ring-yellow-400 scale-102 font-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      }`}
                      title="Pilihan ☝️"
                    >
                      <span className="text-2xl block">☝️</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setDetectedHandIdx(1);
                        setIsHandPresent(true);
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        detectedHandIdx === 1
                          ? 'bg-yellow-400 text-slate-950 border-white ring-2 ring-yellow-400 scale-102 font-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      }`}
                      title="Pilihan ✌️"
                    >
                      <span className="text-2xl block">✌️</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setDetectedHandIdx(2);
                        setIsHandPresent(true);
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        detectedHandIdx === 2
                          ? 'bg-yellow-400 text-slate-950 border-white ring-2 ring-yellow-400 scale-102 font-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      }`}
                      title="Pilihan ✋"
                    >
                      <span className="text-2xl block">✋</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : mode === 'lisan' ? (
            /* MOD LISAN: Mod Mendengar dan Bertutur */
            <div className="relative max-w-2xl mx-auto w-full p-4 sm:p-6 rounded-3xl border-3 border-teal-400 bg-white/95 shadow-xl text-center z-10 transition-all">
              {/* Top Meta Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3 pb-3 border-b border-teal-100">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-base sm:text-lg text-teal-900">
                    Soalan {qIndex + 1} daripada {DRILL_QUESTIONS.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black bg-teal-100 text-teal-800 border border-teal-300 flex items-center gap-1">
                    <Radio size={12} className="text-teal-600 animate-pulse" />
                    <span>Mendengar & Bertutur</span>
                  </span>
                </div>

                {/* Clue Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold shadow-2xs bg-amber-100 text-amber-900 border border-amber-300">
                  <span>💡</span>
                  <span><strong>Pembayang:</strong> {cur.clue}</span>
                </div>
              </div>

              {/* BAHAGIAN 1: MENDENGAR AUDIO SOALAN */}
              <div className="p-4 rounded-2xl bg-teal-50/90 border-2 border-teal-300 mb-3.5 text-left">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-heading font-black text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 size={16} className="text-teal-600" />
                    <span>Langkah 1: Dengar Audio Soalan</span>
                  </span>
                  <button
                    onClick={speakQuestionAudio}
                    className={`px-3 py-1.5 rounded-xl text-xs font-heading font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isSpeakingQuestion
                        ? 'bg-amber-400 text-amber-950 border border-amber-500 ring-2 ring-amber-300 animate-pulse'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    <Volume2 size={14} />
                    <span>{isSpeakingQuestion ? 'Sedang Membaca...' : 'Dengar Soalan 🔊'}</span>
                  </button>
                </div>

                {/* Ayat Soalan */}
                <div className="text-lg sm:text-xl font-heading font-bold my-2 leading-relaxed text-slate-900">
                  {cur.sentenceStart && <span>{cur.sentenceStart} </span>}
                  <span
                    className={`inline-block px-3 py-1 rounded-xl mx-1 font-extrabold transition-all ${
                      showAnswer
                        ? 'bg-emerald-500 text-white border-2 border-emerald-300 animate-bounce'
                        : userChoice
                        ? 'bg-teal-500 text-white border-2 border-teal-700 scale-105'
                        : 'bg-white text-teal-900 border-2 border-dashed border-teal-400 shadow-2xs'
                    }`}
                  >
                    {showAnswer ? cur.answer1 : userChoice || '_______'}
                  </span>
                  <span>{cur.sentenceMid} </span>
                  {cur.blank2 && (
                    <span
                      className={`inline-block px-3 py-1 rounded-xl mx-1 font-extrabold transition-all ${
                        showAnswer
                          ? 'bg-emerald-500 text-white border-2 border-emerald-300 animate-bounce'
                          : 'bg-white text-teal-900 border-2 border-dashed border-teal-400'
                      }`}
                    >
                      {showAnswer ? cur.answer2 : cur.blank2}
                    </span>
                  )}
                  {cur.sentenceEnd && <span>{cur.sentenceEnd}</span>}
                </div>

                <div className="text-[11px] text-teal-800 font-bold bg-teal-100/70 p-2 rounded-xl border border-teal-200">
                  Pilihan kata perintah: <span className="font-black text-teal-950">{cur.choices.join(', ')}</span>
                </div>
              </div>

              {/* BAHAGIAN 2: BERTUTUR DAN PENGESANAN JAWAPAN LISAN */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-sky-50 to-indigo-50/50 border-2 border-sky-300 mb-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  <Mic size={16} className="text-sky-600" />
                  <span className="text-xs font-heading font-black text-sky-950 uppercase tracking-wider">
                    Langkah 2: Berikan Jawapan Secara Lisan
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium mb-3">
                  Tekan butang mikrofon di bawah dan sebut kata perintah jawapan anda. Sistem akan mengesan ketepatan jawapan murid secara automatik:
                </p>

                {/* Big Interactive Microphone Button */}
                <div className="flex flex-col items-center justify-center my-2">
                  <button
                    onClick={isListening ? stopOralListening : startOralListening}
                    className={`px-6 py-3.5 rounded-full font-heading font-black text-sm sm:text-base flex items-center gap-3 transition-all cursor-pointer shadow-lg active:scale-95 ${
                      isListening
                        ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse'
                        : showAnswer
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-200'
                        : 'bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-600 hover:to-sky-700 text-white ring-4 ring-sky-200 hover:scale-103'
                    }`}
                  >
                    <span className="text-2xl">{isListening ? '🔴' : '🎙️'}</span>
                    <span>
                      {isListening
                        ? 'Sedang Mendengar... Sila Sebut Sekarang!'
                        : showAnswer
                        ? 'Jawapan Lisan Tepat ✓'
                        : 'Tekan Untuk Sebut Jawapan 🎙️'}
                    </span>
                  </button>

                  {/* Live Transcript Display */}
                  {speechTranscript && (
                    <div className="mt-3 px-4 py-2 rounded-xl bg-white border border-sky-300 shadow-2xs max-w-md w-full text-center">
                      <span className="text-[11px] text-slate-500 font-bold block">Suara murid dikesan:</span>
                      <span className="text-sm font-black text-slate-900 font-mono">
                        “{speechTranscript}”
                      </span>
                    </div>
                  )}

                  {/* Feedback Message */}
                  {oralFeedback && (
                    <div
                      className={`mt-2.5 px-4 py-2.5 rounded-xl text-xs font-heading font-bold max-w-md w-full border ${
                        oralResult === 'betul'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-400 shadow-xs'
                          : oralResult === 'salah'
                          ? 'bg-rose-100 text-rose-950 border-rose-400'
                          : 'bg-amber-100 text-amber-950 border-amber-300'
                      }`}
                    >
                      {oralFeedback}
                    </div>
                  )}
                </div>

                {/* Alternatif Latihan Sebutan Lisan (Interactive Pronunciation & Practice) */}
                <div className="mt-4 pt-3 border-t border-sky-200">
                  <span className="text-[11px] text-slate-600 font-bold block mb-2">
                    Atau uji jawapan secara lisan melalui sebutan pilihan berikut:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {cur.choices.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleOralPracticeChoice(c)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                          userChoice === c && showAnswer
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                            : 'bg-white hover:bg-sky-100 text-sky-950 border-sky-300'
                        }`}
                      >
                        <span>🗣️</span>
                        <span>Sebut: <strong>"{c}"</strong></span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={handleReveal}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Tunjukkan Jawapan Lengkap
                </button>
              </div>
            </div>
          ) : (
            /* MOD BIASA: Single Column Standard View */
            <div className="relative max-w-2xl mx-auto w-full p-5 sm:p-7 rounded-3xl border-3 border-dashed border-amber-400 bg-white/95 shadow-xl text-center z-10 transition-all">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
                <span className="font-heading font-black text-lg text-amber-800">
                  Soalan {qIndex + 1} daripada {DRILL_QUESTIONS.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={speakQuestionAudio}
                    className={`px-3 py-1 rounded-full text-xs font-heading font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isSpeakingQuestion
                        ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 animate-pulse'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                    title="Dengar rakaman Cikgu Freshcy membaca soalan ini"
                  >
                    <Volume2 size={13} />
                    <span>{isSpeakingQuestion ? 'Membaca...' : 'Dengar Soalan 🔊'}</span>
                  </button>

                  {/* Clue Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold shadow-xs bg-amber-100 text-amber-900 border border-amber-300">
                    <span>💡</span>
                    <span><strong>Pembayang:</strong> {cur.clue}</span>
                  </div>
                </div>
              </div>

              {/* Sentence Display */}
              <div className="text-xl sm:text-2xl font-heading font-bold my-4 leading-relaxed text-slate-800">
                {cur.sentenceStart && <span>{cur.sentenceStart} </span>}
                <span
                  className={`inline-block px-3 py-1 rounded-xl mx-1 font-extrabold transition-all ${
                    showAnswer
                      ? 'bg-emerald-500 text-white border-2 border-emerald-300 animate-bounce'
                      : userChoice
                      ? 'bg-amber-400 text-amber-950 border-2 border-amber-600 scale-105'
                      : 'bg-amber-100 text-amber-900 border-2 border-dashed border-amber-400'
                  }`}
                >
                  {showAnswer ? cur.answer1 : userChoice || cur.blank1}
                </span>
                <span>{cur.sentenceMid} </span>
                {cur.blank2 && (
                  <span
                    className={`inline-block px-3 py-1 rounded-xl mx-1 font-extrabold transition-all ${
                      showAnswer
                        ? 'bg-emerald-500 text-white border-2 border-emerald-300 animate-bounce'
                        : 'bg-amber-100 text-amber-900 border-2 border-dashed border-amber-400'
                    }`}
                  >
                    {showAnswer ? cur.answer2 : cur.blank2}
                  </span>
                )}
                {cur.sentenceEnd && <span>{cur.sentenceEnd}</span>}
              </div>

              {/* Multiple Choice Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                {cur.choices.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      sound.playClick();
                      setUserChoice(c);
                    }}
                    className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-heading font-bold border-2 transition-all cursor-pointer ${
                      userChoice === c
                        ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-md'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Reveal Answer Button */}
              <div className="mt-5 flex justify-center gap-3">
                <button
                  onClick={handleReveal}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Tunjukkan Jawapan Lengkap
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Congrats Screen */}
      {step === 'congrats' && (
        <div className="flex-1 flex flex-col items-center justify-center my-4 text-center animate-fade-in z-10">
          <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center text-4xl shadow-xl mb-3 animate-bounce">
            🎉
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 mb-2">
            Tahniah! Latihan Selesai!
          </h2>
          <p className="text-amber-900 font-heading font-bold text-base max-w-md mb-4">
            Anda telah berjaya menyelesaikan kesemua 5 soalan Latih Diri Ayat Perintah!
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setStep('intro');
                setQIndex(0);
                setShowAnswer(false);
                setUserChoice(null);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-sm shadow cursor-pointer"
            >
              Ulang Latihan
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-sm shadow cursor-pointer"
            >
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between w-full pt-2 z-10">
        <WoodArrowButton direction="prev" onClick={handlePrev} disabled={step === 'intro'} />

        <div className="text-xs font-bold text-amber-900 bg-amber-200/90 px-4 py-1.5 rounded-full shadow-sm">
          {step === 'intro' && 'Pengenalan Latih Diri'}
          {step === 'question' &&
            `Soalan ${qIndex + 1}/5 (${
              mode === 'ar' ? 'Mod AR' : mode === 'lisan' ? 'Mod Lisan' : 'Mod Bertulis'
            })`}
          {step === 'congrats' && 'Selesai'}
        </div>

        <WoodArrowButton direction="next" onClick={handleNext} />
      </div>
    </div>
  );
};
