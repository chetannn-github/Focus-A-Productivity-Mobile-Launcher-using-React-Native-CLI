import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet,Image, TouchableWithoutFeedback, Linking, TextInput, Button, Pressable, ScrollView, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { SettingsContext } from "../Context/SettingsContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useDrawerStatus } from "@react-navigation/drawer";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { wallpapers } from "../Constants/wallpapers";
import { styles } from "../Stylesheets/SettingScreenStyle";

function SettingScreen() {
  const { showAppIcons, toggleAppIcons, shuffleApps, toggleShuffleApps,lockedTime, setLockedTime ,selectedWallpaper,
    changeWallpaper} = useContext(SettingsContext);
  const [appListCollapsed, setAppListCollapsed] = useState(true);
  const [phoneLockCollapsed, setPhoneLockCollapsed] = useState(true);
  const [newLockedTime, setNewLockedTime] = useState(lockedTime.toString());
  const drawerStatus = useDrawerStatus();

  const [wallpaperCollapsed, setWallpaperCollapsed] = useState(true);
  

  // Shared values for animations
  const switchTranslateX = useSharedValue(showAppIcons ? 20 : 0);
  const switchTranslateX2 = useSharedValue(shuffleApps ? 20 : 0);
  const appListHeight = useSharedValue(0);
  const phoneLockHeight = useSharedValue(0);
  const wallpaperHeight = useSharedValue(0);

  // Animated styles
  const switchStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(switchTranslateX.value, { duration: 200 }) }],
  }));

  const switchStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(switchTranslateX2.value, { duration: 200 }) }],
  }));

  const appListStyle = useAnimatedStyle(() => ({
    height: withTiming(appListHeight.value, { duration: 300 }),
    opacity: appListHeight.value > 0 ? 1 : 0,
  }));

  const phoneLockStyle = useAnimatedStyle(() => ({
    height: withTiming(phoneLockHeight.value, { duration: 300 }),
    opacity: phoneLockHeight.value > 0 ? 1 : 0,
  }));

  // Toggle functions with animations
  const toggleAppListCollapse = () => {
    setAppListCollapsed(!appListCollapsed);
    appListHeight.value = appListCollapsed ? 0 : 85; 
  };

  const togglePhoneLockCollapse = () => {
    setPhoneLockCollapsed(!phoneLockCollapsed);
    phoneLockHeight.value = phoneLockCollapsed ? 0 : 110;
  };

  const handleLockedTimeChange = () => {
    const time = parseInt(newLockedTime, 10);
    if (!isNaN(time) && time >= 0) {
      setLockedTime(time);
    }
  };

  const wallpaperStyle = useAnimatedStyle(() => ({
    height: withTiming(wallpaperHeight.value, { duration: 300 }),
    opacity: wallpaperHeight.value > 0 ? 1 : 0,
  }));

  const toggleWallpaperCollapse = () => {
    setWallpaperCollapsed(!wallpaperCollapsed);
    wallpaperHeight.value = wallpaperCollapsed ? 550 : 0;
  };

  useEffect(() => {
    if (drawerStatus === "closed") {
      setAppListCollapsed(false);
      setPhoneLockCollapsed(false);
      setWallpaperCollapsed(true);
      appListHeight.value = 0;
      phoneLockHeight.value = 0;
      wallpaperHeight.value = 0;
    }
  }, [drawerStatus]);

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
