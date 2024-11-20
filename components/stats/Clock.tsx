import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 格式化数字为两位数
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  return (
    <View style={styles.container}>
      <View style={styles.clockContainer}>
        <View style={styles.timeBlock}>
          <ThemedText style={styles.timeText}>
            {formatNumber(time.getHours())}
          </ThemedText>
        </View>

        <ThemedText style={styles.colon}>:</ThemedText>

        <View style={styles.timeBlock}>
          <ThemedText style={styles.timeText}>
            {formatNumber(time.getMinutes())}
          </ThemedText>
        </View>

        <ThemedText style={styles.colon}>:</ThemedText>

        <View style={styles.timeBlock}>
          <ThemedText style={styles.timeText}>
            {formatNumber(time.getSeconds())}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#161616",
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
    color: "#E0E0E0",
  },
  clockContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  timeBlock: {
    backgroundColor: "#2C2C2C",
    borderRadius: 8,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 48,
    color: "#FF6B6B",
    fontWeight: "bold",
    paddingTop: 35,
  },
  colon: {
    fontSize: 48,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
});
