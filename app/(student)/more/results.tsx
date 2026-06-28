import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, Text, View } from "react-native";
import { Award } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaginatedList } from "@/components/list/PaginatedList";
import { useResults } from "@/hooks/student/useResults";
import { formatDate } from "@/utils/date";
import { totalPages } from "@/utils/pagination";
import type { StudentResult } from "@/types/student";

export default function StudentResults() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isRefetching, refetch } = useResults(page);

  const results = data?.results ?? [];

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Results" />
      <PaginatedList<StudentResult>
        data={results}
        keyExtractor={(item) => item.id}
        isRefreshing={isRefetching || isLoading}
        onRefresh={refetch}
        page={page}
        totalPages={totalPages(data?.total ?? 0, data?.pageSize ?? 20)}
        onPageChange={setPage}
        emptyState={
          isLoading ? (
            <View className="items-center py-12">
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : (
            <EmptyState
              icon={Award}
              title="No official results found."
              message="Uploaded final results will appear here once published."
            />
          )
        }
        ListHeaderComponent={
          <View className="gap-4 p-4">
            <HeroBanner
              eyebrow="Results"
              title="Access official semester results."
              description="Final results published by the administration."
            />
            <View className="flex-row gap-3">
              <StatCard label="Uploaded Results" value={data?.total ?? 0} gradient={["#2563eb", "#1d4ed8"]} />
              <StatCard label="Status" value="Official" gradient={["#7e22ce", "#9333ea"]} />
              <StatCard label="Format" value="PDF" gradient={["#0891b2", "#0d9488"]} />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mx-4 gap-2 rounded-2xl bg-card p-4 shadow-sm">
            <Badge label={item.semester} />
            <Text className="text-base font-semibold text-text-primary">{item.title}</Text>
            <Text className="text-xs text-text-muted">{item.domain}</Text>
            <Text className="text-xs text-text-muted">{formatDate(item.created_at)}</Text>
            {item.file_url ? (
              <Pressable
                onPress={() => Linking.openURL(item.file_url!)}
                className="mt-1 self-start rounded-lg bg-primary-50 px-3 py-2"
              >
                <Text className="text-sm font-semibold text-primary-600">View / Download PDF</Text>
              </Pressable>
            ) : (
              <Badge label="No PDF attached" bgColor="#fee2e2" textColor="#ef4444" />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
