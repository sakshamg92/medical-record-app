import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { patientApi } from '../services/api';
import { COLORS } from '../utils/constants';

const PatientDetailsScreen = ({ route, navigation }) => {
  const { patientId } = route.params;
  const [patient, setPatient] = useState(null);

  const loadPatient = useCallback(async () => {
    try {
      const response = await patientApi.getById(patientId);
      setPatient(response.data);
    } catch (error) {
      Alert.alert('Error', error.message);
      navigation.goBack();
    }
  }, [navigation, patientId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadPatient);
    return unsubscribe;
  }, [loadPatient, navigation]);

  const handleDelete = () => {
    Alert.alert('Delete Patient', 'Are you sure you want to delete this record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await patientApi.remove(patientId);
            Alert.alert('Deleted', 'Patient deleted successfully.');
            navigation.popToTop();
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  if (!patient) {
    return (
      <View style={styles.loadingWrap}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const details = [
    ['Patient Name', patient.patientName],
    ['Mobile', patient.mobile],
    ['Address', patient.address],
    ['Doctor Name', patient.doctorName],
    ['Doctor Address', patient.doctorAddress],
    ['Disease', patient.disease],
    ['Notes', patient.notes],
    ['Created At', new Date(patient.createdAt).toLocaleString()],
    ['Updated At', new Date(patient.updatedAt).toLocaleString()],
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {details.map(([label, value]) => (
        <View key={label} style={styles.fieldWrap}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value || '-'}</Text>
        </View>
      ))}

      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Medicines</Text>
        {(patient.medicines || []).length ? (
          patient.medicines.map((medicine, index) => (
            <Text key={`${medicine.name}-${index}`} style={styles.value}>
              {index + 1}. {medicine.name || '-'} ({medicine.dose || '-'})
            </Text>
          ))
        ) : (
          <Text style={styles.value}>-</Text>
        )}
      </View>

      <CustomButton
        title="Edit"
        onPress={() => navigation.navigate('EditPatient', { patientId: patient._id })}
      />
      <CustomButton title="Delete" onPress={handleDelete} variant="secondary" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  fieldWrap: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE6F2',
    padding: 12,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.blue,
    marginBottom: 4,
  },
  value: {
    color: '#334155',
    fontSize: 15,
  },
});

export default PatientDetailsScreen;
