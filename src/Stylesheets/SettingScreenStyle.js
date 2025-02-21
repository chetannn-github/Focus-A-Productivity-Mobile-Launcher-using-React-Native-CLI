import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  SettingScreen: { flex: 1, alignItems: "center", backgroundColor: "black", paddingHorizontal: 20, paddingTop: 50 },
  header: { color: "white", fontSize: 22, marginBottom: 20 },
  collapsibleContainer: { width: "100%", marginBottom: 7 },
  collapsibleHeaderContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  collapsibleHeader: { color: "white", fontSize: 18, padding: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255, 255, 255, 0.1)" },
  collapsedContent: {  overflow: "hidden", backgroundColor: "black", borderRadius: 5, marginTop:2 ,paddingHorizontal:10,},
  switchContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  switchLabel: { color: "white", marginRight: 10 },
  input: { backgroundColor: "white", color: "black", padding: 10, borderRadius: 5, marginTop: 10 },
  switchBase: {
    width: 40,
    height: 20,
    borderRadius: 20,
    
    padding: 2,
    justifyContent: "center",
  },
  switchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "white",
  },
  linksContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "black",
    padding: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  link: {
    width: "48%",
    backgroundColor: "black",
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
    color: "white",
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wallpaperGrid: {
    flexDirection: "row",
    flexWrap: "wrap", // Auto line break after 2 images
    justifyContent: "space-between",
    padding: 5,
  },
  wallpaperItem: {
    width: "48%", // 2 images in one row
    marginBottom: 10,
    alignItems: "center",
  },
  wallpaperImage: {
    width: "100%",
    height: 200, // Increased height
    borderRadius: 10,
  },
  tickOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 2,
  },
});