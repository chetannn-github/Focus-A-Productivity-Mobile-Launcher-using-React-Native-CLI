import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, TouchableWithoutFeedback, Linking, TextInput, 
  Pressable, ScrollView, SafeAreaView, FlatList, 
  TouchableOpacity, StyleSheet, Keyboard, ActivityIndicator 
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import Animated from "react-native-reanimated";
import { wallpapers } from "../Constants/wallpapers";
import { styles } from "../Stylesheets/SettingScreenStyle";
import useSetting from "../Hooks/useSetting";
import useApps from "../store/useAppsStore";
import useSettingsStore from "../store/useSettingStore";

function SettingScreen() {
  const  {
    activeSection,
    toggleSection,
    handleLockedTimeChange,
    newLockedTime,
    setNewLockedTime,
    appListStyle,
    phoneLockStyle,
    wallpaperStyle,
    hiddenAppsStyle,
    leetCodeStyle,
    switchStyle,
    switchStyle2,
    switchTranslateX,
    switchTranslateX2,
    switchStyle3,
    switchTranslateX3
  } = useSetting();

  const { 
    showAppIcons, toggleAppIcons, selectedWallpaper, shuffleApps, toggleShuffleApps,
    changeWallpaper, isLCLocked, lockWithLeetCode, checkLCUnlockStatus, lcUsername, isChecking, questionsToSolve,
    showLCStats, toggleLCStats
  } = useSettingsStore();
  
  const { hiddenApps, unhideApp, masterApps } = useApps(); 

  const getAppDataByPackage = (pkgName) => {
    return masterApps?.find(a => a.packageName === pkgName);
  };

  const [inputUsername, setInputUsername] = useState(lcUsername);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState(1);
  const [alertConfig, setAlertConfig] = useState({visible : false, title: '', message: '', confirmText: 'OK' });

  const showAlert = (title, message, confirmText = "OK") => {
    Keyboard.dismiss(); 
    setAlertConfig({visible : true, title, message, confirmText });
  };

  const hideAlert = () => setAlertConfig((prev) => ({ ...prev, visible: false }));

  useEffect(() => {
    if (lcUsername && !inputUsername) setInputUsername(lcUsername);
  }, [lcUsername]);

  const handleLeetCodeLock = async () => {
    const finalUsername = (isEditingUsername || !lcUsername) ? inputUsername.trim() : lcUsername;
    if(!finalUsername) {
      showAlert("Hold up", "Please enter a valid LeetCode username.", "Got it");
      return;
    }
    
    const success = await lockWithLeetCode(finalUsername, selectedQuestions);
    
    if(success) {
      setIsEditingUsername(false); 
      showAlert("Locked!", `Focus launcher is now locked to ${finalUsername}! You must solve ${selectedQuestions} question(s) to unlock.`, "Awesome");
    } else {
      showAlert("Error", "Could not verify username. Check network or spelling.", "Retry");
    }
  };

  const handleCheckUnlock = async () => {
    const status = await checkLCUnlockStatus();
    if (status.unlocked) {
      showAlert("Unlocked!", `Great job solving ${status.needed} problem(s)! Apps restored.`, "Let's Go");
    } else {
      showAlert("Still Locked", `You have solved ${status.solved} out of ${status.needed} required problems. Get back to coding!`, "Back to LeetCode");
    }
  };

  const onSaveLockTime =  () => {
    const success = handleLockedTimeChange();
    if (success === false) {
      showAlert(
        "Invalid Duration", 
        "Please enter a value between 1 and 120 minutes. Durations exceeding 2 hours are not supported.", 
        "Got it"
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <SafeAreaView style={[styles.SettingScreen, { paddingBottom: 0 }]}>
        
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>Settings</Text>

          {/* ========================================== */}
          {/* SECTION 1: CUSTOMIZATION                   */}
          {/* ========================================== */}
          <Text style={customStyles.sectionLabel}>CUSTOMIZATION</Text>

          {/* --- Home & Drawer Section --- */}
          <View style={styles.collapsibleContainer}>
            <TouchableWithoutFeedback onPress={() => toggleSection('appList')}>
              <View style={styles.collapsibleHeaderContainer}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="grid-view" size={22} color="#0A84FF" />
                  <Text style={styles.collapsibleHeader}>Home & Drawer</Text>
                </View>
                <Icon name={activeSection === 'appList' ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#8E8E93" />
              </View>
            </TouchableWithoutFeedback>
            
            <Animated.View style={[styles.collapsedContent, appListStyle, { paddingBottom: 10 }]}>
              <View style={[styles.switchContainer, { borderTopWidth: 0, paddingVertical: 8 }]}>
                <Text style={styles.switchLabel}>Show App Icons</Text>
                <Pressable
                  style={[styles.switchBase,{ backgroundColor: showAppIcons ? "#34C759" : "#3A3A3C" }]}
                  onPress={() => {
                    toggleAppIcons();
                    switchTranslateX.value = showAppIcons ? 0 : 20;
                  }}
                >
                  <Animated.View style={[styles.switchCircle, switchStyle]} />
                </Pressable>
              </View>
              
              <View style={[styles.switchContainer, { paddingVertical: 8 }]}>
                <Text style={styles.switchLabel}>Shuffle Apps</Text>
                <Pressable
                  style={[styles.switchBase,{ backgroundColor: shuffleApps ? "#0A84FF" : "#3A3A3C" }]}
                  onPress={() => {
                    toggleShuffleApps();
                    switchTranslateX2.value = shuffleApps ? 0 : 20;
                  }}
                >
                  <Animated.View style={[styles.switchCircle, switchStyle2]} />
                </Pressable>
              </View>

              {/* NAYA LEETCODE STATS TOGGLE */}
              <View style={[styles.switchContainer, { paddingVertical: 8 }]}>
                <Text style={styles.switchLabel}>Show LC Stats on Home</Text>
                <Pressable
                  style={[styles.switchBase,{ backgroundColor: showLCStats ? "#BF5AF2" : "#3A3A3C" }]}
                  onPress={() => {
                    toggleLCStats();
                    switchTranslateX3.value = showLCStats ? 0 : 20;
                  }}
                >
                  <Animated.View style={[styles.switchCircle, switchStyle3]} />
                </Pressable>
              </View>
            </Animated.View>
          </View>

          {/* --- Wallpapers Section --- */}
          <View style={styles.collapsibleContainer}>
            <TouchableWithoutFeedback onPress={() => toggleSection('wallpaper')}>
              <View style={styles.collapsibleHeaderContainer}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="wallpaper" size={22} color="#BF5AF2" />
                  <Text style={styles.collapsibleHeader}>Wallpapers</Text>
                </View>
                <Icon name={activeSection === 'wallpaper' ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#8E8E93" />
              </View>
            </TouchableWithoutFeedback>
            
            <Animated.View style={[styles.collapsedContent, wallpaperStyle, { paddingHorizontal: 10 }]}>
              <ScrollView nestedScrollEnabled={true} style={{ height: 230 }} showsVerticalScrollIndicator={true}>
                <View style={styles.wallpaperGrid}>
                  {Object.keys(wallpapers).map((item) => (
                    <View key={item} style={styles.wallpaperItem} onTouchEnd={() => changeWallpaper(item)}>
                      <Image source={wallpapers[item]} style={styles.wallpaperImage} />
                      {selectedWallpaper === item && (
                        <View style={styles.tickOverlay}>
                          <IonIcon name="checkmark-circle" size={28} color="#0A84FF" />
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </Animated.View>
          </View>

          {/* --- Hidden Apps Section --- */}
          <View style={styles.collapsibleContainer}>
            <TouchableWithoutFeedback onPress={() => toggleSection('hiddenApps')}>
              <View style={styles.collapsibleHeaderContainer}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="visibility-off" size={22} color="#FF453A" />
                  <Text style={styles.collapsibleHeader}>Hidden Apps</Text>
                </View>
                <Icon name={activeSection === 'hiddenApps' ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#8E8E93" />
              </View>
            </TouchableWithoutFeedback>
            
            <Animated.View style={[styles.collapsedContent, hiddenAppsStyle]}>
              {hiddenApps && hiddenApps.length > 0 ? (
                <ScrollView style={styles.hiddenAppsScrollContainer} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                  {hiddenApps.map((pkg, index) => {
                    const appData = getAppDataByPackage(pkg);
                    if (!appData) return null;
                    return (
                      <View key={index} style={[styles.hiddenAppItem, index === 0 && { borderTopWidth: 0 }]}>
                        <View style={styles.hiddenAppInfo}>
                          {appData.icon && <Image source={{ uri: `data:image/png;base64,${appData.icon}` }} style={styles.hiddenAppIcon} resizeMode="contain" />}
                          <Text style={styles.hiddenAppName} numberOfLines={1}>{appData.appName}</Text>
                        </View>
                        <TouchableOpacity onPress={() => unhideApp(pkg, shuffleApps)} style={styles.unhideBtn}>
                          <Icon name="visibility" size={20} color="#FF453A" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              ) : (
                <Text style={styles.noHiddenText}>No apps are currently hidden.</Text>
              )}
            </Animated.View>
          </View>


          {/* ========================================== */}
          {/* SECTION 2: FOCUS & LOCKS                   */}
          {/* ========================================== */}
          <Text style={customStyles.sectionLabel}>FOCUS & LOCKS</Text>

          {/* --- Phone Lock Section --- */}
          <View style={styles.collapsibleContainer}>
            <TouchableWithoutFeedback onPress={() => toggleSection('phoneLock')}>
              <View style={styles.collapsibleHeaderContainer}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="timer" size={22} color="#FF9F0A" />
                  <Text style={styles.collapsibleHeader}>Time Lock</Text>
                </View>
                <Icon name={activeSection === 'phoneLock' ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#8E8E93" />
              </View>
            </TouchableWithoutFeedback>
            
            <Animated.View style={[styles.collapsedContent, phoneLockStyle, { paddingBottom: 10 }]}>
              <Text style={styles.switchLabel}>Lock Duration (minutes)</Text>
              <TextInput 
                style={[styles.input, { marginTop: 4, marginBottom: 8, paddingVertical: 10 }]} 
                keyboardType="numeric" 
                placeholder="e.g. 30" 
                placeholderTextColor="#636366"
                value={newLockedTime}
                onChangeText={setNewLockedTime}
              />
              <TouchableOpacity style={[styles.primaryBtn, { paddingVertical: 10 }]} onPress={onSaveLockTime}>
                <Text style={styles.primaryBtnText}>Set Lock Time</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* --- LeetCode Lock Section --- */}
          <View style={styles.collapsibleContainer}>
            <TouchableWithoutFeedback onPress={() => toggleSection('leetCode')}>
              <View style={styles.collapsibleHeaderContainer}>
                <View style={styles.sectionTitleRow}>
                  <IonIcon name="code-slash" size={22} color="#30D158" />
                  <Text style={styles.collapsibleHeader}>LeetCode Lock</Text>
                </View>
                <Icon name={activeSection === 'leetCode' ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#8E8E93" />
              </View>
            </TouchableWithoutFeedback>
            
            <Animated.View style={[styles.collapsedContent, leetCodeStyle, { paddingBottom: 15 }]}>
              {isLCLocked ? (
                <View style={{ paddingTop: 5 }}>
                  <Text style={[styles.switchLabel, { marginBottom: 15, textAlign: 'center', color: '#FF453A' }]}>
                    Device is currently locked! 
                  </Text>
                  <Text style={{ color: '#E5E5EA', textAlign: 'center', marginBottom: 15 }}>
                    Required to solve: {questionsToSolve} question(s)
                  </Text>
                  <TouchableOpacity 
                    style={[styles.primaryBtn, { backgroundColor: '#30D158' }, isChecking && styles.primaryBtnDisabled]} 
                    onPress={handleCheckUnlock} 
                    disabled={isChecking}
                  >
                    {isChecking ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Check Status & Unlock</Text>}
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {lcUsername && !isEditingUsername ? (
                    <View style={{ paddingTop: 5 }}>
                      <Text style={[styles.switchLabel, { textAlign: 'center', marginBottom: 15 }]}>
                        Linked to: <Text style={{ color: '#0A84FF', fontWeight: 'bold' }}>{lcUsername}</Text>
                      </Text>
                      
                      <View style={{ marginBottom: 15 }}>
                        <Text style={[styles.switchLabel, { marginBottom: 12, textAlign: 'center' }]}>Questions to solve</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <TouchableOpacity 
                              key={num}
                              style={[customStyles.smallBadge, selectedQuestions === num && customStyles.smallBadgeActive]}
                              onPress={() => setSelectedQuestions(num)}
                            >
                              <Text style={[customStyles.smallBadgeText, selectedQuestions === num && customStyles.smallBadgeTextActive]}>
                                {num}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      <TouchableOpacity 
                        style={[styles.primaryBtn, isChecking && styles.primaryBtnDisabled]} 
                        onPress={handleLeetCodeLock} 
                        disabled={isChecking}
                      >
                        {isChecking ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Lock Device Now</Text>}
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginTop: 10, padding: 10 }} onPress={() => setIsEditingUsername(true)}>
                        <Text style={styles.secondaryBtnText}>Change Username</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ paddingTop: 5 }}>
                      <Text style={styles.switchLabel}>LeetCode Username</Text>
                      <TextInput
                        style={[styles.input, { marginTop: 8, marginBottom: 15, paddingVertical: 10 }]}
                        placeholder="e.g. neetcode"
                        placeholderTextColor="#636366"
                        value={inputUsername}
                        onChangeText={setInputUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />

                      <View style={{ marginBottom: 15 }}>
                        <Text style={[styles.switchLabel, { marginBottom: 12, textAlign: 'center' }]}>Questions to solve</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <TouchableOpacity 
                              key={num}
                              style={[customStyles.smallBadge, selectedQuestions === num && customStyles.smallBadgeActive]}
                              onPress={() => setSelectedQuestions(num)}
                            >
                              <Text style={[customStyles.smallBadgeText, selectedQuestions === num && customStyles.smallBadgeTextActive]}>
                                {num}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      <TouchableOpacity 
                        style={[styles.primaryBtn, { paddingVertical: 10 }, isChecking && styles.primaryBtnDisabled]} 
                        onPress={handleLeetCodeLock} 
                        disabled={isChecking}
                      >
                        {isChecking ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Verify & Lock</Text>}
                      </TouchableOpacity>
                      {lcUsername && (
                        <TouchableOpacity 
                          style={{ marginTop: 10, padding: 10 }} 
                          onPress={() => { setIsEditingUsername(false); setInputUsername(lcUsername); }}
                        >
                          <Text style={[styles.secondaryBtnText, styles.dangerText]}>Cancel</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}
            </Animated.View>
          </View>
        </ScrollView>

        {/* ========================================== */}
        {/* STICKY BOTTOM LINKS                        */}
        {/* ========================================== */}
        <View style={customStyles.stickyFooter}>
          <TouchableOpacity style={styles.link} onPress={() => Linking.openURL("https://www.linkedin.com/in/chetannn/")}>
            <Text style={{ color: "#E5E5EA", fontSize: 15, fontWeight: "500" }}>LinkedIn</Text>
            <IonIcon name="logo-linkedin" size={20} color="#0A84FF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => Linking.openURL("https://github.com/chetannn-github/")}>
            <Text style={{ color: "#E5E5EA", fontSize: 15, fontWeight: "500" }}>GitHub</Text>
            <IonIcon name="logo-github" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

      </SafeAreaView>

      {/* --- ABSOLUTE OVERLAY INSTEAD OF NATIVE MODAL --- */}
      {alertConfig.visible && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 99999, elevation: 99999 }]}>
          <Pressable style={customStyles.alertBackdrop} onPress={hideAlert}>
            <Pressable style={customStyles.alertContainer} onPress={() => {}}>
              <Text style={customStyles.alertTitle}>{alertConfig.title}</Text>
              <Text style={customStyles.alertMessage}>{alertConfig.message}</Text>

              <View style={customStyles.alertButtonRow}>
                <TouchableOpacity style={customStyles.alertButton} onPress={hideAlert}>
                  <Text style={customStyles.alertConfirmText}>{alertConfig.confirmText}</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const customStyles = StyleSheet.create({
  smallBadge: {
    width: 40,
    height: 40,
    borderRadius: 20, 
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  smallBadgeActive: {
    backgroundColor: 'rgba(48, 209, 88, 0.15)', 
    borderColor: '#30D158',
  },
  smallBadgeText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
  smallBadgeTextActive: {
    color: '#30D158',
  },
  sectionLabel: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 12,
  },
  stickyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingBottom: 25, 
    paddingHorizontal: 5,
    backgroundColor: '#000', 
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  alertBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.83)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: '#1C1C1E', 
    width: '80%',
    borderRadius: 16,
    paddingTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  alertTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alertMessage: {
    color: '#8E8E93',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
    lineHeight: 22,
  },
  alertButtonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    width: '100%',
  },
  alertButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertConfirmText: {
    color: '#0A84FF', 
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default SettingScreen;