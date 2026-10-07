import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import {
  TrendingUp, IndianRupee, Download, BarChart2, PieChart,
  Layers, Star, Building2, CheckCircle2, RefreshCw, Users,
  CalendarCheck, Award, ArrowUpRight, ShieldCheck, Activity
} from 'lucide-react';

export const AdminReportsPage = () => {
  const [activeTab, setActiveTab] = useState('category'); // 'category' | 'popular' | 'provider' | 'completed' | 'maintenance' | 'customer'

  // 1. Bookings by Category Data
  const categoryData = [
    { category: 'AC & Cooling Solutions', bookings: 420, gmv: 357000, share: '28.6%' },
    { category: 'Electrical Services', bookings: 310, gmv: 217000, share: '21.1%' },
    { category: 'Plumbing & Drainage', bookings: 260, gmv: 169000, share: '17.7%' },
    { category: 'Home Deep Cleaning', bookings: 190, gmv: 247000, share: '12.9%' },
    { category: 'Pest Control Services', bookings: 140, gmv: 126000, share: '9.5%' },
    { category: 'Carpentry & Woodwork', bookings: 95, gmv: 76000, share: '6.5%' },
    { category: 'Commercial Painting', bookings: 55, gmv: 55200, share: '3.7%' }
  ];

  // 2. Popular Services Data
  const popularServicesData = [
    { rank: 1, name: 'Inverter AC Chemical Foam Jet Wash', category: 'AC & Cooling', bookings: 215, price: 699, rating: 4.9 },
    { rank: 2, name: 'RO Water Purifier Multi-Stage Service', category: 'Appliances', bookings: 164, price: 549, rating: 4.8 },
    { rank: 3, name: 'Distribution Board MCB Wiring Overhaul', category: 'Electrical', bookings: 138, price: 799, rating: 4.9 },
    { rank: 4, name: 'Concealed Bathroom Leak Detection', category: 'Plumbing', bookings: 122, price: 449, rating: 4.8 },
    { rank: 5, name: 'Termite Protection Comprehensive Treatment', category: 'Pest Control', bookings: 94, price: 1299, rating: 4.9 },
    { rank: 6, name: 'Ceiling Fan Dynamic Balancing & Installation', category: 'Electrical', bookings: 88, price: 299, rating: 4.7 }
  ];

  // 3. Provider Workshop Performance Data
  const providerPerformanceData = [
    { rank: 1, shopName: 'FrostTech AC Solutions', area: 'Vannarpettai', completed: 342, onTimeRate: '98.4%', rating: 4.9, activeTechs: 6 },
    { rank: 2, shopName: 'Kumar Electricals & Rewinding', area: 'Palayamkottai', completed: 284, onTimeRate: '97.2%', rating: 4.8, activeTechs: 5 },
    { rank: 3, shopName: 'PureAqua Purifiers & Plumbing', area: 'Town Centre', completed: 245, onTimeRate: '96.5%', rating: 4.8, activeTechs: 4 },
    { rank: 4, shopName: 'SparklePro Deep Cleaning Works', area: 'High Grounds', completed: 198, onTimeRate: '99.0%', rating: 4.9, activeTechs: 7 },
    { rank: 5, shopName: 'PestShield Commercial Protection', area: 'Bypass Road', completed: 142, onTimeRate: '95.8%', rating: 4.7, activeTechs: 3 }
  ];

  // 4. Completed Services Data
  const completedServicesData = [
    { metric: 'Total Services Completed (YTD)', value: '1,420 Jobs', change: '+18.4% vs last period' },
    { metric: 'Average Service Turnaround Time', value: '72 Mins', change: '8 mins faster than SLA' },
    { metric: 'Checklist Execution Sign-Off Rate', value: '99.2%', change: 'Verified by customer signature' },
    { metric: '30-Day Warranty Claims Filed', value: '11 Claims (<0.8%)', change: '100% resolved under guarantee' }
  ];

  // 5. Maintenance Activity Data
  const maintenanceActivityData = [
    { appliance: 'Split ACs (Quarterly Jet Wash Cycle)', registered: 310, dueThisMonth: 64, rebookedViaBookAgain: 52, complianceRate: '81.2%' },
    { appliance: 'RO Water Purifiers (Membrane Check)', registered: 195, dueThisMonth: 42, rebookedViaBookAgain: 37, complianceRate: '88.1%' },
    { appliance: 'Storage Geysers (Sediment Flush)', registered: 120, dueThisMonth: 18, rebookedViaBookAgain: 14, complianceRate: '77.7%' },
    { appliance: 'Commercial Refrigerators (Condenser Clean)', registered: 85, dueThisMonth: 12, rebookedViaBookAgain: 11, complianceRate: '91.6%' }
  ];

  // 6. Customer Activity Data
  const customerActivityData = [
    { metric: 'Registered Customer Base', value: '48 Verified Accounts', detail: 'Tirunelveli & Chennai' },
    { metric: 'Repeat Booking Index (Book Again)', value: '64.8%', detail: 'Customers booking 2+ services' },
    { metric: 'Average Order Value (AOV)', value: '₹879', detail: 'Including standard platform fees' },
    { metric: 'Customer CSAT Satisfaction', value: '4.86 / 5.0', detail: 'Based on 512 verified reviews' }
  ];

  const reportTabs = [
    { id: 'category', label: 'Bookings by Category', icon: Layers },
    { id: 'popular', label: 'Popular Services', icon: Star },
    { id: 'provider', label: 'Provider Performance', icon: Building2 },
    { id: 'completed', label: 'Completed Services', icon: CheckCircle2 },
    { id: 'maintenance', label: 'Maintenance Activity', icon: RefreshCw },
    { id: 'customer', label: 'Customer Activity', icon: Users }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Operations & Analytics Intelligence
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive performance analytics, category volume, workshop SLAs, and maintenance compliance.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Generating full executive audit PDF...")} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
          <Download size={14} /> Export Comprehensive PDF
        </Button>
      </div>

      {/* KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL GROSS VOLUME (GMV)</span>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#059669', margin: '4px 0' }}>₹12,48,200</div>
          <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 600 }}>↑ +14.2% Month-over-Month</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>COMPLETED LIFECYCLE JOBS</span>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--primary-700)', margin: '4px 0' }}>1,420</div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>99.2% verified checklist sign-off</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>BOOK AGAIN CONVERSION</span>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#d97706', margin: '4px 0' }}>64.8%</div>
          <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 600 }}>Driven by Service Passport Reminders</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE SERVICE WORKSHOPS</span>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#6366f1', margin: '4px 0' }}>8 Shops</div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>32 Certified Technicians</span>
        </div>
      </div>

      {/* 6 Mandatory Report Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        {reportTabs.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: active ? 'var(--primary-600)' : 'transparent',
                color: active ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: active ? 700 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Bookings by Category */}
      {activeTab === 'category' && (
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
              1. Bookings by Category (Volume & Revenue Distribution)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Analysis of customer demand across the 18 specialized trade verticals.
            </span>
          </div>

          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 18px' }}>Trade Category</th>
                <th style={{ padding: '14px 18px' }}>Bookings Delivered</th>
                <th style={{ padding: '14px 18px' }}>Gross Revenue (GMV)</th>
                <th style={{ padding: '14px 18px' }}>Volume Share</th>
                <th style={{ padding: '14px 18px' }}>Market Distribution</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>{c.category}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 600 }}>{c.bookings} orders</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>₹{c.gmv.toLocaleString()}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>{c.share}</td>
                  <td style={{ padding: '14px 18px', width: '220px' }}>
                    <div style={{ height: '8px', background: 'var(--bg-muted)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: c.share, background: 'var(--primary-600)', borderRadius: '4px' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 2: Popular Services */}
      {activeTab === 'popular' && (
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
              2. Popular Services (Top Ranked by Order Volume & Rating)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Highest velocity standardized rate-card services across all partner shops.
            </span>
          </div>

          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 18px' }}>Rank</th>
                <th style={{ padding: '14px 18px' }}>Service Name</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Rate Card Price</th>
                <th style={{ padding: '14px 18px' }}>Orders</th>
                <th style={{ padding: '14px 18px' }}>CSAT Rating</th>
              </tr>
            </thead>
            <tbody>
              {popularServicesData.map(s => (
                <tr key={s.rank} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>#{s.rank}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>{s.name}</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{s.category}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800 }}>₹{s.price}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>{s.bookings} completed</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#d97706' }}>★ {s.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 3: Provider Performance */}
      {activeTab === 'provider' && (
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
              3. Commercial Workshop Partner Performance & SLA Ranking
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Audited fulfillment speed, on-time arrival rate, and customer feedback.
            </span>
          </div>

          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 18px' }}>Rank</th>
                <th style={{ padding: '14px 18px' }}>Workshop Shop Name</th>
                <th style={{ padding: '14px 18px' }}>Area Location</th>
                <th style={{ padding: '14px 18px' }}>Completed Jobs</th>
                <th style={{ padding: '14px 18px' }}>On-Time Arrival SLA</th>
                <th style={{ padding: '14px 18px' }}>Enrolled Technicians</th>
                <th style={{ padding: '14px 18px' }}>Customer Rating</th>
              </tr>
            </thead>
            <tbody>
              {providerPerformanceData.map(p => (
                <tr key={p.rank} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>#{p.rank}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>{p.shopName}</td>
                  <td style={{ padding: '14px 18px' }}>{p.area}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>{p.completed} Jobs</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#10b981' }}>{p.onTimeRate}</td>
                  <td style={{ padding: '14px 18px' }}>{p.activeTechs} certified</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#d97706' }}>★ {p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 4: Completed Services */}
      {activeTab === 'completed' && (
        <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800 }}>
            4. Completed Services & Warranty Certification Audit
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Service lifecycle completion audits, verified technician checklists, and 30-day warranty tracking.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {completedServicesData.map((d, idx) => (
              <div key={idx} style={{ background: 'var(--bg-muted)', padding: '18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>{d.metric}</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)', margin: '6px 0' }}>{d.value}</div>
                <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 600 }}>{d.change}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)', padding: '16px 20px', borderRadius: 'var(--radius-sm)' }}>
            <strong style={{ fontSize: '0.88rem', color: 'var(--primary-900)', display: 'block', marginBottom: '4px' }}>
              Service Passport Closed-Loop Integration:
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--primary-800)', margin: 0, lineHeight: 1.5 }}>
              Every completed job automatically logs a permanent digital passport certificate with technician checklist sign-off and schedules the subsequent preventive maintenance overhaul at 3-month intervals.
            </p>
          </div>
        </div>
      )}

      {/* Tab Content 5: Maintenance Activity */}
      {activeTab === 'maintenance' && (
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
              5. Maintenance Activity & "Book Again" Compliance
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Appliance maintenance schedule adherence and automated customer rebooking conversions.
            </span>
          </div>

          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 18px' }}>Appliance & Schedule Cycle</th>
                <th style={{ padding: '14px 18px' }}>Tracked in Passports</th>
                <th style={{ padding: '14px 18px' }}>Overhauls Due This Month</th>
                <th style={{ padding: '14px 18px' }}>Converted Via "Book Again"</th>
                <th style={{ padding: '14px 18px' }}>Compliance Rate</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceActivityData.map((m, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>{m.appliance}</td>
                  <td style={{ padding: '14px 18px' }}>{m.registered} units</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#d97706' }}>{m.dueThisMonth} due</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#10b981' }}>{m.rebookedViaBookAgain} rebooked</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary-700)' }}>{m.complianceRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 6: Customer Activity */}
      {activeTab === 'customer' && (
        <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800 }}>
            6. Customer Activity, Loyalty & Retention Index
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Customer platform engagement, repeat usage patterns, and geographic concentration.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {customerActivityData.map((ca, idx) => (
              <div key={idx} style={{ background: 'var(--bg-muted)', padding: '18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>{ca.metric}</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-700)', margin: '6px 0' }}>{ca.value}</div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{ca.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;
