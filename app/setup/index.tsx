import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Calendar, DollarSign, ArrowRight } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '@/constants/colors';
import useBudgetStore from '@/store/budgetStore';
import useLanguageStore from '@/store/languageStore';
import { formatDate, generateFutureSalaryDates } from '@/utils/dateUtils';

export default function SetupScreen() {
  const [step, setStep] = useState(1);
  const [frequency, setFrequency] = useState<'monthly' | 'biweekly'>('monthly');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [initialDate, setInitialDate] = useState(new Date());
  const [currentBalance, setCurrentBalance] = useState('');
  const [targetBalance, setTargetBalance] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [secondSalaryAmount, setSecondSalaryAmount] = useState('');
  
  const completeSetup = useBudgetStore((state) => state.completeSetup);
  const { t } = useLanguageStore();
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || initialDate;
    setShowDatePicker(Platform.OS === 'ios');
    setInitialDate(currentDate);
  };
  
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete setup and navigate to home
      completeSetup(
        frequency,
        initialDate,
        parseFloat(currentBalance) || 0,
        parseFloat(targetBalance) || 0,
        parseFloat(salaryAmount) || 0,
        frequency === 'biweekly' ? (parseFloat(secondSalaryAmount) || undefined) : undefined
      );
      router.replace('/home');
    }
  };
  
  // Calculate future dates whenever initialDate or frequency changes
  const futureDates = generateFutureSalaryDates(initialDate, frequency, 3);
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.whenPaid}</Text>
            <Text style={styles.stepDescription}>
              {t.salaryFrequency}
            </Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  frequency === 'monthly' && styles.selectedOption,
                ]}
                onPress={() => setFrequency('monthly')}
              >
                <Text
                  style={[
                    styles.optionText,
                    frequency === 'monthly' && styles.selectedOptionText,
                  ]}
                >
                  {t.monthly}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  frequency === 'biweekly' && styles.selectedOption,
                ]}
                onPress={() => setFrequency('biweekly')}
              >
                <Text
                  style={[
                    styles.optionText,
                    frequency === 'biweekly' && styles.selectedOptionText,
                  ]}
                >
                  {t.biweekly}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Date picker button */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.dateText}>{formatDate(initialDate)}</Text>
            </TouchableOpacity>
            
            {/* Date picker */}
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
                    value={initialDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.iosPicker}
                    themeVariant="dark"
                  />
                </View>
              ) : (
                <DateTimePicker
                  value={initialDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )
            )}
            
            <View style={styles.futureDatesContainer}>
              <Text style={styles.futureDatesTitle}>{t.futureDates}</Text>
              {futureDates.slice(1).map((date, index) => (
                <Text key={index} style={styles.futureDate}>
                  {formatDate(date)}
                </Text>
              ))}
            </View>
          </View>
        );
        
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.salaryAmount}</Text>
            <Text style={styles.stepDescription}>
              {t.enterSalaryAmount}
            </Text>
            
            <View style={styles.inputContainer}>
              <DollarSign size={20} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="numeric"
                value={salaryAmount}
                onChangeText={setSalaryAmount}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            {frequency === 'biweekly' && (
              <>
                <Text style={[styles.stepTitle, { marginTop: 24 }]}>
                  {t.language === 'no' ? 'Neste lønnsbeløp' : 'Next Salary Amount'}
                </Text>
                <Text style={styles.stepDescription}>
                  {t.language === 'no' 
                    ? 'For å beregne 28 dager fremover, trenger vi også beløpet for neste lønning'
                    : 'To calculate 28 days ahead, we also need the amount for your next salary'}
                </Text>
                
                <View style={styles.inputContainer}>
                  <DollarSign size={20} color={colors.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={secondSalaryAmount}
                    onChangeText={setSecondSalaryAmount}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </>
            )}
            
            <Text style={styles.infoText}>
              {frequency === 'biweekly' 
                ? (t.language === 'no' 
                  ? 'For bi-ukentlig lønn beregner vi et 28-dagers budsjett ved å inkludere begge lønningene.'
                  : 'For bi-weekly salary, we calculate a 28-day budget by including both salaries.')
                : t.salaryAddedInfo}
            </Text>
          </View>
        );
        
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.currentBalance}</Text>
            <Text style={styles.stepDescription}>
              {t.enterCurrentBalance}
            </Text>
            
            <View style={styles.inputContainer}>
              <DollarSign size={20} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="numeric"
                value={currentBalance}
                onChangeText={setCurrentBalance}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <Text style={styles.infoText}>
              {t.salaryAddedInfo}
            </Text>
          </View>
        );
        
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.targetBalance}</Text>
            <Text style={styles.stepDescription}>
              {t.enterTargetBalance}
            </Text>
            
            <View style={styles.inputContainer}>
              <DollarSign size={20} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="numeric"
                value={targetBalance}
                onChangeText={setTargetBalance}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <Text style={styles.infoText}>
              {t.targetBalanceInfo}
            </Text>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return false; // Always allow proceeding from step 1
      case 2:
        if (frequency === 'biweekly') {
          return !salaryAmount || !secondSalaryAmount;
        }
        return !salaryAmount;
      case 3:
        return !currentBalance;
      case 4:
        return !targetBalance;
      default:
        return false;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t.setupTitle}</Text>
            <Text style={styles.headerSubtitle}>
              {t.setupSubtitle}
            </Text>
          </View>
          
          <View style={styles.stepsContainer}>
            <View style={styles.stepsIndicator}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.stepIndicator,
                    i === step && styles.activeStepIndicator,
                    i < step && styles.completedStepIndicator,
                  ]}
                />
              ))}
            </View>
            
            {renderStepContent()}
            
            <TouchableOpacity
              style={[
                styles.nextButton,
                isNextDisabled() && styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={isNextDisabled()}
            >
              <Text style={styles.nextButtonText}>
                {step === 4 ? t.completeSetup : t.next}
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  stepsContainer: {
    flex: 1,
    padding: 24,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  stepIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeStepIndicator: {
    backgroundColor: colors.primary,
    width: 20,
  },
  completedStepIndicator: {
    backgroundColor: colors.secondary,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectedOptionText: {
    color: 'white',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  iosPickerContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 24,
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
  futureDatesContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  futureDatesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  futureDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 12,
    color: colors.text,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    fontStyle: 'italic',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  disabledButton: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});