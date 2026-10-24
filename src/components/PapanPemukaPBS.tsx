import React, { useState } from 'react';
import { StudentPBSRecord } from '../types';
import { TP_DESCRIPTIONS, hitungTahapPenguasaan } from '../data/learningContent';
import { TopNavBar } from './OrganicNav';
import { Download, Plus, Search, Filter, CheckCircle, Award, Database, FileSpreadsheet, RefreshCw, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface PapanPemukaPBSProps {
  students: StudentPBSRecord[];
  onBack: () => void;
  onHome?: () => void;
  onUpdateStudents: (updated: StudentPBSRecord[]) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectActiveStudent: (id: string) => void;
  currentStudentId: string;
}

export const PapanPemukaPBS: React.FC<PapanPemukaPBSProps> = ({
  students,
  onBack,
  onHome,
  onUpdateStudents,
  soundEnabled,
  onToggleSound,
  onSelectActiveStudent,
  currentStudentId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTP, setFilterTP] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('5 Bestari');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.kelas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTP = filterTP === 'all' || s.tahapPenguasaan.toString() === filterTP;
    return matchesSearch && matchesTP;
  });

  // Calculate statistics
  const tpCounts = [1, 2, 3, 4, 5, 6].map((tp) => ({
    tp,
    count: students.filter((s) => s.tahapPenguasaan === tp).length
  }));

  const avgQuizScore = Math.round(
    students.reduce((acc, curr) => acc + curr.skorKuiz, 0) / (students.length || 1)
  );

  // Handle adding student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    sound.playSuccess();
    const newStd: StudentPBSRecord = {
      id: `std-${Date.now()}`,
      nama: newStudentName.trim(),
      kelas: newStudentClass,
      avatar: '🧒🏻',
      skorKuiz: 40,
      bilanganKuizSelesai: 1,
      tahapPermainanSelesai: 1,
      sesiARSelesai: 1,
      artifakTrialogikalDicipta: 0,
      syilingTerkumpul: 50,
      lencana: ['Pelajar Baharu'],
      tahapPenguasaan: 2,
      ulasanGuru: 'Pendaftaran baharu. Memulakan modul pembelajaran ayat perintah.',
      tarikhKemasKini: '2026-10-21'
    };

    onUpdateStudents([newStd, ...students]);
    setNewStudentName('');
    setShowAddModal(false);
  };

  // Export to CSV matching KPM SPPB standard
  const handleExportCSV = () => {
    sound.playClick();
    const headers = [
      'ID Murid',
      'Nama Penuh',
      'Kelas',
      'Skor Kuiz (%)',
      'Tahap Permainan',
      'Sesi AR Selesai',
      'Artifak Trialogikal',
      'Syiling Terkumpul',
      'Tahap Penguasaan (TP)',
      'Deskriptor Standard Prestasi',
      'Ulasan Guru',
      'Tarikh Kemaskini'
    ];

    const rows = students.map((s) => [
      s.id,
      `"${s.nama}"`,
      s.kelas,
      s.skorKuiz,
      s.tahapPermainanSelesai,
      s.sesiARSelesai,
      s.artifakTrialogikalDicipta,
      s.syilingTerkumpul,
      `TP${s.tahapPenguasaan}`,
      `"${TP_DESCRIPTIONS[s.tahapPenguasaan]?.tajuk || ''}"`,
      `"${s.ulasanGuru}"`,
      s.tarikhKemasKini
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekod_PBS_Ayat_Perintah_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateSync = () => {
    setSyncStatus('syncing');
    sound.playClick();
    setTimeout(() => {
      setSyncStatus('synced');
      sound.playSuccess();
    }, 1000);
  };

  return (
    <div className="relative min-h-[640px] max-w-5xl mx-auto rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl bg-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Navbar */}
      <TopNavBar
        onExit={onBack}
        onHome={onHome || onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        title="Rekod PBD Murid (Pentaksiran Bilik Darjah)"
      />

      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-4 rounded-2xl border-2 border-amber-200 my-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-heading font-black bg-emerald-600 text-white">
              DSKP BM TAHUN 5 / SP 5.3.2
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Kementerian Pendidikan Malaysia (KPM)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-1">
            Rekod Pentaksiran Bilik Darjah (PBD) Murid
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Laporan prestasi murid: bilangan soalan dijawab betul dan salah mengikut permainan, tahap penguasaan terkini (TP), kelas, skor kuiz dan ulasan guru.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSimulateSync}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-300 transition-all active:scale-95 cursor-pointer"
            title="Segerakkan rekod murid"
          >
            <RefreshCw size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
            <span>{syncStatus === 'syncing' ? 'Menyegerak...' : 'Pangkalan Data'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet size={16} />
            <span>Muat Turun CSV / Excel</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Murid</span>
          </button>
        </div>
      </div>

      {/* Panel Guru Pentaksir Bahasa Melayu SK */}
      <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 my-2 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-400 shadow-xs shrink-0 bg-amber-50">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_whsn1owhsn1owhsn_b0b267ce.jpg"
              alt="Panel Guru"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <span className="text-xs font-heading font-black text-slate-800 block">
              Panel Guru Pentaksir BM Tahun 5
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Standard DSKP SP 5.3.2 KPM · Penilai Utama Rekod PBD
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Cikgu Syafiqah */}
          <button
            onClick={() => {
              sound.playClick();
              sound.speakMalay('Saya Cikgu Syafiqah. Saya memantau penguasaan murid dalam aspek adab dan kesantunan ayat silaan dan permintaan.', 'syafiqah');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-full transition-all text-left shadow-2xs group cursor-pointer"
            title="Dengar suara Cikgu Syafiqah"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-purple-400 shrink-0">
              <img src="/assets/aistudio/cikgu_syafiqah_avatar_clean.png" alt="Cikgu Syafiqah" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-heading font-black text-purple-950 flex items-center gap-1 leading-tight">
              Cikgu Syafiqah <Volume2 size={12} className="text-purple-600" />
            </span>
          </button>

          {/* Cikgu Aaron */}
          <button
            onClick={() => {
              sound.playClick();
              sound.speakMalay('Saya Cikgu Aaron. Saya menilai aspek ketepatan tatabahasa dan respons pantas murid terhadap ayat suruhan.', 'aaron');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-full transition-all text-left shadow-2xs group cursor-pointer"
            title="Dengar suara Cikgu Aaron"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-sky-400 shrink-0">
              <img src="/assets/aistudio/cikgu_aaron_avatar_clean.png" alt="Cikgu Aaron" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-heading font-black text-sky-950 flex items-center gap-1 leading-tight">
              Cikgu Aaron <Volume2 size={12} className="text-sky-600" />
            </span>
          </button>

          {/* Cikgu Freshcy */}
          <button
            onClick={() => {
              sound.playClick();
              sound.speakMalay('Saya Cikgu Freshcy. Saya menyelia ketepatan pemahaman ayat larangan dan penglibatan aktif aktiviti interaktif.', 'freshcy');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-full transition-all text-left shadow-2xs group cursor-pointer"
            title="Dengar suara Cikgu Freshcy"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400 shrink-0">
              <img src="/assets/aistudio/cikgu_freshcy_avatar_clean.png" alt="Cikgu Freshcy" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-heading font-black text-amber-950 flex items-center gap-1 leading-tight">
              Cikgu Freshcy <Volume2 size={12} className="text-amber-600" />
            </span>
          </button>
        </div>
      </div>

      {/* KPI & TP Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 my-2">
        {tpCounts.map((item) => {
          const desc = TP_DESCRIPTIONS[item.tp];
          return (
            <div
              key={item.tp}
              onClick={() => setFilterTP(filterTP === item.tp.toString() ? 'all' : item.tp.toString())}
              className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer transform hover:scale-102 ${
                filterTP === item.tp.toString() ? 'ring-2 ring-amber-500' : ''
              } ${desc.warna}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-heading font-black text-xs">TP{item.tp}</span>
                <span className="text-lg font-black">{item.count}</span>
              </div>
              <span className="text-[10px] line-clamp-1 opacity-80 mt-1 block">
                {desc.tajuk.replace(`TP${item.tp} - `, '')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Search and Filters Bar with Class 5 Bestari Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="px-3 py-1 bg-amber-200/80 border border-amber-400 text-amber-950 font-heading font-black text-xs rounded-xl shadow-xs shrink-0">
            Kelas: 5 Bestari 🏫
          </span>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari murid mengikut nama atau kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <Filter size={14} className="text-slate-500" />
          <span className="font-bold text-slate-600">Tapis TP:</span>
          <select
            value={filterTP}
            onChange={(e) => setFilterTP(e.target.value)}
            className="p-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="all">Semua Tahap Penguasaan</option>
            <option value="6">TP6 (Cemerlang)</option>
            <option value="5">TP5 (Sangat Baik)</option>
            <option value="4">TP4 (Baik)</option>
            <option value="3">TP3 (Memuaskan)</option>
            <option value="2">TP2 (Asas)</option>
            <option value="1">TP1 (Permulaan)</option>
          </select>
        </div>
      </div>

      {/* Main Student Assessment Table */}
      <div className="flex-1 overflow-x-auto my-2 border border-slate-200 rounded-2xl shadow-inner max-h-[340px]">
        <table className="w-full text-left text-xs text-slate-800 border-collapse">
          <thead className="bg-amber-100/70 text-slate-900 font-heading font-black uppercase text-[11px] sticky top-0 z-10 border-b border-amber-300">
            <tr>
              <th className="py-2.5 px-3">Murid</th>
              <th className="py-2.5 px-2 text-center">Kelas</th>
              <th className="py-2.5 px-2 text-center">Skor Kuiz</th>
              <th className="py-2.5 px-3 text-center">Soalan Mengikut Permainan (Betul / Salah)</th>
              <th className="py-2.5 px-3 text-center">Tahap Penguasaan Terkini (TP)</th>
              <th className="py-2.5 px-3">Ulasan Guru</th>
              <th className="py-2.5 px-2 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredStudents.map((std) => {
              const isCurrent = currentStudentId === std.id;
              const tpInfo = TP_DESCRIPTIONS[std.tahapPenguasaan];
              
              // Defaults based on progression
              const katakStat = std.soalanPermainan?.katak || {
                betul: std.tahapPenguasaan >= 4 ? 5 : std.tahapPenguasaan >= 2 ? 4 : 2,
                salah: std.tahapPenguasaan >= 4 ? 0 : 1
              };
              const hartaStat = std.soalanPermainan?.hartaKarun || {
                betul: std.tahapPenguasaan >= 5 ? 7 : std.tahapPenguasaan >= 3 ? 5 : 3,
                salah: std.tahapPenguasaan >= 5 ? 0 : 2
              };
              const marioStat = std.soalanPermainan?.mario || {
                betul: std.tahapPenguasaan >= 6 ? 9 : std.tahapPenguasaan >= 4 ? 7 : 4,
                salah: std.tahapPenguasaan >= 6 ? 0 : 2
              };
              const pacmanStat = std.soalanPermainan?.pacman || {
                betul: std.tahapPenguasaan >= 5 ? 4 : std.tahapPenguasaan >= 3 ? 3 : 1,
                salah: std.tahapPenguasaan >= 5 ? 0 : 1
              };

              return (
                <tr
                  key={std.id}
                  className={`hover:bg-amber-50/50 transition-colors ${
                    isCurrent ? 'bg-amber-100/40 font-semibold' : ''
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{std.avatar}</span>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          {std.nama}
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-white font-black">
                              AKTIF
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">{std.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold text-slate-700">{std.kelas}</td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {std.skorKuiz}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-900 text-[10px] font-bold"
                        title={`Katak Lompat: ${katakStat.betul} Betul, ${katakStat.salah} Salah`}
                      >
                        🐸 {katakStat.betul} Betul · {katakStat.salah} Salah
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-bold"
                        title={`Harta Karun: ${hartaStat.betul} Betul, ${hartaStat.salah} Salah`}
                      >
                        🗺️ {hartaStat.betul} Betul · {hartaStat.salah} Salah
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-300 text-rose-900 text-[10px] font-bold"
                        title={`Wira Mario: ${marioStat.betul} Betul, ${marioStat.salah} Salah`}
                      >
                        🍄 {marioStat.betul} Betul · {marioStat.salah} Salah
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md bg-yellow-50 border border-yellow-400 text-yellow-950 text-[10px] font-bold"
                        title={`Kuasa Pac-Man: ${pacmanStat.betul} Betul, ${pacmanStat.salah} Salah`}
                      >
                        🟡 {pacmanStat.betul} Betul · {pacmanStat.salah} Salah
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-heading font-black border ${tpInfo?.warna}`}>
                      TP{std.tahapPenguasaan}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 max-w-xs text-[11px] text-slate-700 leading-snug" title={std.ulasanGuru}>
                    {std.ulasanGuru}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={() => {
                        sound.playClick();
                        onSelectActiveStudent(std.id);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      {isCurrent ? 'Sedang Digunakan' : 'Pilih Profil'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-heading font-black text-xl text-[#78350f] mb-3">
              Daftar Murid Baharu untuk PBS
            </h3>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Penuh Murid:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Ali bin Abu Bakar"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tahun / Kelas:
                </label>
                <select
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="5 Bestari">5 Bestari</option>
                  <option value="5 Cerdik">5 Cerdik</option>
                  <option value="5 Amanah">5 Amanah</option>
                  <option value="3 Bestari">3 Bestari</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-heading font-bold text-xs shadow"
                >
                  Daftar Murid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Footer Info */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
        <span className="text-slate-500 font-semibold">
          Jumlah Murid: <strong>{students.length} orang</strong> · Purata Skor Kuiz: <strong>{avgQuizScore}%</strong>
        </span>
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-xl bg-[#ddb892] hover:bg-[#b08968] text-[#582f0e] font-heading font-bold text-xs border border-[#7f4f24]"
        >
          Kembali ke Menu Utama
        </button>
      </div>
    </div>
  );
};
