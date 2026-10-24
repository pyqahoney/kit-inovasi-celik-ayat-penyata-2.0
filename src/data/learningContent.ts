import { AyatPerintahDetail, QuizQuestion, GameMission, ARCard, StudentPBSRecord, TrialogicalArtifact } from '../types';

export const AYAT_PERINTAH_DATA: Record<string, AyatPerintahDetail> = {
  suruhan: {
    id: 'suruhan',
    title: 'Ayat Suruhan',
    badgeTitle: 'Jaguh Ayat Suruhan',
    kataKunci: ['(Tanpa kata perintah khusus)', 'lah', 'kan'],
    maksud: 'Ayat yang diucapkan dengan tujuan memberi perintah atau arahan kepada seseorang supaya melakukan sesuatu tindakan.',
    ciriKhas: 'Boleh menggunakan partikel penegas "-lah" (contoh: "Makanlah", "Dengarlah") untuk melembutkan suruhan agar tidak berbunyi kasar.',
    contohAyat: [
      {
        ayat: 'Buka buku teks Bahasa Melayu muka surat 25 sekarang.',
        situasi: 'Di dalam bilik darjah semasa guru memulakan pengajaran.',
        kataTerlibat: 'Buka',
        huraian: 'Arahan jelas daripada guru kepada murid untuk bertindak serta-merta.',
        audioText: 'Buka buku teks Bahasa Melayu muka surat dua puluh lima sekarang.'
      },
      {
        ayat: 'Kemaslah beg sekolah kamu sebelum masuk tidur.',
        situasi: 'Di rumah sebelum waktu tidur malam.',
        kataTerlibat: 'Kemaslah',
        huraian: 'Suruhan mesra ibu bapa yang dilembutkan dengan imbuhan partikel -lah.',
        audioText: 'Kemaslah beg sekolah kamu sebelum masuk tidur.'
      },
      {
        ayat: 'Padamkan suis lampu bilik tidur apabila selesai belajar.',
        situasi: 'Amalan penjimatan tenaga di rumah.',
        kataTerlibat: 'Padamkan',
        huraian: 'Arahan melakukan tindakan mematikan elektrik.',
        audioText: 'Padamkan suis lampu bilik tidur apabila selesai belajar.'
      }
    ],
    peringatanSopan: 'Gunakan intonasi yang terkawal dan tambahkan partikel "-lah" supaya arahan anda diterima dengan lapang dada!',
    warnaTema: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-800',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      accent: 'emerald'
    },
    ikon: '🎯'
  },
  larangan: {
    id: 'larangan',
    title: 'Ayat Larangan',
    badgeTitle: 'Juara Ayat Larangan',
    kataKunci: ['Jangan', 'Usah'],
    maksud: 'Ayat yang menggunakan kata larangan seperti "jangan" dan "usah" bertujuan menegah atau menghalang seseorang daripada melakukan sesuatu perbuatan.',
    ciriKhas: 'Kata "Jangan" digunakan untuk larangan umum/mutlak. Kata "Usah" lazimnya digunakan untuk memujuk atau menasihati agar tidak risau/sedih.',
    contohAyat: [
      {
        ayat: 'Jangan berlari di laluan tangga yang licin itu.',
        situasi: 'Di koridor sekolah untuk mengelakkan kecederaan.',
        kataTerlibat: 'Jangan',
        huraian: 'Larangan mutlak demi keselamatan warga sekolah.',
        audioText: 'Jangan berlari di laluan tangga yang licin itu.'
      },
      {
        ayat: 'Usah dikenang perkara yang telah berlalu, teruskan bersemangat.',
        situasi: 'Di padang sekolah semasa memujuk kawan yang tewas dalam perlumbaan.',
        kataTerlibat: 'Usah',
        huraian: 'Kata larangan yang bernada lembut memujuk.',
        audioText: 'Usah dikenang perkara yang telah berlalu, teruskan bersemangat.'
      },
      {
        ayat: 'Jangan buang sampah di dalam longkang sekolah.',
        situasi: 'Di persekitaran kantin sekolah.',
        kataTerlibat: 'Jangan',
        huraian: 'Larangan menjaga kebersihan dan mencegah banjir kilat.',
        audioText: 'Jangan buang sampah di dalam longkang sekolah.'
      }
    ],
    peringatanSopan: 'Jangan gabungkan kata larangan berganda seperti "Usah jangan menangis" kerana salah dari segi tatabahasa baku!',
    warnaTema: {
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-800',
      button: 'bg-rose-600 hover:bg-rose-700',
      accent: 'rose'
    },
    ikon: '🛑'
  },
  silaan: {
    id: 'silaan',
    title: 'Ayat Silaan',
    badgeTitle: 'Pakar Ayat Silaan',
    kataKunci: ['Sila', 'Jemput'],
    maksud: 'Ayat yang menggunakan kata silaan seperti "sila" atau "jemput" dengan tujuan menjemput, mengalu-alukan atau mempersilakan seseorang dengan tertib dan beradab.',
    ciriKhas: 'Lazimnya diucapkan oleh tuan rumah, penganjur majlis atau penyambut tetamu. Boleh dilembutkan dengan imbuhan "-lah" (contoh: Silakan, Jemputlah).',
    contohAyat: [
      {
        ayat: 'Sila masuk dan duduk di ruang tamu.',
        situasi: 'Di pintu hadapan rumah ketika menyambut tetamu hadir.',
        kataTerlibat: 'Sila',
        huraian: 'Mempersilakan tetamu dengan santun dan beradab.',
        audioText: 'Sila masuk dan duduk di ruang tamu.'
      },
      {
        ayat: 'Jemputlah makan kuih karipap yang masih panas ini.',
        situasi: 'Di meja makan semasa jamuan Hari Raya atau kenduri.',
        kataTerlibat: 'Jemputlah',
        huraian: 'Mengajak tetamu menikmati hidangan makanan dengan mesra.',
        audioText: 'Jemputlah makan kuih karipap yang masih panas ini.'
      },
      {
        ayat: 'Sila catatkan nama anda di dalam buku pelawat perpustakaan.',
        situasi: 'Di kaunter utama perpustakaan sekolah.',
        kataTerlibat: 'Sila',
        huraian: 'Arahan beradab untuk mematuhi prosedur rasmi perpustakaan.',
        audioText: 'Sila catatkan nama anda di dalam buku pelawat perpustakaan.'
      }
    ],
    peringatanSopan: 'Jangan gunakan "Sila jemput makan" serentak. Pilih sama ada "Sila makan" atau "Jemput makan"!',
    warnaTema: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-800',
      button: 'bg-amber-600 hover:bg-amber-700',
      accent: 'amber'
    },
    ikon: '🤝'
  },
  permintaan: {
    id: 'permintaan',
    title: 'Ayat Permintaan',
    badgeTitle: 'Duta Kesopanan Permintaan',
    kataKunci: ['Tolong', 'Minta', 'Harap'],
    maksud: 'Ayat yang menggunakan kata permintaan seperti "tolong", "minta" atau "harap" untuk memohon bantuan atau menyatakan harapan dengan nada yang sangat sopan.',
    ciriKhas: '"Tolong" merujuk permohonan pertolongan fizikal/tindakan. "Minta" merujuk permintaan rasmi/perhatian. "Harap" menyatakan pengharapan yang tinggi.',
    contohAyat: [
      {
        ayat: 'Tolong hulurkan buku nota sains itu kepada saya.',
        situasi: 'Di bilik makmal sains ketika melakukan eksperimen berkumpulan.',
        kataTerlibat: 'Tolong',
        huraian: 'Memohon bantuan rakan sekelas dengan nada merendah diri.',
        audioText: 'Tolong hulurkan buku nota sains itu kepada saya.'
      },
      {
        ayat: 'Minta semua murid beratur dengan senyap sebelum masuk ke dewan.',
        situasi: 'Di tapak perhimpunan sekolah semasa loceng berbunyi.',
        kataTerlibat: 'Minta',
        huraian: 'Permohonan daripada ketua pengawas agar keadaan terkawal.',
        audioText: 'Minta semua murid beratur dengan senyap sebelum masuk ke dewan.'
      },
      {
        ayat: 'Harap kamu dapat hadir ke majlis sambutan hari lahir saya.',
        situasi: 'Memberikan kad jemputan keraian kepada sahabat karib.',
        kataTerlibat: 'Harap',
        huraian: 'Menyatakan pengharapan yang tulus murni.',
        audioText: 'Harap kamu dapat hadir ke majlis sambutan hari lahir saya.'
      }
    ],
    peringatanSopan: 'Elakkan menggabungkan "Minta tolong harap" serentak. Gunakan satu kata permintaan yang paling tepat!',
    warnaTema: {
      bg: 'bg-sky-50',
      border: 'border-sky-300',
      text: 'text-sky-800',
      button: 'bg-sky-600 hover:bg-sky-700',
      accent: 'sky'
    },
    ikon: '🙏'
  }
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    kategori: 'larangan',
    soalan: 'Ayat manakah yang tergolong dalam "Ayat Larangan"?',
    pilihan: [
      'Sila ambil makanan di atas meja.',
      'Jangan petik bunga di taman botani itu.',
      'Tolong sapu daun-daun kering di halaman.',
      'Tutup pintu bilik itu perlahan-lahan.'
    ],
    jawapanBetul: 1,
    penerangan: 'Ayat "Jangan petik bunga..." menggunakan kata larangan "Jangan" yang menegah perbuatan merosakkan tanaman.',
    situasiGrafik: {
      tajuk: 'Taman Sains Sekolah',
      pembayang: 'Papan tanda merah melarang memetik pokok hiasan.',
      ikon: '🌸'
    },
    tahapPenguasaanTarget: 2
  },
  {
    id: 2,
    kategori: 'silaan',
    soalan: '"________ rasa kuih seri muka yang dibuat oleh nenek saya." Kata perintah yang paling sopan ialah:',
    pilihan: ['Usah', 'Jemputlah', 'Jangan', 'Tolong'],
    jawapanBetul: 1,
    penerangan: 'Kata silaan "Jemputlah" sangat sesuai dan beradab untuk mengajak seseorang menikmati juadah makanan.',
    situasiGrafik: {
      tajuk: 'Meja Minum Petang',
      pembayang: 'Nenek menghidangkan kuih tradisional kepada tetamu.',
      ikon: '☕'
    },
    tahapPenguasaanTarget: 3
  },
  {
    id: 3,
    kategori: 'permintaan',
    soalan: 'Cikgu Syafiqah meminta murid-murid tidak bising di perpustakaan. Apakah ayat permintaan rasmi yang tepat?',
    pilihan: [
      'Minta semua murid bertenang dan jangan berbisik.',
      'Sila lari ke luar perpustakaan sekarang.',
      'Kemas beg kamu sekarang juga!',
      'Usah membaca buku cerita itu.'
    ],
    jawapanBetul: 0,
    penerangan: '"Minta semua murid bertenang..." merupakan ayat permintaan yang santun untuk mengawal disiplin bilik bacaan.',
    situasiGrafik: {
      tajuk: 'Perpustakaan Desa',
      pembayang: 'Suasana hening memerlukan perhatian murid tanpa bunyi bising.',
      ikon: '📚'
    },
    tahapPenguasaanTarget: 4
  },
  {
    id: 4,
    kategori: 'suruhan',
    soalan: 'Apakah fungsi partikel "-lah" dalam ayat suruhan seperti "Dengarlah nasihat ibu bapamu"?',
    pilihan: [
      'Menjadikan ayat berbau kemarahan',
      'Melembutkan nada suruhan supaya lebih beradab dan mesra',
      'Menukar ayat suruhan menjadi soalan',
      'Membatalkan arahan yang telah diberikan'
    ],
    jawapanBetul: 1,
    penerangan: 'Partikel penegas "-lah" berfungsi melembutkan intonasi suruhan agar pendengar berasa selesa dan dihormati.',
    situasiGrafik: {
      tajuk: 'Nasihat Kasih Sayang',
      pembayang: 'Perbualan mesra antara anak dan ibu bapa di ruang santai.',
      ikon: '❤️'
    },
    tahapPenguasaanTarget: 4
  },
  {
    id: 5,
    kategori: 'campuran',
    soalan: 'Padankan situasi ini: Ali melihat seorang adik kecil hendak menyentuh kuali panas. Ayat apakah yang paling segera dan tepat?',
    pilihan: [
      'Sila sentuh kuali itu adik.',
      'Jangan sentuh kuali panas itu, bahaya!',
      'Harap kuali itu panas selalu.',
      'Jemput kuali itu ke meja makan.'
    ],
    jawapanBetul: 1,
    penerangan: 'Ayat larangan tegas "Jangan sentuh..." wajib digunakan untuk situasi kecemasan yang boleh mendatangkan bahaya fizikal.',
    situasiGrafik: {
      tajuk: 'Kecemasan Dapur',
      pembayang: 'Kuali memasak sedang panas di atas dapur gas.',
      ikon: '🔥'
    },
    tahapPenguasaanTarget: 5
  },
  {
    id: 6,
    kategori: 'campuran',
    soalan: 'Antara berikut, ayat manakah yang mengandungi KESALAHAN tatabahasa kata perintah berganda?',
    pilihan: [
      'Tolong angkat bakul kain ini ke jemuran.',
      'Usah jangan bimbang tentang ujian esok.',
      'Sila isi borang pendaftaran di kaunter.',
      'Buka kasut sebelum memijak permaidani.'
    ],
    jawapanBetul: 1,
    penerangan: '"Usah jangan bimbang" salah kerana menggabungkan dua kata larangan serentak. Ayat yang betul ialah "Usah bimbang" atau "Jangan bimbang".',
    situasiGrafik: {
      tajuk: 'Ujian Tatabahasa Kritis',
      pembayang: 'Mengenal pasti hukum tatabahasa Bahasa Melayu baku.',
      ikon: '🔍'
    },
    tahapPenguasaanTarget: 6
  }
];

