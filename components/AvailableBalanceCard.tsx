import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/budgetUtils';
import { FixedExpense } from '@/types';
import useLanguageStore from '@/store/languageStore';

interface AvailableBalanceCardProps {
  currentBalance: number;
  fixedExpenses: FixedExpense[];
  nextSalaryDate: string | null; // ISO date string of next salary
  secondSalaryAmount?: number; // Amount of second salary for bi-weekly
}

const AvailableBalanceCard: React.FC<AvailableBalanceCardProps> = ({
  currentBalance,
  fixedExpenses,
  nextSalaryDate,
  secondSalaryAmount,
}) => {
  const { t } = useLanguageStore();
  
  // Filter expenses that are due before the next salary date
  const relevantExpenses = nextSalaryDate 
    ? fixedExpenses.filter(expense => {
        // If expense has no due date, include it (assume it's due soon)
        if (!expense.dueDate) return true;
        
        // Compare dates to see if expense is due before next salary
        const expenseDate = new Date(expense.dueDate);
        const salaryDate = new Date(nextSalaryDate);
        
        // Only include expenses due BEFORE the next salary date
        return expenseDate < salaryDate;
      })
    : fixedExpenses; // If no next salary date, include all expenses
  
  // Calculate total fixed expenses that are due before next salary
  const totalFixedExpenses = relevantExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  
  // Calculate available balance after fixed expenses, including second salary if provided
  const additionalIncome = secondSalaryAmount || 0;
  const availableBalance = currentBalance - totalFixedExpenses + additionalIncome;
  
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{t.availableAfterExpenses}</Text>
        <Text style={[
          styles.amount,
          availableBalance < 0 && styles.negativeAmount
        ]}>
          {formatCurrency(availableBalance)}
        </Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.currentBalance}:</Text>
            <Text style={styles.detailValue}>{formatCurrency(currentBalance)}</Text>
          </View>
          
          {secondSalaryAmount && secondSalaryAmount > 0 && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                {t.language === 'no' ? 'Neste lønn:' : 'Next Salary:'}
              </Text>
              <Text style={styles.incomeValue}>+ {formatCurrency(secondSalaryAmount)}</Text>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.fixedExpenses}:</Text>
            <Text style={styles.expenseValue}>- {formatCurrency(totalFixedExpenses)}</Text>
          </View>
          
          {relevantExpenses.length > 0 && (
            <View style={styles.expensesList}>
              {relevantExpenses.map(expense => (
                <View key={expense.id} style={styles.expenseItem}>
                  <Text style={styles.expenseName}>{expense.name}</Text>
                  <Text style={styles.expenseItemValue}>- {formatCurrency(expense.amount)}</Text>
                </View>
              ))}
            </View>
          )}
          
          {relevantExpenses.length < fixedExpenses.length && (
            <Text style={styles.noteText}>
              * {t.language === 'no' ? 'Viser kun utgifter som forfaller før neste lønning' : 'Only showing expenses due before your next salary'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  contentContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    elevation: 2, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.success,
    textAlign: 'center',
    marginBottom: 16,
  },
  negativeAmount: {
    color: colors.danger,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  expenseValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.danger,
  },
  incomeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
  },
  expensesList: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  expenseName: {
    fontSize: 13,
    color: colors.text,
  },
  expenseItemValue: {
    fontSize: 13,
    color: colors.danger,
  },
  noteText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default AvailableBalanceCard;