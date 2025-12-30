import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Dimensions,
} from "react-native";
import LottieView from "lottie-react-native";
import { OnboardingCard, ProgressIndicator } from "../../components/onboarding";
import { translate } from "../../translation/i18n";
import { OnboardingSlide } from "../../types/onboarding";
import { MainButton } from "@/src/components";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides: OnboardingSlide[] = [
    {
      id: 1,
      title: translate("onboarding.slide1.title"),
      description: translate("onboarding.slide1.description"),
      buttonText: translate("onboarding.buttons.getStarted"),
      image: require("../../../assets/Welcome Animation.json"),
      color: "#f3c3ccff",
    },
    {
      id: 2,
      title: translate("onboarding.slide2.title"),
      description: translate("onboarding.slide2.description"),
      buttonText: translate("onboarding.buttons.next"),
      image: require("../../../assets/Location Pin Animation.json"),
      color: "#b6d9f7ff",
    },
    {
      id: 3,
      title: translate("onboarding.slide3.title"),
      description: translate("onboarding.slide3.description"),
      buttonText: translate("onboarding.buttons.next"),
      image: require("../../../assets/Job Search Animation.json"),
      color: "#fed7a0ff",
    },
    {
      id: 4,
      title: translate("onboarding.slide4.title"),
      description: translate("onboarding.slide4.description"),
      buttonText: translate("onboarding.buttons.letsGetStarted"),
      image: require("../../../assets/Success Animation Lottie.json"),
      color: "#6cdd84ff",
    },
  ];

  const isLastSlide = currentIndex === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <OnboardingCard
        title={item.title}
        description={item.description}
        backgroundColor={item.color}
      >
        <LottieView
          source={item.image}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </OnboardingCard>
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <MainButton
        title={translate("onboarding.buttons.skip")}
        variant="text"
        onPress={handleSkip}
        style={styles.skipButton}
        textStyle={{ color: "#191e5eff", fontSize: 18 }}
      />

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.flatList}
      />

      <View style={styles.footer}>
        <ProgressIndicator
          totalSteps={slides.length}
          currentStep={currentIndex}
        />

        <View style={styles.buttonContainer}>
          <MainButton
            title={slides[currentIndex].buttonText}
            onPress={handleNext}
            size="lg"
            style={[
              styles.nextButton,
              { backgroundColor: slides[currentIndex].color },
            ]}
            textStyle={{ color: "#191e5eff" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: "auto",
    position: "absolute",
    zIndex: 1,
    top: 55,
    right: 20,
  },
  flatList: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  buttonContainer: {
    marginTop: 24,
  },
  nextButton: {
    width: "100%",
    borderRadius: 25,
  },
  lottieAnimation: {
    width: 400,
    height: 400,
  },
});

export default OnboardingScreen;
