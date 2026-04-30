import { Injectable, computed, signal } from '@angular/core';
import { Subject, Subscription, interval } from 'rxjs';
import { TimerMode } from '../models/time-entry.model';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerSettings {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

export interface CompletionEvent {
  mode: TimerMode;
  startTime: Date;
  endTime: Date;
  duration: number;
}

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
};

@Injectable({ providedIn: 'root' })
export class TimerService {
  private readonly _mode = signal<TimerMode>('pomodoro');
  private readonly _state = signal<TimerState>('idle');
  private readonly _timeRemaining = signal<number>(DEFAULT_SETTINGS.pomodoroDuration * 60);
  private readonly _completedPomodoros = signal<number>(0);
  private readonly _settings = signal<TimerSettings>(this.loadSettings());
  private _sessionStart: Date | null = null;
  private _sub: Subscription | null = null;

  readonly mode = this._mode.asReadonly();
  readonly state = this._state.asReadonly();
  readonly timeRemaining = this._timeRemaining.asReadonly();
  readonly completedPomodoros = this._completedPomodoros.asReadonly();
  readonly settings = this._settings.asReadonly();

  readonly totalDuration = computed(() => this.getDuration(this._mode()) * 60);
  readonly progress = computed(() => {
    const total = this.totalDuration();
    return total > 0 ? 1 - this._timeRemaining() / total : 0;
  });

  private readonly _complete$ = new Subject<CompletionEvent>();
  readonly completion$ = this._complete$.asObservable();

  start(): void {
    if (this._state() === 'running') return;
    if (!this._sessionStart) this._sessionStart = new Date();
    this._state.set('running');
    this._sub = interval(1000).subscribe(() => {
      const next = this._timeRemaining() - 1;
      if (next <= 0) {
        this._timeRemaining.set(0);
        this.onComplete();
      } else {
        this._timeRemaining.set(next);
      }
    });
  }

  pause(): void {
    if (this._state() !== 'running') return;
    this._state.set('paused');
    this._sub?.unsubscribe();
    this._sub = null;
  }

  reset(): void {
    this._sub?.unsubscribe();
    this._sub = null;
    this._sessionStart = null;
    this._state.set('idle');
    this._timeRemaining.set(this.getDuration(this._mode()) * 60);
  }

  setMode(mode: TimerMode): void {
    this.reset();
    this._mode.set(mode);
    this._timeRemaining.set(this.getDuration(mode) * 60);
  }

  updateSettings(s: TimerSettings): void {
    this._settings.set(s);
    localStorage.setItem('pomo-settings', JSON.stringify(s));
    if (this._state() === 'idle') {
      this._timeRemaining.set(this.getDuration(this._mode()) * 60);
    }
  }

  getSessionStart(): Date | null {
    return this._sessionStart;
  }

  private onComplete(): void {
    this._sub?.unsubscribe();
    this._sub = null;
    const endTime = new Date();
    const startTime = this._sessionStart ?? endTime;
    this._sessionStart = null;

    if (this._mode() === 'pomodoro') {
      this._completedPomodoros.update(n => n + 1);
    }

    this._state.set('completed');
    this._complete$.next({
      mode: this._mode(),
      startTime,
      endTime,
      duration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
    });

    const s = this._settings();
    if (this._mode() === 'pomodoro' && s.autoStartBreaks) {
      const next = this.getNextBreakMode();
      setTimeout(() => { this.setMode(next); this.start(); }, 800);
    } else if (this._mode() !== 'pomodoro' && s.autoStartPomodoros) {
      setTimeout(() => { this.setMode('pomodoro'); this.start(); }, 800);
    }
  }

  private getNextBreakMode(): TimerMode {
    const count = this._completedPomodoros();
    return count % this._settings().longBreakInterval === 0 ? 'long-break' : 'short-break';
  }

  getDuration(mode: TimerMode): number {
    const s = this._settings();
    if (mode === 'pomodoro') return s.pomodoroDuration;
    if (mode === 'short-break') return s.shortBreakDuration;
    return s.longBreakDuration;
  }

  private loadSettings(): TimerSettings {
    try {
      const stored = localStorage.getItem('pomo-settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
}
