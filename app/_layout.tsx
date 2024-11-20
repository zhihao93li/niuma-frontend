// 导入必要的组件和主题
import { Slot } from "expo-router"; // 从expo-router导入Slot组件用于路由
import { PaperProvider, MD3DarkTheme } from "react-native-paper"; // 导入Paper UI组件库的Provider和暗色主题

// 自定义主题配置
const theme = {
  ...MD3DarkTheme, // 继承MD3暗色主题的所有属性
  colors: {
    ...MD3DarkTheme.colors, // 继承原有的颜色配置
    primary: "#00999B", // 自定义主色调为青色
    background: "#000000", // 自定义背景色为黑色
  },
};

// 根布局组件
export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      {" "}
      {/* 使用PaperProvider包裹整个应用,并传入自定义主题 */}
      <Slot /> {/* Slot组件用于渲染子路由页面 */}
    </PaperProvider>
  );
}
