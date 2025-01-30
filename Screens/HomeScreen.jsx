import React from "react";
import { View, Linking } from "react-native";
import Progress from "../Components/Progress";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

export function HomeScreen() {
    const navigation = useNavigation();
    const openPhoneApp = () => {
        Linking.openURL('tel:');
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'black', padding: 25 }}>
            <Progress />
            <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                <Icon name="ellipsis-h" size={30} color="white" onPress={() => navigation.openDrawer()} />
                <Icon name="phone" size={30} color="white" onPress={openPhoneApp} />
            </View>
        </View>
    );
}
