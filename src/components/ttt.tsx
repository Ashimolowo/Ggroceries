// // components/OAuthButtons.tsx
// import { useSSO } from "@clerk/expo";
// import { useRouter } from "expo-router";
// import * as WebBrowser from "expo-web-browser";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// WebBrowser.maybeCompleteAuthSession();

// export function OAuthButtons() {
//   const { startSSOFlow } = useSSO();
//   const router = useRouter();

//   const handleOAuth = async (strategy: "oauth_github" | "oauth_google") => {
//     try {
//       const { createdSessionId, setActive } = await startSSOFlow({ strategy });

//       if (createdSessionId && setActive) {
//         await setActive({ session: createdSessionId });
//         router.replace("/");
//       }
//     } catch (err) {
//       console.error(`${strategy} sign-in error:`, err);
//     }
//   };

//   return (
//     <View style={styles.row}>
//       <TouchableOpacity
//         style={[styles.oauthButton, styles.githubButton]}
//         onPress={() => handleOAuth("oauth_github")}
//       >
//         <Text style={styles.githubText}>GitHub</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.oauthButton, styles.googleButton]}
//         onPress={() => handleOAuth("oauth_google")}
//       >
//         <Text style={styles.googleText}>Google</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// export function OrDivider() {
//   return (
//     <View style={styles.dividerRow}>
//       <View style={styles.dividerLine} />
//       <Text style={styles.dividerText}>or</Text>
//       <View style={styles.dividerLine} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   row: { flexDirection: "row", gap: 10 },
//   oauthButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 8,
//     paddingVertical: 12,
//     borderWidth: 1,
//   },
//   githubButton: { backgroundColor: "#fff", borderColor: "#ddd" },
//   googleButton: { backgroundColor: "#f5f5f5", borderColor: "#ddd" },
//   githubText: { fontWeight: "600", color: "#111" },
//   googleText: { fontWeight: "600", color: "#111" },
//   dividerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     marginVertical: 4,
//   },
//   dividerLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
//   dividerText: { color: "#999", fontSize: 13 },
// });


// // components/OAuthButtons.tsx
// import { useSSO } from "@clerk/expo";
// import { useRouter } from "expo-router";
// import * as WebBrowser from "expo-web-browser";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import Svg, { Path } from "react-native-svg";
// import * as AuthSession from "expo-auth-session";

// WebBrowser.maybeCompleteAuthSession();

// function GoogleIcon({ size = 18 }: { size?: number }) {
//   return (
//     <Svg width={size} height={size} viewBox="0 0 48 48">
//       <Path
//         fill="#FFC107"
//         d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
//       />
//       <Path
//         fill="#FF3D00"
//         d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.6 4 24 4c-7.4 0-13.7 4.2-16.9 10.4z"
//       />
//       <Path
//         fill="#4CAF50"
//         d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5C29.6 34.6 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.3 39.6 16.1 44 24 44z"
//       />
//       <Path
//         fill="#1976D2"
//         d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.4 35.4 44 30 44 24c0-1.3-.1-2.7-.4-3.5z"
//       />
//     </Svg>
//   );
// }

// export function OAuthButtons() {
//   const { startSSOFlow } = useSSO();
//   const router = useRouter();

//   // const handleOAuth = async (strategy: "oauth_github" | "oauth_google") => {
//   //   try {
//   //     const { createdSessionId, setActive } = await startSSOFlow({ strategy });

//   //     if (createdSessionId && setActive) {
//   //       await setActive({ session: createdSessionId });
//   //       router.replace("/");
//   //     }
//   //   } catch (err) {
//   //     console.error(`${strategy} sign-in error:`, err);
//   //   }
//   // };

//   const handleOAuth = async (strategy: "oauth_github" | "oauth_google") => {
//     try {
//       const redirectUrl = AuthSession.makeRedirectUri({ scheme: "ggoceries" });

//       const { createdSessionId, setActive } = await startSSOFlow({
//         strategy,
//         redirectUrl,
//       });

//       if (createdSessionId && setActive) {
//         await setActive({ session: createdSessionId });
//         router.replace("/");
//       }
//     } catch (err) {
//       console.error(`${strategy} sign-in error:`, err);
//     }
//   };

