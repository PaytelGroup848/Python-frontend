import { apiClient } from "@/services/api/client";

export interface QueueResponse {
  chat_queue: number;
  embedding_queue: number;
  rag_queue: number;
  voice_queue: number;
}

class QueueService {

  async getQueues(): Promise<QueueResponse> {

    const response = await apiClient.get("/admin/queues"
    );

    return response.data;
  }
}

export const queueService =
  new QueueService();