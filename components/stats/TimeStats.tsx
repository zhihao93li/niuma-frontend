import { StyleSheet, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { cardStyles } from "./styles";

interface TimeStatsProps {
  startTime?: string;
  markerCount?: number; // 刻度数量
  width?: number; // 时间轴总宽度
}

export function TimeStats({
  startTime = "09:00",
  markerCount = 16,
  width = 340, // 默认宽度
}: TimeStatsProps) {
  const getHourFromTimeString = (timeString: string): number => {
    try {
      const hour = parseInt(timeString.split(":")[0], 10);
      return isNaN(hour) ? 9 : hour;
    } catch {
      return 9;
    }
  };

  const startHour = getHourFromTimeString(startTime);

  const timeMarkers = Array.from({ length: markerCount }, (_, i) => {
    const hour = (startHour + i) % 24;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  return (
    <ThemedView style={[cardStyles.card, styles.container]}>
      <ThemedText type="subtitle" style={cardStyles.subtitle}>
        上工实况
      </ThemedText>
      <View style={[styles.timelineContainer, { width }]}>
        <View style={styles.timelineAxis} />

        <View style={styles.markersContainer}>
          {timeMarkers.map((time, i) => (
            <View
              key={i}
              style={[
                styles.markerColumn,
                { width: width / markerCount }, // 动态计算每个刻度的宽度
              ]}
            >
              <View style={styles.tickMark} />
              <ThemedText style={styles.hourMarker}>{time}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    overflow: "hidden", // 防止内容溢出
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timelineContainer: {
    marginTop: 20,
    marginBottom: 20,
    height: 120,
    position: "relative",
  },
  timelineAxis: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 22,
    height: 2,
    backgroundColor: "#00999B",
    zIndex: 1,
  },
  markersContainer: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 3,
  },
  markerColumn: {
    alignItems: "center",
  },
  tickMark: {
    width: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
  },
  hourMarker: {
    fontSize: 8,
    color: "#E0E0E0",
    marginTop: 4,
    textAlign: "center",
  },
});
