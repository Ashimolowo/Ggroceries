// // app/signup.tsx
// import { useSignUp } from "@clerk/expo";
// import { useRouter } from "expo-router";
// import { useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { OAuthButtons, OrDivider } from "@/components/OAuthButtons";
// import { getFriendlyErrorMessage, getUnexpectedErrorMessage } from "../utils";

// export default function SignUpScreen() {
//   const { signUp, fetchStatus } = useSignUp();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [code, setCode] = useState("");

//   const [isVerifying, setIsVerifying] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [verifyErrorMessage, setVerifyErrorMessage] = useState("");

//   const isSubmittingRef = useRef(false);
//   const isVerifyingRef = useRef(false);

//   const isLoading = fetchStatus === "fetching";

//   const handleSignUp = async () => {
//     if (!emailAddress || !password) {
//       setErrorMessage("Please enter your email and password.");
//       return;
//     }
//     if (isSubmittingRef.current) return;
//     isSubmittingRef.current = true;
//     setErrorMessage("");

//     try {
//       const { error } = await signUp.password({
//         emailAddress: emailAddress.trim(),
//         password,
//       });

//       if (error) {
//         setErrorMessage(getFriendlyErrorMessage(error));
//         return;
//       }

//       const { error: sendError } = await signUp.verifications.sendEmailCode();

//       if (sendError) {
//         setErrorMessage(getFriendlyErrorMessage(sendError));
//         return;
//       }

//       setIsVerifying(true);
//     } catch (err) {
//       console.error("Unexpected sign up error:", err);
//       setErrorMessage(getUnexpectedErrorMessage());
//     } finally {
//       isSubmittingRef.current = false;
//     }
//   };

//   const handleVerify = async () => {
//     if (!code) {
//       setVerifyErrorMessage("Please enter the code we sent you.");
//       return;
//     }
//     if (isVerifyingRef.current) return;
//     isVerifyingRef.current = true;
//     setVerifyErrorMessage("");

//     try {
//       const { error } = await signUp.verifications.verifyEmailCode({ code });

//       if (error && error.code !== "verification_already_verified") {
//         setVerifyErrorMessage(getFriendlyErrorMessage(error));
//         return;
//       }

//       if (signUp.status !== "complete") {
//         console.warn("Sign-up status:", signUp.status);
//         console.warn("Unverified fields:", signUp.unverifiedFields);
//         console.warn("Missing fields:", (signUp as any).missingFields);
//         setVerifyErrorMessage(
//           "Your account needs a bit more info before it's ready.",
//         );
//         return;
//       }

//       const { error: finalizeError } = await signUp.finalize();

//       if (finalizeError) {
//         setVerifyErrorMessage(getFriendlyErrorMessage(finalizeError));
//         return;
//       }

//       router.replace("/");
//     } catch (err) {
//       console.error("Unexpected verify error:", err);
//       setVerifyErrorMessage(getUnexpectedErrorMessage());
//     } finally {
//       isVerifyingRef.current = false;
//     }
//   };

//   if (isVerifying) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Verify your email</Text>
//         <Text style={styles.description}>We sent a verification code to:</Text>
//         <Text style={styles.email}>{emailAddress}</Text>

//         <TextInput
//           style={styles.input}
//           value={code}
//           placeholder="Enter verification code"
//           onChangeText={(text) => {
//             setCode(text);
//             if (verifyErrorMessage) setVerifyErrorMessage("");
//           }}
//           keyboardType="numeric"
//           autoCapitalize="none"
//         />

//         {verifyErrorMessage ? (
//           <View style={styles.errorBox}>
//             <Text style={styles.error}>{verifyErrorMessage}</Text>
//           </View>
//         ) : null}

//         <TouchableOpacity
//           style={[styles.continueButton, isLoading && styles.buttonDisabled]}
//           onPress={handleVerify}
//           disabled={isLoading || !code}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.continueText}>Verify</Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => {
//             setIsVerifying(false);
//             setCode("");
//             setVerifyErrorMessage("");
//           }}
//           style={{ marginTop: 16, alignItems: "center" }}
//         >
//           <Text style={styles.link}>Back to sign up</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create your account</Text>
//       <Text style={styles.description}>
//         Welcome! Please fill in the details to get started.
//       </Text>

//       <OAuthButtons />
//       <OrDivider />

//       <Text style={styles.label}>Email address</Text>
//       <TextInput
//         style={styles.input}
//         autoCapitalize="none"
//         autoCorrect={false}
//         value={emailAddress}
//         placeholder="Enter your email address"
//         onChangeText={(text) => {
//           setEmailAddress(text);
//           if (errorMessage) setErrorMessage("");
//         }}
//         keyboardType="email-address"
//         editable={!isLoading}
//       />