export const GAME_MISSIONS: GameMission[] = [
  {
    id: 'misi-1',
    tahap: 1,
    tajuk: 'Misi 1: Di Dapur Bonda Terchenta',
    keterangan: 'Bantu Bonda memasak rendang dan hidangan kenduri dengan menggunakan ayat suruhan dan permintaan yang sopan!',
    ikon: '🍲',
    warna: 'from-amber-400 to-orange-500',
    ganjaranSyiling: 50,
    ganjaranLencana: 'Jaguh Ayat Suruhan & Permintaan',
    stages: [
      {
        step: 1,
        tajuk: 'Mencuci Sayur-sayuran',
        latarTempat: 'Singki Dapur Rumah',
        kisah: 'Bonda sedang mengacau gulai di atas dapur. Bonda perlukan bantuan kamu untuk membersihkan sayur sawi di singki.',
        watak: 'Bonda Aminah',
        watakEmosi: 'ceria',
        soalanCabaran: 'Bonda mahu meminta bantuan kamu dengan penuh kasih sayang. Ayat manakah yang patut diucapkan?',
        pilihan: [
          {
            teks: 'Tolong cuci sayur sawi ini hingga bersih ya, anakku.',
            jenisAyat: 'permintaan',
            betul: true,
            maklumBalas: 'Tepat sekali! Menggunakan kata permintaan "Tolong" yang lemah lembut membuatkan anak gembira membantu.'
          },
          {
            teks: 'Jangan cuci sayur itu nanti basah.',
            jenisAyat: 'larangan',
            betul: false,
            maklumBalas: 'Kurang tepat! Ini adalah ayat larangan, sedangkan Bonda perlukan pertolongan kamu.'
          },
          {
            teks: 'Sila makan sayur sawi yang belum dimasak ini.',
            jenisAyat: 'silaan',
            betul: false,
            maklumBalas: 'Sayur belum dicuci dan dimasak, tidak sesuai dipersilakan makan lagi!'
          }
        ]
      },
      {
        step: 2,
        tajuk: 'Menghidang di Meja Makan',
        latarTempat: 'Ruang Makan',
        kisah: 'Lauk pauk telah siap terhidang di atas meja. Tetamu jiran tetangga sudah tiba di muka pintu.',
        watak: 'Bonda Aminah',
        watakEmosi: 'bangga',
        soalanCabaran: 'Apakah ayat yang sesuai untuk mengalu-alukan jiran makan bersama?',
        pilihan: [
          {
            teks: 'Usah datang ke rumah saya petang ini.',
            jenisAyat: 'larangan',
            betul: false,
            maklumBalas: 'Tidak sopan! Ayat larangan ini akan menyinggung perasaan jiran.'
          },
          {
            teks: 'Jemputlah duduk dan nikmati hidangan kuih-muih ini.',
            jenisAyat: 'silaan',
            betul: true,
            maklumBalas: 'Hebat! Kata silaan "Jemputlah" menunjukkan pekerti mulia tuan rumah yang ramah.'
          },
          {
            teks: 'Basuh pinggan mangkuk kamu sekarang juga.',
            jenisAyat: 'suruhan',
            betul: false,
            maklumBalas: 'Ini ayat suruhan yang kasar kepada tetamu yang baru tiba.'
          }
        ]
      }
    ]
  },
  {
    id: 'misi-2',
    tahap: 2,
    tajuk: 'Misi 2: Pengawas Disiplin Sekolah',
    keterangan: 'Bertindak sebagai Kapten Disiplin Cilik di Makmal Komputer dan Kawasan Tangga Sekolah!',
    ikon: '🏫',
    warna: 'from-blue-400 to-indigo-600',
    ganjaranSyiling: 75,
    ganjaranLencana: 'Juara Ayat Larangan & Silaan',
    stages: [
      {
        step: 1,
        tajuk: 'Keselamatan di Tangga Blok Mawar',
        latarTempat: 'Tangga Blok Mawar Sekolah',
        kisah: 'Loceng rehat baru sahaja berbunyi. Beberapa murid Tahun Tiga mula berlari menuruni tangga yang baru dimop.',
        watak: 'Cikgu Syafiqah (Guru Disiplin)',
        watakEmosi: 'tegas',
        soalanCabaran: 'Sebagai pengawas, apakah ayat perintah segera untuk menyelamatkan mereka daripada tergelincir?',
        pilihan: [
          {
            teks: 'Jangan berlari di tangga, sila jalan berhati-hati!',
            jenisAyat: 'larangan',
            betul: true,
            maklumBalas: 'Cemerlang! Ayat larangan tegas "Jangan berlari" mengelakkan kemalangan berbahaya serta-merta.'
          },
          {
            teks: 'Harap kamu boleh terjatuh di tangga ini.',
            jenisAyat: 'permintaan',
            betul: false,
            maklumBalas: 'Ini ayat doa yang tidak baik!'
          },
          {
            teks: 'Makanlah makanan di atas tangga sekarang.',
            jenisAyat: 'suruhan',
            betul: false,
            maklumBalas: 'Tangga bukan tempat makan dan boleh mengganggu laluan murid lain.'
          }
        ]
      },
      {
        step: 2,
        tajuk: 'Peraturan Makmal Komputer Pintar',
        latarTempat: 'Pintu Masuk Makmal Komputer',
        kisah: 'Murid-murid hendak masuk ke makmal komputer. Mereka perlu membuka kasut dan mendaftar nama di buku kehadiran.',
        watak: 'Haris (Ketua Kelas)',
        watakEmosi: 'ceria',
        soalanCabaran: 'Haris hendak mengingatkan rakan sekelas dengan tertib di pintu makmal:',
        pilihan: [
          {
            teks: 'Sila susun kasut di rak kasut sebelum melangkah masuk.',
            jenisAyat: 'silaan',
            betul: true,
            maklumBalas: 'Syabas! Kata silaan "Sila" memberi panduan mesra dan memupuk budaya kemas.'
          },
          {
            teks: 'Usah masuk ke makmal ini selamanya.',
            jenisAyat: 'larangan',
            betul: false,
            maklumBalas: 'Ayat ini melarang murid menuntut ilmu sains dan komputer.'
          },
          {
            teks: 'Buang semua kasut ke dalam tong sampah.',
            jenisAyat: 'suruhan',
            betul: false,
            maklumBalas: 'Arahan yang merosakkan harta benda murid!'
          }
        ]
      }
    ]
  },
  {
    id: 'misi-3',
    tahap: 3,
    tajuk: 'Misi 3: Penyelamat Festival Rimba Harmoni',
    keterangan: 'Tahap Pakar! Selesaikan konflik haiwan rimba dengan membina ayat perintah bertaraf TP6 yang adil & berhikmah!',
    ikon: '🦁',
    warna: 'from-emerald-500 to-teal-700',
    ganjaranSyiling: 120,
    ganjaranLencana: 'Pakar Agung Trialogikal & Bahasa',
    stages: [
      {
        step: 1,
        tajuk: 'Kekecohan di Telaga Madu',
        latarTempat: 'Taman Rimba Harmoni',
        kisah: 'Sang Badak dan Sang Belang sedang berebut giliran meminum air di Telaga Madu kerana hari sangat panas.',
        watak: 'Sang Kancil Bijaksana',
        watakEmosi: 'bimbang',
        soalanCabaran: 'Bagaimanakah Sang Kancil mententeramkan keadaan menggunakan ayat permintaan yang berhikmah?',
        pilihan: [
          {
            teks: 'Minta sahabat semua bertenang dan beratur mengikut giliran.',
            jenisAyat: 'permintaan',
            betul: true,
            maklumBalas: 'Bijaksana! "Minta semua sahabat bertenang..." meredakan kemarahan dan mewujudkan ketertiban.'
          },
          {
            teks: 'Jangan minum air di sini, biarkan telaga kering.',
            jenisAyat: 'larangan',
            betul: false,
            maklumBalas: 'Ini tidak menyelesaikan masalah kehausan haiwan rimba.'
          },
          {
            teks: 'Bergaduhlah kamu berdua sampai petang.',
            jenisAyat: 'suruhan',
            betul: false,
            maklumBalas: 'Menghasut pergaduhan adalah bertentangan dengan nilai murni Bahasa Melayu.'
          }
        ]
      },
      {
        step: 2,
        tajuk: 'Deklarasi Poster Perpaduan Rimba',
        latarTempat: 'Pentas Utama Rimba',
        kisah: 'Semua penghuni rimba bersetuju memasang papan tanda peringatan kekal agar keamanan terus terpelihara.',
        watak: 'Sang Kancil Bijaksana',
        watakEmosi: 'bangga',
        soalanCabaran: 'Papan tanda itu perlu menggabungkan larangan dan silaan yang seimbang:',
        pilihan: [
          {
            teks: 'Usah bermusuhan sesama kita; marilah kita saling bantu-membantu.',
            jenisAyat: 'larangan',
            betul: true,
            maklumBalas: 'Tahniah! Ayat ini menggabungkan nasihat lunak (Usah) dan ajakan murni, layak mendapat TP6!'
          },
          {
            teks: 'Pergi keluar dari rimba ini sekarang juga.',
            jenisAyat: 'suruhan',
            betul: false,
            maklumBalas: 'Ayat pengusiran yang memecahbelahkan perpaduan.'
          },
          {
            teks: 'Jangan bercakap walau sepatah kata pun.',
            jenisAyat: 'larangan',
            betul: false,
            maklumBalas: 'Larangan melampau yang menindas komunikasi sihat.'
          }
        ]
      }
    ]
  }
];

