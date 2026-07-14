import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../utils/constants';

const PatientCard = ({ patient, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{patient.patientName}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{patient.mobile || 'No mobile'}</Text>
        <Text style={styles.meta}>{patient.disease || 'No disease'}</Text>
      </View>
      <Text style={styles.updated}>Updated: {new Date(patient.updatedAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E1E8F0',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 10,
  },
  meta: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
  updated: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 12,
  },
});

export default PatientCard;
