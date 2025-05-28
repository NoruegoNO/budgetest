import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { FixedExpense } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '@/utils/dateUtils';
import useLanguageStore from '@/store/languageStore';

interface AddFixedExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: Omit<FixedExpense, 'id'>) => void;
  expense?: FixedExpense; // For editing existing expense
}

const AddFixedExpenseModal: React.FC<AddFixedExpenseModalProps> = ({
  visible,
  onClose,
  onAdd,
  expense,
}) => {
  const [name, setName] = useState(expense?.name || '');
  const [amount, setAmount] = useState(expense?.amount ? expense.amount.toString() : '');
  const [dueDate, setDueDate] = useState<Date | null>(
    expense?.dueDate ? new Date(expense.dueDate) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const { t } = useLanguageStore();
  
  const handleAdd = () => {
    if (!name || !amount) {
      return; // Validation failed
    }
    
    onAdd({
      name,
      amount: parseFloat(amount),
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    });
    
    // Reset form
    setName('');
    setAmount('');
    setDueDate(null);
    onClose();
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dueDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {expense ? t.editFixedExpense : t.addFixedExpense}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.form}>
            <Text style={styles.label}>{t.expenseName}</Text>
            <TextInput
              style={styles.input}
              placeholder="Rent, Netflix, etc."
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={styles.label}>{t.amount}</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={styles.label}>{t.dueDate}</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.dateText}>
                {dueDate ? formatDate(dueDate) : t.selectDate}
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
                    value={dueDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.iosPicker}
                    themeVariant="dark"
                  />
                </View>
              ) : (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )
            )}
            
            <TouchableOpacity
              style={[
                styles.addButton,
                (!name || !amount) && styles.disabledButton,
              ]}
              onPress={handleAdd}
              disabled={!name || !amount}
            >
              <Text style={styles.addButtonText}>
                {expense ? t.update : t.addFixedExpense}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    elevation: 5, // For Android shadow
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  form: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: colors.text,
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
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddFixedExpenseModal;