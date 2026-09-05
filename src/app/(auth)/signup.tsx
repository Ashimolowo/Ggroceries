import { useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import useSocialAuth from "@/hooks/useSocialAuth";
import {
  ActivityIndicator,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { getFriendlyErrorMessage, getUnexpectedErrorMessage } from "../utils";
import { FormError } from "@/components/FormError";

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyErrorMessage, setVerifyErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isSubmittingRef = useRef(false);
  const isVerifyingRef = useRef(false);
  const isLoading = fetchStatus === "fetching";

  const handleSignUp = async () => {
    if (!emailAddress || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setErrorMessage("");

    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setErrorMessage(getFriendlyErrorMessage(error));
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();

      if (sendError) {
        setErrorMessage(getFriendlyErrorMessage(sendError));
        return;
      }

      setIsVerifying(true);
    } catch (err) {
      console.error("Unexpected sign up error:", err);
      setErrorMessage(getUnexpectedErrorMessage());
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleVerify = async () => {
    if (!code) {
      setVerifyErrorMessage("Please enter the code we sent you.");
      return;
    }
    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;
    setVerifyErrorMessage("");

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });

      if (error && error.code !== "verification_already_verified") {
        setVerifyErrorMessage(getFriendlyErrorMessage(error));
        return;
      }

      if (signUp.status !== "complete") {
        console.warn("Sign-up status:", signUp.status);
        console.warn("Unverified fields:", signUp.unverifiedFields);
        console.warn("Missing fields:", (signUp as any).missingFields);
        setVerifyErrorMessage(
          "Your account needs a bit more info before it's ready.",
        );
        return;
      }

      const { error: finalizeError } = await signUp.finalize();

      if (finalizeError) {
        setVerifyErrorMessage(getFriendlyErrorMessage(finalizeError));
        return;
      }

      router.replace("/(tabs)");
    } catch (err) {
      console.error("Unexpected verify error:", err);
      setVerifyErrorMessage(getUnexpectedErrorMessage());
    } finally {
      isVerifyingRef.current = false;
    }
  };

  // Email verification screen
  if (isVerifying) {
    return (
      <SafeAreaView className="flex-1 bg-primary dark:bg-secondary">
        <KeyboardAwareScrollView
          bottomOffset={40}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 32,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-center text-2xl font-bold text-primary-foreground dark:text-foreground mb-2">
            Verify Email
          </Text>
          <Text className="text-center text-muted-foreground mb-6">
            We sent a code to {emailAddress}
          </Text>

          <TextInput
            className="h-14 border border-border rounded-2xl px-4 mb-4 text-foreground bg-card"
            placeholder="Enter verification code"
            value={code}
            onChangeText={(text) => {
              setCode(text);
              if (verifyErrorMessage) setVerifyErrorMessage("");
            }}
            keyboardType="numeric"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <FormError message={verifyErrorMessage} />

          <Pressable
            className="h-14 bg-primary rounded-2xl justify-center items-center mb-4"
            disabled={isLoading || !code}
            onPress={handleVerify}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">Verify</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setIsVerifying(false);
              setCode("");
              setVerifyErrorMessage("");
            }}
            className="py-2"
          >
            <Text className="text-center text-primary font-semibold">
              Back to Sign Up
            </Text>
          </Pressable>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  // Main sign-up screen
  return (
    // <SafeAreaView className="flex-1 bg-card">
    <KeyboardAwareScrollView
      className="flex-1 bg-card"
      bottomOffset={40}
      style={{ paddingHorizontal: 24, paddingTop: 24 }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Back Button */}
      <Pressable onPress={() => router.back()} className="mb-4">
        <FontAwesome name="chevron-left" size={24} color={"#000"} />
      </Pressable>

      {/* Header */}
      <Text className="text-3xl font-bold text-foreground mb-1">
        Create Account
      </Text>
      <Text className="text-muted-foreground text-sm mb-6">
        Join us for healthy shopping
      </Text>

      {/* OAuth Section */}
      <Text className="text-xs font-semibold uppercase text-muted-foreground mb-3">
        Quick Sign Up
      </Text>

      <Pressable
        className={`mb-2 h-12 flex-row items-center justify-center rounded-xl border border-border bg-white px-4 active:opacity-90 ${
          loadingStrategy === "oauth_google" ? "opacity-70" : ""
        }`}
        disabled={loadingStrategy === "oauth_google"}
        onPress={() => handleSocialAuth("oauth_google")}
      >
        <FontAwesome name="google" size={18} color={"#DB4437"} />
        <Text className="ml-2 flex-1 text-sm font-semibold text-secondary">
          {loadingStrategy === "oauth_google" ? "Connecting.." : "Google"}
        </Text>
      </Pressable>

      <Pressable
        className={`mb-4 h-12 flex-row items-center justify-center rounded-xl border border-border bg-white px-4 active:opacity-90 ${
          loadingStrategy === "oauth_github" ? "opacity-70" : ""
        }`}
        disabled={loadingStrategy === "oauth_github"}
        onPress={() => handleSocialAuth("oauth_github")}
      >
        <FontAwesome name="github" size={18} color={"#111"} />
        <Text className="ml-2 flex-1 text-sm font-semibold text-secondary">
          {loadingStrategy === "oauth_github" ? "Connecting.." : "GitHub"}
        </Text>
      </Pressable>

      {/* Divider */}
      <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-border" />
        <Text className="mx-2 text-xs text-muted-foreground">or</Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      {/* Email Input */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 8,
          color: "#000",
        }}
      >
        Email Address
      </Text>
      <TextInput
        placeholder="your@email.com"
        placeholderTextColor="#999"
        value={emailAddress}
        onChangeText={(text) => {
          setEmailAddress(text);
          if (errorMessage) setErrorMessage("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
        style={{
          height: 48,
          borderWidth: 1,
          borderColor: "#e5e5e5",
          borderRadius: 8,
          paddingHorizontal: 12,
          marginBottom: 16,
          color: "#000",
          backgroundColor: "#fff",
          fontSize: 15,
        }}
      />

      {/* Password Input */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 8,
          color: "#000",
        }}
      >
        Password
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#e5e5e5",
          borderRadius: 8,
          marginBottom: 16,
          backgroundColor: "#fff",
        }}
      >
        <TextInput
          placeholder="Create password (min 8 chars)"
          placeholderTextColor="#999"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errorMessage) setErrorMessage("");
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          editable={!isLoading}
          style={{
            flex: 1,
            height: 48,
            paddingHorizontal: 12,
            color: "#000",
            fontSize: 15,
          }}
        />
        <Pressable
          style={{ paddingHorizontal: 12 }}
          onPress={() => setShowPassword(!showPassword)}
        >
          <FontAwesome
            name={showPassword ? "eye" : "eye-slash"}
            size={16}
            color={"#999"}
          />
        </Pressable>
      </View>

      <FormError message={errorMessage} />

      <Pressable
        className="h-12 bg-primary rounded-xl justify-center items-center mb-4"
        disabled={isLoading || !emailAddress || !password}
        onPress={handleSignUp}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">Create Account</Text>
        )}
      </Pressable>

      <View className="flex-row justify-center">
        <Text className="text-muted-foreground text-sm">
          Already have an account?{" "}
        </Text>
        <Pressable onPress={() => router.push("/signin")}>
          <Text className="text-primary font-semibold text-sm">Sign In</Text>
        </Pressable>
      </View>

      <View nativeID="clerk-captcha" />

      <Text className="mt-6 text-center text-sm leading-5 text-muted-foreground">
        By continuing, you agree to our Terms and Privacy Policy
      </Text>
    </KeyboardAwareScrollView>
    // </SafeAreaView>
  );
}
