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
  questionsToSolve: 1, 
  lcStats: { total: 0, easy: 0, medium: 0, hard: 0 },
  showLCStats: true,

  perms: { overlay: null, admin: null },
  setPerms: (newPerms) => set({ perms: newPerms }),
  favLanguage: 'python', 

  setFavLanguage: async (lang) => {
    const formattedLang = lang.toLowerCase();
    set({ favLanguage: formattedLang });
    try {
      await AsyncStorage.setItem('favLanguage', formattedLang);
    } catch (e) {
      console.error("Failed to save language", e);
    }
  },

  loadSettings: async () => {
    try {
      const storedShowAppIcons = await AsyncStorage.getItem('showAppIcons');
      const storedShuffleApps = await AsyncStorage.getItem('shuffleApps');
      const storedWallpaper = await AsyncStorage.getItem('selectedWallpaper');
      const storedLockedUntil = await AsyncStorage.getItem("lockedUntil");
      const storedLcUsername = await AsyncStorage.getItem("lcUsername");
      const storedIsLCLocked = await AsyncStorage.getItem("isLCLocked");
      const storedLastLCCount = await AsyncStorage.getItem("LC");
      const storedQuestionsToSolve = await AsyncStorage.getItem("questionsToSolve"); // Load new state
      const storedLcStats = await AsyncStorage.getItem("lcStats");
      const storedShowLCStats = await AsyncStorage.getItem('showLCStats');
      const lockedUntil = storedLockedUntil ? Number(storedLockedUntil) : 0;
      const storedFavLanguage = await AsyncStorage.getItem('favLanguage');

      const now = Date.now();
      const initialRemaining = Math.max(0, Math.floor((lockedUntil - now) / 1000));

      set({
        showAppIcons: storedShowAppIcons !== null ? storedShowAppIcons === 'true' : true,
        shuffleApps: storedShuffleApps !== null ? storedShuffleApps === 'true' : false,
        selectedWallpaper: storedWallpaper ? storedWallpaper : null,
        lockedUntil,
        remainingTime: initialRemaining,
        lcUsername: storedLcUsername || "",
        isLCLocked: storedIsLCLocked === "true",
        lastLCCount: storedLastLCCount ? Number(storedLastLCCount) : 0,
        questionsToSolve: storedQuestionsToSolve ? Number(storedQuestionsToSolve) : 1, // Default to 1
        lcStats: storedLcStats ? JSON.parse(storedLcStats) : { total: 0, easy: 0, medium: 0, hard: 0 },
        showLCStats: storedShowLCStats !== null ? storedShowLCStats === 'true' : true,
        favLanguage: storedFavLanguage || 'python',
      });
    } catch (e) {
      console.error("Error loading settings", e);
    }
  },

  toggleAppIcons: async () => {
    const newValue = !get().showAppIcons;
    set({ showAppIcons: newValue }); 
    await AsyncStorage.setItem('showAppIcons', newValue.toString()); 
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
    const diff = Math.max(0,Math.floor((lockTime - now)/1000));
    set ({remainingTime : diff})
  },

  checkIsLocked: () => {
    const { lockedUntil } = get();
    return Date.now() < lockedUntil;
  },

  lockWithLeetCode: async (username, numQuestions = 1) => {
    set({ isChecking: true }); 
    try {
     const targetUsername = username || get().lcUsername;
      const stats = await getLeetCodeSolved(targetUsername); // Now returns an object      
      
      if (!stats || stats.total === undefined) {
         throw new Error("Invalid username or API Error");
      }
      
      await AsyncStorage.setItem("LC", stats.total.toString());
      await AsyncStorage.setItem("lcStats", JSON.stringify(stats)); // Store full stats
      await AsyncStorage.setItem("isLCLocked", "true");
      await AsyncStorage.setItem("lcUsername", targetUsername);
      await AsyncStorage.setItem("questionsToSolve", numQuestions.toString()); 

      set({ 
        lastLCCount: stats.total, 
        lcStats: stats, // Set in state
        isLCLocked: true,
        lcUsername: targetUsername,
        questionsToSolve: numQuestions,
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
    set({ isChecking: true }); 
    try {
      const { lastLCCount, isLCLocked, lcUsername, questionsToSolve } = get();
      if (!isLCLocked) {
        set({ isChecking: false });
        return { unlocked: true, solved: 0, needed: questionsToSolve }; 
      }

      const currentStats = await getLeetCodeSolved(lcUsername);
      if (!currentStats) throw new Error("API failed");

      const solvedCount = currentStats.total - lastLCCount;

      if (currentStats.total >= lastLCCount + questionsToSolve) {
        await AsyncStorage.setItem("isLCLocked", "false");
        set({ isLCLocked: false, isChecking: false, lcStats: currentStats }); // Update stats on unlock
        return { unlocked: true, solved: solvedCount, needed: questionsToSolve }; 
      }
      
      // Update stats silently even if still locked (so user sees live progress)
      await AsyncStorage.setItem("lcStats", JSON.stringify(currentStats));
      set({ lcStats: currentStats, isChecking: false });
      
      return { unlocked: false, solved: solvedCount, needed: questionsToSolve };
    } catch (e) {
      console.error("Error checking LC status", e);
      set({ isChecking: false });
      return { unlocked: false, solved: 0, needed: get().questionsToSolve };
    }
  },

  changeWallpaper: async (wallpaperUri) => {
    if (wallpaperUri === get().selectedWallpaper) return;
    set({ selectedWallpaper: wallpaperUri });
    await AsyncStorage.setItem('selectedWallpaper', wallpaperUri);
  },
  toggleLCStats: async () => {
    const newValue = !get().showLCStats;
    set({ showLCStats: newValue });
    await AsyncStorage.setItem('showLCStats', newValue.toString());
  },

  verifyAndSetLCUsername: async (username) => {
    set({ isChecking: true }); 
    try {
      const targetUsername = username;
      const stats = await getLeetCodeSolved(targetUsername);   
      
      if (!stats || stats.total === undefined) {
        throw new Error("Invalid username or API Error");
      }
      
      await AsyncStorage.setItem("LC", stats.total.toString());
      await AsyncStorage.setItem("lcStats", JSON.stringify(stats)); // Store full stats
      await AsyncStorage.setItem("lcUsername", targetUsername);
      
      set({ 
        lastLCCount: stats.total, 
        lcStats: stats, // Set in state
        lcUsername: targetUsername,
        isChecking: false 
      });
      return true;
    } catch (e) {
      set({ isChecking: false });
      return false; 
    }
  }
}));

export default useSettingsStore;