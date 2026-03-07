import { useEffect, useState } from "react";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import useSettingsStore from "../store/useSettingStore";

function useSetting() {
    const { lockForMinutes, showAppIcons, shuffleApps, showLCStats } = useSettingsStore();
    const drawerStatus = useDrawerStatus();
    const [activeSection, setActiveSection] = useState(null); 
    const [newLockedTime, setNewLockedTime] = useState("10");

    // Shared values for smooth height animations
    const appListHeight = useSharedValue(0);
    const phoneLockHeight = useSharedValue(0);
    const wallpaperHeight = useSharedValue(0);
    const hiddenAppsHeight = useSharedValue(0);
    const leetCodeHeight = useSharedValue(0);

    const switchTranslateX = useSharedValue(showAppIcons ? 20 : 0);
    const switchTranslateX2 = useSharedValue(shuffleApps ? 20 : 0);

    useEffect(() => {
        if (drawerStatus === "closed") {
          setActiveSection(null);
          appListHeight.value = 0;
          phoneLockHeight.value = 0;
          wallpaperHeight.value = 0;
          hiddenAppsHeight.value = 0;
          leetCodeHeight.value = 0;
        }
    }, [drawerStatus]);

    const handleLockedTimeChange = () => {
        const time = parseInt(newLockedTime, 10);
        if (!isNaN(time) && time >= 0) {
          lockForMinutes(time);
        }
    }

    // MASTER TOGGLE FUNCTION
    const toggleSection = (section) => {
        const isOpening = activeSection !== section;
        setActiveSection(isOpening ? section : null);

        // Assign heights to fit new UI (Baaki sab automatically 0 ho jayenge)
        appListHeight.value = isOpening && section === 'appList' ? 140 : 0;
        phoneLockHeight.value = isOpening && section === 'phoneLock' ? 180 : 0;
        wallpaperHeight.value = isOpening && section === 'wallpaper' ? 250 : 0;
        hiddenAppsHeight.value = isOpening && section === 'hiddenApps' ? 260 : 0;
        leetCodeHeight.value = isOpening && section === 'leetCode' ? 240 : 0;
    };

    // ANIMATED STYLES
    const appListStyle = useAnimatedStyle(() => ({
        height: withTiming(appListHeight.value, { duration: 300 }),
        opacity: withTiming(appListHeight.value > 0 ? 1 : 0, { duration: 250 })
    }));

    const phoneLockStyle = useAnimatedStyle(() => ({
        height: withTiming(phoneLockHeight.value, { duration: 300 }),
        opacity: withTiming(phoneLockHeight.value > 0 ? 1 : 0, { duration: 250 })
    }));

    const wallpaperStyle = useAnimatedStyle(() => ({
        height: withTiming(wallpaperHeight.value, { duration: 300 }),
        opacity: withTiming(wallpaperHeight.value > 0 ? 1 : 0, { duration: 250 })
    }));

    const hiddenAppsStyle = useAnimatedStyle(() => ({
        height: withTiming(hiddenAppsHeight.value, { duration: 300 }),
        opacity: withTiming(hiddenAppsHeight.value > 0 ? 1 : 0, { duration: 250 })
    }));

    const leetCodeStyle = useAnimatedStyle(() => ({
        height: withTiming(leetCodeHeight.value, { duration: 300 }),
        opacity: withTiming(leetCodeHeight.value > 0 ? 1 : 0, { duration: 250 })
    }));

    const switchStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: withTiming(switchTranslateX.value, { duration: 200 }) }],
    }));

    const switchStyle2 = useAnimatedStyle(() => ({
        transform: [{ translateX: withTiming(switchTranslateX2.value, { duration: 200 }) }],
    }));
    const switchTranslateX3 = useSharedValue(showLCStats ? 20 : 0);

const switchStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(switchTranslateX3.value, { duration: 200 }) }],
}));

    return {
        activeSection,
        toggleSection,
        handleLockedTimeChange,
        newLockedTime,
        setNewLockedTime,
        appListStyle,
        phoneLockStyle,
        wallpaperStyle,
        hiddenAppsStyle,
        leetCodeStyle,
        switchStyle,
        switchStyle2,
        switchTranslateX,
        switchTranslateX2,
        switchStyle3,
        switchTranslateX3
    }       
}

export default useSetting;