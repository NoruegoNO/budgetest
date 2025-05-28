/**
 * Translation strings for the budget app
 */

export type Language = 'no' | 'en';

export type TranslationKeys = {
  // General
  appName: string;
  next: string;
  cancel: string;
  done: string;
  update: string;
  delete: string;
  save: string;
  success: string;
  
  // Setup
  setupTitle: string;
  setupSubtitle: string;
  whenPaid: string;
  salaryFrequency: string;
  selectFrequency: string;
  monthly: string;
  biweekly: string;
  futureDates: string;
  salaryAmount: string;
  enterSalaryAmount: string;
  salaryAddedInfo: string;
  currentBalance: string;
  enterCurrentBalance: string;
  targetBalance: string;
  enterTargetBalance: string;
  targetBalanceInfo: string;
  completeSetup: string;
  
  // Home
  nextSalary: string;
  dailyBudget: string;
  daysUntilSalary: string;
  todaySpending: string;
  availableAfterExpenses: string;
  fixedExpenses: string;
  transactions: string;
  settings: string;
  spendingByCategory: string;
  noSpendingData: string;
  salaryBreakdown: string;
  remainingAfterExpenses: string;
  noFixedExpensesYet: string;
  
  // Fixed Expenses
  fixedExpensesTitle: string;
  total: string;
  noFixedExpenses: string;
  addFixedExpense: string;
  editFixedExpense: string;
  expenseName: string;
  amount: string;
  dueDate: string;
  selectDate: string;
  deleteExpenseConfirm: string;
  
  // Transactions
  transactionsTitle: string;
  noTransactions: string;
  addTransaction: string;
  description: string;
  category: string;
  deleteTransactionConfirm: string;
  
  // Settings
  settingsTitle: string;
  account: string;
  language: string;
  norwegian: string;
  english: string;
  resetApp: string;
  resetConfirm: string;
  balanceUpdated: string;
  targetUpdated: string;
  salaryUpdated: string;
};

