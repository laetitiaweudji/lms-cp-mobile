import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { useDashboard } from "@/hooks/parent/useDashboard";
import { useAuth } from "@/hooks/auth/useAuth";
import { formatDate } from "@/utils/date";

export default function ParentDashboard() {
  const { profile } = useAuth();
  const { data, isLoading, isRefetching, refetch } = useDashboard();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-page" edges={["top"]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  const children = data?.children ?? [];
  const announcements = data?.announcements ?? [];
  const recentGrades = data?.recentGrades ?? [];

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Dashboard" />
      <ScrollView
        contentContainerClassName="gap-4 p-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <HeroBanner
          eyebrow="Parent Workspace"
          title="Parent Workspace"
          description={`Welcome back, ${profile?.full_name}! Monitor your students' academic progress and stay updated.`}
        />

        <View className="flex-row gap-3">
          <StatCard label="Linked Students" value={children.length} gradient={["#2563eb", "#1d4ed8"]} />
          <StatCard label="Announcements" value={announcements.length} gradient={["#4f46e5", "#9333ea"]} />
          <StatCard label="Grade Records" value={recentGrades.length} gradient={["#7e22ce", "#9333ea"]} />
        </View>

        <View className="gap-2 rounded-2xl bg-card p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-text-primary">Recent Announcements</Text>
            <Pressable onPress={() => router.push("/(parent)/announcements")}>
              <Text className="text-sm font-semibold text-primary-600">View all →</Text>
            </Pressable>
          </View>
          {announcements.length === 0 ? (
            <Text className="text-sm text-text-muted">No announcements yet.</Text>
          ) : (
            announcements.slice(0, 4).map((a) => (
              <View key={a.id} className="gap-1 border-t border-neutral-100 pt-2">
                <Text className="text-xs font-medium text-primary-600">
                  {a.courses?.title ?? "General"}
                </Text>
                <Text className="text-sm font-semibold text-text-primary">{a.title}</Text>
                <Text className="text-xs text-text-muted">{formatDate(a.created_at)}</Text>
              </View>
            ))
          )}
        </View>

        <View className="gap-2 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-base font-bold text-text-primary">Quick Actions</Text>
          <Pressable onPress={() => router.push("/(parent)/children")}>
            <Text className="text-sm font-semibold text-primary-600">My Students</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/(parent)/grades")}>
            <Text className="text-sm font-semibold text-primary-600">Grades</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/(parent)/announcements")}>
            <Text className="text-sm font-semibold text-primary-600">Announcements</Text>
          </Pressable>
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Linked Students</Text>
          {children.map((child) => (
            <View
              key={child.student_id}
              className="flex-row items-center justify-between rounded-2xl bg-card p-4 shadow-sm"
            >
              <View>
                <Text className="text-sm font-semibold text-text-primary">
                  {child.profiles?.full_name ?? "Unknown student"}
                </Text>
                <Text className="text-xs text-text-muted">{child.profiles?.email ?? ""}</Text>
              </View>
              <Pressable
                onPress={() =>
                  router.push({ pathname: "/(parent)/grades", params: { studentId: child.student_id } })
                }
              >
                <Text className="text-sm font-semibold text-primary-600">Grades →</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
