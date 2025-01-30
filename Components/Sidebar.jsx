import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

function Sidebar() {
  const [collapsed, setCollapsed] = useState([false, false, false, false]);

  const toggleCollapse = (index) => {
    const updatedCollapsed = [...collapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setCollapsed(updatedCollapsed);
  };

  return (
    <View style={styles.sidebar}>
      <Text style={styles.header}>Launcher Settings</Text>

      {/* Collapsible sections */}
      {['Setting 1', 'Setting 2', 'Setting 3', 'Setting 4'].map((setting, index) => (
        <View key={index} style={styles.collapsibleContainer}>
          <TouchableWithoutFeedback onPress={() => toggleCollapse(index)}>
            <Text style={styles.collapsibleHeader}>{setting}</Text>
          </TouchableWithoutFeedback>
          {collapsed[index] && <Text style={styles.collapsedContent}>Content for {setting}</Text>}
        </View>
      ))}

      {/* Links */}
      <View style={styles.linksContainer}>
        <Text style={styles.link}>LinkedIn</Text>
        <Text style={styles.link}>GitHub</Text>
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
    color: 'white',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginTop: 5,
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
  },
});

export default Sidebar;
