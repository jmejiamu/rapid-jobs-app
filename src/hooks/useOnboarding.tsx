import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingContextType {
  isOnboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  checkOnboardingStatus: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_KEY = '@rapid_jobs_onboarding_complete';

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [isOnboardingComplete, setIsOnboardingCompleteState] = useState<boolean>(false);

  const checkOnboardingStatus = async () => {
    try {
      // DEVELOPMENT: Comentado para que siempre muestre onboarding
      // const status = await AsyncStorage.getItem(ONBOARDING_KEY);
      // setIsOnboardingCompleteState(status === 'true');
      
      // Para development - siempre mostrar onboarding
      setIsOnboardingCompleteState(false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingCompleteState(false);
    }
  };

  const setOnboardingComplete = async (complete: boolean) => {
    try {
      // DEVELOPMENT: Comentado para que no guarde el estado
      // await AsyncStorage.setItem(ONBOARDING_KEY, complete.toString());
      
      // Para development - solo actualizar estado local sin persistir
      setIsOnboardingCompleteState(complete);
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const value: OnboardingContextType = {
    isOnboardingComplete,
    setOnboardingComplete,
    checkOnboardingStatus,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};