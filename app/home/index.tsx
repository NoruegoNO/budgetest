import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Plus, Settings, CreditCard, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import useBudgetStore from '@/store/budgetStore';
import useLanguageStore from '@/store/languageStore';
import BudgetBubble from '@/components/BudgetBubble';
import SpendingChart from '@/components/SpendingChart';
import SalaryBreakdownCard from '@/components/SalaryBreakdownCard';
import AddTransactionModal from '@/components/AddTransactionModal';
import AvailableBalanceCard from '@/components/AvailableBalanceCard';
import {
  calculateDailyBudget,
  calculateTodaySpending,
  calculateSpendingByCategory,
} from '@/utils/budgetUtils';
import { getDaysRemaining, formatDate, getBudgetPeriodDays } from '@/utils/dateUtils';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  
  const {
    currentBalance,
    targetBalance,
    salaryInfo,
    fixedExpenses,
    transactions,
    addTransaction,
    checkAndProcessSalary,
  } = useBudgetStore();
  
  const { t, language } = useLanguageStore();
  
  // Check for salary payment when the component mounts and when it becomes active
  useEffect(() => {
    const checkSalary = () => {
      const salaryProcessed = checkAndProcessSalary();
      
      if (salaryProcessed && salaryInfo) {
        // Show notification that salary was added
        const message = language === 'no'
          ? `Din lønn på ${salaryInfo.amount.toLocaleString('nb-NO')} kr har blitt lagt til i saldoen din.`
          : `Your salary of ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(salaryInfo.amount)} has been added to your balance.`;
        
        const title = language === 'no' ? "Lønn mottatt!" : "Salary Received!";
        const buttonText = language === 'no' ? "Flott!" : "Great!";
        
        Alert.alert(
          title,
          message,
          [{ text: buttonText }]
        );
      }
    };
    
    // Check when component mounts
    checkSalary();
    
    // Set up app state listener for when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkSalary();
      }
    });
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Calculate daily budget
  const daysRemaining = salaryInfo
    ? getDaysRemaining(new Date(salaryInfo.nextDate))
    : 0;
  
  // For bi-weekly with second salary, we need to consider a longer period
  const totalBudgetDays = salaryInfo ? 
    getBudgetPeriodDays(
      salaryInfo.frequency, 
      salaryInfo.frequency === 'biweekly' && !!salaryInfo.secondAmount
    ) : 0;
    
  const dailyBudget = calculateDailyBudget(
    currentBalance,
    targetBalance,
    fixedExpenses,
    daysRemaining,
    salaryInfo?.nextDate,
    salaryInfo?.frequency,
    salaryInfo?.secondAmount,
    salaryInfo?.secondDate
  );
  
  // Calculate today's spending
  const todaySpending = calculateTodaySpending(transactions);
  
  // Calculate spending by category
  const spendingByCategory = calculateSpendingByCategory(transactions);
  const totalSpending = spendingByCategory.reduce(
    (sum, item) => sum + item.total,
    0
  );
  
  const onRefresh = () => {
    setRefreshing(true);
    // Check for salary payment when refreshing
    checkAndProcessSalary();
    // Finish refreshing
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  // Handle adding a transaction
  const handleAddTransaction = (transaction: {
    amount: number;
    description: string;
    categoryId: string;
    date: string;
  }) => {
    addTransaction(transaction);
    // No need to manually update the daily budget as it will be recalculated
    // when the component re-renders due to the store update
  };
  
  // Format the budget period text based on frequency and second salary
  const getBudgetPeriodText = () => {
    if (!salaryInfo) return '';
    
    if (salaryInfo.frequency === 'monthly') {
      return t.language === 'no' ? 'månedlig budsjett' : 'monthly budget';
    } else {
      if (salaryInfo.secondAmount && salaryInfo.secondDate) {
        return t.language === 'no' ? '28-dagers budsjett' : '28-day budget';
      } else {
        return t.language === 'no' ? '14-dagers budsjett' : '14-day budget';
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Next salary date info */}
        {salaryInfo && (
          <View style={styles.salaryDateContainer}>
            <Text style={styles.salaryDateText}>
              {t.nextSalary}: {formatDate(new Date(salaryInfo.nextDate))}
            </Text>
          </View>
        )}
        
        {/* Display second salary date if applicable */}
        {salaryInfo && salaryInfo.frequency === 'biweekly' && salaryInfo.secondDate && (
          <View style={[styles.salaryDateContainer, { marginTop: 8 }]}>
            <Text style={styles.salaryDateText}>
              {t.language === 'no' ? 'Neste lønn' : 'Second Salary'}: {formatDate(new Date(salaryInfo.secondDate))}
            </Text>
          </View>
        )}
        
        {/* Prominently display available balance after fixed expenses */}
        <AvailableBalanceCard
          currentBalance={currentBalance}
          fixedExpenses={fixedExpenses}
          nextSalaryDate={salaryInfo?.nextDate || null}
          secondSalaryAmount={salaryInfo?.secondAmount}
        />
        
        <BudgetBubble
          dailyBudget={dailyBudget}
          currentBalance={currentBalance}
          todaySpending={todaySpending}
          daysRemaining={daysRemaining}
          budgetPeriodText={getBudgetPeriodText()}
        />
        
        <View style={styles.actionsContainer}>
          <Link href="/home/fixed-expenses" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Calendar size={24} color={colors.primary} />
              <Text style={styles.actionText}>{t.fixedExpenses}</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/home/transactions" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <CreditCard size={24} color={colors.primary} />
              <Text style={styles.actionText}>{t.transactions}</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/home/settings" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Settings size={24} color={colors.primary} />
              <Text style={styles.actionText}>{t.settings}</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        {salaryInfo && (
          <SalaryBreakdownCard
            salaryAmount={salaryInfo.amount || 0}
            fixedExpenses={fixedExpenses}
            secondSalaryAmount={salaryInfo.secondAmount}
            frequency={salaryInfo.frequency}
          />
        )}
        
        <SpendingChart
          spendingByCategory={spendingByCategory}
          totalSpending={totalSpending}
        />
      </ScrollView>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddTransaction(true)}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
      
      <AddTransactionModal
        visible={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onAdd={handleAddTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  salaryDateContainer: {
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
  },
  salaryDateText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});