export const AR_FLASHCARDS_DATA: ARCard[] = [
  {
    id: 'ar-card-1',
    markerId: 'KAD-01',
    tajuk: 'Kad Imbasan AR: Pintu Gerbang Sekolah',
    jenis: 'silaan',
    ayatUtama: 'Sila gunakan laluan pejalan kaki beratap ini.',
    peneranganSituasi: 'Murid melangkah masuk ke perkarangan sekolah pada hari hujan rintik-rintik.',
    watakDialog: '"Selamat pagi kawan-kawan! Sila gunakan laluan berbumbung ini supaya baju dan buku kamu tidak basah terkena hujan!"',
    watakNama: 'Si Kancil Pintar',
    animasiWatak: 'bow',
    warnaKod: '#f59e0b',
    ikonSimbol: '🏫',
    audioVoice: 'Selamat pagi kawan-kawan! Sila gunakan laluan pejalan kaki beratap ini supaya baju dan buku kamu tidak basah.'
  },
  {
    id: 'ar-card-2',
    markerId: 'KAD-02',
    tajuk: 'Kad Imbasan AR: Makmal Sains Eksperimen',
    jenis: 'larangan',
    ayatUtama: 'Jangan sentuh bahan kimia tanpa kebenaran guru.',
    peneranganSituasi: 'Di atas meja makmal terdapat pelbagai bikar dan cecair berwarna-warni.',
    watakDialog: '"Awas! Jangan sentuh atau bau bahan kimia ini tanpa pengawasan Cikgu. Keselamatan mata dan kulit kita amat berharga!"',
    watakNama: 'Cikgu Syafiqah',
    animasiWatak: 'warning',
    warnaKod: '#e11d48',
    ikonSimbol: '🧪',
    audioVoice: 'Awas murid-murid! Jangan sentuh atau bau bahan kimia ini tanpa pengawasan cikgu. Utamakan keselamatan!'
  },
  {
    id: 'ar-card-3',
    markerId: 'KAD-03',
    tajuk: 'Kad Imbasan AR: Bilik Darjah Harmoni',
    jenis: 'suruhan',
    ayatUtama: 'Kemas beg sekolah dan meja belajar sebelum pulang.',
    peneranganSituasi: 'Sesi persekolahan petang hampir tamat dan murid bersiap untuk pulang ke rumah.',
    watakDialog: '"Tengok bawah meja kamu! Kemaslah kertas dan botol air. Jadikan kelas kita bersih dan ceria sentiasa!"',
    watakNama: 'Haris Murid Mithali',
    animasiWatak: 'point',
    warnaKod: '#059669',
    ikonSimbol: '🎒',
    audioVoice: 'Kemas beg sekolah dan meja belajar kamu sebelum pulang ke rumah. Kebersihan amalan kita bersama!'
  },
  {
    id: 'ar-card-4',
    markerId: 'KAD-04',
    tajuk: 'Kad Imbasan AR: Kantin Sihat Bersih',
    jenis: 'permintaan',
    ayatUtama: 'Tolong letakkan pinggan dan cawan ke dalam besen ini.',
    peneranganSituasi: 'Kawasan pemulangan dulang dan pinggan mangkuk selepas waktu makan rehat.',
    watakDialog: '"Wah, sedapnya makanan tadi! Tolong bantu Makcik Kantin dengan meletakkan mangkuk ke dalam besen bertanda ya!"',
    watakNama: 'Maya Sahabat Mesra',
    animasiWatak: 'celebrate',
    warnaKod: '#0284c7',
    ikonSimbol: '🥣',
    audioVoice: 'Tolong letakkan pinggan dan cawan ke dalam besen ini selepas selesai makan. Terima kasih rakan-rakan!'
  }
];

