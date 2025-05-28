import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import useBudgetStore from '@/store/budgetStore';
import useLanguageStore from '@/store/languageStore';
import FixedExpenseItem from '@/components/FixedExpenseItem';
import AddFixedExpenseModal from '@/components/AddFixedExpenseModal';
import { FixedExpense } from '@/types';
import { formatCurrency } from '@/utils/budgetUtils';

export default function FixedExpensesScreen() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<FixedExpense | null>(null);
  
  const {
    fixedExpenses,
    addFixedExpense,
    updateFixedExpense,
    deleteFixedExpense,
  } = useBudgetStore();
  
  const { t, language } = useLanguageStore();
  
  const totalFixedExpenses = fixedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  
  const handleEditExpense = (expense: FixedExpense) => {
    setSelectedExpense(expense);
    setShowAddExpense(true);
  };
  
  const handleAddExpense = (data: Omit<FixedExpense, 'id'>) => {
    if (selectedExpense) {
      updateFixedExpense({
        ...data,
        id: selectedExpense.id,
      });
      setSelectedExpense(null);
    } else {
      addFixedExpense(data);
    }
  };
  
  const handleDeleteExpense = (id: string) => {
    Alert.alert(
      language === 'no' ? 'Slett utgift' : 'Delete Expense',
      t.deleteExpenseConfirm,
      [
        {
          text: t.cancel,
          style: 'cancel',
        },
        {
          text: t.delete,
          onPress: () => deleteFixedExpense(id),
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.fixedExpensesTitle}</Text>
        <Text style={styles.subtitle}>
          {t.total}: {formatCurrency(totalFixedExpenses)}
        </Text>
      </View>
      
      {fixedExpenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t.noFixedExpenses}
          </Text>
        </View>
      ) : (
        <FlatList
          data={fixedExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FixedExpenseItem
              expense={item}
              onDelete={handleDeleteExpense}
              onPress={handleEditExpense}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedExpense(null);
          setShowAddExpense(true);
        }}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
      
      <AddFixedExpenseModal
        visible={showAddExpense}
        onClose={() => {
          setShowAddExpense(false);
          setSelectedExpense(null);
        }}
        onAdd={handleAddExpense}
        expense={selectedExpense || undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
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