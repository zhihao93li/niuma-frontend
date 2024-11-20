import { StyleSheet } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { cardStyles } from "./styles";

export function StatsSummary() {
  return (
    <ThemedView style={[cardStyles.card, styles.container]}>
      <ThemedText type="subtitle" style={cardStyles.subtitle}>
        小目标
      </ThemedText>
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statNum}>9h</ThemedText>
          <ThemedText style={styles.statText}>额定工时</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statText}>|</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statNum}>¥940</ThemedText>
          <ThemedText style={styles.statText}>额定日薪</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statText}>|</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statNum}>¥104</ThemedText>
          <ThemedText style={styles.statText}>额定时薪</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statNum}>9:39</ThemedText>
          <ThemedText style={styles.statText}>上班打卡</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statText}>|</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statNum}>-</ThemedText>
          <ThemedText style={styles.statText}>下班打卡</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 40,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#2C2C2C",
    justifyContent: "space-evenly",
    padding: 16,
    width: "100%",
    borderRadius: 8,
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    backgroundColor: "#2C2C2C",
  },
  statText: {
    color: "#E0E0E0",
    fontSize: 12,
  },
  statNum: {
    color: "#ffffff",
    fontSize: 16,
  },
});
