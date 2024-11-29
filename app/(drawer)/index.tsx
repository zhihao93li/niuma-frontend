import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StatsSummary } from "../../components/stats/StatsSummary";
import { TimeStats } from "../../components/stats/TimeStats";
import { SalaryStats } from "../../components/stats/SalaryStats";
import { DailyStats } from "../../components/stats/DailyStats";
import { OvertimeStats } from "../../components/stats/OvertimeStats";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.contentContainer}>
          {/* 页面标题 */}
          <ThemedView style={styles.header}>
            <ThemedText style={styles.header}>牛马表</ThemedText>
          </ThemedView>
          <StatsSummary />
          <TimeStats startTime="10:40" markerCount={13} />{" "}
          {/* 时间统计,显示开始时间和标记数 */}
          <SalaryStats /> {/* 工资统计 */}
          <DailyStats /> {/* 每日统计 */}
          <OvertimeStats /> {/* 加班统计 */}
        </ThemedView>
      </ScrollView>
      {/* 悬浮打卡按钮 */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/clock-in")}
      >
        <ThemedText style={styles.buttonText}>打卡</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1, // 占满整个屏幕
  },
  contentContainer: {
    flex: 1, // 容器占满可用空间
    padding: 16, // 内边距16像素
    backgroundColor: "#000000", // 黑色背景
  },
  header: {
    backgroundColor: "#000000", // 黑色背景
    textAlign: "center", // 文本居中对齐
    fontSize: 24, // 字体大小24像素
    fontWeight: "bold", // 粗体字重
    color: "#FFFFFF", // 白色文本
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#00999B",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android 阴影
    shadowColor: "#000", // iOS 阴影
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
