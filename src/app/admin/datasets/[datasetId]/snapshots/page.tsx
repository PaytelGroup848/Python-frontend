"use client";

import { useParams } from "next/navigation";

export default function DatasetSnapshotsPage() {

    const params = useParams();

    return (

        <div className="space-y-6 p-6">

            <h1 className="text-3xl font-bold">

                Dataset Snapshots

            </h1>

            <p>

                Dataset ID: {params.datasetId}

            </p>

        </div>

    );

}