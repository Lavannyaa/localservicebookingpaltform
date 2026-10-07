import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    favorites: {
      services: ['srv-3', 'srv-6', 'srv-2'],
      providers: ['prov-1', 'prov-2']
    },
    passport: {
      passportId: 'PASSPORT-TNV-2026-081',
      holderName: 'Rahul Sharma',
      verifiedEntries: [
        {
          serviceName: 'RO Water Purifier Filter & Membrane Service',
          appliance: 'Kent Grand RO Water Purifier',
          date: '2026-09-18',
          providerName: 'FrostTech AC Solutions',
          technicianName: 'S. Murugan',
          workCompleted: 'Sediment and carbon cartridge replaced, TDS calibrated to 75 ppm.',
          warranty: '90-Day Filter Integrity Warranty',
          nextDueDate: '2026-12-18',
          amountPaid: 449
        },
        {
          serviceName: 'Plumbing Repair & Pipe Leakage Fix',
          appliance: 'Kitchen Siphon & Drainage',
          date: '2026-09-10',
          providerName: 'Apex Precision Home Care & Electricals',
          technicianName: 'R. Vignesh',
          workCompleted: 'Threaded compression trap fitted. Zero leakage verified.',
          warranty: '30-Day Work Warranty',
          nextDueDate: '2027-03-10',
          amountPaid: 499
        }
      ]
    }
  },
  reducers: {
    toggleFavoriteService(state, action) {
      const id = action.payload;
      if (state.favorites.services.includes(id)) {
        state.favorites.services = state.favorites.services.filter(s => s !== id);
      } else {
        state.favorites.services.push(id);
      }
    },
    toggleFavoriteProvider(state, action) {
      const id = action.payload;
      if (state.favorites.providers.includes(id)) {
        state.favorites.providers = state.favorites.providers.filter(p => p !== id);
      } else {
        state.favorites.providers.push(id);
      }
    }
  }
});

export const { toggleFavoriteService, toggleFavoriteProvider } = userSlice.actions;
export default userSlice.reducer;
