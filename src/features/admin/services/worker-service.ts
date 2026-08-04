import { apiClient } from "@/services/api/client";

export interface WorkerStatus {
  name: string;
  status: string;
  queue_size: number;
}

export interface WorkerResponse {
  workers: WorkerStatus[];
}

class WorkerService {

  async getWorkers(): Promise<WorkerResponse> {

    const response = await apiClient.get("/admin/workers"
    );

    return response.data;
  }
}

export const workerService =
  new WorkerService();