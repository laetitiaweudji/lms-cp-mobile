import { Redirect, Tabs } from "expo-router";
import { LayoutDashboard, BookOpen, Megaphone, ClipboardList, Mic2, User } from "lucide-react-native";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRoleTheme } from "@/theme/useRoleTheme";
import { TabBarIcon } from "@/components/layout/TabBarIcon";

export default function TeacherLayout() {
  const { status, profile } = useAuth();
  const theme = useRoleTheme();

  if (status !== "authenticated" || !profile) {
    return <Redirect href="/(auth)/login" />;
  }
  if (profile.role !== "teacher") {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: theme.sidebarText,
        tabBarStyle: { backgroundColor: theme.sidebarBg, borderTopWidth: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <TabBarIcon icon={LayoutDashboard} color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "My Courses",
          tabBarIcon: ({ color }) => <TabBarIcon icon={BookOpen} color={color} />,
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: "Announcements",
          tabBarIcon: ({ color }) => <TabBarIcon icon={Megaphone} color={color} />,
        }}
      />
      <Tabs.Screen
        name="grades"
        options={{
          title: "Grades",
          tabBarIcon: ({ color }) => <TabBarIcon icon={ClipboardList} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recordings"
        options={{
          title: "Recordings",
          tabBarIcon: ({ color }) => <TabBarIcon icon={Mic2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon icon={User} color={color} />,
        }}
      />
    </Tabs>
  );
}
