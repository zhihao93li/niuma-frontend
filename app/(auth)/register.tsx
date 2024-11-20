// 导入必要的依赖
import React, { useRef, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  TextInput, // 文本输入框组件
  Button, // 按钮组件
  Text, // 文本组件
  Surface, // 表面容器组件
  Divider, // 分割线组件
  Snackbar, // 提示消息条组件
} from "react-native-paper"; // Material Design 风格的 UI 组件库
import { Link, router } from "expo-router"; // 用于页面导航和路由管理
// import { useSocialAuth } from "../../hooks/useSocialAuth"; // 社交账号登录相关 hook
// import { useAuthStore } from "../../stores/useAuthStore"; // 认证状态管理 hook
import Ionicons from "@expo/vector-icons/Ionicons";

// 定义登录表单的数据结构接口
interface LoginForm {
  phone: string; // 用户手机号
  verificationCode?: string; // 可选的验证码字段,用于验证码登录方式
}

/**
 * 登录页面组件
 * 提供手机号密码登录功能
 * 包含登录表单、错误提示等功能
 */
export default function LoginScreen() {
  // 状态管理
  const [username, setUsername] = useState(""); // 用户名/手机号输入状态
  const [password, setPassword] = useState(""); // 密码输入状态
  const [loading, setLoading] = useState(false); // 控制登录按钮loading状态
  const [visible, setVisible] = useState(false); // 控制错误提示Snackbar的显示状态
  const [error, setError] = useState(""); // 存储错误信息文本
  const [showPassword, setShowPassword] = useState(false);

  // 从认证store中获取登录方法
  const { login } = useAuthStore();

  /**
   * 处理登录逻辑
   * 1. 验证输入完整性
   * 2. 调用登录API
   * 3. 处理登录结果
   * 4. 错误处理
   */
  const handleLogin = async () => {
    try {
      setLoading(true); // 开始加载,禁用登录按钮

      // 验证输入是否完整
      if (!username || !password) {
        setError("请输入手机号和密码");
        setVisible(true);
        return;
      }

      // 模拟API调用 - 验证固定的测试账号(用户名密码都是111)
      if (username === "111" && password === "111") {
        // 模拟成功响应数据
        const mockResponse = {
          token: "mock-token", // JWT token
          user: {
            id: 1,
            name: username,
          },
        };

        // 调用登录方法,保存token和用户信息到全局状态
        await login(mockResponse.token, mockResponse.user);
        // 登录成功后会自动跳转到主页
      } else {
        // 登录失败处理
        setError("手机号或密码错误");
        setVisible(true);
      }
    } catch (error) {
      // 异常处理(网络错误等)
      setError("登录失败，请重试");
      setVisible(true);
      console.error("Login failed:", error);
    } finally {
      setLoading(false); // 结束加载状态
    }
  };

  return (
    <View style={styles.container}>
      {/* 登录表单容器 */}
      <Text style={styles.title}>Hello, 牛马</Text>
      <View style={styles.form}>
        {/* 手机号输入框 */}
        <TextInput
          label="手机号" // 输入框标签
          value={username} // 输入框的值
          onChangeText={setUsername} // 值变化时的回调
          style={[styles.input, { backgroundColor: "#2C2C2C" }]}
          placeholder="请输入手机号"
          disabled={loading} // 加载时禁用输入
          theme={{
            colors: {
              background: "#2C2C2C",
              placeholder: "#666666",
              text: "#E0E0E0",
              primary: "#00999B",
              onSurfaceVariant: "#999",
              outline: "#404040", // 未选中时的边框颜色
              onSurface: "#FFFFFF", // 标签文本颜色
            },
            dark: true, // 启用暗色主题
          }}
        />

        {/* 密码输入框 */}
        <TextInput
          label="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // 密码隐藏
          style={[styles.input, { backgroundColor: "#2C2C2C" }]}
          disabled={loading}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
              forceTextInputFocus={false}
              style={{ marginRight: 8 }}
            />
          }
          theme={{
            colors: {
              background: "#2C2C2C",
              placeholder: "#666666",
              text: "#E0E0E0",
              primary: "#00999B",
              onSurfaceVariant: "#999",
              outline: "#404040", // 未选中时的边框颜色
              onSurface: "#FFFFFF", // 标签文本颜色
            },
            dark: true, // 启用暗色主题
          }}
        />

        {/* 登录按钮 */}
        <Button
          mode="contained" // 实心按钮
          onPress={handleLogin} // 点击处理函数
          style={styles.button}
          loading={loading} // 显示加载动画
          disabled={loading} // 加载时禁用按钮
          buttonColor="#00999B" // 按钮颜色
        >
          {loading ? "登录中..." : "登录"}
        </Button>

        {/* 辅助按钮区域 */}
        <View style={styles.additionalButtons}>
          <Button
            mode="text" // 文本按钮
            onPress={() => {}} // TODO: 实现忘记密码功能
            textColor="#00999B"
            compact // 使按钮更紧凑
          >
            忘记密码
          </Button>
          <Text style={{ color: "#ffffff" }}>|</Text>
          <Button
            mode="text"
            onPress={() => router.push("/(auth)/register")}
            //实现跳转到注册页面
            textColor="#00999B"
            compact
          >
            注册账号
          </Button>
        </View>
        {/* 添加分割线和第三方登录 */}
        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <Text style={styles.dividerText}>其他登录方式</Text>
          <Divider style={styles.divider} />
        </View>
        {/* 第三方登录按钮 */}
        <View style={styles.socialButtons}>
          {/* 微信登录 */}
          <Button
            onPress={() => {}}
            style={styles.socialButton}
            icon={() => (
              <Ionicons name="logo-wechat" size={24} color="#00C800" />
            )}
          ></Button>

          {/* 苹果登录（仅在 iOS 上显示） */}
          {Platform.OS === "ios" && (
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.socialButton}
              icon={() => <Ionicons name="logo-apple" size={24} color="#000" />}
            >
              Apple 登录
            </Button>
          )}
        </View>
      </View>

      {/* 错误提示消息条 */}
      <Snackbar
        visible={visible} // 控制显示状态
        onDismiss={() => setVisible(false)} // 关闭回调
        duration={3000} // 显示时长3秒
        action={{
          label: "关闭",
          onPress: () => setVisible(false),
        }}
      >
        {error} {/* 显示错误信息 */}
      </Snackbar>
    </View>
  );
}

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1, // 占满整个屏幕
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#000000", // 黑色背景
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff", // 白色文字
    marginLeft: 30,
    position: "absolute", // 绝对定位
    top: 100,
    fontFamily: "monospace", // 等宽字体
  },
  form: {
    padding: 20,
    // 阴影效果
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android阴影效果
  },
  input: {
    marginBottom: 16, // 输入框底部间距
  },
  button: {
    paddingVertical: 8,
    borderRadius: 4, // 按钮圆角
  },
  hint: {
    marginTop: 16,
    textAlign: "center",
    color: "#666", // 灰色提示文字
    fontSize: 12,
  },
  additionalButtons: {
    flexDirection: "row", // 水平排列
    justifyContent: "center", // 水平居中
    alignItems: "center", // 垂直居中
    marginTop: 16, // 与登录按钮的间距
    gap: 16, // 按钮之间的间距
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    backgroundColor: "#ffffff40", // 半透明白色
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#ffffff80", // 半透明白色
    fontSize: 12,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    borderColor: "#ffffff40", // 半透明白色边框
    borderRadius: 20, // 圆角
    minWidth: 120, // 最小宽度
  },
});
