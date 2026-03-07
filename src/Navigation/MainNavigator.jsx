import React, { useEffect, useState } from "react";
import { NativeModules, AppState, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LockScreen from "../Screens/LockScreen";
import { DrawerNavigator } from "./DrawerNavigator";
import useSettingsStore from "../store/useSettingStore";

// Dono native modules nikal lo
const { OverlayModule, ScreenLock } = NativeModules;

export const MainNavigator = () => {
  // State me dono permissions track karenge
  const [perms, setPerms] = useState({ overlay: null, admin: null }); 
  
  const { remainingTime, isLCLocked, lockedUntil } = useSettingsStore();
  
  const isTimeLocked = remainingTime > 0 || Date.now() < lockedUntil;
  const isCurrentlyLocked = isLCLocked || isTimeLocked;

  // 1. DONO PERMISSIONS CHECK KARNE KA LOGIC
  useEffect(() => {
    const checkAllPerms = async () => {
      if (OverlayModule && ScreenLock) {
        const hasOverlay = await OverlayModule.hasPermission();
        const hasAdmin = await ScreenLock.hasPermission();
        setPerms({ overlay: hasOverlay, admin: hasAdmin });
      }
    };

    checkAllPerms();

    // Jab user Settings me permission de kar wapas aaye toh auto-refresh
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkAllPerms();
      }
    });

    return () => subscription.remove();
  }, []);

  // 2. OVERLAY BLOCKER (Escape Preventer)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (isCurrentlyLocked && (nextAppState === 'background' || nextAppState === 'inactive')) {
        console.log("Escape Attempt! Force bringing to front...");
        if (OverlayModule && perms.overlay) {
          OverlayModule.bringToFront();
        }
      }
    });
    return () => subscription.remove();
  }, [isCurrentlyLocked, perms.overlay]);

  // Loading Screen (Shuru ke mili-seconds ke liye)
  if (perms.overlay === null || perms.admin === null) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  // --- SETUP SCREEN (Agar koi ek bhi permission bachi hai) ---
  if (!perms.overlay || !perms.admin) {
    return (
      <View style={styles.container}>
        <View style={styles.setupCard}>
          <Icon name="shield-checkmark" size={50} color="#FFF" style={{ marginBottom: 20 }} />
          <Text style={styles.title}>Welcome to Focus</Text>
          <Text style={styles.subtitle}>
            Please grant the required permissions to set up your ultimate distraction-free launcher.
          </Text>

          {/* OVERLAY PERMISSION ROW */}
          <View style={styles.permRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>Display Over Other Apps</Text>
              <Text style={styles.permDesc}>Prevents bypassing the lock screen.</Text>
            </View>
            {perms.overlay ? (
              <Icon name="checkmark-circle" size={28} color="#30D158" />
            ) : (
              <TouchableOpacity style={styles.grantBtn} onPress={() => OverlayModule.requestPermission()}>
                <Text style={styles.grantText}>Grant</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.permRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>Accessibility Service</Text>
              <Text style={styles.permDesc}>To lock screen without breaking fingerprint unlock.</Text>
            </View>
            {perms.admin ? ( // perms.admin variable name same rakh sakte ho
              <Icon name="checkmark-circle" size={28} color="#30D158" />
            ) : (
              <TouchableOpacity style={styles.grantBtn} onPress={() => ScreenLock.requestPermission()}>
                <Text style={styles.grantText}>Grant</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </View>
    );
  }

  // --- NORMAL FLOW (Jab dono permissions mil jayein) ---
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {isCurrentlyLocked ? <LockScreen /> : <DrawerNavigator />}
    </View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 80, // Upar rakha hai taki thoda elegant lage
    paddingHorizontal: 20,
  },
  setupCard: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    marginBottom: 15,
    width: '100%',
  },
  permTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  permDesc: {
    color: '#666',
    fontSize: 13,
  },
  grantBtn: {
    backgroundColor: '#0A84FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  grantText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  }
});