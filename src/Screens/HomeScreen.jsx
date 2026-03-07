import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StatusBar, SafeAreaView, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

import { formatTime, getRandomQuote } from "../Constants/functions";
import { NativeModules } from 'react-native';
import { wallpapersObj } from "../Constants/wallpapers";
import useSettingsStore from "../store/useSettingStore";
import { handleBackgroundTap } from "../utils/doubleTap";

const { InstalledApps, ScreenLock } = NativeModules;


const GradientOverlay = ({ position }) => {
    const isTop = position === 'top';
    const layers = 20; // 20 strips for smooth blending
    const stripHeight = isTop ? 15 : 10; // Top fade is 300px, Bottom fade is 200px

    return (
        <View style={[StyleSheet.absoluteFill, { justifyContent: isTop ? 'flex-start' : 'flex-end', zIndex: 0 }]} pointerEvents="none">
            {[...Array(layers)].map((_, i) => {
                const opacity = isTop 
                    ? 0.7 * (1 - (i / (layers - 1))) 
                    : 0.9 * (i / (layers - 1));
                
                return (
                    <View 
                        key={i} 
                        style={{ height: stripHeight, width: '100%', backgroundColor: `rgba(0, 0, 0, ${opacity})` }} 
                    />
                );
            })}
        </View>
    );
};


export default function HomeScreen() {
    const [quote, setQuote] = useState(getRandomQuote());
    const [defaultPhone, setDefaultPhone] = useState(null);     
    const { selectedWallpaper, lcStats, lcUsername, showLCStats} = useSettingsStore(); 
    
    const navigation = useNavigation();
    const wallpaperURI = parseInt(selectedWallpaper) + 1;
    const wallpaperURIString = wallpapersObj["wallpaper"+wallpaperURI];

    useEffect(() => {
        const initPhoneApp = async () => {
            try {
                const storedPhone = await AsyncStorage.getItem("defaultPhoneApp");
                if (storedPhone) {
                    setDefaultPhone(storedPhone);
                } else {
                    const phone = await InstalledApps.getDefaultPhoneApp();
                    if (phone) {
                        setDefaultPhone(phone);
                        await AsyncStorage.setItem("defaultPhoneApp", phone);
                    }
                }
            } catch (e) {
                console.error("Error initializing phone app:", e);
            }
        };
        initPhoneApp();
    }, []);

    const openPhoneApp = async () => {
        try {
            if (defaultPhone) {
                await InstalledApps.openApp(defaultPhone);
            } else {
                const phone = await InstalledApps.getDefaultPhoneApp();
                await InstalledApps.openApp(phone);
            }
        } catch (error) {
            console.error("Error opening phone app:", error);
        }
    };
    
    useEffect(() => { 
        let id = setInterval(() => {
            setQuote(() => getRandomQuote());
        }, 106000);

        return () => clearInterval(id);
    }, []);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
            <ImageBackground 
                source={selectedWallpaper ? wallpaperURIString : require("../assets/wallpapers/wallpaper1.jpg")}  
                resizeMode="cover"
                style={customStyles.background}
            >
                <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
                <Pressable style={StyleSheet.absoluteFill} onPress={() => handleBackgroundTap(ScreenLock)} />
                {/* CUSTOM NO-LIBRARY GRADIENTS */}
                <GradientOverlay position="top" />
                <GradientOverlay position="bottom" />
                
                <View style={customStyles.contentWrapper}>
                    <Text style={customStyles.timeText}>
                        {formatTime(currentTime)}
                    </Text>
                    <Text style={customStyles.quoteText}>
                        {quote}
                    </Text>

                    {showLCStats && lcUsername && lcStats && (
                        <View style={customStyles.lcPillContainer}>
                            <View style={customStyles.statColumn}>
                                <Text style={[customStyles.statLabel, { color: '#00b8a3' }]}>EASY</Text>
                                <Text style={customStyles.statValue}>{lcStats.easy || 0}</Text>
                            </View>
                            
                            <View style={customStyles.divider} />
                            
                            <View style={customStyles.statColumn}>
                                <Text style={[customStyles.statLabel, { color: '#ffc01e' }]}>MED</Text>
                                <Text style={customStyles.statValue}>{lcStats.medium || 0}</Text>
                            </View>
                            
                            <View style={customStyles.divider} />
                            
                            <View style={customStyles.statColumn}>
                                <Text style={[customStyles.statLabel, { color: '#ff375f' }]}>HARD</Text>
                                <Text style={customStyles.statValue}>{lcStats.hard || 0}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Floating Bottom Icons */}
                <View style={customStyles.footerContainer}>
                    <TouchableOpacity 
                        style={customStyles.iconButton} 
                        onPress={() => navigation.openDrawer()}
                        activeOpacity={0.6}
                    >
                        <Icon name="more-horiz" size={32} color="#FFF" style={customStyles.iconShadow} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={customStyles.iconButton} 
                        onPress={openPhoneApp}
                        activeOpacity={0.6}
                    >
                        <Icon name="phone" size={28} color="#FFF" style={customStyles.iconShadow} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const customStyles = StyleSheet.create({
    background: {
        flex: 1, 
        backgroundColor: '#000', 
    },
    contentWrapper: {
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    timeText: {
        color: '#FFFFFF', 
        fontSize: 20,
        fontWeight: '500', 
        letterSpacing: 1.5,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
    },
    quoteText: {
        color: '#FFFFFF', 
        fontSize: 14, 
        fontWeight: '400',
        opacity: 1,
        marginTop: 3,
        lineHeight: 22,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
    },
    
    lcPillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)', 
        width: '80%', 
    },
    statColumn: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 2,
    },
    statValue: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '400',
    },
    divider: {
        width: 1,
        height: '70%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },

    footerContainer: {
        position: 'absolute', 
        bottom: 30, 
        left: 0, 
        right: 0, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 30,
        zIndex: 1, // Icons fade ke upar rahein
    },
    iconButton: {
        padding: 10, 
    },
    iconShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 5,
    }
});