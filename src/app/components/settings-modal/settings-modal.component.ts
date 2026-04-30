import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimerService, TimerSettings } from '../../services/timer.service';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.css',
})
export class SettingsModalComponent implements OnChanges {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();

  local: TimerSettings = { ...this.timerService.settings() };

  constructor(private timerService: TimerService) {}

  ngOnChanges(): void {
    if (this.visible) {
      this.local = { ...this.timerService.settings() };
    }
  }

  save(): void {
    this.timerService.updateSettings({ ...this.local });
    this.closed.emit();
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }
}
