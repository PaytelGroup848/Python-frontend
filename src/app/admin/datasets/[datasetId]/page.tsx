"use client";

import { useParams } from "next/navigation";

import { useDataset } from "@/features/datasets/hooks";

import {

    DatasetHeader,

    DatasetInformationCard,

    DatasetStatistics,

    DatasetQuickActions,

} from "@/features/datasets/components";

export default function DatasetDetailsPage() {

    const params = useParams();

    const datasetId = Number(
        params.datasetId
    );

    const {

        data: dataset,

        isLoading,

    } = useDataset(

        datasetId,

    );

    if (isLoading) {

        return (

            <div className="p-6">

                Loading...

            </div>

        );

    }

    if (!dataset) {

        return (

            <div className="p-6">

                Dataset not found.

            </div>

        );

    }

    return (

        <div
            className="
                space-y-6
                p-6
            "
        >

            <DatasetHeader

                dataset={dataset}

                onEdit={() => {

                    console.log(
                        "Edit",
                        dataset.id
                    );

                }}

            />

            <DatasetQuickActions

                datasetId={
                    dataset.id
                }

            />

            <DatasetInformationCard

                dataset={dataset}

            />

            <DatasetStatistics

                dataset={dataset}

            />

        </div>

    );

}