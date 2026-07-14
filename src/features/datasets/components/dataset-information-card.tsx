"use client";

import { Card } from "@/components/ui/card";

import { Dataset } from "../types/dataset";

interface Props {

    dataset: Dataset;

}

export function DatasetInformationCard({

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
                Dataset Information
            </h2>

            <div className="grid grid-cols-2 gap-5">

                <div>

                    <p className="text-gray-500">
                        Domain
                    </p>

                    <p>
                        {dataset.domain}
                    </p>

                </div>

                <div>

                    <p className="text-gray-500">
                        Version
                    </p>

                    <p>
                        {dataset.version}
                    </p>

                </div>

                <div>

                    <p className="text-gray-500">
                        Source
                    </p>

                    <p>
                        {dataset.source ?? "-"}
                    </p>

                </div>

                <div>

                    <p className="text-gray-500">
                        Records
                    </p>

                    <p>
                        {dataset.record_count}
                    </p>

                </div>

            </div>

        </Card>

    );

}