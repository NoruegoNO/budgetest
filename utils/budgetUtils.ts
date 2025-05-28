/**
 * Budget calculation utility functions
 */

import { Transaction, FixedExpense } from '@/types';
import useLanguageStore from '@/store/languageStore';
import { getBudgetPeriodDays } from '@/utils/dateUtils';

// Calculate daily budget based on current balance, target balance, fixed expenses, and days remaining
export const calculateDailyBudget = (
  currentBalance: number,
  targetBalance: number,
  fixedExpenses: FixedExpense[],
  daysRemaining: number,
  nextSalaryDate?: string,
  frequency: 'monthly' | 'biweekly' = 'monthly',
  secondSalaryAmount?: number,
  secondSalaryDate?: string
): number => {
  // Filter expenses that are due before the next salary date
  const relevantExpenses = nextSalaryDate 
    ? fixedExpenses.filter(expense => {
        // If expense has no due date, include it
        if (!expense.dueDate) return true;
        
        // Compare dates to see if expense is due before next salary
        const expenseDate = new Date(expense.dueDate);
        const salaryDate = new Date(nextSalaryDate);
        
        // Only include expenses due BEFORE the next salary date
        return expenseDate < salaryDate;
      })
    : fixedExpenses;
  
  // Sum of all relevant fixed expenses
  const totalFixedExpenses = relevantExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  
  // For bi-weekly with second salary, include that in calculations
  let additionalIncome = 0;
  let totalDaysToConsider = daysRemaining;
  
  if (frequency === 'biweekly' && secondSalaryAmount && secondSalaryDate) {
    additionalIncome = secondSalaryAmount;
    // Use the full 28-day period for calculations
    totalDaysToConsider = getBudgetPeriodDays('biweekly', true);
  }
  
  // Available amount to spend = current balance - target balance - fixed expenses + additional income
  const availableToSpend = currentBalance - targetBalance - totalFixedExpenses + additionalIncome;
  
  // Daily budget = available amount / days remaining
  const dailyBudget = totalDaysToConsider > 0 ? availableToSpend / totalDaysToConsider : 0;
  
  // Return rounded to 2 decimal places, minimum 0
  return Math.max(0, Math.round(dailyBudget * 100) / 100);
};

// Calculate today's spending
export const calculateTodaySpending = (transactions: Transaction[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0);
      return transactionDate.getTime() === today.getTime();
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  const language = useLanguageStore.getState().language;
  
  if (language === 'no') {
    // Norwegian format: 1 234,56 kr
    return new Intl.NumberFormat('nb-NO', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' kr';
  } else {
    // English/US format: $1,234.56
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
};

// Calculate remaining balance after fixed expenses
export const calculateRemainingBalance = (
  currentBalance: number,
  fixedExpenses: FixedExpense[],
  nextSalaryDate?: string,
  secondSalaryAmount?: number
): number => {
  // Filter expenses that are due before the next salary date
  const relevantExpenses = nextSalaryDate 
    ? fixedExpenses.filter(expense => {
        // If expense has no due date, include it
        if (!expense.dueDate) return true;
        
        // Compare dates to see if expense is due before next salary
        const expenseDate = new Date(expense.dueDate);
        const salaryDate = new Date(nextSalaryDate);
        
        // Only include expenses due BEFORE the next salary date
        return expenseDate < salaryDate;
      })
    : fixedExpenses;
  
  const totalFixedExpenses = relevantExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  
  // Include second salary amount if provided
  const additionalIncome = secondSalaryAmount || 0;
  
  return currentBalance - totalFixedExpenses + additionalIncome;
};

// Calculate spending by category
export const calculateSpendingByCategory = (
  transactions: Transaction[]
): { categoryId: string; total: number }[] => {
  const spendingByCategory: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    if (!spendingByCategory[transaction.categoryId]) {
      spendingByCategory[transaction.categoryId] = 0;
    }
    spendingByCategory[transaction.categoryId] += transaction.amount;
  });
  
  return Object.entries(spendingByCategory).map(([categoryId, total]) => ({
    categoryId,
    total,
  }));
};