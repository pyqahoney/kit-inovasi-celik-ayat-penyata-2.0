export type AyatPerintahType = 'suruhan' | 'larangan' | 'silaan' | 'permintaan';

export interface AyatPerintahDetail {
  id: AyatPerintahType;
  title: string;
  badgeTitle: string;
  kataKunci: string[];
  maksud: string;
  ciriKhas: string;
  contohAyat: {
    ayat: string;
    situasi: string;
    kataTerlibat: string;
    huraian: string;
    audioText: string;
  }[];
  peringatanSopan: string;
  warnaTema: {
    bg: string;
    border: string;
    text: string;
    button: string;
    accent: string;
  };
  ikon: string;
}

export interface QuizQuestion {
  id: number;
  kategori: AyatPerintahType | 'campuran';
  soalan: string;
  pilihan: string[];
  jawapanBetul: number;
  penerangan: string;
  situasiGrafik: {
    tajuk: string;
    pembayang: string;
    ikon: string;
  };
  tahapPenguasaanTarget: number; // 1 to 6
}

export interface GameMissionStage {
  step: number;
  tajuk: string;
  latarTempat: string;
  kisah: string;
  watak: string;
  watakEmosi: 'ceria' | 'bimbang' | 'tegas' | 'bangga';
  soalanCabaran: string;
  pilihan: {
    teks: string;
    jenisAyat: AyatPerintahType;
    betul: boolean;
    maklumBalas: string;
  }[];
}

export interface GameMission {
  id: string;
  tahap: number;
  tajuk: string;
  keterangan: string;
  ikon: string;
  warna: string;
  ganjaranSyiling: number;
  ganjaranLencana: string;
  stages: GameMissionStage[];
}

export interface ARCard {
  id: string;
  markerId: string;
  tajuk: string;
  jenis: AyatPerintahType;
  ayatUtama: string;
  peneranganSituasi: string;
  watakDialog: string;
  watakNama: string;
  animasiWatak: 'wave' | 'point' | 'warning' | 'bow' | 'celebrate';
  warnaKod: string;
  ikonSimbol: string;
  audioVoice: string;
}

export interface TrialogicalArtifact {
  id: string;
  tajuk: string;
  kategori: 'poster' | 'kad_jemputan' | 'papan_tanda' | 'peraturan';
  jenisAyatDipilih: AyatPerintahType;
  ayatPerintahUtama: string;
  ayatKeterangan: string;
  penciptaNama: string;
  ikonHiasan: string;
  warnaLatar: string;
  tarikhDicipta: string;
  tahapPenguasaan: number;
  maklumBalasGuru: string;
  statusPenilaian: 'Disemak' | 'Dalam Proses' | 'Cemerlang';
}

export interface StudentPBSRecord {
  id: string;
  nama: string;
  kelas: string;
  avatar: string;
  skorKuiz: number; // 0 - 100
  bilanganKuizSelesai: number;
  tahapPermainanSelesai: number; // 0 - 3
  sesiARSelesai: number; // count
  artifakTrialogikalDicipta: number; // count
  syilingTerkumpul: number;
  lencana: string[];
  tahapPenguasaan: 1 | 2 | 3 | 4 | 5 | 6;
  ulasanGuru: string;
  tarikhKemasKini: string;
  kataLaluan?: string;
}

export interface UserProgressState {
  currentStudentId: string;
  students: StudentPBSRecord[];
  unlockedAvatars: string[];
  activeAvatar: string;
  soundEnabled: boolean;
}
