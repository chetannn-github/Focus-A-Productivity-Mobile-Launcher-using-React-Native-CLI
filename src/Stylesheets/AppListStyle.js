import { StyleSheet } from "react-native";

export const AppListstyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 20,
    paddingHorizontal: 25,
    marginTop: 10,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 9,
  },
  appIcon: {
    width: 25,
    height: 27,
    marginRight: 10,
  },
  appName: {
    color: 'white',
    fontSize: 15,
  },
  noApps: {
    color: 'white',
    opacity: 0.7,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});