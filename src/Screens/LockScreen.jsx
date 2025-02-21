import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SettingsContext } from "../Context/SettingsContext";
import { motivationalQuotes } from "../Constants/quotes";



const LockScreen = () => {
  const { lockedTime, setLockedTime } = useContext(SettingsContext);
  const [remainingTime, setRemainingTime] = useState(lockedTime * 60);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Har lock hone pe ek random quote select karo
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setLockedTime(0); // Unlock the phone
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000", padding: 20 },
  timer: { fontSize: 48, color: "#fff", fontWeight: "bold" },
  message: { fontSize: 18, color: "#fff", marginTop: 10 },
  quote: { fontSize: 16, color: "#fff", marginTop: 20, fontStyle: "italic", textAlign: "center" },
});

export default LockScreen;
