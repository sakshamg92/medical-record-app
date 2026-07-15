import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { Section } from "../components/FormSection";
import { patientApi } from "../services/api";
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from "../utils/constants";

const formatMoney = (value) => {
  const num = Number(value) || 0;
  return num.toFixed(2);
};

const getInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : "?");

// Module-scope display helper — label/value pair inside a Section.
const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || "-"}</Text>
  </View>
);

const PatientDetailsScreen = ({ route, navigation }) => {
  const { patientId, onDeleted } = route.params || {};
  const [patient, setPatient] = useState(null);

  const loadPatient = useCallback(async () => {
    try {
      const response = await patientApi.getById(patientId);
      setPatient(response.data);
    } catch (error) {
      Alert.alert("Error", error.message);
      navigation.goBack();
    }
  }, [navigation, patientId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadPatient);
    return unsubscribe;
  }, [loadPatient, navigation]);

  const handleDelete = async () => {
    const deletePatient = async () => {
      try {
        await patientApi.remove(patientId);

        if (typeof onDeleted === "function") {
          onDeleted(patientId);
        }

        navigation.goBack();

        if (Platform.OS === "web") {
          window.alert("Patient deleted successfully.");
        } else {
          Alert.alert("Deleted", "Patient deleted successfully.");
        }
      } catch (error) {
        console.log(error);

        if (Platform.OS === "web") {
          window.alert(error.message);
        } else {
          Alert.alert("Delete failed", error.message);
        }
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this record?",
      );

      if (confirmed) {
        await deletePatient();
      }
    } else {
      Alert.alert(
        "Delete Patient",
        "Are you sure you want to delete this record?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: deletePatient,
          },
        ],
      );
    }
  };

  if (!patient) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading patient record…</Text>
      </View>
    );
  }

  const grandTotal = (patient.medicines || []).reduce(
    (sum, medicine) => sum + (Number(medicine.total) || 0),
    0,
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitial(patient.patientName)}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{patient.patientName}</Text>
          <View style={styles.headerMetaRow}>
            <Ionicons
              name="call-outline"
              size={13}
              color={COLORS.textSecondary}
            />
            <Text style={styles.headerMeta}>
              {patient.mobile || "No mobile on file"}
            </Text>
          </View>
        </View>
      </View>

      <Section title="Address" icon="location-outline">
        <DetailRow label="Address" value={patient.address} />
      </Section>

      <Section title="Doctor Information" icon="medkit-outline">
        <DetailRow label="Doctor Name" value={patient.doctorName} />
        <DetailRow label="Doctor Address" value={patient.doctorAddress} />
      </Section>

      <Section title="Clinical Information" icon="clipboard-outline">
        <DetailRow label="Disease" value={patient.disease} />
        <DetailRow label="Notes" value={patient.notes} />
      </Section>

      <Section title="Medicines" icon="medical-outline">
        {(patient.medicines || []).length ? (
          <>
            <View style={styles.tableWrap}>
              <View style={[styles.row, styles.headerRow]}>
                <Text
                  style={[styles.cell, styles.nameCol, styles.headerCellText]}
                >
                  Medicine
                </Text>
                <Text
                  style={[styles.cell, styles.numCol, styles.headerCellText]}
                >
                  QTY
                </Text>
                <Text
                  style={[styles.cell, styles.numCol, styles.headerCellText]}
                >
                  Rate
                </Text>
                <Text
                  style={[styles.cell, styles.numCol, styles.headerCellText]}
                >
                  Total
                </Text>
              </View>

              {patient.medicines.map((medicine, index) => {
                const qty = Number(medicine?.qty) || 0;
                const rate = Number(medicine?.rate) || 0;
                const total =
                  medicine?.total !== undefined && medicine?.total !== null
                    ? Number(medicine.total) || 0
                    : qty * rate;

                return (
                  <View
                    key={`${medicine?.name || "medicine"}-${index}`}
                    style={[
                      styles.row,
                      index % 2 === 1 && styles.rowAlt,
                      index === patient.medicines.length - 1 && styles.rowLast,
                    ]}
                  >
                    <Text style={[styles.cell, styles.nameCol]}>
                      {medicine?.name || "-"}
                    </Text>
                    <Text style={[styles.cell, styles.numCol]}>{qty}</Text>
                    <Text style={[styles.cell, styles.numCol]}>
                      {formatMoney(rate)}
                    </Text>
                    <Text
                      style={[styles.cell, styles.numCol, styles.totalCellText]}
                    >
                      {formatMoney(total)}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.grandTotalWrap}>
              <View style={styles.grandTotalLeft}>
                <Ionicons
                  name="wallet-outline"
                  size={18}
                  color={COLORS.white}
                />
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
              </View>
              <Text style={styles.grandTotalValue}>
                ₹ {formatMoney(grandTotal)}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.emptyMedicines}>No medicines recorded.</Text>
        )}
      </Section>

      <Text style={styles.timestamp}>
        Created {new Date(patient.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.timestamp}>
        Updated {new Date(patient.updatedAt).toLocaleString()}
      </Text>

      <CustomButton
        title="Edit"
        icon="create-outline"
        onPress={() =>
          navigation.navigate("EditPatient", { patientId: patient._id })
        }
      />
      <CustomButton
        title="Delete"
        icon="trash-outline"
        onPress={handleDelete}
        variant="destructive"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    gap: SPACING.sm,
  },
  loadingText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
  },
  headerText: { flex: 1 },
  name: {
    ...TYPOGRAPHY.screenTitle,
    fontSize: 19,
  },
  headerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  headerMeta: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },

  detailRow: { marginBottom: SPACING.sm },
  detailLabel: {
    ...TYPOGRAPHY.label,
    marginBottom: 2,
  },
  detailValue: {
    ...TYPOGRAPHY.body,
  },

  tableWrap: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  rowAlt: {
    backgroundColor: COLORS.background,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  headerRow: { backgroundColor: COLORS.primaryTint },
  headerCellText: { fontWeight: "700", color: COLORS.primary },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  nameCol: { flex: 2.2 },
  numCol: { flex: 1, textAlign: "right" },
  totalCellText: { fontWeight: "700", color: COLORS.textPrimary },

  emptyMedicines: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },

  grandTotalWrap: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...SHADOWS.card,
  },
  grandTotalLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.white,
  },

  timestamp: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textAlign: "center",
  },
});

