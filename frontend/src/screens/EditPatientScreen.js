import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { Section, FieldLabel } from "../components/FormSection";
import { patientApi } from "../services/api";
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from "../utils/constants";

const createMedicineRow = (data = {}) => ({
  id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: data.name || "",
  qty: String(data.qty ?? ""),
  rate: String(data.rate ?? ""),
  total: (Number(data.qty) || 0) * (Number(data.rate) || 0),
});

const getMedicineTotal = (qty, rate) => {
  const q = Number(qty) || 0;
  const r = Number(rate) || 0;
  return q * r;
};

const EditPatientScreen = ({ route, navigation }) => {
  const { patientId } = route.params;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [focusedKey, setFocusedKey] = useState(null);
  const [form, setForm] = useState({
    patientName: "",
    mobile: "",
    address: "",
    doctorName: "",
    doctorAddress: "",
    disease: "",
    medicines: [createMedicineRow()],
    notes: "",
  });

  const grandTotal = form.medicines.reduce(
    (sum, medicine) => sum + getMedicineTotal(medicine.qty, medicine.rate),
    0,
  );

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const response = await patientApi.getById(patientId);
        const patient = response.data;

        setForm({
          patientName: patient.patientName || "",
          mobile: patient.mobile || "",
          address: patient.address || "",
          doctorName: patient.doctorName || "",
          doctorAddress: patient.doctorAddress || "",
          disease: patient.disease || "",
          medicines:
            Array.isArray(patient.medicines) && patient.medicines.length
              ? patient.medicines.map((m) => createMedicineRow(m))
              : [createMedicineRow()],
          notes: patient.notes || "",
        });
      } catch (error) {
        Alert.alert("Error", error.message);
        navigation.goBack();
      } finally {
        setInitialLoading(false);
      }
    };

    loadPatient();
  }, [navigation, patientId]);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateMedicine = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.map((medicine) => {
        if (medicine.id !== id) return medicine;
        const next = { ...medicine, [key]: value };
        next.total = getMedicineTotal(next.qty, next.rate);
        return next;
      }),
    }));
  };

  const addMedicineRow = () => {
    setForm((prev) => ({
      ...prev,
      medicines: [...prev.medicines, createMedicineRow()],
    }));
  };

  const removeMedicineRow = (id) => {
    setForm((prev) => ({
      ...prev,
      medicines:
        prev.medicines.length === 1
          ? prev.medicines
          : prev.medicines.filter((medicine) => medicine.id !== id),
    }));
  };

  const handleSave = async () => {
    if (!form.patientName.trim()) {
      Alert.alert("Validation", "Patient Name is required.");
      return;
    }

    const medicines = form.medicines
      .map(({ id, ...m }) => {
        const name = String(m.name || "").trim();
        const qty = Number(m.qty) || 0;
        const rate = Number(m.rate) || 0;
        return { name, qty, rate, total: qty * rate };
      })
      .filter((m) => m.name || m.qty || m.rate || m.total);

    if (medicines.some((m) => !m.name)) {
      Alert.alert(
        "Validation",
        "Medicine Name is required for each filled medicine row.",
      );
      return;
    }

    setLoading(true);
    try {
      await patientApi.update(patientId, { ...form, medicines });
      Alert.alert("Success", "Patient updated successfully.");
      navigation.navigate("Home", { refresh: Date.now() });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (key, extra) => [
    styles.input,
    focusedKey === key && styles.inputFocused,
    extra,
  ];

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading patient record…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Section title="Patient Details" icon="person-outline">
        <FieldLabel label="Patient Name" required />
        <TextInput
          style={inputStyle("patientName")}
          value={form.patientName}
          onChangeText={(value) => updateField("patientName", value)}
          onFocus={() => setFocusedKey("patientName")}
          onBlur={() => setFocusedKey(null)}
          placeholder="Full name"
          placeholderTextColor={COLORS.textMuted}
        />

        <FieldLabel label="Mobile Number" />
        <TextInput
          style={inputStyle("mobile")}
          value={form.mobile}
          onChangeText={(value) => updateField("mobile", value)}
          onFocus={() => setFocusedKey("mobile")}
          onBlur={() => setFocusedKey(null)}
          keyboardType="phone-pad"
          placeholder="10-digit number"
          placeholderTextColor={COLORS.textMuted}
        />
      </Section>

      <Section title="Address" icon="location-outline">
        <FieldLabel label="Address" />
        <TextInput
          style={inputStyle("address", styles.multilineInput)}
          value={form.address}
          onChangeText={(value) => updateField("address", value)}
          onFocus={() => setFocusedKey("address")}
          onBlur={() => setFocusedKey(null)}
          multiline
        />
      </Section>

      <Section title="Doctor Information" icon="medkit-outline">
        <FieldLabel label="Doctor Name" />
        <TextInput
          style={inputStyle("doctorName")}
          value={form.doctorName}
          onChangeText={(value) => updateField("doctorName", value)}
          onFocus={() => setFocusedKey("doctorName")}
          onBlur={() => setFocusedKey(null)}
        />

        <FieldLabel label="Doctor Address" />
        <TextInput
          style={inputStyle("doctorAddress", styles.multilineInput)}
          value={form.doctorAddress}
          onChangeText={(value) => updateField("doctorAddress", value)}
          onFocus={() => setFocusedKey("doctorAddress")}
          onBlur={() => setFocusedKey(null)}
          multiline
        />
      </Section>

      <Section title="Clinical Information" icon="clipboard-outline">
        <FieldLabel label="Disease" />
        <TextInput
          style={inputStyle("disease")}
          value={form.disease}
          onChangeText={(value) => updateField("disease", value)}
          onFocus={() => setFocusedKey("disease")}
          onBlur={() => setFocusedKey(null)}
        />
      </Section>

      <Section title="Medicines" icon="medical-outline">
        {form.medicines.map((medicine, index) => (
          <View key={medicine.id} style={styles.medicineCard}>
            <View style={styles.medicineCardHeader}>
              <Text style={styles.medicineIndex}>Medicine {index + 1}</Text>
              <TouchableOpacity
                onPress={() => removeMedicineRow(medicine.id)}
                disabled={form.medicines.length === 1}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="trash-outline"
                  size={19}
                  color={
                    form.medicines.length === 1
                      ? COLORS.textMuted
                      : COLORS.danger
                  }
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={inputStyle(`${medicine.id}:name`)}
              placeholder="Medicine name"
              placeholderTextColor={COLORS.textMuted}
              value={medicine.name}
              onChangeText={(value) =>
                updateMedicine(medicine.id, "name", value)
              }
              onFocus={() => setFocusedKey(`${medicine.id}:name`)}
              onBlur={() => setFocusedKey(null)}
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.smallLabel}>QTY (strips)</Text>
                <TextInput
                  style={inputStyle(`${medicine.id}:qty`)}
                  placeholder="0"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={String(medicine.qty ?? "")}
                  onChangeText={(value) =>
                    updateMedicine(medicine.id, "qty", value)
                  }
                  onFocus={() => setFocusedKey(`${medicine.id}:qty`)}
                  onBlur={() => setFocusedKey(null)}
                />
              </View>

              <View style={styles.half}>
                <Text style={styles.smallLabel}>Rate (per strip)</Text>
                <TextInput
                  style={inputStyle(`${medicine.id}:rate`)}
                  placeholder="0"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={String(medicine.rate ?? "")}
                  onChangeText={(value) =>
                    updateMedicine(medicine.id, "rate", value)
                  }
                  onFocus={() => setFocusedKey(`${medicine.id}:rate`)}
                  onBlur={() => setFocusedKey(null)}
                />
              </View>
            </View>

            <View style={styles.totalWrap}>
              <Text style={styles.totalLabel}>Row Total</Text>
              <Text style={styles.totalValue}>
                ₹ {getMedicineTotal(medicine.qty, medicine.rate).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        <CustomButton
          title="Add Medicine Row"
          icon="add-circle-outline"
          onPress={addMedicineRow}
          variant="secondary"
        />

        <View style={styles.grandTotalWrap}>
          <View style={styles.grandTotalLeft}>
            <Ionicons name="wallet-outline" size={18} color={COLORS.white} />
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
          </View>
          <Text style={styles.grandTotalValue}>₹ {grandTotal.toFixed(2)}</Text>
        </View>
      </Section>

      <Section title="Notes" icon="document-text-outline">
        <TextInput
          style={inputStyle("notes", styles.notesInput)}
          value={form.notes}
          onChangeText={(value) => updateField("notes", value)}
          onFocus={() => setFocusedKey("notes")}
          onBlur={() => setFocusedKey(null)}
          multiline
        />
      </Section>

      <CustomButton
        title="Save Changes"
        onPress={handleSave}
        loading={loading}
      />
      <CustomButton
        title="Cancel"
        onPress={() => navigation.goBack()}
        variant="secondary"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl * 2 },

  loadingContainer: {
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

  smallLabel: {
    ...TYPOGRAPHY.small,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight: 48,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  multilineInput: {
    minHeight: 64,
    textAlignVertical: "top",
    paddingVertical: 10,
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: "top",
    paddingVertical: 10,
  },

  row: { flexDirection: "row", gap: SPACING.sm },
  half: { flex: 1 },

  medicineCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  medicineCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medicineIndex: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },

  totalWrap: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryTint,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    ...TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  totalValue: {
    ...TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.primary,
    fontSize: 14,
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
});

export default EditPatientScreen;
// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import CustomButton from "../components/CustomButton";
// import { patientApi } from "../services/api";
// import { COLORS } from "../utils/constants";

// const createMedicineRow = (data = {}) => ({
//   id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
//   name: data.name || "",
//   qty: String(data.qty ?? ""),
//   rate: String(data.rate ?? ""),
//   total: (Number(data.qty) || 0) * (Number(data.rate) || 0),
// });

// const getMedicineTotal = (qty, rate) => {
//   const q = Number(qty) || 0;
//   const r = Number(rate) || 0;
//   return q * r;
// };

// const EditPatientScreen = ({ route, navigation }) => {
//   const { patientId } = route.params;
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     patientName: "",
//     mobile: "",
//     address: "",
//     doctorName: "",
//     doctorAddress: "",
//     disease: "",
//     medicines: [createMedicineRow()],
//     notes: "",
//   });

//   const grandTotal = form.medicines.reduce(
//     (sum, medicine) => sum + getMedicineTotal(medicine.qty, medicine.rate),
//     0,
//   );

//   useEffect(() => {
//     const loadPatient = async () => {
//       try {
//         const response = await patientApi.getById(patientId);
//         const patient = response.data;

//         setForm({
//           patientName: patient.patientName || "",
//           mobile: patient.mobile || "",
//           address: patient.address || "",
//           doctorName: patient.doctorName || "",
//           doctorAddress: patient.doctorAddress || "",
//           disease: patient.disease || "",
//           medicines:
//             Array.isArray(patient.medicines) && patient.medicines.length
//               ? patient.medicines.map((m) => createMedicineRow(m))
//               : [createMedicineRow()],
//           notes: patient.notes || "",
//         });
//       } catch (error) {
//         Alert.alert("Error", error.message);
//         navigation.goBack();
//       }
//     };

//     loadPatient();
//   }, [navigation, patientId]);

//   const updateField = (key, value) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   const updateMedicine = (id, key, value) => {
//     setForm((prev) => ({
//       ...prev,
//       medicines: prev.medicines.map((medicine) => {
//         if (medicine.id !== id) return medicine;
//         const next = { ...medicine, [key]: value };
//         next.total = getMedicineTotal(next.qty, next.rate);
//         return next;
//       }),
//     }));
//   };

//   const addMedicineRow = () => {
//     setForm((prev) => ({
//       ...prev,
//       medicines: [...prev.medicines, createMedicineRow()],
//     }));
//   };

//   const removeMedicineRow = (id) => {
//     setForm((prev) => ({
//       ...prev,
//       medicines:
//         prev.medicines.length === 1
//           ? prev.medicines
//           : prev.medicines.filter((medicine) => medicine.id !== id),
//     }));
//   };

//   const handleSave = async () => {
//     if (!form.patientName.trim()) {
//       Alert.alert("Validation", "Patient Name is required.");
//       return;
//     }

//     const medicines = form.medicines
//       .map(({ id, ...m }) => {
//         const name = String(m.name || "").trim();
//         const qty = Number(m.qty) || 0;
//         const rate = Number(m.rate) || 0;
//         return { name, qty, rate, total: qty * rate };
//       })
//       .filter((m) => m.name || m.qty || m.rate || m.total);

//     if (medicines.some((m) => !m.name)) {
//       Alert.alert(
//         "Validation",
//         "Medicine Name is required for each filled medicine row.",
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       await patientApi.update(patientId, { ...form, medicines });
//       Alert.alert("Success", "Patient updated successfully.");
//       navigation.navigate("Home", { refresh: Date.now() });
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       {[
//         ["patientName", "Patient Name *"],
//         ["mobile", "Mobile Number"],
//         ["address", "Address"],
//         ["doctorName", "Doctor Name"],
//         ["doctorAddress", "Doctor Address"],
//         ["disease", "Disease"],
//       ].map(([key, label]) => (
//         <View key={key} style={styles.fieldWrap}>
//           <Text style={styles.label}>{label}</Text>
//           <TextInput
//             style={styles.input}
//             value={form[key]}
//             onChangeText={(value) => updateField(key, value)}
//             multiline={key.includes("address")}
//           />
//         </View>
//       ))}

//       <Text style={styles.sectionTitle}>Medicines</Text>
//       {form.medicines.map((medicine) => (
//         <View key={medicine.id} style={styles.medicineCard}>
//           <TextInput
//             style={styles.input}
//             placeholder="Medicine Name"
//             value={medicine.name}
//             onChangeText={(value) => updateMedicine(medicine.id, "name", value)}
//           />

//           <View style={styles.row}>
//             <View style={styles.half}>
//               <Text style={styles.smallLabel}>QTY (strips)</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="0"
//                 keyboardType="numeric"
//                 value={String(medicine.qty ?? "")}
//                 onChangeText={(value) =>
//                   updateMedicine(medicine.id, "qty", value)
//                 }
//               />
//             </View>

//             <View style={styles.half}>
//               <Text style={styles.smallLabel}>Rate (per strip)</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="0"
//                 keyboardType="numeric"
//                 value={String(medicine.rate ?? "")}
//                 onChangeText={(value) =>
//                   updateMedicine(medicine.id, "rate", value)
//                 }
//               />
//             </View>
//           </View>

//           <View style={styles.totalWrap}>
//             <Text style={styles.totalLabel}>Total</Text>
//             <Text style={styles.totalValue}>
//               {getMedicineTotal(medicine.qty, medicine.rate)}
//             </Text>
//           </View>

//           <TouchableOpacity
//             onPress={() => removeMedicineRow(medicine.id)}
//             style={styles.removeIcon}
//             disabled={form.medicines.length === 1}
//           >
//             <Ionicons
//               name="trash"
//               size={20}
//               color={form.medicines.length === 1 ? "#94A3B8" : COLORS.danger}
//             />
//           </TouchableOpacity>
//         </View>
//       ))}

//       <CustomButton
//         title="Add Medicine Row"
//         onPress={addMedicineRow}
//         variant="secondary"
//       />

//       <View style={styles.grandTotalWrap}>
//         <Text style={styles.grandTotalLabel}>Grand Total</Text>
//         <Text style={styles.grandTotalValue}>₹ {grandTotal.toFixed(2)}</Text>
//       </View>

//       <View style={styles.fieldWrap}>
//         <Text style={styles.label}>Notes</Text>
//         <TextInput
//           style={[styles.input, styles.notesInput]}
//           value={form.notes}
//           onChangeText={(value) => updateField("notes", value)}
//           multiline
//         />
//       </View>

//       <CustomButton title="Save" onPress={handleSave} loading={loading} />
//       <CustomButton
//         title="Cancel"
//         onPress={() => navigation.goBack()}
//         variant="secondary"
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.lightGray },
//   content: { padding: 16, paddingBottom: 40 },
//   fieldWrap: { marginBottom: 10 },
//   label: { marginBottom: 6, fontWeight: "600", color: "#334155" },
//   smallLabel: {
//     marginBottom: 6,
//     fontWeight: "600",
//     color: "#475569",
//     fontSize: 12,
//   },
//   input: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: "#D9E2EC",
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     minHeight: 48,
//     fontSize: 15,
//   },
//   sectionTitle: {
//     marginTop: 8,
//     marginBottom: 8,
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.blue,
//   },
//   medicineCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#DCE6F3",
//     marginBottom: 10,
//     gap: 8,
//   },
//   row: { flexDirection: "row", gap: 10 },
//   half: { flex: 1 },
//   totalWrap: {
//     marginTop: 4,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//     backgroundColor: "#F8FAFC",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   totalLabel: { fontWeight: "700", color: "#0F172A" },
//   totalValue: { fontWeight: "700", color: COLORS.blue },
//   removeIcon: { alignSelf: "flex-end", padding: 4 },
//   notesInput: { minHeight: 90, textAlignVertical: "top", paddingVertical: 10 },
//   grandTotalWrap: {
//     backgroundColor: "#E8F5E9",
//     borderRadius: 10,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     marginTop: 12,
//     marginBottom: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   grandTotalLabel: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#0F172A",
//   },

//   grandTotalValue: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: COLORS.blue,
//   },
// });

// export default EditPatientScreen;
