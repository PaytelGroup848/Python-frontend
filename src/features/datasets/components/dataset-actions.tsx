"use client";

import { Button } from "@/components/ui/button";

interface Props {

    datasetId: number;

    onView: (
        datasetId: number,
    ) => void;

    onEdit: (
        datasetId: number,
    ) => void;

    onUpload: (
        datasetId: number,
    ) => void;

    onSnapshot: (
        datasetId: number,
    ) => void;

    onDelete: (
        datasetId: number,
    ) => void;

}

export function DatasetActions({

    datasetId,

    onView,

    onEdit,

    onUpload,

    onSnapshot,

    onDelete,

}: Props) {

    return (

        <div
            className="
                flex
                flex-wrap
                gap-2
            "
        >

            <Button
                size="sm"
                onClick={() =>
                    onView(
                        datasetId
                    )
                }
            >
                View
            </Button>

            <Button
                size="sm"
                variant="outline"
                onClick={() =>
                    onEdit(
                        datasetId
                    )
                }
            >
                Edit
            </Button>

            <Button
                size="sm"
                variant="outline"
                onClick={() =>
                    onUpload(
                        datasetId
                    )
                }
            >
                Upload
            </Button>

            <Button
                size="sm"
                variant="outline"
                onClick={() =>
                    onSnapshot(
                        datasetId
                    )
                }
            >
                Snapshot
            </Button>

            <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                    onDelete(
                        datasetId
                    )
                }
            >
                Delete
            </Button>

        </div>

    );

}