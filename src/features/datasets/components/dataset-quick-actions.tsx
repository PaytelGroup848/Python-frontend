"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface Props {

    datasetId: number;

}

export function DatasetQuickActions({

    datasetId,

}: Props) {

    const router = useRouter();

    return (

        <div
            className="
                grid
                gap-4
                md:grid-cols-2
                lg:grid-cols-4
            "
        >

            <Button
                onClick={() =>
                    router.push(
                        `/admin/datasets/${datasetId}/records`
                    )
                }
            >
                Upload Records
            </Button>

            <Button
                variant="outline"
                onClick={() =>
                    router.push(
                        `/admin/datasets/${datasetId}/snapshots`
                    )
                }
            >
                Create Snapshot
            </Button>

            <Button
                variant="outline"
                onClick={() =>
                    router.push(
                        `/admin/training?dataset=${datasetId}`
                    )
                }
            >
                Start Training
            </Button>

            <Button
                variant="outline"
                onClick={() =>
                    router.push(
                        `/admin/artifacts?dataset=${datasetId}`
                    )
                }
            >
                View Artifacts
            </Button>

        </div>

    );

}