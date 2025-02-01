import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [showAppIcons, setShowAppIcons] = useState(false);
  const [shuffleApps, setShuffleApps] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedShowAppIcons = await AsyncStorage.getItem('showAppIcons') === 'true';
      const storedShuffleApps = await AsyncStorage.getItem('shuffleApps') === 'true';
      setShowAppIcons(storedShowAppIcons);
      setShuffleApps(storedShuffleApps);
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

  return (
    <SettingsContext.Provider value={{ showAppIcons, shuffleApps, toggleAppIcons, toggleShuffleApps }}>
      {children}
    </SettingsContext.Provider>
  );
};