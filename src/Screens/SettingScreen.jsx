import React, { useContext} from "react";
import { View, Text,Image, TouchableWithoutFeedback, Linking, TextInput, Button, Pressable, ScrollView, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { SettingsContext } from "../Context/SettingsContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import Animated from "react-native-reanimated";
import { wallpapers } from "../Constants/wallpapers";
import { styles } from "../Stylesheets/SettingScreenStyle";
import useSetting from "../Hooks/useSetting";

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

  const { showAppIcons, toggleAppIcons, shuffleApps, toggleShuffleApps ,selectedWallpaper,
    changeWallpaper} = useContext(SettingsContext);
 
  
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
