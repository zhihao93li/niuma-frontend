// 导入必要的组件
import { Drawer } from "expo-router/drawer"; // 从expo-router导入Drawer组件用于抽屉式导航
import { Ionicons } from "@expo/vector-icons"; // 导入Ionicons图标库
import CustomDrawerContent from "../../components/CustomDrawerContent";

// 抽屉式导航布局组件
export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      // 配置抽屉导航的全局样式选项
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000", // 设置头部导航栏背景色为黑色
        },
        headerTintColor: "#FFFFFF", // 设置头部导航栏文字和图标颜色为白色
        drawerStyle: {
          backgroundColor: "#353535", // 设置抽屉背景色为深灰色
        },
        drawerActiveTintColor: "#00999B", // 设置抽屉项目激活状态的颜色为青色
        drawerInactiveTintColor: "#E0E0E0", // 设置抽屉项目未激活状态的颜色为白色
      }}
    >
      {/* 首页路由配置 */}
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "今日打卡", // 抽屉菜单中显示的标签文本
          title: "今日打卡", // 页面标题
          headerTitle: "", // 头部标题
          headerStyle: {
            backgroundColor: "#000000", // 设置头部导航栏背景色为黑色
            elevation: 0, // 移除头部导航栏阴影
            shadowOpacity: 0, // 移除阴影
            borderBottomWidth: 0, // 移除底部边框
          },
          drawerIcon: ({ color }) => (
            <Ionicons name="today-outline" size={24} color={color} /> // 使用日历图标
          ),
        }}
      />

      {/* 会员中心路由配置 */}
      <Drawer.Screen
        name="member"
        options={{
          drawerLabel: "会员中心",
          title: "会员中心",
          drawerIcon: ({ color }) => (
            <Ionicons name="diamond-outline" size={24} color={color} /> // 使用钻石图标
          ),
        }}
      />
      {/* 工作信息路由 */}
      <Drawer.Screen
        name="workinfo"
        options={{
          drawerLabel: "工作信息",
          title: "工作信息",
          drawerIcon: ({ color }) => (
            <Ionicons name="briefcase-outline" size={24} color={color} />
          ),
        }}
      />
      {/* 自动打卡路由 */}
      <Drawer.Screen
        name="auto"
        options={{
          drawerLabel: "自动打卡",
          title: "自动打卡",
          drawerIcon: ({ color }) => (
            <Ionicons name="timer-outline" size={24} color={color} />
          ),
        }}
      />

      {/* 数据统计路由 */}
      <Drawer.Screen
        name="statistics"
        options={{
          drawerLabel: "数据统计",
          title: "数据统计",
          drawerIcon: ({ color }) => (
            <Ionicons name="stats-chart-outline" size={24} color={color} />
          ),
        }}
      />

      {/* 反馈建议路由 */}
      <Drawer.Screen
        name="feedback"
        options={{
          drawerLabel: "反馈建议",
          title: "反馈建议",
          drawerIcon: ({ color }) => (
            <Ionicons name="chatbox-outline" size={24} color={color} />
          ),
        }}
      />

      {/* 关于我们路由 */}
      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: "关于我们",
          title: "关于我们",
          drawerIcon: ({ color }) => (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Drawer>
  );
}
