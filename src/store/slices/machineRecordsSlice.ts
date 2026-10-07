import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MachineRecord } from '../../types';
import { api } from '../../api';

interface MachineRecordsState {
  records: MachineRecord[];
  filters: {
    subnet: string;
    trainer: string;
    machine: string;
    status: string;
    week: string;
    search: string;
    dateFrom: string;
    dateTo: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: MachineRecordsState = {
  records: [],
  filters: {
    subnet: '',
    trainer: '',
    machine: '',
    status: '',
    week: '',
    search: '',
    dateFrom: '',
    dateTo: '',
  },
  loading: false,
  error: null,
};

const normalizeMachineRecord = (record: Partial<MachineRecord> | null | undefined) => {
  if (!record || !record.id) return null;

  return {
    ...record,
    date: typeof record.date === 'string' ? record.date.split('T')[0] : record.date,
  } as MachineRecord;
};

// Async Thunks
export const fetchMachineRecords = createAsyncThunk(
  'machineRecords/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const records = await api.machineRecords.getAll();
      return records.map((record: any) => ({
        ...record,
        date: record.date.split('T')[0], // Format date to YYYY-MM-DD
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch records');
    }
  }
);

export const createMachineRecord = createAsyncThunk(
  'machineRecords/create',
  async (record: Omit<MachineRecord, 'id'>, { rejectWithValue }) => {
    try {
      const newRecord = await api.machineRecords.create(record);
      return newRecord;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create record');
    }
  }
);

export const updateMachineRecord = createAsyncThunk(
  'machineRecords/update',
  async ({ id, updates }: { id: string; updates: Partial<MachineRecord> }, { rejectWithValue }) => {
    try {
      const updatedRecord = await api.machineRecords.update(id, updates);
      return updatedRecord;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update record');
    }
  }
);

export const deleteMachineRecord = createAsyncThunk(
  'machineRecords/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.machineRecords.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete record');
    }
  }
);

const machineRecordsSlice = createSlice({
  name: 'machineRecords',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<MachineRecordsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { subnet: '', trainer: '', machine: '', status: '', week: '', search: '', dateFrom: '', dateTo: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchMachineRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachineRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchMachineRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createMachineRecord.fulfilled, (state, action) => {
        state.records.unshift(action.payload);
      })
      // Update
      .addCase(updateMachineRecord.fulfilled, (state, action) => {
        const updatedRecord = normalizeMachineRecord(action.payload);
        if (!updatedRecord) return;

        const index = state.records.findIndex(r => r.id === updatedRecord.id);
        if (index === -1) {
          state.records.unshift(updatedRecord);
          return;
        }

        state.records[index] = {
          ...state.records[index],
          ...updatedRecord,
          date: updatedRecord.date || state.records[index].date,
        };
      })
      // Delete
      .addCase(deleteMachineRecord.fulfilled, (state, action) => {
        state.records = state.records.filter(r => r.id !== action.payload);
      });
  },
});

export const { setFilters, clearFilters } = machineRecordsSlice.actions;
export default machineRecordsSlice.reducer;
