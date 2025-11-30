import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { MainButton } from "@/src/components";
import { Controller, useForm } from "react-hook-form";
import { PhoneInput } from "react-native-phone-entry";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { colors } from "@/src/theme/colors";
import { API_URL } from "@/config/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/redux/store";
import { setUserData } from "@/src/redux/authSlice";

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
        body: JSON.stringify({ phone: dataInput.phone }),
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
        Welcome back to Rapid Jobs!
      </Text>

      <View style={{ marginHorizontal: 16 }}>
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
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
