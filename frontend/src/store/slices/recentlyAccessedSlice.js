import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recentlyAccessedService } from '../../services/recentlyAccessedService';

export const fetchRecentlyAccessed = createAsyncThunk(
  'recentlyAccessed/fetch',
  async (userId = 'guest', { rejectWithValue }) => {
    try {
      return await recentlyAccessedService.getRecentItems(userId);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load recently accessed items');
    }
  }
);

export const recordRecentlyAccessed = createAsyncThunk(
  'recentlyAccessed/record',
  async ({ userId = 'guest', item }, { rejectWithValue }) => {
    try {
      return await recentlyAccessedService.recordAccess(userId, item);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to record accessed item');
    }
  }
);

export const removeRecentlyAccessedItem = createAsyncThunk(
  'recentlyAccessed/remove',
  async ({ userId = 'guest', id, type }, { rejectWithValue }) => {
    try {
      await recentlyAccessedService.removeItem(userId, id, type);
      return { id, type };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to remove item');
    }
  }
);

export const clearRecentlyAccessed = createAsyncThunk(
  'recentlyAccessed/clearAll',
  async (userId = 'guest', { rejectWithValue }) => {
    try {
      await recentlyAccessedService.clearAll(userId);
      return userId;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to clear items');
    }
  }
);

const recentlyAccessedSlice = createSlice({
  name: 'recentlyAccessed',
  initialState: {
    items: [],
    currentUserId: null,
    loading: false,
    error: null
  },
  reducers: {
    // Synchronous optimistic record for instantaneous UI response
    addRecentlyAccessed(state, action) {
      const { item } = action.payload || {};
      if (!item || !item.id) return;

      // Filter out duplicate
      state.items = state.items.filter(i => !(i.id === item.id && i.type === item.type));
      // Prepend newest item
      state.items.unshift({
        ...item,
        accessedAt: new Date().toISOString()
      });
      // Limit to 20
      state.items = state.items.slice(0, 20);
    },
    resetRecentlyAccessed(state) {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchRecentlyAccessed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentlyAccessed.fulfilled, (state, action) => {
        state.items = action.payload;
        state.currentUserId = action.meta.arg || 'guest';
        state.loading = false;
      })
      .addCase(fetchRecentlyAccessed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Record
      .addCase(recordRecentlyAccessed.fulfilled, (state, action) => {
        const item = action.payload;
        if (!item || !item.id) return;
        state.items = state.items.filter(i => !(i.id === item.id && i.type === item.type));
        state.items.unshift(item);
        state.items = state.items.slice(0, 20);
      })

      // Remove single
      .addCase(removeRecentlyAccessedItem.fulfilled, (state, action) => {
        const { id, type } = action.payload;
        state.items = state.items.filter(i => !(i.id === id && i.type === type));
      })

      // Clear all
      .addCase(clearRecentlyAccessed.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const { addRecentlyAccessed, resetRecentlyAccessed } = recentlyAccessedSlice.actions;
export default recentlyAccessedSlice.reducer;
