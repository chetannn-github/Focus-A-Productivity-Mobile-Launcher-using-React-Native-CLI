import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  SettingScreen: { 
    flex: 1, 
    backgroundColor: "#000000",
    paddingHorizontal: 16, 
    paddingTop: Platform.OS === 'ios' ? 50 : 40 
  },
  header: { 
    color: "#FFFFFF", 
    fontSize: 28, 
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  
  // --- CARD LAYOUT FOR SECTIONS ---
  collapsibleContainer: { 
    width: "100%", 
    backgroundColor: "#121212", 
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
  },
  collapsibleHeaderContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  collapsibleHeader: { 
    color: "#FFFFFF", 
    fontSize: 17, 
    fontWeight: "600",
    marginLeft: 12, // Space between icon and text
  },
  collapsedContent: {  
    overflow: "hidden", 
    backgroundColor: "#121212", 
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  
  // --- SWITCHES ---
  switchContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  switchLabel: { 
    color: "#E5E5EA", 
    fontSize: 16,
    fontWeight: "500",
  },
  switchBase: {
    width: 44,
    height: 24,
    borderRadius: 20,
    padding: 2,
    justifyContent: "center",
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // --- INPUTS & CUSTOM BUTTONS ---
  input: { 
    backgroundColor: "#1C1C1E", // Dark grey input
    color: "#FFFFFF", 
    paddingHorizontal: 15, 
    paddingVertical: 14,
    borderRadius: 10, 
    fontSize: 16,
    marginTop: 10, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  primaryBtn: {
    backgroundColor: "#0A84FF", // iOS Blue
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryBtnDisabled: {
    backgroundColor: "#48484A",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryBtnText: {
    color: "#8E8E93",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
  },
  dangerText: {
    color: "#FF453A",
  },

  // --- WALLPAPERS ---
  wallpaperGrid: {
    flexDirection: "row",
    flexWrap: "wrap", 
    justifyContent: "space-between",
  },
  wallpaperItem: {
    width: "48%", 
    marginBottom: 12,
    alignItems: "center",
  },
  wallpaperImage: {
    width: "100%",
    height: 200, 
    borderRadius: 12,
  },
  tickOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
  },

  // --- HIDDEN APPS ---
  hiddenAppsScrollContainer: {
    maxHeight: 250,
    width: "100%",
  },
  hiddenAppItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  hiddenAppInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  hiddenAppIcon: {
    width: 32,
    height: 32,
    marginRight: 14,
    borderRadius: 8,
  },
  hiddenAppName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  unhideBtn: {
    padding: 8,
    backgroundColor: "rgba(255, 69, 58, 0.1)", // Slight red tint
    borderRadius: 20,
    marginLeft: 10,
  },
  noHiddenText: {
    color: "#8E8E93", 
    textAlign: "center",
    paddingVertical: 15,
    fontSize: 15,
    fontStyle: "italic",
  },

  // --- LINKS ---
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  link: {
    width: "48%",
    backgroundColor: "#121212",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "#E5E5EA",
    fontSize: 15,
    fontWeight: "500",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
});