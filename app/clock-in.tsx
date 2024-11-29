import { StyleSheet, TouchableOpacity, Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { useState, useEffect } from "react";

export default function ClockInScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState<"in" | "out" | null>(
    null
  );
  const [clockInTime, setClockInTime] = useState("10:09");
  const [clockOutTime, setClockOutTime] = useState("-");

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 格式化日期: MM/DD/YYYY
  const formatDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // 格式化时间为 HH:MM
  const formatTimeHHMM = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // 处理打卡按钮点击
  const handleClockIn = () => {
    // TODO: 处理上班打卡逻辑
    console.log("上班打卡时间:", formatTimeHHMM(currentTime));
  };

  const handleClockOut = () => {
    // TODO: 处理下班打卡逻辑
    console.log("下班打卡时间:", formatTimeHHMM(currentTime));
  };

  // 处理时间修改
  const handleTimeEdit = (recordType: "in" | "out") => {
    setSelectedRecord(recordType);
    setSelectedTime(currentTime);
    setShowTimePicker(true);
  };

  // 处理确认按钮点击
  const handleConfirm = () => {
    const formattedTime = formatTimeHHMM(selectedTime);

    if (selectedRecord === "in") {
      setClockInTime(formattedTime);
    } else if (selectedRecord === "out") {
      setClockOutTime(formattedTime);
    }

    console.log(
      `确认修改${selectedRecord === "in" ? "上班" : "下班"}时间:`,
      formattedTime
    );

    setShowTimePicker(false);
  };

  // 处理取消按钮点击
  const handleCancel = () => {
    setShowTimePicker(false);
  };
  return (
    <View style={styles.mainContainer}>
      <ThemedView style={styles.container}>
        {/* 返回按钮 */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ThemedText style={styles.backButtonText}>X</ThemedText>
        </TouchableOpacity>

        {/* 标题 */}
        <ThemedText style={styles.title}>今日打卡</ThemedText>

        {/* 日期显示 */}
        <ThemedText style={styles.date}>{formatDate(currentTime)}</ThemedText>

        {/* 时间显示 */}
        <ThemedView style={styles.timeContainer}>
          <ThemedText style={styles.time}>
            {formatTimeHHMM(currentTime)}
          </ThemedText>
        </ThemedView>

        {/* 打卡按钮 */}
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clockButton} onPress={handleClockIn}>
            <ThemedText style={styles.buttonText}>上班打卡</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clockButton} onPress={handleClockOut}>
            <ThemedText style={styles.buttonText}>下班打卡</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* 打卡记录展示 */}
        <ThemedView style={styles.recordContainer}>
          <ThemedView style={styles.recordRow}>
            <ThemedView style={styles.recordItem}>
              <ThemedText style={styles.recordLabel}>已打卡</ThemedText>
            </ThemedView>
            <ThemedText style={styles.recordTime}>{clockInTime}</ThemedText>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleTimeEdit("in")}
            >
              <ThemedText style={styles.editButtonText}>修改</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.recordRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleTimeEdit("out")}
            >
              <ThemedText style={styles.editButtonText}>修改</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.recordTime}>{clockOutTime}</ThemedText>
            <ThemedView style={styles.recordItem}>
              <ThemedText style={styles.recordLabel}>
                {clockOutTime === "-" ? "未打卡" : "已打卡"}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* 时间选择器 - 完全独立的层 */}
      {showTimePicker && (
        <View style={styles.timePickerOverlay}>
          {/* 添加遮罩层点击处理 */}
          <TouchableOpacity
            style={styles.timePickerMask}
            onPress={handleCancel}
          />
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <TouchableOpacity onPress={handleCancel}>
                <ThemedText style={styles.timePickerButton}>取消</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.timePickerTitle}>
                选择{selectedRecord === "in" ? "上班" : "下班"}时间
              </ThemedText>
              <TouchableOpacity onPress={handleConfirm}>
                <ThemedText
                  style={[styles.timePickerButton, styles.confirmButton]}
                >
                  确认
                </ThemedText>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={(event, date) => {
                if (date) setSelectedTime(date);
              }}
              textColor="white"
              style={styles.timePicker}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 16,
  },
  backButton: {
    position: "absolute",
    top: 60, // 调整顶部距离，确保在安全区域内
    left: 20,
    zIndex: 1,
    width: 32, // 明确设置宽度
    height: 32, // 明确设置高度
    backgroundColor: "#1C1C1E", // 可选：添加背景色
    borderRadius: 16, // 可选：圆形按钮
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 45,
  },
  date: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "right",
    marginTop: 8,
  },
  timeContainer: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  time: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    includeFontPadding: false, // 移除字体内边距
    lineHeight: 56, // 调整行高以确保数字完整显示
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 16,
    backgroundColor: "#1C1C1E",
  },
  clockButton: {
    flex: 1,
    backgroundColor: "#008080",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  recordContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    gap: 16, // 添加垂直间距
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recordRow: {
    backgroundColor: "#1C1C1E",
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // 水平间距
  },
  recordItem: {
    backgroundColor: "#BBAEAE",
    borderRadius: 20,

    paddingHorizontal: 4,
    alignSelf: "flex-start", // 让背景色跟随内容宽度
  },
  recordLabel: {
    color: "#FFFFFF",
    fontSize: 8,
  },
  recordTime: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  recordTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    zIndex: 1,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 8,
  },
  timePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  timePickerMask: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  timePickerContainer: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  timePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  timePickerTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  timePickerButton: {
    fontSize: 16,
    color: "#FFFFFF",
    paddingHorizontal: 8,
  },
  confirmButton: {
    color: "#008080", // iOS 风格的蓝色
    fontWeight: "600",
  },
  timePicker: {
    height: 200,
    alignSelf: "stretch",
  },
});
