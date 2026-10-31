/**
 * Audio feedback and Web Speech API synthesis for Bahasa Melayu
 * With Relaxing Nintendo Café BGM, Smooth Audio Ducking on Speech, and Button Click SFX
 */

const NINTENDO_CAFE_BGM_URL =
  '/assets/aistudio/Relaxing_Nintendo_Caf__Music_Vol_2___Studying__Chill__Jazz__Bossa_Nova__1__68c5c980.mp3';

/**
 * Audio Rakaman Suara Cikgu Freshcy yang Sebenar
 */
export const CIKGU_FRESHCY_AUDIOS = {
  // Latih Diri Intros
  arIntro: '/assets/aistudio/Anda_memilih_mod_AR_2f8f3cde.ogg',
  oralIntro: '/assets/aistudio/Anda_memilih_mod_mendengar_dan_bertutur_fde3eea4.ogg',
  writtenIntro: '/assets/aistudio/Sila_pilih_jawapan_yang_paling_d46dab97.ogg',

  // Latih Diri Soalan 1 - 5
  soalan1: '/assets/aistudio/Soalan_1_6af4b487.ogg',
  soalan2: '/assets/aistudio/Soalan_2_1c0d8977.ogg',
  soalan3: '/assets/aistudio/Soalan_3_4fa444a9.ogg',
  soalan4: '/assets/aistudio/Soalan_4_55514064.ogg',
  soalan5: '/assets/aistudio/Soalan_5_cdaaada7.ogg',

  // Dialog & Panduan Halaman
  welcome: '/assets/aistudio/HAI_SAYA_CIKGU_FRESHCY_0282d3b0.ogg',
  emotion: '/assets/aistudio/Hai_Cikgu_Nak_Tanya_6dd92a8f.ogg',
  symbols: '/assets/aistudio/Fahami_6_makna_simbol_ini_578d3b61.ogg',
  home: '/assets/aistudio/Sila_tekan_butang_pengenalan_684cc0a1.ogg',
  standard: '/assets/aistudio/Mari_kita_fahami_standard_8aac2a0a.ogg',
  sasaran: '/assets/aistudio/Sasaran_kita__kuasai_ayat_perintah_083ad221.ogg',
  learnMenu: '/assets/aistudio/Sila_pilih_bahagian_yang_ingin_anda_terokai_bersama_cikgu_Freshcy_207ed76d.ogg',
  quizMenu: '/assets/aistudio/Pilih_permainan_kegemaran_anda_dan_kumpul_sebanyak_mana_syiling_emas_77ef6ef4.ogg',
  kataLarangan: '/assets/aistudio/Kata_larangan_seperti_jangan_dan_usah_91b420e2.ogg'
};

class SoundController {
  private audioCtx: AudioContext | null = null;
  public enabled: boolean = true;
  public bgmEnabled: boolean = true;
  public sfxEnabled: boolean = true;
  private audioListeners: Set<(state: { bgmEnabled: boolean; sfxEnabled: boolean }) => void> = new Set();
  private bgmAudio: HTMLAudioElement | null = null;
  private currentClipAudio: HTMLAudioElement | null = null;
  private isBGMPlaying: boolean = false;
  private isSpeaking: boolean = false;
  private lastClickTimestamp: number = 0;
  private volumeRampTimer: number | null = null;

  // Normal and ducked volumes for Nintendo Cafe BGM
  private readonly NORMAL_BGM_VOLUME = 0.35;
  private readonly DUCKED_BGM_VOLUME = 0.08;

  public onAudioStateChange(fn: (state: { bgmEnabled: boolean; sfxEnabled: boolean }) => void): () => void {
    this.audioListeners.add(fn);
    return () => {
      this.audioListeners.delete(fn);
    };
  }

  private notifyAudioListeners() {
    this.audioListeners.forEach((fn) =>
      fn({ bgmEnabled: this.bgmEnabled, sfxEnabled: this.sfxEnabled })
    );
  }

  public toggleBGM(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    if (!this.bgmEnabled) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    this.notifyAudioListeners();
    return this.bgmEnabled;
  }

