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
  const [errorMessage, setErrorMessage] = useState("");

  const isSubmittingRef = useRef(false);
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
