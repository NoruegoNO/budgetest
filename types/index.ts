/**
 * Type definitions for the budget app
 */

// User's salary information
export interface SalaryInfo {
  frequency: 'monthly' | 'biweekly';
  nextDate: string; // ISO date string
  initialDate: string; // ISO date string
  amount: number; // Salary amount
  secondAmount?: number; // Second salary amount (for bi-weekly)
  secondDate?: string; // ISO date string for second salary (for bi-weekly)
}

// Fixed expense (bills, subscriptions, etc.)
export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  dueDate?: string; // Optional ISO date string
}

// Transaction record
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string; // ISO date string
}

// App state
export interface BudgetState {
  // Setup status
  isSetupComplete: boolean;
  
  // Financial data
  currentBalance: number;
  targetBalance: number;
  salaryInfo: SalaryInfo | null;
  fixedExpenses: FixedExpense[];
  transactions: Transaction[];
  lastSalaryProcessed: string | null;
  
  // Actions
  completeSetup: (
    frequency: 'monthly' | 'biweekly',
    initialDate: Date,
    currentBalance: number,
    targetBalance: number,
    salaryAmount: number,
    secondSalaryAmount?: number
  ) => void;
  updateBalance: (newBalance: number) => void;
  updateTargetBalance: (newTargetBalance: number) => void;
  updateSalaryAmount: (newSalaryAmount: number, secondSalaryAmount?: number) => void;
  addFixedExpense: (expense: Omit<FixedExpense, 'id'>) => void;
  updateFixedExpense: (expense: FixedExpense) => void;
  deleteFixedExpense: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  checkAndProcessSalary: () => boolean | undefined;
  reset: () => void;
}