export const INITIAL_TRIAL_ARTIFACTS: TrialogicalArtifact[] = [
  {
    id: 'art-001',
    tajuk: 'Poster Disiplin Makmal Komputer Pintar',
    kategori: 'poster',
    jenisAyatDipilih: 'larangan',
    ayatPerintahUtama: 'Jangan bawa makanan atau minuman manis ke dalam makmal.',
    ayatKeterangan: 'Untuk mengelakkan papan kekunci dan komputer rosak akibat tertumpah air.',
    penciptaNama: 'Ahmad Danial (Tahun 5 Bestari)',
    ikonHiasan: '💻',
    warnaLatar: 'from-rose-500 to-amber-600',
    tarikhDicipta: '2026-10-18',
    tahapPenguasaan: 5,
    maklumBalasGuru: 'Penggunaan kata larangan "Jangan" sangat bertepatan dengan konteks keselamatan peralatan IT.',
    statusPenilaian: 'Cemerlang'
  },
  {
    id: 'art-002',
    tajuk: 'Kad Silaan Sambutan Hari Raya Kelas',
    kategori: 'kad_jemputan',
    jenisAyatDipilih: 'silaan',
    ayatPerintahUtama: 'Sila hadir beramai-ramai ke jamuan kuih raya kelas kami.',
    ayatKeterangan: 'Pakaian tradisional digalakkan. Makanan lazat disediakan percuma!',
    penciptaNama: 'Nurul Iman (Tahun 5 Bestari)',
    ikonHiasan: '🌙',
    warnaLatar: 'from-emerald-500 to-teal-600',
    tarikhDicipta: '2026-10-19',
    tahapPenguasaan: 6,
    maklumBalasGuru: 'Kreativiti reka bentuk dan kesantunan ayat silaan bertaraf contoh teladan untuk rakan sekelas.',
    statusPenilaian: 'Cemerlang'
  }
];

