import { useContext } from "react";
import { SettingsContext } from "../Context/SettingsContext";
import LockScreen from "../Screens/LockScreen";
import { DrawerNavigator } from "./DrawerNavigator";

export const MainNavigator = () => {
  const {lockedTime} = useContext(SettingsContext);

  return lockedTime > 0 ? <LockScreen /> : <DrawerNavigator />;
};