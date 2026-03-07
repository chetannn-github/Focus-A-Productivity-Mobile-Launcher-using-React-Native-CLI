import React, { useEffect, useState } from "react";
import { 
  NativeModules, AppState, View, Text, TouchableOpacity, 
  StyleSheet, ActivityIndicator, TextInput, KeyboardAvoidingView, 
  Platform, Keyboard, Modal, TouchableWithoutFeedback, 
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LockScreen from "../Screens/LockScreen";
import { DrawerNavigator } from "./DrawerNavigator";
import useSettingsStore from "../store/useSettingStore";

const { OverlayModule, ScreenLock } = NativeModules;

export const MainNavigator = () => {
  const [perms, setPerms] = useState({ overlay: null, admin: null });
  const [tempUsername, setTempUsername] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { 
    remainingTime, 
    isLCLocked, 
    lockedUntil, 
    lcUsername, 
    verifyAndSetLCUsername, 
    isChecking 
  } = useSettingsStore();
  
  const isTimeLocked = remainingTime > 0 || Date.now() < lockedUntil;
  const isCurrentlyLocked = isLCLocked || isTimeLocked;

  // 1. Permissions Check
  useEffect(() => {
    const checkAllPerms = async () => {
      if (OverlayModule && ScreenLock) {
        const hasOverlay = await OverlayModule.hasPermission();
        const hasAdmin = await ScreenLock.hasPermission();
        setPerms({ overlay: hasOverlay, admin: hasAdmin });
      }
    };
    checkAllPerms();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') checkAllPerms();
    });
    return () => subscription.remove();
  }, []);

  // 2. Escape Prevention
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (isCurrentlyLocked && (nextAppState === 'background' || nextAppState === 'inactive')) {
        if (OverlayModule && perms.overlay) {
          OverlayModule.bringToFront();
        }
      }
    });
    return () => subscription.remove();
  }, [isCurrentlyLocked, perms.overlay]);

  const handleVerify = async () => {
    if (!tempUsername.trim()) return;
    const result = await verifyAndSetLCUsername(tempUsername.trim());
    if (!result.success) {
      setErrorModal(true);
    }
  };

  if (perms.overlay === null || perms.admin === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FFF" />
      </View>
    );
  }

  // --- STEP 1: SYSTEM SETUP ---
  if (!perms.overlay || !perms.admin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Icon name="shield-checkmark-outline" size={32} color="#0A84FF" />
          </View>
          <Text style={styles.title}>System Setup</Text>
          <Text style={styles.subtitle}>
            Enable these core settings to allow the launcher to protect your focus effectively.
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <PermissionRow 
            title="Screen Overlay" 
            desc="Allows the launcher to block distracting apps." 
            active={perms.overlay} 
            icon="layers-outline"
            onPress={() => !perms.overlay && OverlayModule.requestPermission()} 
          />
          <View style={styles.separator} />
          <PermissionRow 
            title="Accessibility" 
            desc="Enables the double-tap to sleep feature." 
            active={perms.admin} 
            icon="hand-left-outline"
            onPress={() => !perms.admin && ScreenLock.requestPermission()} 
          />
        </View>
      </SafeAreaView>
    );
  }

  // --- STEP 2: LEETCODE SYNC ---
  if (!lcUsername && !isSkipped) {
    const isButtonDisabled = tempUsername.trim().length === 0 || isChecking;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{ flex: 1 }}
          >
            <View style={styles.headerSection}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 159, 10, 0.1)' }]}>
                <Icon name="code-slash-outline" size={32} color="#FF9F0A" />
              </View>
              <Text style={styles.title}>LeetCode Sync</Text>
              <Text style={styles.subtitle}>
                Connect your profile to use coding challenges as a way to unlock your apps.
              </Text>
            </View>

            {/* Input with @ Icon */}
            <View style={[styles.inputWrapper, isInputFocused && styles.inputFocused]}>
              <Icon 
                name="at-outline" 
                size={20} 
                color={isInputFocused ? "#FF9F0A" : "#444"} 
                style={{ marginRight: 10 }} 
              />
              <TextInput 
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#444"
                value={tempUsername}
                onChangeText={setTempUsername}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                autoCapitalize="none"
                editable={!isChecking}
                selectionColor="#FF9F0A"
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.mainBtn, 
                isButtonDisabled && styles.mainBtnDisabled
              ]} 
              onPress={handleVerify} 
              activeOpacity={0.8}
              disabled={isButtonDisabled}
            >
              {isChecking ? (
                <View style={styles.btnContent}>
                  <ActivityIndicator color="#000" style={{ marginRight: 10 }} size="small" />
                  <Text style={styles.mainBtnText}>Verifying...</Text>
                </View>
              ) : (
                <Text style={[styles.mainBtnText, isButtonDisabled && { color: '#444' }]}>
                   Verify & Finish
                </Text>
              )}
            </TouchableOpacity>

            {!isChecking && (
              <TouchableOpacity onPress={() => setIsSkipped(true)} style={styles.skipBtn}>
                <Text style={styles.skipText}>Set up later in settings</Text>
              </TouchableOpacity>
            )}

            <Modal visible={errorModal} transparent animationType="fade">
              <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                  <Icon name="alert-circle-outline" size={48} color="#FF3B30" />
                  <Text style={styles.modalTitle}>Verification Failed</Text>
                  <Text style={styles.modalDesc}>
                    We couldn't find this username on LeetCode. Please check the spelling and try again.
                  </Text>
                  <TouchableOpacity style={styles.retryBtn} onPress={() => setErrorModal(false)}>
                    <Text style={styles.retryText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {isCurrentlyLocked ? <LockScreen /> : <DrawerNavigator />}
    </View>
  );
};