export const INITIAL_STUDENTS: StudentPBSRecord[] = [
  {
    id: 'std-101',
    nama: 'Ahmad Danial bin Razak',
    kelas: '5 Bestari',
    avatar: '👦🏻',
    kataLaluan: '1234',
    skorKuiz: 92,
    bilanganKuizSelesai: 6,
    tahapPermainanSelesai: 3,
    sesiARSelesai: 4,
    artifakTrialogikalDicipta: 2,
    syilingTerkumpul: 340,
    lencana: ['Jaguh Ayat Suruhan', 'Juara Ayat Larangan', 'Pakar Ayat Silaan', 'Pakar Agung Trialogikal & Bahasa'],
    tahapPenguasaan: 6,
    ulasanGuru: 'Menguasai kemahiran tatabahasa ayat perintah secara holistik. Mampu mencipta artifak komunikasi yang berkesan.',
    tarikhKemasKini: '2026-10-21'
  },
  {
    id: 'std-102',
    nama: 'Nurul Iman binti Zulkifli',
    kelas: '5 Bestari',
    avatar: '👧🏻',
    kataLaluan: '1234',
    skorKuiz: 85,
    bilanganKuizSelesai: 5,
    tahapPermainanSelesai: 2,
    sesiARSelesai: 3,
    artifakTrialogikalDicipta: 2,
    syilingTerkumpul: 280,
    lencana: ['Pakar Ayat Silaan', 'Duta Kesopanan Permintaan'],
    tahapPenguasaan: 5,
    ulasanGuru: 'Sangat beradab dalam menggunakan kata silaan dan permintaan. Aktif dalam sesi AR dan kolaborasi kelas.',
    tarikhKemasKini: '2026-10-20'
  },
  {
    id: 'std-103',
    nama: 'Chong Wei Liang',
    kelas: '5 Bestari',
    avatar: '👦🏼',
    kataLaluan: '1234',
    skorKuiz: 75,
    bilanganKuizSelesai: 4,
    tahapPermainanSelesai: 2,
    sesiARSelesai: 2,
    artifakTrialogikalDicipta: 1,
    syilingTerkumpul: 190,
    lencana: ['Jaguh Ayat Suruhan'],
    tahapPenguasaan: 4,
    ulasanGuru: 'Dapat membezakan ayat suruhan dan larangan dengan baik. Perlu latihan lanjut untuk kata permintaan.',
    tarikhKemasKini: '2026-10-19'
  },
  {
    id: 'std-104',
    nama: 'Kavitha a/p Muthusamy',
    kelas: '5 Bestari',
    avatar: '👧🏽',
    kataLaluan: '1234',
    skorKuiz: 68,
    bilanganKuizSelesai: 3,
    tahapPermainanSelesai: 1,
    sesiARSelesai: 2,
    artifakTrialogikalDicipta: 1,
    syilingTerkumpul: 140,
    lencana: ['Juara Ayat Larangan'],
    tahapPenguasaan: 3,
    ulasanGuru: 'Memahami konsep asas ayat perintah. Perlu bimbingan bagi membezakan kata larangan berganda.',
    tarikhKemasKini: '2026-10-18'
  },
  {
    id: 'std-105',
    nama: 'Muhammad Harith bin Firdaus',
    kelas: '5 Bestari',
    avatar: '🧒🏻',
    kataLaluan: '1234',
    skorKuiz: 50,
    bilanganKuizSelesai: 2,
    tahapPermainanSelesai: 1,
    sesiARSelesai: 1,
    artifakTrialogikalDicipta: 0,
    syilingTerkumpul: 70,
    lencana: [],
    tahapPenguasaan: 2,
    ulasanGuru: 'Mengenal kata perintah dengan bantuan visual. Digalakkan memperbanyak sesi interaktif AR.',
    tarikhKemasKini: '2026-10-17'
  },
  {
    id: 'std-106',
    nama: 'Siti Aisyah binti Mohd Faizal',
    kelas: '5 Bestari',
    avatar: '👧🏻',
    kataLaluan: '1234',
    skorKuiz: 88,
    bilanganKuizSelesai: 5,
    tahapPermainanSelesai: 3,
    sesiARSelesai: 3,
    artifakTrialogikalDicipta: 2,
    syilingTerkumpul: 310,
    lencana: ['Pakar Ayat Silaan', 'Duta Kesopanan Permintaan'],
    tahapPenguasaan: 5,
    ulasanGuru: 'Menunjukkan kesantunan bahasa yang tinggi dalam aktiviti lisan dan tugasan bertulis.',
    tarikhKemasKini: '2026-10-21'
  },
  {
    id: 'std-107',
    nama: 'Adam Rayyan bin Kamaruddin',
    kelas: '5 Bestari',
    avatar: '👦🏻',
    kataLaluan: '1234',
    skorKuiz: 78,
    bilanganKuizSelesai: 4,
    tahapPermainanSelesai: 2,
    sesiARSelesai: 2,
    artifakTrialogikalDicipta: 1,
    syilingTerkumpul: 220,
    lencana: ['Jaguh Ayat Suruhan'],
    tahapPenguasaan: 4,
    ulasanGuru: 'Faham penggunaan kata perintah dalam situasi formal sekolah dan perbualan rakan sebaya.',
    tarikhKemasKini: '2026-10-20'
  },
  {
    id: 'std-108',
    nama: 'Tan Wei Jie',
    kelas: '5 Bestari',
    avatar: '👦🏼',
    kataLaluan: '1234',
    skorKuiz: 64,
    bilanganKuizSelesai: 3,
    tahapPermainanSelesai: 1,
    sesiARSelesai: 2,
    artifakTrialogikalDicipta: 1,
    syilingTerkumpul: 130,
    lencana: ['Juara Ayat Larangan'],
    tahapPenguasaan: 3,
    ulasanGuru: 'Memerlukan latihan berterusan untuk mengelakkan kekeliruan antara ayat suruhan dan silaan.',
    tarikhKemasKini: '2026-10-19'
  },
  {
    id: 'std-109',
    nama: 'Divya a/p Kumar',
    kelas: '5 Bestari',
    avatar: '👧🏽',
    kataLaluan: '1234',
    skorKuiz: 72,
    bilanganKuizSelesai: 4,
    tahapPermainanSelesai: 2,
    sesiARSelesai: 2,
    artifakTrialogikalDicipta: 1,
    syilingTerkumpul: 180,
    lencana: ['Duta Kesopanan Permintaan'],
    tahapPenguasaan: 4,
    ulasanGuru: 'Menyusun ayat permintaan dengan santun menggunakan kata tolong dan harap.',
    tarikhKemasKini: '2026-10-20'
  },
  {
    id: 'std-110',
    nama: 'Puteri Nur Damia binti Shahril',
    kelas: '5 Bestari',
    avatar: '👧🏻',
    kataLaluan: '1234',
    skorKuiz: 96,
    bilanganKuizSelesai: 6,
    tahapPermainanSelesai: 3,
    sesiARSelesai: 4,
    artifakTrialogikalDicipta: 3,
    syilingTerkumpul: 420,
    lencana: ['Jaguh Ayat Suruhan', 'Juara Ayat Larangan', 'Pakar Ayat Silaan', 'Duta Kesopanan Permintaan', 'Pakar Agung Trialogikal & Bahasa'],
    tahapPenguasaan: 6,
    ulasanGuru: 'Murid contoh 5 Bestari. Berjaya mencipta artifak digital berkualiti tinggi dan membimbing rakan.',
    tarikhKemasKini: '2026-10-22'
  }
];

