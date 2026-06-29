import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Megaphone } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaginatedList } from "@/components/list/PaginatedList";
import { useAnnouncements } from "@/hooks/student/useAnnouncements";
import { formatDate, daysUntil } from "@/utils/date";
import { totalPages } from "@/utils/pagination";
import type { StudentAnnouncement } from "@/types/student";

export default function StudentAnnouncements() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isRefetching, refetch } = useAnnouncements(page);

  const announcements = data?.announcements ?? [];
  const upcomingCount = announcements.filter(
    (a) => a.deadline && new Date(a.deadline).getTime() >= Date.now()
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Announcements" />
      <PaginatedList<StudentAnnouncement>
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
              message="Updates will appear here when teachers post them."
            />
          )
        }
        renderItem={({ item }) => {
          const isUrgent = item.deadline ? daysUntil(item.deadline) <= 3 : false;
          return (
            <View className="mx-4 gap-2 rounded-2xl bg-card p-4 shadow-sm">
              <Badge label={item.courses?.title ?? "General"} />
              <Text className="text-base font-semibold text-text-primary">{item.title}</Text>
              {item.content && (
                <Text className="text-sm text-text-secondary" numberOfLines={2}>
                  {item.content}
                </Text>
              )}
              <View className="flex-row items-center justify-between">
                {item.deadline ? (
                  <Badge
                    label={isUrgent ? "Urgent" : "Update"}
                    bgColor={isUrgent ? "#fee2e2" : "#dbeafe"}
                    textColor={isUrgent ? "#ef4444" : "#3b82f6"}
                  />
                ) : (
                  <View />
                )}
                <Text className="text-xs text-text-muted">{formatDate(item.created_at)}</Text>
              </View>
            </View>
          );
        }}
        ListHeaderComponent={
          <View className="gap-4 p-4">
            <HeroBanner
              eyebrow="Announcements"
              title="Never miss an academic update."
              description="Stay on top of what your teachers are sharing."
            />
            <View className="flex-row gap-3">
              <StatCard label="Total" value={data?.total ?? 0} gradient={["#2563eb", "#1d4ed8"]} />
              <StatCard
                label="Upcoming Deadlines"
                value={upcomingCount}
                gradient={["#f59e0b", "#ea580c"]}
              />
            </View>
            {announcements.some((a) => a.deadline) && (
              <View className="gap-2">
                <Text className="text-lg font-bold text-text-primary">Deadline Timeline</Text>
                {announcements
                  .filter((a) => a.deadline)
                  .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
                  .map((a) => (
                    <View
                      key={a.id}
                      className="flex-row items-center justify-between rounded-2xl bg-card p-3 shadow-sm"
                    >
                      <Text className="flex-1 text-sm font-medium text-text-primary">{a.title}</Text>
                      <Text className="text-xs text-warning">{formatDate(a.deadline)}</Text>
                    </View>
                  ))}
              </View>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
