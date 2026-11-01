import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Sparkles, Volume2, Heart, Award, CheckCircle } from 'lucide-react';

export type TeacherId = 'syafiqah' | 'aaron' | 'freshcy';

export interface TeacherProfile {
  id: TeacherId;
  nama: string;
  gelaran: string;
  peranan: string;
  kepakaran: string;
  fotoUrl: string;
  avatarUrl: string;
  fullGraphicUrl: string;
  soloPhotoUrl: string;
  groupGraphicUrl: string;
  ucapanMesra: string;
  faktaMenarik: string;
  temaWarna: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    gradient: string;
    shadow: string;
  };
}

export const TEACHER_PROFILES: Record<TeacherId, TeacherProfile> = {
  syafiqah: {
    id: 'syafiqah',
    nama: 'Cikgu Syafiqah',
    gelaran: '',
    peranan: 'Guru Bahasa Melayu Tahun 5',
    kepakaran: 'Ayat Silaan dan Ayat Permintaan',
    fotoUrl: '/assets/aistudio/cikgu_syafiqah_avatar_clean.png',
    avatarUrl: '/assets/aistudio/cikgu_syafiqah_avatar_clean.png',
    fullGraphicUrl: '/assets/aistudio/cikgu_syafiqah_clean.png',
    soloPhotoUrl: '/assets/aistudio/cikgu_syafiqah_clean.png',
    groupGraphicUrl: '/assets/aistudio/Gemini_Generated_Image_whsn1owhsn1owhsn_b0b267ce.jpg',
    ucapanMesra:
      'Salam sejahtera dan salam sayang anak-anak murid yang pintar! Saya Cikgu Syafiqah. Mari kita terokai ayat silaan dan permintaan dengan santun dan beradab.',
    faktaMenarik: 'Suka membimbing murid dengan sabar dan menerapkan nilai kesantunan berbahasa.',
    temaWarna: {
      bg: 'bg-purple-50',
      border: 'border-purple-400',
      text: 'text-purple-950',
      badge: 'bg-purple-100 text-purple-900 border-purple-300',
      gradient: 'from-purple-500 via-fuchsia-500 to-rose-400',
      shadow: 'shadow-purple-200'
    }
  },
  aaron: {
    id: 'aaron',
    nama: 'Cikgu Aaron',
    gelaran: '',
    peranan: 'Guru Bahasa Melayu Tahun 5',
    kepakaran: 'Ayat Suruhan dan Tatabahasa Baku',
    fotoUrl: '/assets/aistudio/cikgu_aaron_avatar_clean.png',
    avatarUrl: '/assets/aistudio/cikgu_aaron_avatar_clean.png',
    fullGraphicUrl: '/assets/aistudio/cikgu_aaron_clean.png',
    soloPhotoUrl: '/assets/aistudio/cikgu_aaron_clean.png',
    groupGraphicUrl: '/assets/aistudio/Gemini_Generated_Image_whsn1owhsn1owhsn_b0b267ce.jpg',
    ucapanMesra:
      'Salam sejahtera semua wira cilik! Saya Cikgu Aaron. Siap sedia untuk cabaran tatabahasa ayat perintah hari ini? Ayuh kita buktikan ketangkasan anda!',
    faktaMenarik: 'Penuh bersemangat, suka aktiviti cabaran tatabahasa dan memupuk keyakinan murid.',
    temaWarna: {
      bg: 'bg-sky-50',
      border: 'border-sky-400',
      text: 'text-sky-950',
      badge: 'bg-sky-100 text-sky-900 border-sky-300',
      gradient: 'from-blue-600 via-sky-500 to-indigo-600',
      shadow: 'shadow-sky-200'
    }
  },
  freshcy: {
    id: 'freshcy',
    nama: 'Cikgu Freshcy',
    gelaran: '',
    peranan: 'Guru Bahasa Melayu Tahun 5',
    kepakaran: 'Ayat Larangan dan Gamifikasi',
    fotoUrl: '/assets/aistudio/cikgu_freshcy_avatar_clean.png',
    avatarUrl: '/assets/aistudio/cikgu_freshcy_avatar_clean.png',
    fullGraphicUrl: '/assets/aistudio/cikgu_freshcy_clean.png',
    soloPhotoUrl: '/assets/aistudio/cikgu_freshcy_clean.png',
    groupGraphicUrl: '/assets/aistudio/Gemini_Generated_Image_whsn1owhsn1owhsn_b0b267ce.jpg',
    ucapanMesra:
      'Hai anak-anak riang dan cemerlang! Saya Cikgu Freshcy. Jom kita bezakan ayat larangan dengan tepat sambil mengumpul banyak syiling emas!',
    faktaMenarik: 'Sentiasa ceria dan bertenaga, suka memberi galakan dan tepukan gemuruh untuk kejayaan murid.',
    temaWarna: {
      bg: 'bg-amber-50',
      border: 'border-amber-400',
      text: 'text-amber-950',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      gradient: 'from-amber-500 via-pink-500 to-rose-500',
      shadow: 'shadow-amber-200'
    }
  }
};

