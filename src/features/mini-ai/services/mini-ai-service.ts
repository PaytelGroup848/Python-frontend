import axios from "axios";
import { apiClient } from "@/services/api/client";
import {
  CreateMiniAIPayload,
  MiniAIDocumentsResponse,
  MiniAIEntitlements,
  MiniAIInsightsResponse,
  MiniAIItem,
  MiniAIUpdatePayload,
  PublicBotInfo,
  PublicChatResponse,
} from "../types/mini-ai.types";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

function buildKnowledgeFormData(
  form: FormData,
  qaPairs?: CreateMiniAIPayload["qa_pairs"],
  file?: File | null
) {
  const validPairs = (qaPairs || []).filter((p) => p.question.trim() && p.answer.trim());
  if (validPairs.length > 0) {
    form.append("qa_pairs", JSON.stringify(validPairs));
  }
  if (file) {
    form.append("file", file);
  }
}

export async function getMiniAIEntitlements(): Promise<MiniAIEntitlements> {
  const { data } = await apiClient.get<MiniAIEntitlements>("/mini-ai/entitlements");
  return data;
}

export async function listMiniAIs(): Promise<MiniAIItem[]> {
  const { data } = await apiClient.get<MiniAIItem[]>("/mini-ai/");
  return data;
}

export async function createMiniAI(payload: CreateMiniAIPayload): Promise<MiniAIItem> {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("system_prompt", payload.system_prompt);
  if (payload.description?.trim()) form.append("description", payload.description.trim());
  buildKnowledgeFormData(form, payload.qa_pairs, payload.file);
  const { data } = await apiClient.post<MiniAIItem>("/mini-ai/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function addMiniAIKnowledge(
  miniAiId: number,
  payload: Pick<CreateMiniAIPayload, "qa_pairs" | "file">
): Promise<MiniAIItem> {
  const form = new FormData();
  buildKnowledgeFormData(form, payload.qa_pairs, payload.file);
  const { data } = await apiClient.post<MiniAIItem>(`/mini-ai/${miniAiId}/knowledge`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateMiniAI(
  miniAiId: number,
  payload: MiniAIUpdatePayload
): Promise<MiniAIItem> {
  const { data } = await apiClient.patch<MiniAIItem>(`/mini-ai/${miniAiId}`, payload);
  return data;
}

export async function deleteMiniAI(miniAiId: number): Promise<void> {
  await apiClient.delete(`/mini-ai/${miniAiId}`);
}

export async function listMiniAIDocuments(miniAiId: number): Promise<MiniAIDocumentsResponse> {
  const { data } = await apiClient.get<MiniAIDocumentsResponse>(`/mini-ai/${miniAiId}/documents`);
  return data;
}

export async function deleteMiniAIDocument(miniAiId: number, docId: number): Promise<void> {
  await apiClient.delete(`/mini-ai/${miniAiId}/documents/${docId}`);
}

export async function getMiniAIInsights(
  miniAiId: number,
  limit = 20,
  offset = 0
): Promise<MiniAIInsightsResponse> {
  const { data } = await apiClient.get<MiniAIInsightsResponse>(
    `/mini-ai/${miniAiId}/insights`,
    { params: { limit, offset } }
  );
  return data;
}

export async function trainMiniAIGap(
  miniAiId: number,
  gapId: number,
  answer: string
): Promise<MiniAIItem> {
  const { data } = await apiClient.post<MiniAIItem>(
    `/mini-ai/${miniAiId}/gaps/${gapId}/train`,
    { answer }
  );
  return data;
}

export async function getPublicBotInfo(slug: string): Promise<PublicBotInfo> {
  const { data } = await axios.get<PublicBotInfo>(`${API_BASE}/public/bots/${slug}`);
  return data;
}

export async function sendPublicBotMessage(
  slug: string,
  message: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<PublicChatResponse> {
  const { data } = await axios.post<PublicChatResponse>(
    `${API_BASE}/public/bots/${slug}/chat`,
    { message, history }
  );
  return data;
}

export async function submitPublicLead(
  slug: string,
  payload: { visitor_name: string; visitor_contact: string; first_question?: string }
): Promise<void> {
  await axios.post(`${API_BASE}/public/bots/${slug}/leads`, payload);
}