// --- HELPER COMPONENT ---
const PermissionRow = ({ title, desc, active, icon, onPress }) => (
  <TouchableOpacity 
    style={styles.permRow} 
    onPress={onPress}
    activeOpacity={active ? 1 : 0.7}
  >
    <Icon name={icon} size={24} color={active ? "#30D158" : "#8E8E8E"} style={styles.permIcon} />
    <View style={{ flex: 1 }}>
      <Text style={[styles.permTitle, { color: active ? "#FFF" : "#8E8E8E" }]}>{title}</Text>
      <Text style={styles.permDesc}>{desc}</Text>
    </View>
    {active ? (
      <Icon name="checkmark-circle" size={26} color="#30D158" />
    ) : (
      <View style={styles.setupBadge}>
        <Text style={styles.setupBadgeText}>Set up</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#000', paddingHorizontal: 28 },
  headerSection: { alignItems: 'center', marginTop: 80, marginBottom: 40 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  
  cardContainer: {
    backgroundColor: '#111', borderRadius: 24, borderWidth: 1, borderColor: '#222', overflow: 'hidden'
  },
  permRow: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  permIcon: { marginRight: 15 },
  permTitle: { fontSize: 16, fontWeight: '600' },
  permDesc: { color: '#555', fontSize: 13, marginTop: 2 },
  separator: { height: 1, backgroundColor: '#222', marginHorizontal: 20 },

  setupBadge: { backgroundColor: '#0A84FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  setupBadgeText: { color: '#FFF', fontWeight: '700', fontSize: 12 },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', backgroundColor: '#111', borderRadius: 18,
    paddingHorizontal: 18, borderWidth: 1, borderColor: '#222', marginBottom: 20
  },
  inputFocused: { borderColor: '#FF9F0A' },
  input: { color: '#FFF', fontSize: 16, height: 60, flex: 1 },
  
  mainBtn: {
    backgroundColor: '#FFF', width: '100%', height: 60,
    borderRadius: 18, justifyContent: 'center', alignItems: 'center'
  },
  mainBtnDisabled: {
    backgroundColor: 'transparent', borderColor: '#222', borderWidth: 1
  },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  mainBtnText: { color: '#000', fontWeight: '800', fontSize: 16 },
  
  skipBtn: { marginTop: 25, alignSelf: 'center' },
  skipText: { color: '#555', fontSize: 14, fontWeight: '600' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalCard: {
    width: '80%', backgroundColor: '#111', borderRadius: 28,
    padding: 30, alignItems: 'center', borderWidth: 1, borderColor: '#333'
  },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  modalDesc: { color: '#888', textAlign: 'center', marginTop: 10, lineHeight: 20, fontSize: 14 },
  retryBtn: {
    backgroundColor: '#FFF', width: '100%', paddingVertical: 14,
    borderRadius: 12, marginTop: 25, alignItems: 'center'
  },
  retryText: { color: '#000', fontWeight: 'bold', fontSize: 15 }
});