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

    register: async (userData: { name: string; email: string; password: string; }): Promise<{ user: User; token: string }> => {
      await delay(500);
      
      const user: User = {
        id: String(Date.now()),
        name: userData.name,
        email: userData.email,
        role: 'user',
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

  // Reference Posts API
  referencePosts: {
    getAll: async (): Promise<any[]> => {
      await delay(300);
      return [
        {
          id: '1',
          url: 'https://arxiv.org/abs/2005.14165',
          title: 'Language Models are Few-Shot Learners',
          description: 'GPT-3 paper demonstrating few-shot learning capabilities of large language models.',
          tags: ['NLP', 'GPT-3', 'LLM'],
          createdBy: '1',
          createdAt: '2024-01-15T10:00:00-05:00', // EST
          updatedAt: '2024-01-15T10:00:00-05:00',
        },
        {
          id: '2',
          url: 'https://pytorch.org/tutorials/',
          title: 'PyTorch Tutorials',
          description: 'Official PyTorch tutorials for deep learning practitioners.',
          tags: ['PyTorch', 'Tutorial', 'Deep Learning'],
          createdBy: '2',
          createdAt: '2024-01-16T14:30:00-05:00', // EST
          updatedAt: '2024-01-16T14:30:00-05:00',
        },
        {
          id: '3',
          url: 'https://huggingface.co/docs',
          title: 'Hugging Face Documentation',
          description: 'Comprehensive documentation for Hugging Face transformers library.',
          tags: ['Hugging Face', 'Transformers', 'NLP'],
          createdBy: '1',
          createdAt: '2024-01-17T09:15:00-05:00', // EST
          updatedAt: '2024-01-17T09:15:00-05:00',
        },
        {
          id: '4',
          url: 'https://www.kaggle.com/learn',
          title: 'Kaggle Learn',
          description: 'Free courses on machine learning, data science, and more.',
          tags: ['Kaggle', 'Tutorial', 'Machine Learning'],
          createdBy: '3',
          createdAt: '2024-01-18T16:45:00-05:00', // EST
          updatedAt: '2024-01-18T16:45:00-05:00',
        },
        {
          id: '5',
          url: 'https://github.com/microsoft/ML-For-Beginners',
          title: 'ML For Beginners',
          description: 'Microsoft\'s 12-week, 26-lesson curriculum on classic machine learning.',
          tags: ['GitHub', 'Tutorial', 'Machine Learning'],
          createdBy: '2',
          createdAt: '2024-01-19T11:20:00-05:00', // EST
          updatedAt: '2024-01-19T11:20:00-05:00',
        },
      ];
    },

    getById: async (id: string): Promise<any> => {
      await delay(200);
      const posts = await mockApi.referencePosts.getAll();
      return posts.find(p => p.id === id);
    },

    create: async (post: any): Promise<any> => {
      await delay(400);
      const now = new Date();
      const estTimestamp = now.toISOString().replace('Z', '-05:00'); // EST timezone
      const newPost = {
        ...post,
        id: String(Date.now()),
        createdAt: estTimestamp,
        updatedAt: estTimestamp,
      };
      return newPost;
    },

    update: async (id: string, updates: any): Promise<any> => {
      await delay(300);
      const post = await mockApi.referencePosts.getById(id);
      if (!post) throw new Error('Post not found');
      
      const now = new Date();
      const estTimestamp = now.toISOString().replace('Z', '-05:00'); // EST timezone
      
      return {
        ...post,
        ...updates,
        updatedAt: estTimestamp,
      };
    },

    delete: async (id: string): Promise<void> => {
      await delay(300);
    },
  },
};

export default mockApi;
