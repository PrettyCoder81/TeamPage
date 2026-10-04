import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member } from '../../types';
import { mockMembers } from '../../mock/data';

interface MembersState {
  members: Member[];
  selectedMember: Member | null;
}

const initialState: MembersState = {
  members: mockMembers,
  selectedMember: null,
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setSelectedMember: (state, action: PayloadAction<Member | null>) => {
      state.selectedMember = action.payload;
    },
    updateMemberStatus: (state, action: PayloadAction<{ id: string; status: Member['status'] }>) => {
      const member = state.members.find(m => m.id === action.payload.id);
      if (member) {
        member.status = action.payload.status;
      }
    },
  },
});

export const { setSelectedMember, updateMemberStatus } = membersSlice.actions;
export default membersSlice.reducer;
