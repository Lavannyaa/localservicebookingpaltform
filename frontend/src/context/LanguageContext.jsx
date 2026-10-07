import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en.json';
import ta from '../translations/ta.json';
import hi from '../translations/hi.json';
import te from '../translations/te.json';
import ml from '../translations/ml.json';

const dictionaries = { en, ta, hi, te, ml };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('localserve_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('localserve_lang', language);
  }, [language]);

  const t = (key) => {
    const dict = dictionaries[language] || dictionaries.en;
    return dict[key] || dictionaries.en[key] || key;
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' }
  ];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
