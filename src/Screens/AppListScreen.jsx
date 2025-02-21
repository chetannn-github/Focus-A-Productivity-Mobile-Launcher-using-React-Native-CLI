import { View } from "react-native";
import AppsList from "../Components/AppsList";

export default function AppListScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "black", paddingTop: 20, paddingHorizontal: 10 }}>
      <AppsList />
    </View>
  );
}