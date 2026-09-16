import { apiClient } from "@/services/api/client";

export interface UploadDocumentResponse {
  message: string;
  job_id: number;
  status: string;
  filename: string;
}

export interface DocumentJobStatus {
  job_id: number;
  filename: string;
  status: "queued" | "processing" | "completed" | "failed";
  chunks_stored: number;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export async function uploadDocument(
  file: File
): Promise<UploadDocumentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadDocumentResponse>(
    "/pdf/upload-pdf",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function getJobStatus(
  jobId: number | string
): Promise<DocumentJobStatus> {
  const response = await apiClient.get<DocumentJobStatus>(
    `/pdf/job-status/${jobId}`
  );
  return response.data;
}