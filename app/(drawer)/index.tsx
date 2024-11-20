import { StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StatsSummary } from "../../components/stats/StatsSummary";
import { TimeStats } from "../../components/stats/TimeStats";
import { SalaryStats } from "../../components/stats/SalaryStats";
import { DailyStats } from "../../components/stats/DailyStats";
import { OvertimeStats } from "../../components/stats/OvertimeStats";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.scrollView}
      bounces={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1, // 占满整个屏幕
  },
  container: {
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
});
