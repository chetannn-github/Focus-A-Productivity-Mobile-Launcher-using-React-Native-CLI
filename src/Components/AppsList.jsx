import React, { useState, useEffect, useContext } from 'react';
import { View, Text, AppListstyleheet, ActivityIndicator, Image, NativeEventEmitter, NativeModules, FlatList, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SettingsContext } from '../Context/SettingsContext';
import { AppListstyle } from '../Stylesheets/AppListStyle';
import useApps from '../Hooks/useApps';


const { InstalledApps } = NativeModules;


const AppsList = () => {
  const installedAppsEmitter = new NativeEventEmitter(InstalledApps);
  const { shuffleApps } = useContext(SettingsContext);
  const {fetchApps, updateAppsList, openApp ,loading,apps,showAppIcons,originalApps} = useApps();

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
