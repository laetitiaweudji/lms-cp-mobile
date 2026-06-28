import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FileText } from "lucide-react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SelectField } from "./SelectField";
import { useUploadMaterial } from "@/hooks/teacher/useMaterialMutations";
import {
  MATERIAL_ALLOWED_MIME_TYPES,
  MATERIAL_MAX_SIZE_BYTES,
  formatFileSize,
} from "@/utils/uploadConstraints";
import type { TeacherCourse } from "@/types/teacher";
import type { DocumentPickerAsset } from "expo-document-picker";

type MaterialUploadFormProps = {
  courses: TeacherCourse[];
};

export function MaterialUploadForm({ courses }: MaterialUploadFormProps) {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<DocumentPickerAsset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadMaterial = useUploadMaterial();

  const handlePickFile = async () => {
    setError(null);
    setSuccess(false);
    const result = await DocumentPicker.getDocumentAsync({
      type: MATERIAL_ALLOWED_MIME_TYPES,
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    if (asset.mimeType && !MATERIAL_ALLOWED_MIME_TYPES.includes(asset.mimeType)) {
      setError("Unsupported file type. Allowed: PDF, Word, PowerPoint, Excel, or image files.");
      return;
    }
    if (asset.size && asset.size > MATERIAL_MAX_SIZE_BYTES) {
      setError(`File is too large (${formatFileSize(asset.size)}). Max size is 50MB.`);
      return;
    }
    setFile(asset);
  };

  const handleUpload = () => {
    setError(null);
    if (!courseId || !title.trim() || !file) {
      setError("Course, title, and file are required.");
      return;
    }
    uploadMaterial.mutate(
      {
        course_id: courseId,
        title,
        file: { uri: file.uri, name: file.name, type: file.mimeType ?? "application/octet-stream" },
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTitle("");
          setFile(null);
        },
        onError: (err) => setError(err.message),
      }
    );
  };

  return (
    <View className="gap-3">
      {error && <Text className="text-sm font-medium text-danger">{error}</Text>}
      {success && (
        <Text className="text-sm font-medium text-success">Material uploaded successfully.</Text>
      )}

      <SelectField
        label="Course"
        placeholder="Select a course"
        value={courseId}
        options={courses.map((c) => ({ label: c.title, value: c.id }))}
        onChange={setCourseId}
      />

      <View>
        <Text className="mb-1 text-sm font-medium text-text-secondary">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Material title"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
        />
      </View>

      <Pressable
        onPress={handlePickFile}
        className="flex-row items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-4 py-3"
      >
        <FileText size={18} color="#475569" />
        <Text className="flex-1 text-sm text-text-secondary" numberOfLines={1}>
          {file ? file.name : "Choose a file (PDF, Word, PowerPoint, Excel, or image)"}
        </Text>
      </Pressable>

      <PrimaryButton
        label="Upload Material"
        loadingLabel="Uploading..."
        loading={uploadMaterial.isPending}
        disabled={!courseId || !title || !file}
        onPress={handleUpload}
      />
    </View>
  );
}
