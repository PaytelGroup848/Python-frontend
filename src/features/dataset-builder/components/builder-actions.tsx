"use client";

import { Button } from "@/components/ui/button";

interface Props {

    canBuild: boolean;

    isBuilding: boolean;

    onRefresh(): void;

    onBuild(): void;

}

export function BuilderActions({

    canBuild,

    isBuilding,

    onRefresh,

    onBuild,

}: Props) {

    return (

        <div
            className="
                flex
                flex-col
                gap-4
                rounded-xl
                border
                p-6
                md:flex-row
                md:items-center
                md:justify-between
            "
        >

            <div>

                <h2
                    className="
                        text-xl
                        font-semibold
                    "
                >

                    Builder Actions

                </h2>

                <p
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >

                    Validate the dataset and build a training-ready artifact.

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

                    onClick={onRefresh}

                    disabled={isBuilding}

                >

                    Refresh

                </Button>

                <Button

                    onClick={onBuild}

                    disabled={

                        !canBuild ||

                        isBuilding

                    }

                >

                    {

                        isBuilding

                            ? "Building..."

                            : "Build Dataset"

                    }

                </Button>

            </div>

        </div>

    );

}