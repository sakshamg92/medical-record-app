import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";
import { FieldLabel } from "../components/FormSection";
import { authApi } from "../services/api";
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from "../utils/constants";

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedKey, setFocusedKey] = useState(null);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert("Validation", "Username and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login(username.trim(), password);
      await AsyncStorage.setItem("token", response.data.token);
      onLogin(response.data.token);
    } catch (error) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.brandBadge}>
            <Ionicons name="medkit" size={28} color={COLORS.primary} />
          </View>

          <Text style={styles.heading}>Medical Record App</Text>
          <Text style={styles.subText}>Staff login</Text>

          <FieldLabel label="Username" />
          <TextInput
            style={[
              styles.input,
              focusedKey === "username" && styles.inputFocused,
            ]}
            placeholder="Enter your username"
            placeholderTextColor={COLORS.textMuted}
            value={username}
            onChangeText={setUsername}
            onFocus={() => setFocusedKey("username")}
            onBlur={() => setFocusedKey(null)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FieldLabel label="Password" />
          <View
            style={[
              styles.passwordWrap,
              focusedKey === "password" && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedKey("password")}
              onBlur={() => setFocusedKey(null)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />
        </View>

        <Text style={styles.footerNote}>
          Authorized medical shop staff only
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.card,
  },
  brandBadge: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  heading: {
    ...TYPOGRAPHY.screenTitle,
    textAlign: "center",
    marginBottom: 4,
  },
  subText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    minHeight: 50,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    minHeight: 50,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  loginBtn: {
    marginTop: SPACING.sm,
    minHeight: 54,
  },
  footerNote: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: SPACING.lg,
  },
});

export default LoginScreen;
// import React, { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import CustomButton from "../components/CustomButton";
// import { authApi } from "../services/api";
// import { COLORS } from "../utils/constants";

// const LoginScreen = ({ onLogin }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!username.trim() || !password) {
//       Alert.alert("Validation", "Username and password are required.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await authApi.login(username.trim(), password);
//       await AsyncStorage.setItem("token", response.data.token);
//       onLogin(response.data.token);
//     } catch (error) {
//       Alert.alert("Login failed", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Medical Record App</Text>
//       <Text style={styles.subText}>Staff login</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <CustomButton
//         title="Login"
//         onPress={handleLogin}
//         loading={loading}
//         style={styles.loginBtn}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//     backgroundColor: COLORS.lightGray,
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: COLORS.blue,
//     marginBottom: 8,
//   },
//   subText: {
//     fontSize: 16,
//     color: "#475569",
//     marginBottom: 24,
//   },
//   input: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: "#D9E2EC",
//     borderRadius: 10,
//     minHeight: 50,
//     paddingHorizontal: 14,
//     marginBottom: 12,
//     fontSize: 16,
//   },
//   loginBtn: {
//     marginTop: 8,
//     minHeight: 54,
//   },
// });

// export default LoginScreen;
