import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('localserve_theme') || 'light');
  const [contrast, setContrast] = useState(() => localStorage.getItem('localserve_contrast') || 'normal');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('localserve_fontsize') || 'normal');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('localserve_motion') === 'true');

  // Handle Theme (light, dark, system)
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = () => {
        root.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      };
      
      applySystemTheme();
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', applySystemTheme);
        return () => mediaQuery.removeEventListener('change', applySystemTheme);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(applySystemTheme);
        return () => mediaQuery.removeListener(applySystemTheme);
      }
    } else {
      root.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('localserve_theme', theme);
  }, [theme]);

  // Handle Contrast (normal, high)
  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast);
    localStorage.setItem('localserve_contrast', contrast);
  }, [contrast]);

  // Handle Font Size Scaling (small, normal, large)
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('localserve_fontsize', fontSize);
  }, [fontSize]);

  // Handle Reduced Motion
  useEffect(() => {
    document.documentElement.setAttribute('data-reduced-motion', reducedMotion.toString());
    localStorage.setItem('localserve_motion', reducedMotion.toString());
  }, [reducedMotion]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      contrast,
      setContrast,
      fontSize,
      setFontSize,
      reducedMotion,
      setReducedMotion
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export default ThemeContext;
