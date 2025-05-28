import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BudgetState, FixedExpense, Transaction } from '@/types';
import { calculateNextSalaryDate } from '@/utils/dateUtils';

// Create the budget store with persistence
const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      // Initial state
      isSetupComplete: false,
      currentBalance: 0,
      targetBalance: 0,
      salaryInfo: null,
      fixedExpenses: [],
      transactions: [],
      lastSalaryProcessed: null,

      // Actions
      completeSetup: (
        frequency,
        initialDate,
        currentBalance,
        targetBalance,
        salaryAmount,
        secondSalaryAmount
      ) => {
        const nextDate = calculateNextSalaryDate(initialDate, frequency);

        set({
          isSetupComplete: true,
          currentBalance,
          targetBalance,
          salaryInfo: {
            frequency,
            initialDate,
            salaryAmount,
            secondSalaryAmount,
            nextSalaryDate: nextDate,
          },
        });
      },

      addFixedExpense: (expense: FixedExpense) => {
        set((state) => ({
          fixedExpenses: [...state.fixedExpenses, expense],
        }));
      },

      removeFixedExpense: (name: string) => {
        set((state) => ({
          fixedExpenses: state.fixedExpenses.filter((exp) => exp.name !== name),
        }));
      },

      addTransaction: (transaction: Transaction) => {
        set((state) => ({
          transactions: [...state.transactions, transaction],
          currentBalance: state.currentBalance - transaction.amount,
        }));
      },

      checkAndProcessSalary: () => {
        const { salaryInfo, lastSalaryProcessed, currentBalance, targetBalance } = get();
        if (!salaryInfo) return;

        const today = new Date().toDateString();
        if (lastSalaryProcessed === today) return;

        const newBalance = currentBalance + salaryInfo.salaryAmount;
        set({
          currentBalance: newBalance,
          lastSalaryProcessed: today,
        });
      },

      reset: () => {
        set({
          isSetupComplete: false,
          currentBalance: 0,
          targetBalance: 0,
