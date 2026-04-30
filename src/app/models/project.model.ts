export interface Project {
  id: string;
  name: string;
  color: string;
}

export const DEFAULT_PROJECTS: Project[] = [
  { id: 'p1', name: 'Work', color: '#E5534B' },
  { id: 'p2', name: 'Personal', color: '#3BAF74' },
  { id: 'p3', name: 'Learning', color: '#4B7CF3' },
  { id: 'p4', name: 'Health', color: '#F59E0B' },
];
