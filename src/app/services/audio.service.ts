import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private ctx: AudioContext | null = null;

  playComplete(): void {
    try {
      const ctx = this.getCtx();
      this.tone(ctx, 880, 0.0, 0.5, 'sine', 0.35);
      this.tone(ctx, 1109, 0.18, 0.4, 'sine', 0.30);
      this.tone(ctx, 1320, 0.42, 0.6, 'sine', 0.25);
    } catch { /* audio not available */ }
  }

  playTick(): void {
    try {
      const ctx = this.getCtx();
      this.tone(ctx, 600, 0, 0.04, 'square', 0.08);
    } catch { /* audio not available */ }
  }

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  private tone(
    ctx: AudioContext,
    freq: number,
    offset: number,
    duration: number,
    type: OscillatorType,
    volume: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    const t = ctx.currentTime + offset;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration);
  }
}
