import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from "../utils/constants";

export const Section = ({ title, icon, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={16} color={COLORS.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

export const FieldLabel = ({ label, required }) => (
  <Text style={styles.label}>
    {label}
    {required ? <Text style={styles.requiredMark}> *</Text> : null}
  </Text>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.sectionTitle,
    color: COLORS.primary,
  },
  label: {
    ...TYPOGRAPHY.label,
    marginBottom: 6,
    marginTop: SPACING.sm,
  },
  requiredMark: {
    color: COLORS.danger,
  },
});
