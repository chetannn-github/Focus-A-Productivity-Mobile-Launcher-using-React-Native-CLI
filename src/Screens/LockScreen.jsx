import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { motivationalQuotes } from "../Constants/quotes";
import { styles } from "../Stylesheets/LockScreenStyle";
import useSettingsStore from "../store/useSettingStore";



const LockScreen = () => {
  const { lockedUntil, remainingTime, setRemainingTime } = useSettingsStore();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const interval = setInterval(setRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>
        {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, "0")}
      </Text>
      <Text style={styles.message}>Your phone is locked.</Text>
      <Text style={styles.quote}>{quote}</Text>
    </View>
  );
};



export default LockScreen;
