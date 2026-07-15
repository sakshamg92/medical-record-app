import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
  SHADOWS,
} from "../utils/constants";

const getInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : "?");

const formatUpdated = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No update recorded";
  return `Updated ${date.toLocaleDateString()}`;
};

const PatientCard = ({ patient, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitial(patient.patientName)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {patient.patientName}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons
            name="call-outline"
            size={13}
            color={COLORS.textSecondary}
          />
          <Text style={styles.meta} numberOfLines={1}>
            {patient.mobile || "No mobile on file"}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="medical-outline"
            size={13}
            color={COLORS.textSecondary}
          />
          <Text style={styles.meta} numberOfLines={1}>
            {patient.disease || "No condition noted"}
          </Text>
        </View>

        <Text style={styles.updated}>{formatUpdated(patient.updatedAt)}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
    ...SHADOWS.card,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  name: {
    ...TYPOGRAPHY.cardTitle,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  meta: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  updated: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 6,
  },
});

export default PatientCard;
// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { COLORS } from '../utils/constants';

// const PatientCard = ({ patient, onPress }) => {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress}>
//       <Text style={styles.name}>{patient.patientName}</Text>
//       <View style={styles.metaRow}>
//         <Text style={styles.meta}>{patient.mobile || 'No mobile'}</Text>
//         <Text style={styles.meta}>{patient.disease || 'No disease'}</Text>
//       </View>
//       <Text style={styles.updated}>Updated: {new Date(patient.updatedAt).toLocaleString()}</Text>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#E1E8F0',
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.text,
//   },
//   metaRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//     gap: 10,
//   },
//   meta: {
//     flex: 1,
//     fontSize: 14,
//     color: '#4B5563',
//   },
//   updated: {
//     marginTop: 8,
//     color: '#6B7280',
//     fontSize: 12,
//   },
// });

// export default PatientCard;
