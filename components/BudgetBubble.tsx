import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/budgetUtils';
import useLanguageStore from '@/store/languageStore';

interface BudgetBubbleProps {
  dailyBudget: number;
  currentBalance: number;
  todaySpending: number;
  daysRemaining: number;
  budgetPeriodText?: string;
}

const BudgetBubble: React.FC<BudgetBubbleProps> = ({
  dailyBudget,
  currentBalance,
  todaySpending,
  daysRemaining,
  budgetPeriodText,
}) => {
  const { t } = useLanguageStore();
  
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.bubbleContent}>
          <Text style={styles.label}>{t.dailyBudget}</Text>
          <Text style={styles.amount}>{formatCurrency(dailyBudget)}</Text>
          <Text style={styles.daysRemaining}>
            {daysRemaining} {t.daysUntilSalary}{daysRemaining !== 1 ? 'er' : ''}
          </Text>
          {budgetPeriodText && (
            <Text style={styles.budgetPeriod}>
              {budgetPeriodText}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{t.todaySpending}</Text>
          <Text style={[styles.statValue, todaySpending > 0 && styles.negativeAmount]}>
            {formatCurrency(todaySpending)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  bubble: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    elevation: 8, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bubbleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 8,
  },
  amount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  daysRemaining: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  budgetPeriod: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    width: '90%',
    elevation: 2, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  negativeAmount: {
    color: colors.danger,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
});

export default BudgetBubble;