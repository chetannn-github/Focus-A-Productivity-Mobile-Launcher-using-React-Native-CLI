import React, { useContext, useState, useEffect } from "react";
import { View, Text, ImageBackground, StatusBar, SafeAreaView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SettingsContext } from "../Context/SettingsContext";
import { formatTime, getRandomQuote } from "../Constants/functions";
import { NativeModules } from 'react-native';
import {  wallpapersObj } from "../Constants/wallpapers";

const { InstalledApps } = NativeModules;

export default function HomeScreen() {
   
    const [quote, setQuote] = useState(getRandomQuote());
    const { showLeetcodeStats ,selectedWallpaper} = useContext(SettingsContext);
    const navigation = useNavigation();
    const wallpaperURI = parseInt(selectedWallpaper) + 1;
    const wallpaperURIString = wallpapersObj["wallpaper"+wallpaperURI+""];

    // console.log(wallpaperURIString);
    
    

    const openPhoneApp = async () => {
        try {
            const phone = await InstalledApps.getDefaultPhoneApp();
            await InstalledApps.openApp(phone);
            console.log(phone);
        } catch (error) {
            console.error("Error opening default phone app:", error);
        }
    };
    

    useEffect(() => { 
    let id = setInterval(() => {
        setQuote(()=>getRandomQuote());
    },106000);

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
            style={{ flex:1, backgroundColor: 'black', paddingTop:50 ,paddingHorizontal:15,flexDirection:"column",justifyContent:"flex-start",alignContent:"flex-start"}}>
            
            {/* {showLeetcodeStats && <Progress />} */}
            <StatusBar 
                barStyle="light-content" 
                translucent={true} 
                backgroundColor="transparent" 
            />
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'medium',marginBottom:5 }}>
                {formatTime(currentTime)}
                
                
            </Text>
            <Text style={{ color: 'white', fontSize: 16, }}>{quote}</Text>
            


            <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                <Icon name="more-horiz" size={30} color="white" onPress={() => navigation.openDrawer()} />
                <Icon name="phone" size={30} color="white" onPress={openPhoneApp} />
            </View>
        </ImageBackground>
        </SafeAreaView>
    );
}
