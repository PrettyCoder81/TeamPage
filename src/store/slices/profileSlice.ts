import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  bio: string;
  phone: string;
  location: string;
  company: string;
  website: string;
  skills: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

const initialState: ProfileState = {
  bio: 'Machine Learning Engineer passionate about building scalable AI systems and optimizing deep learning workflows.',
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

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload };
    },
    addSkill: (state, action: PayloadAction<string>) => {
      if (!state.skills.includes(action.payload)) {
        state.skills.push(action.payload);
      }
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter(s => s !== action.payload);
    },
    updateSocialLinks: (state, action: PayloadAction<Partial<ProfileState['socialLinks']>>) => {
      state.socialLinks = { ...state.socialLinks, ...action.payload };
    },
  },
});

export const { updateProfile, addSkill, removeSkill, updateSocialLinks } = profileSlice.actions;
export default profileSlice.reducer;
