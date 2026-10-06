import apiClient from './client';
import { User, Member, MachineRecord } from '../types';

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: { name: string; email: string; password: string; role: 'admin' | 'user' }): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Members API
export const membersApi = {
  getAll: async (): Promise<Member[]> => {
    const response = await apiClient.get('/members');
    return response.data;
  },

  getById: async (id: string): Promise<Member> => {
    const response = await apiClient.get(`/members/${id}`);
    return response.data;
  },

  update: async (id: string, updates: Partial<Member>): Promise<Member> => {
    const response = await apiClient.put(`/members/${id}`, updates);
    return response.data;
  },
};

// Machine Records API
export const machineRecordsApi = {
  getAll: async (): Promise<MachineRecord[]> => {
    const response = await apiClient.get('/machine-records');
    return response.data;
  },

  getById: async (id: string): Promise<MachineRecord> => {
    const response = await apiClient.get(`/machine-records/${id}`);
    return response.data;
  },

  create: async (record: Omit<MachineRecord, 'id'>): Promise<MachineRecord> => {
    const response = await apiClient.post('/machine-records', record);
    return response.data;
  },

  update: async (id: string, updates: Partial<MachineRecord>): Promise<MachineRecord> => {
    const response = await apiClient.put(`/machine-records/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/machine-records/${id}`);
  },
};

// Profile API
export const profileApi = {
  get: async (): Promise<any> => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  update: async (updates: any): Promise<any> => {
    const response = await apiClient.put('/profile', updates);
    return response.data;
  },

  addSkill: async (skill: string): Promise<string[]> => {
    const response = await apiClient.post('/profile/skills', { skill });
    return response.data;
  },

  removeSkill: async (skill: string): Promise<string[]> => {
    const response = await apiClient.delete(`/profile/skills/${encodeURIComponent(skill)}`);
    return response.data;
  },
};

// Settings API
export const settingsApi = {
  get: async (): Promise<any> => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  update: async (updates: any): Promise<any> => {
    const response = await apiClient.put('/settings', updates);
    return response.data;
  },
};

// Reference Posts API
export const referencePostsApi = {
  getAll: async (): Promise<any[]> => {
    const response = await apiClient.get('/reference-posts');
    return response.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/reference-posts/${id}`);
    return response.data;
  },

  create: async (post: any): Promise<any> => {
    const response = await apiClient.post('/reference-posts', post);
    return response.data;
  },

  update: async (id: string, updates: any): Promise<any> => {
    const response = await apiClient.put(`/reference-posts/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/reference-posts/${id}`);
  },
};
