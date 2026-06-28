import { useLocalSearchParams } from "expo-router";
import { ScreenPlaceholder } from "@/components/dev/ScreenPlaceholder";

export default function TeacherCourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ScreenPlaceholder title="Course Detail" subtitle={id} />;
}
