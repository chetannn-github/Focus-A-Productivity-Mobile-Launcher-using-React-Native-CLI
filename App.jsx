import React from "react";
import { NavigationContainer } from "@react-navigation/native";


import { StatusBar } from "react-native";

import { MainNavigator } from "./src/Navigation/MainNavigator";
import { SettingsProvider } from "./src/Context/SettingsContext";


const App = () => {
  
  return (
    <SettingsProvider>
      <StatusBar backgroundColor="black" barStyle="light-content" />
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      
    </SettingsProvider>
  );
};

export default App;
