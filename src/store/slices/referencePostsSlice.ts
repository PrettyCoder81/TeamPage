import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ReferencePost } from '../../types';
import { api } from '../../api';

interface ReferencePostsState {
  posts: ReferencePost[];
  filters: {
    search: string;
    tag: string;
    createdBy: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ReferencePostsState = {
  posts: [],
  filters: {
    search: '',
    tag: '',
    createdBy: '',
  },
  loading: false,
  error: null,
};

// Async Thunks
export const fetchReferencePosts = createAsyncThunk(
  'referencePosts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const posts = await api.referencePosts.getAll();
      return posts;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const createReferencePost = createAsyncThunk(
  'referencePosts/create',
  async (post: Omit<ReferencePost, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const newPost = await api.referencePosts.create(post);
      return newPost;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const updateReferencePost = createAsyncThunk(
  'referencePosts/update',
  async ({ id, updates }: { id: string; updates: Partial<ReferencePost> }, { rejectWithValue }) => {
    try {
      const updatedPost = await api.referencePosts.update(id, updates);
      return updatedPost;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

export const deleteReferencePost = createAsyncThunk(
  'referencePosts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.referencePosts.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

const referencePostsSlice = createSlice({
  name: 'referencePosts',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ReferencePostsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: '', tag: '', createdBy: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchReferencePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferencePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchReferencePosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createReferencePost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      // Update
      .addCase(updateReferencePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteReferencePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
      });
  },
});

export const { setFilters, clearFilters } = referencePostsSlice.actions;
export default referencePostsSlice.reducer;
