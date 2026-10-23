import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TopNavBar, AudioSpeakerButton } from './OrganicNav';
import { AR_FLASHCARDS_DATA } from '../data/learningContent';
import { ARCard } from '../types';
import { CikguVector, FrogVector, BoyVector } from './IllustratedCharacters';
import { Camera, CameraOff, Sparkles, RefreshCw, Printer, Volume2, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { TEACHER_PROFILES, TeacherId } from './TeacherCharacters';

interface ARModuleProps {
  onBack: () => void;
  onSessionComplete: (cardId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  teacherId?: TeacherId;
}

export const ARModule: React.FC<ARModuleProps> = ({
  onBack,
  onSessionComplete,
  soundEnabled,
  onToggleSound,
  teacherId = 'syafiqah'
}) => {
  const [selectedCard, setSelectedCard] = useState<ARCard>(AR_FLASHCARDS_DATA[0]);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [modelRotation, setModelRotation] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [targetDetected, setTargetDetected] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [activeGesture, setActiveGesture] = useState<'wave' | 'point' | 'warning' | 'bow' | 'celebrate'>('wave');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize or start camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError('Kamera tidak dapat diakses atau disekat. Mod Simulasi Kad Maya diaktifkan.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    setActiveGesture(selectedCard.animasiWatak);
    onSessionComplete(selectedCard.id);

    return () => {
      stopCamera();
    };
  }, [selectedCard]);

  const handleSimulateScan = (card: ARCard) => {
    setIsScanning(true);
    sound.playClick();
    setTimeout(() => {
      setSelectedCard(card);
      setIsScanning(false);
      setTargetDetected(true);
      sound.playSuccess();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 600);
  };

  return (
    <div className="relative min-h-[640px] max-w-4xl mx-auto rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-slate-900 text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Navbar */}
      <TopNavBar
        onExit={onBack}
        onHome={onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        title="Augmented Reality (AR) Interaktif"
        className="text-white"
      />

      {/* Main AR Viewport & Camera Feed Overlay */}
      <div className="relative flex-1 my-3 rounded-2xl overflow-hidden border-2 border-amber-400/80 bg-slate-950 flex flex-col items-center justify-center min-h-[360px]">
        {/* Real video feed */}
        {cameraActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
        ) : (
          /* Simulated AR Environment Background if camera is off */
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center">
            {/* Holographic AR grid lines */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="text-center p-4 z-10">
              <span className="text-4xl animate-bounce inline-block">📱</span>
              <p className="text-amber-300 font-heading font-bold text-sm mt-2">
                Mod Pengimbas Kad AR (Maya / Kamera)
              </p>
              <p className="text-slate-400 text-xs max-w-xs mt-1">
                Halakan kamera ke kad fizikal atau pilih kad imbasan di bawah untuk melihat animasi watak!
              </p>
            </div>
          </div>
        )}

        {/* AR Target Reticle / Marker Frame */}
        <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-amber-400/60 rounded-3xl pointer-events-none flex flex-col justify-between p-3">
          <div className="flex justify-between items-center text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider bg-black/40 px-3 py-1 rounded-full self-center">
            <span>[ TARGET MARKER: {selectedCard.markerId} ]</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-emerald-400 font-mono font-bold self-center bg-black/40 px-3 py-1 rounded-full">
            <span>● ARCORE / WEBAR ENGINE AKTIF</span>
          </div>
        </div>

        {/* 3D AR Mascot / Animated Hologram Layer */}
        {targetDetected && (
          <div
            className="relative z-20 flex flex-col items-center transform transition-transform duration-300"
            style={{ transform: `rotateY(${modelRotation}deg)` }}
          >
            {/* Interactive Speech Balloon */}
            <div className="mb-3 max-w-xs sm:max-w-md p-4 rounded-2xl bg-white/95 text-slate-900 border-3 border-amber-400 shadow-2xl animate-float relative">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-amber-600 uppercase">
                    {selectedCard.jenis}
                  </span>
                  <h4 className="font-heading font-black text-sm sm:text-base text-amber-900 mt-1">
                    {selectedCard.watakNama}:
                  </h4>
                  <p className="font-bold text-xs sm:text-sm text-slate-800 mt-0.5 leading-snug">
                    {selectedCard.watakDialog}
                  </p>
                </div>
                <AudioSpeakerButton textToSpeak={selectedCard.audioVoice} size="sm" />
              </div>
              {/* Pointer triangle */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-400" />
            </div>

            {/* 3D Circular Pedestal / Hologram Base */}
            <div className="relative flex flex-col items-center">
              {/* Character by ID */}
              {selectedCard.id === 'ar-card-1' && (
                <FrogVector pose="peace" size={150} />
              )}
              {selectedCard.id === 'ar-card-2' && (
                <div className="h-44 sm:h-52 flex items-end justify-center filter drop-shadow-2xl">
                  <img
                    src={TEACHER_PROFILES[teacherId].fullGraphicUrl}
                    alt={TEACHER_PROFILES[teacherId].nama}
                    className="h-full object-contain pointer-events-none"
                  />
                </div>
              )}
              {selectedCard.id === 'ar-card-3' && (
                <BoyVector pose="flag" size={150} />
              )}
              {selectedCard.id === 'ar-card-4' && (
                <BoyVector pose="wave" size={150} />
              )}

              {/* Glowing 3D Pedestal Ring */}
              <div className="w-36 h-8 rounded-[100%] bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 opacity-80 border-2 border-white shadow-[0_0_20px_rgba(245,158,11,0.8)] -mt-2 animate-pulse" />
            </div>
          </div>
        )}

        {/* Viewport Floating Controls */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-auto">
          {/* Toggle Camera */}
          <button
            onClick={() => {
              if (cameraActive) {
                stopCamera();
              } else {
                startCamera();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 backdrop-blur shadow"
          >
            {cameraActive ? <CameraOff size={16} /> : <Camera size={16} />}
            <span>{cameraActive ? 'Tutup Kamera' : 'Buka Kamera'}</span>
          </button>

          {/* Rotate 3D Model */}
          <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-700 backdrop-blur">
            <span className="text-[11px] text-slate-300">Putar 3D:</span>
            <button
              onClick={() => setModelRotation((prev) => prev - 30)}
              className="p-1 hover:bg-slate-700 rounded text-xs"
              title="Putar Kiri"
            >
              ↺
            </button>
            <button
              onClick={() => setModelRotation((prev) => prev + 30)}
              className="p-1 hover:bg-slate-700 rounded text-xs"
              title="Putar Kanan"
            >
              ↻
            </button>
          </div>

          {/* Print physical cards button */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow active:scale-95"
          >
            <Printer size={16} />
            <span>Kad Fizikal</span>
          </button>
        </div>
      </div>

      {/* Bottom AR Flashcard Deck / Marker Selector */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-heading font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={14} /> Pilih Kad Imbasan Pintar AR:
          </span>
          <span className="text-[11px] text-slate-400">Tekan kad untuk imbasan segera</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AR_FLASHCARDS_DATA.map((card) => {
            const isSelected = selectedCard.id === card.id;
            return (
              <button
                key={card.id}
                onClick={() => handleSimulateScan(card)}
                className={`p-2.5 rounded-2xl text-left border-2 transition-all transform hover:-translate-y-0.5 active:scale-95 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-white shadow-[0_0_15px_rgba(251,191,36,0.6)] font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{card.ikonSimbol}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300">
                    {card.markerId}
                  </span>
                </div>
                <h5 className="font-heading font-bold text-xs mt-1 truncate">
                  {card.tajuk.replace('Kad Imbasan AR: ', '')}
                </h5>
                <span className="text-[10px] opacity-80 block uppercase mt-0.5">
                  Ayat {card.jenis}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Printable Cards Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-heading font-black text-xl text-[#78350f]">
                Kad Imbasan Pintar AR (Boleh Cetak)
              </h3>
              <button
                onClick={() => setShowPrintModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2">
              Guru atau murid boleh mencetak atau memaparkan kad-kad imbasan ini pada tablet/telefon kedua. Apabila diimbas dengan kamera aplikasi, watak 3D akan muncul bercakap memberi arahan secara langsung!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              {AR_FLASHCARDS_DATA.map((card) => (
                <div key={card.id} className="p-4 rounded-2xl border-4 border-dashed border-slate-800 bg-amber-50/50 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">{card.ikonSimbol}</span>
                    <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {card.markerId}
                    </span>
                  </div>
                  <h4 className="font-heading font-black text-base text-slate-900 mt-2">
                    {card.tajuk}
                  </h4>
                  <p className="text-xs font-bold text-amber-900 mt-1 italic">
                    "{card.ayatUtama}"
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between">
                    <span>Watak: {card.watakNama}</span>
                    <span className="uppercase font-bold text-amber-700">{card.jenis}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-heading font-bold text-sm shadow"
              >
                Cetak Halaman Ini
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-heading font-bold text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
