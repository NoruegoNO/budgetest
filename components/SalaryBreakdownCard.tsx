import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { FixedExpense } from '@/types';
import { formatCurrency } from '@/utils/budgetUtils';
import { formatShortDate } from '@/utils/dateUtils';
import useLanguageStore from '@/store/languageStore';

interface SalaryBreakdownCardProps {
  salaryAmount: number;
  fixedExpenses: FixedExpense[];
  secondSalaryAmount?: number;
  frequency?: 'monthly' | 'biweekly';
}

const SalaryBreakdownCard: React.FC<SalaryBreakdownCardProps> = ({
  salaryAmount,
  fixedExpenses,
  secondSalaryAmount,
  frequency = 'monthly',
}) => {
  const { t } = useLanguageStore();
  
  // Sort fixed expenses by due date if available
  const sortedExpenses = [...fixedExpenses].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Calculate running balance after each expense
  let runningBalance = salaryAmount;
  const expensesWithBalance = sortedExpenses.map(expense => {
    runningBalance -= expense.amount;
    return {
      ...expense,
      remainingBalance: runningBalance
    };
  });

  // Add second salary if applicable
  const totalIncome = salaryAmount + (secondSalaryAmount || 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.salaryBreakdown}</Text>
      
      <View style={styles.salaryContainer}>
        <Text style={styles.salaryLabel}>{t.salaryAmount}:</Text>
        <Text style={styles.salaryAmount}>{formatCurrency(salaryAmount)}</Text>
      </View>
      
      {secondSalaryAmount && secondSalaryAmount > 0 && (
        <View style={styles.salaryContainer}>
          <Text style={styles.salaryLabel}>
            {t.language === 'no' ? 'Neste lønnsbeløp:' : 'Next Salary Amount:'}
          </Text>
          <Text style={styles.salaryAmount}>{formatCurrency(secondSalaryAmount)}</Text>
        </View>
      )}
      
      {secondSalaryAmount && secondSalaryAmount > 0 && (
        <View style={styles.salaryContainer}>
          <Text style={styles.salaryLabel}>
            {t.language === 'no' ? 'Total inntekt:' : 'Total Income:'}
          </Text>
          <Text style={styles.salaryAmount}>{formatCurrency(totalIncome)}</Text>
        </View>
      )}
      
      <View style={styles.divider} />
      
      <ScrollView style={styles.expensesContainer}>
        {expensesWithBalance.length === 0 ? (
          <Text style={styles.emptyText}>{t.noFixedExpensesYet}</Text>
        ) : (
          <>
            {expensesWithBalance.map((expense, index) => (
              <View key={expense.id} style={styles.expenseItem}>
                <View style={styles.expenseHeader}>
                  <Text style={styles.expenseName}>{expense.name}</Text>
                  {expense.dueDate && (
                    <Text style={styles.expenseDate}>
                      {formatShortDate(new Date(expense.dueDate))}
                    </Text>
                  )}
                </View>
                
                <View style={styles.expenseDetails}>
                  <Text style={styles.expenseAmount}>
                    - {formatCurrency(expense.amount)}
                  </Text>
                  <Text style={[
                    styles.remainingBalance,
                    expense.remainingBalance < 0 && styles.negativeBalance
                  ]}>
                    {formatCurrency(expense.remainingBalance)}
                  </Text>
                </View>
                
                {index < expensesWithBalance.length - 1 && (
                  <View style={styles.itemDivider} />
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
      
      <View style={styles.divider} />
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryLabel}>{t.remainingAfterExpenses}</Text>
        <Text style={[
          styles.summaryAmount,
          runningBalance < 0 && styles.negativeBalance
        ]}>
          {formatCurrency(runningBalance)}
        </Text>
      </View>
      
      {frequency === 'biweekly' && secondSalaryAmount && (
        <Text style={styles.periodNote}>
          {t.language === 'no' 
            ? 'Merk: Dette viser kun fordelingen av første lønning'
            : 'Note: This only shows the breakdown of your first salary'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  salaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  salaryLabel: {
    fontSize: 16,
    color: colors.text,
  },
  salaryAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  expensesContainer: {
    maxHeight: 200,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 20,
  },
  expenseItem: {
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  expenseDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  expenseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseAmount: {
    fontSize: 16,
    color: colors.danger,
  },
  remainingBalance: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  negativeBalance: {
    color: colors.danger,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
  },
  periodNote: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SalaryBreakdownCard;