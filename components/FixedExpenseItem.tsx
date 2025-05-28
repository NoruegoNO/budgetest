import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Trash2, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { FixedExpense } from '@/types';
import { formatCurrency } from '@/utils/budgetUtils';
import { formatShortDate } from '@/utils/dateUtils';

interface FixedExpenseItemProps {
  expense: FixedExpense;
  onDelete: (id: string) => void;
  onPress: (expense: FixedExpense) => void;
}

const FixedExpenseItem: React.FC<FixedExpenseItemProps> = ({
  expense,
  onDelete,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(expense)}
      activeOpacity={0.7}
    >
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{expense.name}</Text>
        {expense.dueDate && (
          <View style={styles.dueDateContainer}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={styles.dueDate}>
              Due: {formatShortDate(new Date(expense.dueDate))}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(expense.id)}
      >
        <Trash2 size={18} color={colors.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
  deleteButton: {
    padding: 4,
  },
});

export default FixedExpenseItem;