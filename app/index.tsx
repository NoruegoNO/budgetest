import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import useBudgetStore from '@/store/budgetStore';
import { colors } from '@/constants/colors';

export default function Index() {
  const isSetupComplete = useBudgetStore((state) => state.isSetupComplete);
  const isHydrated = useBudgetStore.persist.hasHydrated();
  
  // Force a check for salary payment when app starts
  const checkAndProcessSalary = useBudgetStore((state) => state.checkAndProcessSalary);
  
  useEffect(() => {
    if (isHydrated && isSetupComplete) {
      // Check if salary should be processed
      try {
        checkAndProcessSalary();
      } catch (error) {
        console.error("Error checking salary:", error);
      }
    }
  }, [isHydrated, isSetupComplete]);
  
  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your budget data...</Text>
      </View>
    );
  }
  
  // Redirect based on setup status
  try {
    if (isSetupComplete) {
      return <Redirect href="/home" />;
    } else {
      return <Redirect href="/setup" />;
    }
  } catch (error) {
    console.error("Navigation error:", error);
    // Fallback UI in case of navigation error
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Something went wrong.</Text>
        <Text style={styles.loadingText}>Please restart the app.</Text>
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