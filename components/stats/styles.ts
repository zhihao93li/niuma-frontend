import { StyleSheet, Platform } from "react-native";

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#161616",
    marginVertical: 15,
    borderRadius: 10,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 16,
  },
});
