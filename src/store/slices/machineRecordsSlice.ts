import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MachineRecord } from '../../types';
import { mockMachineRecords } from '../../mock/data';

interface MachineRecordsState {
  records: MachineRecord[];
  filters: {
    subnet: string;
    trainer: string;
    machine: string;
    status: string;
    week: string;
    search: string;
  };
}

const initialState: MachineRecordsState = {
  records: mockMachineRecords,
  filters: {
    subnet: '',
    trainer: '',
    machine: '',
    status: '',
    week: '',
    search: '',
  },
};

const machineRecordsSlice = createSlice({
  name: 'machineRecords',
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<MachineRecord>) => {
      state.records.unshift(action.payload);
    },
    updateRecord: (state, action: PayloadAction<MachineRecord>) => {
      const index = state.records.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter(r => r.id !== action.payload);
    },
    setFilters: (state, action: PayloadAction<Partial<MachineRecordsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { subnet: '', trainer: '', machine: '', status: '', week: '', search: '' };
    },
  },
});

export const { addRecord, updateRecord, deleteRecord, setFilters, clearFilters } = machineRecordsSlice.actions;
export default machineRecordsSlice.reducer;
