import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ThemedText } from "../ThemedText";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 12,
  color = "#FF6B6B",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = (progress * circumference) / 100;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#161616"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progressValue} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <ThemedText style={styles.progressText}>{progress}%</ThemedText>
        <ThemedText style={styles.themedText}>工资到手</ThemedText>
      </View>
      {/* <View style={styles.textContainer}>
        <ThemedText style={styles.progressText}>{progress}%</ThemedText>
        <ThemedText style={styles.themedText}>工资到手</ThemedText>
      </View> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",

    backgroundColor: "#161616",
    width: "100%",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
  },
  progressText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E0E0E0",
  },
  themedText: {
    color: "#9B9B9B",
    fontSize: 14,
  },
});
