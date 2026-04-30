import { Injectable, signal } from '@angular/core';
import { DEFAULT_PROJECTS, Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly _projects = signal<Project[]>(this.load());
  readonly projects = this._projects.asReadonly();

  getById(id: string | null): Project | undefined {
    return id ? this._projects().find(p => p.id === id) : undefined;
  }

  add(name: string, color: string): Project {
    const p: Project = { id: crypto.randomUUID(), name, color };
    this._projects.update(ps => [...ps, p]);
    this.save();
    return p;
  }

  delete(id: string): void {
    this._projects.update(ps => ps.filter(p => p.id !== id));
    this.save();
  }

  private load(): Project[] {
    try {
      const stored = localStorage.getItem('pomo-projects');
      return stored ? JSON.parse(stored) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  }

  private save(): void {
    localStorage.setItem('pomo-projects', JSON.stringify(this._projects()));
  }
}
