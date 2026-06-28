import { useMemo } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { useDashboard } from "@/hooks/student/useDashboard";
import { formatDate } from "@/utils/date";

export default function StudentDashboard() {
  const { data, isLoading, isRefetching, refetch } = useDashboard();

  const stats = useMemo(() => {
    const enrollments = data?.enrollments ?? [];
    const grades = data?.recentGrades ?? [];
    const announcements = data?.announcements ?? [];

    const avgPct =
      grades.length > 0
        ? Math.round(
            grades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / grades.length
          )
        : 0;

    const upcomingDeadlines = announcements.filter(
      (a) => a.deadline && new Date(a.deadline).getTime() >= Date.now()
    );

    return {
      courses: enrollments.length,
      average: `${avgPct}%`,
      deadlines: upcomingDeadlines.length,
      recordings: data?.recordingCount ?? 0,
    };
  }, [data]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-page" edges={["top"]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Dashboard" />
      <ScrollView
        contentContainerClassName="gap-4 p-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <HeroBanner
          eyebrow="Student Workspace"
          title="Stay updated. Stay prepared."
          description="Track your courses, grades, and announcements in one place."
        />

        <View className="flex-row gap-3">
          <StatCard label="Courses" value={stats.courses} gradient={["#2563eb", "#1d4ed8"]} />
          <StatCard label="Average" value={stats.average} gradient={["#7e22ce", "#9333ea"]} />
        </View>
        <View className="flex-row gap-3">
          <StatCard label="Deadlines" value={stats.deadlines} gradient={["#f59e0b", "#ea580c"]} />
          <StatCard label="Recordings" value={stats.recordings} gradient={["#0891b2", "#0d9488"]} />
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Recent Announcements</Text>
          {(data?.announcements ?? []).length === 0 ? (
            <Text className="text-sm text-text-muted">No announcements yet.</Text>
          ) : (
            data!.announcements.slice(0, 4).map((a) => (
              <View key={a.id} className="rounded-2xl bg-card p-4 shadow-sm">
                <Text className="text-xs font-medium text-primary-600">{a.courses.title}</Text>
                <Text className="mt-1 text-base font-semibold text-text-primary">{a.title}</Text>
                <Text className="mt-1 text-xs text-text-muted">{formatDate(a.created_at)}</Text>
              </View>
            ))
          )}
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Upcoming Deadlines</Text>
          {(data?.announcements ?? []).filter((a) => a.deadline).length === 0 ? (
            <Text className="text-sm text-text-muted">No upcoming deadlines.</Text>
          ) : (
            data!.announcements
              .filter((a) => a.deadline)
              .map((a) => (
                <View key={a.id} className="flex-row items-center justify-between rounded-2xl bg-card p-4 shadow-sm">
                  <Text className="flex-1 text-sm font-medium text-text-primary">{a.title}</Text>
                  <Text className="text-xs text-warning">{formatDate(a.deadline)}</Text>
                </View>
              ))
          )}
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Enrolled Courses</Text>
          {(data?.enrollments ?? []).map((enrollment) => (
            <View key={enrollment.course_id} className="rounded-2xl bg-card p-4 shadow-sm">
              <Text className="text-base font-semibold text-text-primary">
                {enrollment.courses.title}
              </Text>
              {enrollment.courses.description && (
                <Text className="mt-1 text-sm text-text-secondary">
                  {enrollment.courses.description}
                </Text>
              )}
              <Pressable onPress={() => router.push("/(student)/courses")} className="mt-2 self-start">
                <Text className="text-sm font-semibold text-primary-600">View</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Grade Summary</Text>
          {(data?.recentGrades ?? []).length === 0 ? (
            <Text className="text-sm text-text-muted">No grades yet.</Text>
          ) : (
            data!.recentGrades.map((grade) => (
              <View
                key={grade.id}
                className="flex-row items-center justify-between rounded-2xl bg-card p-4 shadow-sm"
              >
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-text-primary">
                    {grade.assessment_name}
                  </Text>
                  <Text className="text-xs text-text-muted">
                    {grade.courses.title} · {grade.assessment_type}
                  </Text>
                </View>
                <ScoreBadge score={grade.score} maxScore={grade.max_score} />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
