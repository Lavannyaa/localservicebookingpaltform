import { notifications } from '../data/notifications';

const PASSPORT_STORAGE_KEY = 'localserve_service_passport';
const MAINTENANCE_STORAGE_KEY = 'localserve_maintenance_schedules';

// Realistic initial dataset for Customer: Rahul Sharma (PASSPORT-TNV-2026-081)
export const INITIAL_PASSPORT_APPLIANCES = [
  {
    applianceId: 'app-1',
    applianceName: 'Daikin Inverter 1.5T Split AC',
    locationInHouse: 'Master Bedroom (Flat 402)',
    brand: 'Daikin',
    model: 'FTKP50TV16U / Inverter R32',
    installationDate: '2024-03-15',
    qrCodeId: 'QR-PASSPORT-DAIKIN-081',
    currentHealthScore: '94% (Good Condition)',
    serviceHistory: [
      {
        historyId: 'hist-101',
        bookingNumber: 'LS-2026-1001',
        serviceId: 'srv-3',
        serviceName: 'AC Jet Wash & Comprehensive Service',
        providerName: 'A. Joseph Fernandez',
        shopName: 'FrostTech AC Solutions',
        technicianName: 'S. Murugan (Certified HVAC #TN-4410)',
        serviceDate: '2026-09-28',
        workCompleted: 'Chemical jet cleaned indoor cooling coils. Descaled condensate drain pan and flushed algae blockage. Rinsed outdoor condenser fins. Checked R32 suction pressure at 125 PSI.',
        checklist: [
          { item: 'Check cooling temperature pre-service (26°C)', passed: true },
          { item: 'Clean filter and indoor blower wheel', passed: true },
          { item: 'Check gas pressure (125 PSI R32 calibrated)', passed: true },
          { item: 'Check electrical connections & capacitor rating', passed: true },
          { item: 'Inspect outdoor unit condenser fins & coil', passed: true },
          { item: 'Final cooling test (Delivered: 16.5°C airflow)', passed: true }
        ],
        notes: 'Dual run capacitor measuring 28.5 uF against rated 35 uF. Replaced with genuine OEM 35uF Epcos capacitor. Verified no drainage backflow.',
        amount: 899,
        warranty: '30-Day Work Warranty (Valid until 28 Oct 2026)',
        maintenanceInterval: '3 Months (Quarterly)',
        nextMaintenanceDate: '2026-12-28',
        proofPhotos: {
          before: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
          after: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60'
        }
      },
      {
        historyId: 'hist-100',
        bookingNumber: 'LS-2026-0688',
        serviceId: 'srv-3',
        serviceName: 'AC Gas Charging & Pressure Calibration',
        providerName: 'A. Joseph Fernandez',
        shopName: 'FrostTech AC Solutions',
        technicianName: 'S. Murugan',
        serviceDate: '2026-06-20',
        workCompleted: 'Flare nut joint leak detected and repaired. Nitrogen pressure hold test at 300 PSI for 45 mins. Evacuated with vacuum pump and refilled 650g R32 refrigerant.',
        checklist: [
          { item: 'Nitrogen pressure leak test', passed: true },
          { item: 'Vacuum dehydration to 500 microns', passed: true },
          { item: 'Precision digital weight gas charging', passed: true },
          { item: 'Airflow temperature delta test', passed: true }
        ],
        notes: 'Outdoor unit condenser fan motor lubricated. Vibration isolation rubber dampers adjusted.',
        amount: 1499,
        warranty: '90-Day Gas Leakage Warranty (Expired)',
        maintenanceInterval: '3 Months (Quarterly)',
        nextMaintenanceDate: '2026-09-28'
      }
    ],
    maintenanceSchedule: {
      scheduleId: 'maint-ac-1',
      serviceId: 'srv-3',
      serviceName: 'AC Jet Wash & Quarterly Maintenance',
      providerId: 'prov-2',
      shopName: 'FrostTech AC Solutions',
      interval: '3 Months (Quarterly)',
      lastServiceDate: '2026-09-28',
      nextServiceDate: '2026-12-28',
      status: 'Active',
      reminderStatus: 'Scheduled · Reminder Active (Will alert 3 days prior)',
      recommendedAction: 'Book Again for Quarterly Coil Rinse'
    }
  },
  {
    applianceId: 'app-2',
    applianceName: 'Kent Grand Plus RO Water Purifier',
    locationInHouse: 'Kitchen Utility Area',
    brand: 'Kent',
    model: 'Grand Plus Mineral RO+UV+UF+TDS',
    installationDate: '2024-08-10',
    qrCodeId: 'QR-PASSPORT-KENT-082',
    currentHealthScore: '98% (Excellent Condition)',
    serviceHistory: [
      {
        historyId: 'hist-201',
        bookingNumber: 'LS-2026-1003',
        serviceId: 'srv-6',
        serviceName: 'RO Water Purifier Filter & Membrane Service',
        providerName: 'A. Joseph Fernandez',
        shopName: 'FrostTech AC Solutions',
        technicianName: 'S. Murugan',
        serviceDate: '2026-09-18',
        workCompleted: 'Spun polypropylene sediment filter and activated carbon block replaced. RO membrane chemical sanitization completed. Calibrated TDS controller from 420 ppm to 85 ppm pure output.',
        checklist: [
          { item: 'Raw water inlet pressure test (3.5 bar)', passed: true },
          { item: 'Pre-sediment filter replacement', passed: true },
          { item: 'Activated carbon cartridge flushing', passed: true },
          { item: 'TDS digital meter calibration (85 ppm)', passed: true },
          { item: 'UV lamp sterilization intensity check', passed: true },
          { item: 'Leak tightness test under high pressure', passed: true }
        ],
        notes: 'Pure water flow rate restored to 14 L/hr. Water taste test approved by client.',
        amount: 849,
        warranty: '90-Day Filter Integrity Warranty (Valid until 18 Dec 2026)',
        maintenanceInterval: '3 Months (Quarterly)',
        nextMaintenanceDate: '2026-12-18'
      }
    ],
    maintenanceSchedule: {
      scheduleId: 'maint-ro-2',
      serviceId: 'srv-6',
      serviceName: 'RO Filter & Membrane Replacement',
      providerId: 'prov-2',
      shopName: 'FrostTech AC Solutions',
      interval: '3 Months (Quarterly)',
      lastServiceDate: '2026-09-18',
      nextServiceDate: '2026-12-18',
      status: 'Active',
      reminderStatus: 'Scheduled · Water Purity Monitored',
      recommendedAction: 'Book Again for Sediment Cartridge Flush'
    }
  },
  {
    applianceId: 'app-3',
    applianceName: 'Luminous 150Ah Inverter & Battery',
    locationInHouse: 'Balcony Utility Corner',
    brand: 'Luminous',
    model: 'Zelio 1100 + Red Charge 150Ah Tubular',
    installationDate: '2023-11-05',
    qrCodeId: 'QR-PASSPORT-INVERTER-083',
    currentHealthScore: '89% (Maintenance Recommended)',
    serviceHistory: [
      {
        historyId: 'hist-301',
        bookingNumber: 'LS-2026-0412',
        serviceId: 'srv-77',
        serviceName: 'Inverter & Tubular Battery Overhaul',
        providerName: 'Ravi Kumar',
        shopName: 'Kumar Electricals',
        technicianName: 'K. Arumugam (Master Electrician)',
        serviceDate: '2026-04-10',
        workCompleted: 'De-ionized water refilled in 6 cells to float indicator line. Cleaned lead sulfate corrosion on terminals and applied petroleum jelly. Calibrated 850VA cutoff relay.',
        checklist: [
          { item: 'Specific gravity hydrometer test (1.240 across cells)', passed: true },
          { item: 'Terminal anti-corrosion cleaning', passed: true },
          { item: 'Mains cut-off switchover test (<15ms)', passed: true },
          { item: 'High-current load test (500W load for 30 mins)', passed: true }
        ],
        notes: 'Battery backup estimated at 4.5 hours under standard 3-fan 4-bulb load. Recommend next inspection by October 2026.',
        amount: 599,
        warranty: '6-Month Battery Maintenance Warranty',
        maintenanceInterval: '6 Months (Bi-annual)',
        nextMaintenanceDate: '2026-10-10'
      }
    ],
    maintenanceSchedule: {
      scheduleId: 'maint-inv-3',
      serviceId: 'srv-77',
      serviceName: 'Inverter Electrolyte & Terminal Overhaul',
      providerId: 'prov-1',
      shopName: 'Kumar Electricals',
      interval: '6 Months (Bi-annual)',
      lastServiceDate: '2026-04-10',
      nextServiceDate: '2026-10-10',
      status: 'Due Soon',
      reminderStatus: 'Reminder Sent · Due in 11 Days',
      recommendedAction: 'Book Again for Electrolyte Top-up & Health Check'
    }
  }
];

