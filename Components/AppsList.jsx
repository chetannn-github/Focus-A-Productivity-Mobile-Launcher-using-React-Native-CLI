import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, Image, Switch } from 'react-native';
import { NativeModules } from 'react-native';

const { InstalledApps } = NativeModules;

const AppsList = () => {
  const [apps, setApps] = useState([]); // State to store the apps list
  const [loading, setLoading] = useState(true);
  const [showIcons, setShowIcons] = useState(true); // Toggle to show/hide icons

  const fetchApps = () => {
    InstalledApps.getInstalledApps()
      .then((apps) => {
        // Sorting apps alphabetically by appName
        const sortedApps = apps.sort((a, b) => a.appName.localeCompare(b.appName));
        setApps(sortedApps);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching installed apps: ', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApps(); // Initial fetch

    // Polling every 5 seconds
    const intervalId = setInterval(fetchApps, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

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
      {/* Toggle Switch to Show/Hide Icons */}
      {/* <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Show Icons</Text>
        <Switch value={showIcons} onValueChange={setShowIcons} />
      </View> */}

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
                {showIcons  &&item.icon && (
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
    marginBottom: 9,
    
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
