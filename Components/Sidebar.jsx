import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Linking, Switch } from 'react-native';
import { SettingsContext } from '../Context/SettingsContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

function Sidebar() {
  const { showAppIcons, shuffleApps, toggleAppIcons, toggleShuffleApps } = useContext(SettingsContext);
  const [collapsed, setCollapsed] = useState(false);

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <View style={styles.sidebar}>
      <Text style={styles.header}>Launcher Settings</Text>

      {/* App List Section */}
      <View style={styles.collapsibleContainer}>
        <TouchableWithoutFeedback onPress={toggleCollapse}>
          <View style={styles.collapsibleHeaderContainer}>
            <Text style={styles.collapsibleHeader}>App List</Text>
            <Icon
              name={collapsed ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color="white"
            />
          </View>
        </TouchableWithoutFeedback>
        {collapsed && (
          <View style={styles.collapsedContent}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Show App Icons</Text>
              <Switch
                value={showAppIcons}
                onValueChange={toggleAppIcons}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Shuffle Apps</Text>
              <Switch
                value={shuffleApps}
                onValueChange={toggleShuffleApps}
              />
            </View>
          </View>
        )}
      </View>

      {/* Links */}
      <View style={styles.linksContainer}>
        <Text style={styles.link} onPress={() => openLink('https://www.linkedin.com/in/chetannn/')}>
          LinkedIn 
          <IonIcon name="logo-linkedin" size={20} color="white" />
        </Text>
        <Text style={styles.link} onPress={() => openLink('https://github.com/chetannn-github/')}>
          GitHub
          <IonIcon name="logo-github" size={20} color="white" />
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
    height: '100%',
    padding: 20,
  },
  header: {
    color: 'white',
    fontSize: 22,
    marginBottom: 20,
  },
  collapsibleContainer: {
    width: '100%',
    marginBottom: 10,
  },
  collapsibleHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapsibleHeader: {
    color: 'white',
    fontSize: 18,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', // low opacity border
  },
  collapsedContent: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'black',
    borderRadius: 5,
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  switchLabel: {
    color: 'white',
    marginRight: 10,
  },
  linksContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'black',
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    width: '48%',
    backgroundColor: "black", // LinkedIn Blue
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Sidebar;