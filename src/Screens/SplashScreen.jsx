import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, NativeModules, Animated, Easing, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; 
import useSettingsStore from "../store/useSettingStore";
import useApps from "../store/useAppsStore";

const { OverlayModule, ScreenLock } = NativeModules;

export const SplashScreen = ({ onFinish }) => {
  const { loadSettings, setPerms } = useSettingsStore();
  const { fetchApps, shuffleApps } = useApps();

  // --- ANIMATION STATES ---
  const rippleAnim = useRef(new Animated.Value(0)).current;  
  const fadeAnim = useRef(new Animated.Value(0)).current;    
  const spinAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    // 1. Continuous Wave Animation (White ripple)
    Animated.loop(
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 3000, 
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    // 2. Slow Cube Rotation 
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 12000, // Super slow 12-second rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 3. Cinematic Slide-Up + Fade-In for Text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      delay: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // --- APP INITIALIZATION ---
    const initializeApp = async () => {
      try {
        const minWait = new Promise(resolve => setTimeout(resolve, 2500)); 
        
        const settingsPromise = loadSettings();
        
        const checkPermsPromise = async () => {
          if (OverlayModule && ScreenLock) {
            const hasOverlay = await OverlayModule.hasPermission();
            const hasAdmin = await ScreenLock.hasPermission();
            setPerms({ overlay: hasOverlay, admin: hasAdmin });
          }
        };

        await settingsPromise;
        const fetchAppsPromise = fetchApps(shuffleApps, "INIT"); 
        await Promise.all([fetchAppsPromise, checkPermsPromise(), minWait]);

      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        onFinish(); 
      }
    };

    initializeApp();
  }, []);

  // --- ANIMATION INTERPOLATIONS ---
  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.5] 
  });
  
  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0] // Subtle white fade
  });

  const textTranslateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0] 
  });

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.splashContainer}>
      
      
      {/* ICON & RIPPLE ANIMATION */}
      <View style={styles.iconContainer}>
        {/* Expanding Wave Layer */}
        <Animated.View 
          style={[
            styles.rippleCircle, 
            { 
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity 
            }
          ]} 
        />
        
        {/* Main Static Circle with Rotating Cube */}
        <View style={styles.mainCircle}>
          <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
            {/* Pure white rotating cube */}
            <Icon name="cube-outline" size={44} color="#FFF" />
          </Animated.View>
        </View>
      </View>
      
      {/* FADING & SLIDING MINIMAL TEXT */}
      <Animated.View 
        style={[
          styles.textContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: textTranslateY }] 
          }
        ]}
      >
        <Text style={styles.brandTitle}>FOCUS</Text>
        <Text style={styles.splashText}>Entering Deep Work</Text>
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  iconContainer: {
    marginBottom: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.02)', // Ultra subtle white glow
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', // Ash grey thin border
    zIndex: 2, 
  },
  rippleCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1, 
    borderColor: '#FFF', // Pure white expanding wave
    zIndex: 1, 
  },
  textContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 14, 
    marginBottom: 12,
    marginLeft: 14, 
  },
  splashText: { 
    color: '#666', // Muted dark grey for subtitle
    fontSize: 12, 
    fontWeight: '700', 
    letterSpacing: 5, 
    textTransform: 'uppercase' 
  }
});