import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function AutoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>自动打卡</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 16,
  },
  text: {
    color: "#FFFFFF",
  },
});