export const translations: Record<Language, TranslationKeys> = {
  no: {
    // General
    appName: 'Budsjettveiviser',
    next: 'Neste',
    cancel: 'Avbryt',
    done: 'Ferdig',
    update: 'Oppdater',
    delete: 'Slett',
    save: 'Lagre',
    success: 'Suksess',
    
    // Setup
    setupTitle: 'Budsjettveiviser',
    setupSubtitle: 'La oss sette opp ditt daglige budsjett',
    whenPaid: 'Når får du betalt?',
    salaryFrequency: 'Velg lønnsfrekvens og neste betalingsdato',
    selectFrequency: 'Velg frekvens',
    monthly: 'Månedlig',
    biweekly: 'Annenhver uke',
    futureDates: 'Fremtidige betalingsdatoer:',
    salaryAmount: 'Hva er lønnsbeløpet ditt?',
    enterSalaryAmount: 'Skriv inn hvor mye du mottar hver lønningsdag',
    salaryAddedInfo: 'Dette beløpet vil bli lagt til i din nåværende saldo under oppsett.',
    currentBalance: 'Hva er din nåværende saldo?',
    enterCurrentBalance: 'Skriv inn nåværende beløp på kontoen din',
    targetBalance: 'Sett din målsaldo',
    enterTargetBalance: 'Hvor mye ønsker du å ha igjen på kontoen din innen neste lønningsdag?',
    targetBalanceInfo: 'Dette beløpet vil bli reservert når vi beregner ditt daglige budsjett.',
    completeSetup: 'Fullfør oppsett',
    
    // Home
    nextSalary: 'Neste lønn',
    dailyBudget: 'Daglig budsjett',
    daysUntilSalary: 'dag til neste lønn',
    todaySpending: 'Dagens forbruk',
    availableAfterExpenses: 'Tilgjengelig etter faste utgifter',
    fixedExpenses: 'Faste utgifter',
    transactions: 'Transaksjoner',
    settings: 'Innstillinger',
    spendingByCategory: 'Forbruk etter kategori',
    noSpendingData: 'Ingen forbruksdata ennå',
    salaryBreakdown: 'Lønnsfordeling',
    remainingAfterExpenses: 'Gjenværende etter utgifter:',
    noFixedExpensesYet: 'Ingen faste utgifter lagt til ennå',
    
    // Fixed Expenses
    fixedExpensesTitle: 'Faste utgifter',
    total: 'Totalt',
    noFixedExpenses: 'Ingen faste utgifter ennå. Legg til dine regelmessige regninger og abonnementer.',
    addFixedExpense: 'Legg til fast utgift',
    editFixedExpense: 'Rediger fast utgift',
    expenseName: 'Navn',
    amount: 'Beløp',
    dueDate: 'Forfallsdato (Valgfritt)',
    selectDate: 'Velg en dato',
    deleteExpenseConfirm: 'Er du sikker på at du vil slette denne utgiften?',
    
    // Transactions
    transactionsTitle: 'Transaksjoner',
    noTransactions: 'Ingen transaksjoner ennå. Legg til dine utgifter for å spore forbruket ditt.',
    addTransaction: 'Legg til transaksjon',
    description: 'Beskrivelse',
    category: 'Kategori',
    deleteTransactionConfirm: 'Er du sikker på at du vil slette denne transaksjonen?',
    
    // Settings
    settingsTitle: 'Innstillinger',
    account: 'Konto',
    language: 'Språk',
    norwegian: 'Norsk',
    english: 'Engelsk',
    resetApp: 'Tilbakestill app',
    resetConfirm: 'Er du sikker på at du vil tilbakestille alle data? Denne handlingen kan ikke angres.',
    balanceUpdated: 'Saldo oppdatert',
    targetUpdated: 'Målsaldo oppdatert',
    salaryUpdated: 'Lønnsbeløp oppdatert',
  },
  en: {
    // General
    appName: 'Budget Wizard',
    next: 'Next',
    cancel: 'Cancel',
    done: 'Done',
    update: 'Update',
    delete: 'Delete',
    save: 'Save',
    success: 'Success',
    
    // Setup
    setupTitle: 'Budget Wizard',
    setupSubtitle: "Let's set up your daily budget",
    whenPaid: 'When do you get paid?',
    salaryFrequency: 'Select your salary frequency and next payment date',
    selectFrequency: 'Select frequency',
    monthly: 'Monthly',
    biweekly: 'Bi-weekly',
    futureDates: 'Future payment dates:',
    salaryAmount: "What's your salary amount?",
    enterSalaryAmount: 'Enter how much you receive each payday',
    salaryAddedInfo: 'This amount will be added to your current balance during setup.',
    currentBalance: "What's your current balance?",
    enterCurrentBalance: 'Enter the current amount in your bank account',
    targetBalance: 'Set your target balance',
    enterTargetBalance: 'How much do you want to have left in your account by your next payday?',
    targetBalanceInfo: 'This amount will be reserved when calculating your daily budget.',
    completeSetup: 'Complete Setup',
    
    // Home
    nextSalary: 'Next Salary',
    dailyBudget: 'Daily Budget',
    daysUntilSalary: 'day until next salary',
    todaySpending: "Today's Spending",
    availableAfterExpenses: 'Available After Fixed Expenses',
    fixedExpenses: 'Fixed Expenses',
    transactions: 'Transactions',
    settings: 'Settings',
    spendingByCategory: 'Spending by Category',
    noSpendingData: 'No spending data yet',
    salaryBreakdown: 'Salary Breakdown',
    remainingAfterExpenses: 'Remaining after expenses:',
    noFixedExpensesYet: 'No fixed expenses added yet',
    
    // Fixed Expenses
    fixedExpensesTitle: 'Fixed Expenses',
    total: 'Total',
    noFixedExpenses: 'No fixed expenses yet. Add your recurring bills and subscriptions.',
    addFixedExpense: 'Add Fixed Expense',
    editFixedExpense: 'Edit Fixed Expense',
    expenseName: 'Name',
    amount: 'Amount',
    dueDate: 'Due Date (Optional)',
    selectDate: 'Select a date',
    deleteExpenseConfirm: 'Are you sure you want to delete this expense?',
    
    // Transactions
    transactionsTitle: 'Transactions',
    noTransactions: 'No transactions yet. Add your expenses to track your spending.',
    addTransaction: 'Add Transaction',
    description: 'Description',
    category: 'Category',
    deleteTransactionConfirm: 'Are you sure you want to delete this transaction?',
    
    // Settings
    settingsTitle: 'Settings',
    account: 'Account',
    language: 'Language',
    norwegian: 'Norwegian',
    english: 'English',
    resetApp: 'Reset App',
    resetConfirm: 'Are you sure you want to reset all data? This action cannot be undone.',
    balanceUpdated: 'Balance updated successfully',
    targetUpdated: 'Target balance updated successfully',
    salaryUpdated: 'Salary amount updated successfully',
  }
};