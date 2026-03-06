import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet, Platform, Linking, Alert } from 'react-native';

const AppInfoModal = ({ isSheetVisible, selectedApp, closeSheet, hideApp }) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {},
  });

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };
  const openAppInfo = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    }
    closeSheet();
  };

  // Uninstall logic
  const uninstallApp = (packageName) => {
    hideAlert();
    if (Platform.OS === 'android') {
      Linking.openURL(`package:${packageName}`).catch(err =>
        Alert.alert("Error", String(err))
      );
    }
    closeSheet();
  };

  
  const handleHideClick = () => {
    hideAlert();
    hideApp(selectedApp.packageName);
    closeSheet();
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSheetVisible}
        onRequestClose={closeSheet}
      >
        <Pressable style={styles.backdrop} onPress={closeSheet}>
          <View style={styles.sheetContainer}>
            <View style={styles.handle} />

            <Text style={styles.sheetTitle}>{selectedApp?.appName}</Text>
            <Text style={styles.pkgText}>{selectedApp?.packageName}</Text>

            <View style={styles.optionsWrapper}>
              <TouchableOpacity
                style={styles.sheetOption}
                onPress={openAppInfo}
              >
                <Text style={styles.optionText}>ℹ️  App Info</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sheetOption, { borderBottomWidth: 0 }]}
                onPress={() => {
                  setAlertConfig({
                    visible: true,
                    title: "Hide App",
                    message: `Are you sure you want to hide '${selectedApp?.appName}' from the list?`,
                    confirmText: "Hide",
                    onConfirm: handleHideClick,
                  });
                }}
              >
                <Text style={styles.optionText}>👁️‍🗨️  Hide App</Text>
              </TouchableOpacity>
            </View>


            <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

    
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertConfig.visible}
        onRequestClose={hideAlert}
      >
        <Pressable style={styles.alertBackdrop} onPress={hideAlert}>
          <Pressable style={styles.alertContainer}>
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>

            <View style={styles.alertButtonRow}>
              {/* Alert Cancel Button */}
              <TouchableOpacity
                style={[styles.alertButton, styles.alertCancelButton]}
                onPress={hideAlert}
              >
                <Text style={styles.alertCancelText}>Cancel</Text>
              </TouchableOpacity>

              {/* Alert Confirm Button */}
              <TouchableOpacity
                style={styles.alertButton}
                onPress={alertConfig.onConfirm}
              >
                <Text style={styles.alertConfirmText}>{alertConfig.confirmText}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

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
    borderBottomColor: '#2C2C2E', 
  },
  optionText: {
    color: '#E5E5EA',
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 5,
  },
  cancelBtn: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: '#0A84FF',
    fontSize: 18,
    fontWeight: '600',
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
    borderRadius: 15,
    paddingTop: 25,
    alignItems: 'center',
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  alertTitle: {
    color: '#FFFFFF',
    fontSize: 19,
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
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCancelButton: {
    borderRightWidth: 0.5,
    borderRightColor: '#3A3A3C',
  },
  alertCancelText: {
    color: '#0A84FF',
    fontSize: 17,
    fontWeight: '400',
  },
  alertConfirmText: {
    color: '#FF453A', 
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default AppInfoModal;