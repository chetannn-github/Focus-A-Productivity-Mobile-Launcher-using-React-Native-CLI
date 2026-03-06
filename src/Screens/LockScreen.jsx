import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Pressable } from "react-native";
import { motivationalQuotes } from "../Constants/quotes";
import { styles } from "../Stylesheets/LockScreenStyle";
import useSettingsStore from "../store/useSettingStore";
import Icon from "react-native-vector-icons/Ionicons";

const LockScreen = () => {
  const { 
    remainingTime, 
    isLCLocked, 
    checkLCUnlockStatus, 
    isChecking,
    questionsToSolve,
    lockedUntil
  } = useSettingsStore();
  
  const [quote, setQuote] = useState("");
  const [alertConfig, setAlertConfig] = useState({ 
    visible: false, 
    title: '', 
    message: '', 
    confirmText: 'OK'
  });

  const showAlert = (title, message, confirmText = "OK") => {
    setAlertConfig({ visible: true, title, message, confirmText });
  };

  const hideAlert = () => setAlertConfig((prev) => ({ ...prev, visible: false }));

  useEffect(() => {
    if (!isLCLocked) {
      const interval = setInterval(() => useSettingsStore.getState().setRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  }, [lockedUntil, isLCLocked]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  const handleCheckLeetCode = async () => {
    const status = await checkLCUnlockStatus();
    const isUnlocked = typeof status === 'object' ? status.unlocked : status;
    const solved = typeof status === 'object' ? status.solved : 0;
    const needed = typeof status === 'object' ? status.needed : questionsToSolve;

    if (isUnlocked) {
      showAlert("Unlocked", `Mission accomplished. Your apps are back.`, "Enter");
    } else {
      showAlert("Still Locked", `${solved}/${needed} solved. Don't give up now.`, "Return");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <View style={[styles.container, { justifyContent: 'center', backgroundColor: '#000000' }]}>
       
        {!isLCLocked ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.timer, { color: '#888888', fontSize: 48, fontWeight: '200' }]}>
              {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, "0")}
            </Text>
            <Text style={{ color: '#555555', fontSize: 14, letterSpacing: 2, marginTop: 5 }}>TIME LOCK ACTIVE</Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Icon name="code-slash" size={32} color="#666666" style={{ marginBottom: 15 }} />
            <Text style={{ fontSize: 36, color: '#999999', fontWeight: '300', letterSpacing: 4 }}>
              LOCKED
            </Text>
            <Text style={{ color: '#666666', fontSize: 15, marginTop: 10, letterSpacing: 1.5 }}>
              GOAL: {questionsToSolve} PROBLEMS
            </Text>
          </View>
        )}

        {/* QUOTE SECTION - BIGGER & BRIGHTER */}
        <View style={{ marginTop: 70, paddingHorizontal: 35 }}>
          <Text style={{ 
            color: '#AAAAAA', // Light grey (Readable but not white)
            fontStyle: 'italic', 
            textAlign: 'center', 
            fontSize: 18, // Bigger size
            lineHeight: 28, 
            fontWeight: '300'
          }}>
            "{quote}"
          </Text>
        </View>

        {/* BUTTON - BRIGHTER BORDER & TEXT */}
        {isLCLocked && (
          <TouchableOpacity 
            style={[customStyles.actionButton, isChecking && { opacity: 0.5 }]} 
            onPress={handleCheckLeetCode}
            disabled={isChecking}
            activeOpacity={0.7}
          >
            {isChecking ? (
              <ActivityIndicator color="#888888" size="small" />
            ) : (
              <Text style={customStyles.actionButtonText}>CHECK PROGRESS</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* --- ALERT OVERLAY --- */}
      {alertConfig.visible && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 99999, elevation: 99999 }]}>
          <Pressable style={customStyles.alertBackdrop} onPress={hideAlert}>
            <Pressable style={customStyles.alertContainer}>
              <Text style={customStyles.alertTitle}>{alertConfig.title}</Text>
              <Text style={customStyles.alertMessage}>{alertConfig.message}</Text>
              <TouchableOpacity style={customStyles.alertBtn} onPress={hideAlert}>
                <Text style={customStyles.alertBtnText}>{alertConfig.confirmText}</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const customStyles = StyleSheet.create({
  actionButton: {
    backgroundColor: 'transparent', 
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30, 
    marginTop: 60,
    borderWidth: 1,
    borderColor: '#333333', // Subtle but visible border
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
  },
  alertBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: '#0D0D0D', 
    width: '80%',
    borderRadius: 20,
    paddingTop: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  alertTitle: {
    color: '#CCCCCC',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    color: '#888888',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 25,
    lineHeight: 22,
  },
  alertBtn: {
    borderTopWidth: 1,
    borderTopColor: '#222222',
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
  },
  alertBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AAAAAA',
  },
});

export default LockScreen;