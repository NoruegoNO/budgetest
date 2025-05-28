import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import useBudgetStore from '@/store/budgetStore';
import { colors } from '@/constants/colors';

export default function Index() {
  const [hydrated, setHydrated] = useState(false);
  const isSetupComplete = useBudgetStore((state) => state.isSetupComplete);
  const checkAndProcessSalary = useBudgetStore((state) => state.checkAndProcessSalary);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        if (useBudgetStore.persist.hasHydrated()) {
          clearInterval(interval);
          console.log("Store er hydrated!");
          setHydrated(true);
        }
      } catch (error) {
        console.error("Feil ved hydrering:", error);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hydrated && isSetupComplete) {
      try {
        checkAndProcessSalary();
      } catch (error) {
        console.error("Feil under lønnssjekk:", error);
      }
    }
  }, [hydrated, isSetupComplete]);

  if (!hydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Laster budsjettdata...</Text>
      </View>
    );
  }

  try {
    if (isSetupComplete) {
      return <Redirect href="/home" />;
    } else {
      return <Redirect href="/setup" />;
    }
  } catch (error: any) {
    console.error("Navigasjonsfeil:", error);
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Noe gikk galt.</Text>
        <Text style={styles.loadingText}>Start appen på nytt.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    marginBottom: 8,
  },
});
