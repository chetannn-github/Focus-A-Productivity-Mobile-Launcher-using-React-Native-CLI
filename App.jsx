import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { MainNavigator } from "./src/Navigation/MainNavigator";
import { SplashScreen } from "./src/Screens/SplashScreen";


const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  
  return (
    <>
      {!isAppReady ? (
        <>
        <StatusBar hidden = {true}/>
        <SplashScreen onFinish={() => setIsAppReady(true)} />
          </>
      ) : (
        <NavigationContainer>
        <StatusBar backgroundColor="black" barStyle="light-content" />
          <MainNavigator />
        </NavigationContainer>
      )}
    </>
  );
};



export default App;