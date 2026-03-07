import React, { useEffect, useState } from "react";
import { NativeModules, AppState, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LockScreen from "../Screens/LockScreen";
import { DrawerNavigator } from "./DrawerNavigator";
import useSettingsStore from "../store/useSettingStore";

const { OverlayModule } = NativeModules;

export const MainNavigator = () => {
  const [hasOverlayPermission, setHasOverlayPermission] = useState(null); 
  const { remainingTime, isLCLocked, checkIsLocked} = useSettingsStore();
  const isTimeLocked = remainingTime > 0 || checkIsLocked();
  const isCurrentlyLocked = isLCLocked || isTimeLocked;
  
  useEffect(() => {
    const checkPerm = async () => {
      if (OverlayModule) {
        const granted = await OverlayModule.hasPermission();
        setHasOverlayPermission(granted);
      } else {
        console.warn("OverlayModule is not available.");
        setHasOverlayPermission(true);
      }
    };

    checkPerm();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkPerm();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (isCurrentlyLocked && (nextAppState === 'background' || nextAppState === 'inactive')) {
        console.log("Escape Attempt Detected! Force bringing to front...");
        if (OverlayModule) {
          OverlayModule.bringToFront();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isCurrentlyLocked]);

  if (hasOverlayPermission === null) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  if (!hasOverlayPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionCard}>
          <View style={styles.iconContainer}>
            <Icon name="layers" size={40} color="#FF9F0A" />
          </View>
          <Text style={styles.title}>Permission Required</Text>
          <Text style={styles.subtitle}>
            To prevent you from bypassing the lock screen and enforce strict focus, this launcher requires the "Display Over Other Apps" permission.
          </Text>
          <TouchableOpacity 
            onPress={() => OverlayModule.requestPermission()} 
            style={styles.primaryBtn}
          >
            <Text style={styles.btnText}>Open Settings to Grant</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {isCurrentlyLocked ? <LockScreen /> : <DrawerNavigator />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionCard: {
    backgroundColor: '#121212',
    width: '100%',
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF9F0A20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  primaryBtn: {
    backgroundColor: '#0A84FF',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});