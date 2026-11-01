import React, { useState } from 'react';
import { TopNavBar, WoodArrowButton } from './OrganicNav';
import { sound } from '../utils/audio';
import { TeacherId, TEACHER_PROFILES } from './TeacherCharacters';
import { Printer, Eye, Award, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface LembaranKerjaProps {
  onBack: () => void;
  onHome?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  teacherId?: TeacherId;
}

interface WorksheetSection {
  sectionTitle: string;
  instructions?: string;
  items: {
    num: number;
    question: string;
    answer: string;
    blankPrompt?: string;
  }[];
}

interface Worksheet {
  id: number;
  levelKey: 'mudah' | 'sederhana' | 'susah';
  title: string;
  subtitle: string;
  level: string;
  totalMarks: number;
  levelColor: string;
  description: string;
  instructions: string;
  sections: WorksheetSection[];
}

const WORKSHEETS_DATA: Worksheet[] = [
  {
    id: 1,
    levelKey: 'mudah',
    title: 'Lembaran Kerja Tahap Mudah (LK MUDAH)',
    subtitle: 'Bahasa Melayu Tahun 5 • Standard Kandungan 5.3 (Aras Asas)',
    level: 'Tahap Mudah (15 Markah)',
    totalMarks: 15,
    levelColor: 'bg-emerald-100 text-emerald-800 border-emerald-400',
    description: 'Latihan pengukuhan asas mengenali 4 jenis ayat perintah, pengelasan ayat, melengkapkan tempat kosong dan misi menulis ayat perintah ringkas.',
    instructions: 'Baca arahan bagi setiap bahagian dengan teliti. Jawab semua soalan pada ruang yang disediakan.',
    sections: [
      {
        sectionTitle: 'Bahagian 1: Kenali 4 Jenis Ayat Perintah (4 Markah)',
        instructions: 'Nyatakan jenis ayat perintah bagi setiap ayat di bawah (Ayat Suruhan / Ayat Larangan / Ayat Silaan / Ayat Permintaan).',
        items: [
          {
            num: 1,
            question: 'Sila masuk ke dalam dewan peperiksaan sekarang.',
            answer: 'Ayat Silaan'
          },
          {
            num: 2,
            question: 'Jangan petik bunga di taman sains sekolah.',
            answer: 'Ayat Larangan'
          },
          {
            num: 3,
            question: 'Tolong padamkan papan hitam itu selepas tamat waktu pembelajaran.',
            answer: 'Ayat Permintaan'
          },
          {
            num: 4,
            question: 'Kemas meja dan kerusi kamu sebelum pulang ke rumah.',
            answer: 'Ayat Suruhan'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 2: Kelaskan Ayat Perintah (4 Markah)',
        instructions: 'Kelaskan ayat berikut mengikut jenis perintah yang betul.',
        items: [
          {
            num: 5,
            question: '“Jemputlah makan kuih kapit tradisional ini.”',
            answer: 'Ayat Silaan (Kata silaan: Jemputlah)'
          },
          {
            num: 6,
            question: '“Usah dikenang kenangan pahit yang telah berlalu.”',
            answer: 'Ayat Larangan (Kata larangan: Usah)'
          },
          {
            num: 7,
            question: '“Harap semua murid dapat bersabar menunggu giliran.”',
            answer: 'Ayat Permintaan (Kata permintaan: Harap)'
          },
          {
            num: 8,
            question: '“Hantarkan buku latihan tatabahasa ini ke bilik guru sekarang.”',
            answer: 'Ayat Suruhan (Kata suruhan: Hantarkan)'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 3: Lengkapkan Ayat Menggunakan Kata Perintah (4 Markah)',
        instructions: 'Isi tempat kosong menggunakan kata perintah yang betul: [ sila | jangan | tolong | usah ].',
        items: [
          {
            num: 9,
            question: '____________ pijak rumput di hadapan pejabat sekolah.',
            answer: 'Jangan'
          },
          {
            num: 10,
            question: '____________ duduk di kerusi barisan hadapan yang disediakan untuk tetamu.',
            answer: 'Sila'
          },
          {
            num: 11,
            question: '____________ angkat bakul buku cerita ini ke perpustakaan bersama saya.',
            answer: 'Tolong'
          },
          {
            num: 12,
            question: '____________ bimbang, cikgu akan membimbing kamu sehingga berjaya.',
            answer: 'Usah'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 4: Misi Menulis Ayat Perintah Asas (3 Markah)',
        instructions: 'Bina satu ayat perintah yang mudah dan gramatis bagi setiap kata perintah berikut.',
        items: [
          {
            num: 13,
            question: 'Bina satu Ayat Suruhan menggunakan kata kerja berimbuhan "-lah" atau kata dasar:',
            answer: 'Contoh: Bersihkan papan hitam itu sebelum guru masuk ke kelas.'
          },
          {
            num: 14,
            question: 'Bina satu Ayat Larangan menggunakan kata perintah "Jangan":',
            answer: 'Contoh: Jangan berlari di kawasan tangga yang basah.'
          },
          {
            num: 15,
            question: 'Bina satu Ayat Permintaan menggunakan kata perintah "Tolong":',
            answer: 'Contoh: Tolong hulurkan fail biru di atas meja itu.'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    levelKey: 'sederhana',
    title: 'Lembaran Kerja Tahap Sederhana (LK SEDERHANA)',
    subtitle: 'Bahasa Melayu Tahun 5 • Standard Kandungan 5.3 (Aras Sederhana)',
    level: 'Tahap Sederhana (20 Markah)',
    totalMarks: 20,
    levelColor: 'bg-blue-100 text-blue-800 border-blue-400',
    description: 'Latihan pengaplikasian mengenal pasti kata perintah dalam konteks jadual, membina ayat perintah mengikut situasi sekolah, menjelaskan fungsi kata perintah dan kuiz bertulis pemahaman.',
    instructions: 'Jawab semua soalan berikut dengan teliti. Pastikan ejaan dan tanda baca ditulis dengan tepat.',
    sections: [
      {
        sectionTitle: 'Bahagian 1: Kenal Pasti Kata Perintah dalam Konteks Jadual (5 Markah)',
        instructions: 'Tentukan kata perintah dan jenis ayat perintah yang terdapat dalam ayat di bawah.',
        items: [
          {
            num: 1,
            question: 'Ayat: "Minta semua peserta bersiap sedia untuk acara larian 100 meter."\nKata Perintah & Jenis:',
            answer: 'Kata Perintah: "Minta" | Jenis: Ayat Permintaan'
          },
          {
            num: 2,
            question: 'Ayat: "Jemputlah minum air kelapa muda yang segar ini."\nKata Perintah & Jenis:',
            answer: 'Kata Perintah: "Jemputlah" | Jenis: Ayat Silaan'
          },
          {
            num: 3,
            question: 'Ayat: "Usah meratapi kekalahan ini, teruskan usaha untuk perlawanan akan datang."\nKata Perintah & Jenis:',
            answer: 'Kata Perintah: "Usah" | Jenis: Ayat Larangan'
          },
          {
            num: 4,
            question: 'Ayat: "Tolong padamkan suis lampu bilik darjah sebelum keluar."\nKata Perintah & Jenis:',
            answer: 'Kata Perintah: "Tolong" | Jenis: Ayat Permintaan'
          },
          {
            num: 5,
            question: 'Ayat: "Dengarlah nasihat ibu bapa demi masa depan kamu."\nKata Perintah & Jenis:',
            answer: 'Kata Perintah: "Dengarlah" | Jenis: Ayat Suruhan'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 2: Bina Ayat Berdasarkan Situasi (6 Markah)',
        instructions: 'Bina ayat perintah yang gramatis dan sopan berdasarkan situasi yang diberikan.',
        items: [
          {
            num: 6,
            question: 'Situasi: Anda mahu rakan membantu mengutip sisa pembalut makanan di padang sekolah.\nKata Perintah: "Tolong"',
            answer: 'Contoh: Tolong bantu saya mengutip sisa pembalut makanan di padang sekolah ini.'
          },
          {
            num: 7,
            question: 'Situasi: Pengawas menegur sekumpulan murid yang berbuat bising di dalam perpustakaan.\nKata Perintah: "Jangan"',
            answer: 'Contoh: Jangan berbuat bising di dalam perpustakaan sekolah.'
          },
          {
            num: 8,
            question: 'Situasi: Tuan rumah menyambut ketibaan jiran tetangga ke majlis kenduri kesyukuran.\nKata Perintah: "Sila"',
            answer: 'Contoh: Sila masuk dan menjamu selera di ruang santapan yang disediakan.'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 3: Jelaskan Fungsi Kata Perintah (4 Markah)',
        instructions: 'Terangkan perbezaan dan fungsi penggunaan kata perintah berikut dalam komunikasi harian.',
        items: [
          {
            num: 9,
            question: 'Apakah perbezaan tujuan antara penggunaan kata "Jangan" dengan kata "Usah"?',
            answer: 'Kata "Jangan" digunakan untuk menegah sesuatu perbuatan secara terus atau keras, manakala kata "Usah" digunakan untuk menegah secara halus, menasihati atau melegakan perasaan (contoh: usah bersedih).'
          },
          {
            num: 10,
            question: 'Mengapakah kata "Tolong", "Minta" dan "Harap" dikategorikan sebagai kata perintah permintaan?',
            answer: 'Kerana kata-kata ini digunakan untuk memohon pertolongan, bantuan atau menyatakan hasrat dan pengharapan secara sopan kepada orang kedua.'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 4: Kuiz Bertulis Pemahaman Tatabahasa (5 Markah)',
        instructions: 'Jawab soalan kefahaman berikut secara tepat.',
        items: [
          {
            num: 11,
            question: 'Bolehkah dua kata perintah digunakan bersama dalam satu ayat (Contoh: "Tolong jangan buang sampah")? Jelaskan.',
            answer: 'Tidak boleh. Penggunaan dua kata perintah serentak adalah lewah dan tidak gramatis. Sepatutnya gunakan satu sahaja kata perintah: "Jangan buang sampah" ATAU "Tolong buang sampah ke dalam tong sampah".'
          },
          {
            num: 12,
            question: 'Tuliskan satu contoh ayat silaan menggunakan partikel penegas "-lah":',
            answer: 'Contoh: Sila masuklah ke dalam dewan dengan tertib.'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    levelKey: 'susah',
    title: 'Lembaran Kerja Tahap Susah (LK SUSAH)',
    subtitle: 'Bahasa Melayu Tahun 5 • Penilaian Komprehensif PBD (Aras Tinggi & KBAT)',
    level: 'Tahap Susah (25 Markah)',
    totalMarks: 25,
    levelColor: 'bg-purple-100 text-purple-800 border-purple-400',
    description: 'Latihan penguasaan tinggi merangkumi pembaikan ayat mengikut konteks, penulisan dialog pameran kebersihan, penulisan perenggan kempen kelas ceria, semakan kriteria PBD, senarai 4 jenis ayat perintah dan analisis fungsi kesantunan berbahasa.',
    instructions: 'Jawab semua bahagian dengan teliti dan lengkap. Pastikan struktur ayat mematuhi tatabahasa Melayu standard baku.',
    sections: [
      {
        sectionTitle: 'Bahagian 1: Baiki Ayat Mengikut Konteks (4 Markah)',
        instructions: 'Kenal pasti kesalahan kata perintah yang lewah atau salah konteks dalam ayat berikut, kemudian tulis ayat pembetulan yang betul.',
        items: [
          {
            num: 1,
            question: 'Ayat Salah: "Sila tolong jangan bercakap semasa guru sedang mengajar."\nBaiki ayat menjadi gramatis:',
            answer: 'Ayat Betul: "Jangan bercakap semasa guru sedang mengajar." ATAU "Tolong dengar semasa guru sedang mengajar."'
          },
          {
            num: 2,
            question: 'Ayat Salah: "Jemput jangan toleh ke belakang wahai cucuku."\nBaiki ayat menjadi gramatis:',
            answer: 'Ayat Betul: "Jangan toleh ke belakang wahai cucuku."'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 2: Tulis Dialog Pameran Kebersihan & Keselamatan Sekolah (5 Markah)',
        instructions: 'Tulis dialog ringkas antara seorang pengawas dengan murid baharu yang mengandungi sekurang-kurangnya 3 jenis ayat perintah yang berbeza (Silaan, Larangan dan Permintaan).',
        items: [
          {
            num: 3,
            question: 'Ruang Penulisan Dialog:\nPengawas: ...\nMurid Baharu: ...',
            answer: 'Contoh Dialog:\nPengawas: "Sila masuk ke ruang pameran keselamatan ini." (Ayat Silaan)\nMurid: "Terima kasih. Apakah syarat lawatan ini?"\nPengawas: "Jangan sentuh bahan pameran kaca yang mudah pecah." (Ayat Larangan)\nMurid: "Baiklah. Bolehkah saya mendapatkan risalah panduan?"\nPengawas: "Boleh. Tolong isikan nama kamu dalam buku pelawat dahulu." (Ayat Permintaan)'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 3: Penulisan Perenggan: Kempen Kelas Ceria (5 Markah)',
        instructions: 'Tulis satu perenggan ucapan ketua darjah kepada rakan sekelas sempena Kempen Kelas Ceria menggunakan sekurang-kurangnya 3 ayat perintah yang tepat.',
        items: [
          {
            num: 4,
            question: 'Tuliskan perenggan ucapan anda:',
            answer: 'Contoh Ucapan: "Salam sejahtera rakan-rakan. Hari ini kelas kita mengadakan Kempen Kelas Ceria. Pertama sekali, tolong sapu sampah dan susun meja mengikut kumpulan masing-masing. Sila buang sisa plastik ke dalam tong kitar semula. Akhir sekali, jangan biarkan tingkap berhabuk agar kelas kita sentiasa bersih dan selesa."'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 4: Semak Hasil Penulisan & Kriteria PBD (3 Markah)',
        instructions: 'Berdasarkan penulisan ayat perintah anda, semak kriteria berikut dan nyatakan tindakan pembetulan.',
        items: [
          {
            num: 5,
            question: 'Kriteria: (a) Penggunaan huruf besar pada awal ayat; (b) Tanda noktah atau seru pada akhir ayat; (c) Tiada pengulangan kata perintah lewah.\nTuliskan kesimpulan semakan anda:',
            answer: 'Semua ayat perintah dimulakan dengan huruf besar, diakhiri dengan tanda baca yang bersesuaian, dan tidak mengandungi kata perintah ganda.'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 5: Senarai 4 Jenis Ayat Perintah Berserta Contoh (4 Markah)',
        instructions: 'Lengkapkan senarai 4 jenis ayat perintah berserta satu contoh ayat yang gramatis bagi setiap jenis.',
        items: [
          {
            num: 6,
            question: '1. Ayat Suruhan:\n2. Ayat Larangan:\n3. Ayat Silaan:\n4. Ayat Permintaan:',
            answer: '1. Ayat Suruhan: Hantarkan buku latihan tatabahasa ini ke bilik guru.\n2. Ayat Larangan: Usah kamu bersedih atas kegagalan semalam.\n3. Ayat Silaan: Sila daftarkan nama anda di kaunter penyambut tetamu.\n4. Ayat Permintaan: Harap semua murid dapat mematuhi peraturan sekolah.'
          }
        ]
      },
      {
        sectionTitle: 'Bahagian 6: Fungsi Kata Perintah dan Kesantunan Bahasa (4 Markah)',
        instructions: 'Huraikan peranan penggunaan kata ganti nama diri orang kedua dan partikel penegas "-lah" dalam memperhalus ayat perintah.',
        items: [
          {
            num: 7,
            question: 'Jelaskan bagaimana partikel "-lah" mempengaruhi nada ayat perintah:',
            answer: 'Partikel penegas "-lah" melembutkan nada arahan atau suruhan supaya kedengaran lebih santun, beradab dan tidak kasar kepada pendengar (contoh: "masuk" menjadi "masuklah", "jemput" menjadi "jemputlah").'
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
            `Halaman Lembaran Kerja menyediakan tiga tahap latihan ayat perintah: Tahap Mudah, Tahap Sederhana dan Tahap Susah yang sedia dicetak dan dimuat turun sebagai PDF bersama ${TEACHER_PROFILES[teacherId].nama}!`
          )
        }
        title="Lembaran Kerja Mengikut Tahap (Cetak PDF)"
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
                Lembaran Kerja Ayat Perintah Mengikut Tahap
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 font-bold">
                Bahasa Melayu Tahun 5 • 3 Tahap Penguasaan: Mudah, Sederhana & Susah (Format PDF & Cetak A4)
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
              title="Cetak lembaran kerja atau simpan sebagai fail PDF"
            >
              <Printer size={15} />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* 3 Worksheet Selector Tabs (Mudah, Sederhana, Susah) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {WORKSHEETS_DATA.map((sheet) => {
            const isSelected = sheet.id === selectedSheetId;
            return (
              <button
                key={sheet.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedSheetId(sheet.id);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-700 shadow-md scale-102 ring-2 ring-amber-300'
                    : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">
                      {sheet.levelKey === 'mudah' ? '🌱' : sheet.levelKey === 'sederhana' ? '⭐' : '🏆'}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        isSelected ? 'bg-black/30 text-white border-white/40' : sheet.levelColor
                      }`}
                    >
                      {sheet.level}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-sm sm:text-base leading-snug">
                    {sheet.levelKey === 'mudah'
                      ? 'LK 1: Tahap Mudah'
                      : sheet.levelKey === 'sederhana'
                      ? 'LK 2: Tahap Sederhana'
                      : 'LK 3: Tahap Susah'}
                  </h3>
                </div>
                <p className={`text-[11px] mt-1.5 font-semibold line-clamp-2 ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                  {sheet.description}
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
                <span>Nama Murid:</span>
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
                <span>Markah ({activeSheet.totalMarks}M):</span>
                <div className="flex-1 border-b border-dotted border-slate-400 min-h-[18px]" />
              </div>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-xs font-bold text-amber-950 mb-5 flex items-start gap-2">
            <span className="text-base shrink-0">📌</span>
            <div>
              <span className="font-heading font-black">Arahan Umum: </span>
              <span>{activeSheet.instructions}</span>
            </div>
          </div>

          {/* Worksheet Exercises Content */}
          <div className="space-y-6">
            {activeSheet.sections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-3">
                <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <span className="font-heading font-black text-xs sm:text-sm text-slate-900">
                    {sec.sectionTitle}
                  </span>
                  {sec.instructions && (
                    <span className="text-[11px] text-slate-600 font-medium italic">
                      {sec.instructions}
                    </span>
                  )}
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
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300 animate-fade-in whitespace-pre-line">
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
                <span>Tandatangan Guru Pemeriksa: </span>
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
              <span>Cetak / Muat Turun Lembaran Ini</span>
            </button>
          </div>

          <WoodArrowButton
            direction="next"
            onClick={() => {
              if (selectedSheetId < 3) {
                sound.playClick();
                setSelectedSheetId(selectedSheetId + 1);
              } else {
                onBack();
              }
            }}
            label={selectedSheetId === 3 ? 'Selesai' : 'Tahap Seterusnya'}
          />
        </div>
      </div>
    </div>
  );
};