/**
 * Pengiraan Tahap Penguasaan (TP1 - TP6) mengikut Standard Prestasi DSKP KSSR
 */
export function hitungTahapPenguasaan(
  skorKuiz: number,
  tahapPermainan: number,
  artifakCount: number,
  arCount: number
): 1 | 2 | 3 | 4 | 5 | 6 {
  // TP6: Skor kuiz >= 85, permainan selesai (tahap 3), artifak >= 2, AR >= 2
  if (skorKuiz >= 85 && tahapPermainan >= 3 && artifakCount >= 2 && arCount >= 2) {
    return 6;
  }
  // TP5: Skor kuiz >= 75, tahap permainan >= 2, artifak >= 1
  if (skorKuiz >= 75 && tahapPermainan >= 2 && artifakCount >= 1) {
    return 5;
  }
  // TP4: Skor kuiz >= 65, tahap permainan >= 2
  if (skorKuiz >= 65 && tahapPermainan >= 2) {
    return 4;
  }
  // TP3: Skor kuiz >= 50, tahap permainan >= 1
  if (skorKuiz >= 50 && tahapPermainan >= 1) {
    return 3;
  }
  // TP2: Skor kuiz >= 35 atau telah mencuba aktiviti
  if (skorKuiz >= 35 || tahapPermainan >= 1 || arCount >= 1) {
    return 2;
  }
  // TP1: Asas
  return 1;
}

