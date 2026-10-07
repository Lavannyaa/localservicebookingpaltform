import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { toggleChat, openChat, closeChat, addUserMessage, addBotResponse, clearChat } from '../store/slices/chatSlice';
import { services } from '../data/services';

export const useChatbot = () => {
  const dispatch = useDispatch();
  const { isOpen, messages, isTyping } = useSelector((state) => state.chat || { isOpen: false, messages: [], isTyping: false });

  const sendMessage = useCallback((query) => {
    if (!query || !query.trim()) return;
    const text = query.trim();
    dispatch(addUserMessage(text));

    // Simulate smart service-discovery assistant responses
    setTimeout(() => {
      const lower = text.toLowerCase();
      let responseText = '';
      let quickReplies = [];
      let recommendations = [];

      if (lower.includes('ac') || lower.includes('cooling') || lower.includes('gas') || lower.includes('filter')) {
        responseText = 'We have certified HVAC specialists for AC Jet Servicing, Compressor Diagnostics, and Freon Gas Refilling. Commercial workshops provide a 30-day performance warranty.';
        quickReplies = ['Book Split AC Jet Clean (₹799)', 'AC Gas Charging (₹2,200)', 'See AC Workshops'];
        recommendations = services.filter(s => s.category === 'AC & Appliances').slice(0, 3);
      } else if (lower.includes('plumb') || lower.includes('pipe') || lower.includes('leak') || lower.includes('drain')) {
        responseText = 'Plumbing emergency units are available across Tirunelveli and surrounding hubs for motorized snake drain cleaning and concealed pipe leak diagnostics.';
        quickReplies = ['Drain Clog Removal (₹449)', 'Pipe Leakage Repair (₹349)', 'Water Tank Cleaning'];
        recommendations = services.filter(s => s.category === 'Plumbing').slice(0, 3);
      } else if (lower.includes('electric') || lower.includes('wire') || lower.includes('mcb') || lower.includes('inverter')) {
        responseText = 'Our electrical workshops like Kumar Electricals specialize in 3-phase wiring, MCB tripping resolution, and inverter battery health checks.';
        quickReplies = ['MCB Tripping Fix (₹399)', 'Inverter Installation (₹899)', 'Ceiling Fan Rewinding'];
        recommendations = services.filter(s => s.category === 'Electrical').slice(0, 3);
      } else if (lower.includes('warranty') || lower.includes('guarantee')) {
        responseText = 'All standardized services booked on LocalServe carry an official 30-Day Platform Warranty. If any issue reoccurs within 30 days, re-inspection and touch-ups are free of charge.';
        quickReplies = ['View Service Passport', 'Track Active Booking', 'Find a Workshop'];
      } else if (lower.includes('track') || lower.includes('booking') || lower.includes('status')) {
        responseText = 'You can track active technicians, live ETA, and the digital service checklist directly from your My Bookings dashboard or the Service Lifecycle view.';
        quickReplies = ['Go to My Bookings', 'Open Service Passport', 'Contact Support Desk'];
      } else if (lower.includes('passport') || lower.includes('maintenance')) {
        responseText = 'Your Digital Service Passport records appliance serial numbers, technician diagnostic notes, before/after photos, and next preventive maintenance due dates.';
        quickReplies = ['View My Service Passport', 'Schedule Maintenance Plan'];
      } else {
        responseText = `I found several services matching "${text}". You can explore certified commercial workshops offering verified rates with upfront INR pricing.`;
        quickReplies = ['Browse All Categories', 'Nearby Workshops', 'Customer Support Desk'];
        recommendations = services.filter(s => 
          s.serviceName.toLowerCase().includes(lower) || 
          s.description.toLowerCase().includes(lower) ||
          s.category.toLowerCase().includes(lower)
        ).slice(0, 3);
      }

      dispatch(addBotResponse({
        text: responseText,
        quickReplies,
        recommendations
      }));
    }, 600);
  }, [dispatch]);

  return {
    isOpen,
    messages,
    isTyping,
    toggleChat: () => dispatch(toggleChat()),
    openChat: () => dispatch(openChat()),
    closeChat: () => dispatch(closeChat()),
    clearChat: () => dispatch(clearChat()),
    sendMessage
  };
};

export default useChatbot;
