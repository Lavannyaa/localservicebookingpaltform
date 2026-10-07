import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { settingsService, getDefaultSettingsForRole } from '../services/settingsService';

export const useUserSettings = (customRole) => {
  const auth = useSelector((state) => state.auth || {});
  const user = auth.user || {};
  const activeRole = customRole || auth.role || user.role || 'customer';
  const userId = user.userId || user.id || (user.email ? user.email.replace(/[@.]/g, '_') : 'guest');

  // Context APIs
  const {
    theme, setTheme,
    contrast, setContrast,
    fontSize, setFontSize,
    reducedMotion, setReducedMotion
  } = useTheme();

  const { language, setLanguage, languages } = useLanguage();

  const [settings, setSettings] = useState(() => getDefaultSettingsForRole(activeRole, user));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Load settings on mount or user change
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    settingsService.getSettings(userId, activeRole, user).then((loaded) => {
      if (mounted) {
        setSettings(loaded);
        // Synchronize Appearance with Context API if mismatch
        if (loaded.appearance?.theme && loaded.appearance.theme !== theme) {
          setTheme(loaded.appearance.theme);
        }
        // Synchronize Language with Context API if mismatch
        if (loaded.language?.code && loaded.language.code !== language) {
          setLanguage(loaded.language.code);
        }
        // Synchronize Accessibility with Context API if mismatch
        if (loaded.accessibility) {
          if (loaded.accessibility.fontSize && loaded.accessibility.fontSize !== fontSize) {
            setFontSize(loaded.accessibility.fontSize);
          }
          const isHighContrast = contrast === 'high';
          if (loaded.accessibility.highContrast !== isHighContrast) {
            setContrast(loaded.accessibility.highContrast ? 'high' : 'normal');
          }
          if (loaded.accessibility.reducedMotion !== reducedMotion) {
            setReducedMotion(loaded.accessibility.reducedMotion);
          }
        }
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [userId, activeRole]);

  // Section update helper
  const updateSection = useCallback((section, values) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          ...values
        }
      };
      return updated;
    });
  }, []);

  // Dedicated section handlers
  const updateAccount = useCallback((accountData) => {
    setSettings((prev) => {
      const updated = { ...prev, account: { ...prev.account, ...accountData } };
      settingsService.saveSettings(userId, updated);
      showFeedback('success', 'Account details updated successfully!');
      return updated;
    });
  }, [userId]);

  const updateAppearance = useCallback((newTheme) => {
    setTheme(newTheme);
    setSettings((prev) => {
      const updated = { ...prev, appearance: { theme: newTheme } };
      settingsService.saveSettings(userId, updated);
      showFeedback('success', `Appearance switched to ${newTheme} mode.`);
      return updated;
    });
  }, [userId, setTheme]);

  const updateLanguageSetting = useCallback((langCode) => {
    setLanguage(langCode);
    setSettings((prev) => {
      const updated = { ...prev, language: { code: langCode } };
      settingsService.saveSettings(userId, updated);
      showFeedback('success', 'Language preference saved successfully!');
      return updated;
    });
  }, [userId, setLanguage]);

  const updateNotifications = useCallback((notifData) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        notifications: {
          ...prev.notifications,
          ...notifData
        }
      };
      settingsService.saveSettings(userId, updated);
      showFeedback('success', 'Notification preferences saved!');
      return updated;
    });
  }, [userId]);

  const updatePrivacy = useCallback((privacyData) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        privacy: {
          ...prev.privacy,
          ...privacyData
        }
      };
      settingsService.saveSettings(userId, updated);
      showFeedback('success', 'Privacy and data preferences updated!');
      return updated;
    });
  }, [userId]);

  const updateAccessibility = useCallback((accData) => {
    if (accData.fontSize) setFontSize(accData.fontSize);
    if (accData.highContrast !== undefined) setContrast(accData.highContrast ? 'high' : 'normal');
    if (accData.reducedMotion !== undefined) setReducedMotion(accData.reducedMotion);

    setSettings((prev) => {
      const updated = {
        ...prev,
        accessibility: {
          ...prev.accessibility,
          ...accData
        }
      };
      settingsService.saveSettings(userId, updated);
      showFeedback('success', 'Accessibility settings updated!');
      return updated;
    });
  }, [userId, setFontSize, setContrast, setReducedMotion]);

  const updatePreferences = useCallback((prefData) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...prefData
        }
      };
      settingsService.saveSettings(userId, updated);
      showFeedback('success', 'Role-specific operational preferences saved!');
      return updated;
    });
  }, [userId]);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    try {
      setSaving(true);
      await settingsService.changePassword(userId, { currentPassword, newPassword });
      showFeedback('success', 'Password successfully changed and encrypted!');
      return { success: true };
    } catch (err) {
      showFeedback('error', err.message || 'Failed to update password');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [userId]);

  const toggleOAuth = useCallback(async (provider = 'google', link = true) => {
    try {
      const res = await settingsService.toggleOAuthProvider(userId, provider, link, user.email);
      if (res.success) {
        setSettings((prev) => ({
          ...prev,
          security: {
            ...prev.security,
            oauthLinked: res.oauthLinked
          }
        }));
        showFeedback('success', link ? 'Google OAuth connected successfully!' : 'Google OAuth unlinked.');
      }
    } catch (err) {
      showFeedback('error', 'OAuth operation failed');
    }
  }, [userId, user.email]);

  const terminateSession = useCallback(async (sessionId) => {
    const res = await settingsService.terminateSession(userId, sessionId);
    if (res.success) {
      setSettings((prev) => ({
        ...prev,
        security: {
          ...prev.security,
          sessions: res.sessions
        }
      }));
      showFeedback('success', 'Session terminated successfully.');
    }
  }, [userId]);

  const terminateAllOtherSessions = useCallback(async () => {
    const res = await settingsService.terminateAllOtherSessions(userId);
    if (res.success) {
      setSettings((prev) => ({
        ...prev,
        security: {
          ...prev.security,
          sessions: res.sessions
        }
      }));
      showFeedback('success', 'All other active sessions revoked.');
    }
  }, [userId]);

  const exportUserData = useCallback(async () => {
    const data = await settingsService.exportUserData(userId, activeRole);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `localserve-user-data-${userId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showFeedback('success', 'Data export downloaded successfully!');
  }, [userId, activeRole]);

  const saveAll = useCallback(async () => {
    setSaving(true);
    await settingsService.saveSettings(userId, settings);
    setSaving(false);
    showFeedback('success', 'All settings and preferences saved successfully!');
  }, [userId, settings]);

  return {
    settings,
    loading,
    saving,
    feedback,
    activeRole,
    userId,
    // Context Values
    theme,
    language,
    languages,
    contrast,
    fontSize,
    reducedMotion,
    // Updaters
    updateAccount,
    updateAppearance,
    updateLanguage: updateLanguageSetting,
    updateNotifications,
    updatePrivacy,
    updateAccessibility,
    updatePreferences,
    changePassword,
    toggleOAuth,
    terminateSession,
    terminateAllOtherSessions,
    exportUserData,
    saveAll
  };
};

export default useUserSettings;
