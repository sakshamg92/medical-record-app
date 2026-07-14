import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { authApi } from '../services/api';
import { COLORS } from '../utils/constants';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Validation', 'Username and password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login(username.trim(), password);
      await AsyncStorage.setItem('token', response.data.token);
      onLogin(response.data.token);
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Medical Record App</Text>
      <Text style={styles.subText}>Staff login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <CustomButton title="Login" onPress={handleLogin} loading={loading} style={styles.loginBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.blue,
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 24,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 10,
    minHeight: 50,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  loginBtn: {
    marginTop: 8,
    minHeight: 54,
  },
});

export default LoginScreen;
