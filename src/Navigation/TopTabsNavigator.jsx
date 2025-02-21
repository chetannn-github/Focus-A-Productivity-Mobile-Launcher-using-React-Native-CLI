import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "../Screens/HomeScreen";
import AppListScreen from "../Screens/AppListScreen";





export function TopTabsNavigator() {
    const Tab = createMaterialTopTabNavigator();
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
      <Tab.Screen name="Apps" component={AppListScreen} options={{ tabBarLabel: () => null }} />
    </Tab.Navigator>
  );
}