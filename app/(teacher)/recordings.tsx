import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText } from "lucide-react-native";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { Badge } from "@/components/ui/Badge";
import { AudioPlayerControl } from "@/components/ui/AudioPlayerControl";
import { SelectField } from "@/components/forms/SelectField";
import { MaterialUploadForm } from "@/components/forms/MaterialUploadForm";
import { RecordingUploadForm } from "@/components/forms/RecordingUploadForm";
import { useCourses } from "@/hooks/teacher/useCourses";
import { useCourseMaterials, useCourseRecordings } from "@/hooks/teacher/useCourseRecordingsAndMaterials";
import { formatDate } from "@/utils/date";

export default function TeacherRecordings() {
  const { data: courses = [] } = useCourses();
  const [courseId, setCourseId] = useState<string | null>(null);

  const recordingsQuery = useCourseRecordings(courseId ?? undefined);
  const materialsQuery = useCourseMaterials(courseId ?? undefined);

  const recordings = recordingsQuery.data ?? [];
  const materials = materialsQuery.data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Recordings" />
      <ScrollView
        contentContainerClassName="gap-4 p-4"
        refreshControl={
          <RefreshControl
            refreshing={!!recordingsQuery.isRefetching}
            onRefresh={() => {
              recordingsQuery.refetch();
              materialsQuery.refetch();
            }}
          />
        }
      >
        <HeroBanner eyebrow="Recordings" title="Audio Recordings" />

        <View className="gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-base font-bold text-text-primary">Record New Lesson</Text>
          <RecordingUploadForm courses={courses} />
        </View>

        <View className="gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-base font-bold text-text-primary">Upload Additional Material</Text>
          <MaterialUploadForm courses={courses} />
        </View>

        <SelectField
          label="Course"
          placeholder="Select a course"
          value={courseId}
          options={courses.map((c) => ({ label: c.title, value: c.id }))}
          onChange={setCourseId}
        />

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Course Recordings</Text>
          {!courseId ? (
            <Text className="text-sm text-text-muted">Select a course to display its recordings.</Text>
          ) : recordingsQuery.isLoading ? (
            <ActivityIndicator color="#4f46e5" />
          ) : recordings.length === 0 ? (
            <Text className="text-sm text-text-muted">No recordings found for this course.</Text>
          ) : (
            recordings.map((r) => (
              <View key={r.id} className="gap-2 rounded-2xl bg-card p-4 shadow-sm">
                <Badge label={r.courses?.title ?? "Unknown course"} />
                <Text className="text-sm font-semibold text-text-primary">{r.title}</Text>
                {r.file_url ? (
                  <AudioPlayerControl uri={r.file_url} />
                ) : (
                  <Text className="text-xs text-text-muted">No audio file attached</Text>
                )}
                <Text className="text-xs text-text-muted">{formatDate(r.created_at)}</Text>
              </View>
            ))
          )}
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Course Materials</Text>
          {!courseId ? (
            <Text className="text-sm text-text-muted">Select a course to display its materials.</Text>
          ) : materialsQuery.isLoading ? (
            <ActivityIndicator color="#4f46e5" />
          ) : materials.length === 0 ? (
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
      </ScrollView>
    </SafeAreaView>
  );
}
