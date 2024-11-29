import { useRouter } from "expo-router";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/")}
        style={styles.backButton}
      >
        <ThemedText style={styles.backButtonText}>X</ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.title}>设置</ThemedText>

      {/* 新增工作信息入口 */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/workinfo")}
      >
        <ThemedText style={styles.menuItemText}>工作信息</ThemedText>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 45,
  },
  backButton: {
    position: "absolute",
    top: 60, // 调整顶部距离，确保在安全区域内
    left: 20,
    zIndex: 1,
    width: 32, // 明确设置宽度
    height: 32, // 明确设置高度
    borderRadius: 16, // 可选：圆形按钮
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E0E0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
