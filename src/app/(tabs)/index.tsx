import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { UserButton } from "@clerk/expo/native";
import { Link } from "expo-router";
import { Show, useUser } from "@clerk/expo";
import TabScreenBackground from "@/components/TabScreenBackground";
import ListHeroCard from "@/components/list/ListHeroCard";
import { useGgoceriesStore } from "@/store/ggoceries-store";
import PendingItemCard from "@/components/list/PendingItemCard";

export default function Home() {
const {items} = useGgoceriesStore()

const pendingItems = items.filter((item) => !item.purchased)
  return (
    <ScrollView className="flex-1 bg-background py-4" showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20, gap:14}}>
        <TabScreenBackground />
        <ListHeroCard />

        <View className="flex-row items-center justify-between px-1">
          <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">Shopping items</Text>
        </View>

        {pendingItems.map(item => <PendingItemCard key={item.id} item={item}/>)}
    </ScrollView>
     
  );
}


