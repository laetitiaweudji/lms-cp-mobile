import { ActivityIndicator, Linking, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText } from "lucide-react-native";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { useCourseDetail } from "@/hooks/teacher/useCourseDetail";
import { formatDate } from "@/utils/date";

export default function TeacherCourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isRefetching, refetch } = useCourseDetail(id);

  if (isLoading || !data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-page" edges={["top"]}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </SafeAreaView>
    );
  }

  const { course, students, materials, announcements, recordings } = data;

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title={course.title} subtitle={course.code} />
      <ScrollView
        contentContainerClassName="gap-4 p-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <HeroBanner
          eyebrow={course.code}
          title={course.title}
          description={course.description ?? undefined}
        />

        <View className="flex-row gap-3">
          <StatCard label="Students" value={students.length} gradient={["#4f46e5", "#9333ea"]} />
          <StatCard label="Materials" value={materials.length} gradient={["#2563eb", "#4f46e5"]} />
        </View>
        <View className="flex-row gap-3">
          <StatCard label="Recordings" value={recordings.length} gradient={["#0891b2", "#0d9488"]} />
          <StatCard label="Announcements" value={announcements.length} gradient={["#9333ea", "#c026d3"]} />
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Enrolled Students</Text>
          {students.length === 0 ? (
            <Text className="text-sm text-text-muted">No students found for this course.</Text>
          ) : (
            students.map((s) => (
              <View key={s.id} className="rounded-2xl bg-card p-4 shadow-sm">
                <Text className="text-sm font-semibold text-text-primary">
                  {s.profiles.full_name}
                </Text>
                <Text className="text-xs text-text-muted">{s.profiles.email}</Text>
                <Text className="text-xs text-text-muted">Enrolled {formatDate(s.created_at)}</Text>
              </View>
            ))
          )}
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Course Materials</Text>
          {materials.length === 0 ? (
            <Text className="text-sm text-text-muted">No materials found for this course.</Text>
          ) : (
            materials.map((m) => (
              <Pressable
                key={m.id}
                onPress={() => m.file_url && Linking.openURL(m.file_url)}
                className="flex-row items-center gap-3 rounded-2xl bg-card p-4 shadow-sm"
              >
                <FileText size={18} color="#475569" />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-text-primary">{m.title}</Text>
                  <Text className="text-xs text-text-muted">{formatDate(m.created_at)}</Text>
                </View>
              </Pressable>
            ))
          )}
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Course Announcements</Text>
          {announcements.length === 0 ? (
            <Text className="text-sm text-text-muted">No announcements found for this course.</Text>
          ) : (
            announcements.map((a) => (
              <View key={a.id} className="gap-1 rounded-2xl bg-card p-4 shadow-sm">
                <Text className="text-sm font-semibold text-text-primary">{a.title}</Text>
                {a.content && <Text className="text-sm text-text-secondary">{a.content}</Text>}
                <View className="flex-row items-center justify-between">
                  {a.deadline && <Badge label={`Due ${formatDate(a.deadline)}`} />}
                  <Text className="text-xs text-text-muted">{formatDate(a.created_at)}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Lesson Recordings</Text>
          {recordings.length === 0 ? (
            <Text className="text-sm text-text-muted">No recordings found for this course.</Text>
          ) : (
            recordings.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => r.file_url && Linking.openURL(r.file_url)}
                className="rounded-2xl bg-card p-4 shadow-sm"
              >
                <Text className="text-sm font-semibold text-text-primary">{r.title}</Text>
                {r.description && (
                  <Text className="text-sm text-text-secondary">{r.description}</Text>
                )}
                <Text className="text-xs text-text-muted">{formatDate(r.created_at)}</Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
