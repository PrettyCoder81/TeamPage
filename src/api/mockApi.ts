import { User, Member, MachineRecord } from '../types';
import { mockMembers, mockMachineRecords } from '../mock/data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockApi = {
  // Auth API
  auth: {
    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
      await delay(500);
      
      // Mock authentication
      if (email && password) {
        const isAdmin = email.includes('admin');
        const user: User = {
          id: '1',
          name: isAdmin ? 'Admin User' : email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: email,
          role: isAdmin ? 'admin' : 'user',
        };
        
        return {
          user,
          token: 'mock-jwt-token-' + Date.now(),
        };
      }
      
      throw new Error('Invalid credentials');
    },

    register: async (userData: { name: string; email: string; password: string; role: 'admin' | 'user' }): Promise<{ user: User; token: string }> => {
      await delay(500);
      
      const user: User = {
        id: String(Date.now()),
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };
      
      return {
        user,
        token: 'mock-jwt-token-' + Date.now(),
      };
    },

    logout: async (): Promise<void> => {
      await delay(200);
    },
  },

  // Members API
  members: {
    getAll: async (): Promise<Member[]> => {
      await delay(300);
      return [...mockMembers];
    },

    getById: async (id: string): Promise<Member | undefined> => {
      await delay(200);
      return mockMembers.find(m => m.id === id);
    },

    update: async (id: string, updates: Partial<Member>): Promise<Member> => {
      await delay(300);
      const member = mockMembers.find(m => m.id === id);
      if (!member) throw new Error('Member not found');
      
      const updated = { ...member, ...updates };
      const index = mockMembers.findIndex(m => m.id === id);
      mockMembers[index] = updated;
      
      return updated;
    },
  },

  // Machine Records API
  machineRecords: {
    getAll: async (): Promise<MachineRecord[]> => {
      await delay(300);
      return [...mockMachineRecords];
    },

    getById: async (id: string): Promise<MachineRecord | undefined> => {
      await delay(200);
      return mockMachineRecords.find(r => r.id === id);
    },

    create: async (record: Omit<MachineRecord, 'id'>): Promise<MachineRecord> => {
      await delay(400);
      const newRecord: MachineRecord = {
        ...record,
        id: String(Date.now()),
      };
      mockMachineRecords.unshift(newRecord);
      return newRecord;
    },

    update: async (id: string, updates: Partial<MachineRecord>): Promise<MachineRecord> => {
      await delay(300);
      const index = mockMachineRecords.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Record not found');
      
      const updated = { ...mockMachineRecords[index], ...updates };
      mockMachineRecords[index] = updated;
      
      return updated;
    },

    delete: async (id: string): Promise<void> => {
      await delay(300);
      const index = mockMachineRecords.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Record not found');
      mockMachineRecords.splice(index, 1);
    },
  },

  // Profile API
  profile: {
    get: async (): Promise<any> => {
      await delay(200);
      return {
        bio: 'Machine Learning Engineer passionate about building scalable AI systems.',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        company: 'Team AI Labs',
        website: 'https://team-portal.dev',
        skills: ['Python', 'PyTorch', 'TensorFlow', 'MLOps', 'Kubernetes', 'AWS'],
        socialLinks: {
          github: 'github.com/johnsmith',
          linkedin: 'linkedin.com/in/johnsmith',
          twitter: '@johnsmith',
        },
      };
    },

    update: async (updates: any): Promise<any> => {
      await delay(300);
      return updates;
    },
  },

  // Settings API
  settings: {
    get: async (): Promise<any> => {
      await delay(200);
      return {
        notifications: {
          email: true,
          push: true,
          jobCompleted: true,
          jobFailed: true,
          weeklyReport: false,
          mentions: true,
        },
        appearance: {
          theme: 'light',
          compactMode: false,
          language: 'en',
        },
        security: {
          twoFactorEnabled: false,
          sessionTimeout: 30,
        },
      };
    },

    update: async (updates: any): Promise<any> => {
      await delay(300);
      return updates;
    },
  },
};

export default mockApi;