  public setBGMEnabled(val: boolean) {
    this.bgmEnabled = val;
    if (!this.bgmEnabled) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    this.notifyAudioListeners();
  }

  public toggleSFX(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    this.notifyAudioListeners();
    return this.sfxEnabled;
  }

  public setSFXEnabled(val: boolean) {
    this.sfxEnabled = val;
    this.notifyAudioListeners();
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Get or initialize HTMLAudioElement for Nintendo Café BGM
  private getBGMAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio(NINTENDO_CAFE_BGM_URL);
      this.bgmAudio.loop = true;
      this.bgmAudio.preload = 'auto';
      this.bgmAudio.volume = this.NORMAL_BGM_VOLUME;
      // Loop backup to ensure continuous playback across all browsers
      this.bgmAudio.addEventListener('ended', () => {
        if (this.enabled && this.isBGMPlaying && this.currentModule === 'default' && this.bgmAudio) {
          this.bgmAudio.currentTime = 0;
          this.bgmAudio.play().catch(() => {});
        }
      });
    }
    return this.bgmAudio;
  }

  // Current active BGM module: 'default' | 'frog' | 'mario' | 'treasure' | 'pacman'
  public currentModule: 'default' | 'frog' | 'mario' | 'treasure' | 'pacman' = 'default';
  private synthLoopTimer: number | null = null;
  private synthStep: number = 0;

  // Start background music based on current module
  startBGM() {
    this.playModuleBGM(this.currentModule);
  }

  // Set and play module-specific BGM
  playModuleBGM(module: 'default' | 'frog' | 'mario' | 'treasure' | 'pacman') {
    this.currentModule = module;
    if (!this.enabled || !this.bgmEnabled) {
      this.stopBGM();
      return;
    }

    // If default Nintendo Cafe BGM is already actively playing, keep it continuous
    if (
      module === 'default' &&
      this.currentModule === 'default' &&
      this.isBGMPlaying &&
      this.bgmAudio &&
      !this.bgmAudio.paused
    ) {
      return;
    }

    this.currentModule = module;

    // Stop existing audio element and synth loop
    this.stopSynthBGM();
    if (this.bgmAudio && module !== 'default') {
      this.bgmAudio.pause();
    }

    this.isBGMPlaying = true;

    if (module === 'default') {
      const audio = this.getBGMAudio();
      if (audio) {
        audio.volume = this.isSpeaking ? this.DUCKED_BGM_VOLUME : this.NORMAL_BGM_VOLUME;
        audio.play().catch(() => {});
      }
    } else if (module === 'mario') {
      this.startMarioBGM();
    } else if (module === 'frog') {
      this.startFrogBGM();
    } else if (module === 'treasure') {
      this.startTreasureBGM();
    } else if (module === 'pacman') {
      this.startPacmanBGM();
    }
  }

  // Stop all background music (both audio element and synthesized loops)
  stopBGM() {
    this.isBGMPlaying = false;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    this.stopSynthBGM();
  }

  private stopSynthBGM() {
    if (this.synthLoopTimer !== null) {
      clearInterval(this.synthLoopTimer);
      this.synthLoopTimer = null;
    }
    this.synthStep = 0;
  }

  // 1. Super Mario Bros 8-Bit Chiptune Overworld Theme Synthesizer
  private startMarioBGM() {
    this.stopSynthBGM();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Authentic Super Mario Overworld Theme sequence [freq, duration, type, isBass]
    // Tempo ~ 150ms per 16th note
    const marioNotes: Array<{ f: number; d: number; b?: number }> = [
      // Intro phrase: E5, E5, rest, E5, rest, C5, E5, rest, G5, rest, G4
      { f: 659.25, d: 0.12, b: 164.81 }, // E5
      { f: 659.25, d: 0.12, b: 164.81 }, // E5
      { f: 0, d: 0.12 },
      { f: 659.25, d: 0.12, b: 164.81 }, // E5
      { f: 0, d: 0.12 },
      { f: 523.25, d: 0.12, b: 130.81 }, // C5
      { f: 659.25, d: 0.18, b: 164.81 }, // E5
      { f: 0, d: 0.12 },
      { f: 783.99, d: 0.24, b: 196.00 }, // G5
      { f: 0, d: 0.24 },
      { f: 392.00, d: 0.26, b: 98.00 },  // G4 (low)
      { f: 0, d: 0.28 },

      // Main Loop Motif A: C5, rest, G4, rest, E4, rest, A4, B4, Bb4, A4
      { f: 523.25, d: 0.16, b: 130.81 }, // C5
      { f: 0, d: 0.12 },
      { f: 392.00, d: 0.16, b: 98.00 },  // G4
      { f: 0, d: 0.12 },
      { f: 329.63, d: 0.16, b: 82.41 },  // E4
      { f: 0, d: 0.12 },
      { f: 440.00, d: 0.15, b: 110.00 }, // A4
      { f: 493.88, d: 0.15, b: 123.47 }, // B4
      { f: 466.16, d: 0.14, b: 116.54 }, // Bb4
      { f: 440.00, d: 0.18, b: 110.00 }, // A4
      { f: 392.00, d: 0.16, b: 98.00 },  // G4
      { f: 659.25, d: 0.18, b: 164.81 }, // E5
      { f: 783.99, d: 0.18, b: 196.00 }, // G5
      { f: 880.00, d: 0.22, b: 220.00 }, // A5
      { f: 698.46, d: 0.15, b: 174.61 }, // F5
      { f: 783.99, d: 0.16, b: 196.00 }, // G5
      { f: 659.25, d: 0.18, b: 164.81 }, // E5
      { f: 523.25, d: 0.15, b: 130.81 }, // C5
      { f: 587.33, d: 0.15, b: 146.83 }, // D5
      { f: 493.88, d: 0.24, b: 123.47 }, // B4
      { f: 0, d: 0.24 }
    ];

    let noteIdx = 0;
    const tickTime = 160; // ms

    this.synthLoopTimer = window.setInterval(() => {
      if (!this.enabled || !this.isBGMPlaying || this.currentModule !== 'mario') return;
      const cur = marioNotes[noteIdx];
      noteIdx = (noteIdx + 1) % marioNotes.length;

      if (cur.f > 0) {
        const vol = this.isSpeaking ? 0.02 : 0.08;
        // Melody (Square wave chiptune)
        this.playCustomTone(cur.f, 'square', cur.d, vol);
        // Bassline
        if (cur.b) {
          this.playCustomTone(cur.b, 'triangle', cur.d + 0.02, vol * 0.9);
        }
      }
    }, tickTime);
  }

  // 2. Jom Selamatkan Si Katak Playful Bouncy Pond Melody
  private startFrogBGM() {
    this.stopSynthBGM();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Cheerful, bouncy pond-hopping melody with marimba tones & syncopated bass
    const frogNotes: Array<{ f: number; d: number; b?: number }> = [
      { f: 523.25, d: 0.14, b: 130.81 }, // C5
      { f: 659.25, d: 0.14, b: 130.81 }, // E5
      { f: 783.99, d: 0.16, b: 196.00 }, // G5
      { f: 880.00, d: 0.20, b: 220.00 }, // A5
      { f: 0, d: 0.12 },
      { f: 783.99, d: 0.14, b: 196.00 }, // G5
      { f: 659.25, d: 0.16, b: 164.81 }, // E5
      { f: 523.25, d: 0.22, b: 130.81 }, // C5
      { f: 0, d: 0.14 },
      { f: 587.33, d: 0.14, b: 146.83 }, // D5
      { f: 698.46, d: 0.14, b: 174.61 }, // F5
      { f: 783.99, d: 0.18, b: 196.00 }, // G5
      { f: 880.00, d: 0.16, b: 220.00 }, // A5
      { f: 987.77, d: 0.24, b: 246.94 }, // B5
      { f: 1046.50, d: 0.26, b: 261.63 }, // C6
      { f: 0, d: 0.20 }
    ];

    let noteIdx = 0;
    const tickTime = 180; // ms

    this.synthLoopTimer = window.setInterval(() => {
      if (!this.enabled || !this.isBGMPlaying || this.currentModule !== 'frog') return;
      const cur = frogNotes[noteIdx];
      noteIdx = (noteIdx + 1) % frogNotes.length;

      if (cur.f > 0) {
        const vol = this.isSpeaking ? 0.02 : 0.07;
        // Marimba-like sine/triangle
        this.playCustomTone(cur.f, 'triangle', cur.d, vol);
        if (cur.b) {
          this.playCustomTone(cur.b, 'sine', cur.d + 0.04, vol * 1.1);
        }
      }
    }, tickTime);
  }

  // 3. Permainan Harta Karun Swashbuckling Pirate Sea Shanty 6/8 Melody
  private startTreasureBGM() {
    this.stopSynthBGM();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Sea shanty accordion / trumpet pirate rhythm in 6/8 (D minor adventure)
    const pirateNotes: Array<{ f: number; d: number; b?: number }> = [
      { f: 293.66, d: 0.22, b: 146.83 }, // D4
      { f: 349.23, d: 0.20, b: 174.61 }, // F4
      { f: 440.00, d: 0.26, b: 220.00 }, // A4
      { f: 523.25, d: 0.20, b: 220.00 }, // C5
      { f: 440.00, d: 0.24, b: 146.83 }, // A4
      { f: 0, d: 0.12 },
      { f: 392.00, d: 0.20, b: 196.00 }, // G4
      { f: 440.00, d: 0.20, b: 220.00 }, // A4
      { f: 349.23, d: 0.28, b: 174.61 }, // F4
      { f: 293.66, d: 0.32, b: 146.83 }, // D4
      { f: 0, d: 0.16 },
      { f: 329.63, d: 0.22, b: 164.81 }, // E4
      { f: 349.23, d: 0.22, b: 174.61 }, // F4
      { f: 392.00, d: 0.26, b: 196.00 }, // G4
      { f: 440.00, d: 0.32, b: 220.00 }, // A4
      { f: 0, d: 0.22 }
    ];

    let noteIdx = 0;
    const tickTime = 220; // ms

    this.synthLoopTimer = window.setInterval(() => {
      if (!this.enabled || !this.isBGMPlaying || this.currentModule !== 'treasure') return;
      const cur = pirateNotes[noteIdx];
      noteIdx = (noteIdx + 1) % pirateNotes.length;

      if (cur.f > 0) {
        const vol = this.isSpeaking ? 0.02 : 0.075;
        // Sawtooth with low-pass / brass accordion resonance
        this.playCustomTone(cur.f, 'sawtooth', cur.d, vol * 0.85);
        if (cur.b) {
          this.playCustomTone(cur.b, 'triangle', cur.d + 0.05, vol);
        }
      }
    }, tickTime);
  }

  // 4. Retro Arcade Pac-Man Chiptune Theme Synthesizer
  private startPacmanBGM() {
    this.stopSynthBGM();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Iconic Pac-Man Theme intro & waka rhythm
    const pacmanNotes: Array<{ f: number; d: number; b?: number }> = [
      { f: 493.88, d: 0.12, b: 123.47 }, // B4
      { f: 987.77, d: 0.12, b: 123.47 }, // B5
      { f: 739.99, d: 0.12, b: 92.50 },  // F#5
      { f: 622.25, d: 0.12, b: 92.50 },  // D#5
      { f: 987.77, d: 0.12, b: 123.47 }, // B5
      { f: 739.99, d: 0.14, b: 92.50 },  // F#5
      { f: 622.25, d: 0.18, b: 92.50 },  // D#5
      { f: 0, d: 0.10 },
      { f: 523.25, d: 0.12, b: 130.81 }, // C5
      { f: 1046.50, d: 0.12, b: 130.81 },// C6
      { f: 783.99, d: 0.12, b: 98.00 },  // G5
      { f: 659.25, d: 0.12, b: 98.00 },  // E5
      { f: 1046.50, d: 0.12, b: 130.81 },// C6
      { f: 783.99, d: 0.14, b: 98.00 },  // G5
      { f: 659.25, d: 0.18, b: 98.00 },  // E5
      { f: 0, d: 0.12 }
    ];

    let noteIdx = 0;
    const tickTime = 150;

    this.synthLoopTimer = window.setInterval(() => {
      if (!this.enabled || !this.isBGMPlaying || this.currentModule !== 'pacman') return;
      const cur = pacmanNotes[noteIdx];
      noteIdx = (noteIdx + 1) % pacmanNotes.length;

      if (cur.f > 0) {
        const vol = this.isSpeaking ? 0.02 : 0.07;
        this.playCustomTone(cur.f, 'triangle', cur.d, vol);
        if (cur.b) {
          this.playCustomTone(cur.b, 'square', cur.d + 0.03, vol * 0.7);
        }
      }
    }, tickTime);
  }

  // Helper for custom tone with custom volume
  private playCustomTone(freq: number, type: OscillatorType, duration: number, volume = 0.08) {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked
    }
  }

  // Smoothly ramp BGM volume up or down for audio ducking
  private rampBGMVolume(targetVol: number, durationMs = 280) {
    const audio = this.getBGMAudio();
    if (!audio) return;

    if (this.volumeRampTimer !== null) {
      clearInterval(this.volumeRampTimer);
      this.volumeRampTimer = null;
    }

    const startVol = audio.volume;
    const diff = targetVol - startVol;
    const steps = 14;
    const stepDuration = durationMs / steps;
    let stepCount = 0;

    this.volumeRampTimer = window.setInterval(() => {
      stepCount++;
      if (!this.bgmAudio) {
        if (this.volumeRampTimer) clearInterval(this.volumeRampTimer);
        return;
      }
      const progress = stepCount / steps;
      this.bgmAudio.volume = Math.max(0, Math.min(1, startVol + diff * progress));

      if (stepCount >= steps) {
        if (this.volumeRampTimer) clearInterval(this.volumeRampTimer);
        this.volumeRampTimer = null;
        this.bgmAudio.volume = targetVol;
      }
    }, stepDuration);
  }

  // Audio Ducking: Soften background music while voice audio is speaking
  duckBGM() {
    this.isSpeaking = true;
    this.rampBGMVolume(this.DUCKED_BGM_VOLUME, 200);
  }

  // Unduck: Smoothly restore background music volume after voice finishes
  unduckBGM() {
    this.isSpeaking = false;
    if (this.enabled && this.isBGMPlaying) {
      this.rampBGMVolume(this.NORMAL_BGM_VOLUME, 450);
    }
  }

  // Play synthetic tone
  playTone(freq: number, type: OscillatorType, duration: number, delay = 0) {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      }, delay);
    } catch {
      // Audio might be blocked until user gesture
    }
  }

  // Happy success sound
  playSuccess() {
    this.playTone(523.25, 'triangle', 0.15, 0);   // C5
    this.playTone(659.25, 'triangle', 0.15, 100); // E5
    this.playTone(783.99, 'triangle', 0.15, 200); // G5
    this.playTone(1046.50, 'sine', 0.35, 300);   // C6
  }

  // Coin collected chime
  playCoin() {
    this.playTone(987.77, 'sine', 0.1, 0);    // B5
    this.playTone(1318.51, 'triangle', 0.25, 80); // E6
  }

  // Frog jumping spring sound
  playFrogHop() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Realistic water splash when frog drops into river
  playWaterSplash() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Water impact "plop" (pitch drop)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);

      // 2. White noise splash spray
      const bufferSize = Math.floor(ctx.sampleRate * 0.4);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(2, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.4);
    } catch {}
  }

  // Try again / error sound (descending resonant quiz buzzer / womp-womp)
  playWrong() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: First descending "womp" (220Hz -> 170Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(600, now);

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.exponentialRampToValueAtTime(170, now + 0.18);

      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.18);

      // Note 2: Second lower descending "womp" (165Hz -> 115Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(500, now + 0.2);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(165, now + 0.2);
      osc2.frequency.exponentialRampToValueAtTime(115, now + 0.45);

      gain2.gain.setValueAtTime(0.22, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.2);
      osc2.stop(now + 0.45);
    } catch {
      // Audio might be blocked until user gesture
    }
  }

  // Realistic Crowd Applause & cheering hand claps sound effect
  playApplause() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const duration = 1.6;

      // 1. Triumphant musical chord flourish
      this.playTone(523.25, 'triangle', 0.25, 0);   // C5
      this.playTone(659.25, 'triangle', 0.3, 100);  // E5
      this.playTone(783.99, 'triangle', 0.35, 200); // G5
      this.playTone(1046.50, 'sine', 0.5, 300);    // C6

      // 2. Realistic white-noise burst hand claps (dense randomized cluster)
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      // Generate ~35 randomized overlapping clap bursts
      for (let c = 0; c < 35; c++) {
        const clapTime = now + 0.15 + (Math.random() * 1.3);
        const clapSource = ctx.createBufferSource();
        clapSource.buffer = noiseBuffer;

        // Bandpass filter centered around 1100Hz - 1600Hz (acoustics of hands clapping)
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100 + Math.random() * 500, clapTime);
        filter.Q.setValueAtTime(2.2, clapTime);

        // Quick exponential clap envelope (0.045s decay)
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, clapTime);
        gain.gain.exponentialRampToValueAtTime(0.22 + Math.random() * 0.12, clapTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.045);

        clapSource.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        clapSource.start(clapTime);
        clapSource.stop(clapTime + 0.05);
      }
    } catch {
      // Audio might be blocked until user gesture
    }
  }

  // Click / tap bubble sound for every button with debounce protection
  playClick() {
    const now = Date.now();
    // 50ms debounce to prevent double-sounding if an element has both universal and local trigger
    if (now - this.lastClickTimestamp < 50) return;
    this.lastClickTimestamp = now;

    if (this.enabled && this.sfxEnabled) {
      this.playTone(620, 'sine', 0.08, 0);
    }

    // If default BGM is active and unpaused, make sure it plays upon user gesture
    if (this.currentModule === 'default' && this.enabled && this.bgmEnabled) {
      const bgm = this.getBGMAudio();
      if (bgm && bgm.paused) {
        bgm.volume = this.isSpeaking ? this.DUCKED_BGM_VOLUME : this.NORMAL_BGM_VOLUME;
        bgm.play().catch(() => {});
        this.isBGMPlaying = true;
      }
    }
  }

  // Jump spring sound for platformer
  playJump() {
    this.playTone(330, 'square', 0.08, 0);
    this.playTone(493.88, 'sine', 0.15, 50);
  }

  // Pacman waka-waka chomp sound
  playChomp() {
    this.playTone(280, 'triangle', 0.05, 0);
    this.playTone(340, 'sine', 0.05, 50);
  }

  // Ghost eaten / power bonus
  playEatGhost() {
    this.playTone(440, 'triangle', 0.1, 0);
    this.playTone(554.37, 'sine', 0.1, 70);
    this.playTone(659.25, 'triangle', 0.15, 140);
    this.playTone(880, 'sine', 0.25, 210);
  }

  // Fanfare for level complete or badge earned
  playFanfare() {
    this.playTone(523.25, 'triangle', 0.2, 0);
    this.playTone(523.25, 'triangle', 0.2, 180);
    this.playTone(523.25, 'triangle', 0.2, 360);
    this.playTone(659.25, 'triangle', 0.4, 540);
    this.playTone(783.99, 'sine', 0.6, 750);
  }

  // Humanize and normalize Malay text for accurate Malaysian Malay Baku pronunciation & natural intonation
  humanizeMalayText(raw: string): string {
    if (!raw) return '';
    let text = raw;

    // Expand educational abbreviations to natural spoken Malay
    text = text.replace(/\bPdP\b/gi, 'Pengajaran dan Pembelajaran');
    text = text.replace(/\bPBS\b/gi, 'Pentaksiran Berasaskan Sekolah');
    text = text.replace(/\bAR\b/g, 'A.R.');
    text = text.replace(/\bBM\b/g, 'Bahasa Melayu');
    text = text.replace(/\bSK\b/g, 'Sekolah Kebangsaan');
    text = text.replace(/\bDSKP\b/gi, 'Dokumen Standard Kurikulum');
    text = text.replace(/\bTP\s*(\d)\b/gi, 'Tahap Penguasaan $1');
    text = text.replace(/\bSP\s*(\d)/gi, 'Standard Pembelajaran $1');

    // Natural pacing pauses for punctuation & questions
    text = text.replace(/Soalan\s*(\d+)[:.]/gi, 'Soalan $1... ');
    text = text.replace(/[“”"']/g, ' '); // remove confusing quote clicks
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  // Active speaking listeners for character animations
  private speechListeners: Set<(isSpeaking: boolean) => void> = new Set();

  onSpeechStateChange(listener: (isSpeaking: boolean) => void) {
    this.speechListeners.add(listener);
    return () => this.speechListeners.delete(listener);
  }

  private notifySpeechState(speaking: boolean) {
    this.isSpeaking = speaking;
    this.speechListeners.forEach((fn) => fn(speaking));
  }

  // Helper to match text to Cikgu Freshcy audio files
  public getFreshcyAudioForText(text: string): string | null {
    if (!text) return null;
    const t = text.toLowerCase();
    if (t.includes('memilih mod ar') || (t.includes('mod ar') && t.includes('emoji'))) {
      return CIKGU_FRESHCY_AUDIOS.arIntro;
    }
    if (
      t.includes('mod mendengar dan bertutur') ||
      t.includes('mod lisan') ||
      (t.includes('mendengar') && t.includes('bertutur'))
    ) {
      return CIKGU_FRESHCY_AUDIOS.oralIntro;
    }
    if (t.includes('paling tepat bagi setiap soalan') || t.includes('paling tepat')) {
      return CIKGU_FRESHCY_AUDIOS.writtenIntro;
    }
    if (t.includes('soalan 1') || t.includes('soalan satu')) {
      return CIKGU_FRESHCY_AUDIOS.soalan1;
    }
    if (t.includes('soalan 2') || t.includes('soalan dua')) {
      return CIKGU_FRESHCY_AUDIOS.soalan2;
    }
    if (t.includes('soalan 3') || t.includes('soalan tiga')) {
      return CIKGU_FRESHCY_AUDIOS.soalan3;
    }
    if (t.includes('soalan 4') || t.includes('soalan empat')) {
      return CIKGU_FRESHCY_AUDIOS.soalan4;
    }
    if (t.includes('soalan 5') || t.includes('soalan lima')) {
      return CIKGU_FRESHCY_AUDIOS.soalan5;
    }
    if (
      t.includes('saya cikgu freshcy') ||
      t.includes('jom belajar ayat perintah bersama cikgu')
    ) {
      return CIKGU_FRESHCY_AUDIOS.welcome;
    }
    if (
      t.includes('bagaimana perasaan kamu hari ini') ||
      t.includes('perasaan kamu hari ini')
    ) {
      return CIKGU_FRESHCY_AUDIOS.emotion;
    }
    if (
      t.includes('makna 6 simbol') ||
      t.includes('makna enam simbol') ||
      t.includes('makna simbol')
    ) {
      return CIKGU_FRESHCY_AUDIOS.symbols;
    }
    if (
      t.includes('butang pengenalan') ||
      t.includes('jom belajar atau kuiz')
    ) {
      return CIKGU_FRESHCY_AUDIOS.home;
    }
    if (
      t.includes('standard kandungan') &&
      (t.includes('5.3.2') || t.includes('hari ini'))
    ) {
      return CIKGU_FRESHCY_AUDIOS.standard;
    }
    if (
      t.includes('sasaran kita') ||
      t.includes('kuasai 4 jenis') ||
      t.includes('kuasai empat jenis')
    ) {
      return CIKGU_FRESHCY_AUDIOS.sasaran;
    }
    if (t.includes('bahagian yang ingin anda terokai')) {
      return CIKGU_FRESHCY_AUDIOS.learnMenu;
    }
    if (
      t.includes('pilih permainan kegemaran') ||
      t.includes('syiling emas')
    ) {
      return CIKGU_FRESHCY_AUDIOS.quizMenu;
    }
    if (
      t.includes('kata larangan seperti jangan dan usah') ||
      (t.includes('kata larangan') && t.includes('menegah'))
    ) {
      return CIKGU_FRESHCY_AUDIOS.kataLarangan;
    }
    return null;
  }

  // Play an exact recorded audio clip (with audio ducking and speech state notification)
  public playAudioClip(url: string, onEnd?: () => void): HTMLAudioElement | null {
    if (!this.enabled || typeof window === 'undefined') return null;

    this.stopSpeech();

    try {
      this.duckBGM();
      this.notifySpeechState(true);

      const audio = new Audio(url);
      this.currentClipAudio = audio;
      audio.preload = 'auto';

      audio.onended = () => {
        this.unduckBGM();
        this.notifySpeechState(false);
        this.currentClipAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        this.unduckBGM();
        this.notifySpeechState(false);
        this.currentClipAudio = null;
      };

      audio.play().catch(() => {
        this.unduckBGM();
        this.notifySpeechState(false);
        this.currentClipAudio = null;
      });

      return audio;
    } catch {
      this.unduckBGM();
      this.notifySpeechState(false);
      return null;
    }
  }

  public stopAudioClip() {
    if (this.currentClipAudio) {
      this.currentClipAudio.pause();
      this.currentClipAudio = null;
    }
  }

  // Text-to-Speech in Bahasa Melayu Malaysia Baku with humanized intonation & teacher personas
  speakMalay(
    text: string,
    persona: 'syafiqah' | 'aaron' | 'freshcy' | 'neutral' = 'syafiqah',
    onEnd?: () => void
  ) {
    if (!this.enabled || typeof window === 'undefined') return;

    // Check if Cikgu Freshcy has an authentic human audio recording for this sentence
    if (persona === 'freshcy') {
      const clip = this.getFreshcyAudioForText(text);
      if (clip) {
        this.playAudioClip(clip, onEnd);
        return;
      }
    }

    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      this.stopAudioClip();

      const humanized = this.humanizeMalayText(text);
      const utterance = new SpeechSynthesisUtterance(humanized);

      // Personas with distinct, warm Malaysian teacher intonations
      if (persona === 'aaron') {
        utterance.rate = 0.90; // Natural, articulate, authoritative yet friendly
        utterance.pitch = 0.96; // Warm baritone male tone
      } else if (persona === 'freshcy') {
        utterance.rate = 0.92; // Cheerful, energetic, vibrant teacher
        utterance.pitch = 1.14; // Bright, lively intonation
      } else if (persona === 'syafiqah') {
        utterance.rate = 0.88; // Gentle, motherly, nurturing cadence
        utterance.pitch = 1.08; // Warm, sweet feminine intonation
      } else {
        utterance.rate = 0.90;
        utterance.pitch = 1.05;
      }

      // Perlahankan background music semasa audio bercakap supaya suara jelas
      this.duckBGM();
      this.notifySpeechState(true);

      utterance.onend = () => {
        this.unduckBGM();
        this.notifySpeechState(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.unduckBGM();
        this.notifySpeechState(false);
      };

      // Find Malaysian Malay voice (Priority 1: exact ms-MY, Priority 2: any ms, Priority 3: id fallback)
      const voices = window.speechSynthesis.getVoices();
      
      let msVoice = voices.find(
        (v) =>
          (v.lang === 'ms-MY' || v.lang === 'ms_MY') &&
          (v.name.toLowerCase().includes('malaysia') ||
            v.name.toLowerCase().includes('melayu') ||
            v.name.toLowerCase().includes('yasmin') ||
            v.name.toLowerCase().includes('fatihah'))
      );

      if (!msVoice) {
        msVoice = voices.find(
          (v) => v.lang.replace('_', '-').toLowerCase().startsWith('ms-my') || v.lang.startsWith('ms')
        );
      }

      if (!msVoice) {
        // Fallback only if no ms voice is installed on client device
        msVoice = voices.find((v) => v.lang.startsWith('id'));
      }

      if (msVoice) {
        utterance.voice = msVoice;
      }
      utterance.lang = 'ms-MY';
      window.speechSynthesis.speak(utterance);
    } catch {
      this.unduckBGM();
      this.notifySpeechState(false);
    }
  }

  stopSpeech() {
    this.stopAudioClip();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.unduckBGM();
    this.notifySpeechState(false);
  }
}

export const sound = new SoundController();
