import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { AudioPlayerControl } from "@/components/ui/AudioPlayerControl";
import { SelectField } from "./SelectField";
import { useUploadRecording } from "@/hooks/teacher/useRecordingMutations";
import {
  RECORDING_FILE_EXTENSION,
  RECORDING_MIME_TYPE,
  RECORDING_OPTIONS,
} from "@/utils/recordingFormat";
import type { TeacherCourse } from "@/types/teacher";

type RecordingUploadFormProps = {
  courses: TeacherCourse[];
};

export function RecordingUploadForm({ courses }: RecordingUploadFormProps) {
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(recorder);

  const [courseId, setCourseId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadRecording = useUploadRecording();

  const handleStart = async () => {
    setError(null);
    setSuccess(false);
    setRecordedUri(null);

    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) {
      setError("Microphone permission is required to record.");
      return;
    }

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const handleStop = async () => {
    await recorder.stop();
    setRecordedUri(recorder.uri);
  };

  const handleSave = () => {
    setError(null);
    if (!courseId || !title.trim() || !recordedUri) {
      setError("Course, title, and a recording are required.");
      return;
    }
    uploadRecording.mutate(
      {
        course_id: courseId,
        title,
        description: description || undefined,
        file: {
          uri: recordedUri,
          name: `recording-${Date.now()}.${RECORDING_FILE_EXTENSION}`,
          type: RECORDING_MIME_TYPE,
        },
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTitle("");
          setDescription("");
          setRecordedUri(null);
        },
        onError: (err) => setError(err.message),
      }
    );
  };

  return (
    <View className="gap-3">
      {error && <Text className="text-sm font-medium text-danger">{error}</Text>}
      {success && (
        <Text className="text-sm font-medium text-success">Recording saved successfully.</Text>
      )}

      <SelectField
        label="Course"
        placeholder="Select a course"
        value={courseId}
        options={courses.map((c) => ({ label: c.title, value: c.id }))}
        onChange={setCourseId}
      />

      <View>
        <Text className="mb-1 text-sm font-medium text-text-secondary">Lesson Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Lesson title"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
        />
      </View>

      <View>
        <Text className="mb-1 text-sm font-medium text-text-secondary">Lesson Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Optional description"
          placeholderTextColor="#94a3b8"
          multiline
          style={{ minHeight: 80, textAlignVertical: "top" }}
          className="rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
        />
      </View>

      {recorderState.isRecording ? (
        <Pressable onPress={handleStop} className="items-center rounded-xl bg-danger py-3">
          <Text className="font-semibold text-text-inverse">
            Recording in progress... (tap to stop)
          </Text>
        </Pressable>
      ) : (
        <Pressable onPress={handleStart} className="items-center rounded-xl bg-primary-600 py-3">
          <Text className="font-semibold text-text-inverse">Start Recording</Text>
        </Pressable>
      )}

      {recordedUri && !recorderState.isRecording && (
        <View className="gap-2">
          <Text className="text-sm font-medium text-text-secondary">Preview</Text>
          <AudioPlayerControl uri={recordedUri} />
          <Pressable
            onPress={handleSave}
            disabled={uploadRecording.isPending}
            className={`items-center rounded-xl bg-success py-3 ${
              uploadRecording.isPending ? "opacity-50" : ""
            }`}
          >
            <Text className="font-semibold text-text-inverse">
              {uploadRecording.isPending ? "Saving..." : "Save Recording"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
