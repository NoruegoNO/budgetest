import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/budgetUtils';
import { categories } from '@/constants/categories';
import { formatShortDate } from '@/utils/dateUtils';
import useLanguageStore from '@/store/languageStore';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onDelete,
}) => {
  const { language } = useLanguageStore();
  const defaultCategory = categories[7]; // Default to "Other"
  const category = categories.find(c => c.id === transaction.categoryId) || defaultCategory;
  
  // Get the category name based on the selected language
  const categoryName = language === 'no' ? category.nameNo : category.name;
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.category}>{categoryName}</Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{formatCurrency(transaction.amount)}</Text>
        <Text style={styles.date}>{formatShortDate(new Date(transaction.date))}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(transaction.id)}
      >
        <Trash2 size={18} color={colors.danger} />
      </TouchableOpacity>
    </View>
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 18,
    color: 'white',
  },
  detailsContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
});

export default TransactionItem;