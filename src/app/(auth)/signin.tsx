// app/signin.tsx
import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { OAuthButtons, OrDivider } from "@/components/OAuthButtons";
import { getFriendlyErrorMessage, getUnexpectedErrorMessage } from "../utils";

export default function SignInScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [needsTrustCode, setNeedsTrustCode] = useState(false);

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
        // New device — send a verification code to confirm it's really you.
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

      router.replace("/");
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

      router.replace("/");
    } catch (err) {
      console.error("Unexpected trust verification error:", err);
      setErrorMessage(getUnexpectedErrorMessage());
    } finally {
      isVerifyingRef.current = false;
    }
  };

  if (needsTrustCode) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify this device</Text>
        <Text style={styles.description}>
          We sent a verification code to {emailAddress} to confirm it's you.
        </Text>

        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          onChangeText={(text) => {
            setCode(text);
            if (errorMessage) setErrorMessage("");
          }}
          keyboardType="numeric"
          autoCapitalize="none"
        />

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.error}>{errorMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.buttonDisabled]}
          onPress={handleVerifyTrustCode}
          disabled={isLoading || !code}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueText}>Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setNeedsTrustCode(false);
            setCode("");
            setErrorMessage("");
          }}
          style={{ marginTop: 16, alignItems: "center" }}
        >
          <Text style={styles.link}>Back to sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to My Application</Text>
      <Text style={styles.description}>
        Welcome back! Please sign in to continue
      </Text>

      <OAuthButtons />
      <OrDivider />

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        value={emailAddress}
        placeholder="Enter your email address"
        onChangeText={(text) => {
          setEmailAddress(text);
          if (errorMessage) setErrorMessage("");
        }}
        keyboardType="email-address"
        editable={!isLoading}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={password}
        placeholder="Enter your password"
        secureTextEntry
        onChangeText={(text) => {
          setPassword(text);
          if (errorMessage) setErrorMessage("");
        }}
        editable={!isLoading}
      />

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.continueButton, isLoading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={isLoading || !emailAddress || !password}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueText}>Continue</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 10, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  description: { color: "#666", textAlign: "center", marginBottom: 8 },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  errorBox: { backgroundColor: "#fdecea", borderRadius: 8, padding: 10 },
  error: { color: "#c0392b", fontSize: 14 },
  continueButton: {
    backgroundColor: "#5b4ff5",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  continueText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  footerText: { color: "#666", fontSize: 15 },
  link: { color: "#5b4ff5", fontSize: 15, fontWeight: "600" },
});
