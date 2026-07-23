"use client";

import { Button } from "@/components/ui/button";

interface Props {

    datasetName: string;

    datasetVersion: string;

    buildStatus: string;

    onBack(): void;

    onBuild(): void;

}

export function BuilderHeader({

    datasetName,

    datasetVersion,

    buildStatus,

    onBack,

    onBuild,

}: Props) {

    return (

        <div
            className="
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-center
                md:justify-between
            "
        >

            <div>

                <h1
                    className="
                        text-3xl
                        font-bold
                    "
                >

                    Dataset Builder

                </h1>

                <p
                    className="
                        mt-1
                        text-sm
                        text-muted-foreground
                    "
                >

                    {datasetName}

                    {" • "}

                    Version {datasetVersion}

                </p>

                <p
                    className="
                        mt-1
                        text-sm
                        text-muted-foreground
                    "
                >

                    Build Status: {buildStatus}

                </p>

            </div>

            <div
                className="
                    flex
                    gap-2
                "
            >

                <Button

                    variant="outline"

                    onClick={onBack}

                >

                    Back

                </Button>

                <Button

                    onClick={onBuild}

                >

                    Build Dataset

                </Button>

            </div>

        </div>

    );

}