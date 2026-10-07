import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../services/bookingService';

export const updateTechChecklist = createAsyncThunk('technician/checklist', async ({ bookingId, checklist }) => {
  return await bookingService.updateChecklist(bookingId, checklist);
});

export const saveTechNotes = createAsyncThunk('technician/notes', async ({ bookingId, notes }) => {
  return await bookingService.addTechNotes(bookingId, notes);
});

const technicianSlice = createSlice({
  name: 'technician',
  initialState: {
    activeJob: null,
    checklistItems: [],
    workNotes: '',
    loading: false
  },
  reducers: {
    setActiveJob(state, action) {
      state.activeJob = action.payload;
      state.checklistItems = action.payload?.serviceChecklist || [];
      state.workNotes = action.payload?.techNotes || '';
    },
    toggleChecklistItem(state, action) {
      const idx = action.payload;
      if (state.checklistItems[idx]) {
        state.checklistItems[idx].done = !state.checklistItems[idx].done;
      }
    },
    setWorkNotes(state, action) {
      state.workNotes = action.payload;
    }
  }
});

export const { setActiveJob, toggleChecklistItem, setWorkNotes } = technicianSlice.actions;
export default technicianSlice.reducer;
