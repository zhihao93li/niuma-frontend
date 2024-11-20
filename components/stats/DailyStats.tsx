import { StyleSheet, Pressable, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { cardStyles } from "./styles";
import { useEffect, useState } from "react";

export function DailyStats() {
  const [selectedOption, setSelectedOption] = useState("daily");

  // 渲染日薪数据
  const renderDailyStats = () => (
    <ThemedView style={styles.statsContainer}>
      <ThemedView style={styles.statItem}>
        <ThemedText style={styles.statValue}>940</ThemedText>
        <ThemedText style={styles.statLabel}>额定日薪</ThemedText>
      </ThemedView>
      <ThemedView style={styles.statItem}>
        <ThemedText style={styles.statValue}>1234</ThemedText>
        <ThemedText style={styles.statLabel}>日薪应得</ThemedText>
      </ThemedView>
      <ThemedView style={styles.statItem}>
        <ThemedText style={styles.statNum}>-294</ThemedText>
      </ThemedView>
    </ThemedView>
  );

  // 渲染时薪数据
  const renderHourlyStats = () => (
    <ThemedView style={styles.statsContainer}>
      <ThemedView style={styles.statItem}>
        <ThemedText style={styles.statValue}>90</ThemedText>
        <ThemedText style={styles.statLabel}>额定时薪</ThemedText>
      </ThemedView>
      <ThemedView style={styles.statItem}>
        <ThemedText style={styles.statValue}>56</ThemedText>
        <ThemedText style={styles.statLabel}>实际时薪</ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={cardStyles.card}>
      <ThemedText type="subtitle" style={cardStyles.subtitle}>
        收入实况
      </ThemedText>

      {/* 单选按钮组 */}
      <View style={styles.radioGroup}>
        <Pressable
          style={[
            styles.radioButton,
            selectedOption === "daily" && styles.radioButtonSelected,
          ]}
          onPress={() => setSelectedOption("daily")}
        >
          <ThemedText
            style={[
              styles.radioText,
              selectedOption === "daily" && styles.radioTextSelected,
            ]}
          >
            日薪
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.radioButton,
            selectedOption === "hourly" && styles.radioButtonSelected,
          ]}
          onPress={() => setSelectedOption("hourly")}
        >
          <ThemedText
            style={[
              styles.radioText,
              selectedOption === "hourly" && styles.radioTextSelected,
            ]}
          >
            时薪
          </ThemedText>
        </Pressable>
      </View>

      {/* 根据选择渲染不同的统计数据 */}
      {selectedOption === "daily" ? renderDailyStats() : renderHourlyStats()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#161616",
    borderRadius: 8,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#2C2C2C",
    borderRadius: 8,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#2C2C2C",
  },
  statValue: {
    fontSize: 18,
    color: "#E0E0E0",
  },
  statLabel: {
    fontSize: 12,
    color: "#9B9B9B",
  },
  statNum: {
    fontSize: 24,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 10,
    alignSelf: "flex-end",
  },
  radioButton: {
    width: 56,
    height: 24,
    borderRadius: 4, // 圆角
    backgroundColor: "#2C2C2C", // 未选中的背景色
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    backgroundColor: "#E0E0E0", // 选中时的背景色
  },
  radioText: {
    fontSize: 14,
    color: "#9B9B9B", // 未选中的文字颜色
  },
  radioTextSelected: {
    color: "#161616", // 选中时的文字颜色
    fontWeight: "500",
  },
});
