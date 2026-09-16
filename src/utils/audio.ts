// Web Audio API engine for 100% offline child-friendly sound effects, gentle music, and Ukrainian voiceover

class AudioManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private musicStep = 0;
  public soundEnabled = true;
  public musicEnabled = true;
  public voiceEnabled = true;
  private ukrainianVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Try to find uk-UA voice
    this.ukrainianVoice = voices.find(v => v.lang.includes('uk') || v.lang.includes('UK')) || null;
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.15; // gentle background level
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.35;
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft bell/celesta note
  private playTone(freq: number, duration = 0.4, type: OscillatorType = 'sine', gainVal = 0.2) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context fallback
    }
  }

  // Cartoon Pop Sound (bubble popping / tapping button)
  playPop(pitchMultiplier = 1) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const startTime = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 * pitchMultiplier, startTime);
      osc.frequency.exponentialRampToValueAtTime(800 * pitchMultiplier, startTime + 0.08);
      
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);
      
      osc.start();
      osc.stop(startTime + 0.08);
    } catch {
      // ignore
    }
  }

  // Sparkle / Star collect sound
  playSparkle() {
    if (!this.soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'triangle', 0.2);
      }, idx * 60);
    });
  }

  // Fanfare for completed stage
  playFanfare() {
    if (!this.soundEnabled) return;
    const melody = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.2 },
      { f: 1046.5, d: 0.5 },
    ];
    let time = 0;
    melody.forEach(item => {
      setTimeout(() => {
        this.playTone(item.f, item.d, 'triangle', 0.3);
      }, time * 1000);
      time += item.d + 0.05;
    });
  }

  // Toothbrush scrub sound
  playBrush() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);
      noise.start();
    } catch {
      // ignore
    }
  }

  // Chewing sound (eating breakfast)
  playYum() {
    if (!this.soundEnabled) return;
    this.playTone(320, 0.12, 'sine', 0.25);
    setTimeout(() => this.playTone(380, 0.15, 'sine', 0.3), 120);
  }

  // Bus Horn ("Бі-біп!")
  playBusHorn() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const playBeep = (timeOffset: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc1.frequency.value = 330; // E4
        osc2.frequency.value = 415; // G#4

        const start = ctx.currentTime + timeOffset;
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain || ctx.destination);

        osc1.start(start);
        osc2.start(start);
        osc1.stop(start + 0.18);
        osc2.stop(start + 0.18);
      };

      playBeep(0);
      playBeep(0.22);
    } catch {
      // ignore
    }
  }

  // Scooter Bell ("Дзінь-дзінь!")
  playScooterBell() {
    if (!this.soundEnabled) return;
    this.playTone(1800, 0.25, 'sine', 0.25);
    setTimeout(() => {
      this.playTone(2100, 0.35, 'sine', 0.3);
    }, 120);
  }

  // Swing whoosh
  playWhoosh() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const start = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, start);
      osc.frequency.linearRampToValueAtTime(450, start + 0.25);
      osc.frequency.linearRampToValueAtTime(180, start + 0.5);

      gain.gain.setValueAtTime(0.05, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);
      osc.start(start);
      osc.stop(start + 0.5);
    } catch {
      // ignore
    }
  }

  // Sand digging sound
  playDig() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);
      noise.start();
    } catch {
      // ignore
    }
  }

  // Water splashing sound (wash face / bath / cocoa)
  playWaterSplash() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 0.22;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.2;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);
      noise.start();
      this.playTone(480, 0.1, 'sine', 0.15);
    } catch {
      // ignore
    }
  }

  // Food crunch / delicious bite
  playCrunch() {
    if (!this.soundEnabled) return;
    try {
      this.playTone(340, 0.08, 'triangle', 0.3);
      setTimeout(() => this.playTone(420, 0.1, 'sine', 0.25), 60);
      setTimeout(() => this.playTone(520, 0.12, 'sine', 0.2), 120);
    } catch {
      // ignore
    }
  }

  // Rubber duck quack
  playDuckQuack() {
    if (!this.soundEnabled) return;
    try {
      this.playTone(600, 0.15, 'triangle', 0.3);
      setTimeout(() => this.playTone(720, 0.12, 'sine', 0.25), 80);
    } catch {
      // ignore
    }
  }

  // Guinea pig Kavusia happy squeak ("wheep-wheep!")
  playGuineaPigSqueak() {
    if (!this.soundEnabled) return;
    try {
      this.playTone(880, 0.09, 'sine', 0.25);
      setTimeout(() => this.playTone(1180, 0.12, 'sine', 0.3), 70);
      setTimeout(() => this.playTone(1420, 0.15, 'sine', 0.35), 140);
    } catch {
      // ignore
    }
  }

  // Soft pet brush / petting stroke
  playPetBrush() {
    if (!this.soundEnabled) return;
    try {
      this.playTone(520, 0.08, 'sine', 0.15);
      setTimeout(() => this.playTone(620, 0.08, 'sine', 0.12), 50);
    } catch {
      // ignore
    }
  }

  // Chicken cluck & peck ("Ко-ко-ко!")
  playChickenCluck() {
    if (!this.soundEnabled) return;
    try {
      const clucks = [480, 560, 440, 520];
      clucks.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 0.08, 'triangle', 0.25);
        }, idx * 90);
      });
    } catch {
      // ignore
    }
  }

  // Cute cat meow & purr ("Няв-няв!" + муркотіння)
  playCatPurrMeow(catType: 'zhmenia' | 'ryan' | 'lapych' = 'zhmenia') {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch variation based on cat character
      const baseFreq = catType === 'zhmenia' ? 750 : catType === 'ryan' ? 620 : 540;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 0.85, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, now + 0.32);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain || ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      // Low purr vibration
      setTimeout(() => {
        if (!this.soundEnabled) return;
        const purrOsc = ctx.createOscillator();
        const purrGain = ctx.createGain();
        purrOsc.type = 'triangle';
        purrOsc.frequency.setValueAtTime(65, ctx.currentTime);
        purrGain.gain.setValueAtTime(0.12, ctx.currentTime);
        purrGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        purrOsc.connect(purrGain);
        purrGain.connect(this.sfxGain || ctx.destination);
        purrOsc.start(ctx.currentTime);
        purrOsc.stop(ctx.currentTime + 0.4);
      }, 150);
    } catch {
      // ignore
    }
  }

  // Water plants droplet trickle
  playWaterPlants() {
    if (!this.soundEnabled) return;
    const drops = [880, 1046, 1318, 987, 1174];
    drops.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.09, 'sine', 0.18);
      }, idx * 75);
    });
  }

  // Forest mushroom found / fairy bell
  playMushroomFound() {
    if (!this.soundEnabled) return;
    const notes = [659.25, 783.99, 1046.5, 1318.51, 1567.98];
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 0.2, 'triangle', 0.22);
      }, i * 70);
    });
  }

  // Juicy puddle stomp & splash ("Хлюп-хлюп! Плюсь!")
  playPuddleSplash() {
    if (!this.soundEnabled) return;
    try {
      this.playWaterSplash();
      setTimeout(() => {
        this.playTone(180, 0.14, 'sine', 0.35);
        this.playTone(320, 0.1, 'triangle', 0.25);
      }, 40);
    } catch {
      // ignore
    }
  }

  // Train whistle ("Ту-ту-у-у!")
  playTrainWhistle() {
    if (!this.soundEnabled) return;
    try {
      this.playTone(587.33, 0.45, 'sine', 0.28); // D5
      this.playTone(739.99, 0.45, 'sine', 0.25); // F#5
      setTimeout(() => {
        this.playTone(587.33, 0.6, 'sine', 0.3);
        this.playTone(739.99, 0.6, 'sine', 0.28);
      }, 200);
    } catch {
      // ignore
    }
  }

  // Train wheels chug ("Чух-чух, чух-чух!")
  playTrainChug() {
    if (!this.soundEnabled) return;
    try {
      this.playTone(180, 0.08, 'triangle', 0.25);
      setTimeout(() => this.playTone(140, 0.08, 'triangle', 0.22), 90);
      setTimeout(() => this.playTone(190, 0.08, 'triangle', 0.25), 180);
      setTimeout(() => this.playTone(150, 0.08, 'triangle', 0.22), 270);
    } catch {
      // ignore
    }
  }

  // Dog Knopka joyful bark ("Гав-гав!")
  playDogKnopkaBark() {
    if (!this.soundEnabled) return;
    try {
      this.playTone(620, 0.12, 'triangle', 0.3);
      setTimeout(() => this.playTone(520, 0.1, 'sine', 0.25), 50);
      setTimeout(() => {
        this.playTone(660, 0.14, 'triangle', 0.32);
        setTimeout(() => this.playTone(540, 0.1, 'sine', 0.25), 50);
      }, 140);
    } catch {
      // ignore
    }
  }

  playDogBark() {
    this.playDogKnopkaBark();
  }

  playCelebrationFanfare() {
    this.playFanfare();
    setTimeout(() => this.playSparkle(), 250);
  }

  playSuccess() {
    this.playSparkle();
  }

  // Ducklings chirping & quacking ("Кря-кря-кря!")
  playDucklings() {
    if (!this.soundEnabled) return;
    try {
      const quacks = [780, 880, 740, 840];
      quacks.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 0.07, 'triangle', 0.25);
        }, idx * 80);
      });
    } catch {
      // ignore
    }
  }

  // Water drinking gulp ("Буль-буль, смачно!")
  playWaterGulp() {
    if (!this.soundEnabled) return;
    try {
      const notes = [420, 480, 540, 600];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 0.08, 'sine', 0.28);
        }, i * 90);
      });
    } catch {
      // ignore
    }
  }

  // Ballet pirouette arpeggio
  playBalletPirouette() {
    if (!this.soundEnabled) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 0.12, 'sine', 0.25);
        }, i * 70);
      });
    } catch {
      // ignore
    }
  }

  // Dance beat rhythm
  playDanceBeat(type: 'waltz' | 'disco' | 'hiphop' | 'music_box' = 'disco') {
    if (!this.soundEnabled) return;
    try {
      if (type === 'waltz') {
        this.playTone(261.63, 0.15, 'triangle', 0.3);
        setTimeout(() => this.playTone(523.25, 0.1, 'sine', 0.2), 200);
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.2), 400);
      } else if (type === 'disco') {
        this.playTone(150, 0.08, 'sine', 0.4); // bass kick
        setTimeout(() => this.playTone(800, 0.05, 'triangle', 0.25), 120); // snare
        setTimeout(() => this.playTone(200, 0.08, 'sine', 0.35), 240);
        setTimeout(() => this.playTone(1200, 0.06, 'sine', 0.3), 360);
      } else if (type === 'music_box') {
        const bells = [659.25, 783.99, 987.77, 1318.51];
        bells.forEach((f, idx) => {
          setTimeout(() => this.playTone(f, 0.2, 'sine', 0.25), idx * 120);
        });
      } else {
        // hip-hop bouncy beat
        this.playTone(120, 0.12, 'triangle', 0.4);
        setTimeout(() => this.playTone(300, 0.06, 'sine', 0.3), 150);
        setTimeout(() => this.playTone(600, 0.08, 'sine', 0.3), 300);
      }
    } catch {
      // ignore
    }
  }

  // Big stage audience applause and cheer
  playApplauseCheer() {
    if (!this.soundEnabled) return;
    try {
      this.playFanfare();
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          this.playTone(400 + Math.random() * 800, 0.04, 'triangle', 0.15 + Math.random() * 0.1);
        }, i * 60);
      }
      setTimeout(() => this.playSparkle(), 400);
    } catch {
      // ignore
    }
  }

  // Stretching calming chime
  playStretchingChime() {
    if (!this.soundEnabled) return;
    try {
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.2), idx * 100);
      });
    } catch {
      // ignore
    }
  }

  // Fishing catch & splash
  playFishingCatch() {
    if (!this.soundEnabled) return;
    try {
      this.playWaterSplash();
      this.playSparkle();
      setTimeout(() => {
        this.playTone(987.77, 0.2, 'sine', 0.3);
        this.playTone(1318.51, 0.3, 'triangle', 0.3);
      }, 150);
    } catch {
      // ignore
    }
  }

  // Sweet candy shop chime
  playCandyChime() {
    if (!this.soundEnabled) return;
    const notes = [659.25, 880, 1046.5, 1318.51];
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 0.22, 'sine', 0.25);
      }, i * 65);
    });
  }

  // Chalk drawing scratch
  playChalkScratch() {
    if (!this.soundEnabled) return;
    try {
      this.playTone(1200, 0.06, 'triangle', 0.15);
      setTimeout(() => this.playTone(1450, 0.07, 'sine', 0.15), 50);
      setTimeout(() => this.playTone(1100, 0.05, 'triangle', 0.12), 100);
    } catch {
      // ignore
    }
  }

  // Roller skates glide
  playRollerSkate() {
    if (!this.soundEnabled) return;
    this.playWhoosh();
    this.playScooterBell();
  }

  // Xylophone note for Kindergarten
  playXylophone(noteIndex: number) {
    if (!this.soundEnabled) return;
    // C Major pentatonic scale
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    const freq = scale[noteIndex % scale.length];
    this.playTone(freq, 0.6, 'sine', 0.4);
    setTimeout(() => {
      this.playTone(freq * 2, 0.3, 'triangle', 0.15); // overtone
    }, 10);
  }

  // Background Nursery Melodic Music Loop (gentle, relaxing, cheerful)
  startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Cheerful lullaby / nursery chord progression (C - G - Am - F)
    // Notes in C major: C4, D4, E4, G4, A4, C5
    const notes = [
      261.63, 329.63, 392.00, 523.25, // C E G C
      392.00, 329.63, 293.66, 392.00, // G E D G
      440.00, 329.63, 440.00, 523.25, // A E A C
      349.23, 440.00, 523.25, 392.00, // F A C G
    ];

    const bassNotes = [
      130.81, 130.81, 98.00, 98.00,
      110.00, 110.00, 87.31, 87.31,
    ];

    this.musicInterval = window.setInterval(() => {
      if (!this.musicEnabled || !this.isMusicPlaying) return;
      try {
        const note = notes[this.musicStep % notes.length];
        const bass = bassNotes[Math.floor(this.musicStep / 2) % bassNotes.length];

        // Melody note (soft triangle celesta)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = note;
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.musicGain || ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);

        // Gentle soft bass note every 2 steps
        if (this.musicStep % 2 === 0) {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.value = bass;
          bassGain.gain.setValueAtTime(0.06, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          bassOsc.connect(bassGain);
          bassGain.connect(this.musicGain || ctx.destination);
          bassOsc.start(now);
          bassOsc.stop(now + 0.6);
        }

        this.musicStep++;
      } catch {
        // audio context handling
      }
    }, 450);
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.musicEnabled;
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.voiceEnabled;
  }

  // Ukrainian Speech Voiceover
  speakUkrainian(text: string, character: 'nicole' | 'mom' | 'narrator' = 'narrator') {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined') return;

    // Check if SpeechSynthesis is available
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Stop prior speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'uk-UA';

        if (this.ukrainianVoice) {
          utterance.voice = this.ukrainianVoice;
        }

        if (character === 'nicole') {
          // Nicole is 4 years old: cheerful, slightly higher pitch, slightly lively rate
          utterance.pitch = 1.35;
          utterance.rate = 1.05;
        } else if (character === 'mom') {
          // Mom: warm, gentle, calm
          utterance.pitch = 1.1;
          utterance.rate = 0.95;
        } else {
          // Friendly narrator
          utterance.pitch = 1.15;
          utterance.rate = 1.0;
        }

        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback to cartoon talk sound if TTS throws
        this.playCartoonChatter(character);
      }
    } else {
      this.playCartoonChatter(character);
    }
  }

  // Cute cartoon speech chatter fallback (like Animal Crossing/preschool games)
  playCartoonChatter(character: 'nicole' | 'mom' | 'narrator') {
    if (!this.soundEnabled) return;
    const baseFreq = character === 'nicole' ? 550 : character === 'mom' ? 380 : 440;
    const count = Math.min(6, 4 + Math.floor(Math.random() * 3));
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const f = baseFreq + (Math.random() * 120 - 60);
        this.playTone(f, 0.08, 'sine', 0.15);
      }, i * 70);
    }
  }
}

export const audio = new AudioManager();
