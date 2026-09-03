import { View, ActivityIndicator,  } from "react-native";
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import {useColorScheme} from "nativewind";
import { useGgoceriesStore } from "@/store/ggoceries-store";
import { useEffect } from "react";

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  const {loadItems, items} = useGgoceriesStore()

  const {colorScheme} = useColorScheme()
  const isDark = colorScheme === "dark"
  const tabTintColor = isDark ? "hsl(142 70% 54%)" : "hsl(147 75% 33%)"
 
 useEffect(() => {
  loadItems()
 }, [])

 console.log("{ITEMS}", items)
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/signin"} />;
  }
  return (
    <NativeTabs tintColor={tabTintColor}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>List</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "list.bullet.clipboard",
            selected: "list.bullet.clipboard.fill",
          }}
          md="contract"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="planner">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "plus.circle",
            selected: "plus.circle.fill",
          }}

          md="heart_plus"
        />
        <NativeTabs.Trigger.Label>Planner</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="insights">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "chart.bar",
            selected: "chart.bar.fill",
          }}

          md="android_cell_5_bar"
        />
        <NativeTabs.Trigger.Label>Insights</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
