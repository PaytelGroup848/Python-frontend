"use client";

import { Card } from "@/components/ui/card";

import { Dataset } from "../types/dataset";

interface Props {

    dataset: Dataset;

}

export function DatasetStatistics({

    dataset,

}: Props) {

    return (

        <Card className="p-6">

            <h2
                className="
                    mb-5
                    text-xl
                    font-semibold
                "
            >
                Statistics
            </h2>

            <div
                className="
                    grid
                    grid-cols-3
                    gap-6
                "
            >

                <div>

                    <p className="text-gray-500">
                        Records
                    </p>

                    <h3 className="text-2xl">

                        {dataset.record_count}

                    </h3>

                </div>

                <div>

                    <p className="text-gray-500">
                        Snapshots
                    </p>

                    <h3 className="text-2xl">

                        {dataset.snapshot_count ?? 0}

                    </h3>

                </div>

                <div>

                    <p className="text-gray-500">
                        Training Jobs
                    </p>

                    <h3 className="text-2xl">

                        {dataset.training_job_count ?? 0}

                    </h3>

                </div>

            </div>

        </Card>

    );

}