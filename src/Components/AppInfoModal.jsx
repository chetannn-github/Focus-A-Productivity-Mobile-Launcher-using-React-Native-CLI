import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet, Platform, Linking, Vibration } from 'react-native';

const AppInfoModal = ({ isSheetVisible, selectedApp, closeSheet, hideApp }) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {},
  });

  const hideAlert = () => setAlertConfig((prev) => ({ ...prev, visible: false }));

  const openAppInfo = () => {
    Vibration.vibrate(5);
    if (Platform.OS === 'android') {
      Linking.openSettings();
    }
    closeSheet();
  };

  const handleHideClick = () => {
    Vibration.vibrate(10);
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
            {/* Slim Minimal Handle */}
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.sheetTitle}>{selectedApp?.appName}</Text>
              <Text style={styles.pkgText}>{selectedApp?.packageName}</Text>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionRow} onPress={openAppInfo} activeOpacity={0.5}>
                <Text style={styles.actionLabel}>App settings</Text>
                <Text style={styles.actionArrow}>→</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.actionRow} 
                onPress={() => {
                  Vibration.vibrate(5);
                  setAlertConfig({
                    visible: true,
                    title: "Hide app",
                    message: `Remove '${selectedApp?.appName}' from list?`,
                    confirmText: "Hide",
                    onConfirm: handleHideClick,
                  });
                }}
                activeOpacity={0.5}
              >
                <Text style={[styles.actionLabel, { color: '#FF3B30' }]}>Hide from launcher</Text>
                <Text style={[styles.actionArrow, { color: '#FF3B30' }]}>×</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.dismissButton} onPress={closeSheet}>
              <Text style={styles.dismissText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* --- ULTRA-MINIMAL ALERT --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertConfig.visible}
        onRequestClose={hideAlert}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMsg}>{alertConfig.message}</Text>
            
            <View style={styles.alertActions}>
              <TouchableOpacity style={styles.alertBtn} onPress={hideAlert}>
                <Text style={styles.cancelText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.alertBtn} onPress={alertConfig.onConfirm}>
                <Text style={styles.confirmText}>{alertConfig.confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)', // Deep immersive dim
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#0A0A0A', // Perfect OLED-friendly Dark
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 45 : 25,
    borderWidth: 1,
    borderColor: '#1A1A1A', // Sharp hairline border
  },
  handle: {
    width: 32,
    height: 3,
    backgroundColor: '#222',
    borderRadius: 1.5,
    alignSelf: 'center',
    marginBottom: 35,
  },
  header: {
    marginBottom: 35,
  },
  sheetTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  pkgText: {
    color: '#3A3A3C',
    fontSize: 11,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionContainer: {
    marginBottom: 30,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  actionLabel: {
    color: '#A1A1A6',
    fontSize: 17,
    fontWeight: '600',
  },
  actionArrow: {
    color: '#2C2C2E',
    fontSize: 18,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: '#111',
  },
  dismissButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#161618',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  dismissText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // --- ALERT STYLES ---
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertCard: {
    width: '78%',
    backgroundColor: '#0F0F11',
    borderRadius: 28,
    paddingTop: 35,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    alignItems: 'center',
    overflow: 'hidden',
  },
  alertTitle: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
  },
  alertMsg: {
    color: '#48484A',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 35,
    marginBottom: 35,
    lineHeight: 20,
  },
  alertActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1C',
  },
  alertBtn: {
    flex: 1,
    padding: 18,
    alignItems: 'center',
  },
  cancelText: {
    color: '#636366',
    fontWeight: '700',
  },
  confirmText: {
    color: '#0A84FF',
    fontWeight: '900',
  },
});

export default AppInfoModal;