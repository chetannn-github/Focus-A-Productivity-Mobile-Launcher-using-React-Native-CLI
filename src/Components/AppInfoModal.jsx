import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet } from 'react-native'
import { Linking, Platform, Alert } from 'react-native';
import React from 'react'
import useApps from '../Hooks/useApps';

const AppInfoModal = ({isSheetVisible, selectedApp, closeSheet, hideApp}) => {
   

// App Info kholne ke liye
const openAppInfo = (packageName) => {
  if (Platform.OS === 'android') {
    // Android specific Intent for App Settings
    Linking.openSettings(); 
    // Note: Direct App Info page ke liye aap 'intent-filter' use kar sakte hain 
    // but openSettings() sabse safe aur easy native method hai.
  }
  closeSheet();
};

// Uninstall prompt kholne ke liye
const uninstallApp = (packageName) => {
  if (Platform.OS === 'android') {
    Linking.openURL(`package:${packageName}`).catch(err => 
      Alert.alert("Error", err)
    );
  } else {
    Alert.alert("Notice", "Uninstalling is only supported on Android via this method.");
  }
  closeSheet();
};

const handleHideClick = () => {
    hideApp(selectedApp.packageName);
    closeSheet();
}
    
  return (
   <Modal
  animationType="slide"
  transparent={true}
  visible={isSheetVisible}
  onRequestClose={closeSheet}
>
  <Pressable style={styles.backdrop} onPress={closeSheet}>
    {/* Screen ke baki hisse par click karne se band ho jayega */}
    
    <View style={styles.sheetContainer}>
      {/* Visual Indicator (Top Bar) */}
      <View style={styles.handle} />
      
      <Text style={styles.sheetTitle}>{selectedApp?.appName}</Text>
      <Text style={styles.pkgText}>{selectedApp?.packageName}</Text>

      <View style={styles.optionsWrapper}>
        {/* APP INFO BUTTON */}
        <TouchableOpacity 
          style={styles.sheetOption} 
          onPress={() => openAppInfo(selectedApp?.packageName)}
        >
          <Text style={styles.optionText}>ℹ️  App Info</Text>
        </TouchableOpacity>


        {/* HIDE APP BUTTON (Last item, so borderBottomWidth: 0) */}
        <TouchableOpacity 
          style={[styles.sheetOption, { borderBottomWidth: 0 }]} 
          onPress={() => {
            Alert.alert(
              "Hide App",
              "Are you sure you want to hide this app from the list?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Hide", onPress: handleHideClick }
              ]
            );
          }}
        >
          <Text style={styles.optionText}>👁️‍🗨️  Hide App</Text>
        </TouchableOpacity>
      </View>

      {/* CANCEL BUTTON */}
      <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </Pressable>
</Modal>
  )
}


const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', // Dark transparent overlay
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#121212', // Pure black se thoda light for elevation
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30, // iOS ke safe area ke liye
    elevation: 20, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  handle: {
    width: 45,
    height: 5,
    backgroundColor: '#48484A', // Visible grey handle
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  pkgText: {
    color: '#8E8E93',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 4,
  },
  optionsWrapper: {
    backgroundColor: '#1C1C1E', // Slightly lighter than sheet
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  sheetOption: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E', // Subtle separator
  },
  optionText: {
    color: '#E5E5EA', // Off-white for less eye strain
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 5, // Icon aur text ke beech thoda space
  },
  cancelBtn: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: '#0A84FF', // Standard iOS blue accent for cancel
    fontSize: 18,
    fontWeight: '600',
  },
});


export default AppInfoModal