import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
  SHADOWS,
} from "../utils/constants";

const VARIANTS = {
  primary: {
    container: { backgroundColor: COLORS.primary },
    text: { color: COLORS.white },
  },
  secondary: {
    container: {
      backgroundColor: COLORS.white,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
    },
    text: { color: COLORS.primary },
  },
  destructive: {
    container: { backgroundColor: COLORS.danger },
    text: { color: COLORS.white },
  },
  fab: {
    container: { backgroundColor: COLORS.primary, ...SHADOWS.fab },
    text: { color: COLORS.white },
  },
};

/**
 * variant: 'primary' (default) | 'secondary' | 'destructive' | 'fab'
 * icon: optional Ionicons name rendered before the title
 * All existing props/behavior preserved — icon/destructive/fab are additive.
 */
const CustomButton = ({
  title,
  onPress,
  loading,
  variant = "primary",
  icon,
  style,
  disabled,
}) => {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  const isFab = variant === "fab";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.base,
        isFab && styles.fabBase,
        variantStyle.container,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text.color} />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={isFab ? 20 : 18}
              color={variantStyle.text.color}
              style={title ? styles.iconSpacing : undefined}
            />
          ) : null}
          {title ? (
            <Text style={[styles.text, variantStyle.text]}>{title}</Text>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    borderRadius: RADIUS.md,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
    marginVertical: 6,
  },
  fabBase: {
    borderRadius: RADIUS.full,
    alignSelf: "flex-start",
    marginVertical: 0,
  },
  text: {
    ...TYPOGRAPHY.button,
  },
  iconSpacing: {
    marginRight: SPACING.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;
// import React from 'react';
// import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { COLORS } from '../utils/constants';

// const CustomButton = ({ title, onPress, loading, variant = 'primary', style, disabled }) => {
//   const isSecondary = variant === 'secondary';

//   return (
//     <TouchableOpacity
//       style={[
//         styles.button,
//         isSecondary ? styles.secondaryButton : styles.primaryButton,
//         (disabled || loading) && styles.disabled,
//         style,
//       ]}
//       onPress={onPress}
//       disabled={disabled || loading}
//     >
//       {loading ? (
//         <ActivityIndicator color={isSecondary ? COLORS.blue : COLORS.white} />
//       ) : (
//         <Text style={[styles.text, isSecondary ? styles.secondaryText : styles.primaryText]}>
//           {title}
//         </Text>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     borderRadius: 10,
//     minHeight: 48,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//     marginVertical: 6,
//   },
//   primaryButton: {
//     backgroundColor: COLORS.blue,
//   },
//   secondaryButton: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.blue,
//   },
//   text: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   primaryText: {
//     color: COLORS.white,
//   },
//   secondaryText: {
//     color: COLORS.blue,
//   },
//   disabled: {
//     opacity: 0.6,
//   },
// });

// export default CustomButton;
