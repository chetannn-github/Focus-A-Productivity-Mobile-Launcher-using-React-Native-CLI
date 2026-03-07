import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StatusBar, SafeAreaView, StyleSheet, TouchableOpacity, Pressable } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

import { getRandomQuote } from "../Constants/functions";
import { NativeModules } from 'react-native';
import { wallpapersObj } from "../Constants/wallpapers";
import useSettingsStore from "../store/useSettingStore";
import { handleBackgroundTap } from "../utils/doubleTap";
import ClockView from "../Components/HomeScreen/ClockView";

const { InstalledApps, ScreenLock } = NativeModules;

const GradientOverlay = ({ position }) => {
    const isTop = position === 'top';
    const layers = 15; 
    return (
        <View style={[StyleSheet.absoluteFill, { justifyContent: isTop ? 'flex-start' : 'flex-end', zIndex: 0 }]} pointerEvents="none">
            {[...Array(layers)].map((_, i) => (
                <View 
                    key={i} 
                    style={{ 
                        height: isTop ? 12 : 8, 
                        width: '100%', 
                        backgroundColor: `rgba(0, 0, 0, ${isTop ? 0.6 * (1 - (i / layers)) : 0.8 * (i / layers)})` 
                    }} 
                />
            ))}
        </View>
    );
};

export default function HomeScreen() {
    const [quote, setQuote] = useState(getRandomQuote());
    const { selectedWallpaper, lcStats, lcUsername, showLCStats, defaultPhoneApp} = useSettingsStore(); 
    const navigation = useNavigation();
    const wallpaperURI = parseInt(selectedWallpaper) + 1;
    const wallpaperURIString = wallpapersObj["wallpaper"+wallpaperURI];


    const openPhoneApp = async () => {
        try {
            const phone = defaultPhoneApp || await InstalledApps.getDefaultPhoneApp();
            await InstalledApps.openApp(phone);
        } catch (error) { console.error(error); }
    };
    
    useEffect(() => { 
        const id = setInterval(() => setQuote(getRandomQuote()), 106000);
        return () => { clearInterval(id); };
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
                
                <GradientOverlay position="top" />
                <GradientOverlay position="bottom" />
                
                <View style={customStyles.mainContent}>
                    <View style={customStyles.topHeader}>
                        <ClockView/>
                        <Text style={customStyles.quoteText}>{quote}</Text>
                    </View>

                    {showLCStats && lcUsername && lcStats && (
                        <View style={customStyles.statsWrapper}>
                            <View style={customStyles.minimalStatItem}>
                                <View style={[customStyles.dot, { backgroundColor: '#00b8a3' }]} />
                                <Text style={customStyles.statValue}>{lcStats.easy || 0}</Text>
                            </View>
                            
                            <View style={customStyles.minimalStatItem}>
                                <View style={[customStyles.dot, { backgroundColor: '#ffc01e' }]} />
                                <Text style={customStyles.statValue}>{lcStats.medium || 0}</Text>
                            </View>
                            
                            <View style={customStyles.minimalStatItem}>
                                <View style={[customStyles.dot, { backgroundColor: '#ff375f' }]} />
                                <Text style={customStyles.statValue}>{lcStats.hard || 0}</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={customStyles.footerContainer}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.5}>
                        <Icon name="more-horiz" size={32} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={openPhoneApp} activeOpacity={0.5}>
                        <Icon name="phone" size={26} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const customStyles = StyleSheet.create({
    background: {
        flex: 1, 
    },
    mainContent: {
        paddingTop: 30,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    topHeader: {
        alignItems: 'center', 
        marginBottom: 10,
    },
    quoteText: {
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 13, 
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 18,
        maxWidth: '90%',
    },
    statsWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Almost transparent
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 50, 
    },
    minimalStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    footerContainer: {
        position: 'absolute', 
        bottom: 40, 
        left: 0, 
        right: 0, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 40,
    }
});