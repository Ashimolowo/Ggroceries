// components/FormError.tsx
import { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export function FormError({ message }: { message: string }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-6)).current;

  useEffect(() => {
    if (message) {
      opacity.setValue(0);
      translateY.setValue(-6);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#FF999C",
        // backgroundColor: "#FFD580",
        padding: 12,
      }}
    >
      <FontAwesome
        name="exclamation-circle"
        size={18}
        color="#FF4B33"
        style={{ marginTop: 1 }}
      />
      <Text
        style={{
          flex: 1,
          color: "#B8300F",
          fontSize: 14,
          fontWeight: "600",
          lineHeight: 20,
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
}
