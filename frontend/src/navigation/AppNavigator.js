import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddPatientScreen from '../screens/AddPatientScreen';
import PatientDetailsScreen from '../screens/PatientDetailsScreen';
import EditPatientScreen from '../screens/EditPatientScreen';
import { COLORS } from '../utils/constants';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
      setLoading(false);
    };

    checkToken();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.blue },
          headerTintColor: COLORS.white,
          contentStyle: { backgroundColor: COLORS.lightGray },
        }}
      >
        {!token ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} onLogin={setToken} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Patients',
                headerRight: () => null,
              }}
            />
            <Stack.Screen name="AddPatient" component={AddPatientScreen} options={{ title: 'Add Patient' }} />
            <Stack.Screen
              name="PatientDetails"
              component={PatientDetailsScreen}
              options={{ title: 'Patient Details' }}
            />
            <Stack.Screen name="EditPatient" component={EditPatientScreen} options={{ title: 'Edit Patient' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