interface TeacherStandeeProps {
  teacherId: TeacherId;
  size?: 'sm' | 'md' | 'lg';
  showBubble?: boolean;
  bubbleText?: string;
  audioUrl?: string;
  onClick?: () => void;
  interactive?: boolean;
  className?: string;
}

export const TeacherStandee: React.FC<TeacherStandeeProps> = ({
  teacherId,
  size = 'md',
  showBubble = true,
  bubbleText,
  audioUrl,
  onClick,
  interactive = true,
  className = ''
}) => {
  const profile = TEACHER_PROFILES[teacherId];
  const [isSpeakingLocal, setIsSpeakingLocal] = useState(false);
  const [bounceAnim, setBounceAnim] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  useEffect(() => {
    const unsubscribe = sound.onSpeechStateChange((speaking) => {
      setIsSpeakingLocal(speaking);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleTeacherClick = () => {
    sound.playClick();
    setBounceAnim(true);
    setShowHeartBurst(true);
    setTimeout(() => setBounceAnim(false), 600);
    setTimeout(() => setShowHeartBurst(false), 1200);

    if (onClick) onClick();
  };

  const heightClasses = {
    sm: 'h-44 sm:h-48',
    md: 'h-60 sm:h-64',
    lg: 'h-72 sm:h-80'
  }[size];

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={interactive ? handleTeacherClick : undefined}
      title={`${profile.nama} - ${profile.gelaran}`}
    >
      {/* Animated Speech Bubble */}
      {showBubble && (
        <div
          className={`mb-2 px-3 py-1.5 max-w-[210px] sm:max-w-[240px] rounded-2xl bg-white/95 border-2 ${profile.temaWarna.border} shadow-lg text-center transform transition-all duration-300 ${
            isSpeakingLocal ? 'scale-105 ring-2 ring-amber-400' : 'group-hover:scale-102'
          }`}
        >
          <div className="flex items-center justify-between gap-1 text-[11px] font-heading font-black text-amber-800">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full overflow-hidden border border-amber-400 inline-block shrink-0">
                <img src={profile.avatarUrl} alt={profile.nama} className="w-full h-full object-cover" />
              </span>
              <span>{profile.nama}</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                if (audioUrl && profile.id === 'freshcy') {
                  sound.playAudioClip(audioUrl);
                } else {
                  const speechText = bubbleText || profile.ucapanMesra;
                  sound.speakMalay(speechText, profile.id);
                }
              }}
              aria-label={`Dengar suara ${profile.nama}`}
              title="Tekan untuk dengar audio sebutan cikgu"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-heading font-extrabold text-[10px] shadow-xs active:scale-95 cursor-pointer"
            >
              <Volume2 size={11} />
              <span>Dengar</span>
            </button>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-800 font-medium leading-snug mt-1">
            {bubbleText || (isSpeakingLocal ? 'Sedang bercakap...' : '“Tekan butang Dengar untuk bimbingan!”')}
          </p>
          {/* Bubble Arrow Tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-white" />
        </div>
      )}

      {/* Floating Sparkles & Reaction */}
      {showHeartBurst && (
        <div className="absolute top-8 pointer-events-none z-30 animate-fade-in flex items-center justify-center gap-1">
          <span className="text-xl animate-bounce">💖</span>
          <span className="text-base text-amber-500 animate-ping">✨</span>
          <span className="text-xl animate-bounce">🌟</span>
        </div>
      )}

      {/* Full Illustrated Teacher Graphic Standee (Official Art from User) */}
      <div
        className={`relative flex flex-col items-center transition-transform duration-300 ${
          bounceAnim ? 'scale-110 -translate-y-2' : ''
        } ${isSpeakingLocal ? 'scale-105' : 'hover:-translate-y-1'}`}
      >
        <div className={`relative ${heightClasses} flex items-end justify-center filter drop-shadow-xl`}>
          <img
            src={profile.fullGraphicUrl}
            alt={profile.nama}
            className="h-full w-auto max-w-none object-contain select-none pointer-events-none"
            loading="lazy"
          />

          {/* Speaking Glowing Ring Base */}
          {isSpeakingLocal && (
            <div className="absolute -bottom-2 w-28 h-6 bg-amber-400/60 rounded-full blur-md animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Shadow Pedestal */}
        <div className="w-24 h-3 bg-black/20 rounded-full blur-xs -mt-1 pointer-events-none" />

        {/* Name Plate */}
        <div className="mt-1 flex flex-col items-center text-center">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-heading font-black border ${profile.temaWarna.badge} shadow-xs flex items-center gap-1.5`}
          >
            <span className="w-3.5 h-3.5 rounded-full overflow-hidden border border-amber-500 shrink-0 inline-block">
              <img src={profile.avatarUrl} alt={profile.nama} className="w-full h-full object-cover" />
            </span>
            <span>{profile.nama}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// Teacher Avatar Round Badge Component (No Emoji)
export const TeacherAvatar: React.FC<{
  teacherId: TeacherId;
  size?: 'sm' | 'md' | 'lg';
  withBorder?: boolean;
  className?: string;
}> = ({ teacherId, size = 'md', withBorder = true, className = '' }) => {
  const profile = TEACHER_PROFILES[teacherId];
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  }[size];

  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 ${sizeClasses} ${
        withBorder ? `border-2 ${profile.temaWarna.border} shadow-sm` : ''
      } ${className}`}
      title={`${profile.nama} - ${profile.gelaran}`}
    >
      <img
        src={profile.avatarUrl}
        alt={profile.nama}
        className="w-full h-full object-cover object-center"
        loading="lazy"
      />
    </div>
  );
};

// Teacher Trio Showcase Banner - welcoming students and allowing mentor selection
export const TeacherTrioShowcase: React.FC<{
  activeTeacherId: TeacherId;
  onSelectTeacher: (id: TeacherId) => void;
  className?: string;
}> = ({ activeTeacherId, onSelectTeacher, className = '' }) => {
  const teacherList: TeacherId[] = ['syafiqah', 'aaron', 'freshcy'];

  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-xl ${className}`}
    >
      {/* Header with Group Graphic Art Thumbnail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b-2 border-amber-200/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-amber-50">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_whsn1owhsn1owhsn_b0b267ce.jpg"
              alt="Pasukan Guru Celik Perintah"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-heading font-black text-amber-950 flex items-center gap-2">
              <span>Pasukan Guru Celik Perintah Tahun 5</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold border border-amber-300">
                Koleksi Rasmi
              </span>
            </h3>
            <p className="text-xs text-amber-800 font-medium">
              Kenali barisan guru pembimbing anda. Pilih mentor rasmi dan tekan butang dengar untuk mendengar bimbingan!
            </p>
          </div>
        </div>

        {/* Active Guide Chip */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full self-start sm:self-auto">
          <span className="text-xs text-amber-900 font-bold">Mentor Semasa:</span>
          <span className="text-xs font-black text-amber-950 flex items-center gap-1">
            <TeacherAvatar teacherId={activeTeacherId} size="sm" withBorder={false} />
            <span>{TEACHER_PROFILES[activeTeacherId].nama}</span>
          </span>
        </div>
      </div>

      {/* Grid of 3 Teachers using Official Illustration Graphic */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {teacherList.map((id) => {
          const profile = TEACHER_PROFILES[id];
          const isActive = id === activeTeacherId;

          return (
            <div
              key={id}
              onClick={() => {
                sound.playClick();
                onSelectTeacher(id);
              }}
              className={`relative rounded-2xl p-3 sm:p-4 border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center ${
                isActive
                  ? `${profile.temaWarna.bg} ${profile.temaWarna.border} ring-3 ring-amber-400 shadow-lg scale-102`
                  : 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-md'
              }`}
            >
              {/* Selected Badge */}
              {isActive && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-heading font-black shadow-xs z-20">
                  <CheckCircle size={11} />
                  <span>Dipilih</span>
                </div>
              )}

              {/* Standee Graphic Illustration */}
              <div className="my-1">
                <TeacherStandee
                  teacherId={id}
                  size="sm"
                  showBubble={false}
                  interactive={false}
                />
              </div>

              {/* Bio & Details */}
              <div className="mt-2 w-full">
                <h4 className="text-sm font-heading font-black text-slate-900 flex items-center justify-center gap-1.5 my-1">
                  <TeacherAvatar teacherId={id} size="sm" withBorder={false} />
                  <span>{profile.nama}</span>
                </h4>

                {/* Explicit Audio Voice Preview Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onSelectTeacher(id);
                    sound.speakMalay(profile.ucapanMesra, profile.id);
                  }}
                  className={`mt-2.5 w-full py-1.5 px-2 rounded-xl text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-xs'
                      : 'bg-white hover:bg-amber-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Volume2 size={13} />
                  <span>Dengar Suara Cikgu</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
