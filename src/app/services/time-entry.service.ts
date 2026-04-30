import { Injectable, computed, signal } from '@angular/core';
import { TimeEntry } from '../models/time-entry.model';

export interface DayGroup {
  key: string;
  label: string;
  date: Date;
  entries: TimeEntry[];
  totalSeconds: number;
  pomodoroCount: number;
}

@Injectable({ providedIn: 'root' })
export class TimeEntryService {
  private readonly _entries = signal<TimeEntry[]>(this.load());

  readonly entries = this._entries.asReadonly();

  readonly groupedByDay = computed<DayGroup[]>(() => {
    const sorted = [...this._entries()].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

    const map = new Map<string, DayGroup>();
    for (const entry of sorted) {
      const date = new Date(entry.startTime);
      const key = date.toDateString();
      if (!map.has(key)) {
        map.set(key, {
          key,
          label: this.formatLabel(date),
          date,
          entries: [],
          totalSeconds: 0,
          pomodoroCount: 0,
        });
      }
      const group = map.get(key)!;
      group.entries.push(entry);
      if (entry.type === 'pomodoro') {
        group.totalSeconds += entry.duration;
        group.pomodoroCount++;
      }
    }
    return Array.from(map.values());
  });

  readonly todayPomodoroCount = computed(() => {
    const today = new Date().toDateString();
    return this._entries().filter(
      e => e.type === 'pomodoro' && new Date(e.startTime).toDateString() === today
    ).length;
  });

  readonly todayTotalSeconds = computed(() => {
    const today = new Date().toDateString();
    return this._entries()
      .filter(e => e.type === 'pomodoro' && new Date(e.startTime).toDateString() === today)
      .reduce((sum, e) => sum + e.duration, 0);
  });

  add(entry: Omit<TimeEntry, 'id'>): TimeEntry {
    const newEntry: TimeEntry = { ...entry, id: crypto.randomUUID() };
    this._entries.update(es => [newEntry, ...es]);
    this.save();
    return newEntry;
  }

  update(id: string, patch: Partial<Pick<TimeEntry, 'description' | 'projectId'>>): void {
    this._entries.update(es => es.map(e => (e.id === id ? { ...e, ...patch } : e)));
    this.save();
  }

  delete(id: string): void {
    this._entries.update(es => es.filter(e => e.id !== id));
    this.save();
  }

  private formatLabel(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }

  private load(): TimeEntry[] {
    try {
      const stored = localStorage.getItem('pomo-entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem('pomo-entries', JSON.stringify(this._entries()));
  }
}