//   return (
//     <View style={styles.row}>
//       <TouchableOpacity
//         style={[styles.oauthButton, styles.githubButton]}
//         onPress={() => handleOAuth("oauth_github")}
//       >
//         <FontAwesome name="github" size={18} color="#111" />
//         <Text style={styles.githubText}>GitHub</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.oauthButton, styles.googleButton]}
//         onPress={() => handleOAuth("oauth_google")}
//       >
//         <GoogleIcon size={18} />
//         <Text style={styles.googleText}>Google</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// export function OrDivider() {
//   return (
//     <View style={styles.dividerRow}>
//       <View style={styles.dividerLine} />
//       <Text style={styles.dividerText}>or</Text>
//       <View style={styles.dividerLine} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   row: { flexDirection: "row", gap: 10 },
//   oauthButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     borderRadius: 8,
//     paddingVertical: 12,
//     borderWidth: 1,
//   },
//   githubButton: { backgroundColor: "#fff", borderColor: "#ddd" },
//   googleButton: { backgroundColor: "#fff", borderColor: "#ddd" },
//   githubText: { fontWeight: "600", color: "#111", fontSize: 14 },
//   googleText: { fontWeight: "600", color: "#111", fontSize: 14 },
//   dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 4 },
//   dividerLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
//   dividerText: { color: "#999", fontSize: 13 },
// });
// components/OAuthButtons.tsx
// components/OAuthButtons.tsx
import { useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

WebBrowser.maybeCompleteAuthSession();

type OAuthStrategy = "oauth_github" | "oauth_google";

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <Path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.6 4 24 4c-7.4 0-13.7 4.2-16.9 10.4z"
      />
      <Path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5C29.6 34.6 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.3 39.6 16.1 44 24 44z"
      />
      <Path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.4 35.4 44 30 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </Svg>
  );
}

// Forces the OAuth promise to give up after `ms` milliseconds instead of
// hanging forever if the browser/redirect handoff gets stuck.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout: OAuth flow took too long")), ms)
    ),
  ]);
}

export function OAuthButtons() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  // Which strategy is currently mid-flow, if any. null = idle.
  const [activeStrategy, setActiveStrategy] = useState<OAuthStrategy | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleOAuth = async (strategy: OAuthStrategy) => {
    if (activeStrategy) return; // one flow at a time, ignore taps mid-flow
    setActiveStrategy(strategy);
    setErrorMessage("");

    try {
     const redirectUrl = AuthSession.makeRedirectUri({
       scheme: "ggoceries",
       path: "oauth-native-callback",
     });

      const result = await withTimeout(
        startSSOFlow({ strategy, redirectUrl }),
        45000
      );

      const { createdSessionId, setActive, signIn, signUp } = result as any;

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
        return;
      }

      // No session — inspect why instead of assuming cancellation.
      console.warn(`${strategy}: no session created. Full result:`, JSON.stringify(result, null, 2));

      if (signUp?.status && signUp.status !== "complete") {
        console.warn(`${strategy}: signUp status =`, signUp.status);
        console.warn(`${strategy}: signUp missing/unverified fields:`, signUp.missingFields, signUp.unverifiedFields);
        setErrorMessage("Your account needs a bit more info before it's ready.");
        return;
      }

      if (signIn?.status && signIn.status !== "complete") {
        console.warn(`${strategy}: signIn status =`, signIn.status);
        setErrorMessage("Additional verification is needed to sign in.");
        return;
      }

      // Genuinely no signIn/signUp object and no session — this is the
      // actual "user closed the browser" case.
      console.warn(`${strategy}: flow ended without a session (likely cancelled).`);
    } catch (err: any) {
      const message = (err?.message ?? "").toLowerCase();
      const isCancelled = message.includes("cancel") || message.includes("dismiss");
      const isTimeout = message.includes("timeout");

      if (isTimeout) {
        console.error(`${strategy} sign-in timed out.`);
        setErrorMessage("Sign-in is taking too long. Please try again.");
      } else if (!isCancelled) {
        console.error(`${strategy} sign-in error:`, err);
        setErrorMessage("Something went wrong signing in. Please try again.");
      }
    } finally {
      // Always runs — button can never get stuck spinning forever.
      setActiveStrategy(null);
    }
  };

  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.oauthButton,
            styles.githubButton,
            activeStrategy && styles.buttonDisabled,
          ]}
          onPress={() => handleOAuth("oauth_github")}
          disabled={!!activeStrategy}
        >
          {activeStrategy === "oauth_github" ? (
            <ActivityIndicator size="small" color="#111" />
          ) : (
            <>
              <FontAwesome name="github" size={18} color="#111" />
              <Text style={styles.githubText}>GitHub</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.oauthButton,
            styles.googleButton,
            activeStrategy && styles.buttonDisabled,
          ]}
          onPress={() => handleOAuth("oauth_google")}
          disabled={!!activeStrategy}
        >
          {activeStrategy === "oauth_google" ? (
            <ActivityIndicator size="small" color="#111" />
          ) : (
            <>
              <GoogleIcon size={18} />
              <Text style={styles.googleText}>Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function OrDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>or</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  oauthButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    minHeight: 44,
  },
  buttonDisabled: { opacity: 0.6 },
  githubButton: { backgroundColor: "#fff", borderColor: "#ddd" },
  googleButton: { backgroundColor: "#fff", borderColor: "#ddd" },
  githubText: { fontWeight: "600", color: "#111", fontSize: 14 },
  googleText: { fontWeight: "600", color: "#111", fontSize: 14 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  dividerText: { color: "#999", fontSize: 13 },
  errorBox: {
    backgroundColor: "#fdecea",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  error: { color: "#c0392b", fontSize: 13, textAlign: "center" },
});