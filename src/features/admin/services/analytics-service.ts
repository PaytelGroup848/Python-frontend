import { apiClient } from "@/services/api/client";

import {
  AnalyticsResponse
} from "../types/analytics";

class AnalyticsService {

  async getOverview():
    Promise<AnalyticsResponse> {

    const response =
      await apiClient.get(
        "/analytics/overview"
      )

    return response.data;
  }
}

export const analyticsService =
  new AnalyticsService();