import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  Award,
  Upload,
  Film,
  CheckCircle2,
  Tv
} from 'lucide-react';

interface DramaScene {
  id: number;
  masa: string;
  tajuk: string;
  watak: string;
  ayat: string;
  kataPerintah: string;
  jenis: 'larangan' | 'permintaan' | 'suruhan' | 'silaan' | 'penutup' | 'rumusan';
  latar: 'pentas' | 'kampung_malam' | 'rumah_wanita' | 'rumah_lelaki' | 'kejayaan' | 'peta_minda';
  huraian: string;
  narration: string;
  warnaTema: string;
}

const DRAMA_SCENES: DramaScene[] = [
  {
    id: 1,
    masa: '0:15',
    tajuk: 'Adegan 1: Nenek Melarang Menoleh ke Belakang',
    watak: 'Nenek Bertudung Hijau',
    ayat: '“Jangan toleh belakang”',
    kataPerintah: 'Jangan',
    jenis: 'larangan',
    latar: 'pentas',
    huraian: 'Pementasan drama Jangan Toleh Belakang dimulakan dengan seorang nenek melarang cucunya menoleh ke belakang.',
    narration: 'Pementasan itu dimulakan dengan seorang nenek melarang menoleh ke belakang lalu berkata: Jangan toleh belakang!',
    warnaTema: 'bg-rose-100 text-rose-900 border-rose-400'
  },
  {
    id: 2,
    masa: '0:37',
    tajuk: 'Adegan 2: Nenek Meminta Bantuan Cucu',
    watak: 'Nenek & Cucu Lelaki',
    ayat: '“Harap cucu dapat carikan barang-barang yang nenek mahu”',
    kataPerintah: 'Harap',
    jenis: 'permintaan',
    latar: 'kampung_malam',
    huraian: 'Pada suatu malam di kampung, nenek meminta cucunya mencari barangan yang diperlukannya secara sopan.',
    narration: 'Drama itu diteruskan apabila suatu malam, nenek tersebut meminta cucunya mencari sesuatu untuknya dengan berkata: Harap cucu dapat carikan barang-barang yang nenek mahu.',
    warnaTema: 'bg-sky-100 text-sky-900 border-sky-400'
  },
  {
    id: 3,
    masa: '1:04',
    tajuk: 'Adegan 3: Cucu Dihalau oleh Wanita Kampung',
    watak: 'Wanita Berkebaya Ungu & Cucu',
    ayat: '“Pergilah kamu dari sini! Aku tidak dapat memberikan barang-barang yang kamu minta.”',
    kataPerintah: 'Pergilah',
    jenis: 'suruhan',
    latar: 'rumah_wanita',
    huraian: 'Cucu tiba di kampung mencari barangan, namun wanita kampung menghalaunya keluar dari rumah dengan tegas.',
    narration: 'Namun, dia telah dihalau dan disuruh keluar daripada rumah wanita itu: Pergilah kamu dari sini! Aku tidak dapat memberikan barang-barang yang kamu minta.',
    warnaTema: 'bg-amber-100 text-amber-900 border-amber-400'
  },
  {
    id: 4,
    masa: '1:30',
    tajuk: 'Adegan 4: Lelaki Budiman Menjemput Masuk',
    watak: 'Lelaki Budiman Berompi Hijau & Cucu',
    ayat: '“Jemputlah masuk ke rumah saya. Nanti saya akan berikan barang-barang yang kamu perlukan.”',
    kataPerintah: 'Jemputlah',
    jenis: 'silaan',
    latar: 'rumah_lelaki',
    huraian: 'Dalam perjalanan pulang, cucu bertemu seorang lelaki budiman yang mempelawa dan menjemputnya masuk ke rumah dengan santun.',
    narration: 'Lelaki itu telah menjemputnya masuk ke dalam rumah: Jemputlah masuk ke rumah saya. Nanti saya akan berikan barang-barang yang kamu perlukan.',
    warnaTema: 'bg-emerald-100 text-emerald-900 border-emerald-400'
  },
  {
    id: 5,
    masa: '1:45',
    tajuk: 'Adegan 5: Kejayaan & Tepukan Gemuruh Penonton',
    watak: 'Cucu Membawa Bakul & Penonton Teater',
    ayat: '“Cucu berjaya membawa pulang barangan nenek dengan gembira!”',
    kataPerintah: 'Tepukan Gemuruh',
    jenis: 'penutup',
    latar: 'kejayaan',
    huraian: 'Akhirnya cucu berjaya mendapat barangan dan pulang dengan gembira. Tirai merah ditutup dengan tepukan gemuruh daripada penonton!',
    narration: 'Akhirnya, dia berjaya mendapat barangan yang diperlukan oleh nenek dan pulang dengan perasaan gembira. Pementasan drama ini diakhiri dengan tepukan gemuruh daripada penonton!',
    warnaTema: 'bg-purple-100 text-purple-900 border-purple-400'
  },
  {
    id: 6,
    masa: '1:55',
    tajuk: 'Rumusan: 4 Jenis Ayat Perintah dalam Drama',
    watak: 'Peta Minda Ayat Perintah (Learning Port)',
    ayat: 'Larangan (Jangan) · Permintaan (Harap) · Suruhan (Pergilah) · Silaan (Jemputlah)',
    kataPerintah: '4 Kata Perintah',
    jenis: 'rumusan',
    latar: 'peta_minda',
    huraian: 'Rumusan lengkap 4 kata perintah yang dipelajari daripada pementasan drama SK Seri Kundang.',
    narration: 'Berikut merupakan contoh kata yang digunakan untuk membentuk ayat perintah dalam pementasan drama tadi: Jangan untuk larangan, Harap untuk permintaan, Pergilah untuk suruhan dan Jemputlah untuk silaan.',
    warnaTema: 'bg-indigo-100 text-indigo-950 border-indigo-400'
  }
];

