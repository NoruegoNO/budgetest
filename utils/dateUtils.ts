/**
 * Date utility functions for the budget app
 */

// Format date to display in the app
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Format date to display in short format (e.g., "Jun 5")
export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
};

// Calculate next salary date based on frequency and last salary date
export const calculateNextSalaryDate = (
  lastSalaryDate: Date,
  frequency: 'monthly' | 'biweekly'
): Date => {
  const nextDate = new Date(lastSalaryDate);
  
  if (frequency === 'monthly') {
    // Move to the next month, same day
    nextDate.setMonth(nextDate.getMonth() + 1);
  } else {
    // Add 14 days for bi-weekly
    nextDate.setDate(nextDate.getDate() + 14);
  }
  
  return nextDate;
};

// Calculate days remaining until next salary
export const getDaysRemaining = (nextSalaryDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextDate = new Date(nextSalaryDate);
  nextDate.setHours(0, 0, 0, 0);
  
  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

// Calculate total days for budget period based on frequency
export const getBudgetPeriodDays = (
  frequency: 'monthly' | 'biweekly',
  includeSecondSalary: boolean = false
): number => {
  if (frequency === 'monthly') {
    // Average month length
    return 30;
  } else {
    // Bi-weekly is 14 days, or 28 if including second salary
    return includeSecondSalary ? 28 : 14;
  }
};

// Generate future salary dates based on frequency and initial date
export const generateFutureSalaryDates = (
  initialDate: Date,
  frequency: 'monthly' | 'biweekly',
  count: number = 6
): Date[] => {
  const dates: Date[] = [new Date(initialDate)];
  
  for (let i = 0; i < count - 1; i++) {
    const lastDate = dates[dates.length - 1];
    const nextDate = calculateNextSalaryDate(lastDate, frequency);
    dates.push(nextDate);
  }
  
  return dates;
};