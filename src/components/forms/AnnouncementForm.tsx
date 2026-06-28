import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { SelectField } from "./SelectField";
import { useCreateAnnouncement, useUpdateAnnouncement } from "@/hooks/teacher/useAnnouncementMutations";
import type { TeacherAnnouncement, TeacherCourse } from "@/types/teacher";

type AnnouncementFormProps = {
  courses: TeacherCourse[];
  editing?: TeacherAnnouncement | null;
  onDone: () => void;
  onCancelEdit?: () => void;
};

export function AnnouncementForm({ courses, editing, onDone, onCancelEdit }: AnnouncementFormProps) {
  const [courseId, setCourseId] = useState<string | null>(editing?.course_id ?? null);
  const [title, setTitle] = useState(editing?.title ?? "");
  const [deadline, setDeadline] = useState(editing?.deadline?.slice(0, 10) ?? "");
  const [content, setContent] = useState(editing?.content ?? "");
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    setError(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, title, content: content || undefined, deadline: deadline || undefined },
        { onSuccess: onDone, onError: (err) => setError(err.message) }
      );
    } else {
      createMutation.mutate(
        {
          title,
          content: content || undefined,
          deadline: deadline || undefined,
          course_id: courseId ?? undefined,
        },
        { onSuccess: onDone, onError: (err) => setError(err.message) }
      );
    }
  };

  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-text-primary">
        {editing ? "Edit Announcement" : "Enter Announcement"}
      </Text>

      {error && <Text className="text-sm font-medium text-danger">{error}</Text>}

      <SelectField
        label="Course"
        placeholder="Select a course"
        value={courseId}
        options={courses.map((c) => ({ label: c.title, value: c.id }))}
        onChange={setCourseId}
        disabled={!!editing}
      />

      <View>
        <Text className="mb-1 text-sm font-medium text-text-secondary">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Announcement title"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
        />
      </View>

      <View>
        <Text className="mb-1 text-sm font-medium text-text-secondary">Deadline (optional)</Text>
        <TextInput
          value={deadline}
          onChangeText={setDeadline}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
        />
      </View>

      <View>
        <Text className="mb-1 text-sm font-medium text-text-secondary">Message</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Write your announcement..."
          placeholderTextColor="#94a3b8"
          multiline
          style={{ minHeight: 96, textAlignVertical: "top" }}
          className="rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
        />
      </View>

      <View className="flex-row gap-3">
        {editing && onCancelEdit && (
          <View className="flex-1">
            <SecondaryButton label="Cancel" onPress={onCancelEdit} />
          </View>
        )}
        <View className="flex-1">
          <PrimaryButton
            label={editing ? "Update Announcement" : "Publish Announcement"}
            loadingLabel={editing ? "Updating..." : "Publishing..."}
            loading={isPending}
            disabled={!title}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </View>
  );
}
