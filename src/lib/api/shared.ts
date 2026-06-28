import { apiClient } from "./client";

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
};

export function changePassword(payload: ChangePasswordPayload) {
  return apiClient.post<{ success?: boolean }>("/auth/change-password", payload);
}

export type AvatarFile = {
  uri: string;
  name: string;
  type: string;
};

export function uploadAvatar(file: AvatarFile) {
  const formData = new FormData();
  // React Native's FormData accepts { uri, name, type } for file parts;
  // the DOM FormData type only allows string | Blob, hence the cast.
  formData.append("file", file as unknown as Blob);
  return apiClient.upload<{ success: boolean; url: string }>("/user/avatar", formData);
}
