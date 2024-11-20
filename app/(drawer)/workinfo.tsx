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
  Dimensions,
} from "react-native";
import { Text, Switch, TouchableRipple } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
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
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  // 确认时间选择
  const handleConfirm = (isStartTime: boolean) => {
    if (isStartTime) {
      setStartTime(tempStartTime);
      setShowStartPicker(false);
    } else {
      setEndTime(tempEndTime);
      setShowEndPicker(false);
    }
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

  /**
   * 处理工作日选择的切换
   * @param day - 要切换的工作日id
   */
  const toggleDay = (day: string) => {
    const newSelected = new Set(selectedDays);
    if (newSelected.has(day)) {
      // 如果已选中则移除
      newSelected.delete(day);
    } else {
      // 如果未选中则添加
      newSelected.add(day);
    }
    setSelectedDays(newSelected);
  };
  // 渲染 iOS 时间选择器
  const renderIOSPicker = (isStartTime: boolean) => {
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
  // 添加自动打卡状态
  const [isAutoCheckEnabled, setIsAutoCheckEnabled] = useState(false);

  // 添加定位相关状态
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [address, setAddress] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 处理定位权限和获取位置
  useEffect(() => {
    if (isAutoCheckEnabled) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("需要定位权限才能自动打卡");
          setIsAutoCheckEnabled(false);
          return;
        }

        try {
          const location = await Location.getCurrentPositionAsync({});
          setLocation(location);

          // 获取地址信息
          const [address] = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          if (address) {
            setAddress(
              `${address.city}${address.district}${address.street}${address.streetNumber}`
            );
          }
        } catch (error) {
          setErrorMsg("获取位置信息失败");
          setIsAutoCheckEnabled(false);
        }
      })();
    }
  }, [isAutoCheckEnabled]);

  // 处理自动打卡开关
  const handleAutoCheckToggle = (value: boolean) => {
    setIsAutoCheckEnabled(value);
    if (!value) {
      setLocation(null);
      setAddress("");
      setErrorMsg(null);
    }
  };

  return (
    <View style={styles.container}>
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
                <MaterialCommunityIcons name="cow" size={16} color="#FFFFFF" />
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
      {/* 自动打卡选项 */}
      <Text style={styles.sectionTitle}>是否开启定位打卡</Text>
      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>自动打卡</Text>
          {isAutoCheckEnabled && address && (
            <Text style={styles.locationText}>当前位置：{address}</Text>
          )}
          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        </View>
        <Switch
          value={isAutoCheckEnabled}
          onValueChange={handleAutoCheckToggle}
          color="#00999B"
        />
      </View>
      {/* 地图显示 */}
      {isAutoCheckEnabled && location && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="打卡位置"
              description={address}
            />
          </MapView>
        </View>
      )}
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
    </View>
  );
}

// 定义组件样式
const styles = StyleSheet.create({
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
});
