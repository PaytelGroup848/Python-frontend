"use client";

import { useParams } from "next/navigation";

export default function DatasetBuilderPage() {

    const params = useParams();

    const datasetId = Number(
        params.datasetId,
    );

    return (

        <div className="space-y-6 p-6">

            <h1 className="text-3xl font-bold">

                Dataset Builder

            </h1>

            <p>

                Dataset ID: {datasetId}

            </p>

        </div>

    );

}