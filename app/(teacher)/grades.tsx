import { useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pencil, Trash2 } from "lucide-react-native";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { Badge } from "@/components/ui/Badge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { GradeForm } from "@/components/forms/GradeForm";
import { SelectField } from "@/components/forms/SelectField";
import { ConfirmSheet } from "@/components/sheets/ConfirmSheet";
import { useAppBottomSheet } from "@/components/sheets/useAppBottomSheet";
import { useCourses } from "@/hooks/teacher/useCourses";
import { useCourseStudents, useGrades, useStudentGradesInCourse } from "@/hooks/teacher/useGrades";
import { useDeleteGrade } from "@/hooks/teacher/useGradeMutations";
import type { TeacherGrade } from "@/types/teacher";

function StudentGradesDetail({ courseId, studentId, studentName }: { courseId: string; studentId: string; studentName: string }) {
  const { data: grades = [], isLoading } = useStudentGradesInCourse(courseId, studentId);

  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-text-primary">{studentName}</Text>
      {isLoading ? (
        <ActivityIndicator color="#4f46e5" />
      ) : grades.length === 0 ? (
        <Text className="text-sm text-text-muted">
          No grades found for this student in this course.
        </Text>
      ) : (
        grades.map((g) => (
          <View key={g.id} className="flex-row items-center justify-between rounded-xl bg-page p-3">
            <View>
              <Text className="text-sm font-semibold text-text-primary">{g.assessment_name}</Text>
              <Text className="text-xs text-text-muted">{g.assessment_type}</Text>
            </View>
            <ScoreBadge score={g.score} maxScore={g.max_score} />
          </View>
        ))
      )}
    </View>
  );
}

export default function TeacherGrades() {
  const sheet = useAppBottomSheet();
  const { data: courses = [] } = useCourses();
  const gradesQuery = useGrades();
  const deleteGrade = useDeleteGrade();

  const [studentsCourseId, setStudentsCourseId] = useState<string | null>(null);
  const { data: students = [] } = useCourseStudents(studentsCourseId ?? "");

  const [editingGrade, setEditingGrade] = useState<TeacherGrade | null>(null);

  const openStudentGrades = (studentId: string, studentName: string) => {
    if (!studentsCourseId) return;
    sheet.open(
      <StudentGradesDetail courseId={studentsCourseId} studentId={studentId} studentName={studentName} />,
      { mode: "slide" }
    );
  };

  const confirmDelete = (gradeId: string) => {
    sheet.open(
      <ConfirmSheet
        title="Delete Grade"
        message="Are you sure you want to delete this grade? This cannot be undone."
        confirmLabel="Delete"
        destructive
        onCancel={sheet.close}
        onConfirm={() => {
          sheet.close();
          deleteGrade.mutate(gradeId);
        }}
      />,
      { mode: "center" }
    );
  };

  const grades = gradesQuery.data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Grades" />
      <ScrollView
        contentContainerClassName="gap-4 p-4"
        refreshControl={
          <RefreshControl refreshing={gradesQuery.isRefetching} onRefresh={gradesQuery.refetch} />
        }
      >
        <HeroBanner eyebrow="Grades" title="Grade Management" />

        <View className="rounded-2xl bg-card p-4 shadow-sm">
          <GradeForm
            courses={courses}
            editing={editingGrade}
            editingId={editingGrade?.id ?? null}
            onDone={() => setEditingGrade(null)}
            onCancelEdit={() => setEditingGrade(null)}
          />
        </View>

        <View className="gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-base font-bold text-text-primary">Students In Course</Text>
          <SelectField
            label="Course"
            placeholder="Select a course"
            value={studentsCourseId}
            options={courses.map((c) => ({ label: c.title, value: c.id }))}
            onChange={setStudentsCourseId}
          />
          {studentsCourseId &&
            (students.length === 0 ? (
              <Text className="text-sm text-text-muted">No students found for this course.</Text>
            ) : (
              students.map((s) => (
                <Pressable
                  key={s.student_id}
                  onPress={() =>
                    openStudentGrades(s.student_id, s.profiles?.full_name ?? "Unknown student")
                  }
                  className="flex-row items-center justify-between rounded-xl bg-page p-3 active:opacity-80"
                >
                  <Text className="text-sm font-medium text-text-primary">
                    {s.profiles?.full_name ?? "Unknown student"}
                  </Text>
                  <Text className="text-xs text-text-muted">{s.profiles?.email ?? ""}</Text>
                </Pressable>
              ))
            ))}
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Recent Grades</Text>
          {gradesQuery.isLoading ? (
            <ActivityIndicator color="#4f46e5" />
          ) : grades.length === 0 ? (
            <Text className="text-sm text-text-muted">No grades recorded yet.</Text>
          ) : (
            grades.map((g) => (
              <View key={g.id} className="gap-2 rounded-2xl bg-card p-4 shadow-sm">
                <Text className="text-base font-semibold text-text-primary">
                  {g.assessment_name}
                </Text>
                <View className="flex-row gap-2">
                  <Badge label={g.courses?.title ?? "Unknown course"} />
                  <Badge label={g.profiles?.full_name ?? "Unknown student"} />
                  <Badge label={g.assessment_type} />
                </View>
                <View className="flex-row items-center justify-between">
                  <ScoreBadge score={g.score} maxScore={g.max_score} />
                  <View className="flex-row gap-4">
                    <Pressable onPress={() => setEditingGrade(g)}>
                      <Pencil size={18} color="#475569" />
                    </Pressable>
                    <Pressable onPress={() => confirmDelete(g.id)}>
                      <Trash2 size={18} color="#ef4444" />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
