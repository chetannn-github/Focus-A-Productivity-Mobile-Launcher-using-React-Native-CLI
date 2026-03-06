import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useSettingsStore = create((set, get) => ({
  showAppIcons: true,
  shuffleApps: false,
  lockedUntil: 0,
  remainingTime: 0,
  selectedWallpaper: null,

  loadSettings: async () => {
    try {
      const storedShowAppIcons = await AsyncStorage.getItem('showAppIcons');
      const storedShuffleApps = await AsyncStorage.getItem('shuffleApps');
      const storedWallpaper = await AsyncStorage.getItem('selectedWallpaper');
      const storedLockedUntil = await AsyncStorage.getItem("lockedUntil");
      
      const lockedUntil = storedLockedUntil ? Number(storedLockedUntil) : 0;

      set({
        showAppIcons: storedShowAppIcons !== null ? storedShowAppIcons === 'true' : true,
        shuffleApps: storedShuffleApps !== null ? storedShuffleApps === 'true' : false,
        selectedWallpaper: storedWallpaper ? storedWallpaper : null,
        lockedUntil
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

  changeWallpaper: async (wallpaperUri) => {
    if (wallpaperUri === get().selectedWallpaper) return;
    set({ selectedWallpaper: wallpaperUri });
    await AsyncStorage.setItem('selectedWallpaper', wallpaperUri);
  }
}));

export default useSettingsStore;