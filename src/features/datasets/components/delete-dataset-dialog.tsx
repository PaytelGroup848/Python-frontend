"use client";

import { Button } from "@/components/ui/button";

interface Props {

    open: boolean;

    datasetName: string;

    onClose: () => void;

    onDelete: () => Promise<void>;

}

export function DeleteDatasetDialog({

    open,

    datasetName,

    onClose,

    onDelete,

}: Props) {

    if (!open) {

        return null;

    }

    return (

        <div
            className="
                fixed inset-0
                z-50
                flex items-center justify-center
                bg-black/50
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-xl
                    bg-white
                    p-6
                "
            >

                <h2
                    className="
                        text-xl
                        font-semibold
                    "
                >
                    Delete Dataset
                </h2>

                <p
                    className="
                        mt-4
                        text-gray-600
                    "
                >
                    Are you sure you want to delete
                    <strong> {datasetName} </strong>?
                </p>

                <p
                    className="
                        mt-2
                        text-sm
                        text-red-500
                    "
                >
                    This action cannot be undone.
                </p>

                <div
                    className="
                        mt-6
                        flex justify-end gap-3
                    "
                >

                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={async () => {

                            await onDelete();

                            onClose();

                        }}
                    >
                        Delete
                    </Button>

                </div>

            </div>

        </div>

    );

}