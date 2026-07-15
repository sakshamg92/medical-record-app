import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import CustomButton from "../components/CustomButton";
import PatientCard from "../components/PatientCard";
import { patientApi } from "../services/api";
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from "../utils/constants";

const HomeScreen = ({ navigation, route }) => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const requestIdRef = useRef(0);
  const debounceRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const safeSetPatients = useCallback((reqId, list) => {
    // prevent stale old request from overriding latest state
    if (reqId !== requestIdRef.current) return;
    setPatients(Array.isArray(list) ? list : []);
  }, []);

  const finalizeLoading = useCallback((reqId) => {
    if (reqId !== requestIdRef.current) return;
    setLoading(false);
    setRefreshing(false);
  }, []);

  const fetchAll = useCallback(async () => {
    const reqId = ++requestIdRef.current;
    try {
      const response = await patientApi.getAll();
      safeSetPatients(reqId, response.data);
    } catch {
      safeSetPatients(reqId, []);
    } finally {
      finalizeLoading(reqId);
    }
  }, [finalizeLoading, safeSetPatients]);

  const runSearch = useCallback(
    async (text) => {
      const reqId = ++requestIdRef.current;
      try {
        const response = await patientApi.search(text.trim());
        safeSetPatients(reqId, response.data);
      } catch {
        safeSetPatients(reqId, []);
      } finally {
        finalizeLoading(reqId);
      }
    },
    [finalizeLoading, safeSetPatients],
  );

  // first load
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // always refresh when Home is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      if (query.trim()) {
        runSearch(query);
      } else {
        fetchAll();
      }
    }, [fetchAll, query, runSearch]),
  );

  // explicit refresh param from Add/Edit/Delete flows
  useEffect(() => {
    if (!route?.params?.refresh) return;
    setLoading(true);

    if (query.trim()) {
      runSearch(query);
    } else {
      fetchAll();
    }

    // clear param to avoid repeated refresh loops
    navigation.setParams({ refresh: undefined });
  }, [route?.params?.refresh, navigation, fetchAll, runSearch, query]);

  // refresh when app comes foreground (optional stability)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      const wasBackground =
        appStateRef.current === "inactive" ||
        appStateRef.current === "background";
      if (wasBackground && nextState === "active") {
        if (query.trim()) runSearch(query);
        else fetchAll();
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [fetchAll, runSearch, query]);

  // debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      if (!query.trim()) fetchAll();
      else runSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchAll, runSearch]);

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />

      <View style={styles.statusRow}>
        <View style={styles.countPill}>
          <Text style={styles.countText}>
            {patients.length} {patients.length === 1 ? "patient" : "patients"}
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                if (query.trim()) runSearch(query);
                else fetchAll();
              }}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          renderItem={({ item }) => (
            <PatientCard
              patient={item}
              onPress={() =>
                navigation.navigate("PatientDetails", {
                  patientId: item._id,
                  onDeleted: (deletedId) => {
                    setPatients((prev) =>
                      prev.filter((p) => p._id !== deletedId),
                    );
                  },
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="people-outline"
                size={40}
                color={COLORS.textMuted}
              />
              <Text style={styles.emptyTitle}>No patients found</Text>
              <Text style={styles.emptySubtitle}>
                {query.trim()
                  ? "Try a different name or mobile number."
                  : "Tap + Add Patient to create your first record."}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <CustomButton
        title="Add Patient"
        icon="add"
        variant="fab"
        onPress={() => navigation.navigate("AddPatient")}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  statusRow: {
    flexDirection: "row",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  countPill: {
    backgroundColor: COLORS.primaryTint,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  countText: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: "700",
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.sectionTitle,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
  },
});

export default HomeScreen;
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   AppState,
//   FlatList,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { useFocusEffect } from "@react-navigation/native";
// import SearchBar from "../components/SearchBar";
// import CustomButton from "../components/CustomButton";
// import PatientCard from "../components/PatientCard";
// import { patientApi } from "../services/api";
// import { COLORS } from "../utils/constants";

// const HomeScreen = ({ navigation, route }) => {
//   const [query, setQuery] = useState("");
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const requestIdRef = useRef(0);
//   const debounceRef = useRef(null);
//   const appStateRef = useRef(AppState.currentState);

//   const safeSetPatients = useCallback((reqId, list) => {
//     // prevent stale old request from overriding latest state
//     if (reqId !== requestIdRef.current) return;
//     setPatients(Array.isArray(list) ? list : []);
//   }, []);

//   const finalizeLoading = useCallback((reqId) => {
//     if (reqId !== requestIdRef.current) return;
//     setLoading(false);
//     setRefreshing(false);
//   }, []);

//   const fetchAll = useCallback(async () => {
//     const reqId = ++requestIdRef.current;
//     try {
//       const response = await patientApi.getAll();
//       safeSetPatients(reqId, response.data);
//     } catch {
//       safeSetPatients(reqId, []);
//     } finally {
//       finalizeLoading(reqId);
//     }
//   }, [finalizeLoading, safeSetPatients]);

//   const runSearch = useCallback(
//     async (text) => {
//       const reqId = ++requestIdRef.current;
//       try {
//         const response = await patientApi.search(text.trim());
//         safeSetPatients(reqId, response.data);
//       } catch {
//         safeSetPatients(reqId, []);
//       } finally {
//         finalizeLoading(reqId);
//       }
//     },
//     [finalizeLoading, safeSetPatients],
//   );

//   // first load
//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   // always refresh when Home is focused
//   useFocusEffect(
//     useCallback(() => {
//       setLoading(true);
//       if (query.trim()) {
//         runSearch(query);
//       } else {
//         fetchAll();
//       }
//     }, [fetchAll, query, runSearch]),
//   );

//   // explicit refresh param from Add/Edit/Delete flows
//   useEffect(() => {
//     if (!route?.params?.refresh) return;
//     setLoading(true);

//     if (query.trim()) {
//       runSearch(query);
//     } else {
//       fetchAll();
//     }

//     // clear param to avoid repeated refresh loops
//     navigation.setParams({ refresh: undefined });
//   }, [route?.params?.refresh, navigation, fetchAll, runSearch, query]);

//   // refresh when app comes foreground (optional stability)
//   useEffect(() => {
//     const sub = AppState.addEventListener("change", (nextState) => {
//       const wasBackground =
//         appStateRef.current === "inactive" ||
//         appStateRef.current === "background";
//       if (wasBackground && nextState === "active") {
//         if (query.trim()) runSearch(query);
//         else fetchAll();
//       }
//       appStateRef.current = nextState;
//     });
//     return () => sub.remove();
//   }, [fetchAll, runSearch, query]);

//   // debounced search
//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);

//     debounceRef.current = setTimeout(() => {
//       setLoading(true);
//       if (!query.trim()) fetchAll();
//       else runSearch(query);
//     }, 300);

//     return () => {
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//     };
//   }, [query, fetchAll, runSearch]);

//   return (
//     <View style={styles.container}>
//       <SearchBar value={query} onChangeText={setQuery} />
//       <CustomButton
//         title="Add Patient"
//         onPress={() => navigation.navigate("AddPatient")}
//         style={styles.addButton}
//       />
//       <Text style={styles.count}>Total Results: {patients.length}</Text>

//       {loading ? (
//         <ActivityIndicator
//           size="large"
//           color={COLORS.blue}
//           style={styles.loader}
//         />
//       ) : (
//         <FlatList
//           data={patients}
//           keyExtractor={(item) => item._id}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={() => {
//                 setRefreshing(true);
//                 if (query.trim()) runSearch(query);
//                 else fetchAll();
//               }}
//             />
//           }
//           renderItem={({ item }) => (
//             <PatientCard
//               patient={item}
//               // onPress={() =>
//               //   navigation.navigate("PatientDetails", { patientId: item._id })
//               // }
//               onPress={() =>
//                 navigation.navigate("PatientDetails", {
//                   patientId: item._id,
//                   onDeleted: (deletedId) => {
//                     setPatients((prev) =>
//                       prev.filter((p) => p._id !== deletedId),
//                     );
//                   },
//                 })
//               }
//             />
//           )}
//           ListEmptyComponent={
//             <Text style={styles.empty}>No patients found.</Text>
//           }
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: COLORS.lightGray,
//   },
//   addButton: {
//     minHeight: 52,
//     marginTop: 12,
//   },
//   count: {
//     marginVertical: 10,
//     color: "#475569",
//     fontWeight: "600",
//   },
//   loader: {
//     marginTop: 30,
//   },
//   listContent: {
//     paddingBottom: 24,
//   },
//   empty: {
//     textAlign: "center",
//     marginTop: 28,
//     color: "#6B7280",
//   },
// });

// export default HomeScreen;
