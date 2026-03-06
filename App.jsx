import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { MainNavigator } from "./src/Navigation/MainNavigator";
import useSettingsStore from "./src/store/useSettingStore";


const App = () => {
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  useEffect(() => {
    loadSettings();
  }, []);
  
  return (
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" />
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
    </>
  );
};

export default App;
