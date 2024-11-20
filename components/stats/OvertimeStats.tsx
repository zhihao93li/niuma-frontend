import { StyleSheet } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { cardStyles } from "./styles";
import { Clock } from "./Clock";

export function OvertimeStats() {
  return (
    <ThemedView style={[cardStyles.card, styles.container]}>
      <ThemedText type="subtitle" style={cardStyles.subtitle}>
        加班实况
      </ThemedText>
      <Clock />
      <ThemedView style={styles.inlineContainer}>
        <ThemedText style={styles.equal}>≈</ThemedText>
        <ThemedText style={styles.description}>和心爱的人看一场电影</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  timeDisplay: {
    alignItems: "center",
    marginTop: 16,
  },
  time: {
    fontSize: 24,
    fontWeight: "bold",
  },
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#161616",
  },
  equal: {
    fontSize: 24,
    color: "#ffffff",
    marginRight: 20,
  },
  description: {
    fontSize: 20,
    textAlign: "center",
    color: "#000000",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 8,
    width: "80%",
  },
});
