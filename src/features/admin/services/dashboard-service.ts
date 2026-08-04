import { apiClient } from "@/services/api/client";

import { DashboardData } from "../types/dashboard";

class DashboardService {

    async getDashboard(): Promise<DashboardData> {

        const response =
            await apiClient.get<DashboardData>(
                "/admin/dashboard",
            );

        return response.data;
    }
}

export const dashboardService =
    new DashboardService();