//       <Text style={styles.label}>Password</Text>
//       <TextInput
//         style={styles.input}
//         value={password}
//         placeholder="Create a password"
//         secureTextEntry
//         onChangeText={(text) => {
//           setPassword(text);
//           if (errorMessage) setErrorMessage("");
//         }}
//         editable={!isLoading}
//         autoCapitalize="none"
//       />

//       {errorMessage ? (
//         <View style={styles.errorBox}>
//           <Text style={styles.error}>{errorMessage}</Text>
//         </View>
//       ) : null}

//       <TouchableOpacity
//         style={[styles.continueButton, isLoading && styles.buttonDisabled]}
//         onPress={handleSignUp}
//         disabled={isLoading || !emailAddress || !password}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.continueText}>Continue</Text>
//         )}
//       </TouchableOpacity>

//       <View style={styles.footerRow}>
//         <Text style={styles.footerText}>Already have an account? </Text>
//         <TouchableOpacity onPress={() => router.push("/signin")}>
//           <Text style={styles.link}>Sign in</Text>
//         </TouchableOpacity>
//       </View>

//       <View nativeID="clerk-captcha" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 24, gap: 10, justifyContent: "center" },
//   title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
//   description: { color: "#666", textAlign: "center", marginBottom: 8 },
//   email: { fontWeight: "600", marginBottom: 8 },
//   label: { fontSize: 13, fontWeight: "600", color: "#333", marginTop: 6 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 15,
//   },
//   errorBox: { backgroundColor: "#fdecea", borderRadius: 8, padding: 10 },
//   error: { color: "#c0392b", fontSize: 14 },
//   continueButton: {
//     backgroundColor: "#5b4ff5",
//     borderRadius: 8,
//     padding: 14,
//     alignItems: "center",
//     marginTop: 8,
//   },
//   buttonDisabled: { opacity: 0.6 },
//   continueText: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
//   footerText: { color: "#666", fontSize: 15 },
//   link: { color: "#5b4ff5", fontSize: 15, fontWeight: "600" },
// });

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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { getFriendlyErrorMessage, getUnexpectedErrorMessage } from "../utils";

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

      router.replace("/(home)");
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
      <SafeAreaView className="flex-1 bg-primary dark:bg-secondary px-6 py-8">
        <View className="flex-1 justify-center">
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

          {verifyErrorMessage ? (
            <View className="bg-destructive/10 border border-destructive rounded-lg p-3 mb-4">
              <Text className="text-destructive text-sm">
                {verifyErrorMessage}
              </Text>
            </View>
          ) : null}

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
        </View>
      </SafeAreaView>
    );
  }

  // Main sign-up screen
  return (
    <SafeAreaView className="flex-1 bg-card">
      <ScrollView
        className="px-6 pt-6 pb-8"
        showsVerticalScrollIndicator={false}
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
          <Text className="ml-2 flex-1 text-sm font-semibold text-foreground">
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
          <Text className="ml-2 flex-1 text-sm font-semibold text-foreground">
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
        <Text className="text-sm font-semibold text-foreground mb-2">
          Email Address
        </Text>
        <TextInput
          className="h-12 border border-border rounded-lg px-3 mb-3 text-foreground bg-white"
          placeholder="your@email.com"
          value={emailAddress}
          onChangeText={(text) => {
            setEmailAddress(text);
            if (errorMessage) setErrorMessage("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        {/* Password Input */}
        <Text className="text-sm font-semibold text-foreground mb-2">
          Password
        </Text>
        <View className="flex-row items-center border border-border rounded-lg mb-4 bg-white">
          <TextInput
            className="flex-1 h-12 px-3 text-foreground"
            placeholder="Create password (min 8 chars)"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMessage) setErrorMessage("");
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <Pressable
            className="px-3"
            onPress={() => setShowPassword(!showPassword)}
          >
            <FontAwesome
              name={showPassword ? "eye" : "eye-slash"}
              size={16}
              color={"#999"}
            />
          </Pressable>
        </View>

        {/* Error Message */}
        {errorMessage ? (
          <View className="bg-destructive/10 border border-destructive rounded-lg p-3 mb-4">
            <Text className="text-destructive text-sm">{errorMessage}</Text>
          </View>
        ) : null}

        {/* Sign Up Button */}
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

        {/* Navigation to Sign In */}
        <View className="flex-row justify-center">
          <Text className="text-muted-foreground text-sm">
            Already have an account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/signin")}>
            <Text className="text-primary font-semibold text-sm">Sign In</Text>
          </Pressable>
        </View>

        <View nativeID="clerk-captcha" />
      </ScrollView>
    </SafeAreaView>
  );
}