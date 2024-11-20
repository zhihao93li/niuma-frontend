import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function StatisticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>数据统计</Text>
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
