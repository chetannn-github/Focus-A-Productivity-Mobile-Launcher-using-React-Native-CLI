import LockScreen from "../Screens/LockScreen";
import { DrawerNavigator } from "./DrawerNavigator";
import useSettingsStore from "../store/useSettingStore";

export const MainNavigator = () => {
  const { remainingTime, checkIsLocked, isLCLocked} = useSettingsStore();
  return remainingTime > 0 || checkIsLocked() || isLCLocked? <LockScreen /> : <DrawerNavigator />;
};