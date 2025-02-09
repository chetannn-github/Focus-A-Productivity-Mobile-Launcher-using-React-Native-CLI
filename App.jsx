import React ,{useContext, useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SettingsContext, SettingsProvider } from "./Context/SettingsContext";


import AppsList from "./Components/AppsList";
import Sidebar from "./Components/Sidebar";
import { HomeScreen } from "./Screens/HomeScreen";
import { ScrollView, StatusBar, View } from "react-native";
import LockScreen from "./Screens/LockScreen";


const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

function AllApps() {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
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
        tabBarStyle: { backgroundColor: "black", height: 0 },
        tabBarIndicatorStyle: { backgroundColor: "transparent" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
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
          backgroundColor: "black",
          width: "100%",
        },
        drawerType: "front",
      }}
      drawerContent={() => <Sidebar />}
    >
      <Drawer.Screen name="Launcher" component={MyTabs} />
    </Drawer.Navigator>
  );
}

const AppNavigator = () => {
  const {lockedTime} = useContext(SettingsContext);

  return lockedTime > 0 ? <LockScreen /> : <MyDrawer />;
};

const App = () => {
  
  return (
    <SettingsProvider>
      <StatusBar backgroundColor="black" barStyle="light-content" />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      
    </SettingsProvider>
  );
};

export default App;
