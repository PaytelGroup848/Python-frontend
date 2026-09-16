import { apiClient } from "@/services/api/client";

import {
  LoginPayload,
  SignupPayload,
  AuthResponse,
} from "../types/auth.types";

export const authService = {

  async signup(
    payload: SignupPayload
  ) {
    const response = await apiClient.post<AuthResponse>(
      "/auth/signup",
      payload
    );

    return response.data;
  },

  async login(
    payload: LoginPayload
  ) {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      payload
    );

    return response.data;
  },

  async logout(refreshToken?: string | null) {
    const response = await apiClient.post(
      "/auth/logout",
      { refresh_token: refreshToken || undefined }
    );

    return response.data;
  },

  async loginWithGoogle(
    credential: string
  ) {
    const response = await apiClient.post<AuthResponse>(
      "/auth/google",
      { credential }
    );

    return response.data;
  },
};