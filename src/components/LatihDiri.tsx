import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TopNavBar, WoodArrowButton } from './OrganicNav';
import { sound } from '../utils/audio';
import { TeacherStandee, TeacherId, TEACHER_PROFILES } from './TeacherCharacters';
import { BoyVector } from './IllustratedCharacters';
import { FoliageForeground } from './StoryGraphics';
import { Camera, CameraOff, FlipHorizontal, Hand, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

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
  const [mode, setMode] = useState<'biasa' | 'ar'>('biasa');
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

  // Real-world Optical Hand Detection States for AR Grab
  const [detectedHandIdx, setDetectedHandIdx] = useState<number | null>(null);
  const [handDwellProgress, setHandDwellProgress] = useState<number>(0);
  const analyzerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);

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

  const handleReveal = () => {
    sound.playApplause();
    setShowAnswer(true);
  };

  const handleNext = () => {
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

  // Optical Hand Motion & Dwell Detection for AR Mode (identical mechanism to Katak Si Katak Lompat)
  useEffect(() => {
    if (mode !== 'ar' || !cameraActive || step !== 'question' || showAnswer) {
      setDetectedHandIdx(null);
      setHandDwellProgress(0);
      return;
    }

    let dwellCount = 0;
    let targetIdx: number | null = null;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = analyzerCanvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, 160, 120);
      const frame = ctx.getImageData(0, 0, 160, 120);
      const data = frame.data;
      const prevData = prevFrameDataRef.current;

      let score0 = 0; // Choice 1 (Left)
      let score1 = 0; // Choice 2 (Center)
      let score2 = 0; // Choice 3 (Right)

      if (prevData) {
        for (let y = 30; y < 110; y += 4) {
          for (let x = 10; x < 150; x += 4) {
            const idx = (y * 160 + x) * 4;
            const rDiff = Math.abs(data[idx] - prevData[idx]);
            const gDiff = Math.abs(data[idx + 1] - prevData[idx + 1]);
            const bDiff = Math.abs(data[idx + 2] - prevData[idx + 2]);
            const totalDiff = rDiff + gDiff + bDiff;

            const weight = totalDiff > 50 ? 2 : totalDiff > 32 ? 1 : 0;
            if (weight > 0) {
              if (x >= 10 && x < 55) {
                score0 += weight;
              } else if (x >= 55 && x < 105) {
                score1 += weight;
              } else if (x >= 105 && x <= 150) {
                score2 += weight;
              }
            }
          }
        }
      }

      prevFrameDataRef.current = new Uint8ClampedArray(data);

      const threshold = 26;
      let foundIdx: number | null = null;
      let maxScore = threshold;

      if (score0 > maxScore) {
        foundIdx = 0;
        maxScore = score0;
      }
      if (score1 > maxScore) {
        foundIdx = 1;
        maxScore = score1;
      }
      if (score2 > maxScore) {
        foundIdx = 2;
        maxScore = score2;
      }

      if (foundIdx !== null) {
        if (targetIdx === foundIdx) {
          dwellCount += 1;
          const progress = Math.min(100, Math.round((dwellCount / 5) * 100));
          setHandDwellProgress(progress);

          if (dwellCount >= 5) {
            dwellCount = 0;
            setHandDwellProgress(0);
            setDetectedHandIdx(null);
            handleGrabChoice(cur.choices[foundIdx]);
          }
        } else {
          targetIdx = foundIdx;
          dwellCount = 1;
          setHandDwellProgress(20);
          setDetectedHandIdx(foundIdx);
        }
      } else {
        dwellCount = Math.max(0, dwellCount - 1);
        if (dwellCount === 0) {
          targetIdx = null;
          setDetectedHandIdx(null);
          setHandDwellProgress(0);
        } else {
          setHandDwellProgress(Math.round((dwellCount / 5) * 100));
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, [mode, cameraActive, step, showAnswer, cur]);

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

      {/* Mode Switcher Tabs (Mod Biasa vs Mod AR Grab Tangan) */}
      <div className="flex items-center justify-center gap-2 my-1 z-20">
        <button
          onClick={() => {
            sound.playClick();
            setMode('biasa');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
            mode === 'biasa'
              ? 'bg-amber-500 text-white shadow-md scale-105 border-2 border-amber-600'
              : 'bg-white/90 text-amber-900 border border-amber-300 hover:bg-amber-100'
          }`}
        >
          <span>📱</span>
          <span>Mod Biasa (Sentuh & Pilih)</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setMode('ar');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
            mode === 'ar'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-105 border-2 border-purple-400'
              : 'bg-white/90 text-purple-900 border border-purple-300 hover:bg-purple-100'
          }`}
        >
          <span>✋</span>
          <span>Mod AR (Grab Guna Tangan)</span>
          <span className="text-[10px] bg-yellow-400 text-amber-950 px-2 py-0.5 rounded-full font-black animate-pulse">
            KAMERA
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
              bubbleText={
                mode === 'ar'
                  ? `“Anda memilih Mod AR! Anda boleh menjawab dengan grab jawapan guna tangan di hadapan kamera bersama ${TEACHER_PROFILES[teacherId].nama}!”`
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
          {/* AR Mode Video Feed Background */}
          {mode === 'ar' && (
            <div className="absolute inset-0 rounded-3xl overflow-hidden border-3 border-purple-500 shadow-2xl z-0 bg-slate-900">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-3xl mb-2 animate-bounce">
                    ✋
                  </div>
                  <h4 className="font-heading font-black text-lg text-purple-200">
                    Mod AR Maya (Simulasi Interaktif)
                  </h4>
                  <p className="text-xs text-slate-300 max-w-sm mt-1">
                    Gerakkan tangan di hadapan kamera atau sentuh kad jawapan untuk <strong>GRAB</strong> pilihan anda!
                  </p>
                </div>
              )}

              {/* AR Controls Header */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5 z-30">
                <button
                  onClick={toggleFacingMode}
                  className="p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs flex items-center gap-1 border border-white/30 backdrop-blur-sm cursor-pointer"
                  title="Tukar Kamera"
                >
                  <FlipHorizontal size={14} />
                  <span className="text-[10px] hidden sm:inline">Tukar Kamera</span>
                </button>
              </div>
            </div>
          )}

          {/* Question Card Content Container */}
          <div
            className={`relative max-w-2xl mx-auto w-full p-5 sm:p-7 rounded-3xl border-3 shadow-xl text-center z-10 transition-all ${
              mode === 'ar'
                ? 'bg-black/75 backdrop-blur-md border-purple-400 text-white'
                : 'bg-white/95 border-dashed border-amber-400'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
              <span className={`font-heading font-black text-lg ${mode === 'ar' ? 'text-amber-300' : 'text-amber-800'}`}>
                Soalan {qIndex + 1} daripada {DRILL_QUESTIONS.length}
              </span>

              {/* Clue Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold shadow-xs ${
                  mode === 'ar'
                    ? 'bg-purple-900/90 text-purple-200 border border-purple-400'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                <span>💡</span>
                <span>
                  <strong>Pembayang:</strong> {cur.clue}
                </span>
              </div>
            </div>

            {/* Sentence Display */}
            <div
              className={`text-xl sm:text-2xl font-heading font-bold my-4 leading-relaxed ${
                mode === 'ar' ? 'text-white' : 'text-slate-800'
              }`}
            >
              {cur.sentenceStart && <span>{cur.sentenceStart} </span>}
              <span
                className={`inline-block px-3 py-1 rounded-xl mx-1 font-extrabold transition-all ${
                  showAnswer
                    ? 'bg-emerald-500 text-white border-2 border-emerald-300 animate-bounce'
                    : userChoice
                    ? 'bg-amber-400 text-amber-950 border-2 border-amber-600 scale-105'
                    : mode === 'ar'
                    ? 'bg-purple-900/80 text-purple-200 border-2 border-dashed border-purple-400'
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
                      : mode === 'ar'
                      ? 'bg-purple-900/80 text-purple-200 border-2 border-dashed border-purple-400'
                      : 'bg-amber-100 text-amber-900 border-2 border-dashed border-amber-400'
                  }`}
                >
                  {showAnswer ? cur.answer2 : cur.blank2}
                </span>
              )}
              {cur.sentenceEnd && <span>{cur.sentenceEnd}</span>}
            </div>

            {/* MOD AR: Floating Hand-Grab Cards with Optical Dwell Circle */}
            {mode === 'ar' ? (
              <div className="my-4">
                <div className="flex items-center justify-center gap-2 mb-2 text-xs font-heading font-bold text-yellow-300">
                  <Hand size={16} className="animate-bounce" />
                  <span>
                    Halakan tangan di hadapan kad atau sentuh untuk <strong>GRAB</strong>:
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {cur.choices.map((c, idx) => {
                    const isGrabbed = userChoice === c;
                    const isTargetHand = detectedHandIdx === idx;
                    return (
                      <button
                        key={c}
                        onClick={() => handleGrabChoice(c)}
                        className={`relative p-3 rounded-2xl font-heading font-black text-sm sm:text-base border-3 cursor-pointer transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1 shadow-lg ${
                          isGrabbed
                            ? 'bg-gradient-to-b from-yellow-300 to-amber-500 text-slate-950 border-white scale-110 ring-4 ring-yellow-400 shadow-[0_0_20px_#facc15]'
                            : isTargetHand
                            ? 'bg-gradient-to-b from-purple-500 to-indigo-600 text-white border-yellow-300 scale-105 ring-4 ring-yellow-300'
                            : 'bg-purple-800/90 hover:bg-purple-700 text-white border-purple-400 hover:scale-105'
                        }`}
                      >
                        {/* Dwell Progress Indicator on Hand Detection */}
                        {isTargetHand && handDwellProgress > 0 && !isGrabbed && (
                          <div className="absolute inset-0 rounded-2xl border-4 border-yellow-400 bg-yellow-400/20 flex items-center justify-center">
                            <span className="text-xs font-black text-yellow-300 bg-black/80 px-2 py-0.5 rounded-full">
                              GRABBING {handDwellProgress}%
                            </span>
                          </div>
                        )}

                        <span className="text-xl">✋</span>
                        <span>{c}</span>
                        {isGrabbed && <span className="text-[10px] text-amber-950 font-black">TERGRAB!</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* MOD BIASA: Standard Multiple Choice Buttons */
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
            )}

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
          {step === 'question' && `Soalan ${qIndex + 1}/5 (${mode === 'ar' ? 'Mod AR' : 'Mod Biasa'})`}
          {step === 'congrats' && 'Selesai'}
        </div>

        <WoodArrowButton direction="next" onClick={handleNext} />
      </div>
    </div>
  );
};
