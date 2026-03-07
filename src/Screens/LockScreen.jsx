import React, { useEffect, useState, useRef } from "react";
import { 
  View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, 
  Pressable, StatusBar, NativeModules, Animated, Easing, Platform 
} from "react-native";
import { motivationalQuotes } from "../Constants/quotes";
import useSettingsStore from "../store/useSettingStore";
import Icon from "react-native-vector-icons/Ionicons";
import { handleBackgroundTap } from "../utils/doubleTap";
import { TimeLockView } from "../Components/LockScreen/TimeLockView";
import { LeetCodeLockView } from "../Components/LockScreen/LeetcodeLockView";

const { ScreenLock } = NativeModules;

const LockScreen = () => {
  const { 
    remainingTime, isLCLocked, checkLCUnlockStatus, 
    isChecking, questionsToSolve, lockedUntil, lcStats
  } = useSettingsStore();

  const [quote, setQuote] = useState("");
  const [alertConfig, setAlertConfig] = useState({ 
    visible: false, title: '', message: '', confirmText: 'OK', type: 'neutral'
  });

  const blinkAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showAlert = (title, message, confirmText = "OK", type = 'neutral') => {
    setAlertConfig({ visible: true, title, message, confirmText, type });
  };
  const hideAlert = () => setAlertConfig((prev) => ({ ...prev, visible: false }));

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(blinkAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.timing(blinkAnim, { toValue: 1, duration: 800, useNativeDriver: true })
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: -8, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
    ])).start();

    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();

    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  useEffect(() => {
    if (!isLCLocked) {
      const interval = setInterval(() => useSettingsStore.getState().setRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  }, [lockedUntil, isLCLocked]);

  const handleCheckLeetCode = async () => {
    const status = await checkLCUnlockStatus();
    const isUnlocked = typeof status === 'object' ? status.unlocked : status;
    const solved = typeof status === 'object' ? status.solved : 0;
    const needed = typeof status === 'object' ? status.needed : questionsToSolve;

    if (isUnlocked) {
      showAlert("Compile Success", "0 Errors. 0 Warnings. Workspace unlocked.", "exit()", "success");
    } else {
      showAlert("Assertion Error", `Expected ${needed} solutions, received ${solved}.\nFix issues and re-compile.`, "return", "error");
    }
  };

  return (
    <View style={mainStyles.wrapper}>
      <StatusBar hidden/>
      <Pressable style={[StyleSheet.absoluteFill, { zIndex: 1 }]} onPress={() => handleBackgroundTap(ScreenLock)} />
      
      <Animated.View style={[mainStyles.contentContainer, { opacity: fadeAnim }]} pointerEvents="box-none">
        {!isLCLocked ? (
          <TimeLockView 
            remainingTime={remainingTime} 
            blinkAnim={blinkAnim} 
            floatAnim={floatAnim} 
            quote={quote}
          />
        ) : (
          <LeetCodeLockView 
            questionsToSolve={questionsToSolve}
            lcStats={lcStats}
            quote={quote}
            isChecking={isChecking}
            onCheck={handleCheckLeetCode}
            blinkAnim={blinkAnim}
          />
        )}
      </Animated.View>

      {alertConfig.visible && (
        <View style={[StyleSheet.absoluteFill, mainStyles.alertBackdrop]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={hideAlert} />
          <View style={mainStyles.alertContainer}>
            <View style={mainStyles.alertHeader}>
              <Text style={mainStyles.alertHeaderText}>Terminal</Text>
              <TouchableOpacity onPress={hideAlert}>
                <Icon name="close" size={20} color="#5C6370" />
              </TouchableOpacity>
            </View>
            <View style={mainStyles.alertBody}>
              <Text style={[mainStyles.alertTitle, { color: alertConfig.type === 'success' ? '#98C379' : '#E06C75' }]}>
                {alertConfig.title}
              </Text>
              <Text style={mainStyles.alertMessage}>{alertConfig.message}</Text>
            </View>
            <TouchableOpacity style={mainStyles.alertBtn} onPress={hideAlert}>
              <Text style={mainStyles.alertBtnText}>[ {alertConfig.confirmText} ]</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const mainStyles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#000000" },
  contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 25, zIndex: 10 },
  alertBackdrop: { backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 99999 },
  alertContainer: { backgroundColor: '#0D1117', width: '85%', borderRadius: 12, borderWidth: 1, borderColor: '#30363D', overflow: 'hidden' },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#161B22', borderBottomWidth: 1, borderBottomColor: '#30363D' },
  alertHeaderText: { color: '#8B949E', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  alertBody: { padding: 25, alignItems: 'flex-start' },
  alertTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  alertMessage: { color: '#ABB2BF', fontSize: 13, lineHeight: 20, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  alertBtn: { padding: 15, borderTopWidth: 1, borderTopColor: '#30363D', alignItems: 'center', backgroundColor: '#161B22' },
  alertBtnText: { fontSize: 13, fontWeight: '600', color: '#61AFEF', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
});

export default LockScreen;