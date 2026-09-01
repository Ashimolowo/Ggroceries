import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Show, useClerk, useUser } from "@clerk/expo";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <View style={styles.container}>
      <Show when="signed-out">
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.description}>
          Sign in to your account or create a new one to get started.
        </Text>

        <Link href={"/(auth)/signin"} asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Sign in</Text>
          </Pressable>
        </Link>

        <Link href={"/(auth)/signup"} asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Sign up</Text>
          </Pressable>
        </Link>
      </Show>

      <Show when="signed-in">
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.email}>
          {user?.emailAddresses[0]?.emailAddress}
        </Text>

        <Pressable style={styles.signOutButton} onPress={() => signOut()}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </Show>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
  },
  description: {
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 15,
  },
  email: {
    color: "#666",
    fontSize: 15,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#5b4ff5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarInitial: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#5b4ff5",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    backgroundColor: "#fff",
  },
  secondaryButtonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: "#fdecea",
    backgroundColor: "#fdecea",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "100%",
  },
  signOutText: {
    color: "#c0392b",
    fontSize: 16,
    fontWeight: "600",
  },
});
