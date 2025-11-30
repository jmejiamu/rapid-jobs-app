import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/src/redux/authSlice";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "react-native-phone-entry";
import { OtpInput } from "react-native-otp-entry";
import { z } from "zod";

import { RootStackParamList } from "@/src/navigation/RootNavigator";
import CustomInput from "@/src/components/CustomInput/CustomInput";
import { fontSize } from "@/src/theme/fontStyle";
import { MainButton } from "@/src/components";
import { colors } from "@/src/theme/colors";
import { API_URL } from "@/config/api";
import { AppDispatch } from "@/src/redux/store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const schema = z.object({
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\+?\d+$/, "Invalid phone number"),
  name: z.string().min(1, "Name is required"),
});

interface AuthFormInputs extends z.infer<typeof schema> {}

const RegistrationScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      name: "",
    },
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const [otp, setOtp] = useState("");
  const [success, setSuccess] = useState(false);

  const OTP_LENGTH = 6;

  const sendOtp = async (dataInput: AuthFormInputs) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: dataInput.phone, name: dataInput.name }),
      });

      if (!response.ok) {
        throw new Error("OTP verification failed");
      }

      const data = await response.json();
      if (data.accessToken) {
        dispatch(setUserData(data));
        navigation.navigate("MainApp");
        return;
      }

      if (data.success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const verifyOtp = async (dataInput: AuthFormInputs) => {
    if (otp.length !== OTP_LENGTH) {
      console.log("Invalid OTP");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: otp,
          name: dataInput.name,
          phone: dataInput.phone,
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
      // Navigate to the next screen or show a success message
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="keyboard-arrow-left" size={35} color="black" />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 20,
        }}
      >
        Thanks for registering!
      </Text>

      <View style={{ marginHorizontal: 16 }}>
        <CustomInput
          control={control}
          name="name"
          placeholder="Name"
          error={errors.name?.message}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => {
            return (
              <>
                <View
                  style={{ flex: 1, flexDirection: "row", marginBottom: 50 }}
                >
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
                      containerStyle: {
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.textSecondary,
                        borderRadius: 8,
                        height: 50,
                        flex: 1,
                      },
                      textInputStyle: {
                        backgroundColor: colors.surface,
                        borderColor: colors.textSecondary,
                      },
                    }}
                    hideDropdownIcon={false}
                    isCallingCodeEditable={false}
                  />
                  <View style={{ margin: 8 }} />
                  <MainButton
                    title="Verify"
                    style={{ height: 50 }}
                    onPress={handleSubmit(sendOtp)}
                  />
                </View>
                {errors.phone && (
                  <Text style={{ color: colors.error, marginVertical: 5 }}>
                    {errors.phone.message}
                  </Text>
                )}
              </>
            );
          }}
        />
      </View>

      <View style={{}}>
        {success && (
          <>
            <Text
              style={{
                textAlign: "center",
                marginTop: 35,
                fontSize: fontSize.sm,
                fontWeight: "500",
                marginBottom: 10,
              }}
            >
              Enter the verification code sent to your phone.
            </Text>
            <OtpInput
              numberOfDigits={6}
              type="numeric"
              onTextChange={setOtp}
              theme={{
                containerStyle: {
                  borderRadius: 8,
                  padding: 16,
                },
              }}
            />
            <TouchableOpacity>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  textDecorationLine: "underline",
                }}
              >
                Resend code
              </Text>
            </TouchableOpacity>

            <MainButton
              title="Verify code"
              disabled={otp.length !== OTP_LENGTH}
              style={{ marginTop: 20, marginHorizontal: 16 }}
              onPress={handleSubmit(verifyOtp)}
            />
          </>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              textDecorationLine: "underline",
            }}
          >
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default RegistrationScreen;
const styles = StyleSheet.create({});