export default PatientDetailsScreen;

// import React, { useCallback, useEffect, useState } from "react";

// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   Platform,
// } from "react-native";
// import CustomButton from "../components/CustomButton";
// import { patientApi } from "../services/api";
// import { COLORS } from "../utils/constants";

// const formatMoney = (value) => {
//   const num = Number(value) || 0;
//   return num.toFixed(2);
// };

// const PatientDetailsScreen = ({ route, navigation }) => {
//   const { patientId, onDeleted } = route.params || {};
//   const [patient, setPatient] = useState(null);

//   const loadPatient = useCallback(async () => {
//     try {
//       const response = await patientApi.getById(patientId);
//       setPatient(response.data);
//     } catch (error) {
//       Alert.alert("Error", error.message);
//       navigation.goBack();
//     }
//   }, [navigation, patientId]);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener("focus", loadPatient);
//     return unsubscribe;
//   }, [loadPatient, navigation]);

//   // const handleDelete = async () => {
//   //   console.log("Delete clicked");

//   //   try {
//   //     console.log("patientId:", patientId);

//   //     const response = await patientApi.remove(patientId);

//   //     console.log("Delete response:", response);

//   //     navigation.goBack();
//   //   } catch (error) {
//   //     console.log("Delete error:", error);
//   //   }
//   // };
//   const handleDelete = async () => {
//     const deletePatient = async () => {
//       try {
//         await patientApi.remove(patientId);

//         if (typeof onDeleted === "function") {
//           onDeleted(patientId);
//         }

//         navigation.goBack();

//         if (Platform.OS === "web") {
//           window.alert("Patient deleted successfully.");
//         } else {
//           Alert.alert("Deleted", "Patient deleted successfully.");
//         }
//       } catch (error) {
//         console.log(error);

//         if (Platform.OS === "web") {
//           window.alert(error.message);
//         } else {
//           Alert.alert("Delete failed", error.message);
//         }
//       }
//     };

//     if (Platform.OS === "web") {
//       const confirmed = window.confirm(
//         "Are you sure you want to delete this record?",
//       );

//       if (confirmed) {
//         await deletePatient();
//       }
//     } else {
//       Alert.alert(
//         "Delete Patient",
//         "Are you sure you want to delete this record?",
//         [
//           {
//             text: "Cancel",
//             style: "cancel",
//           },
//           {
//             text: "Delete",
//             style: "destructive",
//             onPress: deletePatient,
//           },
//         ],
//       );
//     }
//   };

//   if (!patient) {
//     return (
//       <View style={styles.loadingWrap}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   const grandTotal = (patient.medicines || []).reduce(
//     (sum, medicine) => sum + (Number(medicine.total) || 0),
//     0,
//   );

