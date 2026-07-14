import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { patientApi } from '../services/api';
import { COLORS } from '../utils/constants';

const defaultState = {
  patientName: '',
  mobile: '',
  address: '',
  doctorName: '',
  doctorAddress: '',
  disease: '',
  medicines: [{ name: '', dose: '' }],
  notes: '',
};

const AddPatientScreen = ({ navigation }) => {
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateMedicine = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.map((medicine, i) =>
        i === index ? { ...medicine, [key]: value } : medicine
      ),
    }));
  };

  const addMedicineRow = () => {
    setForm((prev) => ({ ...prev, medicines: [...prev.medicines, { name: '', dose: '' }] }));
  };

  const removeMedicineRow = (index) => {
    setForm((prev) => ({
      ...prev,
      medicines:
        prev.medicines.length === 1
          ? prev.medicines
          : prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!form.patientName.trim()) {
      Alert.alert('Validation', 'Patient Name is required.');
      return;
    }

    setLoading(true);
    try {
      await patientApi.create(form);
      Alert.alert('Success', 'Patient added successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {[
        ['patientName', 'Patient Name *'],
        ['mobile', 'Mobile Number'],
        ['address', 'Address'],
        ['doctorName', 'Doctor Name'],
        ['doctorAddress', 'Doctor Address'],
        ['disease', 'Disease'],
      ].map(([key, label]) => (
        <View key={key} style={styles.fieldWrap}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            value={form[key]}
            onChangeText={(value) => updateField(key, value)}
            multiline={key.includes('address')}
          />
        </View>
      ))}

      <Text style={styles.sectionTitle}>Medicines</Text>
      {form.medicines.map((medicine, index) => (
        <View key={`${index}-${medicine.name}`} style={styles.medicineCard}>
          <TextInput
            style={styles.input}
            placeholder="Medicine Name"
            value={medicine.name}
            onChangeText={(value) => updateMedicine(index, 'name', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Dose (e.g. 1-0-1)"
            value={medicine.dose}
            onChangeText={(value) => updateMedicine(index, 'dose', value)}
          />
          <TouchableOpacity
            onPress={() => removeMedicineRow(index)}
            style={styles.removeIcon}
            disabled={form.medicines.length === 1}
          >
            <Ionicons
              name="trash"
              size={20}
              color={form.medicines.length === 1 ? '#94A3B8' : COLORS.danger}
            />
          </TouchableOpacity>
        </View>
      ))}

      <CustomButton title="Add Medicine Row" onPress={addMedicineRow} variant="secondary" />

      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={form.notes}
          onChangeText={(value) => updateField('notes', value)}
          multiline
        />
      </View>

      <CustomButton title="Save" onPress={handleSave} loading={loading} />
      <CustomButton title="Cancel" onPress={() => navigation.goBack()} variant="secondary" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  fieldWrap: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 48,
    fontSize: 15,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.blue,
  },
  medicineCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DCE6F3',
    marginBottom: 10,
    gap: 8,
  },
  removeIcon: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
});

export default AddPatientScreen;
