import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { providerService } from '../../services/providerService';

export const fetchProviders = createAsyncThunk('providers/fetchAll', async (filters) => {
  return await providerService.getProviders(filters);
});

export const fetchProviderDetails = createAsyncThunk('providers/fetchDetails', async (id) => {
  return await providerService.getProviderById(id);
});

export const fetchNearbyProviders = createAsyncThunk('providers/fetchNearby', async (loc) => {
  return await providerService.getNearbyProviders(loc);
});

const providerSlice = createSlice({
  name: 'provider',
  initialState: {
    providers: [],
    currentShop: null,
    nearbyProviders: [],
    loading: false,
    error: null
  },
  reducers: {
    updateShopAvailability(state, action) {
      if (state.currentShop) {
        state.currentShop.availability = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => { state.loading = true; })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.providers = action.payload;
        state.loading = false;
      })
      .addCase(fetchProviderDetails.fulfilled, (state, action) => {
        state.currentShop = action.payload;
      })
      .addCase(fetchNearbyProviders.fulfilled, (state, action) => {
        state.nearbyProviders = action.payload;
      });
  }
});

export const { updateShopAvailability } = providerSlice.actions;
export default providerSlice.reducer;
