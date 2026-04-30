import { Component, EventEmitter, OnInit, Output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TimerMode } from '../../models/time-entry.model';
import { TimerService } from '../../services/timer.service';
import { TimeEntryService } from '../../services/time-entry.service';
import { ProjectService } from '../../services/project.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
})
export class TimerComponent implements OnInit {
  @Output() openSettings = new EventEmitter<void>();

  readonly circumference = 2 * Math.PI * 120;

  currentDescription = '';
  currentProjectId = '';
  justCompleted = false;

  readonly modeLabels: Record<TimerMode, string> = {
    'pomodoro': 'Pomodoro',
    'short-break': 'Short Break',
    'long-break': 'Long Break',
  };

  constructor(
    public timer: TimerService,
    public entryService: TimeEntryService,
    public projectService: ProjectService,
    private audio: AudioService,
  ) {
    timer.completion$.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event.mode === 'pomodoro') {
        entryService.add({
          description: this.currentDescription.trim() || 'Pomodoro session',
          projectId: this.currentProjectId || null,
          startTime: event.startTime.toISOString(),
          endTime: event.endTime.toISOString(),
          duration: event.duration,
          type: 'pomodoro',
        });
        this.showCompletedFlash();
      }
      if (timer.settings().soundEnabled) {
        audio.playComplete();
      }
    });

    effect(() => {
      const time = timer.timeRemaining();
      const state = timer.state();
      if (state === 'running' || state === 'paused') {
        const m = Math.floor(time / 60).toString().padStart(2, '0');
        const s = (time % 60).toString().padStart(2, '0');
        document.title = `${m}:${s} · Pomodoro`;
      } else {
        document.title = 'Pomodoro Focus';
      }
    });
  }

  ngOnInit(): void {}

  get dashOffset(): number {
    return this.circumference * this.timer.progress();
  }

  get formattedTime(): string {
    const t = this.timer.timeRemaining();
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = (t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  get modeLabel(): string {
    return this.modeLabels[this.timer.mode()];
  }

  get selectedProjectColor(): string {
    return this.projectService.getById(this.currentProjectId)?.color ?? '#CBD5E1';
  }

  get pomodorosUntilLongBreak(): number {
    const interval = this.timer.settings().longBreakInterval;
    const done = this.timer.completedPomodoros();
    return interval - (done % interval);
  }

  setMode(mode: TimerMode): void {
    this.timer.setMode(mode);
  }

  toggleStartPause(): void {
    const state = this.timer.state();
    if (state === 'running') {
      this.timer.pause();
    } else if (state === 'completed') {
      const next = this.timer.mode() === 'pomodoro' ? 'short-break' : 'pomodoro';
      this.timer.setMode(next as TimerMode);
    } else {
      this.timer.start();
    }
  }

  reset(): void {
    this.timer.reset();
  }

  formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  private showCompletedFlash(): void {
    this.justCompleted = true;
    setTimeout(() => (this.justCompleted = false), 2500);
  }
}
