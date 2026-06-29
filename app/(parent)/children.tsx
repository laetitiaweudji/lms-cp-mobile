import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Users } from "lucide-react-native";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/EmptyState";
import { useChildren } from "@/hooks/parent/useChildren";

export default function ParentChildren() {
  const { data, isLoading, isRefetching, refetch } = useChildren();
  const children = data?.children ?? [];

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="My Students" subtitle={`${children.length} linked`} />
      <ScrollView
        contentContainerClassName="gap-4 p-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : children.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students linked to your account."
            message="Contact the administrator to link students to your account."
          />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {children.map((child) => (
              <View key={child.student_id} className="w-[47%] overflow-hidden rounded-2xl bg-card shadow-sm">
                <LinearGradient colors={["#2563eb", "#4f46e5"]} className="gap-1 p-3">
                  <Text className="text-sm font-semibold text-text-inverse">
                    {child.profiles?.full_name ?? "Unknown student"}
                  </Text>
                  <Text className="text-xs text-white/80">{child.profiles?.email ?? ""}</Text>
                </LinearGradient>
                <View className="gap-2 p-3">
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/(parent)/grades",
                        params: { studentId: child.student_id },
                      })
                    }
                  >
                    <Text className="text-sm font-semibold text-primary-600">View Grades</Text>
                  </Pressable>
                  <Pressable onPress={() => router.push("/(parent)/announcements")}>
                    <Text className="text-sm font-semibold text-primary-600">Announcements</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
