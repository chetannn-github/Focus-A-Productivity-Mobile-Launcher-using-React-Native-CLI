import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [showAppIcons, setShowAppIcons] = useState(false);
  const [shuffleApps, setShuffleApps] = useState(false);
  const [showLeetcodeStats, setShowLeetcodeStats] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedShowAppIcons = await AsyncStorage.getItem('showAppIcons') === 'true';
      const storedShuffleApps = await AsyncStorage.getItem('shuffleApps') === 'true';
      const storedShowLeetcodeStats = await AsyncStorage.getItem('showLeetcodeStats') === 'true';
      setShowAppIcons(storedShowAppIcons);
      setShuffleApps(storedShuffleApps);
      setShowLeetcodeStats(storedShowLeetcodeStats);
    };
    loadSettings();
  }, []);

  const toggleAppIcons = async () => {
    const newValue = !showAppIcons;
    setShowAppIcons(newValue);
    await AsyncStorage.setItem('showAppIcons', newValue.toString());
  };

  const toggleShuffleApps = async () => {
    const newValue = !shuffleApps;
    setShuffleApps(newValue);
    await AsyncStorage.setItem('shuffleApps', newValue.toString());
  };

  const toggleLeetcodeStats = async () => {
    const newValue = !showLeetcodeStats;
    setShowLeetcodeStats(newValue);
    await AsyncStorage.setItem('showLeetcodeStats', newValue.toString());
  };

  return (
    <SettingsContext.Provider value={{ showAppIcons, shuffleApps, showLeetcodeStats, toggleAppIcons, toggleShuffleApps, toggleLeetcodeStats }}>
      {children}
    </SettingsContext.Provider>
  );
};