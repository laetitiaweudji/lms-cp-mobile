import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpen } from "lucide-react-native";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCourses, useAnnouncementCount } from "@/hooks/teacher/useCourses";
import { useTeacherStats } from "@/hooks/teacher/useTeacherStats";

export default function TeacherCoursesList() {
  const coursesQuery = useCourses();
  const announcementCount = useAnnouncementCount();
  const stats = useTeacherStats();

  const courses = coursesQuery.data ?? [];
  const isLoading = coursesQuery.isLoading;

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="My Courses" />
      <ScrollView
        contentContainerClassName="gap-4 p-4"
        refreshControl={
          <RefreshControl refreshing={coursesQuery.isRefetching} onRefresh={coursesQuery.refetch} />
        }
      >
        <HeroBanner eyebrow="Courses" title="My Courses" />

        <View className="flex-row gap-3">
          <StatCard label="Assigned Courses" value={courses.length} gradient={["#4f46e5", "#9333ea"]} />
          <StatCard
            label="Total Students"
            value={stats.data?.students ?? 0}
            gradient={["#2563eb", "#4f46e5"]}
          />
          <StatCard
            label="Announcements"
            value={announcementCount.data ?? 0}
            gradient={["#9333ea", "#c026d3"]}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#4f46e5" />
        ) : courses.length === 0 ? (
          <EmptyState icon={BookOpen} title="No courses assigned yet." />
        ) : (
          courses.map((course) => (
            <View key={course.id} className="gap-2 rounded-2xl bg-card p-4 shadow-sm">
              <View className="flex-row items-start justify-between">
                <Text className="flex-1 text-base font-semibold text-text-primary">
                  {course.title}
                </Text>
                <Badge label={course.code} />
              </View>
              {course.description && (
                <Text className="text-sm text-text-secondary">{course.description}</Text>
              )}
              <Pressable
                onPress={() => router.push(`/(teacher)/courses/${course.id}`)}
                className="mt-1 self-start"
              >
                <Text className="text-sm font-semibold text-primary-600">View Course</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