//   const details = [
//     ["Patient Name", patient.patientName],
//     ["Mobile", patient.mobile],
//     ["Address", patient.address],
//     ["Doctor Name", patient.doctorName],
//     ["Doctor Address", patient.doctorAddress],
//     ["Disease", patient.disease],
//     ["Notes", patient.notes],
//     ["Created At", new Date(patient.createdAt).toLocaleString()],
//     ["Updated At", new Date(patient.updatedAt).toLocaleString()],
//   ];

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       {details.map(([label, value]) => (
//         <View key={label} style={styles.fieldWrap}>
//           <Text style={styles.label}>{label}</Text>
//           <Text style={styles.value}>{value || "-"}</Text>
//         </View>
//       ))}

//       <View style={styles.fieldWrap}>
//         <Text style={styles.label}>Medicines</Text>

//         {(patient.medicines || []).length ? (
//           <View style={styles.tableWrap}>
//             <View style={[styles.row, styles.headerRow]}>
//               <Text style={[styles.cell, styles.nameCol, styles.headerText]}>
//                 Medicine Name
//               </Text>
//               <Text style={[styles.cell, styles.numCol, styles.headerText]}>
//                 QTY
//               </Text>
//               <Text style={[styles.cell, styles.numCol, styles.headerText]}>
//                 Rate
//               </Text>
//               <Text style={[styles.cell, styles.numCol, styles.headerText]}>
//                 Total
//               </Text>
//             </View>

//             {patient.medicines.map((medicine, index) => {
//               const qty = Number(medicine?.qty) || 0;
//               const rate = Number(medicine?.rate) || 0;
//               const total =
//                 medicine?.total !== undefined && medicine?.total !== null
//                   ? Number(medicine.total) || 0
//                   : qty * rate;

//               return (
//                 <View
//                   key={`${medicine?.name || "medicine"}-${index}`}
//                   style={styles.row}
//                 >
//                   <Text style={[styles.cell, styles.nameCol]}>
//                     {medicine?.name || "-"}
//                   </Text>
//                   <Text style={[styles.cell, styles.numCol]}>{qty}</Text>
//                   <Text style={[styles.cell, styles.numCol]}>
//                     {formatMoney(rate)}
//                   </Text>
//                   <Text style={[styles.cell, styles.numCol]}>
//                     {formatMoney(total)}
//                   </Text>
//                 </View>
//               );
//             })}
//             <View
//               style={[
//                 styles.row,
//                 {
//                   backgroundColor: "#E8F5E9",
//                   borderTopWidth: 2,
//                   borderTopColor: "#CBD5E1",
//                   borderBottomWidth: 0,
//                 },
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.cell,
//                   styles.nameCol,
//                   {
//                     fontWeight: "bold",
//                     fontSize: 15,
//                   },
//                 ]}
//               >
//                 Grand Total
//               </Text>

//               <Text style={[styles.cell, styles.numCol]} />

//               <Text style={[styles.cell, styles.numCol]} />

//               <Text
//                 style={[
//                   styles.cell,
//                   styles.numCol,
//                   {
//                     fontWeight: "bold",
//                     color: COLORS.blue,
//                     fontSize: 15,
//                   },
//                 ]}
//               >
//                 ₹ {formatMoney(grandTotal)}
//               </Text>
//             </View>
//           </View>
//         ) : (
//           <Text style={styles.value}>-</Text>
//         )}
//       </View>

//       <CustomButton
//         title="Edit"
//         onPress={() =>
//           navigation.navigate("EditPatient", { patientId: patient._id })
//         }
//       />
//       <CustomButton title="Delete" onPress={handleDelete} variant="secondary" />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
//   container: { flex: 1, backgroundColor: COLORS.lightGray },
//   content: { padding: 16, paddingBottom: 32 },
//   fieldWrap: {
//     backgroundColor: COLORS.white,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#DDE6F2",
//     padding: 12,
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: COLORS.blue,
//     marginBottom: 8,
//   },
//   value: { color: "#334155", fontSize: 15 },
//   tableWrap: {
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//     backgroundColor: "#fff",
//   },
//   headerRow: { backgroundColor: "#F8FAFC" },
//   headerText: { fontWeight: "700", color: "#0F172A" },
//   cell: {
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     fontSize: 13,
//     color: "#334155",
//   },
//   nameCol: { flex: 2.2 },
//   numCol: { flex: 1, textAlign: "right" },
// });

// export default PatientDetailsScreen;
