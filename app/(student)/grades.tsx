import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ClipboardList } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaginatedList } from "@/components/list/PaginatedList";
import { useGrades } from "@/hooks/student/useGrades";
import { totalPages } from "@/utils/pagination";
import type { StudentGrade } from "@/types/student";

function standingFor(pct: number) {
  if (pct >= 85) return "Excellent";
  if (pct >= 70) return "Good";
  if (pct >= 50) return "Needs Improvement";
  return "At Risk";
}

export default function StudentGrades() {
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const [page, setPage] = useState(1);
  const { data, isLoading, isRefetching, refetch } = useGrades(page, courseId);

  const grades = data?.grades ?? [];

  const averagePct = useMemo(() => {
    if (grades.length === 0) return 0;
    return Math.round(
      grades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / grades.length
    );
  }, [grades]);

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Grades" />
      <PaginatedList<StudentGrade>
        data={grades}
        keyExtractor={(item) => item.id}
        isRefreshing={isRefetching || isLoading}
        onRefresh={refetch}
        page={page}
        totalPages={totalPages(data?.total ?? 0, data?.pageSize ?? 20)}
        onPageChange={setPage}
        emptyState={
          !isLoading ? (
            <EmptyState
              icon={ClipboardList}
              title="No grades found."
              message="Your grades will appear here once teachers publish them."
            />
          ) : (
            <View />
          )
        }
        ListHeaderComponent={
          <View className="gap-4 p-4">
            <HeroBanner
              eyebrow="Grades"
              title="Track your academic progress clearly."
              description="See how you're performing across every course."
            />
            <View className="flex-row gap-3">
              <StatCard label="Overall Average" value={`${averagePct}%`} gradient={["#2563eb", "#1d4ed8"]} />
              <StatCard label="Total Assessments" value={data?.total ?? 0} gradient={["#7e22ce", "#9333ea"]} />
            </View>
            <StatCard label="Standing" value={standingFor(averagePct)} gradient={["#10b981", "#0891b2"]} />
          </View>
        }
        renderItem={({ item }) => {
          const pct = item.max_score > 0 ? Math.round((item.score / item.max_score) * 100) : 0;
          const isPassing = pct >= 70;
          return (
            <View className="mx-4 flex-row items-center justify-between rounded-2xl bg-card p-4 shadow-sm">
              <View className="flex-1">
                <Text className="text-base font-semibold text-text-primary">
                  {item.courses.title}
                </Text>
                <Text className="text-xs text-text-muted">{item.assessment_type}</Text>
              </View>
              <View className="items-end">
                <Text
                  className={`text-sm font-bold ${isPassing ? "text-success" : "text-danger"}`}
                >
                  {item.score}/{item.max_score} ({pct}%)
                </Text>
                <Text className={`text-xs ${isPassing ? "text-success" : "text-danger"}`}>
                  {isPassing ? "Passing" : "Below Target"}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
