import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Text, ActivityIndicator, Image, NativeEventEmitter, NativeModules, 
  SafeAreaView, TouchableOpacity, View, StyleSheet, Animated 
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlashList } from "@shopify/flash-list"; 
import Ionicons from 'react-native-vector-icons/Ionicons'; 
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
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; 
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

  // 🔥 SMOOTH ANIMATION LOGIC
  const toggleScrollTop = (visible) => {
    if (visible !== showScrollTop) {
      setShowScrollTop(visible);
      Animated.spring(fadeAnim, {
        toValue: visible ? 1 : 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={AppListstyle.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0A84FF" />
        ) : apps.length > 0 ? (
          <View style={{ flex: 1 }}>
            <FlashList
              ref={flatListRef}
              data={apps} 
              drawDistance={2000} 
              keyExtractor={(item) => item.packageName}
              estimatedItemSize={ITEM_HEIGHT}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16} 
              
              onScroll={(event) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                if (offsetY > 400 && !showScrollTop) toggleScrollTop(true);
                else if (offsetY <= 400 && showScrollTop) toggleScrollTop(false);
              }}

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
              getItemLayout={(data, index) => (
                { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
              )}
              bounces={true}  
              overScrollMode="always"
              contentContainerStyle={{ paddingBottom: 80, paddingRight: 60 }} 
            />

            {!shuffleApps && <AlphabetNavigator 
              processedApps={apps} 
              flatListRef={flatListRef} 
            />}

            <Animated.View style={[extraStyles.scrollTopContainer, { 
                opacity: fadeAnim, 
                transform: [{ 
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  }) 
                }] 
            }]}>
              <TouchableOpacity 
                style={extraStyles.scrollTopButton} 
                onPress={scrollToTop}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-up" size={24} color="#0A84FF" />
              </TouchableOpacity>
            </Animated.View>

          </View>
        ) : (
          <Text style={AppListstyle.noApps}>No apps found</Text>
        )}
      </SafeAreaView>
      <AppInfoModal selectedApp={selectedApp} isSheetVisible={isSheetVisible} closeSheet={closeSheet} hideApp={hideApp}/>
    </GestureHandlerRootView>
  );
};

const extraStyles = StyleSheet.create({
  scrollTopContainer: {
    position: 'absolute',
    bottom: 25, 
    right: 20,
    zIndex: 10,
  },
  scrollTopButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  }
});

export default AppsList;