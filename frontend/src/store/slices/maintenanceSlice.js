import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { maintenanceService } from '../../services/maintenanceService';

export const fetchMaintenance = createAsyncThunk('maintenance/fetchAll', async () => {
  return await maintenanceService.getMaintenanceSchedules();
});

export const addMaintenanceSchedule = createAsyncThunk('maintenance/add', async (data) => {
  return await maintenanceService.createMaintenanceSchedule(data);
});

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: {
    schedules: [],
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenance.pending, (state) => { state.loading = true; })
      .addCase(fetchMaintenance.fulfilled, (state, action) => {
        state.schedules = action.payload;
        state.loading = false;
      })
      .addCase(addMaintenanceSchedule.fulfilled, (state, action) => {
        state.schedules.unshift(action.payload);
      });
  }
});

export default maintenanceSlice.reducer;
