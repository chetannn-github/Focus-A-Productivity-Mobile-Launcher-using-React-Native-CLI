import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLeetCodeSolved } from '../utils/leetcode';

const useSettingsStore = create((set, get) => ({
  showAppIcons: true,
  shuffleApps: false,
  lockedUntil: 0,
  remainingTime: 0,
  selectedWallpaper: null,

  isLCLocked: false,
  lastLCCount: 0,
  lcUsername: "",
  isChecking: false,

  loadSettings: async () => {
    try {
      const storedShowAppIcons = await AsyncStorage.getItem('showAppIcons');
      const storedShuffleApps = await AsyncStorage.getItem('shuffleApps');
      const storedWallpaper = await AsyncStorage.getItem('selectedWallpaper');
      const storedLockedUntil = await AsyncStorage.getItem("lockedUntil");
      const storedLcUsername = await AsyncStorage.getItem("lcUsername");
      const storedIsLCLocked = await AsyncStorage.getItem("isLCLocked");
      const storedLastLCCount = await AsyncStorage.getItem("LC");

      
      const lockedUntil = storedLockedUntil ? Number(storedLockedUntil) : 0;

      set({
        showAppIcons: storedShowAppIcons !== null ? storedShowAppIcons === 'true' : true,
        shuffleApps: storedShuffleApps !== null ? storedShuffleApps === 'true' : false,
        selectedWallpaper: storedWallpaper ? storedWallpaper : null,
        lockedUntil,
        lcUsername: storedLcUsername || "",
        isLCLocked: storedIsLCLocked === "true",
        lastLCCount: storedLastLCCount ? Number(storedLastLCCount) : 0,
      });
    } catch (e) {
      console.error("Error loading settings", e);
    }
  },

  toggleAppIcons: async () => {
    const newValue = !get().showAppIcons;
    set({ showAppIcons: newValue }); // State update turant
    await AsyncStorage.setItem('showAppIcons', newValue.toString()); // Background me storage update
  },

  toggleShuffleApps: async () => {
    const newValue = !get().shuffleApps;
    set({ shuffleApps: newValue });
    await AsyncStorage.setItem('shuffleApps', newValue.toString());
  },


  lockForMinutes: async (minutes) => {
    const lockedUntil = Date.now() + minutes * 60 * 1000;
    set({ lockedUntil });
    get().setRemainingTime();

    await AsyncStorage.setItem(
      "lockedUntil",
      lockedUntil.toString()
    );
  },

  setRemainingTime : () => {
    const now = Date.now();
    const lockTime = new Date(get().lockedUntil).getTime();
    const diff = Math.floor((lockTime - now)/1000);
    set ({remainingTime : diff})
  },

  checkIsLocked: () => {
    const { lockedUntil } = get();
    return Date.now() < lockedUntil;
  },

  lockWithLeetCode: async (username) => {
    set({ isChecking: true }); // Start loading
    try {
      const targetUsername = username || get().lcUsername;
      const completedCount = await getLeetCodeSolved(targetUsername);      
      
      if (completedCount === undefined || completedCount === null) {
         throw new Error("Invalid username or API Error");
      }
      
      await AsyncStorage.setItem("LC", completedCount.toString());
      await AsyncStorage.setItem("isLCLocked", "true");
      await AsyncStorage.setItem("lcUsername", targetUsername);

      set({ 
        lastLCCount: completedCount, 
        isLCLocked: true,
        lcUsername: targetUsername,
        isChecking: false 
      });
      return true;
    } catch (e) {
      console.error("Failed to initiate LC Lock", e);
      set({ isChecking: false });
      return false; 
    }
  },

  checkLCUnlockStatus: async () => {
    set({ isChecking: true }); // Start loading
    try {
      const { lastLCCount, isLCLocked, lcUsername } = get();
      if (!isLCLocked) {
        set({ isChecking: false });
        return true; 
      }

      const targetUsername = lcUsername;
      const currentCount = await getLeetCodeSolved(targetUsername);

      if (currentCount > lastLCCount) {
        await AsyncStorage.setItem("isLCLocked", "false");
        set({ isLCLocked: false, isChecking: false });
        return true;
      }
      
      set({ isChecking: false });
      return false;
    } catch (e) {
      console.error("Error checking LC status", e);
      set({ isChecking: false });
      return false;
    }
  },

  changeWallpaper: async (wallpaperUri) => {
    if (wallpaperUri === get().selectedWallpaper) return;
    set({ selectedWallpaper: wallpaperUri });
    await AsyncStorage.setItem('selectedWallpaper', wallpaperUri);
  }
}));

export default useSettingsStore;