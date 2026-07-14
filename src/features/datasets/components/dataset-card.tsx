"use client";

import { Card } from "@/components/ui/card";

import { Dataset } from "../types/dataset";

import { DatasetStatusBadge } from "./dataset-status-badge";

interface Props {

    dataset: Dataset;

}

export function DatasetCard({

    dataset,

}: Props) {

    return (

        <Card className="p-5 space-y-4">

            <div className="flex justify-between">

                <h3 className="font-semibold">

                    {dataset.name}

                </h3>

                <DatasetStatusBadge
                    status={dataset.status}
                />

            </div>

            <div>

                Domain

                <br />

                {dataset.domain}

            </div>

            <div>

                Version

                <br />

                {dataset.version}

            </div>

            <div>

                Records

                <br />

                {dataset.record_count}

            </div>

        </Card>

    );

}