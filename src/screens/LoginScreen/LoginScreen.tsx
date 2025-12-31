import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { PhoneInput } from "react-native-phone-entry";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { fetchExpoPushToken } from "@/src/redux/notificationSlice";
import { AppDispatch, RootState } from "@/src/redux/store";
import { setUserData } from "@/src/redux/authSlice";
import { MainButton } from "@/src/components";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";
import { API_URL } from "@/config/api";

const schema = z.object({
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\+?\d+$/, "Invalid phone number"),
});

interface AuthFormInputs extends z.infer<typeof schema> {}

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  let { expoPushToken } = useSelector(
    (state: RootState) => state.pushNotifications
  );
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
    },
  });

  const sendOtp = async (dataInput: AuthFormInputs) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: dataInput.phone,
          deviceToken: expoPushToken,
        }),
      });

      if (!response.ok) {
        throw new Error("OTP verification failed");
      }

      const data = await response.json();

      if (data.accessToken) {
        dispatch(setUserData(data));
        navigation.navigate("MainApp");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  useEffect(() => {
    if (!expoPushToken) {
      dispatch(fetchExpoPushToken());
    }
  }, [expoPushToken, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </TouchableOpacity>

          <View style={styles.heroSection}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="briefcase-check"
                size={40}
                color={colors.primary}
              />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Enter your phone number to continue
            </Text>
          </View>

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <View style={styles.formSection}>
                <PhoneInput
                  defaultValues={{
                    countryCode: "US",
                    callingCode: "+1",
                    phoneNumber: "+1",
                  }}
                  value={value}
                  onChangeText={(text) => onChange(text.toString())}
                  onChangeCountry={(country) =>
                    console.log("Country:", country)
                  }
                  autoFocus={true}
                  disabled={false}
                  theme={{
                    containerStyle: styles.phoneInput,
                    textInputStyle: styles.phoneInputText,
                  }}
                  hideDropdownIcon={false}
                  isCallingCodeEditable={false}
                />

                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone.message}</Text>
                )}

                <MainButton
                  title="Continue"
                  onPress={handleSubmit(sendOtp)}
                  style={styles.submitButton}
                />
              </View>
            )}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.footerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  formSection: {
    gap: 16,
  },
  phoneInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    height: 54,
  },
  phoneInputText: {
    backgroundColor: "transparent",
    fontSize: fontSize.md,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.xs,
    marginTop: -8,
  },
  submitButton: {
    borderRadius: 12,
    height: 54,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: "600",
  },
});
