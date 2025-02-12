import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, NativeEventEmitter, NativeModules, FlatList, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate, withSpring } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SettingsContext } from '../Context/SettingsContext';

const { InstalledApps } = NativeModules;
const installedAppsEmitter = new NativeEventEmitter(InstalledApps);

const AppsList = () => {
  const { showAppIcons, shuffleApps } = useContext(SettingsContext);
  const [apps, setApps] = useState([]);
  const [originalApps, setOriginalApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollY = useSharedValue(0);
  const screenHeight = Dimensions.get('window').height;

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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [-150, 0, 400], [-80, 0, 50]);
    return {
      transform: [{ translateY: withSpring(translateY, { damping: 1, stiffness: 1 }) }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : apps.length > 0 ? (
          <Animated.FlatList
            data={apps}
            keyExtractor={(item) => item.packageName}
            renderItem={({ item }) => (
              <View style={styles.appItem} onTouchEnd={() => openApp(item.packageName)}>
                {showAppIcons && item.icon && (
                  <Image
                    source={{ uri: item.icon ? `data:image/png;base64,${item.icon}` : "https://picsum.photos/200" }}
                    style={styles.appIcon}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.appName}>{item.appName}</Text>
              </View>
            )}
            onScroll={scrollHandler}
            scrollEventThrottle={15}
            contentContainerStyle={{
              minHeight: screenHeight - 50, // Ensure it always fills screen height
              paddingBottom: 20, // Extra space for bounce
            }}
            style={animatedStyle}
          />
        ) : (
          <Text style={styles.noApps}>No apps found</Text>
        )}
      </View>
    </GestureHandlerRootView>
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
