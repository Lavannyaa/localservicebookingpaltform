import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { serviceService } from '../../services/serviceService';

export const fetchServices = createAsyncThunk('services/fetchAll', async (filters) => {
  return await serviceService.getServices(filters);
});

export const fetchCategories = createAsyncThunk('services/fetchCategories', async () => {
  return await serviceService.getCategories();
});

export const fetchServiceDetails = createAsyncThunk('services/fetchDetails', async (id) => {
  return await serviceService.getServiceById(id);
});

export const addNewService = createAsyncThunk('services/add', async (serviceData) => {
  return await serviceService.createService(serviceData);
});

const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    services: [],
    categories: [],
    activeService: null,
    filters: {
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      rating: '',
      availability: 'all',
      sortBy: 'popular'
    },
    loading: false,
    error: null
  },
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = {
        search: '',
        category: 'all',
        minPrice: '',
        maxPrice: '',
        rating: '',
        availability: 'all',
        sortBy: 'popular'
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => { state.loading = true; })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchServiceDetails.fulfilled, (state, action) => {
        state.activeService = action.payload;
      })
      .addCase(addNewService.fulfilled, (state, action) => {
        state.services.unshift(action.payload);
      });
  }
});

export const { setFilter, resetFilters } = serviceSlice.actions;
export default serviceSlice.reducer;
