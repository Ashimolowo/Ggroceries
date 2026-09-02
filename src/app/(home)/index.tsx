import { View, Text, Pressable, StyleSheet } from "react-native";
import { UserButton } from "@clerk/expo/native";
import { Link } from "expo-router";
import { Show, useUser } from "@clerk/expo";

export default function Home() {
  const { user } = useUser();

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
        <View style={styles.userButtonWrap}>
          <UserButton />
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.email}>
          {user?.emailAddresses[0]?.emailAddress}
        </Text>
        <Text style={styles.hint}>Tap your avatar to manage your profile</Text>
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
  },
  hint: {
    color: "#999",
    fontSize: 13,
    marginTop: 4,
  },
  userButtonWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    marginBottom: 12,
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
});
