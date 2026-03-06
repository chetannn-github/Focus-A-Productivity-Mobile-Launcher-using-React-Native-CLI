import React, { useEffect, useState} from "react";
import { View, Text,Image, TouchableWithoutFeedback, Linking, TextInput, Button, Pressable, ScrollView, SafeAreaView, FlatList, TouchableOpacity, Alert } from "react-native";
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
    handleLockedTimeChange,
    newLockedTime,
    setNewLockedTime,
    appListCollapsed,
    phoneLockCollapsed,
    wallpaperCollapsed,
    toggleAppListCollapse,
    togglePhoneLockCollapse,
    toggleWallpaperCollapse,
    wallpaperStyle,
    switchStyle,
    switchStyle2,
    appListStyle,
    phoneLockStyle,
    switchTranslateX,
    switchTranslateX2
  } = useSetting();

  const { 
    showAppIcons, toggleAppIcons, selectedWallpaper, shuffleApps, toggleShuffleApps ,
    changeWallpaper,
    isLCLocked,            
    lockWithLeetCode,
    checkLCUnlockStatus,
    lcUsername,
    isChecking
  } = useSettingsStore();
  const [hiddenCollapsed, setHiddenCollapsed] = useState(true);
  const { hiddenApps, unhideApp, masterApps } = useApps(); 

  const getAppDataByPackage = (pkgName) => {
    return masterApps?.find(a => a.packageName === pkgName);
  };

  const [leetCodeCollapsed, setLeetCodeCollapsed] = useState(true);
  const [inputUsername, setInputUsername] = useState(lcUsername);

  useEffect(() => {
    if (lcUsername && !inputUsername) {
      setInputUsername(lcUsername);
    }
  }, [lcUsername]);

  const handleLeetCodeLock = async () => {
    const finalUsername = inputUsername.trim() || lcUsername;
    
    if (!finalUsername) {
      Alert.alert("Hold up", "Please enter a LeetCode username.");
      return;
    }
  
    const success = await lockWithLeetCode(finalUsername);
    
    if (success) {
      Alert.alert("Locked!", `Focus launcher is now locked to ${finalUsername} until you solve a problem!`);
    } else {
      Alert.alert("Error", "Could not verify username. Check network or spelling.");
    }
  };

  const handleCheckUnlock = async () => {
    const unlocked = await checkLCUnlockStatus();

    if (unlocked) {
      Alert.alert("Unlocked!", "Great job solving that problem! Apps restored.");
    } else {
      Alert.alert("Still Locked", "You haven't solved a new problem yet. Get back to coding!");
    }
  };

  return (
    <SafeAreaView style={styles.SettingScreen}>
      <Text style={styles.header}>Focus Launcher</Text>

      {/* App List Section */}
      <View style={styles.collapsibleContainer}>
        <TouchableWithoutFeedback onPress={toggleAppListCollapse}>
          <View style={styles.collapsibleHeaderContainer}>
            <Text style={styles.collapsibleHeader}>App Drawer</Text>
            <Icon name={appListCollapsed ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="white" />
          </View>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.collapsedContent, appListStyle]}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Show App Icons</Text>
            <Pressable
              style={[styles.switchBase,{ backgroundColor: showAppIcons ? "blue" : "gray" }]}
              onPress={() => {
                toggleAppIcons();
                switchTranslateX.value = showAppIcons ? 0 : 20;
              }}
            >
              <Animated.View style={[styles.switchCircle, switchStyle]} />
            </Pressable>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Shuffle Apps</Text>
            <Pressable
              style={[styles.switchBase,{ backgroundColor: shuffleApps ? "blue" : "gray" }]}

              onPress={() => {
                toggleShuffleApps();
                switchTranslateX2.value = shuffleApps ? 0 : 20;
              }}
            >
              <Animated.View style={[styles.switchCircle, switchStyle2]} />
            </Pressable>
          </View>
        </Animated.View>
      </View>

      {/* Phone Lock Section */}
      <View style={styles.collapsibleContainer}>
        <TouchableWithoutFeedback onPress={togglePhoneLockCollapse}>
          <View style={styles.collapsibleHeaderContainer}>
            <Text style={styles.collapsibleHeader}>Phone Lock</Text>
            <Icon name={phoneLockCollapsed ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="white" />
          </View>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.collapsedContent, phoneLockStyle]}>
          <Text style={styles.switchLabel}>Lock Duration (minutes):</Text>
          <TextInput style={styles.input} keyboardType="numeric" placeholder="Enter time"  value={newLockedTime}
              onChangeText={setNewLockedTime}/>
          <Button title="Set Lock Time" onPress={handleLockedTimeChange} />
        </Animated.View>
      </View>

      <View style={styles.collapsibleContainer}>
        <TouchableWithoutFeedback onPress={toggleWallpaperCollapse}>
          <View style={styles.collapsibleHeaderContainer}>
            <Text style={styles.collapsibleHeader}>Wallpapers</Text>
            <Icon name={!wallpaperCollapsed ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="white" />
          </View>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.collapsedContent, wallpaperStyle]}>
        <FlatList
  data={Object.keys(wallpapers)}
  keyExtractor={(item) => item}
  numColumns={2} // Grid format
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{ flexGrow: 1, padding: 10 }}
  renderItem={({ item }) => (
    <View 
      style={styles.wallpaperItem} 
      onTouchEnd={() => {
        console.log("Wallpaper changed:", item);
        changeWallpaper(item);
      }}
    >
      <Image 
        source={wallpapers[item]} 
        style={styles.wallpaperImage} 
        pointerEvents="none" 
      />
      {selectedWallpaper === item && (
        <View style={styles.tickOverlay}>
          <IonIcon name="checkmark-circle" size={30} color="white" />
        </View>
      )}
    </View>
  )}
