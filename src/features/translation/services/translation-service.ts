import { apiClient } from "@/services/api/client";
import {
  SupportedLanguage,
  DocumentJobCreated,
  DocumentJobStatus,
  TextTranslationResult
} from "../types/translation";

export async function fetchSupportedLanguages(): Promise<SupportedLanguage[]> {
  const response = await apiClient.get<{ languages: SupportedLanguage[] }>("/translate/languages");
  return response.data.languages;
}

export async function translateTextSnippet(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = "auto"
): Promise<TextTranslationResult> {
  const response = await apiClient.post<TextTranslationResult>("/translate/text", {
    text,
    target_language: targetLanguage,
    source_language: sourceLanguage,
  });
  return response.data;
}

export async function uploadDocumentForTranslation(
  file: File,
  targetLanguage: string,
  sourceLanguage: string = "auto"
): Promise<DocumentJobCreated> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_language", targetLanguage);
  formData.append("source_language", sourceLanguage);

  const response = await apiClient.post<DocumentJobCreated>(
    "/translate/document",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function fetchTranslationJobStatus(jobId: string): Promise<DocumentJobStatus> {
  const response = await apiClient.get<DocumentJobStatus>(`/translate/jobs/${jobId}`);
  return response.data;
}

export async function downloadTranslatedFile(
  fileType: "pdf" | "docx",
  jobId: string,
  fallbackFilename: string
): Promise<void> {
  const response = await apiClient.get(`/translate/download/${fileType}/${jobId}`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: fileType === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fallbackFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

