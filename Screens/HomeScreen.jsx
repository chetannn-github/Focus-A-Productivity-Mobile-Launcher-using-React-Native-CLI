import React, { useContext, useState, useEffect } from "react";
import { View, Text, Linking } from "react-native";
import Progress from "../Components/Progress";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SettingsContext } from "../Context/SettingsContext";
import { formatTime, getRandomQuote } from "../Constants/functions";

export function HomeScreen() {
    const [quote, setQuote] = useState(getRandomQuote());
    const { showLeetcodeStats } = useContext(SettingsContext);
    const navigation = useNavigation();

    const openPhoneApp = () => {
        Linking.openURL('tel:');
    };

    useEffect(() => { 
    let id = setInterval(() => {
        setQuote(()=>getRandomQuote());
    },36000);

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
        <View style={{ flex:1, backgroundColor: 'black', padding: 25 ,flexDirection:"column",justifyContent:"flex-start",alignContent:"flex-start"}}>
            
            {/* {showLeetcodeStats && <Progress />} */}

            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                {formatTime(currentTime)}
                
                
            </Text>
            <Text style={{ color: 'white', fontSize: 16, }}>{quote}</Text>
            


            <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                <Icon name="more-horiz" size={30} color="white" onPress={() => navigation.openDrawer()} />
                <Icon name="phone" size={30} color="white" onPress={openPhoneApp} />
            </View>
        </View>
    );
}
