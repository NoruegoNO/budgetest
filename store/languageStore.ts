import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, translations, TranslationKeys } from '@/constants/translations';

interface LanguageState {
  language: Language;
  t: TranslationKeys;
  setLanguage: (language: Language) => void;
}

// Create the language store with persistence
const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      // Default language is Norwegian
      language: 'no',
      t: translations['no'],
      
      // Set language
      setLanguage: (language: Language) => {
        set({
          language,
          t: translations[language],
        });
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Add these options to improve persistence
      partialize: (state) => ({
        language: state.language,
        t: state.t,
      }),
      // Increase version number to force rehydration
      version: 1,
    }
  )
);

export default useLanguageStore;