// Web Audio API Synthesizer for Hextech Game SFX

class HextechAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft metallic UI click
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  // Chest unlock build up sound (mystic ascending hum)
  public playChestCharging() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.8);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.8);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.85);
  }

  // Chest pop / unlock burst
  public playChestBurst() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Bass thud
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start();
    subOsc.stop(now + 0.4);

    // Crystal shimmer
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const crystalOsc = ctx.createOscillator();
      const crystalGain = ctx.createGain();
      crystalOsc.type = "triangle";
      crystalOsc.frequency.setValueAtTime(freq, now + i * 0.04);

      crystalGain.gain.setValueAtTime(0.08, now + i * 0.04);
      crystalGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + i * 0.04 + 0.3,
      );

      crystalOsc.connect(crystalGain);
      crystalGain.connect(ctx.destination);
      crystalOsc.start(now + i * 0.04);
      crystalOsc.stop(now + i * 0.04 + 0.35);
    });
  }

  // Card flip reveal
  public playCardReveal(rarity: string) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (rarity === "mythic" || rarity === "prestige") {
      // Golden celestial chord
      [440, 554.37, 659.25, 880, 1108.73].forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f, now + idx * 0.05);
        g.gain.setValueAtTime(0.12, now + idx * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.7);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + idx * 0.05);
        o.stop(now + idx * 0.05 + 0.75);
      });
    } else if (rarity === "legendary") {
      [330, 440, 554.37, 660].forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f, now + idx * 0.06);
        g.gain.setValueAtTime(0.1, now + idx * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.5);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + idx * 0.06);
        o.stop(now + idx * 0.06 + 0.55);
      });
    } else {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.2);
    }
  }

  // 1,000 Orange Gemstone Jackpot Fanfare!
  public playJackpot() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.65);
    });
  }
}

export const soundEngine = new HextechAudioEngine();
