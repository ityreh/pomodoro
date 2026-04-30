export type TimerMode = 'pomodoro' | 'short-break' | 'long-break';

export interface TimeEntry {
  id: string;
  description: string;
  projectId: string | null;
  startTime: string;
  endTime: string;
  duration: number;
  type: TimerMode;
}
