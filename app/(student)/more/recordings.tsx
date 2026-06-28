import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Mic2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaginatedList } from "@/components/list/PaginatedList";
import { useRecordings } from "@/hooks/student/useRecordings";
import { formatDate } from "@/utils/date";
import { totalPages } from "@/utils/pagination";
import type { StudentRecording } from "@/types/student";

export default function StudentRecordings() {
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const [page, setPage] = useState(1);
  const { data, isLoading, isRefetching, refetch } = useRecordings(page, courseId);

  const recordings = data?.recordings ?? [];

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Recordings" />
      <PaginatedList<StudentRecording>
        data={recordings}
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
              icon={Mic2}
              title="No recordings found."
              message="Uploaded course lectures will appear here."
            />
          )
        }
        ListHeaderComponent={
          <View className="gap-4 p-4">
            <HeroBanner
              eyebrow="Recordings"
              title="Rewatch your course lectures anytime."
              description="Catch up on lessons you may have missed."
            />
            <View className="flex-row gap-3">
              <StatCard label="Recordings" value={data?.total ?? 0} gradient={["#2563eb", "#1d4ed8"]} />
              <StatCard label="Formats" value="Audio & Video" gradient={["#7e22ce", "#9333ea"]} />
              <StatCard label="Access" value="Anytime" gradient={["#0891b2", "#0d9488"]} />
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
                <Text className="text-sm font-semibold text-primary-600">Open Recording</Text>
              </Pressable>
            ) : (
              <View className="mt-1 self-start rounded-lg border border-dashed border-neutral-300 px-3 py-2">
                <Text className="text-sm text-text-muted">No video URL attached</Text>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
