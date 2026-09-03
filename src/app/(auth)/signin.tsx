import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import useSocialAuth from "@/hooks/useSocialAuth";
import {
  ActivityIndicator,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { getFriendlyErrorMessage, getUnexpectedErrorMessage } from "../utils";
import { FormError } from "@/components/FormError";

export default function SignInScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [needsTrustCode, setNeedsTrustCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSubmittingRef = useRef(false);
  const isVerifyingRef = useRef(false);
  const isLoading = fetchStatus === "fetching";

  const handleSignIn = async () => {
    if (!emailAddress || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setErrorMessage("");

    try {
      const { error } = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setErrorMessage(getFriendlyErrorMessage(error));
        return;
      }

      if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor: any) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
          setNeedsTrustCode(true);
          return;
        }

        setErrorMessage(
          "This device needs to be verified, but no verification method is available.",
        );
        return;
      }

      if (signIn.status !== "complete") {
        console.warn("Sign-in not complete:", signIn.status);
        setErrorMessage("Sign-in needs an extra step. Please try again.");
        return;
      }

      const { error: finalizeError } = await signIn.finalize();

      if (finalizeError) {
        setErrorMessage(getFriendlyErrorMessage(finalizeError));
        return;
      }

      router.replace("/(tabs)");
    } catch (err) {
      console.error("Unexpected sign in error:", err);
      setErrorMessage(getUnexpectedErrorMessage());
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleVerifyTrustCode = async () => {
    if (!code) {
      setErrorMessage("Please enter the code we sent you.");
      return;
    }
    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;
    setErrorMessage("");

    try {
      const { error } = await signIn.mfa.verifyEmailCode({ code });

      if (error) {
        setErrorMessage(getFriendlyErrorMessage(error));
        return;
      }

      if (signIn.status !== "complete") {
        console.warn(
          "Sign-in not complete after trust verification:",
          signIn.status,
        );
        setErrorMessage("Verification didn't complete. Please try again.");
        return;
      }

      const { error: finalizeError } = await signIn.finalize();

      if (finalizeError) {
        setErrorMessage(getFriendlyErrorMessage(finalizeError));
        return;
      }

      router.replace("/(tabs)");
    } catch (err) {
      console.error("Unexpected trust verification error:", err);
      setErrorMessage(getUnexpectedErrorMessage());
    } finally {
      isVerifyingRef.current = false;
    }
  };

  // Trust code verification screen
  if (needsTrustCode) {
    return (
      <SafeAreaView
        className="flex-1 bg-primary dark:bg-secondary px-6 py-8"
        edges={["top"]}
      >
        <View className="flex-1 justify-center">
          <Text className="text-center text-2xl font-bold text-primary-foreground dark:text-foreground mb-2">
            Verify This Device
          </Text>
          <Text className="text-center text-muted-foreground mb-6">
            We sent a verification code to {emailAddress}
          </Text>

          <TextInput
            className="h-14 border border-border rounded-2xl px-4 mb-4 text-foreground bg-card"
            placeholder="Enter verification code"
            value={code}
            onChangeText={(text) => {
              setCode(text);
              if (errorMessage) setErrorMessage("");
            }}
            keyboardType="numeric"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <FormError message={errorMessage} />

          <Pressable
            className="h-14 bg-primary rounded-2xl justify-center items-center mb-4"
            disabled={isLoading || !code}
            onPress={handleVerifyTrustCode}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">Verify</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setNeedsTrustCode(false);
              setCode("");
              setErrorMessage("");
            }}
            className="py-2"
          >
            <Text className="text-center text-primary font-semibold">
              Back to Sign In
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Main sign-in screen
  return (
    <SafeAreaView className="flex-1 bg-primary dark:bg-secondary">
      {/* Decorative elements */}
      <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/80 dark:bg-background/40" />
      <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/70 dark:bg-background/35" />

      {/* Header Section */}
      <View className="px-6 pt-4 pb-8">
        <Text className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground uppercase font-mono dark:text-foreground">
          Ggoceries
        </Text>

        <Text className="mt-1 text-center text-[14px] text-primary-foreground/80 dark:text-foreground">
          Fruitful diet. Healthy live
        </Text>

        <View className="mt-6 rounded-[30px] border border-white/20 bg-white/10 p-3">
          <Image
            source={require("../../../assets/images/auth.png")}
            style={{ width: "100%", height: 300 }}
            contentFit="contain"
          />
        </View>
      </View>

      {/* Auth Section */}
      <View className="mt-8 flex-1 rounded-t-[36px] bg-card">
        <ScrollView
          className="px-6 pt-6"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="self-center rounded-full bg-secondary px-3 py-1">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
              Welcome Back!
            </Text>
          </View>

          {/* OAuth Buttons */}
          <Text className="mt-4 text-center text-sm font-semibold text-foreground mb-4">
            Quick Sign In
          </Text>

          <Pressable
            className={`mb-3 h-14 flex-row items-center justify-center rounded-2xl border border-border bg-white px-4 active:opacity-90 ${
              loadingStrategy === "oauth_google" ? "opacity-70" : ""
            }`}
            disabled={loadingStrategy === "oauth_google"}
            onPress={() => handleSocialAuth("oauth_google")}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
              <Image
                source={require("../../../assets/images/google.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <Text className="ml-3 flex-1 text-base font-semibold text-secondary">
              {loadingStrategy === "oauth_google" ? "Connecting.." : "Google"}
            </Text>
            <FontAwesome name="chevron-right" color={"#999"} size={16} />
          </Pressable>

          <Pressable
            className={`mb-6 h-14 flex-row items-center justify-center rounded-2xl border border-border bg-white px-4 active:opacity-90 ${
              loadingStrategy === "oauth_github" ? "opacity-70" : ""
            }`}
            disabled={loadingStrategy === "oauth_github"}
            onPress={() => handleSocialAuth("oauth_github")}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
              <FontAwesome name="github" size={20} color={"#111"} />
            </View>
            <Text className="ml-3 flex-1 text-base font-semibold text-secondary">
              {loadingStrategy === "oauth_github" ? "Connecting.." : "GitHub"}
            </Text>
            <FontAwesome name="chevron-right" color={"#999"} size={16} />
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-3 text-xs text-muted-foreground uppercase">
              or
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Email Input */}
          <Text className="text-sm font-semibold text-foreground mb-2">
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
          <Text className="text-sm font-semibold text-foreground mb-2">
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
              placeholder="Enter password"
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
                size={18}
                color={"#999"}
              />
            </Pressable>
          </View>

          {/* Error Message */}
          <FormError message={errorMessage} />

          {/* Sign In Button */}
          <Pressable
            className="h-14 bg-primary rounded-2xl justify-center items-center mb-4"
            disabled={isLoading || !emailAddress || !password}
            onPress={handleSignIn}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Sign In
              </Text>
            )}
          </Pressable>

          {/* Navigation to Sign Up */}
          <View className="flex-row justify-center">
            <Text className="text-muted-foreground text-sm">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/signup")}>
              <Text className="text-primary font-semibold text-sm">
                Sign Up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <Text className="mt-3 text-center text-sm leading-5 text-muted-foreground">
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}
