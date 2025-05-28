import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { categories } from '@/constants/categories';
import useLanguageStore from '@/store/languageStore';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: {
    amount: number;
    description: string;
    categoryId: string;
    date: string;
  }) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const { t, language } = useLanguageStore();
  
  const handleAdd = () => {
    if (!amount || !description || !categoryId) {
      return; // Validation failed
    }
    
    // Parse amount as a positive number
    const parsedAmount = Math.abs(parseFloat(amount));
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return; // Invalid amount
    }
    
    onAdd({
      amount: parsedAmount,
      description,
      categoryId,
      date: new Date().toISOString(),
    });
    
    // Reset form
    setAmount('');
    setDescription('');
    setCategoryId('');
    onClose();
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
            <Text style={styles.modalTitle}>{t.addTransaction}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.form}>
            <Text style={styles.label}>{t.amount}</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={styles.label}>{t.description}</Text>
            <TextInput
              style={styles.input}
              placeholder={language === 'no' ? "Hva brukte du penger på?" : "What did you spend on?"}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={styles.label}>{t.category}</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    categoryId === category.id && styles.selectedCategory,
                  ]}
                  onPress={() => setCategoryId(category.id)}
                >
                  <Text style={[
                    styles.categoryText,
                    categoryId === category.id && styles.selectedCategoryText
                  ]}>
                    {language === 'no' ? category.nameNo : category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={[
                styles.addButton,
                (!amount || !description || !categoryId) && styles.disabledButton,
              ]}
              onPress={handleAdd}
              disabled={!amount || !description || !categoryId}
            >
              <Text style={styles.addButtonText}>{t.addTransaction}</Text>
            </TouchableOpacity>
          </ScrollView>
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
    maxHeight: '80%',
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.text,
    fontSize: 14,
  },
  selectedCategoryText: {
    color: 'white',
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
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

export default AddTransactionModal;