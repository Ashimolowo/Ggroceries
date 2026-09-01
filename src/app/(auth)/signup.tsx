// app/signup.tsx
import { useSignUp } from "@clerk/expo";
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

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyErrorMessage, setVerifyErrorMessage] = useState("");

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

      router.replace("/");
    } catch (err) {
      console.error("Unexpected verify error:", err);
      setVerifyErrorMessage(getUnexpectedErrorMessage());
    } finally {
      isVerifyingRef.current = false;
    }
  };

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.description}>We sent a verification code to:</Text>
        <Text style={styles.email}>{emailAddress}</Text>

        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          onChangeText={(text) => {
            setCode(text);
            if (verifyErrorMessage) setVerifyErrorMessage("");
          }}
          keyboardType="numeric"
          autoCapitalize="none"
        />

        {verifyErrorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.error}>{verifyErrorMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.buttonDisabled]}
          onPress={handleVerify}
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
            setIsVerifying(false);
            setCode("");
            setVerifyErrorMessage("");
          }}
          style={{ marginTop: 16, alignItems: "center" }}
        >
          <Text style={styles.link}>Back to sign up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.description}>
        Welcome! Please fill in the details to get started.
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
        value={password}
        placeholder="Create a password"
        secureTextEntry
        onChangeText={(text) => {
          setPassword(text);
          if (errorMessage) setErrorMessage("");
        }}
        editable={!isLoading}
        autoCapitalize="none"
      />

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.continueButton, isLoading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={isLoading || !emailAddress || !password}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueText}>Continue</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/signin")}>
          <Text style={styles.link}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <View nativeID="clerk-captcha" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 10, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  description: { color: "#666", textAlign: "center", marginBottom: 8 },
  email: { fontWeight: "600", marginBottom: 8 },
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
