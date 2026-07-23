"use client";

import { Badge } from "@/components/ui/badge";

interface SnapshotStatusBadgeProps {

    status: string;

}

export function SnapshotStatusBadge({

    status,

}: SnapshotStatusBadgeProps) {

    const normalizedStatus =
        status.trim().toUpperCase();

    let className = "";

    switch (normalizedStatus) {

        case "SEALED":

            className =
                "border-green-600 bg-green-100 text-green-700";

            break;

        case "BUILDING":

        case "CREATING":

        case "PROCESSING":

            className =
                "border-blue-600 bg-blue-100 text-blue-700";

            break;

        case "FAILED":

        case "ERROR":

            className =
                "border-red-600 bg-red-100 text-red-700";

            break;

        default:

            className =
                "border-gray-400 bg-gray-100 text-gray-700";

            break;

    }

    return (

        <Badge

            className={className}

        >

            {normalizedStatus}

        </Badge>

    );

}