export const TeaterDramaVideo: React.FC<{
  onComplete?: () => void;
}> = () => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [isAudienceClapping, setIsAudienceClapping] = useState(false);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>('/assets/aistudio/cerita_ayat_perintah_94f88fc3.mp4');
  const [activeTab, setActiveTab] = useState<'pemain_video' | 'teater'>('pemain_video');
  const timerRef = useRef<number | null>(null);

  const curScene = DRAMA_SCENES[currentSceneIdx];

  // Open curtains on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setCurtainsOpen(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // Play narration ONLY when student clicks audio button
  const playSceneAudio = (idx = currentSceneIdx) => {
    const scene = DRAMA_SCENES[idx];
    sound.playClick();
    sound.speakMalay(scene.narration);

    if (scene.jenis === 'penutup') {
      setIsAudienceClapping(true);
      setTimeout(() => sound.playApplause(), 500);
      setTimeout(() => setIsAudienceClapping(false), 3000);
    }
  };

  // Auto-play theater sequence (visual scene progression only)
  useEffect(() => {
    if (!isPlayingAuto) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentSceneIdx((prev) => {
        if (prev < DRAMA_SCENES.length - 1) {
          return prev + 1;
        } else {
          setIsPlayingAuto(false);
          sound.playFanfare();
          return prev;
        }
      });
    }, 8000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlayingAuto]);

  const handleSelectScene = (idx: number) => {
    sound.playClick();
    setIsPlayingAuto(false);
    setCurrentSceneIdx(idx);
  };

  const handleTogglePlay = () => {
    sound.playClick();
    if (!isPlayingAuto) {
      setIsPlayingAuto(true);
      if (!curtainsOpen) setCurtainsOpen(true);
    } else {
      setIsPlayingAuto(false);
      sound.stopSpeech();
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setIsPlayingAuto(false);
    setCurrentSceneIdx(0);
    setCurtainsOpen(false);
    setTimeout(() => {
      setCurtainsOpen(true);
    }, 600);
  };

  // Handle local video file upload (so teacher or student can load the actual video file directly)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalVideoUrl(url);
      setActiveTab('pemain_video');
      sound.playSuccess();
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in my-2">
      {/* Title & Badge */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 border border-red-300 text-xs font-heading font-black mb-1 shadow-xs">
          <span>🎭</span>
          <span>Pementasan Drama: Jangan Toleh Belakang · SK Seri Kundang</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-heading font-black text-[#582f0e] tracking-tight">
          Pentas Teater Ayat Perintah
        </h2>
        <p className="text-xs text-amber-800 font-medium">
          Dihasilkan sempena Minggu Bahasa Melayu SK Seri Kundang (Sumber: Learning Port Interactive)
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 mb-3 bg-amber-100/80 p-1 rounded-2xl border border-amber-300">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('teater');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
            activeTab === 'teater'
              ? 'bg-amber-500 text-white shadow-xs scale-102 font-black'
              : 'text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          <Film size={14} />
          <span>Animasi Pentas Teater</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('pemain_video');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
            activeTab === 'pemain_video'
              ? 'bg-amber-500 text-white shadow-xs scale-102 font-black'
              : 'text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          <Tv size={14} />
          <span>Pemain Video MP4</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE ANIMATED THEATER STAGE */}
      {activeTab === 'teater' && (
        <div className="relative max-w-3xl w-full rounded-3xl overflow-hidden border-4 border-amber-800 shadow-2xl bg-amber-950 p-3 sm:p-5">
          {/* Top Stage Lighting & Pelmet */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-600 to-transparent opacity-30 pointer-events-none z-30" />

          {/* Red Velvet Curtains Top Valence matching Video */}
          <div className="relative z-40 flex justify-between -mt-3 sm:-mt-5 -mx-3 sm:-mx-5 mb-2 overflow-hidden pointer-events-none">
            <div className="w-1/4 h-10 sm:h-12 bg-gradient-to-b from-red-800 to-red-600 rounded-b-3xl shadow-lg border-b-2 border-red-950" />
            <div className="w-1/3 h-8 sm:h-10 bg-gradient-to-b from-red-800 to-red-600 rounded-b-2xl shadow-lg border-b-2 border-red-950 -mt-1" />
            <div className="w-1/4 h-10 sm:h-12 bg-gradient-to-b from-red-800 to-red-600 rounded-b-3xl shadow-lg border-b-2 border-red-950" />
          </div>

          {/* Main Stage Arena with Animated Curtains */}
          <div className="relative min-h-[320px] sm:min-h-[360px] rounded-2xl overflow-hidden border-4 border-amber-600 bg-[#fdf8f0] shadow-inner flex flex-col justify-between">
            {/* Stage Backdrop depending on Scene */}
            <div className="absolute inset-0 z-0">
              {curScene.latar === 'pentas' ? (
                /* Scene 1: Wooden stage with warm spotlight */
                <div className="w-full h-full bg-gradient-to-b from-[#e6ccb2] via-[#ddb892] to-[#b08968] flex items-center justify-center">
                  <div className="w-80 h-80 rounded-full bg-amber-200/40 blur-2xl" />
                </div>
              ) : curScene.latar === 'kampung_malam' ? (
                /* Scene 2: Night village with coconut trees & wooden hut */
                <div className="w-full h-full bg-gradient-to-b from-slate-900 via-emerald-950 to-amber-900/60 p-4 relative">
                  <span className="absolute top-3 right-6 text-2xl">🌙</span>
                  <span className="absolute top-8 left-8 text-3xl opacity-40">🌴</span>
                  <span className="absolute top-12 right-16 text-3xl opacity-40">🌴</span>
                </div>
              ) : curScene.latar === 'rumah_wanita' ? (
                /* Scene 3: Kampung house balcony with pillars */
                <div className="w-full h-full bg-gradient-to-b from-amber-100 via-orange-50 to-stone-200 relative">
                  <div className="absolute inset-y-0 left-6 w-5 bg-amber-800/20 border-r border-amber-800/40" />
                  <div className="absolute inset-y-0 right-6 w-5 bg-amber-800/20 border-l border-amber-800/40" />
                </div>
              ) : curScene.latar === 'rumah_lelaki' ? (
                /* Scene 4: Wooden stairs hut */
                <div className="w-full h-full bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 relative">
                  <div className="absolute bottom-10 right-4 text-4xl">🏡</div>
                </div>
              ) : curScene.latar === 'kejayaan' ? (
                /* Scene 5: Celebration Spotlight */
                <div className="w-full h-full bg-gradient-to-b from-purple-200 via-amber-100 to-amber-200 flex items-center justify-center">
                  <div className="w-96 h-96 rounded-full bg-amber-300/50 blur-3xl" />
                </div>
              ) : (
                /* Scene 6: Mind Map Board */
                <div className="w-full h-full bg-[#fffbeb] p-4" />
              )}
            </div>

            {/* Red Velvet Left & Right Side Curtains (Opening / Closing) */}
            <div
              className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-red-900 via-red-700 to-red-800 shadow-2xl z-30 transition-transform duration-1000 ease-in-out border-r-4 border-amber-400 ${
                curtainsOpen ? '-translate-x-full' : 'translate-x-0'
              }`}
            >
              {/* Drapery folds */}
              <div className="h-full w-full flex justify-around opacity-30">
                <div className="w-1/6 h-full bg-black/40" />
                <div className="w-1/6 h-full bg-white/20" />
                <div className="w-1/6 h-full bg-black/40" />
              </div>
            </div>

            <div
              className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-red-900 via-red-700 to-red-800 shadow-2xl z-30 transition-transform duration-1000 ease-in-out border-l-4 border-amber-400 ${
                curtainsOpen ? 'translate-x-full' : 'translate-x-0'
              }`}
            >
              {/* Drapery folds */}
              <div className="h-full w-full flex justify-around opacity-30">
                <div className="w-1/6 h-full bg-black/40" />
                <div className="w-1/6 h-full bg-white/20" />
                <div className="w-1/6 h-full bg-black/40" />
              </div>
            </div>

            {/* STAGE CONTENT (Actors & Dialogue Card) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-between p-4">
              {/* Stage Header Badge */}
              <div className="flex items-center gap-2 self-start">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-900 text-amber-100 text-[10px] font-heading font-black shadow-xs">
                  {curScene.masa}
                </span>
                <span className="text-xs font-heading font-bold text-slate-800 bg-white/90 px-3 py-0.5 rounded-full border border-slate-300 shadow-xs">
                  {curScene.tajuk}
                </span>
              </div>

              {/* Character Acting Visuals on Stage */}
              <div className="my-auto py-2 flex items-center justify-center gap-6 sm:gap-10">
                {curScene.id === 1 && (
                  /* Nenek Melarang Menoleh Belakang */
                  <div className="flex flex-col items-center animate-fade-in text-center">
                    <div className="text-6xl sm:text-7xl filter drop-shadow-lg transform -rotate-6 animate-bounce">
                      👵
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-heading font-black">
                      Nenek Bongkok
                    </span>
                    <span className="text-[10px] text-rose-950 font-bold mt-0.5">
                      👉 Menunjuk Jari Tegas
                    </span>
                  </div>
                )}

                {curScene.id === 2 && (
                  /* Nenek & Cucu */
                  <div className="flex items-center gap-6 animate-fade-in">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-6xl filter drop-shadow-md">👵</div>
                      <span className="text-[10px] font-bold text-slate-900 bg-white/80 px-2 rounded">Nenek</span>
                    </div>
                    <div className="text-2xl text-amber-500 animate-pulse">💬</div>
                    <div className="flex flex-col items-center text-center">
                      <div className="text-6xl filter drop-shadow-md">🧒</div>
                      <span className="text-[10px] font-bold text-slate-900 bg-white/80 px-2 rounded">Cucu Lelaki</span>
                    </div>
                  </div>
                )}

                {curScene.id === 3 && (
                  /* Wanita Menghalau Cucu */
                  <div className="flex items-center gap-6 animate-fade-in">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-6xl sm:text-7xl filter drop-shadow-md animate-pulse">
                        👩‍🦱
                      </div>
                      <span className="mt-1 px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-heading font-black">
                        Wanita Berkebaya
                      </span>
                    </div>
                    <div className="text-2xl text-rose-600 font-black">👉 Keluar!</div>
                    <div className="flex flex-col items-center text-center">
                      <div className="text-5xl filter drop-shadow-md opacity-80">
                        🥺
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 bg-white/80 px-2 rounded">Cucu Kecewa</span>
                    </div>
                  </div>
                )}

                {curScene.id === 4 && (
                  /* Lelaki Budiman Menjemput Masuk */
                  <div className="flex items-center gap-6 animate-fade-in">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-6xl sm:text-7xl filter drop-shadow-md transform hover:scale-110 transition-transform">
                        🧔
                      </div>
                      <span className="mt-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-heading font-black">
                        Lelaki Budiman
                      </span>
                    </div>
                    <div className="text-2xl text-emerald-600 font-black">🤝 Jemput Masuk!</div>
                    <div className="flex flex-col items-center text-center">
                      <div className="text-5xl filter drop-shadow-md">😊</div>
                      <span className="text-[10px] font-bold text-slate-800 bg-white/80 px-2 rounded">Cucu Bersyukur</span>
                    </div>
                  </div>
                )}

                {curScene.id === 5 && (
                  /* Cucu dengan Bakul & Tepukan */
                  <div className="flex flex-col items-center animate-fade-in text-center">
                    <div className="text-7xl filter drop-shadow-lg transform hover:scale-110 transition-transform animate-bounce">
                      🧺
                    </div>
                    <span className="mt-1 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-heading font-black shadow-md">
                      Bakul Barangan Penuh! 🌟
                    </span>
                    <p className="text-xs font-bold text-purple-950 mt-1">
                      Cucu pulang dengan gembira membawa barangan nenek
                    </p>
                  </div>
                )}

                {curScene.id === 6 && (
                  /* Rumusan Peta Minda */
                  <div className="w-full max-w-lg grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fade-in">
                    <div className="p-2.5 rounded-xl bg-rose-100 border-2 border-rose-400 text-center shadow-xs">
                      <span className="text-xs font-black text-rose-900 block">LARANGAN</span>
                      <span className="text-base font-black text-rose-700 block mt-1">Jangan</span>
                      <span className="text-[10px] text-rose-800 mt-0.5 block">Menegah perbuatan</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-100 border-2 border-sky-400 text-center shadow-xs">
                      <span className="text-xs font-black text-sky-900 block">PERMINTAAN</span>
                      <span className="text-base font-black text-sky-700 block mt-1">Harap</span>
                      <span className="text-[10px] text-sky-800 mt-0.5 block">Memohon bantuan</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-100 border-2 border-amber-400 text-center shadow-xs">
                      <span className="text-xs font-black text-amber-900 block">SURUHAN</span>
                      <span className="text-base font-black text-amber-700 block mt-1">Pergilah</span>
                      <span className="text-[10px] text-amber-800 mt-0.5 block">Arahan terus</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-100 border-2 border-emerald-400 text-center shadow-xs">
                      <span className="text-xs font-black text-emerald-900 block">SILAAN</span>
                      <span className="text-base font-black text-emerald-700 block mt-1">Jemputlah</span>
                      <span className="text-[10px] text-emerald-800 mt-0.5 block">Menjemput santun</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dialogue Box & Grammar Explanation */}
              <div
                className={`w-full max-w-xl p-3 sm:p-4 rounded-2xl bg-white/95 border-2 ${curScene.warnaTema} shadow-lg text-center backdrop-blur-xs`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-xs font-heading font-black uppercase tracking-wider text-slate-700">
                    Kata Perintah Drama:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-black font-heading shadow-xs">
                    {curScene.kataPerintah}
                  </span>
                </div>

                <p className="text-sm sm:text-lg font-heading font-black text-slate-900 my-1 leading-snug">
                  {curScene.ayat}
                </p>

                <p className="text-xs text-slate-600 mt-1">
                  {curScene.huraian}
                </p>

                <div className="mt-2.5 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      sound.speakMalay(curScene.narration);
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-heading font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                  >
                    <Volume2 size={13} />
                    <span>Dengar Dialog & Latar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stage Wood Planks Base */}
            <div className="relative z-10 w-full h-8 bg-gradient-to-t from-amber-900 to-amber-700 border-t-2 border-amber-500 flex items-center justify-around opacity-90">
              <span className="w-1/4 h-[1px] bg-amber-400/40" />
              <span className="w-1/4 h-[1px] bg-amber-400/40" />
              <span className="w-1/4 h-[1px] bg-amber-400/40" />
            </div>
          </div>

          {/* AUDIENCE SILHOUETTES AT BOTTOM OF THEATER */}
          <div className="flex items-end justify-around pt-3 px-2 z-20">
            <span
              className={`text-2xl sm:text-3xl filter drop-shadow transition-transform ${
                isAudienceClapping ? 'animate-bounce text-amber-300' : 'opacity-60'
              }`}
            >
              👥
            </span>
            <span
              className={`text-2xl sm:text-3xl filter drop-shadow transition-transform ${
                isAudienceClapping ? 'animate-bounce text-amber-300' : 'opacity-60'
              }`}
            >
              👏
            </span>
            <div className="text-center">
              <span className="text-[11px] font-heading font-bold text-amber-200 block">
                Penonton SK Seri Kundang
              </span>
              {isAudienceClapping && (
                <span className="text-[10px] text-amber-400 font-black animate-pulse">
                  *Tepukan Gemuruh!* 👏✨
                </span>
              )}
            </div>
            <span
              className={`text-2xl sm:text-3xl filter drop-shadow transition-transform ${
                isAudienceClapping ? 'animate-bounce text-amber-300' : 'opacity-60'
              }`}
            >
              👏
            </span>
            <span
              className={`text-2xl sm:text-3xl filter drop-shadow transition-transform ${
                isAudienceClapping ? 'animate-bounce text-amber-300' : 'opacity-60'
              }`}
            >
              👥
            </span>
          </div>

          {/* PLAYER CONTROLS (Play, Pause, Restart, Scene Jump) */}
          <div className="mt-3 pt-3 border-t border-amber-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all ${
                  isPlayingAuto
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isPlayingAuto ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlayingAuto ? 'Jeda Pementasan' : 'Mainkan Drama Penuh'}</span>
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 active:scale-95 transition-all"
                title="Mula Semula"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* Scene Selector Buttons (1 to 6) */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {DRAMA_SCENES.map((sc, i) => (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScene(i)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-heading font-bold transition-all ${
                    currentSceneIdx === i
                      ? 'bg-amber-400 text-amber-950 font-black scale-105 shadow-xs'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                  }`}
                  title={sc.tajuk}
                >
                  #{sc.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HTML5 VIDEO PLAYER (DIRECT MP4 VIDEO) */}
      {activeTab === 'pemain_video' && (
        <div className="max-w-2xl w-full bg-slate-900 rounded-3xl p-4 sm:p-6 border-4 border-amber-500 shadow-2xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-700">
            <div>
              <h3 className="text-base font-heading font-black text-amber-400">
                Pemain Video Teater Drama SK Seri Kundang
              </h3>
              <p className="text-xs text-slate-300">
                Pementasan Drama "Jangan Toleh Belakang" (Learning Port Interactive)
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full font-mono border border-amber-500/40">
              02:39 MP4
            </span>
          </div>

          {/* HTML5 Video Element if file uploaded / selected */}
          {localVideoUrl ? (
            <div className="w-full rounded-2xl overflow-hidden border-2 border-slate-600 bg-black aspect-video shadow-lg">
              <video
                src={localVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Pelayar anda tidak menyokong tag video HTML5.
              </video>
            </div>
          ) : (
            <div className="w-full rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800/60 p-6 sm:p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mb-3 shadow-inner">
                🎬
              </div>
              <h4 className="text-sm sm:text-base font-heading font-black text-slate-100 mb-1">
                Video Pementasan Drama: Jangan Toleh Belakang
              </h4>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
                Video pementasan drama SK Seri Kundang ini mengandungi babak Nenek (Jangan), Cucu (Harap), Wanita Kampung (Pergilah) dan Lelaki Budiman (Jemputlah).
              </p>

              {/* Upload Local Video Button */}
              <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-heading font-black text-xs shadow-md transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95">
                <Upload size={16} />
                <span>Pilih / Muat Naik Fail Video (.mp4)</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-slate-500 mt-2">
                Format disokong: MP4, WebM, MOV
              </span>
            </div>
          )}

          {/* Video Scene Breakdown Summary */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-left">
            <h5 className="text-xs font-heading font-bold text-amber-300 mb-2">
              Kandungan Babak Dalam Video (02:39):
            </h5>
            <ul className="text-[11px] text-slate-300 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold shrink-0">0:15 -</span>
                <span>Nenek melarang cucu: <strong className="text-rose-300">“Jangan toleh belakang”</strong> (Ayat Larangan)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-400 font-bold shrink-0">0:37 -</span>
                <span>Nenek memohon bantuan: <strong className="text-sky-300">“Harap cucu dapat carikan barang...”</strong> (Ayat Permintaan)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">1:04 -</span>
                <span>Wanita kampung menghalau: <strong className="text-amber-300">“Pergilah kamu dari sini!”</strong> (Ayat Suruhan)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">1:30 -</span>
                <span>Lelaki budiman mempelawa: <strong className="text-emerald-300">“Jemputlah masuk ke rumah saya...”</strong> (Ayat Silaan)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold shrink-0">1:55 -</span>
                <span>Rumusan Peta Minda & Tepukan Gemuruh Tirai Merah (SK Seri Kundang)</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
