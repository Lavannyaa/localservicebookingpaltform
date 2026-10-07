import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider } from './context/ToastContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AccessibilityProvider>
          <LanguageProvider>
            <ToastProvider>
              <AuthProvider>
                <BookingProvider>
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </BookingProvider>
              </AuthProvider>
            </ToastProvider>
          </LanguageProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </Provider>
  );
}
