import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StatusBar, SafeAreaView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Added AsyncStorage

import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

import { formatTime, getRandomQuote } from "../Constants/functions";
import { NativeModules } from 'react-native';
import { wallpapersObj } from "../Constants/wallpapers";
import useSettingsStore from "../store/useSettingStore";

const { InstalledApps } = NativeModules;

export default function HomeScreen() {
    const [quote, setQuote] = useState(getRandomQuote());
    const [defaultPhone, setDefaultPhone] = useState(null); // Local state for phone package
    
    const { selectedWallpaper, lcStats, lcUsername, showLCStats} = useSettingsStore(); 
    
    const navigation = useNavigation();
    const wallpaperURI = parseInt(selectedWallpaper) + 1;
    const wallpaperURIString = wallpapersObj["wallpaper"+wallpaperURI+""];

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
    // ----------------------------------
    
    useEffect(() => { 
        let id = setInterval(() => {
            setQuote(() => getRandomQuote());
        }, 106000);

        return () => clearInterval(id);
    }, []);

    // Time state
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <ImageBackground 
                source={selectedWallpaper ? wallpaperURIString : require("../assets/wallpapers/wallpaper1.jpg")}  
                resizeMode="cover"
                style={{ flex:1, backgroundColor: 'black', paddingTop:50 ,paddingHorizontal:15,flexDirection:"column",justifyContent:"flex-start",alignContent:"flex-start"}}
            >
                <StatusBar 
                    barStyle="light-content" 
                    translucent={true} 
                    backgroundColor="transparent" 
                />
                
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '500', marginBottom: 5 }}>
                    {formatTime(currentTime)}
                </Text>
                
                <Text style={{ color: 'white', fontSize: 16, marginBottom: 15, opacity: 0.9 }}>
                    {quote}
                </Text>

                {showLCStats && lcUsername && lcStats && (
                    <View style={customStyles.statsWrapper}>
                        <View style={customStyles.statBox}>
                            <Text style={[customStyles.statDot, { color: '#00b8a3' }]}>E</Text>
                            <Text style={customStyles.statValue}>{lcStats.easy || 0}</Text>
                        </View>
                        <View style={customStyles.statBox}>
                            <Text style={[customStyles.statDot, { color: '#ffc01e' }]}>M</Text>
                            <Text style={customStyles.statValue}>{lcStats.medium || 0}</Text>
                        </View>
                        <View style={customStyles.statBox}>
                            <Text style={[customStyles.statDot, { color: '#ff375f' }]}>H</Text>
                            <Text style={customStyles.statValue}>{lcStats.hard || 0}</Text>
                        </View>
                    </View>
                )}

                <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                    <Icon name="more-horiz" size={30} color="white" onPress={() => navigation.openDrawer()} />
                    <Icon name="phone" size={30} color="white" onPress={openPhoneApp} />
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const customStyles = StyleSheet.create({
    statsWrapper: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)', 
        gap: 15,
    },
    statBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statDot: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    }
});