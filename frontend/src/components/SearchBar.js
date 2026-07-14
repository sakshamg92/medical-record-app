import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

const SearchBar = ({ value, onChangeText, placeholder = 'Search patient by name or mobile' }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={22} color={COLORS.blue} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6DFEA',
    paddingHorizontal: 14,
    minHeight: 52,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
  },
});

export default SearchBar;
