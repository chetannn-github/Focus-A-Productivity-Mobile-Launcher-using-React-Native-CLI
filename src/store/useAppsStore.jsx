import { create } from 'zustand';
import { NativeModules } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { InstalledApps } = NativeModules;

const useApps = create((set, get) => ({
  masterApps: [],
  originalApps: [],
  hiddenApps: [], 
  loading: true,

  removeHiddenApps: async (fetchedApps) => {
    try {
      const savedHidden = await AsyncStorage.getItem('hiddenAppsList');
      if (savedHidden !== null) {
        const parsedHidden = JSON.parse(savedHidden);
        set({ hiddenApps: parsedHidden }); 
        
        return fetchedApps.filter(app => !parsedHidden.includes(app.packageName));
      }
      return fetchedApps;
    } catch (e) {
      console.error("Error loading hidden apps", e);
      return fetchedApps;
    }
  },

  hideApp: async (packageName) => {
    try {
      const { apps, originalApps } = get(); 
      const savedHidden = await AsyncStorage.getItem('hiddenAppsList');
      const parsedHidden = savedHidden != null ? JSON.parse(savedHidden) : [];

      const updatedList = [...parsedHidden, packageName];
      await AsyncStorage.setItem('hiddenAppsList', JSON.stringify(updatedList));
      const remainingApps = apps.filter(app => app.packageName !== packageName);
      const remainingOriginal = originalApps.filter(app => app.packageName !== packageName);

      set({ 
        hiddenApps: updatedList,
        apps: remainingApps,
        originalApps: remainingOriginal
      });

    } catch (e) {
      console.error("Error saving hidden apps", e);
    }
  },

  unhideApp: async (packageName, shuffleAppsStatus) => {
    try {
      const savedHidden = await AsyncStorage.getItem('hiddenAppsList');
      const parsedHidden = savedHidden != null ? JSON.parse(savedHidden) : [];
      
      const updatedList = parsedHidden.filter(pkg => pkg !== packageName);
      await AsyncStorage.setItem('hiddenAppsList', JSON.stringify(updatedList));
      set({ hiddenApps: updatedList });
      
      get().fetchApps(shuffleAppsStatus); 
    } catch (e) {
      console.error("Error unhiding app", e);
    }
  },

  fetchApps: async (shuffleAppsStatus = false, reason) => {

    console.log("FETCHING APPS", reason)
    if(reason !== "EVENT") set({ loading: true });
    try {
      const allApps = await InstalledApps.getInstalledApps();
      set({ masterApps: allApps }); 
      const visibleApps = await get().removeHiddenApps(allApps);

      set({ originalApps: visibleApps });
      get().updateAppsList(visibleApps, shuffleAppsStatus);
    } catch (error) {
      console.error('Error fetching installed apps: ', error);
      set({ loading: false });
    }
  },

  updateAppsList: (appList, shuffleAppsStatus) => {
    let updatedApps = [...appList];
    if (!shuffleAppsStatus) {
      updatedApps.sort((a, b) => a.appName.toLowerCase().localeCompare(b.appName.toLowerCase()));
    } else {
      updatedApps.sort(() => Math.random() - 0.5);
    }
    set({ apps: updatedApps, loading: false });
  },

  openApp: (packageName) => {
    InstalledApps.openApp(packageName)
      .then(() => console.log(`Opened: ${packageName}`))
      .catch((error) => console.error('Error opening app: ', error));
  }
}));

export default useApps;