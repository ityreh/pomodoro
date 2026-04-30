import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeEntry } from '../../models/time-entry.model';
import { TimeEntryService } from '../../services/time-entry.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-time-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-log.component.html',
  styleUrl: './time-log.component.css',
})
export class TimeLogComponent {
  editingId = signal<string | null>(null);
  editDescription = '';
  editProjectId = '';
  confirmDeleteId = signal<string | null>(null);

  constructor(
    public entryService: TimeEntryService,
    public projectService: ProjectService,
  ) {}

  startEdit(entry: TimeEntry): void {
    this.editingId.set(entry.id);
    this.editDescription = entry.description;
    this.editProjectId = entry.projectId ?? '';
    this.confirmDeleteId.set(null);
  }

  saveEdit(id: string): void {
    this.entryService.update(id, {
      description: this.editDescription.trim() || 'Pomodoro session',
      projectId: this.editProjectId || null,
    });
    this.editingId.set(null);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
    this.editingId.set(null);
  }

  confirmDelete(id: string): void {
    this.entryService.delete(id);
    this.confirmDeleteId.set(null);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  formatTotalTime(seconds: number): string {
    if (seconds === 0) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
    return `${m}m`;
  }

  modeIcon(type: string): string {
    if (type === 'pomodoro') return '🍅';
    if (type === 'short-break') return '☕';
    return '🌿';
  }

  getProject(id: string | null) {
    return this.projectService.getById(id);
  }

  trackById(_: number, entry: TimeEntry) {
    return entry.id;
  }
}
