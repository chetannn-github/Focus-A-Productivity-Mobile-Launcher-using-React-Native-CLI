import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { NativeModules } from 'react-native';

const { InstalledApps } = NativeModules;

const AppsList = () => {
  const [apps, setApps] = useState([]); // State to store the apps list

  useEffect(() => {
    // Get the installed apps when the component mounts
    InstalledApps.getInstalledApps()
      .then((apps) => {
        setApps(apps); 
      })
      .catch((error) => {
        console.error('Error fetching installed apps: ', error);
      });
  }, []);

  const openApp = (packageName) => {
    InstalledApps.openApp(packageName)
      .then((response) => {
        console.log(response); // Successfully opened app
      })
      .catch((error) => {
        console.error('Error opening app: ', error);
      });
  };

  return (
    <View style={styles.container}>
      {apps.length > 0 ? (
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
