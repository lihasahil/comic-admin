import apiClient from "@/lib/axios";

export interface CreateAdminPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface CreateAdminResponse {
  success: string;
  user_id: number;
  email: string;
}

export async function createAdmin(
  payload: CreateAdminPayload,
): Promise<CreateAdminResponse> {
  const form = new FormData();
  form.append("email", payload.email.toLowerCase());
  form.append("password", payload.password);
  form.append("full_name", payload.full_name);

  const { data } = await apiClient.post<CreateAdminResponse>(
    "/admin/create-admin",
    form,
  );

  return data;
}
