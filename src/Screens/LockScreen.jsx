import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Pressable } from "react-native";
import { motivationalQuotes } from "../Constants/quotes";
import { styles } from "../Stylesheets/LockScreenStyle";
import useSettingsStore from "../store/useSettingStore";

const LockScreen = () => {
  const { 
    lockedUntil, 
    remainingTime, 
    setRemainingTime, 
    isLCLocked, 
    checkLCUnlockStatus, 
    isChecking,
    questionsToSolve,
  } = useSettingsStore();
  
  const [quote, setQuote] = useState("");
  const [alertConfig, setAlertConfig] = useState({ 
    visible: false, 
    title: '', 
    message: '', 
    confirmText: 'OK',
    type: 'error'
  });

  const showAlert = (title, message, confirmText = "OK", type = "error") => {
    setAlertConfig({ visible: true, title, message, confirmText, type });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    if (!isLCLocked) {
      const interval = setInterval(setRemainingTime, 1000);
      return () => clearInterval(interval);
    }
  }, [lockedUntil, isLCLocked]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  const handleCheckLeetCode = async () => {
    const status = await checkLCUnlockStatus();
    
    // Safety check in case status is returned as boolean from older store version
    const isUnlocked = typeof status === 'object' ? status.unlocked : status;
    const solved = typeof status === 'object' ? status.solved : 0;
    const needed = typeof status === 'object' ? status.needed : questionsToSolve;

    if (isUnlocked) {
      showAlert(
        "Freedom Achieved! 🚀", 
        `Awesome work! You crushed those ${needed} LeetCode problem(s). Your apps are now unlocked.`, 
        "Let's Go!", 
        "success"
      );
    } else {
      showAlert(
        "Keep Grinding! 💻", 
        `You've solved ${solved} out of ${needed} required problem${needed > 1 ? "s" : ""}.\n\nHead back to LeetCode and finish the job!`, 
        "Back to Code", 
        "error"
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
       
        {!isLCLocked ? (
          <Text style={styles.timer}>
            {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, "0")}
          </Text>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.timer, { fontSize: 32 }]}>
              Locked for Focus
            </Text>
            <Text style={{ color: '#0A84FF', fontSize: 16, fontWeight: '600', marginTop: 10 }}>
              Goal: Solve {questionsToSolve} Problem{questionsToSolve > 1 ? "s" : ""}
            </Text>
          </View>
        )}

        <Text style={styles.message}>Your phone is locked.</Text>
        <Text style={styles.quote}>{quote}</Text>

    
        {isLCLocked && (
          <TouchableOpacity 
            style={[customStyles.checkButton, isChecking && customStyles.buttonDisabled]} 
            onPress={handleCheckLeetCode}
            disabled={isChecking}
          >
            {isChecking ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={customStyles.checkButtonText}>Check LeetCode Status</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {alertConfig.visible && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 99999, elevation: 99999 }]}>
          <Pressable style={customStyles.alertBackdrop} onPress={hideAlert}>
            <Pressable style={customStyles.alertContainer} onPress={() => {}}>
              <Text style={customStyles.alertTitle}>{alertConfig.title}</Text>
              <Text style={customStyles.alertMessage}>{alertConfig.message}</Text>

              <View style={customStyles.alertButtonRow}>
                <TouchableOpacity
                  style={customStyles.alertButton}
                  onPress={hideAlert}
                >
                  <Text style={[
                    customStyles.alertConfirmText, 
                    { color: alertConfig.type === 'success' ? '#34C759' : '#FF453A' }
                  ]}>
                    {alertConfig.confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const customStyles = StyleSheet.create({
  checkButton: {
    backgroundColor: '#34C759', 
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 40,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#8E8E93', 
  },
  checkButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // --- ALERT STYLES ---
  alertBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: '#1C1C1E', 
    width: '80%',
    borderRadius: 18,
    paddingTop: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 24,
  },
  alertTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    color: '#E5E5EA',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 25,
    lineHeight: 22,
  },
  alertButtonRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#3A3A3C',
    width: '100%',
  },
  alertButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertConfirmText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default LockScreen;