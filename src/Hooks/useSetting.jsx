import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../Context/SettingsContext";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

function useSetting() {
    const {lockedTime, setLockedTime ,showAppIcons,shuffleApps} = useContext(SettingsContext);
    const drawerStatus = useDrawerStatus();
    const [appListCollapsed, setAppListCollapsed] = useState(true);
    const [phoneLockCollapsed, setPhoneLockCollapsed] = useState(true);
    const [wallpaperCollapsed, setWallpaperCollapsed] = useState(true);
    const [newLockedTime, setNewLockedTime] = useState(lockedTime.toString());

    const appListHeight = useSharedValue(0);
    const phoneLockHeight = useSharedValue(0);
    const wallpaperHeight = useSharedValue(0);

    const switchTranslateX = useSharedValue(showAppIcons ? 20 : 0);
    const switchTranslateX2 = useSharedValue(shuffleApps ? 20 : 0);

    useEffect(() => {
        if (drawerStatus === "closed") {
          setAppListCollapsed(false);
          setPhoneLockCollapsed(false);
          setWallpaperCollapsed(true);
          appListHeight.value = 0;
          phoneLockHeight.value = 0;
          wallpaperHeight.value = 0;
        }
    }, [drawerStatus]);
    
    const handleLockedTimeChange = () => {
        const time = parseInt(newLockedTime, 10);
        if (!isNaN(time) && time >= 0) {
          setLockedTime(time);
        }
    }


    const toggleAppListCollapse = () => {
        setAppListCollapsed(!appListCollapsed);
        appListHeight.value = appListCollapsed ? 0 : 85; 
    };
    
    const togglePhoneLockCollapse = () => {
        setPhoneLockCollapsed(!phoneLockCollapsed);
        phoneLockHeight.value = phoneLockCollapsed ? 0 : 110;
    };
      
    const toggleWallpaperCollapse = () => {
        setWallpaperCollapsed(!wallpaperCollapsed);
        wallpaperHeight.value = wallpaperCollapsed ? 550 : 0;
    };
    
    const wallpaperStyle = useAnimatedStyle(() => ({
        height: withTiming(wallpaperHeight.value, { duration: 300 }),
        opacity: wallpaperHeight.value > 0 ? 1 : 0,
    }));


    const switchStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: withTiming(switchTranslateX.value, { duration: 200 }) }],
    }));
    
    const switchStyle2 = useAnimatedStyle(() => ({
        transform: [{ translateX: withTiming(switchTranslateX2.value, { duration: 200 }) }],
    }));
    
    const appListStyle = useAnimatedStyle(() => ({
        height: withTiming(appListHeight.value, { duration: 300 }),
        opacity: appListHeight.value > 0 ? 1 : 0,
    }));
    
    const phoneLockStyle = useAnimatedStyle(() => ({
        height: withTiming(phoneLockHeight.value, { duration: 300 }),
        opacity: phoneLockHeight.value > 0 ? 1 : 0,
    }));

    return {
        handleLockedTimeChange,
        newLockedTime,
        setNewLockedTime,
        appListCollapsed,
        phoneLockCollapsed,
        wallpaperCollapsed,
        toggleAppListCollapse,
        togglePhoneLockCollapse,
        toggleWallpaperCollapse,
        wallpaperStyle,
        switchStyle,
        switchStyle2,
        appListStyle,
        phoneLockStyle,
        switchTranslateX,
        switchTranslateX2
    }       
}

export default useSetting