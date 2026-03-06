import { useContext, useState } from "react";
import { NativeModules } from "react-native";
import { SettingsContext } from "../Context/SettingsContext";
import AsyncStorage from '@react-native-async-storage/async-storage';


function useApps() {
    const { InstalledApps } = NativeModules;
    const [originalApps, setOriginalApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apps, setApps] = useState([]);
    const { showAppIcons, shuffleApps } = useContext(SettingsContext);
    const [hiddenApps, setHiddenApps] = useState([]);

    const removeHiddenApps = async (apps) => {
      try {
        const savedHidden = await AsyncStorage.getItem('hiddenAppsList');
        console.log("SAVED HIDDEN",savedHidden);
        if (savedHidden !== null) {
          const parsedHidden = JSON.parse(savedHidden);

          setHiddenApps(parsedHidden);
          const visibleApps = apps.filter(
            app => !parsedHidden.includes(app.packageName)
          );
          return visibleApps;
        }
        return apps;
      } catch (e) {
        console.error("Error loading hidden apps", e);
      }
    };

    const hideApp = async (packageName) => {
    try {
      const savedHidden = await AsyncStorage.getItem('hiddenAppsList');
      const parsedHidden = savedHidden != null ? JSON.parse(savedHidden) : [];

      const updatedList = [...parsedHidden, packageName];
      await AsyncStorage.setItem('hiddenAppsList', JSON.stringify(updatedList));
      setHiddenApps(updatedList);

      const remainingApps = apps.filter(app => app.packageName !== packageName);
      setApps(remainingApps); 
      setOriginalApps(remainingApps);

    } catch (e) {
      console.error("Error saving hidden apps", e);
    }
    };

    const fetchApps = async () => {
        try {
          const apps = await InstalledApps.getInstalledApps();
          const visibleApps = await removeHiddenApps(apps);

          setOriginalApps(visibleApps);
          updateAppsList(visibleApps);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching installed apps: ', error);
          setLoading(false);
        }
    };

    const updateAppsList = (appList) => {
        let updatedApps = [...appList];
        if (!shuffleApps) {
          updatedApps.sort((a, b) => a.appName.toLowerCase().localeCompare(b.appName.toLowerCase()));
        } else {
          updatedApps.sort(() => Math.random() - 0.5);
        }
        setApps(updatedApps);
    };

    const openApp = (packageName) => {
        InstalledApps.openApp(packageName)
          .then(() => console.log(`Opened: ${packageName}`))
          .catch((error) => console.error('Error opening app: ', error));
    };


    return {fetchApps, updateAppsList, openApp ,loading,apps,showAppIcons,originalApps, hideApp, hiddenApps};

    
  
}

export default useApps