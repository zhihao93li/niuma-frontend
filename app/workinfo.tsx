// 导入必要的React和React Native组件
import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";
import { ThemedText } from "@/components/ThemedText";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 定义工作日数据
// 包含每个工作日的id和显示标签
const WEEKDAYS = [
  { id: "MON", label: "MON" }, // 周一
  { id: "TUE", label: "TUE" }, // 周二
  { id: "WED", label: "WED" }, // 周三
  { id: "THU", label: "THU" }, // 周四
  { id: "FRI", label: "FRI" }, // 周五
  { id: "SAT", label: "SAT" }, // 周六
  { id: "SUN", label: "SUN" }, // 周日
];

/**
 * 工作信息屏幕组件
 * 用于显示和管理用户的工作日设置
 */
export default function WorkinfoScreen() {
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // 获取初始数据
  useEffect(() => {
    fetchWorkSettings();
  }, []);

  const fetchWorkSettings = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        "https://apifoxmock.com/m1/5436882-5111963-default/api/users/settings",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success && data.user) {
        // 设置初始值
        setSalary(data.user.ratedDailySalary.toString());

        // 设置上班时间
        const startTimeDate = new Date();
        const [startHours, startMinutes] =
          data.user.ratedWorkStartTime.split(":");
        startTimeDate.setHours(parseInt(startHours), parseInt(startMinutes), 0);
        setStartTime(startTimeDate);
        setTempStartTime(startTimeDate);

        // 设置下班时间
        const endTimeDate = new Date();
        const [endHours, endMinutes] = data.user.ratedWorkEndTime.split(":");
        endTimeDate.setHours(parseInt(endHours), parseInt(endMinutes), 0);
        setEndTime(endTimeDate);
        setTempEndTime(endTimeDate);
      }
    } catch (error) {
      Alert.alert("错误", "获取工作信息失败");
    }
  };

  // 保存设置
  const handleSave = async () => {
    if (!isModified) return;

    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        console.log("No token found");
        router.push("/login");
        return;
      }

      // 验证薪资值
      if (!salary || isNaN(parseFloat(salary))) {
        Alert.alert("错误", "请输入有效的薪资金额");
        return;
      }

      // 将 Set 转换为数组
      const workDaysArray = Array.from(selectedDays);

      // 构建请求数据
      const requestData = {
        ratedDailySalary: parseFloat(salary),
        ratedWorkStartTime: formatTime(startTime),
        ratedWorkEndTime: formatTime(endTime),
        workDays: workDaysArray,
      };
      console.log("Saving settings:", requestData);

      // 使用实际的 API 地址
      const response = await fetch(
        "https://apifoxmock.com/m1/5436882-5111963-default/api/users/settings",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        setIsModified(false);
        Alert.alert("成功", "工作信息已设置");
      } else {
        throw new Error(data.message || "保存失败");
      }
    } catch (error) {
      console.error("Save settings error:", error);

      // 更详细的错误提示
      if (
        error instanceof TypeError &&
        error.message === "Network request failed"
      ) {
        Alert.alert("网络错误", "请检查网络连接后重试");
      } else {
        Alert.alert(
          "错误",
          error instanceof Error ? error.message : "保存失败，请重试"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 修改现有的状态更新函数，添加修改标记
  const handleSalaryChange = (text: string) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(text) || text === "") {
      const numValue = parseFloat(text);
      if (text === "" || (numValue > 0 && !isNaN(numValue))) {
        setSalary(text);
        setIsModified(true);
      }
    }
  };

  const handleConfirm = (isStartTime: boolean) => {
    if (isStartTime) {
      setStartTime(tempStartTime);
      setShowStartPicker(false);
    } else {
      setEndTime(tempEndTime);
      setShowEndPicker(false);
    }
    setIsModified(true);
  };
  const handleBack = () => {
    if (isModified) {
      // 如果有未保存的修改，显示确认对话框
      Alert.alert("提示", "有未保存的修改，确定要离开吗？", [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "确定",
          onPress: () => router.back(),
        },
      ]);
    } else {
      // 如果没有修改，直接返回
      router.back();
    }
  };

  const toggleDay = (day: string) => {
    const newSelected = new Set(selectedDays);
    if (newSelected.has(day)) {
      newSelected.delete(day);
    } else {
      newSelected.add(day);
    }
    setSelectedDays(newSelected);
    setIsModified(true);
  };

  const [errorMsg, setErrorMsg] = useState("");
  // 使用useState管理选中的工作日状态
  // 默认选中周一到周五
  const [selectedDays, setSelectedDays] = useState(
    new Set(["MON", "TUE", "WED", "THU", "FRI"])
  );
  // 时间选择器状态
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [startTime, setStartTime] = useState(() => {
    // 从本地存储或API获取上次选择的时间，这里先用默认值
    const defaultTime = new Date();
    defaultTime.setHours(9, 0, 0); // 设置默认时间 09:00
    return defaultTime;
  });

  // 处理上班时间选择
  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempStartTime(selectedDate);
    }
    if (Platform.OS === "android") {
      setShowStartPicker(false);
      setStartTime(selectedDate || startTime);
    }
  };

  // 添加下班时间相关状态
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [endTime, setEndTime] = useState(() => {
    const defaultTime = new Date();
    defaultTime.setHours(18, 0, 0); // 设置默认下班时间 18:00
    return defaultTime;
  });

  // 处理下班时间选择
  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempEndTime(selectedDate);
    }
    if (Platform.OS === "android") {
      setShowEndPicker(false);
      setEndTime(selectedDate || endTime);
    }
  };
  // 临时存储选择的时间
  const [tempStartTime, setTempStartTime] = useState(startTime);
  const [tempEndTime, setTempEndTime] = useState(endTime);

  // 格式化时间显示
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // 取消时间选择
  const handleCancel = (isStartTime: boolean) => {
    if (isStartTime) {
      setTempStartTime(startTime);
      setShowStartPicker(false);
    } else {
      setTempEndTime(endTime);
      setShowEndPicker(false);
    }
  };

  // 渲染 iOS 时间选择器
  const renderIOSPicker = (isStartTime: boolean) => {
    // 根据是否是上班时间选择器来决定使用哪个时间和改变函数
    const currentTime = isStartTime ? tempStartTime : tempEndTime;
    const onTimeChange = isStartTime ? onStartTimeChange : onEndTimeChange;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isStartTime ? showStartPicker : showEndPicker}
        onRequestClose={() => handleCancel(isStartTime)}
      >
        <TouchableWithoutFeedback onPress={() => handleCancel(isStartTime)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Pressable
                    onPress={() => handleCancel(isStartTime)}
                    style={styles.modalButton}
                  >
                    <Text style={styles.modalButtonText}>取消</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleConfirm(isStartTime)}
                    style={styles.modalButton}
                  >
                    <Text style={styles.modalButtonText}>确定</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={currentTime}
                  mode="time"
                  display="spinner"
                  onChange={onTimeChange}
                  style={styles.iosTimePicker}
                  textColor="black"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  // 添加月薪相关状态
  const [salary, setSalary] = useState("");
  const [isSalaryFocused, setIsSalaryFocused] = useState(false);

  // 在失去焦点时验证值
  const handleSalaryBlur = () => {
    const numValue = parseFloat(salary);
    // 如果不是正数（包括0、负数或非数字），清空输入
    if (isNaN(numValue) || numValue <= 0) {
      setSalary("");
    } else {
      // 格式化为固定的两位小数
      setSalary(numValue.toFixed(2));
    }
    setIsSalaryFocused(false);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsSalaryFocused(false);
      }}
    >
      <View style={styles.container}>
        <ThemedText style={styles.title}>工作信息</ThemedText>
        {/* 添加返回按钮 */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>X</Text>
        </TouchableOpacity>

        {/* 添加保存按钮 */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading || !isModified}
        >
          <ThemedText
            style={[
              styles.saveButtonText,
              (!isModified || isLoading) && styles.saveButtonTextDisabled,
            ]}
          >
            保存
          </ThemedText>
        </TouchableOpacity>
        {/* 工作日选择容器 */}
        <Text style={styles.sectionTitle}>选择每周上班天数</Text>
        <View style={styles.weekContainer}>
          {/* 遍历渲染每个工作日按钮 */}
          {WEEKDAYS.map((day) => (
            <Pressable
              key={day.id}
              style={[
                styles.dayButton,
                selectedDays.has(day.id) && styles.selectedDay, // 选中状态样式
              ]}
              onPress={() => toggleDay(day.id)}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDays.has(day.id) && styles.selectedDayText, // 选中状态文本样式
                ]}
              >
                {day.label}
              </Text>
              <View style={styles.iconContainer}>
                {selectedDays.has(day.id) ? (
                  <MaterialCommunityIcons
                    name="cow"
                    size={16}
                    color="#FFFFFF"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="face-man-shimmer-outline"
                    size={16}
                    color="#7F7F7F"
                  />
                )}
              </View>
            </Pressable>
          ))}
        </View>
        {/* 上班时间选择 */}
        <Text style={styles.sectionTitle}>选择上下班时间</Text>
        <TouchableRipple onPress={() => setShowStartPicker(true)}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>上班时间</Text>
            <View style={styles.timeValue}>
              <Text style={styles.timeText}>{formatTime(startTime)}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </View>
        </TouchableRipple>
        {/* 下班时间选择 */}
        <TouchableRipple onPress={() => setShowEndPicker(true)}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>下班时间</Text>
            <View style={styles.timeValue}>
              <Text style={styles.timeText}>{formatTime(endTime)}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </View>
        </TouchableRipple>
        {/* 时间选择器 */}
        {Platform.OS === "ios" ? (
          <>
            {showStartPicker && renderIOSPicker(true)}
            {showEndPicker && renderIOSPicker(false)}
          </>
        ) : (
          <>
            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onStartTimeChange}
              />
            )}
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onEndTimeChange}
              />
            )}
          </>
        )}
        {/* 输入月薪 */}
        <Text style={styles.sectionTitle}>输入月薪</Text>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>月薪</Text>
          <TextInput
            style={[
              styles.salaryInput,
              isSalaryFocused && styles.salaryInputFocused,
            ]}
            value={salary}
            onChangeText={handleSalaryChange}
            onBlur={handleSalaryBlur}
            onFocus={() => setIsSalaryFocused(true)}
            keyboardType="decimal-pad"
            placeholder="请输入月薪"
            placeholderTextColor="#666"
            caretHidden={!isSalaryFocused}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// 定义组件样式
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 45,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#666666", // 灰色文字
    fontSize: 14, // 稍小的字号
    marginBottom: 8, // 与下方内容的间距
    marginTop: 16, // 与上方内容的间距
    fontWeight: "500", // 稍微加粗
  },
  // 主容器样式
  container: {
    flex: 1,
    backgroundColor: "#000000", // 黑色背景
    padding: 16,
  },
  // 工作日选择容器样式
  weekContainer: {
    flexDirection: "row", // 水平排列
    justifyContent: "space-between", // 均匀分布
    backgroundColor: "#2C2C2C", // 深灰色背景
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  // 日期按钮样式
  dayButton: {
    width: 35,
    height: 40,
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: "#161616", // 深色边框
    borderWidth: 1,
    paddingTop: 4,
  },
  // 选中状态的日期按钮样式
  selectedDay: {
    backgroundColor: "#161616", // 更深的背景色
    borderColor: "#00999B",
    shadowColor: "#00999B", // 添加阴影效果
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android 阴影效果
  },
  // 日期文本样式
  dayText: {
    color: "#7F7F7F", // 灰色文本
    fontSize: 10,
    fontWeight: "bold",
  },
  // 选中状态的日期文本样式
  selectedDayText: {
    color: "#FFFFFF", // 保持相同的灰色
    fontSize: 10,
    fontWeight: "bold",
  },
  iconContainer: {
    marginTop: 4, // 微调图标位置
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  timeLabel: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  timeValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalButton: {
    padding: 8,
  },
  modalButtonText: {
    color: "#00999B",
    fontSize: 16,
  },
  iosTimePicker: {
    height: 200,
    backgroundColor: "white",
  },
  switchLabel: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationText: {
    color: "#999999",
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // 改为顶部对齐
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  salaryInput: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
    textAlign: "right",
    padding: 0,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
    width: 32,
    height: 32,

    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E0E0",
  },
  saveButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,

    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#00999B", // 使用主题色
    fontWeight: "500",
  },
});
