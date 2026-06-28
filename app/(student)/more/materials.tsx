import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FileText } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaginatedList } from "@/components/list/PaginatedList";
import { useMaterials } from "@/hooks/student/useMaterials";
import { formatDate } from "@/utils/date";
import { totalPages } from "@/utils/pagination";
import type { StudentMaterial } from "@/types/student";

export default function StudentMaterials() {
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const [page, setPage] = useState(1);
  const { data, isLoading, isRefetching, refetch } = useMaterials(page, courseId);

  const materials = data?.materials ?? [];

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Materials" />
      <PaginatedList<StudentMaterial>
        data={materials}
        keyExtractor={(item) => item.id}
        isRefreshing={isRefetching || isLoading}
        onRefresh={refetch}
        page={page}
        totalPages={totalPages(data?.total ?? 0, data?.pageSize ?? 20)}
        onPageChange={setPage}
        emptyState={
          !isLoading ? (
            <EmptyState
              icon={FileText}
              title="No materials found."
              message="Your course materials will appear here once uploaded."
            />
          ) : (
            <View />
          )
        }
        ListHeaderComponent={
          <View className="gap-4 p-4">
            <HeroBanner
              eyebrow="Materials"
              title="Access your course materials instantly."
              description="Lecture notes, slides, and resources from your teachers."
            />
            <View className="flex-row gap-3">
              <StatCard label="Materials" value={data?.total ?? 0} gradient={["#2563eb", "#1d4ed8"]} />
              <StatCard label="Organized by" value="Course" gradient={["#7e22ce", "#9333ea"]} />
              <StatCard label="Formats" value="Multiple" gradient={["#0891b2", "#0d9488"]} />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mx-4 gap-2 rounded-2xl bg-card p-4 shadow-sm">
            <Badge label={item.courses.title} />
            <Text className="text-base font-semibold text-text-primary">{item.title}</Text>
            <Text className="text-xs text-text-muted">{formatDate(item.created_at)}</Text>
            {item.file_url ? (
              <Pressable
                onPress={() => Linking.openURL(item.file_url!)}
                className="mt-1 self-start rounded-lg bg-primary-50 px-3 py-2"
              >
                <Text className="text-sm font-semibold text-primary-600">Download / View File</Text>
              </Pressable>
            ) : (
              <View className="mt-1 self-start rounded-lg border border-dashed border-neutral-300 px-3 py-2">
                <Text className="text-sm text-text-muted">No file attached</Text>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
