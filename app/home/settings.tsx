import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { DollarSign, Calendar, RefreshCw, LogOut, Globe } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '@/constants/colors';
import useBudgetStore from '@/store/budgetStore';
import useLanguageStore from '@/store/languageStore';
import { formatDate, calculateNextSalaryDate } from '@/utils/dateUtils';
import { Language } from '@/constants/translations';

export default function SettingsScreen() {
  const {
    currentBalance,
    targetBalance,
    salaryInfo,
    updateBalance,
    updateTargetBalance,
    updateSalaryAmount,
    reset,
  } = useBudgetStore();
  
  const { t, language, setLanguage } = useLanguageStore();
  
  const [balance, setBalance] = useState(currentBalance.toString());
  const [target, setTarget] = useState(targetBalance.toString());
  const [salary, setSalary] = useState(
    salaryInfo?.amount ? salaryInfo.amount.toString() : '0'
  );
  const [secondSalary, setSecondSalary] = useState(
    salaryInfo?.secondAmount ? salaryInfo.secondAmount.toString() : '0'
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nextSalaryDate, setNextSalaryDate] = useState(
    salaryInfo ? new Date(salaryInfo.nextDate) : new Date()
  );
  
  const handleUpdateBalance = () => {
    updateBalance(parseFloat(balance) || 0);
    Alert.alert(t.success, t.balanceUpdated);
  };
  
  const handleUpdateTarget = () => {
    updateTargetBalance(parseFloat(target) || 0);
    Alert.alert(t.success, t.targetUpdated);
  };
  
  const handleUpdateSalary = () => {
    const parsedSalary = parseFloat(salary) || 0;
    const parsedSecondSalary = salaryInfo?.frequency === 'biweekly' ? 
      (parseFloat(secondSalary) || 0) : undefined;
    
    updateSalaryAmount(parsedSalary, parsedSecondSalary);
    Alert.alert(t.success, t.salaryUpdated);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || nextSalaryDate;
    setShowDatePicker(Platform.OS === 'ios');
    setNextSalaryDate(currentDate);
    // We would need to update the salary date in the store
    // This would require adding a new action to the store
  };
  
  const handleReset = () => {
    Alert.alert(
      t.resetApp,
      t.resetConfirm,
      [
        {
          text: t.cancel,
          style: 'cancel',
        },
        {
          text: t.resetApp,
          onPress: () => {
            reset();
            router.replace('/');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.language}</Text>
          
          <View style={styles.languageContainer}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'no' && styles.selectedLanguageButton,
              ]}
              onPress={() => handleLanguageChange('no')}
            >
              <Text style={[
                styles.languageText,
                language === 'no' && styles.selectedLanguageText,
              ]}>
                {t.norwegian}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'en' && styles.selectedLanguageButton,
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[
                styles.languageText,
                language === 'en' && styles.selectedLanguageText,
              ]}>
                {t.english}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.account}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>{t.salaryAmount}</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="numeric"
                value={salary}
                onChangeText={setSalary}
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateSalary}
              >
                <Text style={styles.updateButtonText}>{t.update}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {salaryInfo?.frequency === 'biweekly' && (
            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <DollarSign size={20} color={colors.primary} />
                <Text style={styles.settingLabel}>
                  {t.language === 'no' ? 'Neste lønnsbeløp' : 'Next Salary Amount'}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={secondSalary}
                  onChangeText={setSecondSalary}
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleUpdateSalary}
                >
                  <Text style={styles.updateButtonText}>{t.update}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>{t.currentBalance}</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="numeric"
                value={balance}
                onChangeText={setBalance}
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateBalance}
              >
                <Text style={styles.updateButtonText}>{t.update}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>{t.targetBalance}</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="numeric"
                value={target}
                onChangeText={setTarget}
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateTarget}
              >
                <Text style={styles.updateButtonText}>{t.update}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>{t.nextSalary}</Text>
            </View>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formatDate(nextSalaryDate)}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              Platform.OS === 'ios' ? (
                <View style={styles.iosPickerContainer}>
                  <View style={styles.iosPickerHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.iosPickerCancel}>{t.cancel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.iosPickerDone}>{t.done}</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={nextSalaryDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.iosPicker}
                    themeVariant="dark"
                  />
                </View>
              ) : (
                <DateTimePicker
                  value={nextSalaryDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )
            )}
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <RefreshCw size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>{t.salaryFrequency}</Text>
            </View>
            <Text style={styles.valueText}>
              {salaryInfo?.frequency === 'monthly' ? t.monthly : t.biweekly}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.appName}</Text>
          
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleReset}
          >
            <LogOut size={20} color={colors.danger} />
            <Text style={styles.dangerButtonText}>{t.resetApp}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  languageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  languageButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedLanguageButton: {
    backgroundColor: colors.primary,
  },
  languageText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  selectedLanguageText: {
    color: 'white',
  },
  settingItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2, // For Android shadow
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 12,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  valueText: {
    fontSize: 16,
    color: colors.text,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    elevation: 2, // For Android shadow
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.danger,
    marginLeft: 8,
  },
  iosPickerContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iosPickerCancel: {
    color: colors.danger,
    fontSize: 16,
  },
  iosPickerDone: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  iosPicker: {
    height: 200,
  },
});