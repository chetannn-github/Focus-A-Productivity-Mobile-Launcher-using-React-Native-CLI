import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { SettingsContext } from '../Context/SettingsContext';
import { NativeModules } from 'react-native';

const { InstalledApps } = NativeModules;

const AppsList = () => {
  const { showAppIcons, shuffleApps } = useContext(SettingsContext);
  const [apps, setApps] = useState([]); // State to store the apps list
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const apps = await InstalledApps.getInstalledApps();
      let sortedApps = apps;

      if (!shuffleApps) {
        // Sorting apps alphabetically by appName, ignoring case
        sortedApps = apps.sort((a, b) => a.appName.toLowerCase().localeCompare(b.appName.toLowerCase()));
      }

      setApps(sortedApps);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching installed apps: ', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps(); // Initial fetch

    // Polling every 5 seconds
    const intervalId = setInterval(fetchApps, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [shuffleApps, showAppIcons]);

  const openApp = (packageName) => {
    InstalledApps.openApp(packageName)
      .then(() => {
        console.log(`Opened: ${packageName}`); // Successfully opened app
      })
      .catch((error) => {
        console.error('Error opening app: ', error);
      });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : apps.length > 0 ? (
        <FlatList
          data={apps}
          bouncesZoom={true}
          bounces={true}
          keyExtractor={(item) => item.packageName}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => openApp(item.packageName)}>
              <View style={styles.appItem}>
                {showAppIcons && item.icon && (
                  <Image
                    source={{ uri: item.icon && item.icon !== "" ? `data:image/png;base64,${item.icon}` : "https://picsum.photos/200" }} 
                    style={styles.appIcon}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.appName}>{item.appName}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      ) : (
        <Text style={styles.noApps}>No apps found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 20,
    paddingHorizontal: 25,
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchText: {
    color: 'white',
    fontSize: 16,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 4,
  },
  appIcon: {
    width: 25,
    height: 27,
    marginRight: 10,
    
  },
  appName: {
    color: 'white',
    fontSize: 15,
  },
  noApps: {
    color: 'white',
    opacity: 0.7,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AppsList;