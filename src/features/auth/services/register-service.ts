import { apiClient }
  from "@/services/api/client";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  guest_token?: string
) {

  const response =
    await apiClient.post(

      "/auth/signup",

      {
        name,
        email,
        password,
        guest_token: guest_token || undefined,
      }
    );

  return response.data;
}