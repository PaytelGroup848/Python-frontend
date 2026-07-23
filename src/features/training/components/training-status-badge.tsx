
"use client";

import { Badge } from "@/components/ui/badge";

interface TrainingStatusBadgeProps {

    status: string;

}

export function TrainingStatusBadge({

    status,

}: TrainingStatusBadgeProps) {

    const normalizedStatus =
        status.toUpperCase();

    let className =
        "border-gray-300 bg-gray-100 text-gray-700";

    switch (normalizedStatus) {

        case "PENDING":

            className =
                "border-yellow-300 bg-yellow-100 text-yellow-800";

            break;

        case "QUEUED":

            className =
                "border-blue-300 bg-blue-100 text-blue-800";

            break;

        case "RUNNING":

            className =
                "border-indigo-300 bg-indigo-100 text-indigo-800";

            break;

        case "COMPLETED":

            className =
                "border-green-300 bg-green-100 text-green-800";

            break;

        case "FAILED":

            className =
                "border-red-300 bg-red-100 text-red-800";

            break;

        case "CANCELLED":

            className =
                "border-gray-400 bg-gray-200 text-gray-800";

            break;

        default:

            className =
                "border-gray-300 bg-gray-100 text-gray-700";

    }

    return (

        <Badge
            className={className}
        >

            {normalizedStatus}

        </Badge>

    );

}