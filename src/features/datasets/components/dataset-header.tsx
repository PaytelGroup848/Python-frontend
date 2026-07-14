"use client";

import { Button } from "@/components/ui/button";

import { DatasetStatusBadge } from "./dataset-status-badge";

import { Dataset } from "../types/dataset";

interface Props {

    dataset: Dataset;

    onEdit(): void;

}

export function DatasetHeader({

    dataset,

    onEdit,

}: Props) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
            "
        >

            <div>

                <h1
                    className="
                        text-3xl
                        font-bold
                    "
                >
                    {dataset.name}
                </h1>

                <div className="mt-2">

                    <DatasetStatusBadge
                        status={dataset.status}
                    />

                </div>

            </div>

            <Button
                onClick={onEdit}
            >
                Edit Dataset
            </Button>

        </div>

    );

}