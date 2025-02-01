import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeModules } from 'react-native';

const { InstalledApps } = NativeModules;

const AppsList = () => {
  const [apps, setApps] = useState([]); // State to store the apps list
  const [loading, setLoading] = useState(true);

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
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : apps.length > 0 ? (
        <FlatList
          data={apps}
          keyExtractor={(item) => item.packageName}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => openApp(item.packageName)}>
              <Text style={styles.appName}>{item.appName}</Text>
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
  },
  appName: {
    color: 'white',
    fontSize: 13,
    marginBottom: 24, // Add spacing between app names
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
