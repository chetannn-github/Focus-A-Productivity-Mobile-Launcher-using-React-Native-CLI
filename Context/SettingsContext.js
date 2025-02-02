import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [showAppIcons, setShowAppIcons] = useState(false);
  const [shuffleApps, setShuffleApps] = useState(false);
  const [showLeetcodeStats, setShowLeetcodeStats] = useState(false);
  const [leetcodeUsername, setLeetcodeUsername] = useState(null);
  const [lockedTime, setLockedTime] = useState(4);

  useEffect(() => {
    const loadSettings = async () => {
      const storedShowAppIcons = await AsyncStorage.getItem('showAppIcons') === 'true';
      const storedShuffleApps = await AsyncStorage.getItem('shuffleApps') === 'true';
      const storedShowLeetcodeStats = await AsyncStorage.getItem('showLeetcodeStats') === 'true';
      const storedLeetcodeUsername = await AsyncStorage.getItem('leetcodeUsername');

      setLeetcodeUsername(storedLeetcodeUsername);
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

  const changeLeetcodeUsername = async (newUsername) => {
    setLeetcodeUsername(newUsername);
    await AsyncStorage.setItem('leetcodeUsername', newUsername);
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
    <SettingsContext.Provider value={{ showAppIcons, shuffleApps, showLeetcodeStats, toggleAppIcons, toggleShuffleApps, toggleLeetcodeStats, leetcodeUsername, changeLeetcodeUsername,lockedTime, setLockedTime }}>
      {children}
    </SettingsContext.Provider>
  );
};