import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../utils/constants";

const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search by name or mobile number",
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Ionicons
        name="search"
        size={20}
        color={focused ? COLORS.primary : COLORS.textSecondary}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value?.length > 0 ? (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    minHeight: 52,
    gap: SPACING.sm,
  },
  containerFocused: {
    borderColor: COLORS.primary,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    paddingVertical: 0,
  },
});

export default SearchBar;
// import React from 'react';
// import { StyleSheet, TextInput, View } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { COLORS } from '../utils/constants';

// const SearchBar = ({ value, onChangeText, placeholder = 'Search patient by name or mobile' }) => {
//   return (
//     <View style={styles.container}>
//       <Ionicons name="search" size={22} color={COLORS.blue} />
//       <TextInput
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         style={styles.input}
//         autoCapitalize="none"
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#D6DFEA',
//     paddingHorizontal: 14,
//     minHeight: 52,
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//     color: COLORS.text,
//   },
// });

// export default SearchBar;
