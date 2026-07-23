"use client";

import {
    Eye,
    Play,
    Trash2,
    MoreHorizontal,
} from "lucide-react";

import {
    Button,
} from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    TrainingJob,
} from "../types/training";

import {
    TrainingStatusBadge,
} from "./training-status-badge";

interface TrainingTableProps {

    trainingJobs: TrainingJob[];

    onView: (
        trainingJobId: number,
    ) => void;

    onDispatch: (
        trainingJobId: number,
    ) => void;

    onDelete: (
        trainingJobId: number,
    ) => void;

}

export function TrainingTable({

    trainingJobs,

    onView,

    onDispatch,

    onDelete,

}: TrainingTableProps) {

    if (

        trainingJobs.length === 0

    ) {

        return (

            <div
                className="
                    rounded-lg
                    border
                    p-8
                    text-center
                    text-sm
                    text-muted-foreground
                "
            >

                No training jobs found.

            </div>

        );

    }

    return (

    <div
        className="
            rounded-lg
            border
        "
    >

        <Table>

            <TableHeader>

                <TableRow>

                    <TableHead>ID</TableHead>

                    <TableHead>Dataset</TableHead>

                    <TableHead>Snapshot</TableHead>

                    <TableHead>Base Model</TableHead>

                    <TableHead>Type</TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead>Epoch</TableHead>

                    <TableHead>Samples</TableHead>

                    <TableHead>Created</TableHead>

                    <TableHead className="w-80px">

                        Actions

                    </TableHead>

                </TableRow>

            </TableHeader>

            <TableBody>

                {trainingJobs.map(

                    (trainingJob) => (

                        <TableRow
                            key={trainingJob.id}
                        >

                            <TableCell>

                                {trainingJob.id}

                            </TableCell>

                            <TableCell>

                                {trainingJob.dataset_id}

                            </TableCell>

                            <TableCell>

                                {trainingJob.dataset_snapshot_id ?? "-"}

                            </TableCell>

                            <TableCell>

                                {trainingJob.base_model_id}

                            </TableCell>

                            <TableCell>

                                {trainingJob.training_type}

                            </TableCell>

                            <TableCell>

                                <TrainingStatusBadge

                                    status={trainingJob.status}

                                />

                            </TableCell>

                            <TableCell>

                                {trainingJob.current_epoch}

                            </TableCell>

                            <TableCell>

                                {trainingJob.processed_samples}

                            </TableCell>

                            <TableCell>

                                {new Date(

                                    trainingJob.created_at,

                                ).toLocaleString()}

                            </TableCell>

                            <TableCell>

                                <DropdownMenu>

                                    <DropdownMenuTrigger
                                        asChild
                                    >

                                        <Button

                                            variant="ghost"

                                            size="icon"

                                        >

                                            <MoreHorizontal className="h-4 w-4" />

                                        </Button>

                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                    >

                                        <DropdownMenuItem

                                            onClick={() =>

                                                onView(

                                                    trainingJob.id,

                                                )

                                            }

                                        >

                                            <Eye className="mr-2 h-4 w-4" />

                                            View

                                        </DropdownMenuItem>

                                        <DropdownMenuItem

                                            onClick={() =>

                                                onDispatch(

                                                    trainingJob.id,

                                                )

                                            }

                                        >

                                            <Play className="mr-2 h-4 w-4" />

                                            Dispatch

                                        </DropdownMenuItem>

                                        <DropdownMenuItem

                                            className="text-destructive"

                                            onClick={() =>

                                                onDelete(

                                                    trainingJob.id,

                                                )

                                            }

                                        >

                                            <Trash2 className="mr-2 h-4 w-4" />

                                            Delete

                                        </DropdownMenuItem>

                                    </DropdownMenuContent>

                                </DropdownMenu>

                            </TableCell>

                        </TableRow>

                    ),

                )}

            </TableBody>

        </Table>

    </div>

);


}