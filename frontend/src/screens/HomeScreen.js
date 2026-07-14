import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import CustomButton from '../components/CustomButton';
import PatientCard from '../components/PatientCard';
import { patientApi } from '../services/api';
import { COLORS } from '../utils/constants';

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const response = await patientApi.getAll();
      setPatients(response.data || []);
    } catch {
      setPatients([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        fetchAll();
        return;
      }

      try {
        const response = await patientApi.search(query.trim());
        setPatients(response.data || []);
      } catch {
        setPatients([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchAll, query]);

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />
      <CustomButton
        title="Add Patient"
        onPress={() => navigation.navigate('AddPatient')}
        style={styles.addButton}
      />
      <Text style={styles.count}>Total Results: {patients.length}</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.blue} style={styles.loader} />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchAll();
              }}
            />
          }
          renderItem={({ item }) => (
            <PatientCard
              patient={item}
              onPress={() => navigation.navigate('PatientDetails', { patientId: item._id })}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No patients found.</Text>}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.lightGray,
  },
  addButton: {
    minHeight: 52,
    marginTop: 12,
  },
  count: {
    marginVertical: 10,
    color: '#475569',
    fontWeight: '600',
  },
  loader: {
    marginTop: 30,
  },
  listContent: {
    paddingBottom: 24,
  },
  empty: {
    textAlign: 'center',
    marginTop: 28,
    color: '#6B7280',
  },
});

export default HomeScreen;
