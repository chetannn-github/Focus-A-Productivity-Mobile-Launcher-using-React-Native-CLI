import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppsList from './Components/AppsList';
import Progress from './Components/Progress';


const Tab = createMaterialTopTabNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'black',padding:20}}> 
      <Progress />
      
    </View>
  );
}

function AppDrawer() {
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
        tabBarStyle: { 
          backgroundColor: 'black', 
          height: 0 
        },
        tabBarIndicatorStyle: { backgroundColor: 'transparent' }, // Hide slider
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false, // Hide tab labels
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Profile" component={AppDrawer} options={{ tabBarLabel: () => null }} />
    </Tab.Navigator>
  );
}



const App = () => {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
};

export default App;
