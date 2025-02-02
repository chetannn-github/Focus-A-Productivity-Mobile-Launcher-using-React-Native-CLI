import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Linking, Switch, TextInput, Button } from 'react-native';
import { SettingsContext } from '../Context/SettingsContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

function Sidebar() {
  const { showAppIcons, shuffleApps, toggleAppIcons, toggleShuffleApps, showLeetcodeStats, toggleLeetcodeStats, leetcodeUsername, changeLeetcodeUsername } = useContext(SettingsContext);
  const [appListCollapsed, setAppListCollapsed] = useState(true);
  const [homeScreenSettingsCollapsed, setHomeScreenSettingsCollapsed] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(leetcodeUsername);

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const toggleAppListCollapse = () => {
    setAppListCollapsed(!appListCollapsed);
  };

  const toggleHomeScreenSettingsCollapse = () => {
    setHomeScreenSettingsCollapsed(!homeScreenSettingsCollapsed);
  };

  const handleUsernameChange = () => {
    changeLeetcodeUsername(newUsername);
    setEditingUsername(false);
  };

  return (
    <View style={styles.sidebar}>
      <Text style={styles.header}>Launcher Settings</Text>

      {/* App List Section */}
      <View style={styles.collapsibleContainer}>
        <TouchableWithoutFeedback onPress={toggleAppListCollapse}>
          <View style={styles.collapsibleHeaderContainer}>
            <Text style={styles.collapsibleHeader}>App List</Text>
            <Icon
              name={appListCollapsed ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color="white"
            />
          </View>
        </TouchableWithoutFeedback>
        {appListCollapsed && (
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

      {/* Home Screen Settings Section */}
      <View style={styles.collapsibleContainer}>
        <TouchableWithoutFeedback onPress={toggleHomeScreenSettingsCollapse}>
          <View style={styles.collapsibleHeaderContainer}>
            <Text style={styles.collapsibleHeader}>Home Screen Settings</Text>
            <Icon
              name={homeScreenSettingsCollapsed ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color="white"
            />
          </View>
        </TouchableWithoutFeedback>
        {homeScreenSettingsCollapsed && (
          <View style={styles.collapsedContent}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Leetcode Stats</Text>
              <Switch
                value={showLeetcodeStats}
                onValueChange={toggleLeetcodeStats}
              />
            </View>
            {showLeetcodeStats && (
              <View>
                {leetcodeUsername && !editingUsername && (
                  <View>
                    <Text style={styles.switchLabel}>Username: {leetcodeUsername}</Text>
                    <Button title="Edit" onPress={() => setEditingUsername(true)} />
                  </View>
                ) }
                {editingUsername && (
                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter New Username"
                      value={newUsername}
                      onChangeText={setNewUsername}
                    />
                    <Button title="Save" onPress={handleUsernameChange} />
                  </View>
                )}
              </View>
            )}
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
  input: {
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 10,
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