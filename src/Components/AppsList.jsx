import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator, Image, NativeEventEmitter, NativeModules, FlatList, SafeAreaView, TouchableOpacity, StyleSheet, Modal, Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppListstyle } from '../Stylesheets/AppListStyle';
import useApps from '../store/useAppsStore';
import AppInfoModal from './AppInfoModal';
import useSettingsStore from '../store/useSettingStore';


const { InstalledApps } = NativeModules;


const AppsList = () => {
  const installedAppsEmitter = new NativeEventEmitter(InstalledApps);
  const { shuffleApps } = useSettingsStore();
  const { fetchApps, openApp, loading, apps, hideApp } = useApps();
  const [selectedApp, setSelectedApp] = useState(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const { showAppIcons } = useSettingsStore();
  
  const handleLongPress = (app) => {
    setSelectedApp(app);
    setIsSheetVisible(true);
  };

  const closeSheet = () => {
    setIsSheetVisible(false);
    setSelectedApp(null);
  };

  useEffect(() => {
    const subscription = installedAppsEmitter.addListener('appListUpdated', () => {
      fetchApps(shuffleApps);
    });
    return () => subscription.remove();
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
              <TouchableOpacity 
                style={AppListstyle.appItem} 
                activeOpacity={0.7}
                onPress={() => openApp(item.packageName)}
                onLongPress={() => handleLongPress(item)}
              >
                {showAppIcons && item.icon && (
                  <Image
                    source={{ uri: `data:image/png;base64,${item.icon}` }}
                    style={AppListstyle.appIcon}
                    resizeMode="contain"
                  />
                )}
                <Text style={AppListstyle.appName}>{item.appName}</Text>
              </TouchableOpacity>
            )}
            bounces={true}  
            overScrollMode="always"
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text style={AppListstyle.noApps}>No apps found</Text>
        )}
      </SafeAreaView>
      <AppInfoModal selectedApp={selectedApp} isSheetVisible={isSheetVisible} closeSheet={closeSheet} hideApp={hideApp}/>
    </GestureHandlerRootView>
  );
};



export default AppsList;
