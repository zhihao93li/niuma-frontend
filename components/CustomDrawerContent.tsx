// 导入必要的React Navigation Drawer组件
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
// 导入React Native基础组件
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
// 导入Expo图标组件
import { Ionicons } from "@expo/vector-icons";
// 导入路由钩子
import { useRouter } from "expo-router";

/**
 * 自定义抽屉导航内容组件
 * @param props - 抽屉内容组件属性，从React Navigation传入
 */
export default function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  // 获取路由实例用于页面导航
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props}>
      {/* 用户信息和设置区域 */}
      <View style={styles.header}>
        {/* 用户基本信息显示区域 */}
        <View style={styles.userInfo}>
          {/* 用户名称 */}
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>张三</Text>
            {/* 用户标签容器 */}
            <View style={styles.tagContainer}>
              {/* 会员等级标签 */}
              <Text style={styles.userTag}>PRO</Text>
            </View>
          </View>
          <Pressable
            style={styles.settingsButton}
            onPress={() => router.push("/settings")}
          >
            <Ionicons name="settings-outline" size={22} color="#E0E0E0" />
          </Pressable>
        </View>
        {/* 设置按钮 */}
        {/* <Pressable
            style={styles.settingsButton}
            onPress={() => router.push("/settings")}
          >
            <Ionicons name="settings-outline" size={22} color="#E0E0E0" />
          </Pressable> */}
      </View>

      {/* 抽屉菜单列表 - 使用默认的DrawerItemList渲染菜单项 */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// 组件样式定义
const styles = StyleSheet.create({
  // 头部容器样式
  header: {
    flexDirection: "row", // 水平排列
    justifyContent: "space-between", // 两端对齐
    alignItems: "center", // 垂直居中
    padding: 16,
    paddingTop: 24,
  },
  // 用户信息区域样式
  userInfo: {
    flex: 1, // 占据剩余空间
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 16,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // 用户名文本样式
  userName: {
    color: "#E0E0E0",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  // 标签容器样式
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  // 用户标签样式
  userTag: {
    color: "#FFFFFF", // 标签文字颜色
    fontSize: 10,
    backgroundColor: "#9D9D9D", // 半透明背景
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2, // 圆角效果
  },
  // 设置按钮样式
  settingsButton: {
    padding: 8,
  },
});
