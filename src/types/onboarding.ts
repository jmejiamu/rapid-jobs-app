export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image?: any; // Para soportar require() de archivos Lottie
  buttonText: string;
}

export interface OnboardingScreenProps {
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
  currentSlide: number;
  totalSlides: number;
  isLastSlide: boolean;
}

export interface OnboardingContextType {
  currentSlide: number;
  slides: OnboardingSlide[];
  isOnboardingComplete: boolean;
  goToNextSlide: () => void;
  goToPreviousSlide: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export type OnboardingNavigationParamList = {
  OnboardingFlow: undefined;
  OnboardingSlide: { slideIndex: number };
};