import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Megaphone } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaginatedList } from "@/components/list/PaginatedList";
import { useAnnouncements } from "@/hooks/parent/useAnnouncements";
import { formatDate } from "@/utils/date";
import { totalPages } from "@/utils/pagination";
import type { ParentAnnouncement } from "@/types/parent";

export default function ParentAnnouncements() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isRefetching, refetch } = useAnnouncements(page);

  const announcements = data?.announcements ?? [];
  const upcomingCount = announcements.filter(
    (a) => a.deadline && new Date(a.deadline).getTime() >= Date.now()
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Announcements" subtitle={`${data?.total ?? 0} total`} />
      <PaginatedList<ParentAnnouncement>
        data={announcements}
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
              icon={Megaphone}
              title="No announcements found."
              message="Updates will appear here when teachers or admins post them."
            />
          )
        }
        ListHeaderComponent={
          <View className="flex-row gap-3 p-4">
            <StatCard label="Total" value={data?.total ?? 0} gradient={["#2563eb", "#1d4ed8"]} />
            <StatCard
              label="Upcoming Deadlines"
              value={upcomingCount}
              gradient={["#f59e0b", "#ea580c"]}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View className="mx-4 gap-2 rounded-2xl bg-card p-4 shadow-sm">
            <Badge label={item.courses.title} />
            <Text className="text-base font-semibold text-text-primary">{item.title}</Text>
            {item.content && (
              <Text className="text-sm text-text-secondary" numberOfLines={2}>
                {item.content}
              </Text>
            )}
            <View className="flex-row items-center justify-between">
              {item.deadline ? (
                <Badge label={`Due ${formatDate(item.deadline)}`} bgColor="#fef3c7" textColor="#f59e0b" />
              ) : (
                <View />
              )}
              <Text className="text-xs text-text-muted">{formatDate(item.created_at)}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
