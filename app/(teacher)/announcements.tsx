import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { Badge } from "@/components/ui/Badge";
import { AnnouncementForm } from "@/components/forms/AnnouncementForm";
import { useAppBottomSheet } from "@/components/sheets/useAppBottomSheet";
import { useAnnouncements } from "@/hooks/teacher/useAnnouncements";
import { useCourseMaterials } from "@/hooks/teacher/useCourseRecordingsAndMaterials";
import { useAuth } from "@/hooks/auth/useAuth";
import { formatDate } from "@/utils/date";
import type { TeacherAnnouncement } from "@/types/teacher";

function AnnouncementDetail({ announcement }: { announcement: TeacherAnnouncement }) {
  const { data: materials = [] } = useCourseMaterials(announcement.course_id ?? undefined);

  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-text-primary">{announcement.title}</Text>
      {announcement.content && (
        <Text className="text-sm text-text-secondary">{announcement.content}</Text>
      )}
      <View className="gap-1">
        <Text className="text-xs text-text-muted">
          Course: {announcement.courses?.title ?? "Global"}
        </Text>
        <Text className="text-xs text-text-muted">
          Deadline: {announcement.deadline ? formatDate(announcement.deadline) : "None"}
        </Text>
        <Text className="text-xs text-text-muted">Posted: {formatDate(announcement.created_at)}</Text>
        <Text className="text-xs text-text-muted">
          Type: {announcement.is_global ? "Global (Teachers)" : "Course Announcement"}
        </Text>
      </View>
      {announcement.course_id && materials.length > 0 && (
        <View className="gap-1">
          <Text className="text-sm font-semibold text-text-primary">Related Materials</Text>
          {materials.map((m) => (
            <Text key={m.id} className="text-sm text-text-secondary">
              • {m.title}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

export default function TeacherAnnouncements() {
  const { profile } = useAuth();
  const { data, isLoading, isRefetching, refetch, courses } = useAnnouncements();
  const sheet = useAppBottomSheet();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<TeacherAnnouncement | null>(null);

  const announcements = data ?? [];
  const filtered = useMemo(() => {
    if (!search.trim()) return announcements;
    const q = search.trim().toLowerCase();
    return announcements.filter((a) => a.title.toLowerCase().includes(q));
  }, [announcements, search]);

  const openDetail = (announcement: TeacherAnnouncement) => {
    sheet.open(<AnnouncementDetail announcement={announcement} />, { mode: "slide" });
  };

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Announcements" />
      <ScrollView
        contentContainerClassName="gap-4 p-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <HeroBanner eyebrow="Announcements" title="Course Announcements" />

        <View className="rounded-2xl bg-card p-4 shadow-sm">
          <AnnouncementForm
            courses={courses}
            editing={editing}
            onDone={() => setEditing(null)}
            onCancelEdit={() => setEditing(null)}
          />
        </View>

        <View className="flex-row items-center gap-2 rounded-xl border border-neutral-200 bg-input px-4">
          <Search size={18} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search announcements"
            placeholderTextColor="#94a3b8"
            className="flex-1 py-3 text-base text-text-primary"
          />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#4f46e5" />
        ) : filtered.length === 0 ? (
          <Text className="text-sm text-text-muted">No announcements found.</Text>
        ) : (
          filtered.map((a) => (
            <Pressable
              key={a.id}
              onPress={() => openDetail(a)}
              className="gap-2 rounded-2xl bg-card p-4 shadow-sm active:opacity-80"
            >
              <View className="flex-row items-start justify-between">
                <Text className="flex-1 text-base font-semibold text-text-primary">{a.title}</Text>
                <Badge label={a.courses?.title ?? "Global"} />
              </View>
              {a.content && (
                <Text className="text-sm text-text-secondary" numberOfLines={2}>
                  {a.content}
                </Text>
              )}
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-text-muted">{formatDate(a.created_at)}</Text>
                {a.teacher_id === profile?.id && (
                  <Pressable onPress={() => setEditing(a)}>
                    <Text className="text-sm font-semibold text-primary-600">Edit Announcement</Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
