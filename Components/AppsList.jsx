import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { SettingsContext } from '../Context/SettingsContext';
import { NativeModules } from 'react-native';

const { InstalledApps } = NativeModules;

const AppsList = () => {
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
    let updatedApps = appList;
    if (!shuffleApps) {
      updatedApps = [...appList].sort((a, b) => a.appName.toLowerCase().localeCompare(b.appName.toLowerCase()));
    } else {
      updatedApps = [...appList].sort(() => Math.random() - 0.5);
    }
    setApps(updatedApps);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    updateAppsList(originalApps);
  }, [shuffleApps]);

  const openApp = (packageName) => {
    InstalledApps.openApp(packageName)
      .then(() => {
        console.log(`Opened: ${packageName}`);
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
          keyExtractor={(item) => item.packageName}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => openApp(item.packageName)}>
              <View style={styles.appItem}>
                {showAppIcons && item.icon && (
                  <Image
                    source={{ uri: item.icon ? `data:image/png;base64,${item.icon}` : "https://picsum.photos/200" }} 
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
    paddingBottom: 25,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    
    paddingVertical: 10,
    marginBottom: 4,
    width: '100%',
  },
  appIcon: {
    width: 27,
    height: 27,
    marginRight: 10,
    // borderRadius:60,
    
  },
  appName: {
    color: 'white',
    fontSize: 15,
    opacity: 0.9,
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
