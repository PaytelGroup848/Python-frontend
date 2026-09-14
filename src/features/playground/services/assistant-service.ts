import { apiClient } from "@/services/api/client";
import { Assistant } from "../types/assistant";

export async function getAssistants(): Promise<Assistant[]> {
  const { data } = await apiClient.get<Assistant[]>("/assistants/");
  return data;
}