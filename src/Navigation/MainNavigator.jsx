import React, { useEffect, useState } from "react";
import { 
  NativeModules, AppState, View, Text, TouchableOpacity, 
  StyleSheet, ActivityIndicator, TextInput, KeyboardAvoidingView, 
  Platform, Keyboard, Modal, TouchableWithoutFeedback 
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LockScreen from "../Screens/LockScreen";
import { DrawerNavigator } from "./DrawerNavigator";
import useSettingsStore from "../store/useSettingStore";

const { OverlayModule, ScreenLock } = NativeModules;

export const MainNavigator = () => {
  // Setup States
  const [perms, setPerms] = useState({ overlay: null, admin: null });
  const [tempUsername, setTempUsername] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  // Store States
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

  // 1. Permissions Check Logic
  useEffect(() => {
    const checkAllPerms = async () => {
      if (OverlayModule && ScreenLock) {
        const hasOverlay = await OverlayModule.hasPermission();
        const hasAdmin = await ScreenLock.hasPermission();
        setPerms({ overlay: hasOverlay, admin: hasAdmin });
      }
    };

    checkAllPerms();

    // Auto refresh jab user settings se wapas aaye
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') checkAllPerms();
    });

    return () => subscription.remove();
  }, []);

  // 2. Overlay Blocker (Escape Prevention)
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

  // Handle LC Verification
  const handleVerify = async () => {
    if (!tempUsername.trim()) {
      setErrorModal(true);
      return;
    }
    
    const result = await verifyAndSetLCUsername(tempUsername.trim());
    if (!result.success) {
      setErrorModal(true);
    }
  };

  // Loading Screen for Initial Check
  if (perms.overlay === null || perms.admin === null) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  if (!perms.overlay || !perms.admin) {
    return (
      <View style={styles.container}>
        <View style={styles.setupCard}>
          <Icon name="shield-checkmark-outline" size={60} color="#0A84FF" style={{ marginBottom: 20 }} />
          <Text style={styles.title}>Step 1: Security</Text>
          <Text style={styles.subtitle}>
            Enable these to make the launcher distraction-proof.
          </Text>

          {/* Overlay Row */}
          <PermissionRow 
            title="Display Over Apps" 
            desc="Blocks app switching during lock." 
            active={perms.overlay} 
            onGrant={() => OverlayModule.requestPermission()} 
          />

          {/* Accessibility Row */}
          <PermissionRow 
            title="Accessibility" 
            desc="Enables double-tap to sleep." 
            active={perms.admin} 
            onGrant={() => ScreenLock.requestPermission()} 
          />
        </View>
      </View>
    );
  }

  // --- STEP 2: LEETCODE (Optional) ---
  if (!lcUsername && !isSkipped) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.container}
        >
          <View style={styles.setupCard}>
            <Icon name="code-slash-outline" size={60} color="#FF9F0A" style={{ marginBottom: 20 }} />
            <Text style={styles.title}>Step 2: Connect</Text>
            <Text style={styles.subtitle}>Link LeetCode to use coding challenges as locks.</Text>

            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="LeetCode Username"
                placeholderTextColor="#444"
                value={tempUsername}
                onChangeText={setTempUsername}
                autoCapitalize="none"
                editable={!isChecking}
              />
            </View>

            <TouchableOpacity 
              style={[styles.mainBtn, isChecking && { opacity: 0.7 }]} 
              onPress={handleVerify} 
              disabled={isChecking}
            >
              {isChecking ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.mainBtnText}>Verify & Finish</Text>
              )}
            </TouchableOpacity>

            {!isChecking && (
              <TouchableOpacity onPress={() => setIsSkipped(true)} style={{ marginTop: 25 }}>
                <Text style={{ color: '#666', fontWeight: '600' }}>Skip for now</Text>
              </TouchableOpacity>
            )}

            {/* Error Modal */}
            <Modal visible={errorModal} transparent animationType="fade">
              <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                  <Icon name="alert-circle" size={50} color="#FF3B30" />
                  <Text style={styles.modalTitle}>Invalid Username</Text>
                  <Text style={styles.modalDesc}>We couldn't find this user. Please check your LeetCode username and try again.</Text>
                  <TouchableOpacity style={styles.retryBtn} onPress={() => setErrorModal(false)}>
                    <Text style={styles.retryText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }

  // --- FINAL APP FLOW ---
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {isCurrentlyLocked ? <LockScreen /> : <DrawerNavigator />}
    </View>
  );
};

// Helper Component for Rows
const PermissionRow = ({ title, desc, active, onGrant }) => (
  <View style={styles.permRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.permTitle}>{title}</Text>
      <Text style={styles.permDesc}>{desc}</Text>
    </View>
    {active ? (
      <Icon name="checkmark-circle" size={30} color="#30D158" />
    ) : (
      <TouchableOpacity style={styles.grantBtn} onPress={onGrant}>
        <Text style={styles.grantText}>Grant</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 25,
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
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    marginBottom: 15,
    width: '100%',
  },
  permTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  permDesc: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  grantBtn: {
    backgroundColor: '#0A84FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  grantText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#121212',
    borderRadius: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    marginBottom: 20,
  },
  input: {
    color: '#FFF',
    fontSize: 16,
    height: 60,
  },
  mainBtn: {
    backgroundColor: '#0A84FF',
    width: '100%',
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  mainBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#1C1C1E',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  modalDesc: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  retryBtn: {
    backgroundColor: '#FFF',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 25,
    alignItems: 'center',
  },
  retryText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  }
});