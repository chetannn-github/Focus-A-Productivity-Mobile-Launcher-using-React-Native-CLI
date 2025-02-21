import { useContext, useState } from "react";
import { NativeModules } from "react-native";
import { SettingsContext } from "../Context/SettingsContext";



function useApps() {
    const { InstalledApps } = NativeModules;
    const [originalApps, setOriginalApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apps, setApps] = useState([]);
    const { showAppIcons, shuffleApps } = useContext(SettingsContext);

    const fetchApps = async () => {
        try {
          const apps = await InstalledApps.getInstalledApps();
          setOriginalApps(apps);
          updateAppsList(apps);
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


    return {fetchApps, updateAppsList, openApp ,loading,apps,showAppIcons,originalApps};

    
  
}

export default useApps