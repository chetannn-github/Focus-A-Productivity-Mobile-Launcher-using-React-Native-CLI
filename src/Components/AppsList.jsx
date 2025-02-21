import React, { useState, useEffect, useContext } from 'react';
import { View, Text, AppListstyleheet, ActivityIndicator, Image, NativeEventEmitter, NativeModules, FlatList, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SettingsContext } from '../Context/SettingsContext';
import { AppListstyle } from '../Stylesheets/AppListStyle';


const { InstalledApps } = NativeModules;


const AppsList = () => {
  const installedAppsEmitter = new NativeEventEmitter(InstalledApps);
  const { showAppIcons, shuffleApps } = useContext(SettingsContext);
  const [apps, setApps] = useState([]);
  const [originalApps, setOriginalApps] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchApps();
    const subscription = installedAppsEmitter.addListener('appListUpdated', () => {
      fetchApps();
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    updateAppsList(originalApps);
  }, [shuffleApps]);

  const openApp = (packageName) => {
    InstalledApps.openApp(packageName)
      .then(() => console.log(`Opened: ${packageName}`))
      .catch((error) => console.error('Error opening app: ', error));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={AppListstyle.container}>
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : apps.length > 0 ? (
          <FlatList
            data={apps}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.packageName}
            renderItem={({ item }) => (
              <View style={AppListstyle.appItem} onTouchEnd={() => openApp(item.packageName)}>
                {showAppIcons && item.icon && (
                  <Image
                    source={{ uri: item.icon ? `data:image/png;base64,${item.icon}` : "https://picsum.photos/200" }}
                    style={AppListstyle.appIcon}
                    resizeMode="contain"
                  />
                )}
                <Text style={AppListstyle.appName}>{item.appName}</Text>
              </View>
            )}
            bounces={true}  // iOS bounce enable
            overScrollMode="always"  // Android bounce enable
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text style={AppListstyle.noApps}>No apps found</Text>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};



export default AppsList;
