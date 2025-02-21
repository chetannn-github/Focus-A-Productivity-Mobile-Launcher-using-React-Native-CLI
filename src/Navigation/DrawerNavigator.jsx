import { createDrawerNavigator } from "@react-navigation/drawer";
import SettingScreen from "../Screens/SettingScreen";
import { TopTabsNavigator } from "./TopTabsNavigator";




export function DrawerNavigator() {
    const Drawer = createDrawerNavigator();
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
        drawerContent={() => <SettingScreen />}
      >
        <Drawer.Screen name="Launcher" component={TopTabsNavigator} />
      </Drawer.Navigator>
    );
  }