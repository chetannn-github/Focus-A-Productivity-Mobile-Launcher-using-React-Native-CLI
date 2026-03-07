import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Text, ActivityIndicator, Image, NativeEventEmitter, NativeModules, 
  FlatList, SafeAreaView, TouchableOpacity, View 
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppListstyle } from '../Stylesheets/AppListStyle';
import useApps from '../store/useAppsStore';
import AppInfoModal from './AppInfoModal';
import useSettingsStore from '../store/useSettingStore';
import AlphabetNavigator from './AppList/AlphabetNavigator';

const { InstalledApps } = NativeModules;
const ITEM_HEIGHT = 56; 

const AppsList = () => {
  const installedAppsEmitter = new NativeEventEmitter(InstalledApps);
  const { shuffleApps, showAppIcons } = useSettingsStore();
  const { fetchApps, openApp, loading, apps, hideApp } = useApps();
  const [selectedApp, setSelectedApp] = useState(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const flatListRef = useRef(null);

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
      fetchApps(shuffleApps, "EVENT");
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    fetchApps(shuffleApps, "SHUFFLE APPS");
  }, [shuffleApps]);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={AppListstyle.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0A84FF" />
        ) : apps.length > 0 ? (
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={apps} 
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.packageName}
              getItemLayout={(data, index) => (
                { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
              )}
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
              contentContainerStyle={{ paddingBottom: 60, paddingRight: 60 }} 
            />

            {!shuffleApps && <AlphabetNavigator 
              processedApps={apps} 
              flatListRef={flatListRef} 
            />}

          </View>
        ) : (
          <Text style={AppListstyle.noApps}>No apps found</Text>
        )}
      </SafeAreaView>
      <AppInfoModal selectedApp={selectedApp} isSheetVisible={isSheetVisible} closeSheet={closeSheet} hideApp={hideApp}/>
    </GestureHandlerRootView>
  );
};



export default AppsList;