/>


</Animated.View>

      </View>

     <View style={styles.collapsibleContainer}>
        <TouchableWithoutFeedback onPress={() => setHiddenCollapsed(!hiddenCollapsed)}>
          <View style={styles.collapsibleHeaderContainer}>
            <Text style={styles.collapsibleHeader}>Hidden Apps</Text>
            <Icon name={hiddenCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} color="white" />
          </View>
        </TouchableWithoutFeedback>
        
        {!hiddenCollapsed && (
          <View style={[styles.collapsedContent, { paddingHorizontal: 15, paddingVertical: 5 }]}>
            {hiddenApps && hiddenApps.length > 0 ? (
              <ScrollView 
                style={styles.hiddenAppsScrollContainer}
                nestedScrollEnabled={true} 
                showsVerticalScrollIndicator={true} 
              >
                {hiddenApps.map((pkg, index) => {
                  const appData = getAppDataByPackage(pkg);
                  if (!appData) return null;

                  return (
                    <View key={index} style={styles.hiddenAppItem}>
                      <View style={styles.hiddenAppInfo}>
                        {appData.icon && (
                          <Image
                            source={{ uri: `data:image/png;base64,${appData.icon}` }}
                            style={styles.hiddenAppIcon}
                            resizeMode="contain"
                          />
                        )}
                        <Text style={styles.hiddenAppName} numberOfLines={1}>
                          {appData.appName}
                        </Text>
                      </View>
                      
                      <TouchableOpacity 
                        onPress={() => unhideApp(pkg, shuffleApps)} 
                        style={styles.unhideBtn}
                      >
                        <Icon name="close" size={20} color="#FF453A" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={styles.noHiddenText}>No hidden apps.</Text>
            )}
          </View>
        )}
      </View>


      <View style={styles.collapsibleContainer}>
        <TouchableWithoutFeedback onPress={() => setLeetCodeCollapsed(!leetCodeCollapsed)}>
          <View style={styles.collapsibleHeaderContainer}>
            <Text style={styles.collapsibleHeader}>LeetCode Lock</Text>
            <Icon name={leetCodeCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} color="white" />
          </View>
        </TouchableWithoutFeedback>
        
        {!leetCodeCollapsed && (
          <View style={[styles.collapsedContent, { paddingHorizontal: 15, paddingVertical: 15 }]}>
            {isLCLocked ? (
              <View>
                <Text style={[styles.switchLabel, { marginBottom: 10 }]}>
                  Device is currently locked! 
                </Text>
                <Button 
                  title={isChecking ? "Checking LeetCode..." : "Check Status & Unlock"} 
                  onPress={handleCheckUnlock} 
                  color="#34C759" 
                  disabled={isChecking}
                />
              </View>
            ) : (
              <View>
                <Text style={styles.switchLabel}>Enter LeetCode Username:</Text>
                <TextInput
                  style={[styles.input, { marginBottom: 10 }]}
                  placeholder="Username"
                  placeholderTextColor="#999"
                  value={inputUsername}
                  onChangeText={(val)=>(setInputUsername(val))}
                  autoCapitalize="none"
                />
                <Button 
                  title={isChecking ? "Verifying..." : "Verify & Lock"} 
                  onPress={handleLeetCodeLock} 
                  disabled={isChecking}
                />
              </View>
            )}
          </View>
        )}
      </View>

      {/* Links */}
      <View style={styles.linksContainer}>
        <Text style={styles.link} onPress={() => Linking.openURL("https://www.linkedin.com/in/chetannn/")}>
          LinkedIn {""}
          <IonIcon name="logo-linkedin" size={20} color="#0A66C2" />
        </Text>
        <Text style={styles.link} onPress={() => Linking.openURL("https://github.com/chetannn-github/")}>
          GitHub {""}
          <IonIcon name="logo-github" size={20} color="red" />
        </Text>
      </View>
    </SafeAreaView>
  );
}



export default SettingScreen;
