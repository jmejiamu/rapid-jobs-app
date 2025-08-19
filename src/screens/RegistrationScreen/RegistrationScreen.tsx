import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "@/src/components/CustomInput/CustomInput";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PhoneInput } from "react-native-phone-entry";
import { colors } from "@/src/theme/colors";
import { MainButton } from "@/src/components";

const schema = z.object({
  phone: z.string().min(10).max(15).regex(/^\d+$/, "Invalid phone number"),
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
    },
  });
  return (
    <SafeAreaView>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
        Thanks for registering!
      </Text>

      <View style={{ marginHorizontal: 16 }}>
        <CustomInput
          control={control}
          name="name"
          placeholder="Name"
          error={errors.name?.message}
        />
        {/* <CustomInput
        control={control}
        name="phone"
        placeholder="Phone Number"
        error={errors.phone?.message}
        /> */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <PhoneInput
                  defaultValues={{
                    countryCode: "US",
                    callingCode: "+1",
                    phoneNumber: "+123456789",
                  }}
                  value="+123456789"
                  onChangeText={(text) => console.log("Phone number:", text)}
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
                  size="lg"
                  onPress={handleSubmit((data) => console.log(data))}
                />
              </View>
              {errors.phone && (
                <Text style={{ color: colors.error, marginVertical: 5 }}>
                  {errors.phone.message}
                </Text>
              )}
            </>
          )}
        />
      </View>
      <View style={{ marginTop: 60 }}>
        <OtpInput
          numberOfDigits={6}
          type="numeric"
          onTextChange={(text) => console.log(text)}
          theme={{
            containerStyle: {
              borderRadius: 8,
              padding: 16,
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
};
export default RegistrationScreen;
const styles = StyleSheet.create({});
