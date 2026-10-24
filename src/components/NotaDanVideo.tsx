import React, { useState } from 'react';
import { TopNavBar, WoodArrowButton, AudioSpeakerButton } from './OrganicNav';
import { CikguVector, CatVector } from './IllustratedCharacters';
import { MotherAndDaughterVector, PolarBearAndBoardCat, EmotiveShapeMascot, BlueBirdVector } from './StoryGraphics';
import { Play, Pause, RotateCcw, Sparkles, Volume2, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';
import { TeaterDramaVideo } from './TeaterDramaVideo';

interface NotaDanVideoProps {
  initialSubTab?: 'nota' | 'video' | 'teater';
  onBack: () => void;
  onHome?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NotaDanVideo: React.FC<NotaDanVideoProps> = ({
  initialSubTab = 'nota',
  onBack,
  onHome,
  soundEnabled,
  onToggleSound
}) => {
  // Page index within notes (0 to 6):
  // 0: Definisi Ayat Perintah (Page 8)
  // 1: Contoh Situasi Ibu & Anak (Pages 9-11)
  // 2: Definisi 4 Jenis Ayat Perintah (Page 14 - Dahulu!)
  // 3: Peta Minda 4 Jenis Kata Perintah (Page 12)
  // 4: 7 Kata Perintah Disusun Ikut Jenis (Page 13)
  // 5: Video Pembelajaran Guru (Page 15)
  // 6: Pentas Teater Drama SK Seri Kundang (Video MP4)
  const [pageIndex, setPageIndex] = useState(
    initialSubTab === 'video' ? 5 : initialSubTab === 'teater' ? 6 : 0
  );

  const handleNextPage = () => {
    if (pageIndex < 6) {
      setPageIndex((prev) => prev + 1);
    } else {
      onBack();
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="relative min-h-[640px] max-w-4xl mx-auto rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl bg-gradient-to-b from-sky-50 via-amber-50 to-emerald-50 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Navbar */}
      <TopNavBar
        onExit={onBack}
        onHome={onHome || onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        title={
          pageIndex <= 4
            ? `Nota Interaktif (${pageIndex + 1}/5)`
            : pageIndex === 5
            ? 'Video Pembelajaran: Cikgu Syafiqah, Freshcy & Aaron'
            : 'Pentas Teater Drama: Jangan Toleh Belakang'
        }
      />

      {/* Quick Jump Bar for Teacher & Student */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 px-2 my-1">
        {[
          { label: '1. Definisi', idx: 0 },
          { label: '2. Situasi', idx: 1 },
          { label: '3. Jenis Ayat Perintah', idx: 2 },
          { label: '4. Jenis Kata Perintah', idx: 3 },
          { label: '5. 7 Kata Perintah', idx: 4 },
          { label: '6. 📹 Video Guru', idx: 5 },
          { label: '7. 🎭 Pentas Teater', idx: 6 }
        ].map((tab) => (
          <button
            key={tab.idx}
            onClick={() => {
              sound.playClick();
              setPageIndex(tab.idx);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-heading font-bold transition-all ${
              pageIndex === tab.idx
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-white/80 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PAGE 0: Definisi Ayat Perintah (Page 8) */}
      {pageIndex === 0 && (
        <div className="flex-1 flex flex-col justify-center my-3 animate-fade-in">
          <div className="text-center mb-3">
            <h1 className="text-3xl sm:text-5xl font-heading font-black text-[#582f0e] tracking-tight">
              Ayat perintah
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl mx-auto w-full">
            {/* 2 Note Cards matching storyboard */}
            <div className="flex-1 space-y-4">
              <div className="p-5 rounded-3xl bg-[#fffbeb] border-3 border-dashed border-amber-400 shadow-md transform hover:scale-102 transition-transform">
                <div className="flex items-start justify-between">
                  <p className="text-lg sm:text-xl font-heading font-bold text-amber-900 leading-snug">
                    Ayat yang digunakan untuk menimbulkan sesuatu tindakan
                  </p>
                  <AudioSpeakerButton textToSpeak="Ayat yang digunakan untuk menimbulkan sesuatu tindakan." size="sm" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#fffbeb] border-3 border-dashed border-amber-400 shadow-md transform hover:scale-102 transition-transform">
                <div className="flex items-start justify-between">
                  <p className="text-lg sm:text-xl font-heading font-bold text-amber-900 leading-snug">
                    Perintah ditujukan kepada orang kedua menggunakan kata ganti nama orang kedua
                  </p>
                  <AudioSpeakerButton textToSpeak="Perintah ditujukan kepada orang kedua menggunakan kata ganti nama orang kedua." size="sm" />
                </div>
              </div>
            </div>

            {/* Mother and Daughter real uploaded illustration */}
            <div className="shrink-0 flex flex-col items-center justify-center p-2.5 bg-white/95 rounded-3xl border-3 border-amber-300 shadow-xl max-w-xs overflow-hidden transform hover:scale-102 transition-transform">
              <img
                src="/assets/aistudio/c11bd8d4-1a10-485b-b4de-becf3a2774f8_d864cc31.jpg"
                alt="Ibu memberi arahan kepada anak"
                className="w-full h-auto rounded-2xl object-cover shadow-sm max-h-56"
              />
              <span className="text-[11px] font-heading font-black text-amber-900 mt-2 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
                Situasi: Ibu Memberi Arahan Kepada Anak 👩‍👧
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 1: Contoh Situasi Ibu & Anak (Pages 9-11) */}
      {pageIndex === 1 && (
        <div className="flex-1 flex flex-col justify-center my-2 animate-fade-in">
          <div className="text-center mb-2">
            <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full font-heading font-bold text-xs uppercase tracking-wider">
              Contoh Ayat & Struktur Perintah
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900 mt-1">
              “Kamu tolong ibu kemaskan rumah.”
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-5 max-w-4xl mx-auto w-full my-2">
            {/* Real Uploaded Mother & Child Image on Page 2 */}
            <div className="w-full md:w-5/12 flex flex-col items-center">
              <div className="p-2.5 bg-white/95 rounded-3xl border-3 border-amber-400 shadow-xl overflow-hidden max-w-sm">
                <img
                  src="/assets/aistudio/c11bd8d4-1a10-485b-b4de-becf3a2774f8_d864cc31.jpg"
                  alt="Ibu memberi arahan kepada anak"
                  className="w-full h-auto rounded-2xl object-cover max-h-52"
                />
                <div className="p-2 text-center">
                  <p className="text-xs font-heading font-black text-amber-950">
                    “Kamu tolong ibu kemaskan rumah ya, sayang.”
                  </p>
                  <p className="text-[10px] text-amber-800 font-medium mt-0.5">
                    Ibu menggunakan kata perintah santun "tolong" dengan intonasi mesra.
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation Breakdown & Whiteboard */}
            <div className="w-full md:w-7/12 space-y-3">
              <div className="flex justify-center">
                <PolarBearAndBoardCat signText="tolong merupakan kata perintah" size={260} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                <div className="p-3 rounded-2xl bg-amber-100/90 border-2 border-amber-400 text-center flex items-center gap-3 shadow-sm">
                  <span className="text-2xl">👩</span>
                  <div className="text-left">
                    <h4 className="font-heading font-bold text-xs text-amber-950 uppercase">orang yang memberikan arahan</h4>
                    <p className="text-[11px] text-amber-900">Ibu yang menuturkan perintah kepada anak.</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-sky-100/90 border-2 border-sky-400 text-center flex items-center gap-3 shadow-sm">
                  <span className="text-2xl">👧</span>
                  <div className="text-left">
                    <h4 className="font-heading font-bold text-xs text-sky-950 uppercase">orang kedua</h4>
                    <p className="text-[11px] text-sky-900">Kata ganti nama "kamu" yang menerima suruhan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2: 4 Jenis Ayat Perintah (Page 14 - DAHULU SEPERTI DIMINTA) */}
      {pageIndex === 2 && (
        <div className="flex-1 flex flex-col justify-center my-2 animate-fade-in">
          <div className="text-center mb-3">
            <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full font-heading font-black text-xs uppercase tracking-wider">
              Halaman 1: Jenis Ayat Perintah
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900 mt-1">
              4 Jenis Ayat Perintah
            </h2>
            <p className="text-xs text-amber-800 font-semibold mt-1">
              Fahami 4 tujuan utama ayat perintah dituturkan mengikut konteks
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto w-full">
            <div className="p-4 rounded-3xl bg-amber-50 border-3 border-amber-400 shadow-md transform hover:scale-102 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-heading font-black text-lg text-amber-900 flex items-center gap-1.5">
                  <span>🤝</span>
                  <span>Ayat Permintaan</span>
                </h3>
                <AudioSpeakerButton textToSpeak="Ayat permintaan: Ayat yang menggunakan kata permintaan dengan tujuan memohon permintaan dan pertolongan." size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Ayat yang menggunakan kata permintaan dengan tujuan memohon permintaan dan pertolongan.
              </p>
              <div className="mt-2 pt-2 border-t border-amber-200/80 text-[11px] font-bold text-amber-800">
                Contoh: <em>“Tolong tutup suis lampu itu.”</em>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-emerald-50 border-3 border-emerald-400 shadow-md transform hover:scale-102 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-heading font-black text-lg text-emerald-900 flex items-center gap-1.5">
                  <span>📢</span>
                  <span>Ayat Suruhan</span>
                </h3>
                <AudioSpeakerButton textToSpeak="Ayat suruhan: Ayat yang digunakan dengan tujuan memberi perintah atau arahan sesuatu tindakan." size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Ayat yang digunakan dengan tujuan memberi perintah atau arahan sesuatu tindakan.
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-200/80 text-[11px] font-bold text-emerald-800">
                Contoh: <em>“Kemas bilik tidur kamu sekarang.”</em>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-rose-50 border-3 border-rose-400 shadow-md transform hover:scale-102 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-heading font-black text-lg text-rose-900 flex items-center gap-1.5">
                  <span>🚫</span>
                  <span>Ayat Larangan</span>
                </h3>
                <AudioSpeakerButton textToSpeak="Ayat larangan: Ayat yang menggunakan kata larangan dengan tujuan menegah seseorang melakukan sesuatu." size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Ayat yang menggunakan kata larangan dengan tujuan menegah seseorang melakukan sesuatu.
              </p>
              <div className="mt-2 pt-2 border-t border-rose-200/80 text-[11px] font-bold text-rose-800">
                Contoh: <em>“Jangan buang sampah di sini.”</em>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-sky-50 border-3 border-sky-400 shadow-md transform hover:scale-102 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-heading font-black text-lg text-sky-900 flex items-center gap-1.5">
                  <span>🌸</span>
                  <span>Ayat Silaan</span>
                </h3>
                <AudioSpeakerButton textToSpeak="Ayat silaan: Ayat yang menggunakan kata silaan sebelum kata kerja dengan tujuan menjemput atau mempersilakan seseorang." size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Ayat yang menggunakan kata silaan sebelum kata kerja dengan tujuan menjemput atau mempersilakan seseorang.
              </p>
              <div className="mt-2 pt-2 border-t border-sky-200/80 text-[11px] font-bold text-sky-800">
                Contoh: <em>“Sila duduk di kerusi hadapan.”</em>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 3: Peta Minda 4 Jenis Kata Perintah (Page 12) */}
      {pageIndex === 3 && (
        <div className="flex-1 flex flex-col justify-center my-1 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BlueBirdVector size={45} perched={true} />
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900">
              Jenis Kata Perintah
            </h2>
            <BlueBirdVector size={45} flip={true} perched={true} />
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
            {/* Kata Permintaan with Yellow Oval Mascot */}
            <div
              onClick={() => sound.playClick()}
              className="p-3.5 rounded-3xl bg-amber-50 hover:bg-amber-100 border-3 border-amber-400 shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading font-bold text-sm sm:text-base text-amber-900">Kata permintaan</span>
                <div className="flex items-center gap-1">
                  <AudioSpeakerButton textToSpeak="Kata permintaan: tolong, harap, minta." size="sm" />
                  <EmotiveShapeMascot shape="oval" size={42} />
                </div>
              </div>
              <ul className="text-xs sm:text-sm font-bold text-amber-950 space-y-0.5">
                <li>• Tolong</li>
                <li>• Harap</li>
                <li>• Minta</li>
              </ul>
            </div>

            {/* Kata Suruhan with Green Triangle Mascot */}
            <div
              onClick={() => sound.playClick()}
              className="p-3.5 rounded-3xl bg-emerald-50 hover:bg-emerald-100 border-3 border-emerald-400 shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading font-bold text-sm sm:text-base text-emerald-900">Kata suruhan</span>
                <div className="flex items-center gap-1">
                  <AudioSpeakerButton textToSpeak="Kata suruhan menggunakan imbuhan partikel penegas lah." size="sm" />
                  <EmotiveShapeMascot shape="triangle" size={42} />
                </div>
              </div>
              <ul className="text-xs sm:text-sm font-bold text-emerald-950 space-y-0.5">
                <li>• -lah (makanlah)</li>
                <li>• -kan (tutupkan)</li>
                <li>• Tindakan terus</li>
              </ul>
            </div>

            {/* Kata Larangan with Red Circle Mascot */}
            <div
              onClick={() => sound.playClick()}
              className="p-3.5 rounded-3xl bg-rose-50 hover:bg-rose-100 border-3 border-rose-400 shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading font-bold text-sm sm:text-base text-rose-900">Kata larangan</span>
                <div className="flex items-center gap-1">
                  <AudioSpeakerButton textToSpeak="Kata larangan: jangan, usah." size="sm" />
                  <EmotiveShapeMascot shape="circle" size={42} />
                </div>
              </div>
              <ul className="text-xs sm:text-sm font-bold text-rose-950 space-y-0.5">
                <li>• Jangan</li>
                <li>• Usah</li>
              </ul>
            </div>

            {/* Kata Silaan with Blue Square Mascot */}
            <div
              onClick={() => sound.playClick()}
              className="p-3.5 rounded-3xl bg-sky-50 hover:bg-sky-100 border-3 border-sky-400 shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading font-bold text-sm sm:text-base text-sky-900">Kata silaan</span>
                <div className="flex items-center gap-1">
                  <AudioSpeakerButton textToSpeak="Kata silaan: sila, jemput." size="sm" />
                  <EmotiveShapeMascot shape="square" size={42} />
                </div>
              </div>
              <ul className="text-xs sm:text-sm font-bold text-sky-950 space-y-0.5">
                <li>• Sila</li>
                <li>• Jemput</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4: 7 Kata Perintah Disusun Ikut Jenis Kata Perintah (Page 13) */}
      {pageIndex === 4 && (
        <div className="flex-1 flex flex-col justify-center my-2 animate-fade-in">
          <div className="text-center mb-3">
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-[#78350f]">
              7 KATA PERINTAH UTAMA
            </h2>
            <p className="text-xs text-amber-800 font-bold">
              Disusun mengikut 3 Kategori Jenis Kata Perintah
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto w-full">
            {/* Kategori 1: Kata Larangan */}
            <div className="p-3 rounded-2xl bg-rose-50/90 border-2 border-rose-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-rose-200">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-heading font-black text-xs uppercase tracking-wider">
                  🚫 Kategori: Kata Larangan
                </span>
                <span className="text-[11px] text-rose-800 font-semibold">
                  (Menegah atau melarang sesuatu perbuatan)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { num: '01', kata: 'Jangan', desc: 'Menyatakan maksud larangan atau tidak boleh melakukan sesuatu.' },
                  { num: '02', kata: 'Usah', desc: 'Menyatakan maksud larangan atau tegahan daripada melakukan sesuatu (bernada memujuk).' }
                ].map((k) => (
                  <div
                    key={k.kata}
                    onClick={() => sound.playClick()}
                    className="p-2.5 rounded-xl bg-white border border-rose-300 shadow-2xs hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">{k.num}</span>
                      <span className="font-heading font-black text-base text-rose-950">{k.kata}</span>
                      <AudioSpeakerButton textToSpeak={`${k.kata}. ${k.desc}`} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-tight">{k.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Kategori 2: Kata Silaan */}
            <div className="p-3 rounded-2xl bg-sky-50/90 border-2 border-sky-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-sky-200">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white font-heading font-black text-xs uppercase tracking-wider">
                  🌸 Kategori: Kata Silaan
                </span>
                <span className="text-[11px] text-sky-800 font-semibold">
                  (Menjemput atau mempersilakan secara hormat)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { num: '03', kata: 'Sila', desc: 'Meminta seseorang melakukan sesuatu dengan cara hormat dan beradab.' },
                  { num: '04', kata: 'Jemput', desc: 'Menyatakan maksud mengajak atau mengundang ke majlis/makan.' }
                ].map((k) => (
                  <div
                    key={k.kata}
                    onClick={() => sound.playClick()}
                    className="p-2.5 rounded-xl bg-white border border-sky-300 shadow-2xs hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">{k.num}</span>
                      <span className="font-heading font-black text-base text-sky-950">{k.kata}</span>
                      <AudioSpeakerButton textToSpeak={`${k.kata}. ${k.desc}`} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-tight">{k.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Kategori 3: Kata Permintaan */}
            <div className="p-3 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-amber-200">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-heading font-black text-xs uppercase tracking-wider">
                  🤝 Kategori: Kata Permintaan
                </span>
                <span className="text-[11px] text-amber-800 font-semibold">
                  (Memohon bantuan, sokongan atau pertolongan)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { num: '05', kata: 'Tolong', desc: 'Menyatakan maksud meminta pertolongan atau bantuan untuknya.' },
                  { num: '06', kata: 'Minta', desc: 'Menyatakan maksud ingin akan sesuatu atau mengharapkan kerjasama.' },
                  { num: '07', kata: 'Harap', desc: 'Menyatakan maksud keinginan mendapatkan sesuatu atau meminta dilakukan sesuatu.' }
                ].map((k) => (
                  <div
                    key={k.kata}
                    onClick={() => sound.playClick()}
                    className="p-2.5 rounded-xl bg-white border border-amber-300 shadow-2xs hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">{k.num}</span>
                      <span className="font-heading font-black text-base text-amber-950">{k.kata}</span>
                      <AudioSpeakerButton textToSpeak={`${k.kata}. ${k.desc}`} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-tight">{k.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 5: Video Interaktif Cikgu Syafiqah, Cikgu Freshcy & Cikgu Aaron (Page 15) */}
      {pageIndex === 5 && (
        <div className="flex-1 flex flex-col justify-center items-center my-2 animate-fade-in w-full">
          <div className="relative max-w-2xl w-full rounded-3xl bg-slate-900 border-4 border-amber-400 p-4 shadow-2xl text-white">
            {/* Desktop Computer Bezel */}
            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-bold text-slate-300 ml-2">Video PdP Bahasa Melayu Tahun 5</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded text-white font-bold animate-pulse">
                    YOUTUBE RASMI
                  </span>
                </div>
              </div>

              {/* Real YouTube Video Player Embed */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border-2 border-slate-700 mb-4">
                <iframe
                  src="https://www.youtube.com/embed/HHQWxqVhtJE"
                  title="Video Pembelajaran Ayat Perintah - Cikgu Syafiqah, Cikgu Freshcy & Cikgu Aaron"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* 3 Teachers Section: Cikgu Syafiqah, Cikgu Freshcy, Cikgu Aaron */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-heading font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={13} /> Guru Pembimbing Video:
                  </span>
                  <a
                    href="https://youtu.be/HHQWxqVhtJE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline font-semibold"
                  >
                    Buka di YouTube ↗
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* 1. Cikgu Syafiqah */}
                  <div className="p-2.5 rounded-xl bg-slate-700/80 border border-purple-400/50 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400 shadow-md shrink-0 bg-purple-100">
                        <img
                          src="/assets/aistudio/cikgu_syafiqah_avatar_clean.png"
                          alt="Cikgu Syafiqah"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-heading font-black text-purple-300">Cikgu Syafiqah</h4>
                        <span className="text-[10px] text-purple-200 font-bold block">Topik: Ayat Silaan & Permintaan</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-200 leading-snug italic mb-2">
                      “Silaan dan permintaan mencerminkan pekerti mulia. Gunakan perkataan 'sila', 'jemput' dan 'tolong'!”
                    </p>
                    <button
                      onClick={() => {
                        sound.playClick();
                        sound.speakMalay(
                          'Salam sejahtera! Saya Cikgu Syafiqah. Ayat silaan dan permintaan mencerminkan pekerti mulia kita. Gunakan kata sila, jemput dan tolong dengan santun.',
                          'syafiqah'
                        );
                      }}
                      className="w-full py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <Volume2 size={11} />
                      <span>Suara Cikgu Syafiqah</span>
                    </button>
                  </div>

                  {/* 2. Cikgu Freshcy */}
                  <div className="p-2.5 rounded-xl bg-slate-700/80 border border-amber-400/50 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-amber-100">
                        <img
                          src="/assets/aistudio/cikgu_freshcy_avatar_clean.png"
                          alt="Cikgu Freshcy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-heading font-black text-amber-300">Cikgu Freshcy</h4>
                        <span className="text-[10px] text-amber-200 font-bold block">Topik: Ayat Larangan</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-200 leading-snug italic mb-2">
                      “Kata larangan seperti 'jangan' dan 'usah' menegah sesuatu perbuatan yang tidak selamat!”
                    </p>
                    <button
                      onClick={() => {
                        sound.playClick();
                        sound.speakMalay(
                          'Hai murid-murid! Saya Cikgu Freshcy. Kata larangan seperti jangan dan usah bertujuan mencegah kita daripada melakukan perkara berbahaya atau merugikan.',
                          'freshcy'
                        );
                      }}
                      className="w-full py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <Volume2 size={11} />
                      <span>Suara Cikgu Freshcy</span>
                    </button>
                  </div>

                  {/* 3. Cikgu Aaron */}
                  <div className="p-2.5 rounded-xl bg-slate-700/80 border border-sky-400/50 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sky-400 shadow-md shrink-0 bg-sky-100">
                        <img
                          src="/assets/aistudio/cikgu_aaron_avatar_clean.png"
                          alt="Cikgu Aaron"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-heading font-black text-sky-300">Cikgu Aaron</h4>
                        <span className="text-[10px] text-sky-200 font-bold block">Topik: Ayat Suruhan</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-200 leading-snug italic mb-2">
                      “Ayat suruhan bertujuan memberi arahan atau perintah secara langsung tetapi berhemah!”
                    </p>
                    <button
                      onClick={() => {
                        sound.playClick();
                        sound.speakMalay(
                          'Salam semua wira cilik! Saya Cikgu Aaron. Ayat suruhan memberi perintah yang jelas agar sesuatu tindakan dilakukan dengan berkesan dan teratur.',
                          'aaron'
                        );
                      }}
                      className="w-full py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <Volume2 size={11} />
                      <span>Suara Cikgu Aaron</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 6: Video Teater Drama SK Seri Kundang (Jangan Toleh Belakang) */}
      {pageIndex === 6 && (
        <div className="flex-1 flex flex-col justify-center items-center my-1 animate-fade-in w-full">
          <TeaterDramaVideo />
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between w-full pt-2">
        <WoodArrowButton
          direction="prev"
          onClick={handlePrevPage}
          disabled={pageIndex === 0}
        />

        <div className="text-xs font-bold text-amber-900 bg-amber-200/70 px-4 py-1.5 rounded-full">
          Halaman {pageIndex + 1} daripada 7
        </div>

        <WoodArrowButton
          direction="next"
          onClick={handleNextPage}
        />
      </div>
    </div>
  );
};