export const TP_DESCRIPTIONS: Record<number, { tajuk: string; huraian: string; warna: string }> = {
  1: {
    tajuk: 'TP1 - Tahu Kata Perintah Asas',
    huraian: 'Murid boleh mengenal dan menamakan kata perintah asas dengan bimbingan guru.',
    warna: 'text-stone-600 bg-stone-100 border-stone-200'
  },
  2: {
    tajuk: 'TP2 - Tahu & Faham Maksud',
    huraian: 'Murid memahami fungsi dan jenis-jenis ayat perintah (suruhan, larangan, silaan, permintaan).',
    warna: 'text-amber-800 bg-amber-100 border-amber-300'
  },
  3: {
    tajuk: 'TP3 - Mengaplikasi dalam Situasi Mudah',
    huraian: 'Murid menggunakan ayat perintah yang betul dalam perbualan harian dan tugasan terpandu.',
    warna: 'text-blue-800 bg-blue-100 border-blue-300'
  },
  4: {
    tajuk: 'TP4 - Mengaplikasi Secara Tepat & Beradab',
    huraian: 'Murid membina ayat perintah bertatabahasa betul tanpa kesalahan kata perintah berganda.',
    warna: 'text-indigo-800 bg-indigo-100 border-indigo-300'
  },
  5: {
    tajuk: 'TP5 - Berkomunikasi Tekal & Berhikmah',
    huraian: 'Murid menggunakan intonasi, partikel penegas dan kata perintah santun secara konsisten.',
    warna: 'text-emerald-800 bg-emerald-100 border-emerald-300'
  },
  6: {
    tajuk: 'TP6 - Cemerlang, Kreatif & Menjadi Teladan',
    huraian: 'Murid mampu menilai, berkolaborasi dan mereka cipta artifak pembelajaran (poster/papan tanda) yang bermakna mengikut Model Trialogikal.',
    warna: 'text-purple-800 bg-purple-100 border-purple-300'
  }
};
