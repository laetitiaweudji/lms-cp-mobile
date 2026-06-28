import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { SelectField } from "./SelectField";
import { useCourseStudents } from "@/hooks/teacher/useGrades";
import { useCreateGrade, useUpdateGrade } from "@/hooks/teacher/useGradeMutations";
import { ASSESSMENT_TYPES } from "@/types/teacher";
import type { TeacherCourse, TeacherGrade } from "@/types/teacher";

type GradeFormProps = {
  courses: TeacherCourse[];
  editing?: TeacherGrade | null;
  editingId?: string | null;
  onDone: () => void;
  onCancelEdit?: () => void;
};

export function GradeForm({ courses, editing, editingId, onDone, onCancelEdit }: GradeFormProps) {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [assessmentName, setAssessmentName] = useState(editing?.assessment_name ?? "");
  const [assessmentType, setAssessmentType] = useState<string | null>(
    editing?.assessment_type ?? null
  );
  const [score, setScore] = useState(editing ? String(editing.score) : "");
  const [maxScore, setMaxScore] = useState(editing ? String(editing.max_score) : "100");
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editingId;
  const { data: students = [] } = useCourseStudents(courseId ?? "");

  const createMutation = useCreateGrade();
  const updateMutation = useUpdateGrade();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    setError(null);
    const scoreNum = Number(score);
    const maxScoreNum = Number(maxScore);

    if (!assessmentName.trim()) return setError("Assessment name is required.");
    if (!assessmentType) return setError("Assessment type is required.");
    if (Number.isNaN(scoreNum) || Number.isNaN(maxScoreNum)) {
      return setError("Score and max score must be numbers.");
    }
    if (scoreNum > maxScoreNum) return setError("Score cannot exceed max score.");

    if (isEditing && editingId) {
      updateMutation.mutate(
        {
          id: editingId,
          assessment_name: assessmentName,
          assessment_type: assessmentType,
          score: scoreNum,
          max_score: maxScoreNum,
        },
        { onSuccess: onDone, onError: (err) => setError(err.message) }
      );
      return;
    }

    if (!courseId || !studentId) return setError("Course and student are required.");

    createMutation.mutate(
      {
        student_id: studentId,
        course_id: courseId,
        assessment_name: assessmentName,
        assessment_type: assessmentType,
        score: scoreNum,
        max_score: maxScoreNum,
      },
      { onSuccess: onDone, onError: (err) => setError(err.message) }
    );
  };

  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-text-primary">
        {isEditing ? "Edit Grade" : "Enter Grade"}
      </Text>

      {error && <Text className="text-sm font-medium text-danger">{error}</Text>}

      <SelectField
        label="Course"
        placeholder="Select a course"
        value={courseId}
        options={courses.map((c) => ({ label: c.title, value: c.id }))}
        onChange={(value) => {
          setCourseId(value);
          setStudentId(null);
        }}
        disabled={isEditing}
      />

      <SelectField
        label="Student"
        placeholder={courseId ? "Select a student" : "Select a course first"}
        value={studentId}
        options={students.map((s) => ({ label: s.profiles.full_name, value: s.student_id }))}
        onChange={setStudentId}
        disabled={isEditing || !courseId}
      />

      <View>
        <Text className="mb-1 text-sm font-medium text-text-secondary">Assessment Name</Text>
        <TextInput
          value={assessmentName}
          onChangeText={setAssessmentName}
          placeholder="e.g. Midterm Exam"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
        />
      </View>

      <SelectField
        label="Assessment Type"
        placeholder="Select a type"
        value={assessmentType}
        options={ASSESSMENT_TYPES.map((t) => ({ label: t, value: t }))}
        onChange={setAssessmentType}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className="mb-1 text-sm font-medium text-text-secondary">Score</Text>
          <TextInput
            value={score}
            onChangeText={setScore}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#94a3b8"
            className="rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
          />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-sm font-medium text-text-secondary">Max Score</Text>
          <TextInput
            value={maxScore}
            onChangeText={setMaxScore}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor="#94a3b8"
            className="rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
          />
        </View>
      </View>

      <View className="flex-row gap-3">
        {isEditing && onCancelEdit && (
          <View className="flex-1">
            <SecondaryButton label="Cancel" onPress={onCancelEdit} />
          </View>
        )}
        <View className="flex-1">
          <PrimaryButton
            label={isEditing ? "Update" : "Save"}
            loadingLabel={isEditing ? "Updating..." : "Saving..."}
            loading={isPending}
            disabled={!assessmentName || !assessmentType || !score || !maxScore}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </View>
  );
}
