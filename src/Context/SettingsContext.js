import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [showAppIcons, setShowAppIcons] = useState(true);
  const [shuffleApps, setShuffleApps] = useState(false);
  const [lockedTime, setLockedTime] = useState(0);
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      const storedShowAppIcons = await AsyncStorage.getItem('showAppIcons') === 'true';
      const storedShuffleApps = await AsyncStorage.getItem('shuffleApps') === 'true';
      const storedWallpaper = await AsyncStorage.getItem('selectedWallpaper'); // Load wallpaper

      setShowAppIcons(storedShowAppIcons);
      setShuffleApps(storedShuffleApps);
     
      if (storedWallpaper) setSelectedWallpaper(storedWallpaper); // Set wallpaper if found
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

  
  // Function to change and save wallpaper in local storage
  const changeWallpaper = async (wallpaperUri) => {
    if(wallpaperUri === selectedWallpaper) return;
    console.log("changing wallpapapers")
    // const newValue = parseInt(wallpaperUri)+ 1;
    // const stringVal = newValue.toString();
    console.log(typeof(wallpaperUri));
    
    await AsyncStorage.setItem('selectedWallpaper', wallpaperUri);
    setSelectedWallpaper(wallpaperUri);
  };

  return (
    <SettingsContext.Provider value={{
      showAppIcons,
      shuffleApps,
      
      toggleAppIcons,
      toggleShuffleApps,
      lockedTime,
      setLockedTime,
      selectedWallpaper,
      changeWallpaper
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