export const servicePassportService = {
  // Get all appliances under customer's Service Passport
  async getPassportAppliances() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(PASSPORT_STORAGE_KEY);
        if (stored) {
          try {
            resolve(JSON.parse(stored));
            return;
          } catch (e) {
            console.error(e);
          }
        }
        localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(INITIAL_PASSPORT_APPLIANCES));
        resolve(INITIAL_PASSPORT_APPLIANCES);
      }, 60);
    });
  },

  // Record a completed service into Service Passport and schedule next maintenance
  async recordCompletedService({
    bookingNumber,
    serviceId,
    serviceName,
    applianceName,
    category,
    providerName,
    shopName,
    technicianName,
    serviceDate = new Date().toISOString().split('T')[0],
    workCompleted,
    checklist = [],
    notes = '',
    amount,
    warranty = '30-Day Work Warranty',
    maintenanceIntervalMonths = 3,
    proofPhotos = null
  }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let appliances = [...INITIAL_PASSPORT_APPLIANCES];
        const stored = localStorage.getItem(PASSPORT_STORAGE_KEY);
        if (stored) {
          try { appliances = JSON.parse(stored); } catch (e) { console.error(e); }
        }

        // Calculate next maintenance date
        const baseDate = new Date(serviceDate);
        const nextDate = new Date(baseDate);
        nextDate.setMonth(nextDate.getMonth() + Number(maintenanceIntervalMonths));
        const formattedNextDate = nextDate.toISOString().split('T')[0];

        const newEntry = {
          historyId: `hist-${Date.now()}`,
          bookingNumber: bookingNumber || `LS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          serviceId,
          serviceName,
          providerName: providerName || 'Certified Workshop Lead',
          shopName: shopName || 'LocalServe Master Workshop',
          technicianName: technicianName || 'Certified Field Technician',
          serviceDate,
          workCompleted: workCompleted || 'Standardized quality inspection and overhaul executed according to SOP guidelines.',
          checklist: checklist.length > 0 ? checklist : [
            { item: 'Pre-service diagnostics and safety parameter check', passed: true },
            { item: 'Component repair and component wear calibration', passed: true },
            { item: 'Post-repair electrical and mechanical stress testing', passed: true },
            { item: 'Workplace cleanup and digital customer sign-off', passed: true }
          ],
          notes: notes || 'All functional parameters calibrated within manufacturer tolerances. Next preventive checkup scheduled.',
          amount: amount || 899,
          warranty,
          maintenanceInterval: `${maintenanceIntervalMonths} Months`,
          nextMaintenanceDate: formattedNextDate,
          proofPhotos: proofPhotos || {
            before: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
            after: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60'
          }
        };

        // Find or create appliance
        let matchedApp = appliances.find(
          a => a.applianceName.toLowerCase().includes((applianceName || serviceName).toLowerCase()) ||
               serviceName.toLowerCase().includes(a.applianceName.toLowerCase().slice(0, 5))
        );

        if (matchedApp) {
          matchedApp.serviceHistory = [newEntry, ...matchedApp.serviceHistory];
          matchedApp.maintenanceSchedule = {
            scheduleId: `maint-${Date.now()}`,
            serviceId,
            serviceName,
            providerId: 'prov-2',
            shopName: shopName || 'FrostTech AC Solutions',
            interval: `${maintenanceIntervalMonths} Months`,
            lastServiceDate: serviceDate,
            nextServiceDate: formattedNextDate,
            status: 'Active',
            reminderStatus: `Scheduled · Next Checkup on ${formattedNextDate}`,
            recommendedAction: `Book Again for ${maintenanceIntervalMonths}-Month Routine Overhaul`
          };
        } else {
          const newAppliance = {
            applianceId: `app-${Date.now()}`,
            applianceName: applianceName || serviceName,
            locationInHouse: 'Residential Site (Flat 402)',
            brand: 'Standard Premium',
            model: 'Commercial Grade Unit',
            installationDate: '2024-01-01',
            qrCodeId: `QR-PASSPORT-${Date.now()}`,
            currentHealthScore: '96% (Verified Service)',
            serviceHistory: [newEntry],
            maintenanceSchedule: {
              scheduleId: `maint-${Date.now()}`,
              serviceId,
              serviceName,
              providerId: 'prov-1',
              shopName: shopName || 'LocalServe Master Workshop',
              interval: `${maintenanceIntervalMonths} Months`,
              lastServiceDate: serviceDate,
              nextServiceDate: formattedNextDate,
              status: 'Active',
              reminderStatus: `Scheduled · Next Checkup on ${formattedNextDate}`,
              recommendedAction: `Book Again for ${maintenanceIntervalMonths}-Month Routine Overhaul`
            }
          };
          appliances.unshift(newAppliance);
        }

        localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(appliances));
        resolve({ success: true, entry: newEntry, nextMaintenanceDate: formattedNextDate });
      }, 80);
    });
  },

  // Get flat list of maintenance schedules (for Maintenance page)
  async getMaintenanceSchedules() {
    const appliances = await this.getPassportAppliances();
    const schedules = [];
    appliances.forEach(app => {
      if (app.maintenanceSchedule) {
        schedules.push({
          ...app.maintenanceSchedule,
          applianceId: app.applianceId,
          appliance: app.applianceName,
          locationInHouse: app.locationInHouse
        });
      }
    });
    return schedules;
  },

  // Reset or seed fresh data
  resetPassportData() {
    localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(INITIAL_PASSPORT_APPLIANCES));
  }
};
