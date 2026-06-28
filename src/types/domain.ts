export type ProfileRole = "teacher" | "student" | "parent" | "admin";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: ProfileRole;
  avatar_url: string | null;
  created_at: string;
};

/** Profile narrowed to the 3 roles the mobile app actually supports (admin is rejected at login). */
export type MobileProfile = Profile & {
  role: "teacher" | "student" | "parent";
};
