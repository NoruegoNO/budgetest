import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import useBudgetStore from "@/store/budgetStore";
import useLanguageStore from "@/store/languageStore";
import { View, Text, ActivityIndicator } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const [isHydrated, setIsHydrated] = useState(false);
  const [hydrationError, setHydrationError] = useState<string | null>(null);
  
  // Check if stores are hydrated
  useEffect(() => {
    // Wrap in try-catch to prevent crashes
    try {
      // Set up listeners for hydration state
      const unsubBudget = useBudgetStore.persist.onHydrate(() => {
        console.log('Budget store hydrating...');
      });
      
      const unsubBudgetFinish = useBudgetStore.persist.onFinishHydration(() => {
        console.log('Budget store hydrated');
        setIsHydrated(true);
      });
      
      const unsubLanguage = useLanguageStore.persist.onHydrate(() => {
        console.log('Language store hydrating...');
      });
      
      const unsubLanguageFinish = useLanguageStore.persist.onFinishHydration(() => {
        console.log('Language store hydrated');
      });
      
      // Initial check
      const checkHydration = () => {
        try {
          if (useBudgetStore.persist.hasHydrated() && useLanguageStore.persist.hasHydrated()) {
            setIsHydrated(true);
          } else {
            // If not hydrated yet, set a timeout to check again
            setTimeout(checkHydration, 100);
          }
        } catch (err) {
          console.error("Error checking hydration:", err);
          setHydrationError("Failed to load app data. Please restart the app.");
          // Force proceed after error
          setIsHydrated(true);
        }
      };
      
      checkHydration();
      
      return () => {
        try {
          unsubBudget();
          unsubBudgetFinish();
          unsubLanguage();
          unsubLanguageFinish();
        } catch (err) {
          console.error("Error cleaning up hydration listeners:", err);
        }
      };
    } catch (err) {
      console.error("Critical error during hydration setup:", err);
      setHydrationError("Failed to initialize app. Please restart the app.");
      // Force proceed after error
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded && isHydrated) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [loaded, isHydrated]);

  if (!loaded || !isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading your budget data...</Text>
      </View>
    );
  }

  if (hydrationError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.danger, marginBottom: 20, textAlign: 'center', paddingHorizontal: 20 }}>
          {hydrationError}
        </Text>
        <Text style={{ color: colors.text, textAlign: 'center', paddingHorizontal: 20 }}>
          If this problem persists, try clearing the app data or reinstalling the app.
        </Text>
      </View>
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
          headerTintColor: 'white',
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="setup/index"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="home/index"
          options={{
            title: 'Budget',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="home/fixed-expenses"
          options={{
            title: 'Fixed Expenses',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="home/transactions"
          options={{
            title: 'Transactions',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="home/settings"
          options={{
            title: 'Settings',
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}