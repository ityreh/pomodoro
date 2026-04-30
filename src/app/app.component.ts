import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './components/timer/timer.component';
import { TimeLogComponent } from './components/time-log/time-log.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TimerComponent, TimeLogComponent, SettingsModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showSettings = signal(false);

  toggleSettings(): void {
    this.showSettings.update(v => !v);
  }
}
