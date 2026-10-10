import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../services/bookingService';

export const fetchBookings = createAsyncThunk('bookings/fetchAll', async (filters) => {
  return await bookingService.getBookings(filters);
});

export const fetchBookingById = createAsyncThunk('bookings/fetchById', async (id) => {
  return await bookingService.getBookingById(id);
});

export const createNewBooking = createAsyncThunk('bookings/create', async (data) => {
  return await bookingService.createBooking(data);
});

export const changeBookingStatus = createAsyncThunk('bookings/changeStatus', async ({ id, status, notes }) => {
  return await bookingService.updateBookingStatus(id, status, notes);
});

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    currentBooking: null,
    draftBooking: {
      service: null,
      provider: null,
      date: '',
      timeSlot: '09:00 AM - 10:30 AM',
      address: 'Flat 402, Green Valley Apartments, Vannarpettai, Tirunelveli',
      requirements: ''
    },
    loading: false,
    error: null
  },
  reducers: {
    setDraftBooking(state, action) {
      state.draftBooking = { ...state.draftBooking, ...action.payload };
    },
    resetDraft(state) {
      state.draftBooking = {
        service: null,
        provider: null,
        date: '',
        timeSlot: '09:00 AM - 10:30 AM',
        address: 'Flat 402, Green Valley Apartments, Vannarpettai, Tirunelveli',
        requirements: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
      })
      .addCase(createNewBooking.fulfilled, (state, action) => {
        state.bookings.unshift(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(changeBookingStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        const matchId = (b) => (b._id && updated._id && b._id.toString() === updated._id.toString()) ||
                              (b.bookingId && b.bookingId === updated.bookingId) ||
                              (b.bookingNumber && b.bookingNumber === updated.bookingNumber);
        state.bookings = state.bookings.map(b => matchId(b) ? { ...b, ...updated } : b);
        if (state.currentBooking && matchId(state.currentBooking)) {
          state.currentBooking = { ...state.currentBooking, ...updated };
        }
      });
  }
});

export const { setDraftBooking, resetDraft } = bookingSlice.actions;
export default bookingSlice.reducer;
