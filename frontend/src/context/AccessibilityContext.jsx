import React, { createContext, useState, useEffect } from 'react';

export const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [largeText, setLargeText] = useState(localStorage.getItem('lsb_largeText') === 'true');
  const [highContrast, setHighContrast] = useState(localStorage.getItem('lsb_highContrast') === 'true');

  useEffect(() => {
    document.documentElement.style.fontSize = largeText ? '18px' : '16px';
    localStorage.setItem('lsb_largeText', largeText);
  }, [largeText]);

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', highContrast ? 'high' : 'normal');
    localStorage.setItem('lsb_highContrast', highContrast);
  }, [highContrast]);

  return (
    <AccessibilityContext.Provider value={{ largeText, setLargeText, highContrast, setHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}
