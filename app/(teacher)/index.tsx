import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BookOpen, Megaphone, ClipboardList, Mic2 } from "lucide-react-native";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { StatCard } from "@/components/ui/StatCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useTeacherStats } from "@/hooks/teacher/useTeacherStats";
import { useAnnouncementCount } from "@/hooks/teacher/useCourses";

const LINK_CARDS = [
  { label: "My Courses", href: "/(teacher)/courses" as const, icon: BookOpen, gradient: ["#4f46e5", "#9333ea"] as const },
  { label: "Announcements", href: "/(teacher)/announcements" as const, icon: Megaphone, gradient: ["#9333ea", "#c026d3"] as const },
  { label: "Grades", href: "/(teacher)/grades" as const, icon: ClipboardList, gradient: ["#2563eb", "#4f46e5"] as const },
  { label: "Audio Recordings", href: "/(teacher)/recordings" as const, icon: Mic2, gradient: ["#0891b2", "#0d9488"] as const },
];

export default function TeacherDashboard() {
  const stats = useTeacherStats();
  const announcementCount = useAnnouncementCount();

  const isLoading = stats.isLoading || announcementCount.isLoading;
  const refetchAll = () => {
    stats.refetch();
    announcementCount.refetch();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-page" edges={["top"]}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Dashboard" />
      <ScrollView
        contentContainerClassName="gap-4 p-4"
        refreshControl={<RefreshControl refreshing={stats.isRefetching} onRefresh={refetchAll} />}
      >
        <HeroBanner
          eyebrow="Teacher Workspace"
          title="Teacher Workspace"
          description="Manage courses, publish announcements, record lectures, and track student performance."
        />

        <View className="flex-row flex-wrap gap-3">
          {LINK_CARDS.map(({ label, href, icon: Icon, gradient }) => (
            <Pressable key={href} onPress={() => router.push(href)} className="w-[47%]">
              <LinearGradient colors={gradient} className="gap-2 rounded-2xl p-4">
                <Icon size={20} color="#ffffff" />
                <Text className="text-sm font-semibold text-text-inverse">{label}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold text-text-primary">Quick Actions</Text>
          <PrimaryButton label="New Announcement" onPress={() => router.push("/(teacher)/announcements")} />
          <PrimaryButton label="Add Grades" onPress={() => router.push("/(teacher)/grades")} />
          <PrimaryButton label="Upload Audio" onPress={() => router.push("/(teacher)/recordings")} />
        </View>

        <View className="flex-row gap-3">
          <StatCard label="Courses" value={stats.data?.courses ?? 0} gradient={["#4f46e5", "#9333ea"]} />
          <StatCard
            label="Announcements"
            value={announcementCount.data ?? 0}
            gradient={["#9333ea", "#c026d3"]}
          />
          <StatCard label="Grades Posted" value={stats.data?.grades ?? 0} gradient={["#2563eb", "#4f46e5"]} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
