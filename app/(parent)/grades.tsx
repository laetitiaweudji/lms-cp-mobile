import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ClipboardList } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/ui/StatCard";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaginatedList } from "@/components/list/PaginatedList";
import { SelectField } from "@/components/forms/SelectField";
import { useChildren } from "@/hooks/parent/useChildren";
import { useGrades } from "@/hooks/parent/useGrades";
import { totalPages } from "@/utils/pagination";
import { formatDate } from "@/utils/date";
import type { ParentGrade } from "@/types/parent";

export default function ParentGrades() {
  const { studentId: studentIdParam } = useLocalSearchParams<{ studentId?: string }>();
  const { data: childrenData } = useChildren();
  const children = childrenData?.children ?? [];

  const [studentId, setStudentId] = useState<string | null>(studentIdParam ?? null);
  useEffect(() => {
    if (studentIdParam) setStudentId(studentIdParam);
  }, [studentIdParam]);

  const [page, setPage] = useState(1);
  const { data, isLoading, isRefetching, refetch } = useGrades(page, studentId ?? undefined);

  const grades = data?.grades ?? [];
  const averagePct = useMemo(() => {
    if (grades.length === 0) return 0;
    return Math.round(
      grades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / grades.length
    );
  }, [grades]);

  const selectedChild = children.find((c) => c.student_id === studentId);

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Grades" subtitle={selectedChild ? undefined : "Select a student →"} />
      <PaginatedList<ParentGrade>
        data={studentId ? grades : []}
        keyExtractor={(item) => item.id}
        isRefreshing={isRefetching || isLoading}
        onRefresh={refetch}
        page={page}
        totalPages={totalPages(data?.total ?? 0, data?.pageSize ?? 20)}
        onPageChange={setPage}
        emptyState={
          !studentId ? (
            <EmptyState icon={ClipboardList} title="Select a student to view grades." />
          ) : isLoading ? (
            <View className="items-center py-12">
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : (
            <EmptyState icon={ClipboardList} title="No grades available." />
          )
        }
        ListHeaderComponent={
          <View className="gap-4 p-4">
            <SelectField
              label="Student"
              placeholder="Select a student"
              value={studentId}
              options={children.map((c) => ({ label: c.profiles.full_name, value: c.student_id }))}
              onChange={setStudentId}
            />
            {studentId && (
              <View className="flex-row gap-3">
                <StatCard label="Average" value={`${averagePct}%`} gradient={["#2563eb", "#1d4ed8"]} />
                <StatCard label="Total Grades" value={data?.total ?? 0} gradient={["#4f46e5", "#9333ea"]} />
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View className="mx-4 flex-row items-center justify-between rounded-2xl bg-card p-4 shadow-sm">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-text-primary">
                {item.profiles.full_name}
              </Text>
              <Text className="text-xs text-text-muted">
                {item.courses.title} · {item.assessment_type}
              </Text>
              <Text className="text-xs text-text-muted">{formatDate(item.created_at)}</Text>
            </View>
            <ScoreBadge score={item.score} maxScore={item.max_score} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
