// import { useSSO } from "@clerk/expo";
// import { useState } from "react";
// import { Alert } from "react-native";

// const useSocialAuth = () => {
//   const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
//   const { startSSOFlow } = useSSO();

//   const handleSocialAuth = async (
//     strategy: "oauth_google" | "oauth_github",
//   ) => {
//     if (loadingStrategy) return;
//     setLoadingStrategy(strategy);

//     try {
//       const { createdSessionId, setActive } = await startSSOFlow({ strategy });

//       if (!createdSessionId || !setActive) {
//         Alert.alert("Sign-in incomplete", "Sign in failed. Please try again");
//         return;
//       }

//       await setActive({ session: createdSessionId });
//     } catch (error) {
//       console.log("📛📛 Error occurred with the social login", error);
//       Alert.alert("Error", "Sign in Failed");
//     } finally {
//       setLoadingStrategy(null);
//     }
//   };

//   // Return OUTSIDE the handleSocialAuth function
//   return { handleSocialAuth, loadingStrategy };
// };

// export default useSocialAuth;


import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

const useSocialAuth = () => {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (
    strategy: "oauth_google" | "oauth_github",
  ) => {
    if (loadingStrategy) return; // Prevent multiple simultaneous flows
    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      if (!createdSessionId || !setActive) {
        console.warn(`${strategy}: No session created`);
        Alert.alert("Sign-in incomplete", "Please try again");
        return;
      }

      await setActive({ session: createdSessionId });
      // Navigation happens automatically via useSession hook
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || "";

      // Don't show alert for user cancellations
      if (
        errorMessage.includes("cancel") ||
        errorMessage.includes("dismiss") ||
        errorMessage.includes("user cancelled")
      ) {
        console.log(`${strategy}: User cancelled`);
        return;
      }

      console.error(`${strategy} sign-in error:`, error);
      Alert.alert(
        "Sign In Failed",
        "An error occurred during sign-in. Please try again.",
      );
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

export default useSocialAuth;