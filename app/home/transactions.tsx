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
import TransactionItem from '@/components/TransactionItem';
import AddTransactionModal from '@/components/AddTransactionModal';
import { formatCurrency } from '@/utils/budgetUtils';

export default function TransactionsScreen() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  
  const { transactions, addTransaction, deleteTransaction } = useBudgetStore();
  const { t, language } = useLanguageStore();
  
  const totalTransactions = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  
  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      language === 'no' ? 'Slett transaksjon' : 'Delete Transaction',
      t.deleteTransactionConfirm,
      [
        {
          text: t.cancel,
          style: 'cancel',
        },
        {
          text: t.delete,
          onPress: () => deleteTransaction(id),
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.transactionsTitle}</Text>
        <Text style={styles.subtitle}>
          {t.total}: {formatCurrency(totalTransactions)}
        </Text>
      </View>
      
      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t.noTransactions}
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onDelete={handleDeleteTransaction}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddTransaction(true)}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
      
      <AddTransactionModal
        visible={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onAdd={addTransaction}
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