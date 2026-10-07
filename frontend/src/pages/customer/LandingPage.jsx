import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SearchBar } from '../../components/customer/SearchBar';
import { CategoryCard } from '../../components/customer/CategoryCard';
import { ServiceCard } from '../../components/customer/ServiceCard';
import { ProviderCard } from '../../components/customer/ProviderCard';
import { RecentlyAccessedSection } from '../../components/customer/RecentlyAccessedSection';
import { RatingStars } from '../../components/common/RatingStars';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { OpenStreetMapViewer } from '../../components/common/OpenStreetMapViewer';
import { useServices, useProviders } from '../../hooks';
import { useLanguage } from '../../context/LanguageContext';
import { reviews } from '../../data/reviews';
import {
  Wrench, ShieldCheck, Clock, Award, CheckCircle2, CalendarCheck,
  ThumbsUp, ArrowRight, MapPin, Zap, Building2, Star, Quote, Sparkles
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { services, categories } = useServices(true);
  const { providers } = useProviders(true);
  const { t } = useLanguage();

  const handleHeroSearch = ({ query, location }) => {
    navigate(`/services?search=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
  };

  // Sort nearby providers by distance
  const nearbyProviders = [...providers].sort((a, b) => {
    const distA = parseFloat(a.distance || '99');
    const distB = parseFloat(b.distance || '99');
    return distA - distB;
  }).slice(0, 3);

  // Top rated providers
  const topRatedProviders = [...providers].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);

  return (
    <div>
      <main>
        {/* =================================================================
            HERO SECTION: Clean White + Purple/Violet Aesthetic
            Compact single-screen viewport layout (Sections 40-45)
            ================================================================= */}
        <section style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 55%, #f3e8ff 100%)',
          borderBottom: '1px solid #e9d5ff',
          padding: '36px 20px 32px 20px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f3e8ff',
              border: '1px solid #d8b4fe',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--primary-800)',
              marginBottom: '12px'
            }}>
              <ShieldCheck size={14} color="var(--primary-600)" />
              <span>Verified Commercial Workshops · Over 80+ Standardized Services</span>
            </div>

            <h1 style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#1e1b4b',
              lineHeight: 1.22,
              marginBottom: '10px',
              letterSpacing: '-0.5px'
            }}>
              {t('heroTitle', 'Find Trusted Local Services Near You')}
            </h1>

            <p style={{
              fontSize: '0.98rem',
              color: '#4b5563',
              maxWidth: '620px',
              margin: '0 auto 20px auto',
              lineHeight: 1.5
            }}>
              {t('heroSubtitle', 'Book verified professionals for AC repair, electrical, plumbing, cleaning, painting and more across your neighborhood.')}
            </p>

            <SearchBar onSearch={handleHeroSearch} />

            {/* Direct CTA Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <Button size="md" onClick={() => navigate('/services')} style={{ background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)', borderRadius: 'var(--radius-full)' }}>
                {t('searchButton', 'Search Services')}
              </Button>
              <Button size="md" onClick={() => navigate('/services')} style={{ background: '#f5f3ff', color: 'var(--primary-700)', border: '1.5px solid var(--primary-300)', borderRadius: 'var(--radius-full)' }}>
                <Sparkles size={14} style={{ marginRight: '6px' }} />
                <span>Explore Services</span>
              </Button>
              <Button variant="outline" size="md" onClick={() => navigate('/nearby-providers')} style={{ borderColor: 'var(--primary-300)', color: 'var(--primary-700)', borderRadius: 'var(--radius-full)' }}>
                <MapPin size={14} style={{ marginRight: '6px' }} />
                {t('findNearby', 'Find Nearby Providers')}
              </Button>
            </div>

            {/* Quick Category Chips */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '18px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Popular:
              </span>
              {[
                { label: 'AC Repair', cat: 'AC Repair' },
                { label: 'Electrical', cat: 'Electrical Works' },
                { label: 'Plumbing', cat: 'Plumbing & Water' },
                { label: 'Cleaning', cat: 'Cleaning & Housekeeping' },
                { label: 'Appliance', cat: 'Appliance Repair' },
                { label: 'Painting', cat: 'Painting & Finishes' },
                { label: 'Carpentry', cat: 'Carpentry & Woodwork' },
                { label: 'Home Security', cat: 'Smart Home & Security' }
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => navigate(`/services?category=${encodeURIComponent(chip.cat)}`)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e9d5ff',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 11px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--primary-700)',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary-600)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'var(--primary-600)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = 'var(--primary-700)';
                    e.currentTarget.style.borderColor = '#e9d5ff';
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 1: Popular Categories
            ================================================================= */}
        <section style={{ padding: '60px 0', background: 'var(--bg-app)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t('popularCategories', 'Popular Categories')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                  Browse specialized trades and certified commercial workshops
                </p>
              </div>
              <Link to="/categories" style={{ color: 'var(--primary-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                All 18 Categories <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {categories.slice(0, 8).map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 2: Popular Services
            ================================================================= */}
        <section style={{ padding: '60px 0', background: 'var(--bg-surface)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t('popularServices', 'Popular Services')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                  Fixed rates with transparent diagnosis and 30-day work warranty
                </p>
              </div>
              <Link to="/services" style={{ color: 'var(--primary-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                View All 80+ Services <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
              {services.slice(0, 6).map((service) => (
                <ServiceCard key={service.serviceId} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 3: Nearby Providers
            ================================================================= */}
        <section style={{ padding: '60px 0', background: 'var(--bg-app)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t('nearbyProviders', 'Nearby Providers & Shops')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                  Fastest dispatch response from registered commercial workshops in your area
                </p>
              </div>
              <Link to="/nearby-providers" style={{ color: 'var(--primary-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                View Nearby Map <ArrowRight size={16} />
              </Link>
            </div>

            {/* Embedded OpenStreetMap Location Radar */}
            <OpenStreetMapViewer
              centerLocation="Tirunelveli, Tamil Nadu"
              nearbyCount={nearbyProviders.length}
              initialView="local"
              height="300px"
              showControls={true}
              showShopList={false}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
              {nearbyProviders.map((p) => (
                <ProviderCard key={p.providerId} provider={p} />
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 4: Top Rated Providers
            ================================================================= */}
        <section style={{ padding: '60px 0', background: 'var(--bg-surface)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t('topRatedProviders', 'Top Rated Provider Shops')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                  Certified commercial shops with physical workshops — no unverified freelancers
                </p>
              </div>
              <Link to="/providers" style={{ color: 'var(--primary-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                View All Workshops <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
              {topRatedProviders.map((p) => (
                <ProviderCard key={p.providerId} provider={p} />
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 5: Recently Accessed
            ================================================================= */}
        <section style={{ padding: '20px 0 40px 0', background: 'var(--bg-app)' }}>
          <div className="container">
            <RecentlyAccessedSection />
          </div>
        </section>

        {/* =================================================================
            SECTION 6: How It Works
            ================================================================= */}
        <section style={{ padding: '60px 0', background: 'var(--bg-surface)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {t('howItWorks', 'How LocalServe Works')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '40px' }}>
              Simple 4-step process from service discovery to certified completion
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '24px' }}>
              {[
                { step: '01', title: t('step1Title', 'Select Service'), desc: t('step1Desc', 'Browse 80+ realistic services across 18 specialized trade categories.') },
                { step: '02', title: t('step2Title', 'Choose Certified Shop'), desc: t('step2Desc', 'Pick a certified neighbourhood workshop partner and preferred arrival time.') },
                { step: '03', title: t('step3Title', 'Real-Time Tracking'), desc: t('step3Desc', 'Uniformed, tool-equipped technicians arrive on time with live tracking.') },
                { step: '04', title: t('step4Title', 'Service Passport'), desc: t('step4Desc', 'Receive itemized receipt and digital service passport warranty entries.') }
              ].map((s, idx) => (
                <Card key={idx} style={{ textAlign: 'left', padding: '24px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-600)', marginBottom: '8px' }}>
                    {s.step}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{s.title}</h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 7: Why Choose LocalServe
            ================================================================= */}
        <section style={{ padding: '60px 0', background: 'var(--bg-app)' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '36px' }}>
              {t('whyChooseUs', 'Why Choose LocalServe?')}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {[
                { title: 'Commercial Shops Only', desc: 'Every service provider is a registered business workshop with a physical location, not an unvetted freelancer.', icon: Building2 },
                { title: 'Transparent INR Pricing', desc: 'Standardized rate cards across all trades with zero hidden surge pricing or unexpected technician quotes.', icon: Award },
                { title: 'Digital Service Passport', desc: 'An immutable digital logbook recording every repair, diagnostic reading, and next scheduled check.', icon: ShieldCheck },
                { title: 'Preventive Care Scheduler', desc: 'Automate recurring servicing for home ACs, RO purifiers, and water tanks with advance alert reminders.', icon: Clock }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Card key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '20px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 8: Customer Reviews
            ================================================================= */}
        <section style={{ padding: '60px 0', background: 'var(--bg-surface)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {t('customerReviews', 'What Our Customers Say')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                Real feedback from verified homeowners and businesses who booked through LocalServe
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {reviews.map((rev) => (
                <Card key={rev.reviewId} hoverable style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <RatingStars rating={rev.rating} size={15} />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.55, fontStyle: 'italic', marginBottom: '16px' }}>
                      "{rev.comment}"
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rev.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.serviceName} · {rev.providerName}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export const HomePage = LandingPage;
