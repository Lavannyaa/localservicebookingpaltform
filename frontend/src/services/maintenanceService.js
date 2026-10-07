import { maintenance } from '../data/maintenance';

let localMaint = [...maintenance];

export const maintenanceService = {
  async getMaintenanceSchedules() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...localMaint]), 70);
    });
  },

  async createMaintenanceSchedule(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = {
          maintId: `maint-${Date.now()}`,
          status: 'Scheduled',
          warranty: 'Standard Maintenance Guarantee',
          ...data
        };
        localMaint = [item, ...localMaint];
        resolve(item);
      }, 100);
    });
  }
};
