import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/budgetUtils';
import { categories } from '@/constants/categories';
import useLanguageStore from '@/store/languageStore';

interface SpendingChartProps {
  spendingByCategory: { categoryId: string; total: number }[];
  totalSpending: number;
}

const SpendingChart: React.FC<SpendingChartProps> = ({
  spendingByCategory,
  totalSpending,
}) => {
  const { t, language } = useLanguageStore();
  
  // Sort categories by spending amount (descending)
  const sortedSpending = [...spendingByCategory].sort((a, b) => b.total - a.total);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.spendingByCategory}</Text>
      
      {totalSpending === 0 ? (
        <Text style={styles.emptyText}>{t.noSpendingData}</Text>
      ) : (
        <>
          {sortedSpending.map((item, index) => {
            const category = categories.find((c) => c.id === item.categoryId) || {
              id: 'other',
              name: 'Other',
              nameNo: 'Annet',
            };
            const percentage = Math.round((item.total / totalSpending) * 100);
            const chartColor = colors.chartColors[index % colors.chartColors.length];
            
            // Get the category name based on the selected language
            const categoryName = language === 'no' ? category.nameNo : category.name;
            
            return (
              <View key={item.categoryId} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{categoryName}</Text>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(item.total)}
                  </Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${percentage}%`, backgroundColor: chartColor },
                    ]}
                  />
                </View>
                
                <Text style={styles.percentage}>{percentage}%</Text>
              </View>
            );
          })}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 20,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    color: colors.text,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.progressBackground,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
  },
});

export default SpendingChart;