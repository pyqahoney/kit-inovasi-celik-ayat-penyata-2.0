import React, { useState } from 'react';
import { TopNavBar, WoodArrowButton } from './OrganicNav';
import { sound } from '../utils/audio';
import { TeacherId, TEACHER_PROFILES } from './TeacherCharacters';
import { Printer, FileText, CheckCircle2, Download, Eye, Award, BookOpen, Sparkles } from 'lucide-react';

interface LembaranKerjaProps {
  onBack: () => void;
  onHome?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  teacherId?: TeacherId;
}

interface Worksheet {
  id: number;
  title: string;
  subtitle: string;
  level: string;
  levelColor: string;
  description: string;
  instructions: string;
  sections: {
    sectionTitle: string;
    items: {
      num: number;
      question: string;
      answer: string;
      options?: string[];
      blankPrompt?: string;
    }[];
  }[];
}

const WORKSHEETS_DATA: Worksheet[] = [
  {
    id: 1,
    title: 'Lembaran Kerja 1: Pengelasan 4 Jenis Ayat Perintah',
    subtitle: 'Bahasa Melayu Tahun 5 • Standard Pembelajaran 5.3.2',
    level: 'Aras Asas',
    levelColor: 'bg-emerald-100 text-emerald-800 border-emerald-400',
    description: 'Latihan mengenali dan mengelaskan ayat perintah kepada Ayat Suruhan, Ayat Larangan, Ayat Silaan dan Ayat Permintaan.',
    instructions: 'Baca ayat-ayat di bawah dengan teliti. Tulis jenis ayat perintah yang betul pada ruang jawapan yang disediakan.',
    sections: [
      {
        sectionTitle: 'Bahagian A: Tuliskan jenis ayat perintah (Ayat Suruhan / Ayat Larangan / Ayat Silaan / Ayat Permintaan)',
        items: [
          {
            num: 1,
            question: 'Sila masuk ke dalam dewan peperiksaan sekarang.',
            answer: 'Ayat Silaan'
          },
          {
            num: 2,
            question: 'Jangan petik bunga-bunga di taman sains ini.',
            answer: 'Ayat Larangan'
          },
          {
            num: 3,
            question: 'Tolong padamkan papan hitam itu selepas guru keluar.',
            answer: 'Ayat Permintaan'
          },
          {
            num: 4,
            question: 'Hantarkan buku latihan tatabahasa ini ke bilik guru.',
            answer: 'Ayat Suruhan'
          },
          {
            num: 5,
            question: 'Jemputlah makan kuih-muih tradisional yang terhidang di atas meja.',
            answer: 'Ayat Silaan'
          },
          {
            num: 6,
            question: 'Harap semua murid dapat bersabar menanti giliran masing-masing.',
            answer: 'Ayat Permintaan'
          },
          {
            num: 7,
            question: 'Usah dikenang perkara sedih yang telah berlaku kelmarin.',
            answer: 'Ayat Larangan'
          },
          {
            num: 8,
            question: 'Kemas bilik tidur kamu sebelum pergi ke sekolah.',
            answer: 'Ayat Suruhan'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Lembaran Kerja 2: Pengisian Kata Perintah Tepat',
    subtitle: 'Bahasa Melayu Tahun 5 • Standard Kandungan 5.3',
    level: 'Aras Sederhana',
    levelColor: 'bg-blue-100 text-blue-800 border-blue-400',
    description: 'Latihan melengkapkan ayat perintah menggunakan kata perintah yang betul (Jangan, Usah, Sila, Jemput, Tolong, Minta, Harap).',
    instructions: 'Pilih kata perintah yang paling sesuai daripada kotak pilihan di bawah untuk mengisi tempat kosong.',
    sections: [
      {
        sectionTitle: 'Kotak Pilihan Kata Perintah: [ Jangan | Sila | Tolong | Jemputlah | Harap | Usah | Minta ]',
        items: [
          {
            num: 1,
            question: '____________ duduk di kerusi yang telah disediakan di barisan hadapan.',
            blankPrompt: 'Kata Perintah Silaan',
            answer: 'Sila'
          },
          {
            num: 2,
            question: '____________ berlari di kawasan tangga kerana lantainya licin.',
            blankPrompt: 'Kata Perintah Larangan',
            answer: 'Jangan'
          },
          {
            num: 3,
            question: '____________ cikgu dapat memaafkan kelewatan saya menghantar tugasan semalam.',
            blankPrompt: 'Kata Perintah Permintaan',
            answer: 'Harap'
          },
          {
            num: 4,
            question: '____________ angkat kotak buku teks ini bersama-sama dengan saya ke perpustakaan.',
            blankPrompt: 'Kata Perintah Permintaan',
            answer: 'Tolong'
          },
          {
            num: 5,
            question: '____________ rasa rendah diri walaupun kita belum beroleh kejayaan hari ini.',
            blankPrompt: 'Kata Perintah Larangan',
            answer: 'Usah'
          },
          {
            num: 6,
            question: '____________ rasa masakan rendang daging emak saya yang sungguh enak ini.',
            blankPrompt: 'Kata Perintah Silaan',
            answer: 'Jemputlah'
          },
          {
            num: 7,
            question: '____________ semua murid beratur dengan tertib semasa membeli makanan di kantin.',
            blankPrompt: 'Kata Perintah Permintaan',
            answer: 'Minta'
          },
          {
            num: 8,
            question: '____________ buang sisa plastik ke dalam tong kitar semula berwarna jingga.',
            blankPrompt: 'Kata Perintah Suruhan / Silaan',
            answer: 'Sila / Tolong'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Lembaran Kerja 3: Membina Ayat Perintah Mengikut Konteks',
    subtitle: 'Bahasa Melayu Tahun 5 • Kemahiran Membina Ayat',
    level: 'Aras Aplikasi',
    levelColor: 'bg-amber-100 text-amber-800 border-amber-400',
    description: 'Latihan membina ayat perintah yang lengkap dan gramatis berdasarkan situasi dan kata perintah yang diberikan.',
    instructions: 'Bina satu ayat perintah yang gramatis berdasarkan situasi dan kata perintah yang ditetapkan.',
    sections: [
      {
        sectionTitle: 'Bina Ayat Perintah Lengkap Mengikut Situasi:',
        items: [
          {
            num: 1,
            question: 'Situasi: Anda mahu rakan sekelas membantu anda mengutip sampah yang bersepah di belakang kelas.\nKata Perintah: "Tolong"',
            answer: 'Contoh: Tolong bantu saya mengutip sampah yang bersepah di belakang kelas itu.'
          },
          {
            num: 2,
            question: 'Situasi: Pengawas menegur murid yang berbuat bising ketika berada di dalam perpustakaan sekolah.\nKata Perintah: "Jangan"',
            answer: 'Contoh: Jangan bising ketika berada di dalam perpustakaan sekolah.'
          },
          {
            num: 3,
            question: 'Situasi: Tuan rumah menjemput tetamu yang baharu sampai masuk ke ruang tamu rumahnya.\nKata Perintah: "Sila"',
            answer: 'Contoh: Sila masuk ke ruang tamu sementara saya menyediakan minuman.'
          },
          {
            num: 4,
            question: 'Situasi: Guru menasihati murid agar tidak bersedih kerana gagal dalam pertandingan bercerita.\nKata Perintah: "Usah"',
            answer: 'Contoh: Usah bersedih atas kekalahan ini, teruskan berusaha pada masa akan datang.'
          },
          {
            num: 5,
            question: 'Situasi: Ketua darjah meminta semua murid berdiri dan memberi hormat semasa guru masuk ke kelas.\nKata Perintah: "Minta"',
            answer: 'Contoh: Minta semua rakan berdiri dan memberikan salam kepada Cikgu Aina.'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Lembaran Kerja 4: Penilaian Formatif Pentaksiran Bilik Darjah (PBD)',
    subtitle: 'Bahasa Melayu Tahun 5 • Standard Prestasi TP1 - TP6',
    level: 'Penilaian PBD',
    levelColor: 'bg-purple-100 text-purple-800 border-purple-400',
    description: 'Instrumen penilaian formatif PBD untuk mengukur tahap penguasaan murid dalam memahami, membina dan membetulkan ayat perintah.',
    instructions: 'Jawab semua soalan penilaian formatif ini. Pastikan tatabahasa, tanda baca dan ejaan ditulis dengan tepat.',
    sections: [
      {
        sectionTitle: 'Bahagian 1: Betulkan kesalahan penggunaan kata perintah dalam ayat berikut',
        items: [
          {
            num: 1,
            question: 'Ayat Salah: "Tolong jangan buang sampah di sini!"\nBetulkan ayat agar tidak menggunakan dua kata perintah serentak:',
            answer: 'Ayat Betul: "Jangan buang sampah di sini!" ATAU "Tolong buang sampah ke dalam tong sampah."'
          },
          {
            num: 2,
            question: 'Ayat Salah: "Jemput jangan bising semasa peperiksaan berlangsung."\nBetulkan ayat:',
            answer: 'Ayat Betul: "Jangan bising semasa peperiksaan berlangsung."'
          },
          {
            num: 3,
            question: 'Ayat Salah: "Sila tolong angkat meja guru ini."\nBetulkan ayat:',
            answer: 'Ayat Betul: "Sila angkat meja guru ini." ATAU "Tolong angkat meja guru ini."'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 2: Padankan kata perintah dengan tujuan penggunaannya yang tepat',
        items: [
          {
            num: 4,
            question: 'Kata "Tolong", "Minta" dan "Harap" digunakan untuk:',
            answer: 'Memohon pertolongan, keizinan atau hasrat secara sopan (Ayat Permintaan).'
          },
          {
            num: 5,
            question: 'Kata "Jangan" dan "Usah" digunakan untuk:',
            answer: 'Menegah atau melarang seseorang daripada melakukan sesuatu perbuatan (Ayat Larangan).'
          },
          {
            num: 6,
            question: 'Kata "Sila" dan "Jemput" digunakan untuk:',
            answer: 'Menjemput, mempersilakan atau mengalu-alukan tetamu (Ayat Silaan).'
          }
        ]
      }
    ]
  }
];

export const LembaranKerja: React.FC<LembaranKerjaProps> = ({
  onBack,
  onHome,
  soundEnabled,
  onToggleSound,
  teacherId = 'syafiqah'
}) => {
  const [selectedSheetId, setSelectedSheetId] = useState<number>(1);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);

  const activeSheet = WORKSHEETS_DATA.find((s) => s.id === selectedSheetId) || WORKSHEETS_DATA[0];

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full mx-auto select-none animate-fade-in pb-4">
      {/* Top Bar Navigation */}
      <TopNavBar
        onHome={onHome || onBack}
        onExit={onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onHelp={() =>
          sound.speakMalay(
            `Halaman Lembaran Kerja menyediakan empat jenis latihan formatif ayat perintah yang boleh dicetak dan dimuat turun sebagai PDF bersama ${TEACHER_PROFILES[teacherId].nama}!`
          )
        }
        title="Lembaran Kerja (Cetak PDF)"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col my-2 max-w-5xl w-full mx-auto px-2">
        {/* Header Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl border-3 border-amber-600 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl shadow">
              📄
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-black text-white drop-shadow">
                Halaman Lembaran Kerja Ayat Perintah
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 font-bold">
                Tahun 5 • 4 Jenis Lembaran Kerja Siap Cetak (A4 PDF) Untuk Guru & Murid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setShowAnswerKey(!showAnswerKey);
              }}
              className={`px-3.5 py-2 rounded-xl font-heading font-black text-xs transition-all flex items-center gap-1.5 shadow cursor-pointer ${
                showAnswerKey
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-white'
                  : 'bg-white text-amber-950 hover:bg-amber-100'
              }`}
            >
              <Eye size={15} />
              <span>{showAnswerKey ? 'Sembunyi Skema' : 'Papar Skema Jawapan'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-yellow-300 font-heading font-black text-xs transition-all flex items-center gap-1.5 shadow-lg border border-yellow-400 active:scale-95 cursor-pointer"
              title="Cetak lembaran kerja atau simpan sebagai PDF"
            >
              <Printer size={15} />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* 4 Worksheet Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          {WORKSHEETS_DATA.map((sheet) => {
            const isSelected = sheet.id === selectedSheetId;
            return (
              <button
                key={sheet.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedSheetId(sheet.id);
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-700 shadow-md scale-102 ring-2 ring-amber-300'
                    : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-black">
                      {sheet.id === 1 ? '📝' : sheet.id === 2 ? '✏️' : sheet.id === 3 ? '🎨' : '🏆'}
                    </span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                        isSelected ? 'bg-black/30 text-white border-white/40' : sheet.levelColor
                      }`}
                    >
                      {sheet.level}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-xs sm:text-sm leading-snug">
                    Lembaran {sheet.id}
                  </h3>
                </div>
                <p className={`text-[10px] mt-1 font-semibold line-clamp-2 ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                  {sheet.title.replace(`Lembaran Kerja ${sheet.id}: `, '')}
                </p>
              </button>
            );
          })}
        </div>

        {/* Printable Worksheet Canvas (Formatted as real A4 school paper) */}
        <div className="printable-worksheet bg-white rounded-3xl border-3 border-amber-300 shadow-2xl p-6 sm:p-8 text-slate-900">
          {/* Official School Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block">
                  KEMENTERIAN PENDIDIKAN MALAYSIA • DSKP BAHASA MELAYU TAHUN 5
                </span>
                <h2 className="text-lg sm:text-xl font-heading font-black text-slate-900 mt-0.5">
                  {activeSheet.title}
                </h2>
                <span className="text-xs text-slate-600 font-bold block">
                  {activeSheet.subtitle}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${activeSheet.levelColor}`}>
                  {activeSheet.level}
                </span>
              </div>
            </div>

            {/* Student Info Lines for Writing */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1">
                <span>Nama:</span>
                <div className="flex-1 border-b border-dotted border-slate-400 min-h-[18px]" />
              </div>
              <div className="flex items-center gap-1">
                <span>Kelas:</span>
                <div className="flex-1 border-b border-dotted border-slate-400 min-h-[18px]" />
              </div>
              <div className="flex items-center gap-1">
                <span>Tarikh:</span>
                <div className="flex-1 border-b border-dotted border-slate-400 min-h-[18px]" />
              </div>
              <div className="flex items-center gap-1">
                <span>Markah / TP:</span>
                <div className="flex-1 border-b border-dotted border-slate-400 min-h-[18px]" />
              </div>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-xs font-bold text-amber-950 mb-5 flex items-start gap-2">
            <span className="text-base shrink-0">📌</span>
            <div>
              <span className="font-heading font-black">Arahan: </span>
              <span>{activeSheet.instructions}</span>
            </div>
          </div>

          {/* Worksheet Exercises Content */}
          <div className="space-y-6">
            {activeSheet.sections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-3">
                <div className="font-heading font-black text-xs sm:text-sm text-slate-900 p-2 bg-slate-100 rounded-xl border border-slate-300">
                  {sec.sectionTitle}
                </div>

                <div className="space-y-3 pl-1 sm:pl-2">
                  {sec.items.map((item) => (
                    <div
                      key={item.num}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm flex flex-col gap-2"
                    >
                      <div className="flex items-start gap-2 font-medium text-slate-900 leading-relaxed">
                        <span className="font-black text-amber-800 shrink-0">{item.num}.</span>
                        <div className="flex-1 whitespace-pre-line font-bold">
                          {item.question}
                        </div>
                      </div>

                      {/* Blank answer line for student to write on physical printout */}
                      <div className="mt-1 pt-1 flex items-center gap-2">
                        <span className="text-xs font-heading font-bold text-slate-500 shrink-0">Jawapan:</span>
                        <div className="flex-1 border-b-2 border-slate-400 min-h-[22px] flex items-center px-2">
                          {showAnswerKey && (
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 animate-fade-in">
                              ✓ {item.answer}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Signature & Rubric Footer */}
          <div className="mt-8 pt-4 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">Tahap Penguasaan (TP):</span>
              <div className="flex gap-1 font-black">
                {['TP1', 'TP2', 'TP3', 'TP4', 'TP5', 'TP6'].map((tp) => (
                  <span key={tp} className="w-8 h-6 border border-slate-400 rounded flex items-center justify-center text-[10px]">
                    {tp}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span>Tandatangan Guru: </span>
                <span className="inline-block w-28 border-b border-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between w-full pt-4 z-10">
          <WoodArrowButton direction="prev" onClick={onBack} label="Kembali" />

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-sm shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer size={16} />
              <span>Cetak Lembaran Ini</span>
            </button>
          </div>

          <WoodArrowButton
            direction="next"
            onClick={() => {
              if (selectedSheetId < 4) {
                sound.playClick();
                setSelectedSheetId(selectedSheetId + 1);
              } else {
                onBack();
              }
            }}
            label={selectedSheetId === 4 ? 'Selesai' : 'Lembaran Seterusnya'}
          />
        </div>
      </div>
    </div>
  );
};
