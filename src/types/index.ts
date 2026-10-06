export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'on-leave';
  performance: {
    tasksCompleted: number;
    tasksTotal: number;
    accuracy: number;
    avgResponseTime: number;
  };
  weeklyStatus: {
    [date: string]: 'present' | 'absent' | 'leave' | 'remote';
  };
}

export interface MachineRecord {
  id: string;
  subnet: string;
  date: string;
  trainer: string;
  machine: string;
  dataset: string;
  epoch: number;
  purpose: string;
  result: string;
  analysis: string;
  createdBy: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
}

export interface CalendarEvent {
  date: string;
  type: 'present' | 'absent' | 'leave' | 'remote';
  memberName: string;
}

export interface ReferencePost {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
