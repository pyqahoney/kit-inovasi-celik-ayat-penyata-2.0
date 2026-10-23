import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { TopNavBar, AudioSpeakerButton } from './OrganicNav';
import { TrialogicalArtifact, AyatPerintahType } from '../types';
import { INITIAL_TRIAL_ARTIFACTS } from '../data/learningContent';
import { Palette, Award, Send, Sparkles, CheckCircle2, BookmarkPlus } from 'lucide-react';
import { sound } from '../utils/audio';

interface StudioTrialogikalProps {
  onBack: () => void;
  onSaveArtifact: (artifact: TrialogicalArtifact) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentStudentName: string;
}

export const StudioTrialogikal: React.FC<StudioTrialogikalProps> = ({
  onBack,
  onSaveArtifact,
  soundEnabled,
  onToggleSound,
  currentStudentName
}) => {
  const [artifacts, setArtifacts] = useState<TrialogicalArtifact[]>(INITIAL_TRIAL_ARTIFACTS);
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');

  // Form state
  const [tajuk, setTajuk] = useState('Papan Tanda Kebersihan Kantin Sekolah');
  const [kategori, setKategori] = useState<'poster' | 'kad_jemputan' | 'papan_tanda' | 'peraturan'>('papan_tanda');
  const [jenisAyat, setJenisAyat] = useState<AyatPerintahType>('permintaan');
  const [ayatUtama, setAyatUtama] = useState('Tolong letakkan pinggan dan cawan ke dalam besen bertanda.');
  const [ayatKeterangan, setAyatKeterangan] = useState('Kebersihan kantin tanggungjawab warga sekolah demi kesihatan bersama.');
  const [ikonHiasan, setIkonHiasan] = useState('🥣');
  const [warnaLatar, setWarnaLatar] = useState('from-sky-500 to-indigo-600');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();

    const newArt: TrialogicalArtifact = {
      id: `art-${Date.now()}`,
      tajuk,
      kategori,
      jenisAyatDipilih: jenisAyat,
      ayatPerintahUtama: ayatUtama,
      ayatKeterangan,
      penciptaNama: `${currentStudentName} (Tahun 5)`,
      ikonHiasan,
      warnaLatar,
      tarikhDicipta: '2026-10-21',
      tahapPenguasaan: 6,
      maklumBalasGuru: 'Artifak autentik yang sangat kreatif! Memenuhi standard Model Pembelajaran Trialogikal (TP6).',
      statusPenilaian: 'Cemerlang'
    };

    setArtifacts([newArt, ...artifacts]);
    onSaveArtifact(newArt);

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setActiveTab('gallery');
  };

  return (
    <div className="relative min-h-[640px] max-w-4xl mx-auto rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl bg-amber-50/60 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Navbar */}
      <TopNavBar
        onExit={onBack}
        onHome={onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        title="Studio Penciptaan Artifak Trialogikal"
      />

      {/* Trialogical Concept Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 p-3 rounded-2xl border-2 border-amber-300 my-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-heading font-black text-amber-950 text-sm flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-600" /> Model Pembelajaran Trialogikal:
          </span>
          <p className="text-amber-900 font-medium mt-0.5">
            Murid bukan sekadar menghafal, tetapi <strong>merekacipta artifak pengetahuan bermakna</strong> (poster, kad silaan & papan tanda) yang boleh digunakan di sekolah sebenar untuk mencapai TP6!
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-1 bg-amber-200/80 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1 rounded-lg font-heading font-bold transition-all ${
              activeTab === 'create' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-950 hover:bg-amber-300'
            }`}
          >
            Cipta Artifak
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1 rounded-lg font-heading font-bold transition-all ${
              activeTab === 'gallery' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-950 hover:bg-amber-300'
            }`}
          >
            Galeri Sekolah ({artifacts.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'create' ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-2 animate-fade-in">
          {/* Form Left Column */}
          <form onSubmit={handleCreate} className="bg-white/95 p-4 sm:p-5 rounded-3xl border-2 border-amber-300 shadow-md flex flex-col justify-between space-y-3">
            <h3 className="font-heading font-black text-base text-amber-950 flex items-center gap-1.5">
              <Palette size={18} className="text-amber-600" /> Borang Pereka Cilik:
            </h3>

            {/* Template / Kategori */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori Artifak:
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-heading font-bold">
                {[
                  { id: 'papan_tanda', label: '🪧 Papan Tanda Kantin' },
                  { id: 'poster', label: '🖼️ Poster Makmal' },
                  { id: 'kad_jemputan', label: '💌 Kad Jemputan Hari Raya' },
                  { id: 'peraturan', label: '📋 Peraturan Kelas' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      setKategori(item.id as typeof kategori);
                      if (item.id === 'papan_tanda') {
                        setTajuk('Papan Tanda Kebersihan Kantin');
                        setJenisAyat('permintaan');
                        setAyatUtama('Tolong letakkan pinggan dan cawan ke dalam besen bertanda.');
                        setIkonHiasan('🥣');
                        setWarnaLatar('from-sky-500 to-indigo-600');
                      } else if (item.id === 'poster') {
                        setTajuk('Poster Keselamatan Makmal Komputer');
                        setJenisAyat('larangan');
                        setAyatUtama('Jangan bawa makanan atau minuman manis ke dalam makmal.');
                        setIkonHiasan('💻');
                        setWarnaLatar('from-rose-500 to-amber-600');
                      } else if (item.id === 'kad_jemputan') {
                        setTajuk('Kad Silaan Jamuan Mesra Kelas');
                        setJenisAyat('silaan');
                        setAyatUtama('Sila hadir dan jemputlah rasa juadah kuih tradisional kami.');
                        setIkonHiasan('🌙');
                        setWarnaLatar('from-emerald-500 to-teal-600');
                      } else {
                        setTajuk('Peraturan Disiplin Kelas 5 Bestari');
                        setJenisAyat('suruhan');
                        setAyatUtama('Kemas beg dan susun meja kamu sebelum pulang ke rumah.');
                        setIkonHiasan('🎒');
                        setWarnaLatar('from-amber-500 to-orange-600');
                      }
                    }}
                    className={`p-1.5 rounded-xl border text-left transition-all ${
                      kategori === item.id
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-slate-50 hover:bg-amber-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Jenis Ayat Perintah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fokus Jenis Ayat Perintah:
              </label>
              <select
                value={jenisAyat}
                onChange={(e) => setJenisAyat(e.target.value as AyatPerintahType)}
                className="w-full text-xs font-bold p-2 rounded-xl border border-amber-300 bg-white"
              >
                <option value="permintaan">Ayat Permintaan (Tolong / Harap / Minta)</option>
                <option value="larangan">Ayat Larangan (Jangan / Usah)</option>
                <option value="silaan">Ayat Silaan (Sila / Jemput)</option>
                <option value="suruhan">Ayat Suruhan (Arahan terus / -lah)</option>
              </select>
            </div>

            {/* Ayat Perintah Utama */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ayat Perintah Utama (Teras Artifak):
              </label>
              <input
                type="text"
                value={ayatUtama}
                onChange={(e) => setAyatUtama(e.target.value)}
                required
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Ayat Keterangan / Rasional */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Keterangan & Rasional Kesantunan:
              </label>
              <input
                type="text"
                value={ayatKeterangan}
                onChange={(e) => setAyatKeterangan(e.target.value)}
                required
                className="w-full text-xs p-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-heading font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Send size={16} /> Terbitkan Artifak ke Rekod PBS (TP6) 🚀
            </button>
          </form>

          {/* Live Preview Right Column */}
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Pratonton Artifak Nyata:
            </span>

            {/* Poster Canvas */}
            <div
              className={`w-full max-w-sm aspect-[4/5] rounded-3xl p-6 bg-gradient-to-br ${warnaLatar} text-white shadow-2xl flex flex-col justify-between border-4 border-white/60 relative overflow-hidden`}
            >
              {/* Top Bar on Poster */}
              <div className="flex justify-between items-start z-10">
                <span className="text-4xl">{ikonHiasan}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur text-[10px] font-black tracking-widest uppercase">
                  AYAT {jenisAyat}
                </span>
              </div>

              {/* Main Message */}
              <div className="text-center z-10 my-auto">
                <h4 className="font-heading font-black text-lg sm:text-xl drop-shadow mb-3 leading-snug">
                  “{ayatUtama}”
                </h4>
                <p className="text-xs sm:text-sm font-medium opacity-90 italic">
                  {ayatKeterangan}
                </p>
              </div>

              {/* Poster Footer */}
              <div className="border-t border-white/30 pt-2 flex justify-between items-center text-[10px] font-medium opacity-80 z-10">
                <span>Pereka: {currentStudentName}</span>
                <span>Sekolah Rendah Kebangsaan</span>
              </div>

              {/* Background decorative watermark */}
              <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 pointer-events-none select-none">
                {ikonHiasan}
              </div>
            </div>

            <div className="mt-3">
              <AudioSpeakerButton textToSpeak={`${ayatUtama}. ${ayatKeterangan}`} size="md" label="Uji Sebutan Artifak" />
            </div>
          </div>
        </div>
      ) : (
        /* Gallery Tab */
        <div className="flex-1 my-2 overflow-y-auto max-h-[460px] pr-1 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {artifacts.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{art.ikonHiasan}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                      Ayat {art.jenisAyatDipilih}
                    </span>
                  </div>
                  <h4 className="font-heading font-black text-base text-slate-900">
                    {art.tajuk}
                  </h4>
                  <p className="font-bold text-sm text-amber-900 mt-2 bg-amber-50 p-2 rounded-xl border border-amber-200">
                    “{art.ayatPerintahUtama}”
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {art.ayatKeterangan}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{art.penciptaNama}</span>
                    <span className="font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      TP{art.tahapPenguasaan} Cemerlang
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 mt-2">
                    💬 Guru: {art.maklumBalasGuru}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#ddb892] hover:bg-[#b08968] text-[#582f0e] font-heading font-bold text-sm border-2 border-[#7f4f24] shadow"
        >
          Kembali ke Menu
        </button>
        <span className="text-xs text-amber-900 font-bold">
          Model Trialogikal: Murid Sebagai Pencipta Artifak
        </span>
      </div>
    </div>
  );
};
