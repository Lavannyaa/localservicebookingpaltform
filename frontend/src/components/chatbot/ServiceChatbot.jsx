import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatbotService } from '../../services/chatbotService';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks';
import {
  MessageSquare, X, Send, Bot, User, RefreshCw, Volume2, VolumeX,
  ExternalLink, Calendar, MapPin, Building2, ShieldCheck, CheckCircle2,
  Clock, ArrowRight, Sparkles, ChevronDown, Wrench, HelpCircle
} from 'lucide-react';

export const ServiceChatbot = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('localserve_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: `Hello! 👋 I am your **LocalServe Support Assistant**.

I can help you with:
• **Finding a Service** (80+ commercial & home repair services)
• **Booking Guidance** (Step-by-step process & pricing in ₹)
• **Tracking Your Booking** (Live status & technician arrival)
• **Maintenance & Passport** (Upcoming checkups & warranty)
• **Nearby Workshops** (Certified physical repair shops)
• **FAQs & Policies** (Free cancellation, safety, guarantees)

How can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: [
          '🔍 Find a Service',
          '📦 Track My Booking',
          '📅 Maintenance Schedule',
          '📂 Browse Categories',
          '🏪 Find Nearby Shops',
          '❓ Cancellation & Help'
        ]
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  // Persist conversation
  useEffect(() => {
    sessionStorage.setItem('localserve_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Simple pleasant sound synthesis on message arrival
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined' || !window.AudioContext) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Audio not permitted or supported
    }
  };

  const handleSend = async (messageText) => {
    const query = (messageText || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await chatbotService.sendMessage(query, messages, {
        userName: user?.name || 'Customer',
        language
      });

      setIsTyping(false);
      setMessages(prev => [...prev, {
        ...botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      playChime();
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error('Chat error:', err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'I encountered an issue retrieving that information. Please try again or visit our Help Center at /help-support.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleResetChat = () => {
    sessionStorage.removeItem('localserve_chat_history');
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'bot',
        text: `Conversation restarted! How can I assist you with your local service bookings or maintenance today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: [
          '🔍 Find a Service',
          '📦 Track My Booking',
          '📅 Maintenance Schedule',
          '📂 Browse Categories'
        ]
      }
    ]);
  };

  const handleActionClick = (url) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
      setIsOpen(false);
    }
  };

  // Render markdown-like bold and bullet formatting
  const formatText = (text = '') => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold parser
      const parts = line.split(/(\*\*.*?\*\*|\`.*?\`)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={pIdx} style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.85em', color: 'var(--primary-700)' }}>
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });

      return (
        <span key={idx} style={{ display: 'block', marginBottom: line === '' ? '6px' : '2px' }}>
          {renderedLine}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1200 }}>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Service Assistant Chat"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-600) 0%, #4338ca 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <MessageSquare size={28} />

            {/* Glowing online pulse badge */}
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #ffffff',
              boxShadow: '0 0 8px #10b981'
            }} />

            {hasUnread && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '10px',
                border: '1.5px solid #fff'
              }}>
                1
              </span>
            )}
          </button>
        )}
      </div>

      {/* Expandable Chat Drawer Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="LocalServe Service Support Assistant"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '410px',
            maxWidth: 'calc(100vw - 32px)',
            height: '620px',
            maxHeight: 'calc(100vh - 48px)',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.24)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            overflow: 'hidden',
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, var(--primary-700) 100%)',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid rgba(255,255,255,0.3)'
                }}>
                  <Wrench size={20} color="#a5b4fc" />
                </div>
                <span style={{
                  position: 'absolute',
                  bottom: '1px',
                  right: '1px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid #1e1b4b'
                }} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  {t('chatAssistant', 'LocalServe Assistant')}
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={11} color="#fde047" />
                  {t('chatSubtitle', 'Live Service & Booking Guide')}
                </span>
              </div>
            </div>

            {/* Header Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                style={{ background: 'transparent', border: 'none', color: '#c7d2fe', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                onClick={handleResetChat}
                title="Restart Chat"
                style={{ background: 'transparent', border: 'none', color: '#c7d2fe', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
              >
                <RefreshCw size={16} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Subheader Notice */}
          <div style={{
            background: 'var(--primary-50)',
            borderBottom: '1px solid var(--border-light)',
            padding: '6px 16px',
            fontSize: '0.75rem',
            color: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={13} color="var(--primary-600)" />
            <span>Dedicated assistant for LocalServe commercial service marketplace.</span>
          </div>

          {/* Messages Scroll Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'var(--bg-app)'
          }}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '100%'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    maxWidth: isUser ? '85%' : '92%',
                    flexDirection: isUser ? 'row-reverse' : 'row'
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isUser ? 'var(--primary-600)' : '#312e81',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: '4px'
                    }}>
                      {isUser ? <User size={15} /> : <Bot size={15} />}
                    </div>

                    {/* Bubble */}
                    <div style={{
                      background: isUser ? 'var(--primary-600)' : 'var(--bg-surface)',
                      color: isUser ? '#ffffff' : 'var(--text-primary)',
                      padding: '12px 16px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      boxShadow: 'var(--shadow-sm)',
                      border: isUser ? 'none' : '1px solid var(--border-light)',
                      fontSize: '0.88rem',
                      lineHeight: 1.5
                    }}>
                      {formatText(msg.text)}

                      {/* Embedded Booking Card */}
                      {msg.bookingCard && (
                        <div style={{
                          background: 'var(--bg-muted)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 14px',
                          marginTop: '12px',
                          border: '1px solid var(--border-light)',
                          fontSize: '0.84rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary-700)' }}>
                              #{msg.bookingCard.bookingNumber}
                            </span>
                            <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                              {msg.bookingCard.status}
                            </span>
                          </div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {msg.bookingCard.serviceName}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Workshop: <strong>{msg.bookingCard.providerName}</strong>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Assigned Tech: <strong>{msg.bookingCard.technicianName}</strong>
                          </div>
                          <button
                            onClick={() => handleActionClick(msg.bookingCard.trackingUrl)}
                            style={{
                              width: '100%',
                              padding: '6px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--primary-600)',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            Track Progress <ArrowRight size={13} />
                          </button>
                        </div>
                      )}

                      {/* Embedded Service Cards */}
                      {msg.serviceCards && msg.serviceCards.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                          {msg.serviceCards.map(s => (
                            <div
                              key={s.serviceId}
                              style={{
                                background: 'var(--bg-muted)',
                                borderRadius: 'var(--radius-md)',
                                padding: '10px 12px',
                                border: '1px solid var(--border-light)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <div>
                                <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)', display: 'block' }}>
                                  {s.serviceName}
                                </strong>
                                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                  {s.category} · {s.duration}
                                </span>
                                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '2px' }}>
                                  ₹{s.basePrice}
                                </div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <button
                                  onClick={() => handleActionClick(s.bookUrl)}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--primary-600)',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Book Now
                                </button>
                                <button
                                  onClick={() => handleActionClick(s.detailUrl)}
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'transparent',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--border-light)',
                                    fontSize: '0.72rem',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Details
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Embedded Provider Cards */}
                      {msg.providerCards && msg.providerCards.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                          {msg.providerCards.map(p => (
                            <div
                              key={p.providerId}
                              style={{
                                background: 'var(--bg-muted)',
                                borderRadius: 'var(--radius-md)',
                                padding: '10px 12px',
                                border: '1px solid var(--border-light)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <div>
                                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>
                                  {p.shopName}
                                </strong>
                                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                  {p.area} · ⭐ {p.rating}
                                </span>
                              </div>
                              <button
                                onClick={() => handleActionClick(p.shopUrl)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: 'var(--radius-sm)',
                                  background: 'var(--primary-600)',
                                  color: '#ffffff',
                                  border: 'none',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                View Shop
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Embedded Action Links */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                          {msg.actions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(act.url)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-sm)',
                                background: act.variant === 'primary' ? 'var(--primary-600)' : 'transparent',
                                color: act.variant === 'primary' ? '#ffffff' : 'var(--primary-700)',
                                border: act.variant === 'primary' ? 'none' : '1px solid var(--primary-300)',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>{act.label}</span>
                              <ExternalLink size={12} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <span style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    margin: '3px 36px 0 36px'
                  }}>
                    {msg.timestamp}
                  </span>

                  {/* Quick Replies Buttons */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                      marginTop: '8px',
                      marginLeft: '36px'
                    }}>
                      {msg.quickReplies.map((qr, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSend(qr)}
                          style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--primary-300)',
                            color: 'var(--primary-700)',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-50)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg-surface)';
                          }}
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#312e81',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  <Bot size={15} />
                </div>
                <div style={{
                  background: 'var(--bg-surface)',
                  padding: '10px 14px',
                  borderRadius: '16px 16px 16px 4px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginRight: '4px' }}>
                    LocalServe Assistant is typing
                  </span>
                  <span className="dot-pulse" style={{ width: '4px', height: '4px', background: 'var(--primary-600)', borderRadius: '50%', display: 'inline-block' }} />
                  <span className="dot-pulse" style={{ width: '4px', height: '4px', background: 'var(--primary-600)', borderRadius: '50%', display: 'inline-block', animationDelay: '0.2s' }} />
                  <span className="dot-pulse" style={{ width: '4px', height: '4px', background: 'var(--primary-600)', borderRadius: '50%', display: 'inline-block', animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '12px 14px',
              background: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('chatPlaceholder', 'Ask about services, booking status, maintenance...')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Send message"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: inputText.trim() ? 'var(--primary-600)' : 'var(--bg-muted)',
                color: inputText.trim() ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                cursor: inputText.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s ease'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
