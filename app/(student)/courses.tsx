import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { BookOpen, Search } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaginatedList } from "@/components/list/PaginatedList";
import { useCourses } from "@/hooks/student/useCourses";
import { totalPages } from "@/utils/pagination";
import type { StudentEnrollment } from "@/types/student";

export default function StudentCourses() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, isRefetching, refetch } = useCourses(page);

  const courses = data?.courses ?? [];
  const filtered = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.trim().toLowerCase();
    return courses.filter((c) => c.courses.title.toLowerCase().includes(q));
  }, [courses, search]);

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Courses" />
      <PaginatedList<StudentEnrollment>
        data={filtered}
        keyExtractor={(item) => item.course_id}
        isRefreshing={isRefetching || isLoading}
        onRefresh={refetch}
        page={page}
        totalPages={totalPages(data?.total ?? 0, data?.pageSize ?? 20)}
        onPageChange={setPage}
        emptyState={
          !isLoading ? (
            <EmptyState
              icon={BookOpen}
              title="No courses found."
              message="Your enrolled courses will appear here."
            />
          ) : (
            <View />
          )
        }
        ListHeaderComponent={
          <View className="gap-4 p-4">
            <HeroBanner
              eyebrow="Courses"
              title="Your learning hub in one place."
              description="Everything you're enrolled in, all in one view."
            />
            <StatCard
              label="Enrolled Courses"
              value={data?.total ?? 0}
              gradient={["#2563eb", "#1d4ed8"]}
            />
            <View className="flex-row items-center gap-2 rounded-xl border border-neutral-200 bg-input px-4">
              <Search size={18} color="#94a3b8" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search courses"
                placeholderTextColor="#94a3b8"
                className="flex-1 py-3 text-base text-text-primary"
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mx-4 gap-2 rounded-2xl bg-card p-4 shadow-sm">
            <View className="flex-row items-start justify-between">
              <Text className="flex-1 text-base font-semibold text-text-primary">
                {item.courses.title}
              </Text>
              <Badge label="Enrolled" bgColor="#d1fae5" textColor="#10b981" />
            </View>
            {item.courses.description && (
              <Text className="text-sm text-text-secondary">{item.courses.description}</Text>
            )}
            <Text className="text-xs text-text-muted">
              Taught by {item.courses.profiles.full_name}
            </Text>
            <View className="mt-2 flex-row gap-3">
              <Pressable
                onPress={() =>
                  router.push({ pathname: "/(student)/grades", params: { courseId: item.course_id } })
                }
              >
                <Text className="text-sm font-semibold text-primary-600">View Grades</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(student)/more/recordings",
                    params: { courseId: item.course_id },
                  })
                }
              >
                <Text className="text-sm font-semibold text-primary-600">Recordings</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/(student)/announcements")}>
                <Text className="text-sm font-semibold text-primary-600">Announcements</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
