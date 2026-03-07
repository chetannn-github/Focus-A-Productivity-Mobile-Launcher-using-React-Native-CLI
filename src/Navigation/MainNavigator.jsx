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
  const [tempUsername, setTempUsername] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { 
    remainingTime, isLCLocked, lockedUntil, 
    lcUsername, verifyAndSetLCUsername, isChecking,
    perms, setPerms 
  } = useSettingsStore();
  
  const isCurrentlyLocked = isLCLocked || (remainingTime > 0 || Date.now() < lockedUntil);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state === 'active') {
        if (OverlayModule && ScreenLock) {
          const hasOverlay = await OverlayModule.hasPermission();
          const hasAdmin = await ScreenLock.hasPermission();
          setPerms({ overlay: hasOverlay, admin: hasAdmin });
        }
      } else if (isCurrentlyLocked && (state === 'background' || state === 'inactive')) {
        if (OverlayModule && perms.overlay) OverlayModule.bringToFront();
      }
    });
    return () => sub.remove();
  }, [isCurrentlyLocked, perms.overlay]);

  const handleVerify = async () => {
    if (!tempUsername.trim()) return;
    Keyboard.dismiss();
    const result = await verifyAndSetLCUsername(tempUsername.trim());
    if (!result.success) setErrorModal(true);
  };

  const skipSetup = () => {
    Keyboard.dismiss();
    setIsSkipped(true);
  };

  if (!perms.overlay || !perms.admin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerSection}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(10, 132, 255, 0.1)' }]}>
            <Icon name="shield-checkmark-outline" size={32} color="#0A84FF" />
          </View>
          <Text style={styles.title}>System Setup</Text>
          <Text style={styles.subtitle}>Focus needs these system permissions to protect your sessions.</Text>
        </View>

        <View style={styles.cardContainer}>
          <PermissionRow title="Screen Overlay" active={perms.overlay} onPress={() => OverlayModule.requestPermission()} />
          <View style={styles.separator} />
          <PermissionRow title="Accessibility" active={perms.admin} onPress={() => ScreenLock.requestPermission()} />
        </View>
      </SafeAreaView>
    );
  }

  // --- 2. STEP 2: LEETCODE SYNC ---
  if (!lcUsername && !isSkipped) {
    const isButtonDisabled = tempUsername.trim().length === 0 || isChecking;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            
            <View style={styles.headerSection}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 159, 10, 0.1)' }]}>
                <Icon name="code-slash-outline" size={32} color="#FF9F0A" />
              </View>
              <Text style={styles.title}>Link Profile</Text>
              <Text style={styles.subtitle}>Sync your LeetCode account to use challenges as app locks.</Text>
            </View>

            <View style={[styles.inputWrapper, isInputFocused && styles.inputFocused]}>
              <Icon name="at" size={20} color={isInputFocused ? "#FFF" : "#666"} style={{marginRight: 10}} />
              <TextInput 
                style={styles.input}
                placeholder="LeetCode Username"
                placeholderTextColor="#666"
                value={tempUsername}
                onChangeText={setTempUsername}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                autoCapitalize="none"
                editable={!isChecking}
                selectionColor="#FFF"
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.mainBtn, 
                isButtonDisabled && !isChecking && styles.mainBtnDisabled,
                isChecking && styles.mainBtnLoading 
              ]} 
              onPress={handleVerify} 
              disabled={isButtonDisabled}
              activeOpacity={0.8}
            >
              {isChecking ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator color="#000" size="small" style={{ marginRight: 8 }} />
                  <Text style={styles.mainBtnText}>Checking...</Text>
                </View>
              ) : (
                <Text style={[styles.mainBtnText, isButtonDisabled && { color: '#666' }]}>Connect Account</Text>
              )}
            </TouchableOpacity>

            {!isChecking && (
              <TouchableOpacity onPress={skipSetup} style={styles.skipBtn} activeOpacity={0.6}>
                <Text style={styles.skipText}>I'll do this later</Text>
              </TouchableOpacity>
            )}

            <Modal visible={errorModal} transparent animationType="fade">
              <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                  <Icon name="close-circle" size={48} color="#FF3B30" />
                  <Text style={styles.modalTitle}>User Not Found</Text>
                  <Text style={styles.modalDesc}>We couldn't locate that username. Please double-check the spelling.</Text>
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

  // --- 3. FINAL FLOW ---
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {isCurrentlyLocked ? <LockScreen /> : <DrawerNavigator />}
    </View>
  );
};

// --- HELPER COMPONENT ---
const PermissionRow = ({ title, active, onPress }) => (
  <TouchableOpacity style={styles.permRow} onPress={onPress} activeOpacity={0.7}>
    <View style={{ flex: 1 }}>
      <Text style={[styles.permTitle, { color: active ? "#FFF" : "#888" }]}>{title}</Text>
    </View>
    {active ? <Icon name="checkmark-circle" size={24} color="#30D158" /> : <Icon name="chevron-forward" size={20} color="#444" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingHorizontal: 30 },
  headerSection: { alignItems: 'center', marginTop: 80, marginBottom: 50 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { color: '#888', fontSize: 15, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  cardContainer: { backgroundColor: '#111', borderRadius: 20, overflow: 'hidden' },
  permRow: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  permTitle: { fontSize: 16, fontWeight: '500' },
  separator: { height: 1, backgroundColor: '#222', marginHorizontal: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#111', borderRadius: 16, paddingHorizontal: 18, marginBottom: 20, borderWidth: 1, borderColor: '#111' },
  inputFocused: { borderColor: '#555', backgroundColor: '#1A1A1A' },
  input: { color: '#FFF', fontSize: 16, height: 56, flex: 1 },
  mainBtn: { backgroundColor: '#FFF', width: '100%', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  mainBtnDisabled: { backgroundColor: '#111' },
  mainBtnLoading: { backgroundColor: '#FFF', opacity: 0.8 }, 
  mainBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  skipBtn: { marginTop: 20, alignSelf: 'center', padding: 10 },
  skipText: { color: '#666', fontSize: 14, fontWeight: '500' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', backgroundColor: '#111', borderRadius: 24, padding: 30, alignItems: 'center' },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', marginTop: 15 },
  modalDesc: { color: '#888', textAlign: 'center', marginTop: 10, lineHeight: 20 },
  retryBtn: { backgroundColor: '#FFF', width: '100%', paddingVertical: 14, borderRadius: 12, marginTop: 25, alignItems: 'center' },
  retryText: { color: '#000', fontWeight: '700' }
});