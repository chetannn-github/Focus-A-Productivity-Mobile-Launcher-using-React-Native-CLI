import { View, Text, ScrollView, Button } from 'react-native';
import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AppsList from './Components/AppsList';
import Progress from './Components/Progress';
import Sidebar from './Components/Sidebar';

const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();



function HomeScreen() {
  const navigation = useNavigation(); 

  return (
    <View style={{ flex: 1, backgroundColor: 'black', padding: 20 }}>
      <Progress />
      <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
}

function AllApps() {
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <ScrollView contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 10 }}>
        <AppsList />
      </ScrollView>
    </View>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: 'black', height: 0 },
        tabBarIndicatorStyle: { backgroundColor: 'transparent' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Apps" component={AllApps} options={{ tabBarLabel: () => null }} />
    </Tab.Navigator>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: 'black',
          width: '100%',
        },
        drawerType: 'front',
      }}
      drawerContent={() => <Sidebar />}  // This will render Sidebar as the content of the drawer
    >
      <Drawer.Screen name="Launcher" component={MyTabs} />
    </Drawer.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
};

export default App;
