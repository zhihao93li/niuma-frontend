import { StyleSheet, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { CircularProgress } from "./CircularProgress";
import { cardStyles } from "./styles";

export function SalaryStats() {
  return (
    <View>
      <ThemedView style={[cardStyles.card, styles.container]}>
        <ThemedText type="subtitle" style={cardStyles.subtitle}>
          今日收入
        </ThemedText>

        <ThemedView style={styles.progressContainer}>
          <CircularProgress progress={44.5} />
          <ThemedText style={styles.amount}>883.54元</ThemedText>
        </ThemedView>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#161616",
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#161616",
    width: "100%",
  },
  amount: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "bold",
    color: "#E0E0E0",
    alignSelf: "flex-end",
  },
});
