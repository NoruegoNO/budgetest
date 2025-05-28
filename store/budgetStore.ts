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
      
      // Complete the initial setup
      completeSetup: (frequency, initialDate, currentBalance, targetBalance, salaryAmount, secondSalaryAmount) => {
        const nextDate = calculateNextSalaryDate(initialDate, frequency);
        
        // Include the salary amount in the initial current balance
        // This way the user starts with their salary already included
        const initialBalanceWithSalary = currentBalance + salaryAmount;
        
        // For bi-weekly, calculate the second salary date (14 days after the first)
        let secondDate: string | undefined;
        if (frequency === 'biweekly' && secondSalaryAmount) {
          const secondSalaryDate = new Date(nextDate);
          secondSalaryDate.setDate(secondSalaryDate.getDate() + 14);
          secondDate = secondSalaryDate.toISOString();
        }
        
        set({
          isSetupComplete: true,
          currentBalance: initialBalanceWithSalary, // Add salary to initial balance
          targetBalance,
          salaryInfo: {
            frequency,
            initialDate: initialDate.toISOString(),
            nextDate: nextDate.toISOString(),
            amount: salaryAmount,
            secondAmount: secondSalaryAmount,
            secondDate
          },
          lastSalaryProcessed: initialDate.toISOString(), // Mark initial date as processed
        });
      },
      
      // Update current balance
      updateBalance: (newBalance) => {
        set({ currentBalance: newBalance });
      },
      
      // Update target balance
      updateTargetBalance: (newTargetBalance) => {
        set({ targetBalance: newTargetBalance });
      },
      
      // Update salary amount
      updateSalaryAmount: (newSalaryAmount, secondSalaryAmount) => {
        set((state) => ({
          salaryInfo: state.salaryInfo 
            ? { 
                ...state.salaryInfo, 
                amount: newSalaryAmount,
                secondAmount: state.salaryInfo.frequency === 'biweekly' ? 
                  (secondSalaryAmount !== undefined ? secondSalaryAmount : state.salaryInfo.secondAmount) : 
                  undefined
              }
            : null
        }));
      },
      
      // Add a new fixed expense
      addFixedExpense: (expense) => {
        const id = Date.now().toString();
        const newExpense: FixedExpense = { ...expense, id };
        
        set((state) => ({
          fixedExpenses: [...state.fixedExpenses, newExpense],
        }));
      },
      
      // Update an existing fixed expense
      updateFixedExpense: (updatedExpense) => {
        set((state) => ({
          fixedExpenses: state.fixedExpenses.map((expense) =>
            expense.id === updatedExpense.id ? updatedExpense : expense
          ),
        }));
      },
      
      // Delete a fixed expense
      deleteFixedExpense: (id) => {
        set((state) => ({
          fixedExpenses: state.fixedExpenses.filter((expense) => expense.id !== id),
        }));
      },
      
      // Add a new transaction
      addTransaction: (transaction) => {
        const id = Date.now().toString();
        const newTransaction: Transaction = { ...transaction, id };
        
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          // Deduct the transaction amount from the current balance
          currentBalance: state.currentBalance - transaction.amount,
        }));
      },
      
      // Delete a transaction
      deleteTransaction: (id) => {
        const transaction = get().transactions.find((t) => t.id === id);
        
        if (transaction) {
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
            // Add the transaction amount back to the current balance
            currentBalance: state.currentBalance + transaction.amount,
          }));
        }
      },
      
      // Check and process salary payment if needed
      checkAndProcessSalary: () => {
        const state = get();
        const { salaryInfo, lastSalaryProcessed } = state;
        
        if (!salaryInfo) return;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const nextSalaryDate = new Date(salaryInfo.nextDate);
        nextSalaryDate.setHours(0, 0, 0, 0);
        
        // If today is the salary date or past it, and we haven't processed it yet
        if (
          (today.getTime() >= nextSalaryDate.getTime()) && 
          (!lastSalaryProcessed || new Date(lastSalaryProcessed).getTime() < nextSalaryDate.getTime())
        ) {
          // Calculate the new next salary date
          const newNextDate = calculateNextSalaryDate(nextSalaryDate, salaryInfo.frequency);
          
          // For bi-weekly, handle the second salary date
          let newSecondDate: string | undefined = undefined;
          if (salaryInfo.frequency === 'biweekly' && salaryInfo.secondDate) {
            // The current second date becomes the next date
            newSecondDate = newNextDate.toISOString();
            
            // And we calculate a new second date (14 days after the new next date)
            const secondSalaryDate = new Date(newNextDate);
            secondSalaryDate.setDate(secondSalaryDate.getDate() + 14);
            newSecondDate = secondSalaryDate.toISOString();
          }
          
          // Add salary to current balance and update next salary date
          set((state) => ({
            currentBalance: state.currentBalance + salaryInfo.amount,
            salaryInfo: {
              ...state.salaryInfo!,
              nextDate: newNextDate.toISOString(),
              secondDate: newSecondDate || state.salaryInfo?.secondDate
            },
            lastSalaryProcessed: nextSalaryDate.toISOString(),
          }));
          
          // Return true to indicate salary was processed
          return true;
        }
        
        // Check if we need to process the second salary (for bi-weekly)
        if (salaryInfo.frequency === 'biweekly' && salaryInfo.secondDate && salaryInfo.secondAmount) {
          const secondSalaryDate = new Date(salaryInfo.secondDate);
          secondSalaryDate.setHours(0, 0, 0, 0);
          
          // If today is the second salary date or past it, and we haven't processed it yet
          if (
            (today.getTime() >= secondSalaryDate.getTime()) && 
            (!lastSalaryProcessed || new Date(lastSalaryProcessed).getTime() < secondSalaryDate.getTime())
          ) {
            // Add second salary to current balance
            set((state) => ({
              currentBalance: state.currentBalance + (salaryInfo.secondAmount || 0),
              lastSalaryProcessed: secondSalaryDate.toISOString(),
            }));
            
            // Return true to indicate salary was processed
            return true;
          }
        }
        
        // Return false to indicate no salary was processed
        return false;
      },
      
      // Reset the app state
      reset: () => {
        set({
          isSetupComplete: false,
          currentBalance: 0,
          targetBalance: 0,
          salaryInfo: null,
          fixedExpenses: [],
          transactions: [],
          lastSalaryProcessed: null,
        });
      },
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Add these options to improve persistence
      partialize: (state) => ({
        isSetupComplete: state.isSetupComplete,
        currentBalance: state.currentBalance,
        targetBalance: state.targetBalance,
        salaryInfo: state.salaryInfo,
        fixedExpenses: state.fixedExpenses,
        transactions: state.transactions,
        lastSalaryProcessed: state.lastSalaryProcessed,
      }),
      // Increase version number to force rehydration
      version: 1,
    }
  )
);

export default useBudgetStore;