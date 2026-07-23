"use client";

import {
    Play,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface TrainingActionsProps {

    trainingJobId: number;

    status: string;

    dispatchPending?: boolean;

    deletePending?: boolean;

    onDispatch: (
        trainingJobId: number,
    ) => void;

    onDelete: (
        trainingJobId: number,
    ) => void;

}

export function TrainingActions({

    trainingJobId,

    status,

    dispatchPending = false,

    deletePending = false,

    onDispatch,

    onDelete,

}: TrainingActionsProps) {

    const canDispatch =

        status === "PENDING" ||

        status === "QUEUED";

    return (

        <div
            className="
                flex
                items-center
                gap-2
            "
        >

            <Button

                size="sm"

                disabled={

                    !canDispatch ||

                    dispatchPending

                }

                onClick={() =>

                    onDispatch(

                        trainingJobId,

                    )

                }

            >

                <Play className="mr-2 h-4 w-4" />

                Dispatch

            </Button>

            <Button

                size="sm"

                variant="destructive"

                disabled={

                    deletePending

                }

                onClick={() =>

                    onDelete(

                        trainingJobId,

                    )

                }

            >

                <Trash2 className="mr-2 h-4 w-4" />

                Delete

            </Button>

        </div>

    );

}