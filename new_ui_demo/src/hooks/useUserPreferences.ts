import { useState, useEffect } from 'react';

interface UserPreferences {
  commentarySpeed: 'slow' | 'normal' | 'fast';
  commentaryStyle: 'professional' | 'casual' | 'energetic';
  autoPlay: boolean;
  soundEffects: boolean;
  theme: 'dark' | 'light' | 'auto';
  animations: boolean;
  compactMode: boolean;
  showPlayerNumbers: boolean;
  goalNotifications: boolean;
  periodNotifications: boolean;
  socialNotifications: boolean;
  gameStartNotifications: boolean;
  analytics: boolean;
  personalizedContent: boolean;
  shareData: boolean;
}

const defaultPreferences: UserPreferences = {
  commentarySpeed: 'normal',
  commentaryStyle: 'professional',
  autoPlay: true,
  soundEffects: true,
  theme: 'dark',
  animations: true,
  compactMode: false,
  showPlayerNumbers: true,
  goalNotifications: true,
  periodNotifications: true,
  socialNotifications: false,
  gameStartNotifications: true,
  analytics: true,
  personalizedContent: true,
  shareData: false,
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('nhl-commentary-preferences');
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('nhl-commentary-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    updatePreference,
    resetPreferences,
  };
};