import { createSlice } from '@reduxjs/toolkit';

const initialBotMessage = {
  id: 'msg-welcome',
  sender: 'bot',
  text: 'Hello! I am your LocalServe Assistant. How can I help you today? You can ask about AC repair, electrical wiring, booking status, or commercial workshops near you.',
  timestamp: new Date().toISOString(),
  quickReplies: [
    'Find AC Repair in Tirunelveli',
    'How does 30-Day Warranty work?',
    'Track my active booking',
    'Emergency plumbing near me'
  ]
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isOpen: false,
    messages: [initialBotMessage],
    isTyping: false,
    serviceRecommendations: []
  },
  reducers: {
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },
    openChat(state) {
      state.isOpen = true;
    },
    closeChat(state) {
      state.isOpen = false;
    },
    addUserMessage(state, action) {
      state.messages.push({
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: action.payload,
        timestamp: new Date().toISOString()
      });
      state.isTyping = true;
    },
    addBotResponse(state, action) {
      state.isTyping = false;
      state.messages.push({
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: action.payload.text,
        quickReplies: action.payload.quickReplies || [],
        serviceRecommendations: action.payload.recommendations || [],
        timestamp: new Date().toISOString()
      });
    },
    clearChat(state) {
      state.messages = [initialBotMessage];
      state.isTyping = false;
    }
  }
});

export const { toggleChat, openChat, closeChat, addUserMessage, addBotResponse, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
